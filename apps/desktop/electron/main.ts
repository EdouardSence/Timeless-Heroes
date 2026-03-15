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

/** Backend sync manager — handles JWT auth, ingest session, and periodic key flush.
 *
 * ARCHITECTURE: The server is the single source of truth for linesOfCode.
 * The desktop NEVER computes LOC locally. Instead:
 * 1. Keystrokes are buffered in memory
 * 2. Every 2s, the batch is sent to POST /ingest/batch
 * 3. The server processes all keys, calculates LOC, and returns the new balance
 * 4. The desktop REPLACES its local LOC with the server's response (HWM prevents drops)
 * 5. The UI always shows exactly the server-authoritative value — no optimistic bonus
 */
class BackendSync {
  private keyBuffer: Array<{ keyCategory: string; timestamp: number; deltaMs: number }> = [];
  private lastKeyTimestamp = 0;
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private isOnline = false;
  /** Accumulated passive LoC that hasn't been sent to the backend yet */
  private pendingPassiveLoC = 0;
  /** Seconds of passive income accumulated since last flush */
  private pendingPassiveSeconds = 0;
  /** Whether a flush is currently in progress (prevents overlapping flushes) */
  private flushing = false;
  /**
   * High-water mark: the highest LOC value ever received from the server.
   * We NEVER allow the displayed LOC to drop below this, even if the server
   * temporarily returns a lower value due to flush race conditions.
   */
  private _serverLocHighWater = 0;

  get serverLocHighWater(): number {
    return this._serverLocHighWater;
  }

  /** Update high-water mark. Only increases (never decreases) except via forceSetHighWater. */
  updateHighWater(serverLoc: number): void {
    if (serverLoc > this._serverLocHighWater) {
      this._serverLocHighWater = serverLoc;
    }
  }

  /** Force-set the high-water mark (used after purchases where balance legitimately drops). */
  forceSetHighWater(serverLoc: number): void {
    this._serverLocHighWater = serverLoc;
  }

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

  /** Buffer passive income LoC for backend sync */
  bufferPassiveIncome(locAmount: number): void {
    if (!this.authenticated) return;
    this.pendingPassiveLoC += locAmount;
    this.pendingPassiveSeconds += 1;
  }

  /** Start the periodic flush loop (every 2 seconds) */
  startFlushLoop(): void {
    if (this.flushInterval) return;

    this.flushInterval = setInterval(() => {
      // Serialize flushes: keys first, then passive. Both call
      // applyServerProgression() so running them concurrently would
      // cause race conditions where one overwrites the other's state.
      void (async () => {
        await this.flushKeys();
        await this.flushPassiveIncome();
      })();
    }, 2000);

    // NOTE: We intentionally do NOT run a periodic syncProgressionFromServer()
    // here. The 30s sync was causing a regression where stale server values
    // overwrote local progress. Syncing only happens on login/restore/purchase.
  }

  /** Stop the flush loop */
  stopFlushLoop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  /** Force an immediate flush of buffered keys */
  async forceFlush(): Promise<void> {
    await this.flushKeys();
    await this.flushPassiveIncome();
  }

