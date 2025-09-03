
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState, useEffect, useCallback } from 'react';
import { tracks as allTracks } from '@/lib/tracks.json';
import { challenges as allChallenges } from '@/lib/challenges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Edit, PlusCircle, Save } from 'lucide-react';
import type { Challenge } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

type Track = typeof allTracks[0];

export default function TrackEditorPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    
    const [track, setTrack] = useState<Track | null>(null);
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [selectedDay, setSelectedDay] = useState<Challenge | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [weekNames, setWeekNames] = useState<Track['weeks']>([]);


    const fetchTrackData = useCallback(() => {
        if (params.slug) {
            const currentTrack = allTracks.find(t => t.slug === params.slug);
            if (currentTrack) {
                setTrack(currentTrack);
                setWeekNames(currentTrack.weeks);
                const trackChallenges = allChallenges.filter(c => c.track === currentTrack.display_name);
                setChallenges(trackChallenges);
            } else {
                router.push('/backstage');
            }
        }
    }, [params.slug, router]);

    useEffect(() => {
        fetchTrackData();
    }, [fetchTrackData]);

    const handleEditDay = (day: Challenge) => {
        setSelectedDay(day);
        setIsSheetOpen(true);
    };

    const handleFieldChange = (field: keyof Challenge, value: string | number | object) => {
        if (selectedDay) {
            setSelectedDay({ ...selectedDay, [field]: value });
        }
    };
    
    const handleQuoteChange = (field: 'text' | 'author', value: string) => {
        if (selectedDay) {
            setSelectedDay({
                ...selectedDay,
                quote: {
                    ...selectedDay.quote,
                    [field]: value,
                }
            })
        }
    }

    const handleUpdateDay = async () => {
        if (!selectedDay) return;

        const updatedChallenges = allChallenges.map(c => 
            c.day === selectedDay.day && c.track === track?.display_name ? selectedDay : c
        );
        
        try {
            const response = await fetch('/api/challenges', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ challenges: updatedChallenges }),
            });

            if (!response.ok) {
                throw new Error('Failed to update challenges');
            }
            
            toast({
                title: "Challenge Updated!",
                description: "The daily challenge has been saved. Reloading to see changes.",
            });

            setTimeout(() => window.location.reload(), 1500);

        } catch (error) {
            console.error("Error updating challenge:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem saving the challenge.",
            });
        } finally {
            setIsSheetOpen(false);
        }
    };
    
    const handleAddWeek = () => {
        setWeekNames(prev => [...prev, { week: prev.length + 1, name: `Week ${prev.length + 1}` }]);
    };

    const handleWeekNameChange = (index: number, newName: string) => {
        setWeekNames(prev => {
            const newWeeks = [...prev];
            newWeeks[index].name = newName;
            return newWeeks;
        });
    };
    
    const handleSaveWeeks = async () => {
        if (!track) return;

        const updatedTrack = { ...track, weeks: weekNames, numberOfWeeks: weekNames.length };
        const updatedTracks = allTracks.map(t => t.id === updatedTrack.id ? updatedTrack : t);

        try {
            const response = await fetch('/api/tracks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tracks: updatedTracks }),
            });

            if (!response.ok) throw new Error('Failed to update tracks');
            
            toast({
                title: "Weeks Updated!",
                description: "The week names have been saved. Reloading page.",
            });

            // Reload the page to reflect changes and avoid HMR issues
            window.location.reload();

        } catch (error) {
            console.error("Error updating weeks:", error);
            toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: "There was a problem saving the week names.",
            });
        }
    };

    if (!track) {
        return <div className="flex h-screen items-center justify-center">Loading track...</div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <header className="py-4 bg-card border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 max-w-5xl flex justify-between items-center">
                    <Button variant="outline" asChild>
                        <Link href="/backstage">
                            <ArrowLeft className="mr-2" />
                            Back to Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-xl font-bold font-headline text-primary">Editing: {track.full_name}</h1>
                    <Button>
                        <PlusCircle className="mr-2" />
                        Add Day
                    </Button>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Track Weeks</CardTitle>
                            <CardDescription>Edit the names for each week of the challenge.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {weekNames.map((week, index) => (
                                <div key={week.week} className="flex items-center gap-2">
                                    <Label htmlFor={`week-${week.week}`} className="w-20">Week {week.week}</Label>
                                    <Input 
                                        id={`week-${week.week}`} 
                                        value={week.name}
                                        onChange={(e) => handleWeekNameChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                        <CardContent className="flex gap-2">
                             <Button variant="secondary" onClick={handleSaveWeeks}><Save className="mr-2" />Save Week Names</Button>
                             <Button variant="outline" onClick={handleAddWeek}><PlusCircle className="mr-2" />Add Week</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Entries</CardTitle>
                            <CardDescription>Manage the content for each day of the {track.full_name} challenge.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {challenges.sort((a,b) => a.day - b.day).map(day => (
                                <div key={day.day} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                                    <div>
                                        <p className="font-semibold">Day {day.day}: <span className="font-normal">{day.title}</span></p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleEditDay(day)}>
                                        <Edit className="h-5 w-5" />
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[400px] sm:w-[640px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Edit Day {selectedDay?.day}</SheetTitle>
                        <SheetDescription>
                            Make changes to the daily challenge content. Click save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    {selectedDay && (
                        <div className="space-y-4 py-4 pr-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={selectedDay.title} onChange={(e) => handleFieldChange('title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="badgeTitle">Badge Title</Label>
                                <Input id="badgeTitle" value={selectedDay.badgeTitle || ''} onChange={(e) => handleFieldChange('badgeTitle', e.target.value)} placeholder={`Day ${selectedDay.day}`} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Input id="description" value={selectedDay.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quote-text">Quote Text</Label>
                                <Textarea id="quote-text" value={selectedDay.quote.text} onChange={(e) => handleQuoteChange('text', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="quote-author">Quote Author</Label>
                                <Input id="quote-author" value={selectedDay.quote.author} onChange={(e) => handleQuoteChange('author', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bro-translation">Bro Translation</Label>
                                <Textarea id="bro-translation" className="min-h-[120px]" value={selectedDay.broTranslation} onChange={(e) => handleFieldChange('broTranslation', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="challenge">Today's Challenge</Label>
                                <Textarea id="challenge" className="min-h-[120px]" value={selectedDay.challenge} onChange={(e) => handleFieldChange('challenge', e.target.value)} />
                            </div>
                              <div className="space-y-2">
                                <Label htmlFor="morning-prompt">Morning Prompt</Label>
                                <Textarea id="morning-prompt" value={selectedDay.morningPrompt} onChange={(e) => handleFieldChange('morningPrompt', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="evening-prompt">Evening Prompt</Label>
                                <Textarea id="evening-prompt" className="min-h-[120px]" value={selectedDay.eveningPrompt} onChange={(e) => handleFieldChange('eveningPrompt', e.target.value)} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="wins-title">Wins Title</Label>
                                <Input id="wins-title" value={selectedDay.winsTitle} onChange={(e) => handleFieldChange('winsTitle', e.target.value)} />
                            </div>
                        </div>
                    )}
                    <SheetFooter>
                        <SheetClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button type="submit" onClick={handleUpdateDay}><Save className="mr-2"/>Update Day</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
            <Toaster />
        </div>
    );
}
