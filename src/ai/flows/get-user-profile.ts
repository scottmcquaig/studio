
'use server';

/**
 * @fileOverview A flow to retrieve a user's profile from Firestore.
 *
 * - getUserProfile - Fetches the user document from the 'users' collection.
 */

import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { z } from 'zod';

const GetUserProfileInputSchema = z.object({
  uid: z.string().describe("The user's unique ID."),
});

const GetUserProfileOutputSchema = z.object({
  activePath: z.string().nullable(),
  unlockedPaths: z.union([z.array(z.string()), z.literal('all')]),
  reminders: z.object({
    pushEnabled: z.boolean(),
    emailEnabled: z.boolean(),
    morningTime: z.string(),
    eveningTime: z.string(),
    timezone: z.string(),
  }).optional(),
  createdAt: z.any().optional(),
});

export async function getUserProfile(input: z.infer<typeof GetUserProfileInputSchema>): Promise<z.infer<typeof GetUserProfileOutputSchema>> {
  return getUserProfileFlow(input);
}

const getUserProfileFlow = ai.defineFlow(
  {
    name: 'getUserProfileFlow',
    inputSchema: GetUserProfileInputSchema,
    outputSchema: GetUserProfileOutputSchema,
  },
  async ({ uid }) => {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
      throw new Error('User profile not found.');
    }

    const data = docSnap.data();

    // Ensure unlockedPaths is always an array or 'all'
    const unlockedPaths = data.unlockedPaths || [];

    return {
      activePath: data.activePath || null,
      unlockedPaths,
      reminders: data.reminders,
      createdAt: data.createdAt,
    };
  }
);
