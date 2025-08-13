'use client';

import { useState, useEffect } from 'react';
import type { JournalEntry } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface JournalEntryProps {
  day: number;
  entry: JournalEntry;
  onSave: (day: number, entry: JournalEntry) => void;
}

export default function JournalEntryComponent({ day, entry, onSave }: JournalEntryProps) {
  const [morning, setMorning] = useState(entry.morning);
  const [evening, setEvening] = useState(entry.evening);
  const [wins, setWins] = useState(entry.wins);
  const { toast } = useToast();

  useEffect(() => {
    setMorning(entry.morning);
    setEvening(entry.evening);
    setWins(entry.wins);
  }, [day, entry]);

  const handleSave = () => {
    onSave(day, { morning, evening, wins });
    toast({
      title: "Journal Saved",
      description: `Your entry for day ${day} has been saved.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Daily Journal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full gap-1.5">
          <Label htmlFor="morning">Morning Intentions</Label>
          <Textarea 
            placeholder="What is your focus for today?" 
            id="morning" 
            value={morning}
            onChange={(e) => setMorning(e.target.value)}
            rows={3}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="evening">Evening Reflections</Label>
          <Textarea 
            placeholder="How did you apply stoic principles today?" 
            id="evening" 
            value={evening}
            onChange={(e) => setEvening(e.target.value)}
            rows={5}
          />
        </div>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="wins">Quick Wins</Label>
          <Textarea 
            placeholder="List any small victories or positive moments." 
            id="wins" 
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full md:w-auto">Save Journal</Button>
      </CardFooter>
    </Card>
  );
}
