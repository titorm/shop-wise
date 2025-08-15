
import { analyzeConsumptionData as analyzeConsumptionDataFlow, type AnalyzeConsumptionDataInput } from "@/ai/flows/analyze-consumption-data";

export async function analyzeConsumptionData(input: AnalyzeConsumptionDataInput): Promise<{ analysis: string, error?: string }> {
    try {
        const result = await analyzeConsumptionDataFlow(input);
        return result;
    } catch (error: any) {
        console.error("Error in analyzeConsumptionData action:", error);
        return { analysis: '', error: error.message || "Failed to get analysis from AI." };
    }
}
