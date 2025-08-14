
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faSearch, faStore, faShoppingCart, faDollarSign, faLightbulb, faArrowTrendUp, faBox, faHashtag, faBarcode, faWeightHanging } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { useTranslation, Trans } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, Timestamp, getDoc } from 'firebase/firestore';
import { Collections } from '@/lib/enums';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';

interface PurchaseItem {
    id: string;
    productRef: any;
    barcode?: string;
    name?: string;
    volume?: string;
    quantity: number;
    price: number;
}
interface Purchase {
    id: string;
    storeName: string;
    date: Timestamp;
    totalAmount: number;
    items: PurchaseItem[];
}


export default function HistoryPage() {
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
                        return {...itemData, id: itemDoc.id } as PurchaseItem;
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
        <div className="container mx-auto py-8 space-y-8">
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
                                        <PurchaseCard key={purchase.id} purchase={purchase} />
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


function PurchaseCard({ purchase }: { purchase: Purchase }) {
    const { t } = useTranslation();
    return (
        <Dialog>
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
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('purchase_details_title', { store: purchase.storeName })}</DialogTitle>
                    <DialogDescription>
                         {purchase.date.toDate().toLocaleString('pt-BR', {dateStyle: 'full', timeStyle: 'short'})}
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[150px]"><FontAwesomeIcon icon={faBarcode} className="inline-block mr-1 w-4 h-4" /> {t('table_barcode')}</TableHead>
                                <TableHead><FontAwesomeIcon icon={faBox} className="inline-block mr-1 w-4 h-4" /> {t('table_product')}</TableHead>
                                <TableHead className="text-center w-[100px]"><FontAwesomeIcon icon={faWeightHanging} className="inline-block mr-1 w-4 h-4" /> {t('table_volume')}</TableHead>
                                <TableHead className="text-center w-[80px]"><FontAwesomeIcon icon={faHashtag} className="inline-block mr-1 w-4 h-4" /> {t('table_quantity')}</TableHead>
                                <TableHead className="text-right w-[120px]"><FontAwesomeIcon icon={faDollarSign} className="inline-block mr-1 w-4 h-4" /> {t('table_price_header')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {purchase.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-mono text-xs">{item.barcode}</TableCell>
                                    <TableCell className="font-medium">{item.name}</TableCell>
                                    <TableCell className="text-center">{item.volume}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}

    

    



    

    

    
