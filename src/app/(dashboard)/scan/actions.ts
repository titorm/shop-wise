
"use server";

import { extractProductData as extractProductDataFlow, type ExtractProductDataInput } from "@/ai/flows/extract-product-data";
import { importDataFromUrl as importDataFromUrlFlow, type ImportDataFromUrlInput } from "@/ai/flows/import-data-from-url";

export async function extractProductData(input: ExtractProductDataInput) {
    try {
        const result = await extractProductDataFlow(input);
        return result;
    } catch (error) {
        console.error("Error in extractProductData action:", error);
        throw new Error("Failed to extract data from QR code.");
    }
}


export async function importDataFromUrl(input: ImportDataFromUrlInput) {
    try {
        const result = await importDataFromUrlFlow(input);
        return result;
    } catch (error) {
        console.error("Error in importDataFromUrl action:", error);
        throw new Error("Failed to import data from URL.");
    }
}
