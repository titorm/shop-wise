import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faStore, faTrash, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

const marketSchema = z.object({
    name: z.string().min(2, "market_form_error_name_min"),
    type: z.enum(["supermercado", "atacado", "feira", "acougue", "padaria", "marketplace", "farmacia", "outro"]),
    cnpj: z.string().optional(),
    address: z.string().optional(),
});

type MarketData = z.infer<typeof marketSchema>;

// Mock data, in a real app this would come from Firestore
const allStores: (MarketData & { id: string })[] = [
    {
        id: "store1",
        name: "Supermercado Principal",
        type: "supermercado",
        cnpj: "12.345.678/0001-99",
        address: "Rua Principal, 123",
    },
    {
        id: "store2",
        name: "Atacarejo Preço Baixo",
        type: "atacado",
        cnpj: "98.765.432/0001-11",
        address: "Avenida Central, 456",
    },
    { id: "store3", name: "Feira de Sábado", type: "feira", cnpj: "", address: "Praça da Cidade" },
    { id: "store4", name: "Mercadinho da Esquina", type: "supermercado", cnpj: "", address: "Rua do Bairro, 789" },
];

export function MarketsForm() {
    const { profile } = useAuth();
    const { toast } = useToast();
    const { t } = useTranslation();

    // In a real app, these would be populated from the family document in Firestore
    const [favoriteStores, setFavoriteStores] = useState([allStores[0], allStores[1]]);
    const [ignoredStores, setIgnoredStores] = useState([allStores[3]]);

    const marketTypes = ["supermercado", "atacado", "feira", "acougue", "padaria", "marketplace", "farmacia", "outro"];

    const form = useForm<MarketData>({
        resolver: zodResolver(marketSchema),
        defaultValues: {
            name: "",
            type: "supermercado",
            cnpj: "",
            address: "",
        },
    });

    const handleAddMarket = (values: MarketData) => {
        // In a real app, this would save to the global 'stores' collection
        // and then add the new store's ID to the family's 'favoriteStores' array.
        const newStore = { ...values, id: `store${Date.now()}` };
        allStores.push(newStore); // Mock adding to global list
        setFavoriteStores([...favoriteStores, newStore]);
        form.reset();
        toast({
            title: t("market_form_toast_added_title"),
            description: t("market_form_toast_added_desc", { marketName: values.name }),
        });
    };

    const moveToIgnored = (store: MarketData & { id: string }) => {
        setFavoriteStores(favoriteStores.filter((s) => s.id !== store.id));
        setIgnoredStores([...ignoredStores, store]);
        toast({
            title: t("market_form_toast_moved_ignored_title"),
            description: t("market_form_toast_moved_ignored_desc", { marketName: store.name }),
        });
    };

    const moveToFavorites = (store: MarketData & { id: string }) => {
        setIgnoredStores(ignoredStores.filter((s) => s.id !== store.id));
        setFavoriteStores([...favoriteStores, store]);
        toast({
            title: t("market_form_toast_moved_favorites_title"),
            description: t("market_form_toast_moved_favorites_desc", { marketName: store.name }),
        });
    };

    const removeFromFamily = (storeId: string, list: "favorite" | "ignored") => {
        if (list === "favorite") {
            setFavoriteStores(favoriteStores.filter((s) => s.id !== storeId));
        } else {
            setIgnoredStores(ignoredStores.filter((s) => s.id !== storeId));
        }
        toast({ title: t("market_form_toast_removed_title"), description: t("market_form_toast_removed_desc") });
    };

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddMarket)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("market_form_add_new_title")}</CardTitle>
                            <CardDescription>{t("market_form_add_new_desc")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("market_form_name_label")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t("market_form_name_placeholder")} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cnpj"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("market_form_cnpj_label")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="00.000.000/0001-00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2">
                                            <FormLabel>{t("market_form_address_label")}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t("market_form_address_placeholder")} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem className="col-span-1 md:col-span-2 space-y-3">
                                            <FormLabel>{t("market_form_type_label")}</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-wrap gap-2"
                                                >
                                                    {marketTypes.map((type) => (
                                                        <FormItem
                                                            key={type}
                                                            className="flex items-center space-x-2 space-y-0"
                                                        >
                                                            <FormControl>
                                                                <RadioGroupItem
                                                                    value={type}
                                                                    id={`type-${type}`}
                                                                    className="sr-only"
                                                                />
                                                            </FormControl>
                                                            <Label
                                                                htmlFor={`type-${type}`}
                                                                className={cn(
                                                                    "rounded-full border px-3 py-1 text-sm font-medium transition-colors cursor-pointer",
                                                                    "hover:bg-muted/50",
                                                                    field.value === type &&
                                                                        "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                                                                )}
                                                            >
                                                                {t(`market_type_${type}`)}
                                                            </Label>
                                                        </FormItem>
                                                    ))}
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">
                                <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-4 w-4" />
                                {t("market_form_add_to_favorites_button")}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>

            <Separator />

            <MarketList
                title={t("market_form_favorites_title")}
                description={t("market_form_favorites_desc")}
                icon={faThumbsUp}
                stores={favoriteStores}
                onAction={moveToIgnored}
                onRemove={removeFromFamily}
                actionIcon={faThumbsDown}
                actionTooltip={t("market_form_tooltip_move_to_ignored")}
                listType="favorite"
            />

            <MarketList
                title={t("market_form_ignored_title")}
                description={t("market_form_ignored_desc")}
                icon={faThumbsDown}
                stores={ignoredStores}
                onAction={moveToFavorites}
                onRemove={removeFromFamily}
                actionIcon={faThumbsUp}
                actionTooltip={t("market_form_tooltip_move_to_favorites")}
                listType="ignored"
            />
        </div>
    );
}

interface MarketListProps {
    title: string;
    description: string;
    icon: any;
    stores: (MarketData & { id: string })[];
    onAction: (store: MarketData & { id: string }) => void;
    onRemove: (storeId: string, list: "favorite" | "ignored") => void;
    actionIcon: any;
    actionTooltip: string;
    listType: "favorite" | "ignored";
}

function MarketList({
    title,
    description,
    icon,
    stores,
    onAction,
    onRemove,
    actionIcon,
    actionTooltip,
    listType,
}: MarketListProps) {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FontAwesomeIcon icon={icon} className="w-5 h-5" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <FontAwesomeIcon icon={faStore} className="mr-2 h-4 w-4" />{" "}
                                    {t("market_table_header_name")}
                                </TableHead>
                                <TableHead>{t("market_table_header_type")}</TableHead>
                                <TableHead>{t("market_table_header_address")}</TableHead>
                                <TableHead className="w-[120px] text-right">
                                    {t("market_table_header_actions")}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stores.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        {t("market_table_empty_list")}
                                    </TableCell>
                                </TableRow>
                            )}
                            {stores.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell className="font-medium">{store.name}</TableCell>
                                    <TableCell>{t(`market_type_${store.type}`)}</TableCell>
                                    <TableCell>{store.address}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title={actionTooltip}
                                                onClick={() => onAction(store)}
                                            >
                                                <FontAwesomeIcon icon={actionIcon} className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title={t("market_form_tooltip_remove_from_family")}
                                                onClick={() => onRemove(store.id, listType)}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
