/**
 * Timeless Heroes - Electron Main Process
 * 
 * Creates:
 * 1. Widget window (always on top, transparent, small)
 * 2. Menu window (shop, stats, leaderboard)
 * 3. Global keyboard listener
 * 4. Backend sync (JWT auth + keystroke ingestion via HTTP)
 */

import { app, BrowserWindow, ipcMain, Menu, nativeImage, net, screen, Tray } from 'electron';
import Store from 'electron-store';
import * as path from 'path';
import { uIOhook } from 'uiohook-napi';

// ============================================================================
// TYPES
// ============================================================================

interface IGameState {
  linesOfCode: number;
  totalKeyPresses: number;
  level: number;
  experience: number;
  experienceToNext: number;
  multiplier: number;
  passiveRate: number;
}

interface IBackendAuth {
  jwtToken: string | null;
  sessionId: string | null;
  userId: string | null;
  username: string | null;
}

interface IStoreSchema {
  gameState: IGameState;
  items: Record<string, number>;
  settings: {
    widgetPosition: { x: number; y: number };
  };
  backendAuth: IBackendAuth;
  /** Per-user save data, keyed by userId */
  users: Record<string, { gameState: IGameState; items: Record<string, number> }>;
}

// ============================================================================
// BACKEND SYNC (BUG-06 FIX)
// ============================================================================

const API_BASE = 'http://localhost:3000/api/v1';

/** Classify a uIOhook keycode into an anonymized key category */
function classifyKeyCode(keycode: number): string {
  // Enter
  if (keycode === 28 || keycode === 57372) return 'ENTER';
  // Space
  if (keycode === 57) return 'SPACE';
  // Backspace / Delete
  if (keycode === 14 || keycode === 57427) return 'BACKSPACE';
  // Tab
  if (keycode === 15) return 'TAB';
  // Function keys (F1-F12 = 59-68, 87-88)
  if ((keycode >= 59 && keycode <= 68) || keycode === 87 || keycode === 88) return 'FUNCTION';
  // Modifiers (Shift, Ctrl, Alt, Meta)
  if ([29, 42, 54, 56, 3675, 3676, 57416, 57421, 3613, 3640].includes(keycode)) return 'MODIFIER';
  // Navigation (arrows, home, end, pgup, pgdn)
  if ([57416, 57419, 57421, 57424, 57415, 57423, 57417, 57425].includes(keycode)) return 'NAVIGATION';
  // Alphanumeric / default → CHAR
  return 'CHAR';
}

/** Simple HTTP request helper using Electron's net module */
function httpRequest(
  method: 'GET' | 'POST',
  url: string,
  body?: Record<string, unknown>,
  headers?: Record<string, string>,
): Promise<{ status: number; data: Record<string, unknown> }> {
  return new Promise((resolve, reject) => {
    const request = net.request({ method, url });

    if (headers) {
      for (const [key, val] of Object.entries(headers)) {
        request.setHeader(key, val);
      }
    }

    request.setHeader('Content-Type', 'application/json');

    let responseBody = '';

    request.on('response', (response) => {
      response.on('data', (chunk: Buffer) => {
        responseBody += chunk.toString();
      });
      response.on('end', () => {
        try {
          const data = JSON.parse(responseBody);
          resolve({ status: response.statusCode, data });
        } catch {
          resolve({ status: response.statusCode, data: { raw: responseBody } });
        }
      });
    });

    request.on('error', (err) => {
      reject(err);
    });

    if (body) {
      request.write(JSON.stringify(body));
    }

    request.end();
  });
}

/** Backend sync manager — handles JWT auth, ingest session, and periodic key flush */
class BackendSync {
  private keyBuffer: Array<{ keyCategory: string; timestamp: number; deltaMs: number }> = [];
  private lastKeyTimestamp = 0;
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private isOnline = false;

  get authenticated(): boolean {
    const auth = store.get('backendAuth');
    return !!(auth?.jwtToken && auth?.sessionId && auth?.userId);
  }

