'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getJournalInsights } from '@/ai/flows/journal-insights';
import type { JournalInsightsOutput } from '@/ai/flows/journal-insights';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

interface JournalInsightsProps {
  entries: string[];
}

export default function JournalInsights({ entries }: JournalInsightsProps) {
  const [insights, setInsights] = useState<JournalInsightsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setInsights(null);
    try {
      if (entries.length === 0) {
        toast({
          variant: "destructive",
          title: "Not enough data",
          description: "Write some journal entries first to get insights.",
        });
        return;
      }
      const result = await getJournalInsights({ journalEntries: entries });
      setInsights(result);
    } catch (error) {
      console.error("Failed to get journal insights:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not generate insights at this time. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center justify-between">
            <span>AI-Powered Insights</span>
            <Wand2 className="h-5 w-5 text-accent" />
        </CardTitle>
        <CardDescription>Discover patterns and themes in your journal entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleAnalyze} disabled={isLoading} className="w-full mb-4">
          {isLoading ? 'Analyzing...' : 'Analyze My Journal'}
        </Button>

        {isLoading && <InsightsSkeleton />}

        {insights && (
          <div className="space-y-4">
            <InsightSection title="Overall Sentiment" content={insights.overallSentiment} />
            <InsightSection title="Recurring Themes" badges={insights.recurringThemes} />
            <InsightSection title="Frequent Feelings" badges={insights.frequentlyExpressedFeelings} />
            <InsightSection title="Quick Wins" badges={insights.successfullyExecutedQuickWins} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const InsightSection = ({ title, content, badges }: { title: string; content?: string; badges?: string[] }) => (
    <div>
        <h4 className="font-semibold mb-2">{title}</h4>
        {content && <p className="text-sm text-muted-foreground">{content}</p>}
        {badges && badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
                {badges.map((badge, index) => (
                    <Badge key={index} variant="secondary">{badge}</Badge>
                ))}
            </div>
        )}
        {badges && badges.length === 0 && <p className="text-sm text-muted-foreground">None identified yet.</p>}
    </div>
);


const InsightsSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
    </div>
  </div>
);
