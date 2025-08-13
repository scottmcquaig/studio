import type { Challenge } from './types';

export const challenges: Challenge[] = [
  {
    day: 1,
    title: 'Practice Negative Visualization',
    description: "Spend a few minutes contemplating the loss of things you value. This isn't to be morbid, but to appreciate what you have right now.",
    quote: { text: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.", author: "Epictetus" }
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