  get userId(): string | null {
    return store.get('backendAuth')?.userId || null;
  }

  /** Register a new account, then auto-login */
  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await httpRequest('POST', `${API_BASE}/auth/register`, {
        email,
        password,
        username,
      });

      if (res.status !== 200 && res.status !== 201) {
        const msg = (res.data as { message?: string | string[] }).message;
        const errorText = Array.isArray(msg) ? msg.join(', ') : msg || 'Registration failed';
        return { success: false, error: errorText };
      }

      // Auto-login after successful registration
      return this.login(email, password);
    } catch (err) {
      console.error('Backend register error:', err);
      return { success: false, error: 'Network error — is the server running?' };
    }
  }

  /** Login to the backend and establish an ingest session */
  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Step 1: JWT login
      const loginRes = await httpRequest('POST', `${API_BASE}/auth/login`, { email, password });

      if (loginRes.status !== 200 && loginRes.status !== 201) {
        return { success: false, error: (loginRes.data as { message?: string }).message || 'Login failed' };
      }

      const { accessToken, user } = loginRes.data as {
        accessToken: string;
        user: { id: string; email: string; username: string };
      };

      // Step 2: Ingest auth to get sessionId
      const ingestRes = await httpRequest('POST', `${API_BASE}/ingest/auth`, {
        token: accessToken,
        clientVersion: app.getVersion(),
        machineId: 'electron-desktop',
      });

      if (ingestRes.status !== 200 && ingestRes.status !== 201) {
        return { success: false, error: 'Ingest auth failed' };
      }

      const { sessionId, userId } = ingestRes.data as { sessionId: string; userId: string };

      // Save credentials
      store.set('backendAuth', {
        jwtToken: accessToken,
        sessionId,
        userId,
        username: user.username,
      });

      this.isOnline = true;
      this.startFlushLoop();

      console.log(`Backend login successful: ${user.username} (${userId})`);

      // Notify renderer windows
      notifyAllWindows('backend-status', { online: true, username: user.username });

      return { success: true };
    } catch (err) {
      console.error('Backend login error:', err);
      return { success: false, error: 'Network error — is the server running?' };
    }
  }

  /** Logout and clear credentials */
  logout(): void {
    store.set('backendAuth', {
      jwtToken: null,
      sessionId: null,
      userId: null,
      username: null,
    });
    this.isOnline = false;
    this.stopFlushLoop();
    notifyAllWindows('backend-status', { online: false, username: null });
    console.log('Logged out from backend');
  }

  /** Try to restore an existing session on startup. Returns true if session is valid. */
  async tryRestoreSession(): Promise<boolean> {
    const auth = store.get('backendAuth');
    if (!auth?.jwtToken) return false;

    try {
      // Verify token is still valid
      const res = await httpRequest('GET', `${API_BASE}/auth/me`, undefined, {
        Authorization: `Bearer ${auth.jwtToken}`,
      });

      if (res.status === 200 || res.status === 201) {
        // Re-establish ingest session if needed
        if (!auth.sessionId) {
          const ingestRes = await httpRequest('POST', `${API_BASE}/ingest/auth`, {
            token: auth.jwtToken,
            clientVersion: app.getVersion(),
            machineId: 'electron-desktop',
          });
          if (ingestRes.status === 200 || ingestRes.status === 201) {
            const { sessionId } = ingestRes.data as { sessionId: string };
            store.set('backendAuth.sessionId', sessionId);
          }
        }

        this.isOnline = true;
        this.startFlushLoop();
        console.log(`Backend session restored for ${auth.username}`);
        notifyAllWindows('backend-status', { online: true, username: auth.username });
        return true;
      } else {
        // Token expired — clear it
        console.log('Backend token expired, clearing');
        this.logout();
        return false;
      }
    } catch {
      console.log('Backend not reachable on startup — keeping credentials, will retry on next launch');
      // Do NOT clear credentials here: if Docker is still starting up, we'd lose a valid session.
      // The user will see the auth window and can log in again, but their credentials remain intact
      // so a manual re-login will work without re-registering.
      return false;
    }
  }

  /** Buffer a keypress for backend sync */
  bufferKey(keycode: number): void {
    if (!this.authenticated) return;

    const now = Date.now();
    const deltaMs = this.lastKeyTimestamp > 0 ? now - this.lastKeyTimestamp : 0;
    this.lastKeyTimestamp = now;

    this.keyBuffer.push({
      keyCategory: classifyKeyCode(keycode),
      timestamp: now,
      deltaMs,
    });
  }

  /** Start the periodic flush loop (every 3 seconds) */
  private startFlushLoop(): void {
    if (this.flushInterval) return;

    this.flushInterval = setInterval(() => {
      void this.flushKeys();
    }, 3000);
  }

  /** Stop the flush loop */
  private stopFlushLoop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /** Flush buffered keys to the backend */
  private async flushKeys(): Promise<void> {
    if (this.keyBuffer.length === 0) return;

    const auth = store.get('backendAuth');
    if (!auth?.sessionId || !auth?.userId) return;

    // Drain buffer
    const keysToSend = [...this.keyBuffer];
    this.keyBuffer = [];

    // Send each key event (the ingest API expects individual key events)
    for (const key of keysToSend) {
      try {
        await httpRequest('POST', `${API_BASE}/ingest/key`, {
          userId: auth.userId,
          sessionId: auth.sessionId,
          keyCategory: key.keyCategory,
          timestamp: key.timestamp,
          deltaMs: key.deltaMs,
        });
      } catch {
        // Server might be down — re-buffer the remaining keys
        // Don't re-buffer already-attempted keys to avoid duplication
        break;
      }
    }
  }
}

