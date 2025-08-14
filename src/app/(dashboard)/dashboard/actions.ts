
"use server";

import { analyzeConsumptionData as analyzeConsumptionDataFlow, type AnalyzeConsumptionDataInput } from "@/ai/flows/analyze-consumption-data";

export async function analyzeConsumptionData(input: AnalyzeConsumptionDataInput) {
    try {
        const result = await analyzeConsumptionDataFlow(input);
        return result;
    } catch (error: any) {
        console.error("Error in analyzeConsumptionData action:", error);
        return { error: error.message || "Failed to get analysis from AI." };
    }
}
