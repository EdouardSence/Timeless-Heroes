/**
 * Game Page — Shared type definitions
 * Pure type file, no runtime logic.
 */

export interface GameState {
  experience: number;
  experienceToNext: number;
  items: Record<string, number>;
  level: number;
  linesOfCode: number;
  multiplier: number;
  passiveRate: number;
  totalKeyPresses: number;
}

export interface ShopItem {
  baseCost: number;
  canAfford: boolean;
  effect: string;
  icon: string;
  name: string;
  nextCost: number;
  owned: number;
  slug: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: string;
  level: number;
  prestigeLevel: number;
}

export type TabId = 'shop' | 'leaderboard' | 'info';
