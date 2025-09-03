
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Lock } from 'lucide-react';

export default function UnlockPathCard() {
  return (
    <Card className="shadow-sm">
      <CardContent className="pt-6 text-center">
        <Lock className="h-10 w-10 text-accent mx-auto mb-4" />
        <h2 className="text-xl font-bold font-headline text-primary">Your Journey Awaits</h2>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          You are not currently on a challenge path. Unlock a path to begin your transformation.
        </p>
        <Button asChild className="mt-6">
          <Link href="/programs">
            Unlock a New Path
            <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
