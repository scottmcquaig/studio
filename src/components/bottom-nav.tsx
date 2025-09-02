'use client';

import { Book, Calendar, Layers, BarChart2, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface BottomNavProps {
    activeTab?: 'Journal' | 'Daily' | 'Programs' | 'Progress' | 'Sign Out';
}

export default function BottomNav({ activeTab = 'Journal' }: BottomNavProps) {
    const navItems = [
        { icon: Book, label: 'Journal', href: '/' },
        { icon: Calendar, label: 'Daily', href: '/day/1' },
        { icon: Layers, label: 'Programs', href: '/programs' },
        { icon: BarChart2, label: 'Progress', href: '/progress' },
        { icon: LogOut, label: 'Sign Out', href: '#' },
    ];

    return (
        <footer className="sticky bottom-0 left-0 right-0 bg-card border-t z-10">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="flex justify-around items-center h-20 py-4">
                    {navItems.map((item) => (
                        <Button
                            key={item.label}
                            variant="ghost"
                            className={`flex flex-col items-center justify-center h-14 w-16 px-2 py-1 text-xs font-normal hover:bg-[#EAF4FB] ${activeTab === item.label ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'text-muted-foreground'}`}
                            asChild
                        >
                            <Link href={item.href}>
                                <item.icon className="h-5 w-5 mb-1" />
                                <span>{item.label}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
        </footer>
    );
}
