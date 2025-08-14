
"use client";

import { PdfImportComponent } from "@/components/scan/pdf-import-component";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, writeBatch, Timestamp, doc, getDocs, query, where, setDoc, limit } from 'firebase/firestore';
import { Collections } from '@/lib/enums';
import { toast } from '@/hooks/use-toast';
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { ManualPurchaseForm } from "@/components/scan/manual-purchase-form";
import type { PurchaseData, ItemData } from "@/components/scan/manual-purchase-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const dynamic = 'force-dynamic';

export default function ScanPage() {
    const { t } = useTranslation();
    const { user, profile } = useAuth();

    const getOrCreateStore = async (purchaseData: ExtractProductDataOutput) => {
        if (!purchaseData.cnpj) return null;
        
        const formattedCnpj = purchaseData.cnpj.replace(/\D/g, ''); // Remove non-numeric characters
        if (!formattedCnpj) return null;

        const storeRef = doc(db, Collections.Stores, formattedCnpj);
        const storeSnap = await getDocs(query(collection(db, Collections.Stores), where("cnpj", "==", purchaseData.cnpj)));

        if (storeSnap.empty) {
            await setDoc(storeRef, {
                name: purchaseData.storeName,
                cnpj: purchaseData.cnpj, // Keep original format here
                address: purchaseData.address,
                location: {
                    latitude: purchaseData.latitude || null,
                    longitude: purchaseData.longitude || null,
                },
                createdAt: serverTimestamp(),
            });
        }
        return storeRef;
    };
    
    const getOrCreateProduct = async (productData: any) => {
        if (!productData.barcode) return null;

        const formattedBarcode = productData.barcode.replace(/\D/g, '');
        if(!formattedBarcode) return null;
        
        const productRef = doc(db, Collections.Products, formattedBarcode);
        const productSnap = await getDocs(query(collection(db, Collections.Products), where("barcode", "==", productData.barcode), limit(1)));


        if (productSnap.empty) {
            await setDoc(productRef, {
                name: productData.name,
                barcode: productData.barcode,
                brand: productData.brand || null,
                category: productData.category || null,
                subcategory: productData.subcategory || null,
                volume: productData.volume || null,
                createdAt: serverTimestamp(),
            });
        }
        return productRef;
    }


    const handleSavePurchase = async (purchaseData: ExtractProductDataOutput | PurchaseData, products: any[], entryMethod: 'import' | 'manual') => {
        if (!user || !profile || !profile.familyId) {
            toast({
                variant: 'destructive',
                title: t('toast_error_title'),
                description: t('error_not_logged_in'),
            });
            throw new Error(t('error_not_logged_in'));
        }

        try {
            const totalAmount = products.reduce((acc, item) => acc + (item.price || (item.unitPrice * item.quantity)), 0);
            
            let purchaseDate: Timestamp;
            if (purchaseData.date instanceof Date) {
                purchaseDate = Timestamp.fromDate(purchaseData.date);
            } else {
                // Handles 'YYYY-MM-DD' string format from AI
                const dateParts = purchaseData.date.split('-');
                const year = parseInt(dateParts[0], 10);
                const month = parseInt(dateParts[1], 10) - 1; // Month is 0-indexed
                const day = parseInt(dateParts[2], 10);
                purchaseDate = Timestamp.fromDate(new Date(year, month, day));
            }


            let storeRef = null;
            if (entryMethod === 'import' && 'cnpj' in purchaseData) {
                 storeRef = await getOrCreateStore(purchaseData as ExtractProductDataOutput);
            }

            const purchaseRef = await addDoc(collection(db, Collections.Families, profile.familyId, 'purchases'), {
                storeName: purchaseData.storeName,
                storeRef: storeRef,
                date: purchaseDate,
                totalAmount: totalAmount,
                purchasedBy: user.uid,
                entryMethod: entryMethod,
            });

            const batch = writeBatch(db);
            const itemsColRef = collection(db, Collections.Families, profile.familyId, 'purchases', purchaseRef.id, 'purchase_items');
            
            for (const product of products) {
                const productRef = await getOrCreateProduct(product);

                const itemRef = doc(itemsColRef);
                batch.set(itemRef, {
                    productRef: productRef,
                    quantity: product.quantity,
                    price: product.unitPrice, // Unit price
                    totalPrice: product.price,
                    purchaseId: purchaseRef.id,
                    purchaseDate: purchaseDate,
                    familyId: profile.familyId,
                    storeName: purchaseData.storeName,
                });
            }

            await batch.commit();

             toast({
                title: t('toast_success_title'),
                description: t('purchase_saved_successfully'),
            });

        } catch (error) {
            console.error("Error saving purchase: ", error);
            toast({
                variant: 'destructive',
                title: t('toast_error_saving'),
                description: t('error_saving_purchase'),
            });
            throw error;
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
                            <TabsTrigger value="scan"><FontAwesomeIcon icon={faFilePdf} className="mr-2 h-4 w-4" /> {t('import_from_pdf_tab')}</TabsTrigger>
                            <TabsTrigger value="manual"><FontAwesomeIcon icon={faKeyboard} className="mr-2 h-4 w-4" /> {t('manual_entry_tab')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="scan" className="mt-6">
                            <PdfImportComponent onSave={(data, prods) => handleSavePurchase(data, prods, 'import')} />
                        </TabsContent>
                        <TabsContent value="manual" className="mt-6">
                            <ManualPurchaseForm onSave={(data, prods) => handleSavePurchase(data, prods, 'manual')} />
                        </TabsContent>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}
