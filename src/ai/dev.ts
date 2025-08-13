import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-missing-items.ts';
import '@/ai/flows/extract-product-data.ts';
import '@/ai/flows/analyze-consumption-data.ts';
import '@/ai/flows/import-data-from-url.ts';
