
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Flame, CheckCircle2, Target, Award, Calendar, Trophy, Zap, Star, BarChart2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import BottomNav from '@/components/bottom-nav';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const MOCK_COMPLETED_DAYS = new Set([1]);
const MOCK_STREAK = 1;
const CURRENT_CHALLENGE_DAY = 2; // Day 2 is the current day

const weeklyProgress = [
    { week: 1, title: "Foundation", completed: 1, total: 7 },
    { week: 2, title: "Discipline", completed: 0, total: 7 },
    { week: 3, title: "Wisdom", completed: 0, total: 7 },
    { week: 4, title: "Mastery", completed: 0, total: 7 },
]

const achievements = [
    { title: "First Streak", description: "Complete 3 days in a row", icon: Zap, unlocked: false },
    { title: "First Week", description: "Complete your first week", icon: Award, unlocked: false },
    { title: "Week Warrior", description: "7-day streak", icon: Trophy, unlocked: false },
    { title: "Relationship Master", description: "Complete all 30 days", icon: Star, unlocked: false },
]

export default function ProgressPage() {
  const completedDaysSet = MOCK_COMPLETED_DAYS;
  const progress = Math.round((completedDaysSet.size / 30) * 100);
  const currentWeek = Math.ceil(CURRENT_CHALLENGE_DAY / 7);

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
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Activity className="h-6 w-6 text-accent" />
                    <CardTitle className="font-headline text-2xl text-primary">Challenge Overview</CardTitle>
                </div>
                <Badge style={{ backgroundColor: '#EF4444', color: 'white' }} className="border-none">Relationship Track</Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-6">
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
                        <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                  <p className="text-2xl font-bold">4</p>
                  <p className="text-xs text-muted-foreground">Badges Earned</p>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-muted-foreground">Overall Progress</span>
                  <span className="font-bold text-foreground">{completedDaysSet.size} of 30 days completed</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>
            </CardContent>
          </Card>

           <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <BarChart2 className="h-6 w-6 text-accent" />
                        <CardTitle className="font-headline text-2xl text-primary">Weekly Progress</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {weeklyProgress.map((week) => {
                        const isCurrentWeek = week.week === currentWeek;
                        const isCompleted = week.completed === week.total;
                        const weekProgress = (week.completed / week.total) * 100;
                        return (
                            <div key={week.week} className="flex flex-col gap-2 p-3 bg-secondary/30 rounded-lg">
                                <div className="flex items-center">
                                    <Badge
                                        className={cn(
                                            "mr-4",
                                            isCurrentWeek && "bg-accent text-primary-foreground",
                                            !isCurrentWeek && "bg-background text-foreground border"
                                        )}
                                    >
                                        Week {week.week} - {week.title}
                                    </Badge>
                                    <p className="flex-grow font-semibold text-primary"></p>
                                    <p className="text-sm text-muted-foreground">{week.completed}/{week.total}</p>
                                </div>
                                <Progress value={weekProgress} className="h-2" />
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Calendar className="h-6 w-6 text-accent" />
                        <CardTitle className="font-headline text-2xl text-primary">Daily Activity Calendar</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: 30 }, (_, i) => {
                            const day = i + 1;
                            const isCompleted = completedDaysSet.has(day);
                            const isActive = day === CURRENT_CHALLENGE_DAY;
                            const isClickable = day <= CURRENT_CHALLENGE_DAY;
                            const today = new Date();
                            const completionDate = new Date(today.setDate(today.getDate() - (CURRENT_CHALLENGE_DAY - day)));
                            
                            const dayContent = (
                                <div
                                    className={cn(
                                        "aspect-square flex flex-col p-2 rounded-lg w-full h-full justify-between",
                                        isActive ? "bg-accent" : "bg-secondary/30",
                                        isCompleted && "bg-green-600",
                                    )}
                                >
                                    <div className="h-4"></div>
                                    <div className="flex-grow flex items-center justify-center">
                                        <p className={cn(
                                            "text-base", 
                                            isActive ? "text-white" : "text-foreground",
                                            isCompleted ? 'font-bold text-white' : ''
                                        )}>{day}</p>
                                    </div>
                                    <div className="text-xs h-4 text-center">
                                        {isCompleted && (
                                            <p className="text-white">
                                                {completionDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );

                            if (isClickable) {
                                return (
                                    <Link key={day} href={`/day/${day}`}>
                                        {dayContent}
                                    </Link>
                                );
                            }

                            return (
                                <div key={day}>
                                    {dayContent}
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <Trophy className="h-6 w-6 text-accent" />
                        <CardTitle className="font-headline text-2xl text-primary">Achievements</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((ach) => (
                         <div key={ach.title} className={cn("flex items-center gap-4 p-4 rounded-lg bg-secondary/30", !ach.unlocked && "opacity-50")}>
                            <div className="p-2 bg-background rounded-full">
                                <ach.icon className="h-6 w-6 text-yellow-500" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-primary">{ach.title}</h4>
                                <p className="text-sm text-muted-foreground">{ach.description}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>


        </div>
      </main>
      <BottomNav activeTab="Progress" />
    </div>
  );
}
