
import type { Challenge } from './types';

export const challenges: Challenge[] = [
  {
    day: 1,
    week: 1,
    track: "Relationships",
    title: "You Can't Control Them (Stop Trying)",
    description: "You Can't Control Them (Stop Trying)",
    quote: { 
      text: "Whenever you want to cheer yourself up, consider the good qualities of your companions, for instance, the energy of one, the modesty of another, the generosity of yet another. Nothing gives as much pleasure as the image of the virtues displayed in the character of our contemporaries.", 
      author: "Marcus Aurelius" 
    },
    broTranslation: "Stop obsessing over everyone's flaws and fuck-ups. Yeah, people are messy, inconsistent, and disappointing. But guess what? So are you. Marcus is saying: instead of keeping a mental scorecard of how everyone's failing you, start noticing what they're actually good at. Your girl's always late? Maybe she also always shows up when shit gets real. Your friend's terrible with money? Perhaps he'd also give you his last dollar. You're so busy cataloging disappointments that you're blind to the good stuff right in front of you.",
    challenge: `The Flip List: Pick your three most frustrating relationships right now. For each person:
- Write their most annoying trait/behavior
- Now write two genuine strengths they have (not backhanded compliments - real shit)
- Write one time they came through when it mattered

If you can't think of strengths or good moments, that's data too. Maybe it's time to audit who's in your circle.`,
    morningPrompt: "Today when someone irritates me, I'll pause and ask: What am I trying to control that isn't mine to control?",
    eveningPrompt: `Answer these three questions:
1. Which expectation did I have of someone today that was actually unfair?
2. When did I react to someone based on my mood, not their actual behavior?
3. What relationship problem am I complaining about that I'm actively contributing to?`,
    winsTitle: "One relationship I fostered today:"
  },
  {
    day: 2,
    week: 1,
    track: "Relationships",
    title: 'The Expectation Trap',
    description: "The Expectation Trap: Why Your Disappointment Is Your Fault",
    quote: { text: "When another blames you or hates you, or people voice similar criticisms, go to their souls, penetrate inside and see what sort of people they are. You will realize that there is no need to be racked with anxiety that they should hold any particular opinion about you.", author: "Marcus Aurelius" },
    broTranslation: "When someone's talking shit or coming at you sideways, don't defend yourself yet. First, look at who's talking. Are they miserable? Insecure? Fighting their own demons? Nine times out of ten, their beef with you is really beef with themselves. Stop losing sleep over opinions from people who can't even stand their own company. Their criticism says more about their inner chaos than your actual worth.",
    challenge: "The Source Check: Today, when someone criticizes you or pisses you off, before you react, write down: 1) What they said/did, 2) What might be going on in THEIR life, 3) Why this might not actually be about you. Practice seeing past the attack to the pain behind it.",
    morningPrompt: "Today I will remember that hurt people hurt people, and their reactions are about their inner state, not my worth.",
    eveningPrompt: `Answer these three questions:
1. What criticism did I take personally today that was really about the other person's issues?
2. When did I create disappointment by expecting someone to act differently than they always do?
3. How did my ego make a relationship moment harder than it needed to be?`,
    winsTitle: "One expectation I released today:"
  },
  {
    day: 3,
    title: 'Practice Voluntary Discomfort',
    description: "Choose one small, voluntary discomfort today. Take a cold shower, skip a meal (if health permits), or walk instead of driving.",
    quote: { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" }
  },
  // Add 27 more challenges to make it 30
  ...Array.from({ length: 27 }, (_, i) => ({
    day: i + 4,
    title: `Challenge Day ${i + 4}`,
    description: `This is a placeholder for the challenge on day ${i + 4}. The goal is to consistently practice stoic principles.`,
    quote: { text: "The obstacle is the way.", author: "Marcus Aurelius" }
  }))
];
