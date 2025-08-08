"use server";

import { extractProductData as extractProductDataFlow, type ExtractProductDataInput } from "@/ai/flows/extract-product-data";

export async function extractProductData(input: ExtractProductDataInput) {
    try {
        const result = await extractProductDataFlow(input);
        return result;
    } catch (error) {
        console.error("Error in extractProductData action:", error);
        throw new Error("Failed to extract data from QR code.");
    }
}
