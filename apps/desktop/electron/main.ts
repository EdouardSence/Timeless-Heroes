/**
 * Timeless Heroes - Electron Main Process
 * 
 * Creates:
 * 1. Widget window (always on top, transparent, small)
 * 2. Menu window (shop, stats, leaderboard)
 * 3. Global keyboard listener
 */

import { app, BrowserWindow, ipcMain, Menu, nativeImage, screen, Tray } from 'electron';
import Store from 'electron-store';
import * as path from 'path';
import { uIOhook } from 'uiohook-napi';

// ... (other imports remain, but remove node-global-key-listener)

// ============================================================================
// KEYBOARD LISTENER
// ============================================================================

function startKeyboardListener(): void {
  try {
    uIOhook.on('keyup', (e) => {
      // process.stdout.write(`[KEY: ${e.keycode}] `); // Debug log
      
      const gameState = store.get('gameState') as {
        linesOfCode: number;
        totalKeyPresses: number;
        level: number;
        experience: number;
        experienceToNext: number;
        multiplier: number;
        passiveRate: number;
      };

      if (!gameState) return;

      const mult = Math.max(1, gameState.multiplier || 1);
      const gained = Math.floor(1 * mult);

      gameState.linesOfCode = (gameState.linesOfCode || 0) + gained;
      gameState.totalKeyPresses = (gameState.totalKeyPresses || 0) + 1;
      gameState.experience = (gameState.experience || 0) + 1;

      // Faster level up check
      if (gameState.experience >= gameState.experienceToNext) {
        while (gameState.experience >= gameState.experienceToNext) {
          gameState.experience -= gameState.experienceToNext;
          gameState.level += 1;
          gameState.experienceToNext = Math.floor(gameState.experienceToNext * 1.5);
          widgetWindow?.webContents.send('level-up', gameState.level);
        }
      }

      // We don't save to file on every keypress for performance, but we update React state
      // Save every 50 keypresses to disk roughly
      if (gameState.totalKeyPresses % 50 === 0) {
        store.set('gameState', gameState);
      } else {
        // Just update internal object reference if store caches it (it usually doesn't, so we might need manual handling)
        // Actually Electron-Store reads from disk/cache. Let's force update variable but defer save?
        // For now, let's just save. It might be slow on some disks but safe.
        store.set('gameState', gameState);
      }
      
      if (widgetWindow && !widgetWindow.isDestroyed()) {
          widgetWindow.webContents.send('game-state-update', gameState);
          widgetWindow.webContents.send('user-keypress'); // Explicit event for combo
      }
      if (menuWindow && !menuWindow.isDestroyed()) {
          menuWindow.webContents.send('game-state-update', gameState);
      }
    });

    uIOhook.start();
    console.log('✅ uIOhook keyboard listener started!');
  } catch (error) {
    console.error('❌ Failed to start uIOhook:', error);
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const isDev = process.env.NODE_ENV !== 'production' || !app.isPackaged;

// Store for game data persistence
const store = new Store({
  name: 'timeless-heroes-data',
  defaults: {
    gameState: {
      linesOfCode: 0,
      totalKeyPresses: 0,
      level: 1,
      experience: 0,
      experienceToNext: 100,
      multiplier: 1.0,
      passiveRate: 0.0,
    },
    items: {},
    settings: {
      widgetPosition: { x: 50, y: 50 },
    },
  },
});

// Debug: Log store path and current state on startup
console.log('📁 Store path:', store.path);
console.log('💾 Loaded gameState:', store.get('gameState'));
console.log('🛒 Loaded items:', store.get('items'));

// ============================================================================
// WINDOWS
// ============================================================================

let widgetWindow: BrowserWindow | null = null;
let menuWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWidgetWindow(): void {
  const savedPosition = store.get('settings.widgetPosition') as { x: number; y: number };
  
  widgetWindow = new BrowserWindow({
    width: 420,
    height: 320,
    x: savedPosition?.x ?? 50,
    y: savedPosition?.y ?? 50,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true,
    minWidth: 300,
    minHeight: 200,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    widgetWindow.loadURL('http://localhost:4000/#/widget');
  } else {
    widgetWindow.loadFile(path.join(__dirname, 'renderer/index.html'), { hash: '/widget' });
  }

  // Save position when moved
  widgetWindow.on('moved', () => {
    if (widgetWindow) {
      const [x, y] = widgetWindow.getPosition();
      store.set('settings.widgetPosition', { x, y });
    }
  });

  widgetWindow.on('closed', () => {
    widgetWindow = null;
  });
}

function createMenuWindow(): void {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  menuWindow = new BrowserWindow({
    width: 450,
    height: 600,
    x: Math.floor((width - 450) / 2),
    y: Math.floor((height - 600) / 2),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    show: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    menuWindow.loadURL('http://localhost:4000/#/menu');
  } else {
    menuWindow.loadFile(path.join(__dirname, 'renderer/index.html'), { hash: '/menu' });
  }

  menuWindow.on('blur', () => {
    // Hide menu when it loses focus
    if (menuWindow && !isDev) {
      menuWindow.hide();
    }
  });

  menuWindow.on('closed', () => {
    menuWindow = null;
  });
}

function createTray(): void {
  const iconPath = path.join(__dirname, '../public/icon.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(icon);
  
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Afficher Widget', click: () => widgetWindow?.show() },
    { label: 'Ouvrir Menu', click: () => menuWindow?.show() },
    { type: 'separator' },
    { label: 'Quitter', click: () => app.quit() },
  ]);
  
  tray.setToolTip('Timeless Heroes');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    menuWindow?.show();
  });
}

// ============================================================================
// PASSIVE INCOME LOOP
// ============================================================================

function startPassiveIncomeLoop(): void {
  setInterval(() => {
    const gameState = store.get('gameState') as {
      linesOfCode: number;
      totalKeyPresses: number;
      level: number;
      experience: number;
      experienceToNext: number;
      multiplier: number;
      passiveRate: number; // This is "virtual keys per second"
    };

    if (gameState && gameState.passiveRate > 0) {
      // passiveRate = keys/sec, each key generates `multiplier` LoC
      const keysGenerated = gameState.passiveRate;
      const locGained = Math.floor(keysGenerated * gameState.multiplier);
      
      gameState.linesOfCode += locGained;
      
      // Also add to total key presses for stats (virtual keys)
      gameState.totalKeyPresses += Math.floor(keysGenerated);
      
      // Add experience from virtual keys
      gameState.experience += Math.floor(keysGenerated);
      
      // Level up check
      while (gameState.experience >= gameState.experienceToNext) {
        gameState.experience -= gameState.experienceToNext;
        gameState.level += 1;
        gameState.experienceToNext = Math.floor(gameState.experienceToNext * 1.5);
        widgetWindow?.webContents.send('level-up', gameState.level);
      }
      
      store.set('gameState', gameState);
      
      if (widgetWindow && !widgetWindow.isDestroyed()) {
        widgetWindow.webContents.send('game-state-update', gameState);
      }
      if (menuWindow && !menuWindow.isDestroyed()) {
        menuWindow.webContents.send('game-state-update', gameState);
      }
    }
  }, 1000);
}

// ============================================================================
// IPC HANDLERS
// ============================================================================

function setupIpcHandlers(): void {
  // Get game state
  ipcMain.handle('get-game-state', () => {
    return store.get('gameState');
  });

  // Get items
  ipcMain.handle('get-items', () => {
    return store.get('items');
  });

  // Update multiplier
  ipcMain.handle('update-multiplier', (_, multiplier: number) => {
    const gameState = store.get('gameState') as any;
    gameState.multiplier = multiplier;
    store.set('gameState', gameState);
  });

  // Update passive rate
  ipcMain.handle('update-passive-rate', (_, passiveRate: number) => {
    const gameState = store.get('gameState') as any;
    gameState.passiveRate = passiveRate;
    store.set('gameState', gameState);
  });

  // Subtract LoC (for purchases)
  ipcMain.handle('subtract-loc', (_, amount: number) => {
    const gameState = store.get('gameState') as { linesOfCode: number };
    if (gameState.linesOfCode >= amount) {
      // Don't modify partial object, read full state
      const fullState = store.get('gameState') as any;
      fullState.linesOfCode -= amount;
      store.set('gameState', fullState);
      return true;
    }
    return false;
  });

  // Save items
  ipcMain.handle('save-items', (_, items: Record<string, number>) => {
    store.set('items', items);
  });

  // Show menu
  ipcMain.on('show-menu', () => {
    console.log('Opening menu window...');
    if (menuWindow) {
      menuWindow.show();
      menuWindow.focus();
    } else {
      createMenuWindow();
      (menuWindow as any)?.show();
    }
  });

  // Hide menu
  ipcMain.on('hide-menu', () => {
    menuWindow?.hide();
  });

  // Toggle Widget Size (Minimize/Maximize)
  ipcMain.on('toggle-widget-size', (_, collapsed: boolean) => {
      if (!widgetWindow) return;

      if (collapsed) {
        widgetWindow.setMinimumSize(100, 100); // Allow resizing down primarily
        widgetWindow.setSize(160, 200); // Larger canvas to prevent clipping of glow/tooltip
        widgetWindow.setResizable(true); // Allow user to resize manually
      } else {
        widgetWindow.setMinimumSize(300, 200); 
        widgetWindow.setSize(420, 320);
        widgetWindow.setResizable(true);
      }
  });

  // Close app
  ipcMain.on('close-app', () => {
    app.quit();
  });

  // Move widget (programmatic drag)
  ipcMain.on('move-widget', (_, { x, y }) => {
    if (widgetWindow && !widgetWindow.isDestroyed()) {
      widgetWindow.setPosition(Math.round(x), Math.round(y));
    }
  });
}

// ============================================================================
// KEYBOARD LISTENER
// ============================================================================

// ============================================================================
// APP LIFECYCLE
// ============================================================================

app.whenReady().then(() => {
  setupIpcHandlers();
  createWidgetWindow();
  createMenuWindow();
  createTray();
  startKeyboardListener();
  startPassiveIncomeLoop();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWidgetWindow();
      createMenuWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  uIOhook.stop();
});
