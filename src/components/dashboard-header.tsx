'use client';

import { Flame, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DashboardHeaderProps {
  streak: number;
}

export default function DashboardHeader({ streak }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card">
      <h1 className="text-2xl font-headline">Stoic AF</h1>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg">{streak}</span>
          <Flame className={`h-6 w-6 text-orange-500 ${streak > 0 ? 'glowing-flame' : ''}`} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="profile picture"/>
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
