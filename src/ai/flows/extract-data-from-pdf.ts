
'use server';

/**
 * @fileOverview This file defines a Genkit flow to extract product data from a PDF receipt.
 *
 * It includes:
 * - `extractDataFromPdf`: An async function that takes a receipt PDF and returns the extracted product information.
 * - `ExtractDataFromPdfInput`: The input type for the `extractDataFromPdf` function.
 * - `ExtractDataFromPdfOutput`: The output type for the `extractDataFromPdf` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractDataFromPdfInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ),
});
export type ExtractDataFromPdfInput = z.infer<typeof ExtractDataFromPdfInputSchema>;


const ExtractDataFromPdfOutputSchema = z.object({
  products: z.array(
    z.object({
      barcode: z.string().describe("The product's barcode (Código)."),
      name: z.string().describe('The name of the product (Descrição).'),
      quantity: z.number().describe('The quantity of the product (Qtde.).'),
      volume: z.string().describe("The unit of measurement for the product (UN). Ex: UN, KG, L"),
      unitPrice: z.number().describe("The unit price of the product (Vl. Unit.)."),
      price: z.number().describe('The total price of the product (Vl. Total).'),
      brand: z.string().optional().describe('The brand of the product, inferred from its name.'),
      category: z.string().describe('The category of the product.'),
      subcategory: z.string().optional().describe('The subcategory of the product.'),
    })
  ).describe('An array of ALL products extracted from the receipt.'),
  storeName: z.string().describe('The name of the store.'),
  date: z.string().describe('The date of the purchase (dd/mm/yyyy).'),
  cnpj: z.string().describe("The store's CNPJ (Cadastro Nacional da Pessoa Jurídica)."),
  address: z.string().describe("The full address of the store."),
  keyAccess: z.string().describe("The receipt's access key (Chave de Acesso)."),
  latitude: z.number().optional().describe("The latitude of the store's location."),
  longitude: z.number().optional().describe("The longitude of the store's location."),
  discount: z.number().optional().describe('The total discount amount for the purchase (Descontos R$).'),
});
export type ExtractDataFromPdfOutput = z.infer<typeof ExtractDataFromPdfOutputSchema>;


export async function extractDataFromPdf(input: ExtractDataFromPdfInput): Promise<ExtractDataFromPdfOutput> {
  return extractDataFromPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDataFromPdfPrompt',
  input: {schema: ExtractDataFromPdfInputSchema},
  output: {schema: ExtractDataFromPdfOutputSchema},
  prompt: `You are an expert data extractor specializing in extracting store and date data from the first page of a Brazilian Nota Fiscal de Consumidor Eletrônica (NFC-e) receipt from a given PDF file.

  Access the provided PDF (which is only the first page) and extract ONLY the store name, purchase date, CNPJ, address, and access key. DO NOT extract any product information.

  **Data Extraction Rules:**
  - **Store Name**: Look for the emitter's name, usually at the top. (e.g., "SDB COMERCIO DE ALIMENTOS LTDA")
  - **CNPJ**: Look for the emitter's CNPJ. (e.g., "09.477.652/0090-61")
  - **Address**: Look for the emitter's full address. If possible, infer the latitude and longitude. (e.g., "SC401 RF JOSE CARLOS DAUX, 9580, STO ANTONIO DE LISBOA, FLORIANOPOLIS, SC")
  - **Date**: Find the emission date. It is often labeled "Emissão" and might be on a line with other information. For example, in a line like "Número: 9911 Série: 114 Emissão: 29/06/2025 19:50:29", extract "29/06/2025". Format it as YYYY-MM-DD.
  - **Discount**: Look for a line item labeled 'Descontos R$' and extract the numeric value.
  - **Access Key (Chave de Acesso)**: Find the long numeric string labeled "Chave de Acesso" or "Chave de acesso". It may have spaces between the numbers.
  - **Products**: Return an empty array for the products field.

  Now, analyze the following receipt PDF page and extract the information into the specified JSON format.
  Receipt PDF: {{media url=pdfDataUri}}
  `,
});


const extractDataFromPdfFlow = ai.defineFlow(
  {
    name: 'extractDataFromPdfFlow',
    inputSchema: ExtractDataFromPdfInputSchema,
    outputSchema: ExtractDataFromPdfOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
