'use client';

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function BuildLegacyCard() {
  return (
    <Card className="shadow-sm border-dashed">
      <CardContent className="pt-6 text-center">
        <BookOpen className="h-10 w-10 text-primary/70 mx-auto mb-4" />
        <h2 className="text-xl font-bold font-headline text-primary">Build Your Legacy</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Every entry is a step toward the man you're becoming. Each reflection builds the
          discipline that will serve you long after these 30 days. Show up. Do the work. Become STOIC AF.
        </p>
      </CardContent>
    </Card>
  );
}
