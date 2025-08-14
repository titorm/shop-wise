
"use server";

import { extractProductData as extractProductDataFlow, type ExtractProductDataInput } from "@/ai/flows/extract-product-data";
import { extractDataFromPdf as extractDataFromPdfFlow, type ExtractDataFromPdfInput } from "@/ai/flows/extract-data-from-pdf";
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, writeBatch, Timestamp, doc, getDocs, query, where, setDoc, limit } from 'firebase/firestore';
import { Collections } from '@/lib/enums';
import type { PurchaseData, ItemData } from "@/components/scan/manual-purchase-form";


export async function extractProductData(input: ExtractProductDataInput) {
    try {
        const result = await extractProductDataFlow(input);
        return result;
    } catch (error: any) {
        console.error("Error in extractProductData action:", error);
        return { error: error.message || "Failed to extract data from QR code." };
    }
}


export async function extractDataFromPdf(input: ExtractDataFromPdfInput) {
    try {
        const result = await extractDataFromPdfFlow(input);
        return result;
    } catch (error: any) {
        console.error("Error in extractDataFromPdf action:", error);
        return { error: error.message || "Failed to import data from PDF." };
    }
}

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

export async function savePurchase(
    purchaseData: ExtractProductDataOutput | PurchaseData, 
    products: any[], 
    familyId: string, 
    userId: string,
    entryMethod: 'import' | 'manual'
) {
    try {
        // Check for duplicate purchase using keyAccess
        if ('keyAccess' in purchaseData && purchaseData.keyAccess) {
            const sanitizedKeyAccess = purchaseData.keyAccess.replace(/\s/g, '');
            const purchasesRef = collection(db, Collections.Families, familyId, 'purchases');
            const q = query(purchasesRef, where("keyAccess", "==", sanitizedKeyAccess), limit(1));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                return { error: 'Este cupom fiscal já foi importado.' };
            }
        }

        const totalAmount = products.reduce((acc, item) => {
            const itemTotal = item.price || 0;
            return acc + itemTotal;
        }, 0);
        
        let purchaseDate: Timestamp;
        if (purchaseData.date instanceof Date) {
            purchaseDate = Timestamp.fromDate(purchaseData.date);
        } else if (typeof purchaseData.date === 'string') {
            const dateParts = purchaseData.date.split(/[\/-]/);
            if (dateParts.length === 3) {
                let year, month, day;
                if (dateParts[0].length === 4) { // YYYY-MM-DD
                    year = parseInt(dateParts[0], 10);
                    month = parseInt(dateParts[1], 10) - 1;
                    day = parseInt(dateParts[2], 10);
                } else { // DD/MM/YYYY
                    day = parseInt(dateParts[0], 10);
                    month = parseInt(dateParts[1], 10) - 1;
                    year = parseInt(dateParts[2], 10);
                }
                purchaseDate = Timestamp.fromDate(new Date(year, month, day));
            } else {
                purchaseDate = Timestamp.now();
            }
        } else {
            purchaseDate = Timestamp.now();
        }

        let storeRef = null;
        if (entryMethod === 'import' && 'cnpj' in purchaseData) {
            storeRef = await getOrCreateStore(purchaseData as ExtractProductDataOutput);
        }

        const purchaseRef = await addDoc(collection(db, Collections.Families, familyId, 'purchases'), {
            storeName: purchaseData.storeName,
            storeRef: storeRef,
            date: purchaseDate,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            discount: 'discount' in purchaseData ? (purchaseData.discount || 0) : 0,
            keyAccess: 'keyAccess' in purchaseData && purchaseData.keyAccess ? purchaseData.keyAccess.replace(/\s/g, '') : null,
            purchasedBy: userId,
            entryMethod: entryMethod,
        });

        const batch = writeBatch(db);
        const itemsColRef = collection(db, Collections.Families, familyId, 'purchases', purchaseRef.id, 'purchase_items');
        
        for (const product of products) {
            const productRef = await getOrCreateProduct(product);
            const itemRef = doc(itemsColRef);
            batch.set(itemRef, {
                productRef: productRef,
                quantity: product.quantity,
                price: parseFloat(product.unitPrice.toFixed(2)),
                totalPrice: parseFloat(product.price.toFixed(2)),
                purchaseId: purchaseRef.id,
                purchaseDate: purchaseDate,
                familyId: familyId,
                storeName: purchaseData.storeName,
            });
        }

        await batch.commit();
        
        return { success: true, purchaseId: purchaseRef.id };

    } catch (error: any) {
        console.error("Error in savePurchase action:", error);
        return { error: error.message || "Failed to save purchase." };
    }
}
