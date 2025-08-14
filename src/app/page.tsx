'use client'

import { useState, useMemo, useEffect } from 'react';
import type { Challenge, JournalEntry } from '@/lib/types';
import { challenges as allChallenges } from '@/lib/challenges';

import AppHeader from '@/components/app-header';
import ProgressCard from '@/components/progress-card';
import TodaysChallengeCard from '@/components/todays-challenge-card';
import DailyPracticeCard from '@/components/daily-practice-card';
import BuildLegacyCard from '@/components/build-legacy-card';
import BottomNav from '@/components/bottom-nav';
import { Badge } from '@/components/ui/badge';

const MOCK_COMPLETED_DAYS = [1, 2, 3, 5, 6, 8, 9, 10, 11, 14, 15, 16, 18, 20];

export default function Home() {
  const [currentDay, setCurrentDay] = useState(1);
  const [challengeStartDate, setChallengeStartDate] = useState<Date | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set(MOCK_COMPLETED_DAYS));
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const today = new Date();
    const mockStartDate = new Date(today.setDate(today.getDate() - (MOCK_COMPLETED_DAYS[MOCK_COMPLETED_DAYS.length-1] || 1) ));
    setChallengeStartDate(mockStartDate);
    
    const now = new Date();
    const diff = Math.floor((now.getTime() - mockStartDate.getTime()) / (1000 * 60 * 60 * 24));
    setCurrentDay(Math.min(30, Math.max(1, diff + 1)));

    let currentStreak = 0;
    const sortedCompleted = Array.from(completedDays).sort((a,b) => b-a);
    let lastDay = sortedCompleted[0];
    if (lastDay && (lastDay === currentDay || lastDay === currentDay-1)){
      currentStreak = 1;
      for (let i = 1; i < sortedCompleted.length; i++) {
        if (sortedCompleted[i] === lastDay - 1) {
          currentStreak++;
          lastDay = sortedCompleted[i];
        } else {
          break;
        }
      }
    }
    setStreak(currentStreak);

  }, [completedDays]);

  const currentChallenge: Challenge = useMemo(() => {
    return allChallenges[currentDay - 1];
  }, [currentDay]);

  if (!challengeStartDate) {
      return (
          <div className="flex h-screen items-center justify-center">
              <p>Loading Challenge...</p>
          </div>
      )
  }

  const daysRemaining = 30 - completedDays.size;
  const progress = Math.round((completedDays.size / 30) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-4">
            <Badge style={{ backgroundColor: '#3498DB', color: 'white', fontSize: '0.875rem' }} className="border-none font-sans font-normal">
                From the book <span className="font-bold italic ml-1">STOIC AF</span>
            </Badge>
        </div>
        <AppHeader />
        <div className="space-y-6">
          <ProgressCard
            streak={streak}
            daysCompleted={completedDays.size}
            daysRemaining={daysRemaining}
            progress={progress}
          />
          <TodaysChallengeCard 
            day={currentDay}
            challenge={currentChallenge}
          />
          <DailyPracticeCard />
          <BuildLegacyCard />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
