
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
  latitude: z.number().optional().describe("The latitude of the store's location."),
  longitude: z.number().optional().describe("The longitude of the store's location."),
});
export type ExtractDataFromPdfOutput = z.infer<typeof ExtractDataFromPdfOutputSchema>;


export async function extractDataFromPdf(input: ExtractDataFromPdfInput): Promise<ExtractDataFromPdfOutput> {
  return extractDataFromPdfFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDataFromPdfPrompt',
  input: {schema: ExtractDataFromPdfInputSchema},
  output: {schema: ExtractDataFromPdfOutputSchema},
  prompt: `You are an expert data extractor specializing in extracting data from Brazilian Nota Fiscal de Consumidor Eletrônica (NFC-e) receipts from a given PDF file.

  Access the provided PDF and extract the store name, purchase date, and a list of all products. It is critical that you extract ALL products listed on the receipt.

  **Data Extraction Rules:**
  - **Store Name**: Look for the emitter's name, usually at the top. (e.g., "SDB COMERCIO DE ALIMENTOS LTDA")
  - **CNPJ**: Look for the emitter's CNPJ. (e.g., "09.477.652/0090-61")
  - **Address**: Look for the emitter's full address. If possible, infer the latitude and longitude. (e.g., "SC401 RF JOSE CARLOS DAUX, 9580, STO ANTONIO DE LISBOA, FLORIANOPOLIS, SC")
  - **Date**: Look for the authorization date ("Protocolo de Autorização"). Format it as YYYY-MM-DD. (e.g., "Protocolo de Autorização 123456 - 22/01/2024 19:24:30" becomes "2024-01-22")
  
  **Product Extraction Rules:**
  - The products are in a table. For each product, extract all fields. **It is critical that you extract ALL products listed on the receipt.**
  - **Price**: Use the "Vl. Total" field for the final price of the item line.
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
  - Farmácia (Medicamentos e Saúde, Primeiros Socorros, Higiene e Beleza Pessoal, Aparelhos e Acessórios de Saúde)
  - Utilidades e Bazar (Pilhas, Lâmpadas, Utensílios)

  **Example of a product line:**
  "SALSICHA AURORA 500G (Código: 7891164005412) | Qtde.:1 UN | Vl. Unit.: 8,99 | Vl. Total: 8,99"
  **Should be extracted as:**
  {
    barcode: "7891164005412",
    name: "SALSICHA AURORA 500G",
    quantity: 1,
    volume: "UN",
    unitPrice: 8.99,
    price: 8.99,
    brand: "Aurora",
    category: "Açougue e Peixaria",
    subcategory: "Aves"
  }

  Now, analyze the following receipt PDF and extract the information into the specified JSON format.
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
