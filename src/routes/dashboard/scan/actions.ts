import {
    extractProductData as extractProductDataFlow,
    type ExtractProductDataInput,
} from "@/ai/flows/extract-product-data";
import {
    extractDataFromPdf as extractDataFromPdfFlow,
    ExtractDataFromPdfOutput,
    type ExtractDataFromPdfInput,
} from "@/ai/flows/extract-data-from-pdf";
import type { PurchaseData, ItemData } from "@/components/scan/manual-purchase-form";
import type { ExtractProductDataOutput } from "@/ai/flows/extract-product-data";
import { savePurchase as savePurchaseService } from "@/services/purchaseService";

export async function extractProductData(input: ExtractProductDataInput) {
    try {
        const result = await extractProductDataFlow(input);
        return result;
    } catch (error: any) {
        console.error("Error in extractProductData action:", error);
        return { error: error.message || "Failed to extract data from QR code." };
    }
}

export async function extractDataFromPdf(
    input: ExtractDataFromPdfInput
): Promise<ExtractDataFromPdfOutput & { error?: string }> {
    try {
        const result = await extractDataFromPdfFlow(input);
        return result;
    } catch (error: any) {
        console.error("Error in extractDataFromPdf action:", error);
        return {
            accessKey: '',
            address: '',
            cnpj: '',
            date: '',
            products: [],
            storeName: '',
            error: error.message || "Failed to import data from PDF.",
        };
    }
}

export async function savePurchase(
    purchaseData: ExtractProductDataOutput | PurchaseData,
    products: any[],
    familyId: string,
    userId: string,
    entryMethod: "import" | "manual"
): Promise<{ success: boolean; error?: string; purchaseId?: string }> {
    try {
        const result = await savePurchaseService(purchaseData, products, familyId, userId, entryMethod);
        return result;
    } catch (error: any) {
        console.error("Error in savePurchase action:", error);
        return { success: false, error: error.message || "Failed to save purchase." };
    }
}
