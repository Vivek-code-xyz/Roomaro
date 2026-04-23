import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const baseNames = [
  "Nova", "Pixel", "Raven", "Echo", "Blaze", "Cipher", "Orbit", "Comet", "Drift", "Flare",
  "Vortex", "Nimbus", "Atlas", "Quasar", "Zenith", "Pulse", "Onyx", "Ember", "Frost", "Glitch",
  "Astra", "Bolt", "Delta", "Fable", "Ghost", "Halo", "Ion", "Jinx", "Karma", "Lumen",
  "Matrix", "Nexus", "Omega", "Phantom", "Quest", "Rogue", "Sable", "Tango", "Umbra", "Vector",
  "Whisper", "Xeno", "Yonder", "Zephyr", "Alpha", "Bravo", "Cosmo", "Dynamo", "Flux", "Gizmo"
];

export function generateRandomUsername(): string {
  const name = baseNames[Math.floor(Math.random() * baseNames.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${name}${num}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
