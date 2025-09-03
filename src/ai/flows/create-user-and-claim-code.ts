
'use server';

/**
 * @fileOverview A flow to create a user profile document and claim an unlock code.
 *
 * - createUserAndClaimCode - Creates a user profile and marks the code as claimed.
 */

import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase';
import { CreateUserAndClaimCodeInputSchema, CreateUserAndClaimCodeOutputSchema } from '@/lib/types';
import { doc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';


export async function createUserAndClaimCode(input: import('@/lib/types').CreateUserAndClaimCodeInput): Promise<import('@/lib/types').CreateUserAndClaimCodeOutput> {
    return createUserAndClaimCodeFlow(input);
}


const createUserAndClaimCodeFlow = ai.defineFlow(
    {
        name: 'createUserAndClaimCodeFlow',
        inputSchema: CreateUserAndClaimCodeInputSchema,
        outputSchema: CreateUserAndClaimCodeOutputSchema,
    },
    async (input) => {
        const { uid, selectedTrackId, unlockedPaths, reminders, unlockCode } = input;

        // 1. Create the user document in the 'users' collection
        const userDocRef = doc(db, 'users', uid);
        await setDoc(userDocRef, {
            activePath: selectedTrackId,
            unlockedPaths,
            reminders,
            createdAt: Timestamp.now(),
        });

        // 2. If an unlock code was used, "burn" it
        if (unlockCode) {
            const codeDocRef = doc(db, 'accessCodes', unlockCode);
            await updateDoc(codeDocRef, {
                isClaimed: true,
                claimedBy: uid,
                claimedAt: Timestamp.now(),
            });
        }

        return {
            success: true,
            message: "User profile created and code claimed successfully."
        };
    }
);
