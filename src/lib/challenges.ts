import type { Challenge } from './types';

export const challenges: Challenge[] = [
  {
    day: 1,
    week: 1,
    track: "Relationship",
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
    title: 'The Dichotomy of Control',
    description: "Throughout your day, distinguish between what is in your control and what isn't. Focus your energy solely on the former.",
    quote: { text: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion, and, in a word, whatever are our own actions.", author: "Epictetus" }
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