const backendSync = new BackendSync();

/** Helper to notify all renderer windows */
function notifyAllWindows(channel: string, data: unknown): void {
  if (widgetWindow && !widgetWindow.isDestroyed()) {
    widgetWindow.webContents.send(channel, data);
  }
  if (menuWindow && !menuWindow.isDestroyed()) {
    menuWindow.webContents.send(channel, data);
  }
  if (authWindow && !authWindow.isDestroyed()) {
    authWindow.webContents.send(channel, data);
  }
}

// ============================================================================
// KEYBOARD LISTENER
// ============================================================================

let keyboardListenerStarted = false;

function startKeyboardListener(): void {
  if (keyboardListenerStarted) return;
  keyboardListenerStarted = true;
  try {
    uIOhook.on('keyup', (e) => {
      const gameState = store.get('gameState');

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

      store.set('gameState', gameState);
      
      if (widgetWindow && !widgetWindow.isDestroyed()) {
          widgetWindow.webContents.send('game-state-update', gameState);
          widgetWindow.webContents.send('user-keypress'); // Explicit event for combo
      }
      if (menuWindow && !menuWindow.isDestroyed()) {
          menuWindow.webContents.send('game-state-update', gameState);
      }

      // BUG-06 FIX: Also buffer key for backend sync
      backendSync.bufferKey(e.keycode);
    });

    uIOhook.start();
    console.log('uIOhook keyboard listener started!');
  } catch (error) {
    console.error('Failed to start uIOhook:', error);
  }
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const isDev = process.env.NODE_ENV !== 'production' || !app.isPackaged;

// Store for game data persistence
const store = new Store<IStoreSchema>({
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
    backendAuth: {
      jwtToken: null,
      sessionId: null,
      userId: null,
      username: null,
    },
    users: {},
  },
});

// Debug: Log store path and current state on startup
console.log('📁 Store path:', store.path);
console.log('💾 Loaded gameState:', store.get('gameState'));
console.log('🛒 Loaded items:', store.get('items'));

// ============================================================================
// PER-USER STATE HELPERS
// ============================================================================

