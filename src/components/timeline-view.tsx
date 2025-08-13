'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

interface TimelineViewProps {
  completedDays: Set<number>;
  currentDay: number;
}

const milestones = [
  { day: 1, title: "The Beginning" },
  { day: 7, title: "First Week Done" },
  { day: 15, title: "Halfway There" },
  { day: 30, title: "Challenge Complete" },
];

export default function TimelineView({ completedDays, currentDay }: TimelineViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Transformation Timeline</CardTitle>
        <CardDescription>Your journey, day by day.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 w-full pr-4">
          <div className="relative pl-6">
            {/* The timeline line */}
            <div className="absolute left-8 top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>
            
            <div className="space-y-4">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
                const isCompleted = completedDays.has(day);
                const isCurrent = day === currentDay;
                const milestone = milestones.find(m => m.day === day);

                return (
                  <div key={day} className="flex items-start gap-4">
                    <div className="flex-shrink-0 relative z-10">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center",
                          isCompleted ? "bg-primary" : "bg-muted",
                          isCurrent && !isCompleted && "ring-2 ring-primary ring-offset-2 ring-offset-card"
                        )}
                      >
                        {isCompleted && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <div className="pt-px">
                      <p className={cn(
                        "font-semibold text-sm",
                        isCurrent && "text-primary"
                      )}>
                        Day {day}
                        {milestone && <span className="ml-2 font-normal text-muted-foreground italic">&mdash; {milestone.title}</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
