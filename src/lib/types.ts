
export interface Challenge {
  day: number;
  title: string;
  description: string;
  quote: {
    text: string;
    author: string;
  };
  badgeTitle?: string;
  broTranslation?: string;
  challenge?: string;
  morningPrompt?: string;
  eveningPrompt?: string;
  winsTitle?: string;
  week?: number;
  track?: string;
}

export interface JournalEntry {
  morning: string;
  evening: string;
  wins: string;
}

import { z } from 'zod';

export const GenerateUnlockCodeInputSchema = z.object({
  accessType: z.enum(['userOne', 'adminOne', 'adminMulti', 'allCurrent', 'allEvergreen']),
  paths: z.union([z.array(z.string()), z.literal('all')]).describe('Array of track IDs or "all".'),
});
export type GenerateUnlockCodeInput = z.infer<typeof GenerateUnlockCodeInputSchema>;

export const GenerateUnlockCodeOutputSchema = z.object({
  code: z.string().describe('The generated unique unlock code.'),
  accessType: z.string(),
});
export type GenerateUnlockCodeOutput = z.infer<typeof GenerateUnlockCodeOutputSchema>;
