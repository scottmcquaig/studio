
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Flame, CheckCircle2, Target, Award } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import BottomNav from '@/components/bottom-nav';
import { addDays, subDays, format } from 'date-fns';
import type { DayPickerProps, DayProps } from 'react-day-picker';

const MOCK_COMPLETED_DAYS = [1];
const MOCK_STREAK = 1;
const CURRENT_CHALLENGE_DAY = 2; // Day 2 is the current day

function DayLink(props: DayProps) {
  const challengeStartDate = subDays(new Date(), CURRENT_CHALLENGE_DAY - 1);
  const dayNumber = Math.round((props.date.getTime() - challengeStartDate.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24)) + 1;

  // Only link dates that are part of the challenge
  if (props.date.getMonth() === challengeStartDate.getMonth() && dayNumber > 0 && dayNumber <= 30) {
    return (
      <Link href={`/day/${dayNumber}`} className="w-full h-full flex items-center justify-center">
        {format(props.date, "d")}
      </Link>
    );
  }
  return <>{format(props.date, "d")}</>;
}


export default function ProgressPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const completedDaysSet = new Set(MOCK_COMPLETED_DAYS);
  const progress = Math.round((completedDaysSet.size / 30) * 100);
  
  const today = new Date();

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
              <CardDescription>Your journey, day by day. Click a date to view the entry.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
               <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={today}
                className="rounded-md border"
                components={{
                  Day: DayLink,
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
