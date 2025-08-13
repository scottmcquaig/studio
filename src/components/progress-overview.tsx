'use client';

import ProgressCalendar from './progress-calendar';
import CompletionRings from './completion-rings';
import ProgressStats from './progress-stats';
import { useMemo, useEffect, useState } from 'react';

interface ProgressOverviewProps {
  completedDays: Set<number>;
  totalDays: number;
  challengeStartDate: Date;
}

export default function ProgressOverview({ completedDays, totalDays, challengeStartDate }: ProgressOverviewProps) {
    const [today, setToday] = useState(new Date());

    useEffect(() => {
        // Run on client to avoid hydration mismatch
        setToday(new Date());
    }, []);

    const stats = useMemo(() => {
        const diff = Math.floor((today.getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24));
        const currentDay = Math.min(30, Math.max(1, diff + 1));
        const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday...
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Adjust to Monday as start of week
        startOfWeek.setHours(0,0,0,0);

        const weeklyCompletedDays = new Set<number>();
        for(let i=0; i<7; i++){
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            if(date > today) break;

            const dayInChallenge = Math.floor((date.getTime() - challengeStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            if(completedDays.has(dayInChallenge)){
                weeklyCompletedDays.add(dayInChallenge);
            }
        }
        
        return {
            completedToday: completedDays.has(currentDay),
            weeklyCompleted: weeklyCompletedDays.size,
            monthlyCompleted: completedDays.size,
            completionPercentage: Math.round((completedDays.size / totalDays) * 100),
        };
    }, [completedDays, totalDays, challengeStartDate, today]);

  return (
    <div className="space-y-8">
      <ProgressCalendar completedDays={completedDays} challengeStartDate={challengeStartDate} />
      <CompletionRings 
        completedToday={stats.completedToday} 
        weeklyCompleted={stats.weeklyCompleted}
        monthlyCompleted={stats.monthlyCompleted}
      />
      <ProgressStats 
        weeklyCompleted={stats.weeklyCompleted} 
        totalCompleted={stats.monthlyCompleted} 
        completionPercentage={stats.completionPercentage} 
      />
    </div>
  );
}
