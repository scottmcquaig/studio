import { config } from 'dotenv';
config();

import '@/ai/flows/journal-insights.ts';
import '@/ai/flows/generate-unlock-code.ts';
import '@/ai/flows/validate-unlock-code.ts';
import '@/ai/flows/create-user-and-claim-code.ts';
    
