
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { List, Link as LinkIcon, Monitor, LogIn, UserPlus, Milestone } from 'lucide-react';
import BottomNav from '@/components/bottom-nav';

export default function LandingPage() {
  const appPages = [
    { href: '/', name: 'Main Dashboard (Current)' },
    { href: '/day/1', name: 'Daily Challenge (Day 1)' },
    { href: '/progress', name: 'Progress Page' },
    { href: '/programs', name: 'Programs/Challenges' },
    { href: '/settings', name: 'Settings' },
  ];

  const authPages = [
    { href: '/login', name: 'Login' },
    { href: '/signup', name: 'Sign Up' },
  ];

  const mockPages = [
    { href: '/mock', name: 'Mock Dashboard' },
    { href: '/mock/day/1', name: 'Mock Daily Challenge (Day 1)' },
    { href: '/mock/progress', name: 'Mock Progress' },
    { href: '/mock/programs', name: 'Mock Programs' },
    { href: '/mock/settings', name: 'Mock Settings' },
  ];

  const adminPages = [
    { href: '/backstage', name: 'Backstage Admin' },
  ];


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="py-4 bg-card border-b">
            <div className="container mx-auto px-4 max-w-3xl text-center">
            <h1 className="text-xl font-bold font-headline text-primary">App Navigation Links</h1>
            </div>
        </header>
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="space-y-8">
            
          <Card>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Monitor className="h-6 w-6 text-accent"/>
                    <CardTitle>Application Pages</CardTitle>
                </div>
                <CardDescription>Links to the main application views.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              {appPages.map((page) => (
                <Button key={page.href} asChild variant="outline" className="justify-start">
                  <Link href={page.href}>
                    <LinkIcon className="mr-2" />
                    {page.name}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

           <Card>
            <CardHeader>
                 <div className="flex items-center gap-3">
                    <Milestone className="h-6 w-6 text-accent"/>
                    <CardTitle>Mock Pages</CardTitle>
                </div>
                <CardDescription>Links to the mocked-up version of the application for testing.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              {mockPages.map((page) => (
                <Button key={page.href} asChild variant="outline" className="justify-start">
                  <Link href={page.href}>
                     <LinkIcon className="mr-2" />
                    {page.name}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8">
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <UserPlus className="h-6 w-6 text-accent"/>
                        <CardTitle>Authentication</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                {authPages.map((page) => (
                    <Button key={page.href} asChild variant="outline" className="justify-start">
                    <Link href={page.href}>
                        <LinkIcon className="mr-2" />
                        {page.name}
                    </Link>
                    </Button>
                ))}
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <List className="h-6 w-6 text-accent"/>
                        <CardTitle>Admin</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                {adminPages.map((page) => (
                    <Button key={page.href} asChild variant="outline" className="justify-start">
                    <Link href={page.href}>
                        <LinkIcon className="mr-2" />
                        {page.name}
                    </Link>
                    </Button>
                ))}
                </CardContent>
            </Card>
          </div>

        </div>
      </main>
      <BottomNav activeTab="Dashboard" />
    </div>
  );
}
