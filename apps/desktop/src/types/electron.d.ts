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

export interface ElectronAPI {
  // Game State
  getGameState: () => Promise<GameState>;
  getItems: () => Promise<Record<string, number>>;
  
  // Updates
  updateMultiplier: (multiplier: number) => Promise<void>;
  updatePassiveRate: (passiveRate: number) => Promise<void>;
  subtractLoC: (amount: number) => Promise<boolean>;
  saveItems: (items: Record<string, number>) => Promise<void>;
  
  // Window controls
  showMenu: () => void;
  hideMenu: () => void;
  toggleWidgetSize: (collapsed: boolean) => void;
  closeApp: () => void;
  moveWidget: (pos: { x: number; y: number }) => void;
  
  // Events
  onGameStateUpdate: (callback: (state: GameState) => void) => void;
  onUserKeyPress: (callback: () => void) => void;
  onLevelUp: (callback: (level: number) => void) => void;
  
  // Cleanup
  removeAllListeners: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
