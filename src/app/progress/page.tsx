'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Flame, CheckCircle2, Target, Award, Activity } from 'lucide-react';
import BottomNav from '@/components/bottom-nav';

const MOCK_COMPLETED_DAYS = [1, 2, 3, 5, 6, 8, 9, 10, 11, 14, 15, 16, 18, 20, 21, 22, 23, 24, 25];
const MOCK_STREAK = 5;

export default function ProgressPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const completedDaysSet = new Set(MOCK_COMPLETED_DAYS);
  const progress = Math.round((completedDaysSet.size / 30) * 100);

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
                  <Flame className="h-8 w-8 text-destructive mb-2" />
                  <p className="text-2xl font-bold">{MOCK_STREAK}</p>
                  <p className="text-xs text-muted-foreground">Current Streak</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                  <CheckCircle2 className="h-8 w-8 text-green-600 mb-2" />
                  <p className="text-2xl font-bold">{completedDaysSet.size}</p>
                  <p className="text-xs text-muted-foreground">Days Completed</p>
                </div>
                 <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                  <Target className="h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold">{30 - completedDaysSet.size}</p>
                  <p className="text-xs text-muted-foreground">Days Remaining</p>
                </div>
                <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                  <Award className="h-8 w-8 text-yellow-500 mb-2" />
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
              <div className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-accent" />
                <CardTitle className="font-headline text-2xl text-primary">Completion Calendar</CardTitle>
              </div>
              <CardDescription className="pl-9">Your journey, day by day.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
               <Calendar
                mode="multiple"
                selected={MOCK_COMPLETED_DAYS.map(day => {
                  const d = new Date();
                  // This is a rough mock, assuming challenge starts on 1st of current month
                  d.setDate(day);
                  return d;
                })}
                onSelect={setDate}
                className="rounded-md border"
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
                  day_today: "bg-accent/50 text-accent-foreground",
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
