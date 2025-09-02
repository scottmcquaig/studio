export interface Challenge {
  day: number;
  title: string;
  description: string;
  quote: {
    text: string;
    author: string;
  };
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
