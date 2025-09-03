
'use server';

/**
 * @fileOverview A flow to generate and store one-time unlock codes for users.
 *
 * - generateUnlockCode - Creates a unique code and saves it to Firestore.
 * - GenerateUnlockCodeInput - The input type for the flow.
 * - GenerateUnlockCodeOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

export const GenerateUnlockCodeInputSchema = z.object({
  email: z.string().email().describe("The user's email address."),
  accessType: z.enum(['userOne', 'adminOne', 'adminMulti', 'allCurrent', 'allEvergreen']),
  paths: z.union([z.array(z.string()), z.literal('all')]).describe('Array of track IDs or "all".'),
});
export type GenerateUnlockCodeInput = z.infer<typeof GenerateUnlockCodeInputSchema>;

export const GenerateUnlockCodeOutputSchema = z.object({
  code: z.string().describe('The generated unique unlock code.'),
  email: z.string().email(),
  accessType: z.string(),
});
export type GenerateUnlockCodeOutput = z.infer<typeof GenerateUnlockCodeOutputSchema>;

// Helper function to generate a formatted random code
const generateCode = (): string => {
  const segment = () => Math.floor(1000 + Math.random() * 9000).toString();
  return `${segment()}-${segment()}-${segment()}`;
};

// Main exported function that the client will call
export async function generateUnlockCode(input: GenerateUnlockCodeInput): Promise<GenerateUnlockCodeOutput> {
  return generateUnlockCodeFlow(input);
}

const generateUnlockCodeFlow = ai.defineFlow(
  {
    name: 'generateUnlockCodeFlow',
    inputSchema: GenerateUnlockCodeInputSchema,
    outputSchema: GenerateUnlockCodeOutputSchema,
  },
  async (input) => {
    let code: string;
    let codeExists = true;

    // Ensure the generated code is unique
    do {
      code = generateCode();
      const codeDocRef = doc(db, 'accessCodes', code);
      const docSnap = await getDoc(codeDocRef);
      codeExists = docSnap.exists();
    } while (codeExists);

    // Save the new code to Firestore
    const newCodeDocRef = doc(db, 'accessCodes', code);
    await setDoc(newCodeDocRef, {
      email: input.email,
      accessType: input.accessType,
      paths: input.paths,
      isClaimed: false,
      createdAt: new Date().toISOString(),
    });

    return {
      code,
      email: input.email,
      accessType: input.accessType,
    };
  }
);

    