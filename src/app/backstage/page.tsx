
'use client';

import BottomNav from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { tracks as allTracks } from "@/lib/tracks.json";
import { Edit, Archive, PlusCircle, FolderPlus, DollarSign, Heart, Target, Brain, KeyRound, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

// Helper to get the correct icon component
const iconMap: { [key: string]: React.ComponentType<any> } = {
  "dollar-sign": DollarSign,
  "heart": Heart,
  "target": Target,
  "brain": Brain,
};

type Track = typeof allTracks[0];

export default function BackstagePage() {
    const [tracks, setTracks] = useState<Track[]>(allTracks);
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isGenerateCodeOpen, setIsGenerateCodeOpen] = useState(false);
    const [accessType, setAccessType] = useState("user_choice_one");
    const [selectedPaths, setSelectedPaths] = useState<string[]>([]);

    const tracksByCategory = useMemo(() => {
        return tracks.reduce((acc, track) => {
            const category = track.category || "Uncategorized";
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(track);
            return acc;
        }, {} as Record<string, typeof allTracks>);
    }, [tracks]);
    
    const handleEditClick = (track: Track) => {
        setSelectedTrack(track);
        setIsSheetOpen(true);
    };

    const handleUpdateTrack = async () => {
        if (!selectedTrack) return;
        
        const updatedTracks = tracks.map(t => t.id === selectedTrack.id ? selectedTrack : t);

        try {
            const response = await fetch('/api/tracks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tracks: updatedTracks }),
            });

            if (!response.ok) {
                throw new Error('Failed to update tracks');
            }

            setTracks(updatedTracks);
            setIsSheetOpen(false);
            setSelectedTrack(null);
            
            // Reload the page to reflect changes and avoid HMR issues
            window.location.reload();
            
        } catch (error) {
            console.error("Error updating track:", error);
            // Optionally, show an error message to the user
        }
    };

    const handleFieldChange = (field: keyof Track, value: string | number) => {
        if (selectedTrack) {
            setSelectedTrack({ ...selectedTrack, [field]: value });
        }
    };

    const handleGenerateCode = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const email = formData.get('email');
        
        const codeDetails = {
            email,
            accessType,
            paths: accessType === 'admin_choice_one' || accessType === 'admin_choice_multiple' ? selectedPaths : 'all'
        };

        console.log("Generating Code with details:", codeDetails);
        // We will implement the actual code generation logic in the next step.
        
        setIsGenerateCodeOpen(false);
    };

    const handlePathSelection = (trackId: string) => {
        if (accessType === 'admin_choice_one') {
            setSelectedPaths([trackId]);
        } else if (accessType === 'admin_choice_multiple') {
            setSelectedPaths(prev => 
                prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
            );
        }
    };

    return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 bg-card border-b">
        <div className="container mx-auto px-4 max-w-5xl flex justify-between items-center">
          <h1 className="text-xl font-bold font-headline text-primary">Backstage Admin</h1>
          <div className="flex gap-2">
            <Dialog open={isGenerateCodeOpen} onOpenChange={setIsGenerateCodeOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                    <KeyRound className="mr-2" />
                    Generate Code
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Generate Unlock Code</DialogTitle>
                  <DialogDescription>
                    Create a one-time code for a user to unlock access to challenge paths.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleGenerateCode}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">User's Email</Label>
                            <Input id="email" name="email" type="email" required className="col-span-3" />
                        </div>
                        <RadioGroup value={accessType} onValueChange={setAccessType} className="grid grid-cols-1 gap-2 p-2 border rounded-md">
                            <Label className="font-semibold mb-2">Access Level</Label>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="user_choice_one" id="r1" />
                                <Label htmlFor="r1">User choice of 1 path</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="admin_choice_one" id="r2" />
                                <Label htmlFor="r2">Admin choice of 1 specific path</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="admin_choice_multiple" id="r3" />
                                <Label htmlFor="r3">Admin choice of multiple paths</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all_current" id="r4" />
                                <Label htmlFor="r4">Access to all current paths</Label>
                            </div>
                             <div className="flex items-center space-x-2">
                                <RadioGroupItem value="all_indefinite" id="r5" />
                                <Label htmlFor="r5">Indefinite access to all paths</Label>
                            </div>
                        </RadioGroup>
                        
                        {(accessType === 'admin_choice_one' || accessType === 'admin_choice_multiple') && (
                            <div className="grid grid-cols-1 gap-2 p-2 border rounded-md">
                                <Label className="font-semibold mb-2">Select Paths</Label>
                                {allTracks.map(track => (
                                    <div key={track.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={track.id}
                                            checked={selectedPaths.includes(track.id)}
                                            onCheckedChange={() => handlePathSelection(track.id)}
                                        />
                                        <Label htmlFor={track.id}>{track.full_name}</Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsGenerateCodeOpen(false)}>Cancel</Button>
                        <Button type="submit">
                            <Check className="mr-2" />
                            Generate Code
                        </Button>
                    </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
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
            {Object.entries(tracksByCategory).map(([category, categoryTracks]) => (
                <Card key={category}>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl text-primary">{category}</CardTitle>
                        <CardDescription>Manage tracks within this category.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {categoryTracks.map(track => {
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
                                        <Button variant="ghost" size="icon" onClick={() => handleEditClick(track)}>
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
                <SheetTitle>Edit Track</SheetTitle>
                <SheetDescription>
                    Make changes to the track details here. Click save when you're done.
                </SheetDescription>
            </SheetHeader>
            {selectedTrack && (
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="full_name" className="text-right">Full Name</Label>
                        <Input id="full_name" value={selectedTrack.full_name} onChange={(e) => handleFieldChange('full_name', e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">Description</Label>
                        <Textarea id="description" value={selectedTrack.description} onChange={(e) => handleFieldChange('description', e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="display_name" className="text-right">Display Name</Label>
                        <Input id="display_name" value={selectedTrack.display_name} onChange={(e) => handleFieldChange('display_name', e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category" className="text-right">Category</Label>
                        <Input id="category" value={selectedTrack.category} onChange={(e) => handleFieldChange('category', e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="slug" className="text-right">Slug</Label>
                        <Input id="slug" value={selectedTrack.slug} onChange={(e) => handleFieldChange('slug', e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="color" className="text-right">Color</Label>
                        <Input id="color" value={selectedTrack.color} onChange={(e) => handleFieldChange('color', e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="icon" className="text-right">Icon</Label>
                        <Input id="icon" value={selectedTrack.icon} onChange={(e) => handleFieldChange('icon', e.target.value)} className="col-span-3" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="order" className="text-right">Order</Label>
                        <Input id="order" type="number" value={selectedTrack.order} onChange={(e) => handleFieldChange('order', parseInt(e.target.value, 10))} className="col-span-3" />
                    </div>
                </div>
            )}
            <SheetFooter>
                <SheetClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                </SheetClose>
                <Button type="submit" onClick={handleUpdateTrack}>Update Track</Button>
            </SheetFooter>
        </SheetContent>
      </Sheet>

      <BottomNav activeTab="User" />
    </div>
  );
}
