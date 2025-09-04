
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Flame, CheckCircle2, Target, Award, Calendar, Trophy, Zap, Star, BarChart2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import BottomNav from '@/components/bottom-nav';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mockUser } from '@/lib/user';
import type { UserProfile } from '@/lib/types';
import PrivateRoute from '@/components/private-route';

const TOTAL_CHALLENGE_DAYS = 30;

const achievements = [
    { title: "First Streak", description: "Complete 3 days in a row", icon: Zap, unlocked: false },
    { title: "First Week", description: "Complete your first week", icon: Award, unlocked: false },
    { title: "Week Warrior", description: "7-day streak", icon: Trophy, unlocked: false },
    { title: "Relationship Master", description: "Complete all 30 days", icon: Star, unlocked: false },
]

interface CalendarDay {
  day: number;
  isCompleted: boolean;
  isActive: boolean;
  isClickable: boolean;
  completionDate?: string;
}

function ProgressPageContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoadingProfile(true);
          // In a real app, you would fetch this from your backend
          const profile = mockUser;
          setUserProfile(profile);

          if (profile.activePath) {
            const today = new Date();
            const currentDay = profile.currentChallenge[profile.activePath];
            const completedDaysSet = new Set(profile.completedChallenges[profile.activePath]);

            const days: CalendarDay[] = Array.from({ length: TOTAL_CHALLENGE_DAYS }, (_, i) => {
                const day = i + 1;
                const isCompleted = completedDaysSet.has(day);
                const isActive = day === currentDay;
                const isClickable = day <= currentDay;
                
                let completionDateStr: string | undefined;
                if (isCompleted) {
                    const completionDate = new Date(today);
                    completionDate.setDate(today.getDate() - (currentDay - day));
                    completionDateStr = completionDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
                }
                
                return {
                    day,
                    isCompleted,
                    isActive,
                    isClickable,
                    completionDate: completionDateStr,
                };
            });
            setCalendarDays(days);
          }

        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load your profile. Please try again."
          });
        } finally {
          setLoadingProfile(false);
        }
      } else {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user, toast]);

  if (loadingProfile) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!userProfile?.activePath) {
      return (
          <div className="flex flex-col min-h-screen bg-background text-foreground">
              <header className="py-4 bg-card border-b">
                <div className="container mx-auto px-4 max-w-3xl text-center">
                <h1 className="text-xl font-bold font-headline text-primary">Your Progress</h1>
                </div>
            </header>
            <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl text-center">
                <p>Start a challenge to see your progress.</p>
                <Button asChild className="mt-4"><Link href="/programs">View Challenges</Link></Button>
            </main>
            <BottomNav activeTab="Progress" />
          </div>
      )
  }
  
  const activePath = userProfile.activePath;
  const currentDay = userProfile.currentChallenge[activePath];
  const completedDaysSet = new Set(userProfile.completedChallenges[activePath]);
  const progress = Math.round((completedDaysSet.size / TOTAL_CHALLENGE_DAYS) * 100);
  const currentWeek = Math.ceil(currentDay / 7);

  const weeklyProgress = [
    { week: 1, title: "Foundation", completed: Array.from(completedDaysSet).filter(d => d <= 7).length, total: 7 },
    { week: 2, title: "Discipline", completed: Array.from(completedDaysSet).filter(d => d > 7 && d <= 14).length, total: 7 },
    { week: 3, title: "Wisdom", completed: Array.from(completedDaysSet).filter(d => d > 14 && d <= 21).length, total: 7 },
    { week: 4, title: "Mastery", completed: Array.from(completedDaysSet).filter(d => d > 21 && d <= 28).length, total: 7 },
  ];
  const totalDaysInWeeks = weeklyProgress.reduce((acc, week) => acc + week.total, 0);
  const remainingDays = Array.from({ length: TOTAL_CHALLENGE_DAYS - totalDaysInWeeks }, (_, i) => totalDaysInWeeks + i + 1);

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
               </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="flex flex-col items-center p-4 bg-secondary/30 rounded-lg">
                    <div className="p-2 bg-background rounded-full mb-2">
                        <Flame className="h-8 w-8 text-destructive" />
                    </div>
                  <p className="text-2xl font-bold">{userProfile.streak}</p>
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
                  <p className="text-2xl font-bold">{TOTAL_CHALLENGE_DAYS - completedDaysSet.size}</p>
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
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: '#EF4444', color: 'white' }} className="border-none">{activePath}</Badge>
                    <Badge variant="outline" className="font-normal">
                      <span className="font-bold text-foreground">{completedDaysSet.size}</span>
                      <span className="text-muted-foreground">/{TOTAL_CHALLENGE_DAYS} days complete</span>
                    </Badge>
                  </div>
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
                     {remainingDays.length > 0 && (
                        <div className="flex justify-center items-center gap-2 pt-2">
                            {remainingDays.map(day => {
                                const isCompleted = completedDaysSet.has(day);
                                return (
                                     <Badge key={day} variant="outline" className="bg-background text-foreground border">
                                        Day {day}
                                     </Badge>
                                )
                            })}
                        </div>
                    )}
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
                        {calendarDays.length > 0 ? calendarDays.map((dayInfo) => {
                            const { day, isCompleted, isActive, isClickable, completionDate } = dayInfo;
                            
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
                                        {isCompleted && completionDate && (
                                            <p className="text-white">
                                                {completionDate}
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
                                <div key={day} className="opacity-50">
                                    {dayContent}
                                </div>
                            )
                        }) : (
                            // Render placeholders or skeletons while waiting for client-side hydration
                            Array.from({ length: TOTAL_CHALLENGE_DAYS }, (_, i) => (
                                <div key={i} className="aspect-square bg-secondary/30 rounded-lg" />
                            ))
                        )}
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
      <BottomNav activeTab="Progress" currentDay={currentDay}/>
    </div>
  );
}


export default function ProgressPage() {
    return (
        <PrivateRoute>
            <ProgressPageContent />
        </PrivateRoute>
    )
}
