
'use server';

/**
 * @fileOverview This file defines a Genkit flow to extract product data from a receipt URL.
 *
 * It includes:
 * - `importDataFromUrl`: An async function that takes a receipt URL and returns the extracted product information.
 * - `ImportDataFromUrlInput`: The input type for the `importDataFromUrl` function.
 * - `ImportDataFromUrlOutput`: The output type for the `importDataFromUrl` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImportDataFromUrlInputSchema = z.object({
  url: z.string().url().describe("The URL of the electronic receipt (NFC-e)."),
});
export type ImportDataFromUrlInput = z.infer<typeof ImportDataFromUrlInputSchema>;


const ImportDataFromUrlOutputSchema = z.object({
  products: z.array(
    z.object({
      barcode: z.string().describe("The product's barcode (Código)."),
      name: z.string().describe('The name of the product (Descrição).'),
      quantity: z.number().describe('The quantity of the product (Qtde.).'),
      volume: z.string().describe("The unit of measurement for the product (UN). Ex: UN, KG, L"),
      unitPrice: z.number().describe("The unit price of the product (Vl. Unit.)."),
      price: z.number().describe('The total price of the product (Vl. Total).'),
    })
  ).describe('An array of products extracted from the receipt.'),
  storeName: z.string().describe('The name of the store.'),
  date: z.string().describe('The date of the purchase (dd/mm/yyyy).'),
  cnpj: z.string().describe("The store's CNPJ (Cadastro Nacional da Pessoa Jurídica)."),
  address: z.string().describe("The full address of the store."),
  latitude: z.number().optional().describe("The latitude of the store's location."),
  longitude: z.number().optional().describe("The longitude of the store's location."),
});
export type ImportDataFromUrlOutput = z.infer<typeof ImportDataFromUrlOutputSchema>;


export async function importDataFromUrl(input: ImportDataFromUrlInput): Promise<ImportDataFromUrlOutput> {
  return importDataFromUrlFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importDataFromUrlPrompt',
  input: {schema: ImportDataFromUrlInputSchema},
  output: {schema: ImportDataFromUrlOutputSchema},
  prompt: `You are an expert data extractor specializing in extracting data from Brazilian Nota Fiscal de Consumidor Eletrônica (NFC-e) receipts from a given URL.

  Access the provided URL and extract the store name, purchase date, and a list of all products.

  Here is an example of the data structure you will encounter and how to extract it:

  - **Store Name**: Look for the emitter's name, usually at the top.
    - Example: "ANGELONI CIA LTDA"
  - **CNPJ**: Look for the emitter's CNPJ.
    - Example: "83.646.984/0035-71"
  - **Address**: Look for the emitter's full address. If possible, infer the latitude and longitude.
    - Example: "AV CENTENARIO, 2605, CENTRO, CRICIUMA, SC"
  - **Date**: Look for the emission date ("Data de Emissão"). Format it as YYYY-MM-DD.
    - Example: "22/01/2024 19:24:26" becomes "2024-01-22"
  - **Products**: The products are in a table. For each product, extract the following fields:
    - **Código**: This is the 'barcode'.
    - **Descrição**: This is the 'name'.
    - **Qtde.**: This is the 'quantity'.
    - **UN**: This is the 'volume'.
    - **Vl. Unit.**: This is the 'unitPrice'.
    - **Vl. Total**: This is the 'price'.

  Example of a product line:
  "001 7891000312515 REFRI COCA-COLA S/ACUCAR PET 2L | Qtde.:1 UN | Vl. Unit.:  9,19 | Vl. Total: 9,19"
  Should be extracted as:
  {
    barcode: "7891000312515",
    name: "REFRI COCA-COLA S/ACUCAR PET 2L",
    quantity: 1,
    volume: "UN",
    unitPrice: 9.19,
    price: 9.19
  }

  Now, analyze the following receipt URL and extract the information into the specified JSON format.
  Receipt URL: {{{url}}}
  `,
});


const importDataFromUrlFlow = ai.defineFlow(
  {
    name: 'importDataFromUrlFlow',
    inputSchema: ImportDataFromUrlInputSchema,
    outputSchema: ImportDataFromUrlOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
