
'use client';

import BottomNav from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { tracks as allTracks } from "@/lib/tracks.json";
import { Edit, Archive, PlusCircle, FolderPlus, DollarSign, Heart, Target, Brain } from "lucide-react";
import { useMemo, useState } from "react";

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

    const handleUpdateTrack = () => {
        if (!selectedTrack) return;
        
        // This is where you would typically call an API to update the data.
        // For now, we'll update the state locally and log it.
        console.log("Updating track:", selectedTrack);
        
        const updatedTracks = tracks.map(t => t.id === selectedTrack.id ? selectedTrack : t);
        setTracks(updatedTracks);
        setIsSheetOpen(false);
        setSelectedTrack(null);
    };

    const handleFieldChange = (field: keyof Track, value: string | number) => {
        if (selectedTrack) {
            setSelectedTrack({ ...selectedTrack, [field]: value });
        }
    };


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
