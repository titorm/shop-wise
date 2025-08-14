
"use server";

import { extractProductData as extractProductDataFlow, type ExtractProductDataInput } from "@/ai/flows/extract-product-data";
import { extractDataFromPdf as extractDataFromPdfFlow, type ExtractDataFromPdfInput } from "@/ai/flows/extract-data-from-pdf";
import { extractDataFromPage as extractDataFromPageFlow, type ExtractDataFromPageInput } from "@/ai/flows/extract-data-from-page";

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
    } catch (error: any) {
        console.error("Error in extractDataFromPdf action:", error);
        throw new Error(error.message || "Failed to import data from PDF.");
    }
}

export async function extractDataFromPage(input: ExtractDataFromPageInput) {
    try {
        const result = await extractDataFromPageFlow(input);
        return result;
    } catch (error: any) {
        console.error("Error in extractDataFromPage action:", error);
        throw new Error(error.message || "Failed to import data from PDF page.");
    }
}