const DEFAULT_GAME_STATE: IGameState = {
  linesOfCode: 0,
  totalKeyPresses: 0,
  level: 1,
  experience: 0,
  experienceToNext: 100,
  multiplier: 1.0,
  passiveRate: 0.0,
};

/** Load a user's saved state into the active game state, or reset to defaults for new users */
function loadUserState(userId: string): void {
  const users = store.get('users');
  const userData = users[userId];
  if (userData) {
    store.set('gameState', userData.gameState);
    store.set('items', userData.items ?? {});
    console.log(`💾 Loaded saved state for user ${userId}`);
  } else {
    store.set('gameState', { ...DEFAULT_GAME_STATE });
    store.set('items', {});
    console.log(`🆕 New user ${userId} — starting fresh`);
  }
}

/**
 * Sync local game state from the server's canonical progression.
 * Called after login, register, and session restore so that linesOfCode,
 * level, and multiplier always reflect what the server has committed.
 * Prevents stale local data (e.g. after a DB wipe) from inflating the display.
 */
async function syncProgressionFromServer(): Promise<void> {
  const auth = store.get('backendAuth');
  if (!auth?.jwtToken) return;

  try {
    const res = await httpRequest('GET', `${API_BASE}/progression/me`, undefined, {
      Authorization: `Bearer ${auth.jwtToken}`,
    });

    if (res.status === 200 || res.status === 201) {
      const prog = res.data as {
        linesOfCode: string;
        level: number;
        clickMultiplier: number;
      };

      const gameState = store.get('gameState');
      gameState.linesOfCode = parseFloat(prog.linesOfCode) || 0;
      gameState.multiplier = prog.clickMultiplier || 1.0;
      gameState.level = prog.level || 1;
      store.set('gameState', gameState);
      notifyAllWindows('game-state-update', store.get('gameState'));
      console.log(`[Sync] Server progression loaded: ${prog.linesOfCode} LoC, level ${prog.level}`);
    }
  } catch (err) {
    // Non-fatal — local state remains as fallback until next successful sync
    console.log('[Sync] Could not fetch server progression:', err);
  }
}

/** Persist the active game state back to the user's slot */
function saveUserState(userId: string): void {
  const users = store.get('users');
  users[userId] = {
    gameState: store.get('gameState'),
    items: store.get('items'),
  };
  store.set('users', users);
  console.log(`💾 Saved state for user ${userId}`);
}

// ============================================================================
// WINDOWS
// ============================================================================

