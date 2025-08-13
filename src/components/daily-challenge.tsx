'use client';

import type { Challenge } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface DailyChallengeProps {
  challenge: Challenge;
  day: number;
  isCompleted: boolean;
  onComplete: (day: number) => void;
}

export default function DailyChallenge({ challenge, day, isCompleted, onComplete }: DailyChallengeProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Day {day} of 30</CardDescription>
        <CardTitle className="font-headline text-3xl">{challenge.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">{challenge.description}</p>
          <blockquote className="border-l-4 border-primary pl-4 italic">
            <p>{challenge.quote.text}</p>
            <footer className="text-sm text-right mt-2">&mdash; {challenge.quote.author}</footer>
          </blockquote>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onComplete(day)} 
          disabled={isCompleted}
          className="w-full md:w-auto"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isCompleted ? "Day Complete" : "Mark as Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
}
