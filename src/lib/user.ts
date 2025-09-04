import type { UserProfile } from './types';

export const mockUser: UserProfile = {
  activePath: 'Relationships',
  currentChallenge: {
    Relationships: 2,
    Money: 1,
    Discipline: 1,
    Ego: 1,
  },
  completedChallenges: {
    Relationships: [1],
    Money: [],
    Discipline: [],
    Ego: [],
  },
  streak: 1,
};
