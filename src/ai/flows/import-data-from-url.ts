
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
      brand: z.string().optional().describe('The brand of the product, inferred from its name.'),
      category: z.string().describe('The category of the product.'),
      subcategory: z.string().optional().describe('The subcategory of the product.'),
    })
  ).describe('An array of ALL products extracted from the receipt.'),
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

  Access the provided URL and extract the store name, purchase date, and a list of all products. Make sure to extract ALL products.

  **Data Extraction Rules:**
  - **Store Name**: Look for the emitter's name, usually at the top. (e.g., "ANGELONI CIA LTDA")
  - **CNPJ**: Look for the emitter's CNPJ. (e.g., "83.646.984/0035-71")
  - **Address**: Look for the emitter's full address. If possible, infer the latitude and longitude. (e.g., "AV CENTENARIO, 2605, CENTRO, CRICIUMA, SC")
  - **Date**: Look for the authorization date ("Protocolo de Autorização"). Format it as YYYY-MM-DD. (e.g., "Protocolo de Autorização 123456 - 22/01/2024 19:24:30" becomes "2024-01-22")
  
  **Product Extraction Rules:**
  - The products are in a table. For each product, extract all fields. **It is critical that you extract ALL products listed on the receipt.**
  - **Brand**: Infer the product's brand from its name. If no brand is evident, leave it empty.
  - **Category/Subcategory**: Classify each product into a category and subcategory from the list below. Be as specific as possible. If a product doesn't fit, use your best judgment.

  **Categories List:**
  - Hortifrúti e Ovos (Frutas, Verduras, Legumes, Ovos)
  - Açougue e Peixaria (Carne Bovina, Carne Suína, Aves, Peixes, Frutos do Mar)
  - Padaria e Confeitaria (Pães, Bolos, Doces)
  - Laticínios e Frios (Leites, Queijos, Iogurtes, Manteiga, Frios)
  - Mercearia (Arroz, Feijão, Massas, Óleos, Molhos, Enlatados, Cereais)
  - Matinais e Doces (Café, Achocolatados, Biscoitos, Doces)
  - Congelados (Pratos Prontos, Sorvetes, Vegetais Congelados)
  - Bebidas (Refrigerantes, Sucos, Água, Bebidas Alcoólicas)
  - Limpeza (Sabão em Pó, Detergente, Desinfetante)
  - Higiene Pessoal (Shampoo, Sabonete, Creme Dental)
  - Bebês e Crianças (Fraldas, Lenços Umedecidos)
  - Pet Shop (Ração, Petiscos)
  - Utilidades e Bazar (Pilhas, Lâmpadas, Utensílios)

  **Example of a product line:**
  "001 7891000312515 REFRI COCA-COLA S/ACUCAR PET 2L | Qtde.:1 UN | Vl. Unit.:  9,19 | Vl. Total: 9,19"
  **Should be extracted as:**
  {
    barcode: "7891000312515",
    name: "REFRI COCA-COLA S/ACUCAR PET 2L",
    quantity: 1,
    volume: "UN",
    unitPrice: 9.19,
    price: 9.19,
    brand: "Coca-Cola",
    category: "Bebidas",
    subcategory: "Refrigerantes"
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