  /** Flush buffered keys to the backend via batch endpoint.
   *  The server processes all keys, returns the authoritative LOC balance,
   *  and we REPLACE local state with the server's response.
   */
  private async flushKeys(): Promise<void> {
    if (this.keyBuffer.length === 0) return;
    if (this.flushing) return; // Prevent overlapping flushes

    const auth = store.get('backendAuth');
    if (!auth?.sessionId || !auth?.userId) return;

    this.flushing = true;

    // Drain buffer (max 200 per batch as enforced by server)
    const keysToSend = this.keyBuffer.splice(0, 200);

    try {
      const res = await httpRequest('POST', `${API_BASE}/ingest/batch`, {
        userId: auth.userId,
        sessionId: auth.sessionId,
        keys: keysToSend.map(k => ({
          keyCategory: k.keyCategory,
          timestamp: k.timestamp,
          deltaMs: k.deltaMs,
        })),
      });

      if (res.status === 401 || res.status === 403) {
        console.warn('Ingest session expired, stopping flush');
        // Put keys back at front of buffer so they aren't lost
        this.keyBuffer = [...keysToSend, ...this.keyBuffer];
        this.flushing = false;
        return;
      }

      // Apply server's authoritative progression
      const data = res.data as { success?: boolean; progression?: Record<string, unknown> };
      console.log(`[flushKeys] server response: accepted=${(data as any).accepted}, rejected=${(data as any).rejected}, progression.linesOfCode=${data.progression?.linesOfCode}, current store.linesOfCode=${store.get('gameState')?.linesOfCode}`);
      if (data.success && data.progression) {
        applyServerProgression(data.progression);
      }
    } catch (err) {
      console.error('Failed to send key batch:', err);
      // Put keys back so they aren't lost
      this.keyBuffer = [...keysToSend, ...this.keyBuffer];
    } finally {
      this.flushing = false;
    }
  }

  /** Flush accumulated passive income to the backend.
   *  The server returns the authoritative balance in the response.
   */
  private async flushPassiveIncome(): Promise<void> {
    if (this.pendingPassiveLoC <= 0) return;

    const auth = store.get('backendAuth');
    if (!auth?.sessionId || !auth?.userId) return;

    const locToSend = this.pendingPassiveLoC;
    const secondsToSend = this.pendingPassiveSeconds;
    this.pendingPassiveLoC = 0;
    this.pendingPassiveSeconds = 0;

    try {
      const res = await httpRequest('POST', `${API_BASE}/ingest/passive`, {
        userId: auth.userId,
        sessionId: auth.sessionId,
        locAmount: locToSend,
        seconds: secondsToSend,
      });

      if (res.status === 401 || res.status === 403) {
        console.warn('Ingest session expired during passive flush');
        // Put back so we don't lose it
        this.pendingPassiveLoC += locToSend;
        this.pendingPassiveSeconds += secondsToSend;
        return;
      }

      // Apply server's authoritative progression
      const data = res.data as { success?: boolean; progression?: Record<string, unknown> };
      if (data.success && data.progression) {
        // Let applyServerProgression compute the delta and reduce the optimistic
        // bonus proportionally — no hard reset, so the display never drops.
        applyServerProgression(data.progression);
      }
    } catch (err) {
      console.error('Failed to send passive income:', err);
      // Put back on failure
      this.pendingPassiveLoC += locToSend;
      this.pendingPassiveSeconds += secondsToSend;
    }
  }

