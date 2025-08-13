'use client';

import { Book, Calendar, Users, BarChart2, LogOut, Flame } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavProps {
    day: number;
    streak: number;
    completed: number;
}

export default function BottomNav({day, streak, completed}: BottomNavProps) {
    const navItems = [
        { icon: Book, label: 'Journal', active: true },
        { icon: Calendar, label: 'Daily' },
        { icon: Users, label: 'Community' },
        { icon: BarChart2, label: 'Progress' },
        { icon: LogOut, label: 'Sign Out' },
    ];

    return (
        <footer className="sticky bottom-0 left-0 right-0 bg-card border-t z-10">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            variant="ghost"
                            className={`flex flex-col items-center h-auto px-2 py-1 text-xs font-normal ${item.active ? 'text-primary bg-secondary' : 'text-muted-foreground'}`}
                        >
                            <item.icon className="h-5 w-5 mb-1" />
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground pb-2 px-2 text-center md:text-left">
                    <span className="hidden md:block">Day {day}/30</span>
                    <span className="hidden md:flex items-center gap-1"><Flame className="h-4 w-4"/> {streak} streak</span>
                    <span className="hidden md:block">{completed}/30 complete</span>
                    <span className="w-full md:w-auto text-right">scottmcquaig@gmail...</span>
                </div>
            </div>
        </footer>
    );
}
