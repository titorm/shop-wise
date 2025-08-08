'use server';

/**
 * @fileOverview This file defines a Genkit flow to extract product data from a scanned receipt QR code.
 *
 * It includes:
 * - `extractProductData`: An async function that takes a receipt QR code data URI and returns the extracted product information.
 * - `ExtractProductDataInput`: The input type for the `extractProductData` function, defining the receipt QR code data URI.
 * - `ExtractProductDataOutput`: The output type for the `extractProductData` function, defining the extracted product information.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractProductDataInputSchema = z.object({
  receiptQrCodeDataUri: z
    .string()
    .describe(
      'A receipt QR code, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' /* e.g., data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+bOnUAAAAA//LuF9sRi9gAAAABJRU5ErkJggg== */
    ),
});
export type ExtractProductDataInput = z.infer<typeof ExtractProductDataInputSchema>;

const ExtractProductDataOutputSchema = z.object({
  products: z.array(
    z.object({
      name: z.string().describe('The name of the product.'),
      quantity: z.number().describe('The quantity of the product.'),
      price: z.number().describe('The price of the product.'),
    })
  ).describe('An array of products extracted from the receipt.'),
  storeName: z.string().describe('The name of the store.'),
  date: z.string().describe('The date of the purchase.'),
});
export type ExtractProductDataOutput = z.infer<typeof ExtractProductDataOutputSchema>;

export async function extractProductData(input: ExtractProductDataInput): Promise<ExtractProductDataOutput> {
  return extractProductDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractProductDataPrompt',
  input: {schema: ExtractProductDataInputSchema},
  output: {schema: ExtractProductDataOutputSchema},
  prompt: `You are an expert data extractor specializing in extracting data from receipts.

  You will use the receipt QR code to extract the product name, quantity, price, store name, and date of purchase.

  Use the following as the primary source of information about the receipt.
  Receipt QR Code: {{media url=receiptQrCodeDataUri}}
  `,
});

const extractProductDataFlow = ai.defineFlow(
  {
    name: 'extractProductDataFlow',
    inputSchema: ExtractProductDataInputSchema,
    outputSchema: ExtractProductDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

