"use server";

import { analyzeConsumptionData as analyzeConsumptionDataFlow, type AnalyzeConsumptionDataInput } from "@/ai/flows/analyze-consumption-data";

export async function analyzeConsumptionData(input: AnalyzeConsumptionDataInput) {
    try {
        const result = await analyzeConsumptionDataFlow(input);
        return result;
    } catch (error) {
        console.error("Error in analyzeConsumptionData action:", error);
        throw new Error("Failed to get analysis from AI.");
    }
}
