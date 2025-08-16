import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faStore, faTrash, faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { useLingui } from '@lingui/react/macro';

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
    const { t } = useLingui();

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
            title: t`Estabelecimento Adicionado`,
            description: t`\${name} foi adicionado aos seus favoritos.`,
        });
    };

    const moveToIgnored = (store: MarketData & { id: string }) => {
        setFavoriteStores(favoriteStores.filter((s) => s.id !== store.id));
        setIgnoredStores([...ignoredStores, store]);
        toast({
            title: t`Movido para Ignorados`,
            description: t`\${name} agora será ignorado nas comparações de preços.`,
        });
    };

    const moveToFavorites = (store: MarketData & { id: string }) => {
        setIgnoredStores(ignoredStores.filter((s) => s.id !== store.id));
        setFavoriteStores([...favoriteStores, store]);
        toast({
            title: t`Movido para Favoritos`,
            description: t`\${name} agora é um estabelecimento favorito.`,
        });
    };

    const removeFromFamily = (storeId: string, list: "favorite" | "ignored") => {
        if (list === "favorite") {
            setFavoriteStores(favoriteStores.filter((s) => s.id !== storeId));
        } else {
            setIgnoredStores(ignoredStores.filter((s) => s.id !== storeId));
        }
        toast({ title: t`Estabelecimento Removido`, description: t`O estabelecimento foi removido de suas listas.` });
    };

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddMarket)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t`Adicionar Novo Estabelecimento`}</CardTitle>
                            <CardDescription>{t`Adicione um novo mercado, atacado ou feira à sua lista de locais preferidos.`}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t`Nome do Estabelecimento`}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t`ex: Supermercado Central`} {...field} />
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
                                            <FormLabel>{t`CNPJ (Opcional)`}</FormLabel>
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
                                            <FormLabel>{t`Endereço (Opcional)`}</FormLabel>
                                            <FormControl>
                                                <Input placeholder={t`ex: Rua das Flores, 123, São Paulo`} {...field} />
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
                                            <FormLabel>{t`Tipo de Estabelecimento`}</FormLabel>
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
                                {t`Adicionar aos Favoritos`}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>

            <Separator />

            <MarketList
                title={t`Estabelecimentos Favoritos`}
                description={t`Estas são as lojas onde você compra com mais frequência. Nós as usaremos para gerar insights personalizados.`}
                icon={faThumbsUp}
                stores={favoriteStores}
                onAction={moveToIgnored}
                onRemove={removeFromFamily}
                actionIcon={faThumbsDown}
                actionTooltip={t`Mover para ignorados`}
                listType="favorite"
            />

            <MarketList
                title={t`Estabelecimentos Ignorados`}
                description={t`Não usaremos dados dessas lojas para gerar insights de comparação de preços.`}
                icon={faThumbsDown}
                stores={ignoredStores}
                onAction={moveToFavorites}
                onRemove={removeFromFamily}
                actionIcon={faThumbsUp}
                actionTooltip={t`Mover para favoritos`}
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
    const { t } = useLingui();
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
                                    {t`Nome`}
                                </TableHead>
                                <TableHead>{t`Tipo`}</TableHead>
                                <TableHead>{t`Endereço`}</TableHead>
                                <TableHead className="w-[120px] text-right">
                                    {t`Ações`}
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stores.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">
                                        {t`Esta lista está vazia.`}
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
                                                title={t`Remover das minhas listas`}
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
