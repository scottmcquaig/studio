'use client';

import { Book, Calendar, Users, BarChart2, LogOut, Flame } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
                <div className="flex justify-around items-center h-16 py-2">
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            variant="ghost"
                            className={`flex flex-col items-center justify-center h-14 w-16 px-2 py-1 text-xs font-normal hover:bg-[#EAF4FB] ${item.active ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'}`}
                        >
                            <item.icon className="h-5 w-5 mb-1" />
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground pt-1 pb-2 px-2 text-center md:text-left">
                    <div className="hidden md:flex gap-2">
                        <Badge variant="outline">Day {day}/30</Badge>
                        <Badge variant="outline" className="flex items-center gap-1"><Flame className="h-4 w-4"/> {streak} streak</Badge>
                        <Badge variant="outline">{completed}/30 complete</Badge>
                    </div>
                    <Badge variant="outline" className="w-full md:w-auto text-right">scottmcquaig@gmail...</Badge>
                </div>
            </div>
        </footer>
    );
}
