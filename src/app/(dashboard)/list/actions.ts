
"use server";

import { suggestMissingItems as suggestMissingItemsFlow, type SuggestMissingItemsInput } from "@/ai/flows/suggest-missing-items";

export async function suggestMissingItems(input: SuggestMissingItemsInput) {
    try {
        const result = await suggestMissingItemsFlow(input);
        return result;
    } catch (error: any) {
        console.error("Error in suggestMissingItems action:", error);
        return { error: error.message || "Failed to get suggestions from AI." };
    }
}
