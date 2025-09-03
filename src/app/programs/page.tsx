
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, DollarSign, Brain, Shield, Lock, ArrowRight } from "lucide-react";
import BottomNav from "@/components/bottom-nav";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const programs = [
  {
    title: "Stoic Relationships",
    description: "Master your emotions in your relationships. Learn to love virtuously and resiliently.",
    icon: Heart,
    color: "text-red-500",
    price: 4,
    owned: true,
  },
  {
    title: "Stoic Ego",
    description: "Conquer your ego. Practice humility and objective self-assessment for true confidence.",
    icon: Shield,
    color: "text-blue-500",
    price: 4,
  },
  {
    title: "Stoic Money",
    description: "Achieve financial indifference. Focus on what truly matters, not wealth.",
    icon: DollarSign,
    color: "text-green-500",
    price: 4,
  },
    {
    title: "Stoic Discipline",
    description: "Build an unshakable will. Forge discipline through daily practice and self-control.",
    icon: Brain,
    color: "text-purple-500",
    price: 4,
  },
]

export default function ProgramsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="py-4 bg-card border-b">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-xl font-bold font-headline text-primary">STOIC AF Challenge Programs</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
            <Card className="bg-secondary/30">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">Unlock a New Path</CardTitle>
                    <CardDescription>
                        Already have a code from the book? Enter it here to unlock your chosen track.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <input type="text" placeholder="Enter Your Code" className="flex-grow p-2 border rounded-md" />
                    <Button>
                        <Lock className="mr-2" />
                        Unlock
                    </Button>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programs.map((program) => (
                    <Card key={program.title} className="flex flex-col">
                        <CardHeader>
                            <div className="flex items-center gap-4">
                                <program.icon className={`h-10 w-10 ${program.color}`} />
                                <CardTitle className="font-headline text-xl text-primary">{program.title}</CardTitle>
                            </div>
                            <CardDescription className="pt-2">{program.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="mt-auto">
                            {program.owned ? (
                                <Link href="/" className="w-full">
                                    <Button variant="secondary" className="w-full bg-accent/20 text-accent-foreground hover:bg-accent/30">
                                        View Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <Button className="w-full">
                                    Get for ${program.price} <ArrowRight className="ml-2" />
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
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
                    <Button size="lg" className="w-full sm:w-auto">
                        Unlock Everything
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </main>
      <BottomNav activeTab="Programs" />
    </div>
  );
}
