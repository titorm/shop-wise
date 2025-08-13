
"use server";

import { extractProductData as extractProductDataFlow, type ExtractProductDataInput } from "@/ai/flows/extract-product-data";
import { extractDataFromPdf as extractDataFromPdfFlow, type ExtractDataFromPdfInput } from "@/ai/flows/extract-data-from-pdf";

export async function extractProductData(input: ExtractProductDataInput) {
    try {
        const result = await extractProductDataFlow(input);
        return result;
    } catch (error) {
        console.error("Error in extractProductData action:", error);
        throw new Error("Failed to extract data from QR code.");
    }
}


export async function extractDataFromPdf(input: ExtractDataFromPdfInput) {
    try {
        const result = await extractDataFromPdfFlow(input);
        return result;
    } catch (error) {
        console.error("Error in extractDataFromPdf action:", error);
        throw new Error("Failed to import data from PDF.");
    }
}
