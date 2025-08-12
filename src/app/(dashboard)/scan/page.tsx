
"use client";

import { QrScannerComponent } from "@/components/scan/qr-scanner-component";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Collections } from '@/lib/enums';
import { toast } from '@/hooks/use-toast';
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { useRouter } from "next/navigation";


export default function ScanPage() {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const router = useRouter();


    const handleSavePurchase = async (scanResult: ExtractProductDataOutput, products: any[]) => {
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

            // Create a new purchase document
            const purchaseRef = await addDoc(collection(db, Collections.Families, profile.familyId, 'purchases'), {
                storeName: scanResult.storeName,
                date: new Date(scanResult.date),
                totalAmount: totalAmount,
                purchasedBy: user.uid,
            });

            // Batch write all the items in the purchase
            const batch = writeBatch(db);
            products.forEach(product => {
                const itemRef = collection(db, Collections.Families, profile.familyId, 'purchases', purchaseRef.id, 'purchase_items');
                batch.set(addDoc(itemRef).withConverter(null), { // Use addDoc to get a new ref and then set it in the batch
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price,
                    totalPrice: product.price * product.quantity,
                    barcode: product.barcode,
                    volume: product.volume,
                    // In a real app, you'd link to the global product and category
                    productId: null, 
                    categoryId: null,
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
                    <CardTitle className="text-2xl font-headline">{t('scan_title')}</CardTitle>
                    <CardDescription>
                        {t('scan_description')}
                    </CardDescription>
                </CardHeader>
                <QrScannerComponent onSave={handleSavePurchase}/>
            </Card>
        </div>
    );
}

    