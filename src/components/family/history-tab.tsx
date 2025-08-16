import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLingui, Plural } from '@lingui/react/macro';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHistory,
    faSearch,
    faStore,
    faShoppingCart,
    faDollarSign,
    faLightbulb,
    faBox,
    faHashtag,
    faBarcode,
    faWeightHanging,
    faTrash,
    faPlusCircle,
    faSave,
    faPencil,
    faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, Timestamp, getDoc, writeBatch, doc } from "firebase/firestore";
import { Collections } from "@/lib/enums";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { toast } from "@/hooks/use-toast";
import { updatePurchaseItems } from "../../routes/dashboard/family/actions";
import { trackEvent } from "@/services/analytics-service";

interface PurchaseItem {
    id: string;
    productRef: any;
    barcode?: string;
    name?: string;
    volume?: string;
    quantity: number;
    price: number;
    unitPrice?: number;
}
interface Purchase {
    id: string;
    storeName: string;
    date: Timestamp;
    totalAmount: number;
    items: PurchaseItem[];
}

export function HistoryTab() {
    const { t } = useLingui();
    const { profile } = useAuth();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStore, setSelectedStore] = useState("all");
    const [selectedPeriod, setSelectedPeriod] = useState("all");

    useEffect(() => {
        async function fetchPurchases() {
            if (!profile?.familyId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const purchasesRef = collection(db, Collections.Families, profile.familyId, "purchases");
                const q = query(purchasesRef, orderBy("date", "desc"));
                const querySnapshot = await getDocs(q);

                const allPurchases = await Promise.all(
                    querySnapshot.docs.map(async (purchaseDoc) => {
                        const purchaseData = purchaseDoc.data();
                        const itemsRef = collection(
                            db,
                            Collections.Families,
                            profile.familyId!,
                            "purchases",
                            purchaseDoc.id,
                            "purchase_items"
                        );
                        const itemsSnap = await getDocs(itemsRef);
                        const items = await Promise.all(
                            itemsSnap.docs.map(async (itemDoc) => {
                                const itemData = itemDoc.data();
                                if (itemData.productRef) {
                                    const productSnap = await getDoc(itemData.productRef);
                                    if (productSnap.exists()) {
                                        const productData = productSnap.data() as any;
                                        itemData.name = productData.name;
                                        itemData.barcode = productData.barcode;
                                        itemData.volume = productData.volume;
                                    }
                                }
                                return {
                                    ...itemData,
                                    id: itemDoc.id,
                                    unitPrice: itemData.price, // Assuming 'price' from DB is unit price
                                    price: itemData.totalPrice,
                                } as PurchaseItem;
                            })
                        );

                        return {
                            id: purchaseDoc.id,
                            storeName: purchaseData.storeName,
                            date: purchaseData.date,
                            totalAmount: purchaseData.totalAmount,
                            items,
                        } as Purchase;
                    })
                );

                setPurchases(allPurchases);
            } catch (error) {
                console.error("Error fetching purchase history: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPurchases();
    }, [profile]);

    const handleDeletePurchase = async (purchaseId: string) => {
        if (!profile?.familyId) {
            toast({
                variant: "destructive",
                title: t`Erro`,
                description: t`Você precisa estar logado para realizar esta ação.`,
            });
            return;
        }

        try {
            const purchaseRef = doc(db, Collections.Families, profile.familyId, "purchases", purchaseId);
            const itemsRef = collection(db, purchaseRef.path, "purchase_items");

            const batch = writeBatch(db);

            // Delete all items in the subcollection
            const itemsSnapshot = await getDocs(itemsRef);
            itemsSnapshot.forEach((itemDoc) => {
                batch.delete(doc(itemsRef, itemDoc.id));
            });

            // Delete the purchase document itself
            batch.delete(purchaseRef);

            await batch.commit();

            setPurchases((prev) => prev.filter((p) => p.id !== purchaseId));

            toast({
                title: t`Sucesso!`,
                description: t`Purchase deleted successfully.`,
            });
            trackEvent("purchase_deleted", { purchaseId });
        } catch (error) {
            console.error("Error deleting purchase:", error);
            toast({
                variant: "destructive",
                title: t`Erro`,
                description: t`An error occurred while deleting the purchase. Please try again.`,
            });
        }
    };

    const filteredPurchases = useMemo(
        () =>
            purchases.filter((purchase) => {
                const lowerSearchTerm = searchTerm.toLowerCase();
                const matchesSearch =
                    lowerSearchTerm === "" ||
                    purchase.storeName.toLowerCase().includes(lowerSearchTerm) ||
                    purchase.items.some((item) => item.name?.toLowerCase().includes(lowerSearchTerm));

                const matchesStore = selectedStore === "all" || purchase.storeName === selectedStore;

                const now = new Date();
                const purchaseDate = purchase.date.toDate();

                const matchesPeriod =
                    selectedPeriod === "all" ||
                    (selectedPeriod === "last_month" &&
                        purchaseDate > new Date(new Date().setMonth(now.getMonth() - 1))) ||
                    (selectedPeriod === "last_3_months" &&
                        purchaseDate > new Date(new Date().setMonth(now.getMonth() - 3))) ||
                    (selectedPeriod === "last_6_months" &&
                        purchaseDate > new Date(new Date().setMonth(now.getMonth() - 6))) ||
                    (selectedPeriod === "last_year" &&
                        purchaseDate > new Date(new Date().setFullYear(now.getFullYear() - 1)));

                return matchesSearch && matchesStore && matchesPeriod;
            }),
        [purchases, searchTerm, selectedStore, selectedPeriod]
    );

    const availableStores = useMemo(() => {
        const storeSet = new Set(purchases.map((p) => p.storeName));
        return Array.from(storeSet);
    }, [purchases]);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faHistory} className="w-6 h-6" /> {t`Histórico de Compras`}
                    </CardTitle>
                    <CardDescription>{t`Visualize e filtre todas as suas compras passadas.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            />
                            <Input
                                placeholder={t`Buscar por loja ou produto...`}
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedStore} onValueChange={setSelectedStore}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder={t`Filtrar por loja`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t`Todas as lojas`}</SelectItem>
                                {availableStores.map((store) => (
                                    <SelectItem key={store} value={store}>
                                        {store}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder={t`Filtrar por período`} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t`Todos os períodos`}</SelectItem>
                                <SelectItem value="last_month">{t`Último mês`}</SelectItem>
                                <SelectItem value="last_3_months">{t`Últimos 3 meses`}</SelectItem>
                                <SelectItem value="last_6_months">{t`Últimos 6 meses`}</SelectItem>
                                <SelectItem value="last_year">{t`Último ano`}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-3/4" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-5 w-1/2" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredPurchases.length > 0 ? (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredPurchases.map((purchase) => (
                                        <PurchaseCard
                                            key={purchase.id}
                                            purchase={purchase}
                                            onDelete={handleDeletePurchase}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    title={t`Nenhuma Compra Encontrada`}
                                    description={t`Tente ajustar seus filtros ou adicione uma nova compra para começar.`}
                                />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-primary" />{" "}
                        {t`Recomendações e Insights`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        icon={faLightbulb}
                        title={t`Ainda Sem Recomendações`}
                        description={t`Conforme você adiciona mais compras, nossa IA irá gerar recomendações personalizadas para você aqui.`}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

function PurchaseCard({ purchase, onDelete }: { purchase: Purchase; onDelete: (id: string) => void }) {
    const { t } = useLingui();
    const { profile } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [items, setItems] = useState<PurchaseItem[]>(purchase.items);
    const [isSaving, setIsSaving] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    const originalItemsJson = useMemo(() => JSON.stringify(purchase.items), [purchase.items]);
    const isDirty = useMemo(() => JSON.stringify(items) !== originalItemsJson, [items, originalItemsJson]);

    useEffect(() => {
        if (isDialogOpen) {
            setItems(purchase.items);
        } else {
            setEditingItemId(null);
        }
    }, [isDialogOpen, purchase.items]);

    const handleItemChange = (index: number, field: keyof PurchaseItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[index], [field]: value };

        if ((field === "quantity" || field === "unitPrice") && item.unitPrice !== undefined) {
            item.price = item.quantity * item.unitPrice;
        }

        newItems[index] = item;
        setItems(newItems);
    };

    const handleAddItem = () => {
        const newItemId = `new-${Date.now()}`;
        const newItem: PurchaseItem = {
            id: newItemId,
            productRef: null,
            name: "",
            quantity: 1,
            price: 0,
            unitPrice: 0,
            volume: "un",
        };
        setItems([...items, newItem]);
        setEditingItemId(newItemId); // Immediately enter edit mode for the new item
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleSaveChanges = async () => {
        if (!profile?.familyId) return;
        setIsSaving(true);
        try {
            await updatePurchaseItems(profile.familyId, purchase.id, items);
            toast({
                title: t`Sucesso!`,
                description: t`Purchase updated successfully.`,
            });
            trackEvent("purchase_items_updated", {
                purchaseId: purchase.id,
                itemCount: items.length,
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error updating purchase:", error);
            toast({
                variant: "destructive",
                title: t`Erro`,
                description: t`An error occurred while updating the purchase. Please try again.`,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const totalAmount = useMemo(() => {
        return items.reduce((acc, item) => acc + (item.price || 0), 0);
    }, [items]);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                        <CardTitle className="text-lg truncate flex items-center gap-2">
                            <FontAwesomeIcon icon={faStore} className="w-4 h-4 text-primary" /> {purchase.storeName}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />{" "}
                            {purchase.date
                                .toDate()
                                .toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4" />
                            <Plural value={purchase.items.length} one="# item" other="# items" />
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                            <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-primary" />
                            <span>{purchase.totalAmount.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{t`Detalhes da Compra: \${storeName}`}</DialogTitle>
                    <DialogDescription>
                        {purchase.date.toDate().toLocaleString("pt-BR", { dateStyle: "full", timeStyle: "short" })}
                        <span className="font-bold ml-4">Total: R$ {totalAmount.toFixed(2)}</span>
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>
                                    <FontAwesomeIcon icon={faBox} className="inline-block mr-1 w-4 h-4" />{" "}
                                    {t`Produto`}
                                </TableHead>
                                <TableHead className="w-[120px]">
                                    <FontAwesomeIcon icon={faWeightHanging} className="inline-block mr-1 w-4 h-4" />{" "}
                                    {t`Volume`}
                                </TableHead>
                                <TableHead className="text-center w-[100px]">
                                    <FontAwesomeIcon icon={faHashtag} className="inline-block mr-1 w-4 h-4" />{" "}
                                    {t`Quantidade`}
                                </TableHead>
                                <TableHead className="text-center w-[120px]">{t`Preço Unit.`}</TableHead>
                                <TableHead className="text-right w-[120px]">{t`Preço Total`}</TableHead>
                                <TableHead className="w-[100px] text-right">{t`Ações`}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Input
                                            value={item.name}
                                            onChange={(e) => handleItemChange(index, "name", e.target.value)}
                                            placeholder={t`Nome do item`}
                                            disabled={editingItemId !== item.id}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            value={item.volume}
                                            onChange={(e) => handleItemChange(index, "volume", e.target.value)}
                                            placeholder="ex: 1kg, 500ml"
                                            disabled={editingItemId !== item.id}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleItemChange(index, "quantity", parseFloat(e.target.value) || 0)
                                            }
                                            className="text-center"
                                            disabled={editingItemId !== item.id}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={item.unitPrice}
                                            onChange={(e) =>
                                                handleItemChange(index, "unitPrice", parseFloat(e.target.value) || 0)
                                            }
                                            className="text-center"
                                            disabled={editingItemId !== item.id}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        R$ {(item.price || 0).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-1">
                                            {editingItemId === item.id ? (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingItemId(null)}
                                                >
                                                    <FontAwesomeIcon icon={faCheck} className="h-4 w-4 text-primary" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setEditingItemId(item.id)}
                                                >
                                                    <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleRemoveItem(index)}
                                                disabled={editingItemId === item.id}
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button variant="outline" className="mt-4" onClick={handleAddItem} disabled={!!editingItemId}>
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                        {t`Adicionar Item`}
                    </Button>
                </div>
                <DialogFooter className="pt-4 border-t flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive-outline">
                                    <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
                                    {t`Delete Purchase`}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t`Delete Purchase?`}</AlertDialogTitle>
                                    <AlertDialogDescription>{t`This will permanently delete the purchase and its items. This action can't be undone.`}</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            onDelete(purchase.id);
                                            setIsDialogOpen(false);
                                        }}
                                    >
                                        {t`Yes, delete`}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:gap-4">
                        <Button onClick={handleSaveChanges} disabled={isSaving || !isDirty || !!editingItemId}>
                            <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" />
                            {isSaving ? t`Salvando...` : t`Salvar Alterações`}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
