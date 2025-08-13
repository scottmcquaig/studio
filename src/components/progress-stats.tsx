'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressStatsProps {
  weeklyCompleted: number;
  totalCompleted: number;
  completionPercentage: number;
}

export default function ProgressStats({ weeklyCompleted, totalCompleted, completionPercentage }: ProgressStatsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Weekly Completion</span>
            <span className="text-sm text-muted-foreground">{weeklyCompleted} / 7 days</span>
          </div>
          <Progress value={(weeklyCompleted / 7) * 100} />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Total Completion</span>
            <span className="text-sm text-muted-foreground">{totalCompleted} / 30 days</span>
          </div>
          <Progress value={completionPercentage} />
        </div>
      </CardContent>
    </Card>
  );
}
