/**
 * TCP Ingest Types
 * Type definitions for the TCP keylogger protocol
 * 
 * SECURITY: All types are designed to NEVER contain actual key values
 * Only anonymized categories are allowed
 */

/**
 * Key categories - anonymized key types
 * These represent the TYPE of key, never the actual key pressed
 */
export type KeyCategory =
  | 'CHAR'        // Any alphanumeric character (a-z, 0-9)
  | 'MODIFIER'    // Shift, Ctrl, Alt, Win
  | 'FUNCTION'    // F1-F12
  | 'NAVIGATION'  // Arrow keys, Home, End, PgUp, PgDown
  | 'ENTER'       // Enter/Return
  | 'SPACE'       // Spacebar
  | 'BACKSPACE'   // Backspace/Delete
  | 'TAB'         // Tab
  | 'UNKNOWN';    // Unclassified keys

/**
 * Anonymized key press event
 * CRITICAL: This must NEVER contain the actual key code or character
 */
export interface ITcpKeyPressEvent {
  /** Time since last key press in ms (for anti-cheat) */
  deltaMs?: number;

  /** Anonymized key category - NOT the actual key */
  keyCategory: KeyCategory;

  /** Session ID (from auth) */
  sessionId: string;

  /** Unix timestamp of the key press (client-side) */
  timestamp: number;

  /** User ID (from authenticated session) */
  userId: string;
}

/**
 * Authentication request from keylogger
 */
export interface ITcpAuthRequest {
  /** Client version (for compatibility checks) */
  clientVersion?: string;

  /** Machine identifier (anonymized hash) */
  machineId?: string;

  /** JWT token obtained from web login */
  token: string;
}

/**
 * Authentication response
 */
export interface ITcpAuthResponse {
  /** Error or success message */
  message: string;

  /** Session ID for subsequent requests */
  sessionId?: string;

  /** Whether auth was successful */
  success: boolean;

  /** User ID (only on success) */
  userId?: string;
}

/**
 * Anti-cheat analysis result
 */
export interface IAntiCheatResult {
  /** Whether the action is allowed */
  allowed: boolean;

  /** Confidence score (0-1) that the user is human */
  humanScore: number;

  /** Reason for blocking (if not allowed) */
  reason?: AntiCheatReason;

  /** Warning flag (suspicious but not blocked) */
  warning?: boolean;
}

/**
 * Reasons for anti-cheat rejection
 */
export type AntiCheatReason =
  | 'RATE_TOO_FAST'        // Inhuman typing speed
  | 'TIMING_TOO_REGULAR'   // Robot-like consistent timing
  | 'IMPOSSIBLE_PATTERN'   // Physically impossible key combinations
  | 'USER_BANNED'          // User is temporarily banned
  | 'SESSION_INVALID';     // Invalid or expired session

/**
 * Typing metrics for anti-cheat analysis
 */
export interface ITypingMetrics {
  /** Average time between keypresses (ms) */
  averageDeltaMs: number;

  /** Current clicks per second */
  currentCPS: number;

  /** Standard deviation of delta times */
  deltaStdDev: number;

  /** Number of consecutive same-interval presses */
  regularIntervalCount: number;
}
