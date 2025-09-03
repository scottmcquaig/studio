
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Brain, Check, DollarSign, Heart, Loader2, Target, Bell, Sparkles } from "lucide-react";
import { tracks as allTracks } from "@/lib/tracks.json";
import { cn } from "@/lib/utils";

const iconMap: { [key: string]: React.ComponentType<any> } = {
  "dollar-sign": DollarSign,
  "heart": Heart,
  "target": Target,
  "brain": Brain,
};

type Track = typeof allTracks[0];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  
  // Step 0: Initial signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unlockCode, setUnlockCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Track selection
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);

  // Step 2: Reminders
  // Placeholder state for reminders

  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Add logic to validate unlock code against Firestore
    console.log("Unlock Code Entered:", unlockCode);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // On successful signup, Firebase automatically logs the user in
      // The AuthProvider will detect this and move to the next step
      setIsLoading(false);
      setStep(1);
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleSelectTrack = (track: Track) => {
      setSelectedTrack(track);
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
            <Card className="w-full max-w-sm">
                <CardHeader>
                <CardTitle className="text-2xl font-bold font-headline text-primary">Begin Your Journey</CardTitle>
                <CardDescription>Create an account to start the 30-day challenge.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6+ characters" />
                    </div>
                    <div className="space-y-2">
                    <Label htmlFor="unlock-code">Unlock Code (Optional)</Label>
                    <Input id="unlock-code" type="text" placeholder="Have a code? Enter it here" value={unlockCode} onChange={(e) => setUnlockCode(e.target.value)} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : "Create Account & Continue"}
                    </Button>
                </CardFooter>
                </form>
            </Card>
        );
      case 1:
        const trackDescriptions: { [key: string]: string } = {
            "Ego": "Getting defensive, needing to be right, taking things personally",
            "Discipline": "Procrastination, inconsistency, lack of self-control",
            "Relationships": "Communication, boundaries, managing expectations",
            "Money": "Financial stress, career pressure, comparison with others",
        };

        return (
             <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="mb-2 text-sm font-semibold text-accent">Step 1 of 3</div>
                    <h1 className="text-2xl font-bold font-headline text-primary">What's Your Biggest Struggle?</h1>
                    <p className="text-muted-foreground mt-2">We'll customize your 30-day journey based on what you're dealing with most. Choose the one that hits hardest.</p>
                </div>
                <div className="space-y-4">
                    {allTracks.map(track => {
                         const Icon = iconMap[track.icon];
                         return (
                            <button
                                key={track.id}
                                onClick={() => handleSelectTrack(track)}
                                className={cn(
                                    "w-full text-left p-4 border rounded-lg flex items-center gap-4 transition-all",
                                    selectedTrack?.id === track.id
                                        ? "border-accent ring-2 ring-accent bg-accent/10"
                                        : "bg-secondary/30 hover:bg-secondary/60"
                                )}
                            >
                                <div className="p-3 rounded-md" style={{ backgroundColor: selectedTrack?.id === track.id ? track.color : `${track.color}20`}}>
                                    {Icon && <Icon className="h-6 w-6" style={{ color: selectedTrack?.id === track.id ? 'white' : track.color}} />}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-primary">{track.display_name} & Pride</h3>
                                    <p className="text-sm text-muted-foreground">{trackDescriptions[track.display_name]}</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </button>
                         )
                    })}
                </div>
                <div className="flex justify-between mt-8">
                     <Button variant="ghost" onClick={() => setStep(0)}>
                        <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <Button onClick={() => setStep(2)} disabled={!selectedTrack}>
                        Continue <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
        );
      case 2:
        return (
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="mb-2 text-sm font-semibold text-accent">Step 2 of 3</div>
                    <h1 className="text-2xl font-bold font-headline text-primary">Setup Daily Reminders</h1>
                    <p className="text-muted-foreground mt-2">Consistency is key. We'll help you stay on track.</p>
                </div>
                
                <Card>
                    <CardContent className="pt-6 space-y-4">
                        <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                           <div className="flex items-center gap-4">
                                <Bell className="h-6 w-6 text-accent"/>
                                <div>
                                    <Label htmlFor="push-notifications" className="font-semibold">Push Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Get alerts on your phone.</p>
                                </div>
                           </div>
                           <Input type="checkbox" id="push-notifications" className="h-5 w-5" />
                        </div>
                         <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                           <div className="flex items-center gap-4">
                                <Sparkles className="h-6 w-6 text-accent"/>
                                <div>
                                    <Label htmlFor="email-reminders" className="font-semibold">Email Reminders</Label>
                                    <p className="text-sm text-muted-foreground">Receive daily prompts in your inbox.</p>
                                </div>
                           </div>
                           <Input type="checkbox" id="email-reminders" className="h-5 w-5" />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <Button onClick={() => setStep(3)}>
                        Continue <ArrowRight className="ml-2" />
                    </Button>
                </div>
            </div>
        );
      case 3:
        const TrackIcon = selectedTrack ? iconMap[selectedTrack.icon] : null;
        return (
            <div className="w-full max-w-md text-center">
                 <div className="text-center mb-8">
                    <div className="mb-2 text-sm font-semibold text-accent">Step 3 of 3</div>
                    <h1 className="text-2xl font-bold font-headline text-primary">Confirm Your Path</h1>
                    <p className="text-muted-foreground mt-2">Your 30-day journey is ready. Let's begin.</p>
                </div>

                <Card className="text-left">
                    <CardHeader>
                        <CardTitle>Your Chosen Track</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {selectedTrack && TrackIcon && (
                            <div className="p-4 border rounded-lg flex items-center gap-4 bg-secondary/30">
                                <div className="p-3 rounded-md" style={{ backgroundColor: selectedTrack.color }}>
                                    <TrackIcon className="h-6 w-6 text-white" />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-primary">{selectedTrack.full_name}</h3>
                                    <p className="text-sm text-muted-foreground">{selectedTrack.description}</p>
                                </div>
                            </div>
                         )}
                         <div className="mt-4">
                            <h4 className="font-semibold mb-2">Reminder Settings</h4>
                            <p className="text-sm text-muted-foreground">You can change these later in your profile.</p>
                         </div>
                    </CardContent>
                </Card>

                <div className="flex justify-between mt-8">
                    <Button variant="ghost" onClick={() => setStep(2)}>
                        <ArrowLeft className="mr-2" /> Back
                    </Button>
                    <Button size="lg" onClick={() => router.push('/')}>
                        Start Challenge <Check className="ml-2" />
                    </Button>
                </div>
            </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      {renderStep()}
    </div>
  );
}
