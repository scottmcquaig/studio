export interface Challenge {
  day: number;
  title: string;
  description: string;
  quote: {
    text: string;
    author: string;
  };
}

export interface JournalEntry {
  morning: string;
  evening: string;
  wins: string;
}
