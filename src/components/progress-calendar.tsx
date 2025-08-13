'use client';

import { Calendar } from "@/components/ui/calendar"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

interface ProgressCalendarProps {
  challengeStartDate: Date;
  completedDays: Set<number>;
}

export default function ProgressCalendar({ challengeStartDate, completedDays }: ProgressCalendarProps) {
  
  const completedDates = Array.from(completedDays).map(day => {
    const date = new Date(challengeStartDate);
    date.setDate(date.getDate() + day - 1);
    return date;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">30-Day Progress</CardTitle>
        <CardDescription>Your journey visualized.</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <Calendar
          mode="multiple"
          selected={completedDates}
          defaultMonth={challengeStartDate}
          fromDate={challengeStartDate}
          toDate={new Date(new Date(challengeStartDate).setDate(challengeStartDate.getDate() + 29))}
          classNames={{
            day_selected: "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90",
            day: "h-8 w-8",
            head_cell: "w-8",
            row: "w-full",
          }}
          disabled
        />
      </CardContent>
    </Card>
  )
}
