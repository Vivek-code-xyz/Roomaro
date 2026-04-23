import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const adjectives = [
  "Lazy", "Happy", "Zesty", "Silly", "Cool", "Mighty", "Brave", "Hidden", "Swift", "Quiet",
  "Golden", "Sunny", "Neon", "Magic", "Spicy", "Icy", "Ancient", "Modern", "Grumpy", "Fancy"
];

const animals = [
  "Panda", "Tiger", "Fox", "Koala", "Penguin", "Wolf", "Dragon", "Lion", "Bear", "Eagle",
  "Otter", "Rabbit", "Shark", "Whale", "Owl", "Llama", "Monkey", "Dolphin", "Cheetah", "Sloth"
];

export function generateRandomUsername(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const anim = animals[Math.floor(Math.random() * animals.length)];
  const num = Math.floor(Math.random() * 100);
  return `${adj}${anim}${num}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