  /** Purchase an item from the backend. Returns the server's purchase response. */
  async purchaseItem(itemSlug: string): Promise<{ success: boolean; error?: string; data?: Record<string, unknown> }> {
    const auth = store.get('backendAuth');
    if (!auth?.jwtToken) return { success: false, error: 'Not logged in' };

    try {
      const res = await httpRequest('POST', `${API_BASE}/progression/purchase`, { itemSlug }, {
        Authorization: `Bearer ${auth.jwtToken}`,
      });

      if (res.status !== 200 && res.status !== 201) {
        return { success: false, error: (res.data as any)?.error?.message || (res.data as any)?.message || 'Purchase failed' };
      }

      // The HTTP response wraps the NATS response: { success, data: { success, data: {...}, error? } }
      // HTTP 200 doesn't guarantee purchase success — check the inner success field.
      const responseData = res.data as Record<string, unknown>;
      const innerSuccess = (responseData.success !== false)
        && ((responseData.data as Record<string, unknown>)?.success !== false);

      if (!innerSuccess) {
        const innerError = (responseData.data as Record<string, unknown>)?.error as Record<string, unknown> | undefined;
        return {
          success: false,
          error: (innerError?.message as string) || 'Purchase failed on server',
          data: responseData,
        };
      }

      return { success: true, data: responseData };
    } catch (err) {
      console.error('Backend purchase error:', err);
      return { success: false, error: 'Network error' };
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

      // Track total key presses locally (for display/stats only)
      gameState.totalKeyPresses = (gameState.totalKeyPresses || 0) + 1;
      store.set('gameState', gameState);

      // Display always shows the server-authoritative value (gameState.linesOfCode).
      // LoC will update when the next flush response arrives from the server.
      if (widgetWindow && !widgetWindow.isDestroyed()) {
          widgetWindow.webContents.send('game-state-update', gameState);
          widgetWindow.webContents.send('user-keypress'); // Explicit event for combo
      }
      if (menuWindow && !menuWindow.isDestroyed()) {
          menuWindow.webContents.send('game-state-update', gameState);
      }

      // Buffer key for backend batch sync
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
 * Apply server progression to local state — REPLACES local values entirely.
 * This is the single function that writes server-authoritative data to the store.
 * Called from flushKeys(), flushPassiveIncome(), syncProgressionFromServer(), and purchase handlers.
 */
/**
 * Apply server progression to local state — REPLACES local values entirely.
 * This is the single function that writes server-authoritative data to the store.
 * Called from flushKeys(), flushPassiveIncome(), syncProgressionFromServer(), and purchase handlers.
 *
 * Uses a high-water mark for LOC: the displayed LOC never drops below the highest
 * value ever seen from the server, unless forceSetHighWater() was called (purchases).
 */
function applyServerProgression(prog: Record<string, unknown>): void {
  const gameState = store.get('gameState');

  const rawServerLoC = parseFloat(String(prog.linesOfCode ?? '0')) || 0;
  const serverLevel = typeof prog.level === 'number' ? prog.level : (gameState.level || 1);
  // Use typeof check, NOT ||, so that 0 values are preserved correctly
  const serverMultiplier = typeof prog.clickMultiplier === 'number' ? prog.clickMultiplier : (gameState.multiplier ?? 1.0);
  const serverPassiveRate = typeof prog.passiveMultiplier === 'number' ? prog.passiveMultiplier : (gameState.passiveRate ?? 0);
  const serverExperience = parseFloat(String(prog.experience ?? '0')) || 0;

  // Apply high-water mark: never let LOC drop due to stale server responses
  backendSync.updateHighWater(rawServerLoC);
  const effectiveLoC = backendSync.serverLocHighWater;

  // CRITICAL: Always REPLACE local values with server values
  gameState.linesOfCode = effectiveLoC;
  gameState.level = serverLevel;
  gameState.multiplier = serverMultiplier;
  gameState.passiveRate = serverPassiveRate;
  gameState.experience = serverExperience;

  store.set('gameState', gameState);

  // Notify renderers with the authoritative server state — no optimistic bonus.
  // UI always shows exactly what the server says.
  notifyAllWindows('game-state-update', gameState);

  console.log(`[ApplyServer] LoC=${effectiveLoC} (server=${rawServerLoC}, hwm=${backendSync.serverLocHighWater}), level=${serverLevel}, mult=${serverMultiplier}, passive=${serverPassiveRate}, xp=${serverExperience}`);
}

/**
 * Sync local game state from the server's canonical progression.
 * Called after login, register, session restore, and purchases.
 *
 * Strategy:
 * 1. Force-flush any pending keys / passive income so the server has our latest data.
 * 2. Fetch the server's canonical balance.
 * 3. REPLACE local state entirely with server values (server is single source of truth).
 */
async function syncProgressionFromServer(): Promise<void> {
  const auth = store.get('backendAuth');
  if (!auth?.jwtToken) return;

  // Step 1: Flush pending data so server is as up-to-date as possible
  try {
    await backendSync.forceFlush();
  } catch {
    // Non-fatal — continue with sync even if flush fails
  }

  try {
    const res = await httpRequest('GET', `${API_BASE}/progression/me`, undefined, {
      Authorization: `Bearer ${auth.jwtToken}`,
    });

    if (res.status === 200 || res.status === 201) {
      // Handle both wrapped IApiResponse { success, data: {...} } and direct { linesOfCode, ... }
      const raw = res.data as Record<string, unknown>;
      const prog = (raw.data && typeof raw.data === 'object' ? raw.data : raw) as Record<string, unknown>;

      applyServerProgression(prog);
      console.log(`[Sync] Server progression applied`);
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
      
      // DO NOT add LOC locally — the server is the single source of truth.
      // Display updates when the flush response arrives from the server.
      
      // Also add virtual key presses for stats display (local-only stat)
      gameState.totalKeyPresses += Math.floor(keysGenerated);
      store.set('gameState', gameState);

      // Send the authoritative server state — no optimistic bonus
      if (widgetWindow && !widgetWindow.isDestroyed()) {
        widgetWindow.webContents.send('game-state-update', gameState);
      }
      if (menuWindow && !menuWindow.isDestroyed()) {
        menuWindow.webContents.send('game-state-update', gameState);
      }

      // Buffer passive income for backend sync (sent every 2s by flush loop)
      backendSync.bufferPassiveIncome(locGained);
    }
  }, 1000);
}

// ============================================================================
// IPC HANDLERS
// ============================================================================

function setupIpcHandlers(): void {
  // Get game state — always returns the server-authoritative value
  ipcMain.handle('get-game-state', () => {
    return store.get('gameState');
  });

  // Get items
  ipcMain.handle('get-items', () => {
    return store.get('items');
  });

  // Update multiplier — NO-OP: server is the single source of truth for multiplier.
  // The value is applied when we receive server progression responses.
  ipcMain.handle('update-multiplier', (_: unknown, _multiplier: number) => {
    // Intentionally empty — server controls multiplier via purchases
    console.log('[IPC] update-multiplier called but ignored (server is source of truth)');
  });

  // Update passive rate — NO-OP: server is the single source of truth for passiveRate.
  ipcMain.handle('update-passive-rate', (_: unknown, _passiveRate: number) => {
    // Intentionally empty — server controls passiveRate via purchases
    console.log('[IPC] update-passive-rate called but ignored (server is source of truth)');
  });

  // Subtract LoC — NO-OP: purchases go through the server and deduct LOC there.
  // After a purchase, syncProgressionFromServer() refreshes the local balance.
  ipcMain.handle('subtract-loc', (_: unknown, _amount: number) => {
    console.log('[IPC] subtract-loc called but ignored (server handles purchase deductions)');
    return true; // Return true to not break callers expecting a boolean
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
      backendSync.forceSetHighWater(0); // Reset HWM — server value is authoritative on login
      await syncProgressionFromServer();
    }
    return result;
  });

  ipcMain.handle('backend-register', async (_, username: string, email: string, password: string) => {
    const result = await backendSync.register(email, password, username);
    if (result.success && backendSync.userId) {
      loadUserState(backendSync.userId);
      backendSync.forceSetHighWater(0); // Reset HWM — fresh account
      await syncProgressionFromServer();
    }
    return result;
  });

  ipcMain.handle('backend-buy-item', async (_, itemSlug: string) => {
    // Stop flush loop to prevent races during purchase + sync
    backendSync.stopFlushLoop();
    try {
      // Force flush pending data so server has our latest balance before deducting
      await backendSync.forceFlush();

      const result = await backendSync.purchaseItem(itemSlug);
      if (result.success) {
        // Force-reset the high-water mark so the post-purchase (lower) balance is accepted
        backendSync.forceSetHighWater(0);
        // Sync from server to get the post-purchase balance, multiplier, etc.
        await syncProgressionFromServer();
      }
      return result;
    } finally {
      // Always restart the flush loop, even if purchase failed
      backendSync.startFlushLoop();
    }
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
    // Force flush pending keys before logout to ensure no progress is lost
    void backendSync.forceFlush();
    
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
      backendSync.forceSetHighWater(0); // Reset HWM — server value is authoritative on restore
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
