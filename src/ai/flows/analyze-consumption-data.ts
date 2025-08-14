'use server';

/**
 * @fileOverview This file defines a Genkit flow to analyze monthly consumption data and generate insights.
 *
 * It includes:
 * - `analyzeConsumptionData`: An async function that takes consumption data and returns a textual analysis.
 * - `AnalyzeConsumptionDataInput`: The input type for the `analyzeConsumptionData` function.
 * - `AnalyzeConsumptionDataOutput`: The output type for the `analyzeConsumptionData` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeConsumptionDataInputSchema = z.object({
  consumptionData: z
    .string()
    .describe(
      'A JSON string representing an array of monthly consumption data. Each object should have a "month" and keys for each spending category.'
    ),
    language: z.string().optional().describe("The language for the analysis output, e.g., 'en', 'pt-BR'."),
});
export type AnalyzeConsumptionDataInput = z.infer<typeof AnalyzeConsumptionDataInputSchema>;

const AnalyzeConsumptionDataOutputSchema = z.object({
  analysis: z.string().describe('A detailed, yet concise, textual analysis of the consumption data, explaining monthly variations and trends.'),
});
export type AnalyzeConsumptionDataOutput = z.infer<typeof AnalyzeConsumptionDataOutputSchema>;

export async function analyzeConsumptionData(input: AnalyzeConsumptionDataInput): Promise<AnalyzeConsumptionDataOutput> {
  return analyzeConsumptionDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeConsumptionDataPrompt',
  input: {schema: AnalyzeConsumptionDataInputSchema},
  output: {schema: AnalyzeConsumptionDataOutputSchema},
  prompt: `Você é um analista financeiro especialista em finanças pessoais e compras de supermercado. Sua tarefa é analisar os dados de consumo mensal de uma família e gerar um texto de análise.

Seja sucinto, mas completo. Identifique o mês de maior e menor gasto total. Destaque as categorias que mais contribuíram para aumentos ou reduções em meses específicos. Aponte tendências de consumo, como um aumento constante em uma categoria.

Use o seguinte formato para sua análise:
- Comece com um resumo geral (ex: "Seu maior gasto foi em Dezembro, impulsionado por Mercearia e Bebidas...").
- Crie uma pequena seção para cada mês com uma variação notável, explicando o que causou a mudança (ex: "Em Junho, seus gastos com limpeza aumentaram, enquanto as outras categorias permaneceram estáveis.").
- Termine com uma conclusão ou insight geral.

Dados de Consumo:
{{{consumptionData}}}

Gere a análise em {{{language}}}. Se o idioma não for fornecido, use Português do Brasil.
`,
});

const analyzeConsumptionDataFlow = ai.defineFlow(
  {
    name: 'analyzeConsumptionDataFlow',
    inputSchema: AnalyzeConsumptionDataInputSchema,
    outputSchema: AnalyzeConsumptionDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
