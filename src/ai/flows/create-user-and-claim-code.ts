
'use server';

/**
 * @fileOverview A flow to create a user profile document and claim an unlock code.
 *
 * - createUserAndClaimCode - Creates a user profile, snapshots their challenge path, and marks the code as claimed.
 */

import { ai } from '@/ai/genkit';
import { db } from '@/lib/firebase';
import { CreateUserAndClaimCodeInput, CreateUserAndClaimCodeInputSchema, CreateUserAndClaimCodeOutput, CreateUserAndClaimCodeOutputSchema } from '@/lib/types';
import { doc, setDoc, updateDoc, Timestamp, collection, writeBatch } from 'firebase/firestore';
import { challenges as allChallenges } from '@/lib/challenges';
import { tracks as allTracks } from '@/lib/tracks.json';
import { format } from 'date-fns';


export async function createUserAndClaimCode(input: CreateUserAndClaimCodeInput): Promise<CreateUserAndClaimCodeOutput> {
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
        const today = new Date();
        const activeChallengePath = `${selectedTrackId}_${format(today, 'yyyy-MM-dd')}`;

        await setDoc(userDocRef, {
            activePath: selectedTrackId,
            activeChallengePath: activeChallengePath,
            unlockedPaths,
            reminders,
            createdAt: Timestamp.now(),
        });
        
        // 2. Snapshot the challenges and progress for the user
        const selectedTrack = allTracks.find(t => t.id === selectedTrackId);
        if (selectedTrack) {
            const trackChallenges = allChallenges.filter(c => c.track === selectedTrack.display_name);
            
            const userChallengeCollectionRef = collection(db, 'users', uid, activeChallengePath);
            const batch = writeBatch(db);

            // Snapshot each day's challenge
            trackChallenges.forEach(challenge => {
                const dayDocRef = doc(userChallengeCollectionRef, `day_${challenge.day}`);
                const userChallengeData = {
                    ...challenge,
                    isComplete: false,
                    completedAt: null,
                    lastEditedAt: null,
                    entries: {
                        morning: "",
                        evening: "",
                        wins: "",
                    }
                };
                batch.set(dayDocRef, userChallengeData);
            });

            // Create the progress document
            const progressDocRef = doc(userChallengeCollectionRef, 'progress');
            batch.set(progressDocRef, {
                currentDay: 1,
                completedDays: [],
                streak: 0,
                trackSettings: selectedTrack // Snapshot the track settings
            });

            await batch.commit();
        }


        // 3. If an unlock code was used, "burn" it
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
