'use client';

import type { Challenge } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TodaysChallengeCardProps {
  day: number;
  challenge: Challenge;
}

export default function TodaysChallengeCard({ day, challenge }: TodaysChallengeCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="font-bold">Day {day}</Badge>
            <Badge variant="outline" className="text-primary border-primary">Ready to Start</Badge>
          </div>
          <h2 className="text-xl font-bold font-headline text-primary">Begin Today's Challenge</h2>
          <p className="text-muted-foreground text-sm mt-1">Set your intention and begin today's stoic practice.</p>
        </div>
        <Button>
          Continue Journey
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
