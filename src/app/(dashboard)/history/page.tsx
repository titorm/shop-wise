
"use client";

import { useState } from 'react';
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

// Mock data, in a real application this would come from a database.
const mockPurchases = [
  {
    id: 1,
    store: 'Supermercado Exemplo',
    date: '2024-07-28T10:30:00Z',
    total: 125.40,
    items: [
      { id: 1, barcode: '7890000000011', name: 'Leite Integral', volume: '1L', quantity: 2, price: 5.50 },
      { id: 2, barcode: '7890000000028', name: 'Pão de Forma', volume: '500g', quantity: 1, price: 7.20 },
      { id: 3, barcode: '7890000000035', name: 'Café em pó 500g', volume: '500g', quantity: 1, price: 15.99 },
      { id: 4, barcode: '7890000000042', name: 'Maçã Fuji (Kg)', volume: '1.5kg', quantity: 1.5, price: 9.80 },
      { id: 5, barcode: '7890000000059', name: 'Frango (Kg)', volume: '2kg', quantity: 2, price: 18.90 },
    ],
  },
  {
    id: 2,
    store: 'Atacarejo Preço Baixo',
    date: '2024-07-15T18:00:00Z',
    total: 210.95,
    items: [
      { id: 1, barcode: '7890000000066', name: 'Arroz 5kg', volume: '5kg', quantity: 1, price: 25.50 },
      { id: 2, barcode: '7890000000073', name: 'Feijão 1kg', volume: '1kg', quantity: 2, price: 8.75 },
      { id: 3, barcode: '7890000000080', name: 'Óleo de Soja', volume: '900ml', quantity: 3, price: 6.99 },
    ],
  },
    {
    id: 3,
    store: 'Supermercado Exemplo',
    date: '2024-06-20T14:15:00Z',
    total: 88.50,
    items: [
      { id: 1, barcode: '7890000000097', name: 'Sabão em pó', volume: '1kg', quantity: 1, price: 22.00 },
      { id: 2, barcode: '7890000000103', name: 'Amaciante', volume: '2L', quantity: 1, price: 15.50 },
      { id: 3, barcode: '7890000000110', name: 'Detergente', volume: '500ml', quantity: 4, price: 2.50 },
    ],
  },
   {
    id: 4,
    store: 'Atacarejo Preço Baixo',
    date: '2024-02-10T11:00:00Z',
    total: 350.00,
    items: [
      { id: 1, barcode: '7890000000127', name: 'Picanha (peça)', volume: '1.2kg', quantity: 1, price: 95.50 },
      { id: 2, barcode: '7890000000134', name: 'Cerveja Artesanal', volume: '500ml', quantity: 6, price: 12.75 },
    ],
  },
];

type Purchase = typeof mockPurchases[0];

export default function HistoryPage() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStore, setSelectedStore] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState('all');

    const filteredPurchases = mockPurchases.filter(purchase => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const matchesSearch = lowerSearchTerm === '' ||
            purchase.store.toLowerCase().includes(lowerSearchTerm) ||
            purchase.items.some(item => item.name.toLowerCase().includes(lowerSearchTerm));

        const matchesStore = selectedStore === 'all' || purchase.store === selectedStore;
        
        const now = new Date();
        const purchaseDate = new Date(purchase.date);
        
        const matchesPeriod = selectedPeriod === 'all' ||
            (selectedPeriod === 'last_month' && purchaseDate > new Date(new Date().setMonth(now.getMonth() - 1))) ||
            (selectedPeriod === 'last_3_months' && purchaseDate > new Date(new Date().setMonth(now.getMonth() - 3))) ||
            (selectedPeriod === 'last_6_months' && purchaseDate > new Date(new Date().setMonth(now.getMonth() - 6))) ||
            (selectedPeriod === 'last_year' && purchaseDate > new Date(new Date().setFullYear(now.getFullYear() - 1)));

        return matchesSearch && matchesStore && matchesPeriod;
    });

    return (
        <div className="container mx-auto py-8 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2"><FontAwesomeIcon icon={faHistory} className="w-6 h-6"/> {t('purchaseHistory_title')}</CardTitle>
                    <CardDescription>{t('purchaseHistory_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder={t('searchByStoreOrProduct')}
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Select value={selectedStore} onValueChange={setSelectedStore}>
                            <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder={t('filterByStore')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allStores')}</SelectItem>
                                <SelectItem value="Supermercado Exemplo">Supermercado Exemplo</SelectItem>
                                <SelectItem value="Atacarejo Preço Baixo">Atacarejo Preço Baixo</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                             <SelectTrigger className="w-full md:w-[200px]">
                                <SelectValue placeholder={t('filterByPeriod')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('allPeriods')}</SelectItem>
                                <SelectItem value="last_month">{t('lastMonth')}</SelectItem>
                                <SelectItem value="last_3_months">{t('last3Months')}</SelectItem>
                                <SelectItem value="last_6_months">{t('last6Months')}</SelectItem>
                                <SelectItem value="last_year">{t('lastYear')}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredPurchases.map(purchase => (
                           <PurchaseCard key={purchase.id} purchase={purchase} />
                        ))}
                    </div>
                     {filteredPurchases.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                            <p>{t('noPurchasesFound')}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-headline flex items-center gap-2"><FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-primary"/> {t('recommendations_title')}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <Alert>
                        <FontAwesomeIcon icon={faShoppingCart} className="h-4 w-4" />
                        <AlertTitle>{t('recommendations_recentlyBought')}</AlertTitle>
                        <AlertDescription>
                          <Trans i18nKey="recommendations_recentlyBought_desc" values={{ items: "Leite, Pão, Café" }} components={{ 1: <span className="font-semibold" /> }} />
                        </AlertDescription>
                    </Alert>
                     <Alert>
                        <FontAwesomeIcon icon={faArrowTrendUp} className="h-4 w-4" />
                        <AlertTitle>{t('recommendations_potentialSavings')}</AlertTitle>
                        <AlertDescription>
                           <Trans i18nKey="recommendations_potentialSavings_desc" values={{ item: "Arroz 5kg", store: "Atacarejo Preço Baixo" }} components={{ 1: <span className="font-semibold" />, 3: <span className="font-semibold" /> }} />
                        </AlertDescription>
                    </Alert>
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
                        <CardTitle className="text-lg truncate flex items-center gap-2"><FontAwesomeIcon icon={faStore} className="w-4 h-4 text-primary"/> {purchase.store}</CardTitle>
                        <CardDescription className="flex items-center gap-2"><FontAwesomeIcon icon={faCalendar} className="w-4 h-4"/> {new Date(purchase.date).toLocaleDateString('pt-BR', {day: '2-digit', month: 'long', year: 'numeric'})}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <FontAwesomeIcon icon={faShoppingCart} className="w-4 h-4"/>
                            <span>{t('purchaseCard_items', {count: purchase.items.length})}</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold text-lg text-foreground">
                            <FontAwesomeIcon icon={faDollarSign} className="w-5 h-5 text-primary"/>
                            <span>{purchase.total.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t('purchaseDetails_title', { store: purchase.store })}</DialogTitle>
                    <DialogDescription>
                         {new Date(purchase.date).toLocaleString('pt-BR', {dateStyle: 'full', timeStyle: 'short'})}
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
