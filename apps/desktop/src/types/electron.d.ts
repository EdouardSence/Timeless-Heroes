/**
 * Global type definitions for Electron API
 */

export interface GameState {
  linesOfCode: number;
  totalKeyPresses: number;
  level: number;
  experience: number;
  experienceToNext: number;
  multiplier: number;
  passiveRate: number;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

export interface LeaderboardResponse {
  success: boolean;
  data?: {
    type: string;
    entries: LeaderboardEntry[];
  };
  error?: string;
}

export interface BackendStatus {
  online: boolean;
  username: string | null;
  userId: string | null;
}

export interface AntiCheatStatus {
  violations: number;
  maxViolations: number;
  banned: boolean;
  /** Seconds until violations expire (approximate unban time). -1 if not banned. */
  banExpiresIn: number;
}

export interface ElectronAPI {
  // Game State
  getGameState: () => Promise<GameState>;
  getItems: () => Promise<Record<string, number>>;

  // Updates
  updateMultiplier: (multiplier: number) => Promise<void>;
  updatePassiveRate: (passiveRate: number) => Promise<void>;
  subtractLoC: (amount: number) => Promise<boolean>;
  saveItems: (items: Record<string, number>) => Promise<void>;

  // Backend Auth (BUG-06)
  backendLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  backendRegister: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  backendLogout: () => Promise<{ success: boolean }>;
  backendStatus: () => Promise<BackendStatus>;
  
  // Backend Leaderboard (TD-03)
  backendLeaderboard: (type?: string) => Promise<LeaderboardResponse>;
  backendBuyItem: (itemSlug: string) => Promise<{ success: boolean; error?: string; data?: Record<string, unknown> }>;

  // Auth flow
  launchGame: () => void;
  logoutSession: () => void;

  // Window controls
  showMenu: () => void;
  hideMenu: () => void;
  toggleWidgetSize: (collapsed: boolean) => void;
  closeApp: () => void;
  moveWidget: (pos: { x: number; y: number }) => void;

  // Events -- each returns a dispose function to remove only that listener
  onGameStateUpdate: (callback: (state: GameState) => void) => () => void;
  onUserKeyPress: (callback: () => void) => () => void;
  onLevelUp: (callback: (level: number) => void) => () => void;
  onBackendStatus: (callback: (status: BackendStatus) => void) => () => void;
  onAntiCheatWarning: (callback: (status: AntiCheatStatus) => void) => () => void;

  // Cleanup -- nuclear option, removes ALL listeners on every channel
  removeAllListeners: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
