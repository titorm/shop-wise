import { db } from '@/lib/firebase';
import { collection, writeBatch, doc, getDocs, addDoc, query, where, limit, serverTimestamp, setDoc } from 'firebase/firestore';
import { Collections } from '@/lib/enums';

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

const getOrCreateProduct = async (productData: any) => {
    // A new item without barcode won't be saved as a global product
    if (!productData.barcode) return null;

    const formattedBarcode = productData.barcode.replace(/\D/g, '');
    if(!formattedBarcode) return null;
    
    const productRef = doc(db, Collections.Products, formattedBarcode);
    const q = query(collection(db, Collections.Products), where("barcode", "==", productData.barcode), limit(1));
    const productSnap = await getDocs(q);


    if (productSnap.empty) {
        await setDoc(productRef, {
            name: productData.name,
            barcode: productData.barcode,
            brand: productData.brand || null,
            category: productData.category || 'Outros',
            subcategory: productData.subcategory || null,
            volume: productData.volume || null,
            createdAt: serverTimestamp(),
        });
    }
    return productRef;
}

export async function updatePurchaseItems(familyId: string, purchaseId: string, items: PurchaseItem[]) {
    const purchaseRef = doc(db, Collections.Families, familyId, 'purchases', purchaseId);
    const itemsRef = collection(purchaseRef, "purchase_items");

    // Start a batch write
    const batch = writeBatch(db);

    // 1. Get all existing items to find which ones to delete
    const existingItemsSnap = await getDocs(itemsRef);
    const existingIds = new Set(existingItemsSnap.docs.map(d => d.id));

    // 2. Iterate through the new list of items
    for (const item of items) {
        let productRef = item.productRef; // Keep existing ref if it's there
        if (!productRef) {
            // For new items, try to find or create a global product
            productRef = await getOrCreateProduct(item);
        }

        if (item.id.startsWith('new-')) {
            // It's a new item, add it to the batch
            const newItemRef = doc(itemsRef); // new random ID
            batch.set(newItemRef, {
                productRef: productRef,
                quantity: item.quantity,
                price: item.unitPrice,
                totalPrice: item.price,
                // copy other relevant fields from the original purchase doc if needed
            });
        } else {
            // It's an existing item, update it in the batch
            const itemRef = doc(itemsRef, item.id);
            batch.update(itemRef, {
                productRef: productRef,
                quantity: item.quantity,
                price: item.unitPrice,
                totalPrice: item.price,
            });
            existingIds.delete(item.id); // Remove from the set of items to be deleted
        }
    }

    // 3. Any IDs left in existingIds are items that were removed
    existingIds.forEach(idToDelete => {
        batch.delete(doc(itemsRef, idToDelete));
    });
    
    // 4. Update the total amount on the parent purchase document
    const newTotalAmount = items.reduce((acc, item) => acc + (item.price || 0), 0);
    batch.update(purchaseRef, { totalAmount: newTotalAmount });

    // 5. Commit all the changes at once
    await batch.commit();

    return { success: true };
}
