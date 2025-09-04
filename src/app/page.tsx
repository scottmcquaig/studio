'use client'

import { useState, useMemo, useEffect } from 'react';
import type { Challenge, UserProfile } from '@/lib/types';
import { challenges as allChallenges } from '@/lib/challenges';
import { mockUser } from '@/lib/user';

import AppHeader from '@/components/app-header';
import ProgressCard from '@/components/progress-card';
import TodaysChallengeCard from '@/components/todays-challenge-card';
import DailyPracticeCard from '@/components/daily-practice-card';
import BuildLegacyCard from '@/components/build-legacy-card';
import BottomNav from '@/components/bottom-nav';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import PrivateRoute from '@/components/private-route';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import UnlockPathCard from '@/components/unlock-path-card';

function HomePageContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          setLoadingProfile(true);
          // In a real app, you would fetch this from your backend
          setUserProfile(mockUser);
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
      } else {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [user, toast]);

  const currentChallenge: Challenge | undefined = useMemo(() => {
    if (!userProfile?.activePath) return undefined;
    const currentDay = userProfile.currentChallenge[userProfile.activePath];
    // This logic needs to be updated to fetch the correct challenge based on the active path
    return allChallenges.find(c => c.day === currentDay && c.track === "Relationships");
  }, [userProfile]);


  if (loadingProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading Challenge...</p>
      </div>
    )
  }

  if (!userProfile?.activePath || !currentChallenge) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
          <AppHeader />
          <div className="space-y-6">
            <UnlockPathCard />
          </div>
        </main>
        <BottomNav activeTab="Dashboard" currentDay={1} />
      </div>
    )
  }

  const completedDays = userProfile.completedChallenges[userProfile.activePath]?.length || 0;
  const daysRemaining = 30 - completedDays;
  const progress = Math.round((completedDays / 30) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-4">
          <Badge style={{ backgroundColor: '#3498DB', color: 'white' }} className="border-none font-sans font-normal text-[.875rem]">
            <a href="https://stoic-af.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
              From the book <span className="font-bold ml-1">STOIC AF</span>
            </a>
          </Badge>
        </div>
        <AppHeader />
        <div className="space-y-6">
          <ProgressCard
            streak={userProfile.streak}
            daysCompleted={completedDays}
            daysRemaining={daysRemaining}
            progress={progress}
          />
          <TodaysChallengeCard
            day={currentChallenge.day}
            challenge={currentChallenge}
          />
          <DailyPracticeCard />
          <BuildLegacyCard />
        </div>
      </main>
      <BottomNav activeTab="Dashboard" currentDay={currentChallenge.day} />
    </div>
  );
}

export default function Home() {
  return (
    <PrivateRoute>
      <HomePageContent />
    </PrivateRoute>
  );
}