let widgetWindow: BrowserWindow | null = null;
let menuWindow: BrowserWindow | null = null;
let authWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createAuthWindow(): void {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;

  authWindow = new BrowserWindow({
    width: 420,
    height: 560,
    x: Math.floor((width - 420) / 2),
    y: Math.floor((height - 560) / 2),
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (isDev) {
    authWindow.loadURL('http://localhost:4000/#/auth');
  } else {
    authWindow.loadFile(path.join(__dirname, 'renderer/index.html'), { hash: '/auth' });
  }

  authWindow.on('closed', () => {
    authWindow = null;
  });
}

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

let passiveIncomeInterval: ReturnType<typeof setInterval> | null = null;

function startPassiveIncomeLoop(): void {
  if (passiveIncomeInterval) return;
  passiveIncomeInterval = setInterval(() => {
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
    const gameState = store.get('gameState');
    gameState.multiplier = multiplier;
    store.set('gameState', gameState);
  });

  // Update passive rate
  ipcMain.handle('update-passive-rate', (_, passiveRate: number) => {
    const gameState = store.get('gameState');
    gameState.passiveRate = passiveRate;
    store.set('gameState', gameState);
  });

  // Subtract LoC (for purchases)
  ipcMain.handle('subtract-loc', (_, amount: number) => {
    const gameState = store.get('gameState');
    if (gameState.linesOfCode >= amount) {
      gameState.linesOfCode -= amount;
      store.set('gameState', gameState);
      return true;
    }
    return false;
  });

  // Save items
  ipcMain.handle('save-items', (_, items: Record<string, number>) => {
    store.set('items', items);
  });

  // ── Backend Auth (BUG-06) ──
  ipcMain.handle('backend-login', async (_, email: string, password: string) => {
    const result = await backendSync.login(email, password);
    if (result.success && backendSync.userId) {
      loadUserState(backendSync.userId);
      await syncProgressionFromServer();
    }
    return result;
  });

  ipcMain.handle('backend-register', async (_, username: string, email: string, password: string) => {
    const result = await backendSync.register(email, password, username);
    if (result.success && backendSync.userId) {
      loadUserState(backendSync.userId);
      await syncProgressionFromServer();
    }
    return result;
  });

  ipcMain.handle('backend-logout', () => {
    backendSync.logout();
    return { success: true };
  });

  // Full logout — saves state, resets, closes game windows, shows auth screen
  ipcMain.on('logout-session', () => {
    const auth = store.get('backendAuth');
    if (auth?.userId) {
      saveUserState(auth.userId);
    }
    backendSync.logout();
    // Reset active state to clean defaults
    store.set('gameState', { ...DEFAULT_GAME_STATE });
    store.set('items', {});
    // Close game windows
    if (widgetWindow && !widgetWindow.isDestroyed()) {
      widgetWindow.close();
      widgetWindow = null;
    }
    if (menuWindow && !menuWindow.isDestroyed()) {
      menuWindow.close();
      menuWindow = null;
    }
    // Show auth window
    createAuthWindow();
  });

  ipcMain.handle('backend-status', () => {
    const auth = store.get('backendAuth');
    return {
      online: backendSync.authenticated,
      username: auth?.username || null,
      userId: auth?.userId || null,
    };
  });

  // Launch game after successful auth — closes auth window, opens game windows
  ipcMain.on('launch-game', () => {
    if (authWindow && !authWindow.isDestroyed()) {
      authWindow.close();
      authWindow = null;
    }
    if (!widgetWindow) {
      createWidgetWindow();
    }
    if (!menuWindow) {
      createMenuWindow();
    }
    startKeyboardListener();
    startPassiveIncomeLoop();
  });

  // TD-03: Fetch leaderboard from backend
  ipcMain.handle('backend-leaderboard', async (_, type?: string) => {
    const auth = store.get('backendAuth');
    if (!auth?.jwtToken) {
      return { success: false, error: 'Not logged in', data: { entries: [] } };
    }

    try {
      const leaderboardType = type || 'GLOBAL';
      const res = await httpRequest(
        'GET',
        `${API_BASE}/progression/leaderboard?type=${leaderboardType}`,
        undefined,
        { Authorization: `Bearer ${auth.jwtToken}` },
      );

      if (res.status !== 200) {
        return { success: false, error: 'Failed to fetch leaderboard', data: { entries: [] } };
      }

      return res.data;
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      return { success: false, error: 'Network error', data: { entries: [] } };
    }
  });

  // Show menu
  ipcMain.on('show-menu', () => {
    console.log('Opening menu window...');
    if (!menuWindow) {
      createMenuWindow();
    }
    if (menuWindow) {
      menuWindow.show();
      menuWindow.focus();
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

app.whenReady().then(async () => {
  setupIpcHandlers();
  createTray();

  // Try to restore an existing backend session
  const sessionRestored = await backendSync.tryRestoreSession();

  if (sessionRestored) {
    // Already authenticated — load user's saved state, then sync from server
    // (server sync overwrites stale local data, e.g. after a DB wipe)
    if (backendSync.userId) {
      loadUserState(backendSync.userId);
      await syncProgressionFromServer();
    }
    createWidgetWindow();
    createMenuWindow();
    startKeyboardListener();
    startPassiveIncomeLoop();
  } else {
    // No valid session — show auth window first
    createAuthWindow();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createAuthWindow();
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
