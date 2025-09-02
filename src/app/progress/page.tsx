
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Flame, CheckCircle2, Target, Award } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import BottomNav from '@/components/bottom-nav';
import { addDays, subDays } from 'date-fns';

const MOCK_COMPLETED_DAYS = [1];
const MOCK_STREAK = 1;
const CURRENT_CHALLENGE_DAY = 2; // Day 2 is the current day

export default function ProgressPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const completedDaysSet = new Set(MOCK_COMPLETED_DAYS);
  const progress = Math.round((completedDaysSet.size / 30) * 100);
  
  const today = new Date();
  const challengeStartDate = subDays(today, CURRENT_CHALLENGE_DAY - 1);

  const completedDates = MOCK_COMPLETED_DAYS.map(day => addDays(challengeStartDate, day - 1));
  const missedDate = subDays(today, 2); // Represents 8/31 if today is 9/2

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 bg-card border-b">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-xl font-bold font-headline text-primary">Your Progress</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-accent" />
                <CardTitle className="font-headline text-2xl text-primary">Challenge Overview</CardTitle>
              </div>
              <CardDescription className="pl-9">A look at your journey so far.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pl-9">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                    <div className="p-2 bg-background rounded-full mb-2">
                        <Flame className="h-8 w-8 text-destructive" />
                    </div>
                  <p className="text-2xl font-bold">{MOCK_STREAK}</p>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                    <div className="p-2 bg-background rounded-full mb-2">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  <p className="text-2xl font-bold">{completedDaysSet.size}</p>
                  <p className="text-xs text-muted-foreground">Days Completed</p>
                </div>
                 <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                    <div className="p-2 bg-background rounded-full mb-2">
                        <Target className="h-8 w-8 text-primary" />
                    </div>
                  <p className="text-2xl font-bold">{30 - completedDaysSet.size}</p>
                  <p className="text-xs text-muted-foreground">Days Remaining</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                    <div className="p-2 bg-background rounded-full mb-2">
                        <Award className="h-8 w-8 text-yellow-500" />
                    </div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Badges Earned</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-muted-foreground">Overall Progress</span>
                  <span className="font-bold text-foreground">{progress}% Complete</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Completion Calendar</CardTitle>
              <CardDescription>Your journey, day by day.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
               <Calendar
                mode="multiple"
                selected={completedDates}
                defaultMonth={today}
                onSelect={setDate}
                className="rounded-md border"
                modifiers={{
                  completed: completedDates,
                  missed: [missedDate],
                }}
                modifiersClassNames={{
                  today: 'day-today',
                  completed: 'day-completed',
                  missed: 'day-missed',
                }}
                classNames={{
                  cell: "h-9 w-9 text-center text-sm p-0 relative first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 mx-0.5",
                  day_selected: "bg-primary text-primary-foreground rounded-md border border-primary-foreground/20 hover:bg-primary/90 focus:bg-primary/90",
                  day_today: "bg-accent text-accent-foreground rounded-md border border-accent-foreground/20",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                }}
              />
            </CardContent>
          </Card>

        </div>
      </main>
      <BottomNav activeTab="Progress" />
    </div>
  );
}
