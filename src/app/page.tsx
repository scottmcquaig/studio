'use client'

import { useState, useMemo, useEffect } from 'react';
import type { Challenge, JournalEntry } from '@/lib/types';
import { challenges as allChallenges } from '@/lib/challenges';

import DashboardHeader from '@/components/dashboard-header';
import DailyChallenge from '@/components/daily-challenge';
import JournalEntryComponent from '@/components/journal-entry';
import ProgressOverview from '@/components/progress-overview';
import JournalInsights from '@/components/journal-insights';
import TimelineView from '@/components/timeline-view';
import ExportJournal from '@/components/export-journal';

// Mock data for initial state
const MOCK_COMPLETED_DAYS = [1, 2, 3, 5, 6, 8, 9, 10, 11, 14, 15, 16, 18, 20];

const MOCK_JOURNAL_ENTRIES: Record<number, JournalEntry> = {
  1: { morning: 'Today, I will focus on what is within my control.', evening: 'I handled the project delay with calm.', wins: 'Did not get angry in traffic.' },
  2: { morning: 'My goal is to listen more than I speak.', evening: 'I learned a lot by listening to my colleagues.', wins: 'Finished a chapter of a book.' },
  3: { morning: 'I will embrace any obstacles as opportunities.', evening: 'The cancelled meeting gave me time to prepare for the next one.', wins: 'Went for a 30-minute walk.' },
};


export default function Home() {
  const [currentDay, setCurrentDay] = useState(1);
  const [challengeStartDate, setChallengeStartDate] = useState<Date | null>(null);
  
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set(MOCK_COMPLETED_DAYS));
  const [journalEntries, setJournalEntries] = useState<Record<number, JournalEntry>>(MOCK_JOURNAL_ENTRIES);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // This logic would normally be more complex, fetching the start date
    // from a user profile. For this scaffold, we'll set a mock start date.
    const today = new Date();
    const mockStartDate = new Date(today.setDate(today.getDate() - 20));
    setChallengeStartDate(mockStartDate);
    
    // Set current day based on start date
    const now = new Date();
    const diff = Math.floor((now.getTime() - mockStartDate.getTime()) / (1000 * 60 * 60 * 24));
    setCurrentDay(Math.min(30, Math.max(1, diff + 1)));

    // Calculate streak from mock data
    let currentStreak = 0;
    if (completedDays.has(currentDay - 1)) {
        currentStreak++;
        for (let i = currentDay - 2; i > 0; i--) {
            if (completedDays.has(i)) {
                currentStreak++;
            } else {
                break;
            }
        }
    }
    setStreak(currentStreak);

  }, []);

  const currentChallenge: Challenge = useMemo(() => {
    return allChallenges[currentDay - 1];
  }, [currentDay]);

  const handleSaveJournal = (day: number, entry: JournalEntry) => {
    setJournalEntries(prev => ({ ...prev, [day]: entry }));
    // In a real app, you might auto-mark day as complete here
  };
  
  const handleDayCompletion = (day: number) => {
    setCompletedDays(prev => {
        const newSet = new Set(prev);
        newSet.add(day);
        return newSet;
    });
    // Add logic to update streak here
  }

  if (!challengeStartDate) {
      return (
          <div className="flex h-screen items-center justify-center">
              <p>Loading Challenge...</p>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader streak={streak} />
      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            <DailyChallenge challenge={currentChallenge} day={currentDay} onComplete={handleDayCompletion} isCompleted={completedDays.has(currentDay)} />
            <JournalEntryComponent
              day={currentDay}
              entry={journalEntries[currentDay] || { morning: '', evening: '', wins: '' }}
              onSave={handleSaveJournal}
            />
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-8">
            <ProgressOverview completedDays={completedDays} totalDays={allChallenges.length} challengeStartDate={challengeStartDate} />
            <JournalInsights entries={Object.values(journalEntries).map(e => Object.values(e).join('\n'))} />
            <TimelineView completedDays={completedDays} currentDay={currentDay} />
            <ExportJournal journalEntries={journalEntries} challenges={allChallenges} />
          </div>

        </div>
      </main>
    </div>
  );
}
