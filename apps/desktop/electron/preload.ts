/**
 * Preload script - Bridge between main and renderer processes
 */

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Game State
  getGameState: () => ipcRenderer.invoke('get-game-state'),
  getItems: () => ipcRenderer.invoke('get-items'),
  
  // Updates
  updateMultiplier: (multiplier: number) => ipcRenderer.invoke('update-multiplier', multiplier),
  updatePassiveRate: (passiveRate: number) => ipcRenderer.invoke('update-passive-rate', passiveRate),
  subtractLoC: (amount: number) => ipcRenderer.invoke('subtract-loc', amount),
  saveItems: (items: Record<string, number>) => ipcRenderer.invoke('save-items', items),
  
  // Window controls
  showMenu: () => ipcRenderer.send('show-menu'),
  hideMenu: () => ipcRenderer.send('hide-menu'),
  toggleWidgetSize: (collapsed: boolean) => ipcRenderer.send('toggle-widget-size', collapsed),
  closeApp: () => ipcRenderer.send('close-app'),
  moveWidget: (pos: { x: number; y: number }) => ipcRenderer.send('move-widget', pos),
  
  // Events
  onGameStateUpdate: (callback: (state: unknown) => void) => {
    ipcRenderer.on('game-state-update', (_, state) => callback(state));
  },
  onUserKeyPress: (callback: () => void) => {
    ipcRenderer.on('user-keypress', () => callback());
  },
  onLevelUp: (callback: (level: number) => void) => {
    ipcRenderer.on('level-up', (_, level) => callback(level));
  },
  
  // Cleanup
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('game-state-update');
    ipcRenderer.removeAllListeners('user-keypress');
    ipcRenderer.removeAllListeners('level-up');
  },
});
