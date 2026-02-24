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
  updateMultiplier: (multiplier: number) =>
    ipcRenderer.invoke('update-multiplier', multiplier),
  updatePassiveRate: (passiveRate: number) =>
    ipcRenderer.invoke('update-passive-rate', passiveRate),
  subtractLoC: (amount: number) => ipcRenderer.invoke('subtract-loc', amount),
  saveItems: (items: Record<string, number>) =>
    ipcRenderer.invoke('save-items', items),

  // Window controls
  showMenu: () => ipcRenderer.send('show-menu'),
  hideMenu: () => ipcRenderer.send('hide-menu'),
  toggleWidgetSize: (collapsed: boolean) =>
    ipcRenderer.send('toggle-widget-size', collapsed),
  closeApp: () => ipcRenderer.send('close-app'),
  moveWidget: (pos: { x: number; y: number }) =>
    ipcRenderer.send('move-widget', pos),

  // Events — each returns a dispose function to remove only that listener
  onGameStateUpdate: (callback: (state: unknown) => void) => {
    const handler = (_: Electron.IpcRendererEvent, state: unknown) =>
      callback(state);
    ipcRenderer.on('game-state-update', handler);
    return () => {
      ipcRenderer.removeListener('game-state-update', handler);
    };
  },
  onUserKeyPress: (callback: () => void) => {
    const handler = () => callback();
    ipcRenderer.on('user-keypress', handler);
    return () => {
      ipcRenderer.removeListener('user-keypress', handler);
    };
  },
  onLevelUp: (callback: (level: number) => void) => {
    const handler = (_: Electron.IpcRendererEvent, level: number) =>
      callback(level);
    ipcRenderer.on('level-up', handler);
    return () => {
      ipcRenderer.removeListener('level-up', handler);
    };
  },

  // Cleanup — nuclear option, removes ALL listeners on every channel
  removeAllListeners: () => {
    ipcRenderer.removeAllListeners('game-state-update');
    ipcRenderer.removeAllListeners('user-keypress');
    ipcRenderer.removeAllListeners('level-up');
  },
});
