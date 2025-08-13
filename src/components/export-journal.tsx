'use client';

import type { Challenge, JournalEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Download } from 'lucide-react';

interface ExportJournalProps {
  journalEntries: Record<number, JournalEntry>;
  challenges: Challenge[];
}

export default function ExportJournal({ journalEntries, challenges }: ExportJournalProps) {
  const { toast } = useToast();

  const handleExport = () => {
    // In a real application, this would trigger a PDF generation library.
    // For now, it's a placeholder.
    console.log('Exporting journal:', { journalEntries, challenges });
    toast({
      title: "Export Started",
      description: "PDF generation is a feature coming soon!",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Your Journal</CardTitle>
        <CardDescription>Export your 30-day journey to a PDF document.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleExport} className="w-full">
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </Button>
      </CardContent>
    </Card>
  );
}
