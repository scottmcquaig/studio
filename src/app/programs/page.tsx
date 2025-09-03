
'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, DollarSign, Brain, Target, Lock, ArrowRight, Check, Loader2, AlertTriangle, Info, CheckCircle } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import Link from "next/link";
import { tracks as allTracks } from "@/lib/tracks.json";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getUserProfile } from "@/ai/flows/get-user-profile";
import { validateUnlockCode } from "@/ai/flows/validate-unlock-code";
import type { ValidatedCode } from "@/lib/types";
import { cn } from "@/lib/utils";
import { unlockAndAddPaths } from "@/ai/flows/unlock-and-add-paths";
import { switchActivePath } from "@/ai/flows/switch-active-path";

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

export default function ProgramsPage() {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    
    const [unlockCode, setUnlockCode] = useState("");
    const [isValidating, setIsValidating] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    
    const [validatedCode, setValidatedCode] = useState<ValidatedCode | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

    const activeTrack = userProfile?.activePath ? allTracks.find(t => t.id === userProfile.activePath) : null;
    
    const fetchProfile = async () => {
        if (user) {
            try {
                setLoadingProfile(true);
                const profile = await getUserProfile({ uid: user.uid });
                setUserProfile(profile);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not load your profile. Please try again."
                });
            } finally {
                setLoadingProfile(false);
            }
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const handleValidateCode = async () => {
        if (!unlockCode) return;
        setIsValidating(true);
        try {
            const result = await validateUnlockCode({ code: unlockCode });
            if (!result.isValid) {
                toast({
                    variant: "destructive",
                    title: "Invalid Code",
                    description: result.error,
                });
                return;
            }
            
            // Filter out paths the user already has
            let availablePaths: string[] | 'all' = [];
            if (result.paths === 'all') {
                const unlockedIds = userProfile?.unlockedPaths === 'all' ? allTracks.map(t=>t.id) : (userProfile?.unlockedPaths || []);
                availablePaths = allTracks.filter(t => !unlockedIds.includes(t.id)).map(t => t.id);
            } else if (Array.isArray(result.paths) && Array.isArray(userProfile?.unlockedPaths)) {
                 availablePaths = result.paths.filter(p => !userProfile.unlockedPaths.includes(p));
            } else {
                 availablePaths = result.paths || [];
            }
            
            if (availablePaths.length === 0) {
                 toast({
                    title: "No New Paths",
                    description: "This code is valid, but it doesn't grant access to any paths you don't already have.",
                });
                return;
            }

            const updatedResult = {...result, paths: availablePaths};

            setValidatedCode(updatedResult);

            if (updatedResult.accessType === 'adminOne' && Array.isArray(updatedResult.paths) && updatedResult.paths.length === 1) {
                const trackToSelect = allTracks.find(t => t.id === updatedResult.paths![0]);
                setSelectedTrack(trackToSelect || null);
            }
            
            setIsModalOpen(true);

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "An unexpected error occurred. Please try again."
            })
        } finally {
            setIsValidating(false);
        }
    };

    const handleUnlock = async () => {
        if (!user || !validatedCode || (!selectedTrack && validatedCode.accessType === 'userOne')) {
            toast({ variant: "destructive", title: "Missing Information" });
            return;
        }

        setIsUnlocking(true);
        try {
            let pathsToAdd: string[] | 'all' = [];
            if (validatedCode.accessType === 'userOne' && selectedTrack) {
                pathsToAdd = [selectedTrack.id];
            } else {
                pathsToAdd = validatedCode.paths || [];
            }
            
            await unlockAndAddPaths({
                uid: user.uid,
                pathsToAdd,
                unlockCode: unlockCode,
            });

            toast({
                title: "Success!",
                description: "New challenge path(s) have been added to your account.",
            });
            
            // Refresh profile and close modal
            await fetchProfile();
            handleCloseModal();
            setUnlockCode("");

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Unlock Failed",
                description: "There was a problem unlocking the new path."
            })
        } finally {
            setIsUnlocking(false);
        }
    }

    const handleSwitchTrack = async (trackId: string) => {
        if (!user) return;
        if (!confirm("Are you sure you want to switch your active challenge? Your current progress will be saved.")) {
            return;
        }
        try {
            await switchActivePath({ uid: user.uid, newTrackId: trackId });
            await fetchProfile();
            toast({
                title: "Challenge Switched!",
                description: "Your active challenge has been updated."
            });
            window.location.href = '/'; // Redirect to dashboard
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Switch Failed",
                description: "Could not switch your active challenge. Please try again."
            })
        }
    }

    const handleSelectTrack = (track: Track) => {
        if (!validatedCode) return;
        if (validatedCode.accessType === 'adminOne' && validatedCode.paths !== 'all' && !validatedCode.paths.includes(track.id)) {
            return; // Don't allow selection if code is for a specific track
        }
        setSelectedTrack(track);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setValidatedCode(null);
        setSelectedTrack(null);
    }

    const renderButton = (track: Track) => {
        if (!userProfile) return <Button disabled>Unlock Path</Button>;

        const isUnlocked = userProfile.unlockedPaths === 'all' || (Array.isArray(userProfile.unlockedPaths) && userProfile.unlockedPaths.includes(track.id));
        const isActive = userProfile.activePath === track.id;

        if (isActive) {
            return <Button variant="secondary" className="w-full bg-accent/20 text-accent-foreground hover:bg-accent/30" disabled>Active Challenge</Button>
        }
        if (isUnlocked) {
             if (userProfile.activePath) {
                return <Button onClick={() => handleSwitchTrack(track.id)} className="w-full">Switch to this Challenge</Button>
             } else {
                return <Button onClick={() => handleSwitchTrack(track.id)} className="w-full">Start Challenge</Button>
             }
        }
        return <Button disabled className="w-full">Unlock Path for $4</Button>
    }

    if (authLoading || loadingProfile) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    let availableTracksForModal: Track[] = [];
    if (validatedCode) {
        if (validatedCode.paths === 'all') {
            availableTracksForModal = allTracks;
        } else if (validatedCode.paths) {
            availableTracksForModal = allTracks.filter(t => validatedCode.paths!.includes(t.id));
        }
    }

    const isLockedByCode = validatedCode?.accessType === 'adminOne' && Array.isArray(validatedCode.paths) && validatedCode.paths.length === 1;

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
                             <Badge variant="default">In Progress</Badge>
                        </div>
                        <CardDescription>
                            You are currently on the {activeTrack.full_name} path. Focus and continue your journey.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild className="w-full">
                            <Link href="/">View Dashboard <ArrowRight className="ml-2"/></Link>
                        </Button>
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
                    <input 
                        type="text" 
                        placeholder="Enter Your Code" 
                        className="flex-grow p-2 border rounded-md"
                        value={unlockCode}
                        onChange={(e) => setUnlockCode(e.target.value)}
                        disabled={isValidating}
                    />
                    <Button onClick={handleValidateCode} disabled={isValidating || !unlockCode}>
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
                        <CardTitle className="font-headline text-2xl text-primary">Unlock All Tracks</CardTitle>
                        <Badge variant="destructive">Best Value</Badge>
                    </div>
                     <CardDescription>
                        Get access to all current and future Stoic AF challenge tracks for a one-time price.
                    </CardDescription>
                </CardHeader>
                 <CardFooter className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex-grow text-center sm:text-left">
                        <p><span className="font-bold">One-time purchase:</span> <span className="line-through">$16.00</span> <span className="font-bold text-accent">$9.00</span></p>
                    </div>
                    <Button size="lg" className="w-full sm:w-auto" disabled>
                        Unlock Everything
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </main>

      <Dialog open={isModalOpen} onOpenChange={(isOpen) => { if(!isOpen) handleCloseModal() }}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Unlock Your Path</DialogTitle>
                <DialogDescription>
                    Your code is valid. Please select the challenge path you wish to unlock.
                </DialogDescription>
            </DialogHeader>
            
            {validatedCode?.accessType === 'userOne' && (
                <div className="space-y-2 py-4">
                    <p className="font-semibold text-sm">Please choose one path to unlock:</p>
                    {availableTracksForModal.map(track => {
                        const isSelected = selectedTrack?.id === track.id;
                        return (
                            <button
                                key={track.id}
                                onClick={() => setSelectedTrack(track)}
                                className={cn(
                                    "w-full text-left p-3 border rounded-lg flex items-center gap-4 transition-all",
                                    isSelected ? "border-accent ring-2 ring-accent bg-accent/10" : "bg-secondary/30 hover:bg-secondary/60"
                                )}
                            >
                                <span className="flex-grow font-medium">{track.full_name}</span>
                                {isSelected && <CheckCircle className="text-accent"/>}
                            </button>
                        )
                    })}
                </div>
            )}

            {(validatedCode?.accessType === 'adminOne' || validatedCode?.accessType === 'adminMulti' || validatedCode?.accessType === 'allCurrent' || validatedCode?.accessType === 'allEvergreen') && (
                 <div className="space-y-2 py-4">
                    <div className="p-3 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        <p className="text-sm font-semibold">This code will unlock the following path(s):</p>
                    </div>
                     <ul className="list-disc pl-5 space-y-1 pt-2">
                        {availableTracksForModal.map(track => <li key={track.id}>{track.full_name}</li>)}
                    </ul>
                </div>
            )}

            <DialogFooter>
                <Button variant="outline" onClick={handleCloseModal} disabled={isUnlocking}>Cancel</Button>
                <Button onClick={handleUnlock} disabled={isUnlocking || (validatedCode?.accessType === 'userOne' && !selectedTrack)}>
                    {isUnlocking ? <Loader2 className="mr-2 animate-spin" /> : <Check className="mr-2" />}
                    {isUnlocking ? 'Unlocking...' : 'Unlock Challenge'}
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>


      <BottomNav activeTab="Challenges" />
    </div>
  );
}
