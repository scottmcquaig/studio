'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useMemo } from 'react';
import type { Challenge } from '@/lib/types';
import { challenges as allChallenges } from '@/lib/challenges';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Star, Sparkles, MessageCircle, Edit, Lock } from 'lucide-react';
import BottomNav from '@/components/bottom-nav';

// This is a placeholder for a more robust state management
const MOCK_COMPLETED_DAYS = new Set([1]);
const CURRENT_CHALLENGE_DAY = 2; // Assuming Day 2 is the current challenge

export default function DailyPromptPage() {
  const params = useParams();
  const day = parseInt(params.day as string, 10);

  const challenge: Challenge | undefined = useMemo(() => {
    if (isNaN(day) || day < 1 || day > 30) {
      return undefined;
    }
    return allChallenges[day - 1];
  }, [day]);

  const isCompleted = MOCK_COMPLETED_DAYS.has(day);
  const isCurrentDay = day === CURRENT_CHALLENGE_DAY;
  const isFutureDay = day > CURRENT_CHALLENGE_DAY;

  if (!challenge) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl text-center">
          <h1 className="text-2xl font-bold font-headline text-primary mb-4">Challenge Not Found</h1>
          <p className="text-muted-foreground mb-8">The challenge for the specified day could not be found.</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2" />
              Back to Challenge Home
            </Link>
          </Button>
        </main>
        <BottomNav activeTab="Daily" currentDay={CURRENT_CHALLENGE_DAY}/>
      </div>
    );
  }
  
  const navLinks = {
    prev: day > 1 ? `/day/${day - 1}` : null,
    next: day < 30 ? `/day/${day + 1}` : null,
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 bg-card border-b">
        <div className="container mx-auto px-4 max-w-3xl flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft />
              <span className="ml-2 hidden sm:inline">Back</span>
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold font-headline text-primary">Daily Entry</h1>
          </div>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">

          <div className="text-center">
            <h2 className="text-xl font-bold font-headline text-primary">Day {challenge.day}: {challenge.title}</h2>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 text-accent" />
                <CardTitle className="font-headline text-2xl text-primary">Today's Stoic Practice</CardTitle>
              </div>
              <CardDescription className="pl-9">{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <blockquote className="border-l-4 border-accent pl-4 py-2 bg-secondary/30 rounded-r-lg ml-9">
                  <p className="italic text-primary/90">"{challenge.quote.text}"</p>
                  <footer className="text-sm text-right mt-2 text-muted-foreground pr-4">&mdash; {challenge.quote.author}</footer>
                </blockquote>
            </CardContent>
          </Card>
          
          {isFutureDay ? (
            <Card className="text-center">
                <CardHeader>
                    <div className="flex items-center justify-center gap-3">
                        <Lock className="h-6 w-6 text-muted-foreground" />
                        <CardTitle className="font-headline text-2xl text-primary">Challenge Locked</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">This challenge will be available on Day {day}.</p>
                </CardContent>
            </Card>
          ) : (
             <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-accent" />
                    <CardTitle className="font-headline text-2xl text-primary">Your Journal</CardTitle>
                  </div>
                  <CardDescription className="pl-9">Document your thoughts and reflections for the day.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pl-9">
                  <div className="space-y-2">
                    <Label htmlFor="morning-intention" className="flex items-center gap-2 font-semibold text-primary">
                        <MessageCircle className="h-4 w-4" />
                        Morning Intention
                    </Label>
                    <Textarea id="morning-intention" placeholder="What is your primary goal for today? How will you practice virtue?" className="min-h-[100px]" readOnly={isCompleted && !isCurrentDay} defaultValue={isCompleted ? "This is a pre-filled entry for a completed day." : ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evening-reflection" className="flex items-center gap-2 font-semibold text-primary">
                        <MessageCircle className="h-4 w-4" />
                        Evening Reflection
                    </Label>
                    <Textarea id="evening-reflection" placeholder="What did you learn? Where did you succeed? Where did you fail? How can you improve tomorrow?" className="min-h-[100px]" readOnly={isCompleted && !isCurrentDay} defaultValue={isCompleted ? "This is a pre-filled entry for a completed day." : ""} />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="wins" className="flex items-center gap-2 font-semibold text-primary">
                        <Star className="h-4 w-4" />
                        Today's Wins
                    </Label>
                    <Textarea id="wins" placeholder="What small victories did you achieve today? Acknowledge your progress." className="min-h-[70px]" readOnly={isCompleted && !isCurrentDay} defaultValue={isCompleted ? "This is a pre-filled win for a completed day." : ""} />
                  </div>
                </CardContent>
              </Card>
          )}


          {!isFutureDay && (
            <div className="text-center">
              {isCurrentDay ? (
                 <Button size="lg">
                    <CheckCircle className="mr-2" />
                    Complete Day {challenge.day}
                  </Button>
              ) : (
                  <Button size="lg" variant="secondary">
                    <Edit className="mr-2" />
                    Edit Day {challenge.day}
                  </Button>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center mt-8">
            {navLinks.prev ? (
              <Button variant="outline" asChild>
                <Link href={navLinks.prev}><ArrowLeft className="mr-2" /> Day {day-1}</Link>
              </Button>
            ) : <div />}
            {navLinks.next && isCompleted ? (
              <Button variant="outline" asChild>
                <Link href={navLinks.next}>Day {day+1} <ArrowRight className="ml-2" /></Link>
              </Button>
            ): <div />}
          </div>
        </div>
      </main>
      <BottomNav activeTab="Daily" currentDay={CURRENT_CHALLENGE_DAY}/>
    </div>
  );
}
