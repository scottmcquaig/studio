
'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, DollarSign, Brain, Target, Lock, ArrowRight, Check, Loader2, AlertTriangle, Info, Pause, Trash2, Star, CheckCircle } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import Link from "next/link";
import { tracks as allTracks } from "@/lib/tracks.json";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Track = typeof allTracks[0];

const iconMap: { [key: string]: React.ComponentType<any> } = {
  "dollar-sign": DollarSign,
  "heart": Heart,
  "target": Target,
  "brain": Brain,
};

interface UserProfile {
    activePath: string | null;
    unlockedPaths: string[] | 'all';
}

export default function MockProgramsPage() {
    const { toast } = useToast();
    
    const [userProfile, setUserProfile] = useState<UserProfile | null>({ activePath: 'RELATIONSHIPS', unlockedPaths: ['RELATIONSHIPS', 'MONEY']});
    
    const [unlockCode, setUnlockCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    
    const [isUnlockPromptOpen, setIsUnlockPromptOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    const activeTrack = userProfile?.activePath ? allTracks.find(t => t.id === userProfile.activePath) : null;

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        const numbers = input.replace(/\D/g, '');
        let formatted = '';
        if (numbers.length > 0) {
            formatted = numbers.substring(0, 4);
        }
        if (numbers.length > 4) {
            formatted += '-' + numbers.substring(4, 8);
        }
        if (numbers.length > 8) {
            formatted += '-' + numbers.substring(8, 12);
        }
        setUnlockCode(formatted);
    };

    const handleValidateCode = async () => {
        if (unlockCode.replace(/-/g, '').length < 12) return;
        setIsValidating(true);
        toast({
            title: "Mock Validation",
            description: "This is a mock-up. In the real app, this would validate your code.",
        });
        setTimeout(() => setIsValidating(false), 1000);
    };

    const handleSwitchTrack = async (trackId: string) => {
        toast({
            title: "Challenge Switched!",
            description: "Your active challenge has been updated."
        });
        setUserProfile(prev => prev ? { ...prev, activePath: trackId } : null);
    }
    
    const handleUnlockClick = (track: Track | null) => { // Allow null for "Unlock All"
        setSelectedTrack(track);
        setUnlockCode("");
        setIsUnlockPromptOpen(true);
    };

    const handleAbandonChallenge = async () => {
        toast({ title: "Challenge Abandoned (Archived)", description: "Your progress has been archived."});
        setUserProfile(prev => prev ? { ...prev, activePath: null } : null); // Optimistic update
    }

    const handleDeleteChallenge = async () => {
        toast({ variant: "destructive", title: "Challenge Data Deleted", description: "All data for this challenge has been permanently removed."});
    }

    const renderButton = (track: Track) => {
        if (!userProfile) return <Button disabled>Unlock Path</Button>;

        const isUnlocked = userProfile.unlockedPaths === 'all' || (Array.isArray(userProfile.unlockedPaths) && userProfile.unlockedPaths.includes(track.id));
        const isActive = userProfile.activePath === track.id;

        if (isActive) {
            return <Button variant="outline" className="w-full bg-green-200 text-green-800 hover:bg-green-300" disabled>Challenge In-Progress</Button>
        }
        if (isUnlocked) {
             if (userProfile.activePath) {
                return (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="secondary" className="w-full">Switch to this Challenge</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to switch challenges?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Your progress on the current challenge will be saved. You can always switch back later. A new challenge path will begin for this track.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSwitchTrack(track.id)}>Switch Challenge</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )
             } else {
                return <Button variant="secondary" onClick={() => handleSwitchTrack(track.id)} className="w-full">Start Challenge</Button>
             }
        }
        return (
            <Button variant="default" className="w-full bg-accent hover:bg-accent/90 gap-1" onClick={() => handleUnlockClick(track)}>
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-white/20 font-headline text-sm font-bold">
                    $4
                </div>
                Unlock Path
            </Button>
        );
    }

    let lockedPathsCount = 0;
    if (userProfile) {
        if (userProfile.unlockedPaths !== 'all') {
            lockedPathsCount = allTracks.length - userProfile.unlockedPaths.length;
        }
    }

    let bundlePrice = 0;
    const retailPrice = 16.00;

    if (lockedPathsCount > 0) {
        switch (lockedPathsCount) {
            case 4: // 0 unlocked
                bundlePrice = 10;
                break;
            case 3: // 1 unlocked
                bundlePrice = 9;
                break;
            case 2: // 2 unlocked
                bundlePrice = 5;
                break;
            case 1: // 3 unlocked
                bundlePrice = 2;
                break;
            default:
                bundlePrice = 0;
        }
    }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 bg-card border-b">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-xl font-bold font-headline text-primary">Stoic AF Challenges</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
            {activeTrack && (
                 <Card className="border-accent ring-2 ring-accent">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                             <CardTitle className="font-headline text-2xl text-primary">Your Active Challenge</CardTitle>
                             <Badge style={{ backgroundColor: activeTrack.color, color: 'white' }} className="border-none">
                                {activeTrack.display_name}
                            </Badge>
                        </div>
                        <CardDescription>
                            You are currently on the {activeTrack.full_name} path. Focus and continue your journey.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex">
                        <div className="flex w-full">
                            <Button asChild className="flex-grow" variant="outline">
                                <Link href="/mock">View Dashboard</Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" aria-label="Pause Challenge" className="ml-2">
                                        <Pause className="h-5 w-5 text-accent"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to switch challenges?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Your progress on the current challenge will be saved. You can always switch back later. A new challenge path will begin for this track.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleAbandonChallenge} className="bg-accent hover:bg-accent/90">Switch Challenge</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="icon" aria-label="Delete Data" className="ml-2">
                                        <Trash2 className="h-5 w-5 text-destructive"/>
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete all your entries and progress for the active challenge. Are you sure you want to proceed?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteChallenge} className="bg-destructive hover:bg-destructive/90">Delete Data</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardFooter>
                </Card>
            )}

            <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">Unlock a New Path</CardTitle>
                    <CardDescription>
                        Already have a code from a book or purchase? Enter it here to unlock your chosen track.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Input 
                        type="tel"
                        placeholder="XXXX-XXXX-XXXX" 
                        className="flex-grow"
                        value={unlockCode}
                        onChange={handleCodeChange}
                        maxLength={14}
                        disabled={isValidating}
                    />
                    <Button onClick={handleValidateCode} disabled={isValidating || unlockCode.replace(/-/g, '').length < 12}>
                        {isValidating ? <Loader2 className="mr-2 animate-spin" /> : <Lock className="mr-2" />}
                        Unlock
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allTracks.map((track) => {
                    const Icon = iconMap[track.icon];
                    return (
                        <Card key={track.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex items-center gap-4">
                                    {Icon && <Icon className={`h-10 w-10`} style={{ color: track.color }} />}
                                    <CardTitle className="font-headline text-xl text-primary">{track.full_name}</CardTitle>
                                </div>
                                <CardDescription className="pt-2">{track.description}</CardDescription>
                            </CardHeader>
                            <CardFooter className="mt-auto">
                               {renderButton(track)}
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle className="font-headline text-2xl text-primary">Bundle & Save</CardTitle>
                        <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-400/80 gap-1">
                            <Star className="h-3 w-3"/>
                            Best Value
                        </Badge>
                    </div>
                     <CardDescription>
                        Get access to all 30-day Stoic Challenges for a discounted price.
                    </CardDescription>
                </CardHeader>
                 <CardFooter className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-grow text-center sm:text-left">
                       {lockedPathsCount > 0 ? (
                            <p>
                                <span className="font-bold">One-time purchase:</span>{' '}
                                <span className="line-through text-muted-foreground">${retailPrice.toFixed(2)}</span>{' '}
                                <span className="font-bold text-accent">${bundlePrice.toFixed(2)}</span>
                            </p>
                        ) : (
                            <p className="font-semibold text-primary">You have unlocked all paths!</p>
                        )}
                    </div>
                    <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90" onClick={() => handleUnlockClick(null)} disabled={lockedPathsCount === 0}>
                        Unlock All
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </main>

      <Dialog open={isUnlockPromptOpen} onOpenChange={setIsUnlockPromptOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Unlock: {selectedTrack?.full_name || 'Challenge Paths'}</DialogTitle>
                 <DialogDescription>
                    Enter your one-time access code to unlock this challenge path.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="code">Access Code</Label>
                    <Input 
                        id="code" 
                        type="tel"
                        value={unlockCode}
                        onChange={handleCodeChange}
                        placeholder="XXXX-XXXX-XXXX"
                        maxLength={14}
                        disabled={isValidating}
                    />
                </div>
                <p className="text-sm text-center text-muted-foreground">
                    Need an access code?{' '}
                    <button 
                        onClick={() => toast({ title: "Online payment is currently down.", description: "Please email support@stoic-af.com to purchase."})}
                        className="underline font-medium text-accent hover:text-accent/80"
                    >
                        Purchase one here.
                    </button>
                </p>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsUnlockPromptOpen(false)} disabled={isValidating}>Cancel</Button>
                <Button onClick={handleValidateCode} disabled={isValidating || unlockCode.replace(/-/g, '').length < 12}>
                     {isValidating ? <Loader2 className="mr-2 animate-spin" /> : <Lock className="mr-2" />}
                    Submit Code
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <BottomNav activeTab="Challenges" isMock={true} />
    </div>
  );
}
