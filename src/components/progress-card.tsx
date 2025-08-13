'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, CheckCircle2, Calendar } from 'lucide-react';

interface ProgressCardProps {
  streak: number;
  daysCompleted: number;
  daysRemaining: number;
  progress: number;
}

export default function ProgressCard({ streak, daysCompleted, daysRemaining, progress }: ProgressCardProps) {
  return (
    <Card className="bg-secondary/50 border-none shadow-sm">
      <CardContent className="pt-6">
        <div className="grid grid-cols-3 gap-4 text-center mb-4">
          <div className="flex flex-col items-center">
            <Flame className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-2xl font-bold">{streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="flex flex-col items-center">
            <CheckCircle2 className="h-8 w-8 text-accent mb-2" />
            <p className="text-2xl font-bold">{daysCompleted}/30</p>
            <p className="text-xs text-muted-foreground">Days Completed</p>
          </div>
          <div className="flex flex-col items-center">
            <Calendar className="h-8 w-8 text-primary/70 mb-2" />
            <p className="text-2xl font-bold">{daysRemaining}</p>
            <p className="text-xs text-muted-foreground">Days Remaining</p>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-muted-foreground">Challenge Progress</span>
            <span className="font-bold text-foreground">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
