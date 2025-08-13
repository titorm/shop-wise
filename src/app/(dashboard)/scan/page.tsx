
"use client";

import { QrScannerComponent } from "@/components/scan/qr-scanner-component";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, writeBatch, Timestamp, doc } from 'firebase/firestore';
import { Collections } from '@/lib/enums';
import { toast } from '@/hooks/use-toast';
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ManualPurchaseForm } from "@/components/scan/manual-purchase-form";
import type { PurchaseData } from "@/components/scan/manual-purchase-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faKeyboard, faLink } from "@fortawesome/free-solid-svg-icons";


export default function ScanPage() {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const router = useRouter();


    const handleSavePurchase = async (purchaseData: ExtractProductDataOutput | PurchaseData, products: any[]) => {
        if (!user || !profile || !profile.familyId) {
            toast({
                variant: 'destructive',
                title: t('toast_error_title'),
                description: t('error_not_logged_in'),
            });
            return;
        }

        try {
            const totalAmount = products.reduce((acc, item) => acc + (item.price * item.quantity), 0);
            
            // Ensure date is a Firestore Timestamp
            const purchaseDate = purchaseData.date instanceof Date ? Timestamp.fromDate(purchaseData.date) : Timestamp.fromDate(new Date(purchaseData.date));


            // Create a new purchase document
            const purchaseRef = await addDoc(collection(db, Collections.Families, profile.familyId, 'purchases'), {
                storeName: purchaseData.storeName,
                date: purchaseDate,
                totalAmount: totalAmount,
                purchasedBy: user.uid,
                entryMethod: 'products' in purchaseData ? 'qr_code' : 'manual',
            });

            // Batch write all the items in the purchase
            const batch = writeBatch(db);
            const itemsColRef = collection(db, Collections.Families, profile.familyId, 'purchases', purchaseRef.id, 'purchase_items');
            products.forEach(product => {
                const itemRef = doc(itemsColRef); // Create a new doc reference within the subcollection
                batch.set(itemRef, {
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price,
                    totalPrice: product.price * product.quantity,
                    barcode: product.barcode || null,
                    volume: product.volume || null,
                    // In a real app, you'd link to the global product and category
                    productId: null, 
                    categoryId: null,
                    subcategory: null,
                });
            });

            await batch.commit();

            toast({
                title: t('toast_success_title'),
                description: t('purchase_saved_successfully'),
            });

            router.push('/history');


        } catch (error) {
            console.error("Error saving purchase: ", error);
            toast({
                variant: 'destructive',
                title: t('toast_error_saving'),
                description: t('error_saving_purchase'),
            });
        }
    };


    return (
        <div className="container mx-auto py-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t('add_purchase_title')}</CardTitle>
                    <CardDescription>
                        {t('add_purchase_description')}
                    </CardDescription>
                </CardHeader>
                <div className="p-6 pt-0">
                    <Tabs defaultValue="scan" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="scan"><FontAwesomeIcon icon={faLink} className="mr-2 h-4 w-4" /> {t('import_from_url_tab')}</TabsTrigger>
                            <TabsTrigger value="manual"><FontAwesomeIcon icon={faKeyboard} className="mr-2 h-4 w-4" /> {t('manual_entry_tab')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="scan" className="mt-6">
                            <QrScannerComponent onSave={handleSavePurchase}/>
                        </TabsContent>
                        <TabsContent value="manual" className="mt-6">
                            <ManualPurchaseForm onSave={handleSavePurchase} />
                        </TabsContent>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}
