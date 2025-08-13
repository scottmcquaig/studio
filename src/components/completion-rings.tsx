'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface RingProps {
  value: number;
  label: string;
  color: string;
}

const CompletionRing = ({ value, label, color }: RingProps) => {
  const data = [
    { name: 'completed', value: value, color: color },
    { name: 'remaining', value: 100 - value, color: 'hsl(var(--muted))' },
  ];

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: '100%', height: 120 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              dataKey="value"
              innerRadius={40}
              outerRadius={50}
              startAngle={90}
              endAngle={450}
              paddingAngle={0}
              cornerRadius={5}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke={entry.color} />
              ))}
              <Label
                value={`${value}%`}
                position="center"
                className="fill-foreground font-headline text-2xl"
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-sm font-semibold text-muted-foreground">{label}</p>
    </div>
  );
};

interface CompletionRingsProps {
  completedToday: boolean;
  weeklyCompleted: number;
  monthlyCompleted: number;
}

export default function CompletionRings({
  completedToday,
  weeklyCompleted,
  monthlyCompleted,
}: CompletionRingsProps) {
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Completion Status</CardTitle>
        <CardDescription>Your progress at a glance.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center">
          <CompletionRing value={completedToday ? 100 : 0} label="Today" color="hsl(var(--chart-1))" />
          <CompletionRing value={Math.round((weeklyCompleted / 7) * 100)} label="This Week" color="hsl(var(--chart-1))" />
          <CompletionRing value={Math.round((monthlyCompleted / 30) * 100)} label="Challenge" color="hsl(var(--chart-1))" />
        </div>
      </CardContent>
    </Card>
  );
}
