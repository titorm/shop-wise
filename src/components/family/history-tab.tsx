
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faSearch, faStore, faShoppingCart, faDollarSign, faLightbulb, faBox, faHashtag, faBarcode, faWeightHanging, faTrash, faPlusCircle, faSave } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, getDoc, writeBatch, doc } from 'firebase/firestore';
import { Collections } from '@/lib/enums';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from '@/hooks/use-toast';
import { updatePurchaseItems } from './actions';

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
    const { t } = useTranslation();
    const { profile } = useAuth();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    useEffect(() => {
        async function fetchPurchases() {
            if (!profile?.familyId) {
                setLoading(false);
                return;
            };

            setLoading(true);
            try {
                const purchasesRef = collection(db, Collections.Families, profile.familyId, "purchases");
                const q = query(purchasesRef, orderBy("date", "desc"));
                const querySnapshot = await getDocs(q);
                
                const allPurchases = await Promise.all(querySnapshot.docs.map(async (purchaseDoc) => {
                    const purchaseData = purchaseDoc.data();
                    const itemsRef = collection(db, Collections.Families, profile.familyId!, "purchases", purchaseDoc.id, "purchase_items");
                    const itemsSnap = await getDocs(itemsRef);
                    const items = await Promise.all(itemsSnap.docs.map(async (itemDoc) => {
                        const itemData = itemDoc.data();
                         if (itemData.productRef) {
                            const productSnap = await getDoc(itemData.productRef);
                            if (productSnap.exists()) {
                                const productData = productSnap.data();
                                itemData.name = productData.name;
                                itemData.barcode = productData.barcode;
                                itemData.volume = productData.volume;
                            }
                        }
                        return {
                            ...itemData, 
                            id: itemDoc.id, 
                            unitPrice: itemData.price, // Assuming 'price' from DB is unit price
                        } as PurchaseItem;
                    }));

                    return {
                        id: purchaseDoc.id,
                        storeName: purchaseData.storeName,
                        date: purchaseData.date,
                        totalAmount: purchaseData.totalAmount,
                        items,
                    } as Purchase;
                }));

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
                variant: 'destructive',
                title: t('toast_error_title'),
                description: t('error_not_logged_in'),
            });
            return;
        }

        try {
            const purchaseRef = doc(db, Collections.Families, profile.familyId, 'purchases', purchaseId);
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

            setPurchases((prev) => prev.filter(p => p.id !== purchaseId));
            
            toast({
                title: t('toast_success_title'),
                description: t('purchase_deleted_successfully'),
            });

        } catch (error) {
            console.error("Error deleting purchase:", error);
            toast({
                variant: 'destructive',
                title: t('toast_error_title'),
                description: t('error_deleting_purchase'),
            });
        }
    };


    const filteredPurchases = useMemo(() => purchases.filter(purchase => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = lowerSearchTerm === '' ||
            purchase.storeName.toLowerCase().includes(lowerSearchTerm) ||
            purchase.items.some(item => item.name?.toLowerCase().includes(lowerSearchTerm));

        const matchesStore = selectedStore === 'all' || purchase.storeName === selectedStore;
        
        const now = new Date();
        const purchaseDate = purchase.date.toDate();
        
        const matchesPeriod = selectedPeriod === 'all' ||
            (selectedPeriod === 'last_month' && purchaseDate > new Date(new Date().setMonth(now.getMonth() - 1))) ||
            (selectedPeriod === 'last_3_months' && purchaseDate > new Date(new Date().setMonth(now.getMonth() - 3))) ||
            (selectedPeriod === 'last_6_months' && purchaseDate > new Date(new Date().setMonth(now.getMonth() - 6))) ||
            (selectedPeriod === 'last_year' && purchaseDate > new Date(new Date().setFullYear(now.getFullYear() - 1)));

        return matchesSearch && matchesStore && matchesPeriod;
    }), [purchases, searchTerm, selectedStore, selectedPeriod]);

    const availableStores = useMemo(() => {
        const storeSet = new Set(purchases.map(p => p.storeName));
        return Array.from(storeSet);
    }, [purchases]);

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2"><FontAwesomeIcon icon={faHistory} className="w-6 h-6"/> {t('purchase_history_title')}</CardTitle>
                    <CardDescription>{t('purchase_history_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder={t('search_by_store_or_product')}
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedStore} onValueChange={setSelectedStore}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder={t('filter_by_store')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('all_stores')}</SelectItem>
                                {availableStores.map(store => (
                                    <SelectItem key={store} value={store}>{store}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                             <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder={t('filter_by_period')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('all_periods')}</SelectItem>
                                <SelectItem value="last_month">{t('last_month')}</SelectItem>
                                <SelectItem value="last_3_months">{t('last_3_months')}</SelectItem>
                                <SelectItem value="last_6_months">{t('last_6_months')}</SelectItem>
                                <SelectItem value="last_year">{t('last_year')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    {loading ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                    <CardContent><Skeleton className="h-5 w-1/2" /></CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredPurchases.length > 0 ? (
                                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {filteredPurchases.map(purchase => (
                                        <PurchaseCard key={purchase.id} purchase={purchase} onDelete={handleDeletePurchase} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState 
                                    title={t('empty_state_no_history_title')}
                                    description={t('empty_state_no_history_desc')}
                                />
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline flex items-center gap-2"><FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-primary"/> {t('recommendations_title')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmptyState
                        icon={faLightbulb}
                        title={t('empty_state_no_recommendations_title')}
                        description={t('empty_state_no_recommendations_desc')}
                    />
                </CardContent>
             </Card>

        </div>
    );
}


function PurchaseCard({ purchase, onDelete }: { purchase: Purchase; onDelete: (id: string) => void }) {
    const { t } = useTranslation();
    const { profile } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [items, setItems] = useState<PurchaseItem[]>(purchase.items);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        setItems(purchase.items);
    }, [purchase.items]);
    
    const handleItemChange = (index: number, field: keyof PurchaseItem, value: any) => {
        const newItems = [...items];
        const item = { ...newItems[index], [field]: value };
        
        // Recalculate total price if quantity or unitPrice changes
        if ((field === 'quantity' || field === 'unitPrice') && item.unitPrice !== undefined) {
             item.price = item.quantity * item.unitPrice;
        }

        newItems[index] = item;
        setItems(newItems);
    };

    const handleAddItem = () => {
        const newItem: PurchaseItem = {
            id: `new-${Date.now()}`,
            productRef: null,
            name: '',
            quantity: 1,
            price: 0,
            unitPrice: 0,
            volume: 'un',
        };
        setItems([...items, newItem]);
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
                title: t('toast_success_title'),
                description: t('purchase_updated_successfully'),
            });
            setIsDialogOpen(false);
        } catch (error) {
            console.error("Error updating purchase:", error);
            toast({
                variant: 'destructive',
                title: t('toast_error_title'),
                description: t('error_updating_purchase'),
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
                        <CardTitle className="text-lg truncate flex items-center gap-2"><FontAwesomeIcon icon={faStore} className="w-4 h-4 text-primary"/> {purchase.storeName}</CardTitle>
                        <CardDescription className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendar} className="w-4 h-4"/> {purchase.date.toDate().toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'})}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4"/>
                            <span>{t('purchase_card_items', {count: purchase.items.length})}</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                            <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-primary"/>
                            <span>{purchase.totalAmount.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle>{t('purchase_details_title', { store: purchase.storeName })}</DialogTitle>
                    <DialogDescription>
                         {purchase.date.toDate().toLocaleString('pt-BR', {dateStyle: 'full', timeStyle: 'short'})}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><FontAwesomeIcon icon={faBox} className="inline-block mr-1 w-4 h-4" /> {t('table_product')}</TableHead>
                                <TableHead className="w-[120px]"><FontAwesomeIcon icon={faWeightHanging} className="inline-block mr-1 w-4 h-4" /> {t('table_volume')}</TableHead>
                                <TableHead className="text-center w-[100px]"><FontAwesomeIcon icon={faHashtag} className="inline-block mr-1 w-4 h-4" /> {t('table_quantity')}</TableHead>
                                <TableHead className="text-center w-[120px]">{t('table_unit_price')}</TableHead>
                                <TableHead className="text-right w-[120px]">{t('table_total_price')}</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {items.map((item, index) => (
                                <TableRow key={item.id}>
                                    <TableCell>
                                        <Input value={item.name} onChange={e => handleItemChange(index, 'name', e.target.value)} placeholder={t('item_name_placeholder')} />
                                    </TableCell>
                                    <TableCell>
                                        <Input value={item.volume} onChange={e => handleItemChange(index, 'volume', e.target.value)} placeholder="ex: 1kg, 500ml" />
                                    </TableCell>
                                    <TableCell>
                                        <Input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="text-center" />
                                    </TableCell>
                                     <TableCell>
                                        <Input type="number" value={item.unitPrice} onChange={e => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)} className="text-center" />
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        R$ {(item.price || 0).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                     <Button variant="outline" className="mt-4" onClick={handleAddItem}>
                        <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                        {t('add_item_button')}
                    </Button>
                </div>
                 <DialogFooter className="pt-4 border-t items-center">
                    <div className="flex-grow">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive-outline">
                                    <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" />
                                    {t('delete_purchase_button')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t('delete_purchase_confirm_title')}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t('delete_purchase_confirm_desc')}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => {
                                        onDelete(purchase.id);
                                        setIsDialogOpen(false);
                                    }}>
                                        {t('confirm_delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold">Total: R$ {totalAmount.toFixed(2)}</p>
                    </div>
                    <Button onClick={handleSaveChanges} disabled={isSaving}>
                        <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" />
                        {isSaving ? t('saving') : t('save_changes_button')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

