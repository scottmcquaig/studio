
'use client';

import BottomNav from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tracks as allTracks } from "@/lib/tracks.json";
import { Edit, Archive, PlusCircle, FolderPlus, DollarSign, Heart, Target, Brain } from "lucide-react";
import { useMemo } from "react";

// Helper to get the correct icon component
const iconMap: { [key: string]: React.ComponentType<any> } = {
  "dollar-sign": DollarSign,
  "heart": Heart,
  "target": Target,
  "brain": Brain,
};

export default function BackstagePage() {
    
    const tracksByCategory = useMemo(() => {
        return allTracks.reduce((acc, track) => {
            const category = track.category || "Uncategorized";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(track);
            return acc;
        }, {} as Record<string, typeof allTracks>);
    }, []);

    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 bg-card border-b">
        <div className="container mx-auto px-4 max-w-5xl flex justify-between items-center">
          <h1 className="text-xl font-bold font-headline text-primary">Backstage Admin</h1>
          <div className="flex gap-2">
            <Button variant="outline">
                <FolderPlus className="mr-2" />
                Add Category
            </Button>
            <Button>
                <PlusCircle className="mr-2" />
                Add Track
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-8">
            {Object.entries(tracksByCategory).map(([category, tracks]) => (
                <Card key={category}>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary">{category}</CardTitle>
                        <CardDescription>Manage tracks within this category.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tracks.map(track => {
                            const Icon = iconMap[track.icon];
                            return (
                                <div key={track.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                                    <div className="flex items-center gap-4">
                                        {Icon && <Icon style={{ color: track.color }} className="h-8 w-8" />}
                                        <div>
                                            <h3 className="font-semibold text-primary">{track.full_name}</h3>
                                            <p className="text-sm text-muted-foreground">{track.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-5 w-5" />
                                            <span className="sr-only">Edit Track</span>
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Archive className="h-5 w-5" />
                                            <span className="sr-only">Archive Track</span>
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </CardContent>
                </Card>
            ))}
        </div>
      </main>
      <BottomNav activeTab="User" />
    </div>
  );
}
