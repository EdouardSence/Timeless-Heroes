/**
 * @repo/shared-types
 * Shared TypeScript interfaces for Timeless-Heroes
 * Following SOLID principles with clear separation of concerns
 */

// ============================================================================
// NATS MESSAGE PATTERNS (Transport-agnostic via ClientProxy)
// ============================================================================

export const NatsPattern = {
  // ── Progression Service ──
  PROGRESSION_GET: 'progression.get',
  PROGRESSION_UPDATE_BALANCE: 'progression.updateBalance',
  PROGRESSION_ADD_EXPERIENCE: 'progression.addExperience',
  PROGRESSION_PURCHASE_ITEM: 'progression.purchaseItem',
  PROGRESSION_ADD_ITEM: 'progression.addItem',
  PROGRESSION_GET_ITEMS: 'progression.getItems',
  PROGRESSION_GET_LEADERBOARD: 'progression.getLeaderboard',
  PROGRESSION_GET_RANKS: 'progression.getRanks',
  PROGRESSION_CALCULATE_COST: 'progression.calculateCost',

  // ── Payment Service ──
  PAYMENT_CREATE_INTENT: 'payment.createIntent',
  PAYMENT_PROVISION: 'payment.provision',

  // ── Health (all services) ──
  HEALTH_CHECK: 'health.check',
} as const;

export type NatsPattern = typeof NatsPattern[keyof typeof NatsPattern];

/** Injection tokens for ClientProxy instances in the gateway */
export const NATS_SERVICE = {
  PROGRESSION: 'NATS_PROGRESSION_SERVICE',
  PAYMENT: 'NATS_PAYMENT_SERVICE',
  WORKER: 'NATS_WORKER_SERVICE',
} as const;

// ============================================================================
// WEBSOCKET EVENTS
// ============================================================================

export const WebSocketEvent = {
  // Client -> Server
  KEY_PRESS: 'KEY_PRESS',
  PURCHASE_ITEM: 'PURCHASE_ITEM',
  START_PROGRAM: 'START_PROGRAM',
  CANCEL_PROGRAM: 'CANCEL_PROGRAM',
  CLAIM_OFFLINE_REWARDS: 'CLAIM_OFFLINE_REWARDS',

  // Server -> Client
  CLICK_PROCESSED: 'CLICK_PROCESSED',
  BALANCE_UPDATE: 'BALANCE_UPDATE',
  ITEM_PURCHASED: 'ITEM_PURCHASED',
  PROGRAM_STARTED: 'PROGRAM_STARTED',
  PROGRAM_COMPLETED: 'PROGRAM_COMPLETED',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
  LEADERBOARD_UPDATE: 'LEADERBOARD_UPDATE',
  OFFLINE_REWARDS: 'OFFLINE_REWARDS',
  ERROR: 'ERROR',
} as const;

export type WebSocketEvent = typeof WebSocketEvent[keyof typeof WebSocketEvent];

// ============================================================================
// CLICK PROCESSING
// ============================================================================

export interface IKeyPressPayload {
  /** UUID of the user */
  userId: string;
  /** Unix timestamp of the click (client-side) */
  timestamp: number;
  /** Type of key pressed (optional, for future key-specific bonuses) */
  keyType?: KeyType;
}

export const KeyType = {
  NORMAL: 'NORMAL',
  SPECIAL: 'SPECIAL', // Shift, Ctrl, etc.
  FUNCTION: 'FUNCTION', // F1-F12
} as const;

export type KeyType = typeof KeyType[keyof typeof KeyType];

export interface IClickResult {
  /** Base LoC earned */
  baseValue: number;
  /** Final LoC after multipliers */
  finalValue: string; // String for big number
  /** Whether it was a critical hit */
  isCritical: boolean;
  /** New total balance */
  newBalance: string;
  /** Multiplier breakdown */
  multipliers: IMultiplierBreakdown;
}

export interface IMultiplierBreakdown {
  clickMultiplier: number;
  criticalMultiplier: number;
  bonusMultiplier: number;
  totalMultiplier: number;
}

// ============================================================================
// ANTI-CHEAT / THROTTLING
// ============================================================================

export interface IClickValidation {
  isValid: boolean;
  reason?: ClickRejectionReason;
  /** Clicks per second detected */
  detectedCPS: number;
  /** User's allowed max CPS */
  maxAllowedCPS: number;
}

export const ClickRejectionReason = {
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  TIMESTAMP_INVALID: 'TIMESTAMP_INVALID',
  TIMESTAMP_IN_FUTURE: 'TIMESTAMP_IN_FUTURE',
  SUSPICIOUS_PATTERN: 'SUSPICIOUS_PATTERN',
  USER_BANNED: 'USER_BANNED',
} as const;

export type ClickRejectionReason = typeof ClickRejectionReason[keyof typeof ClickRejectionReason];

export interface IThrottleConfig {
  /** Maximum clicks per second */
  maxCPS: number;
  /** Time window for CPS calculation (ms) */
  windowMs: number;
  /** Number of violations before temp ban */
  maxViolations: number;
  /** Duration of temp ban (ms) */
  banDurationMs: number;
}

// ============================================================================
// REDIS BUFFER
// ============================================================================

export interface IRedisClickBuffer {
  /** User ID */
  userId: string;
  /** Accumulated clicks count */
  clicks: number;
  /** Sum of LoC to add (pre-calculated) */
  locToAdd: string; // BigInt as string
  /** Last update timestamp */
  lastUpdate: number;
}

export interface IBufferFlushResult {
  userId: string;
  clicksProcessed: number;
  locAdded: string;
  success: boolean;
  error?: string;
  /** New total balance after flush */
  newBalance?: string;
  /** New level after flush (if leveled up) */
  newLevel?: number;
  /** Processing time in milliseconds */
  processingTimeMs?: number;
}

// ============================================================================
// ITEM SYSTEM
// ============================================================================

export interface IItemPurchaseRequest {
  userId: string;
  itemSlug: string;
  quantity?: number; // Default 1
}

export interface IItemPurchaseResult {
  success: boolean;
  itemSlug: string;
  quantityPurchased: number;
  totalCost: string;
  newBalance: string;
  newQuantityOwned: number;
  nextItemCost: string;
  error?: ItemPurchaseError;
}

export const ItemPurchaseError = {
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  ITEM_NOT_FOUND: 'ITEM_NOT_FOUND',
  MAX_QUANTITY_REACHED: 'MAX_QUANTITY_REACHED',
  ITEM_LOCKED: 'ITEM_LOCKED',
  LEVEL_TOO_LOW: 'LEVEL_TOO_LOW',
} as const;

export type ItemPurchaseError = typeof ItemPurchaseError[keyof typeof ItemPurchaseError];

export interface IItemCostCalculation {
  itemSlug: string;
  baseCost: string;
  currentOwned: number;
  costMultiplier: number;
  nextCost: string;
  /** Cost for buying N items at once */
  bulkCost: (quantity: number) => string;
}

// ============================================================================
// PROGRAMS / EXPEDITIONS
// ============================================================================

export interface IStartProgramRequest {
  userId: string;
  programSlug: string;
  /** Slot index (if multiple programs allowed) */
  slotIndex?: number;
}

export interface IStartProgramResult {
  success: boolean;
  programId?: string;
  programSlug: string;
  startedAt: Date;
  estimatedEndAt: Date;
  durationSeconds: number;
  expectedRewards: IProgramRewards;
  error?: ProgramError;
}

export const ProgramError = {
  PROGRAM_NOT_FOUND: 'PROGRAM_NOT_FOUND',
  PROGRAM_LOCKED: 'PROGRAM_LOCKED',
  NO_AVAILABLE_SLOTS: 'NO_AVAILABLE_SLOTS',
  ALREADY_RUNNING: 'ALREADY_RUNNING',
} as const;

export type ProgramError = typeof ProgramError[keyof typeof ProgramError];

export interface IProgramRewards {
  locReward: string;
  expReward: string;
  possibleLoot: IPossibleLoot[];
}

export interface IPossibleLoot {
  itemSlug: string;
  itemName: string;
  dropChance: number;
  quantity: { min: number; max: number };
}

export interface IProgramCompletionPayload {
  programId: string;
  userId: string;
  programSlug: string;
  earnedLoc: string;
  earnedExp: string;
  lootDropped: ILootDrop[];
  completedAt: Date;
}

export interface ILootDrop {
  itemSlug: string;
  quantity: number;
}

// ============================================================================
// OFFLINE / AFK SYSTEM
// ============================================================================

export interface IOfflineCalculation {
  userId: string;
  disconnectedAt: Date;
  reconnectedAt: Date;
  /** Duration in seconds */
  offlineDuration: number;
  /** Max offline time counted (e.g., 8 hours) */
  maxOfflineTime: number;
  effectiveDuration: number;
  /** LoC per second when offline (usually reduced) */
  offlineRate: number;
  /** Total LoC earned */
  earnedLoc: string;
  /** Total EXP earned */
  earnedExp: string;
  /** Completed programs during offline */
  completedPrograms: IProgramCompletionPayload[];
}

// ============================================================================
// LEADERBOARD
// ============================================================================

export interface ILeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  score: string; // totalLinesWritten as string
  level: number;
  prestigeLevel: number;
}

export interface ILeaderboardUpdate {
  type: LeaderboardType;
  entries: ILeaderboardEntry[];
  userRank?: number;
  totalPlayers: number;
}

export const LeaderboardType = {
  GLOBAL: 'GLOBAL',
  WEEKLY: 'WEEKLY',
  DAILY: 'DAILY',
  FRIENDS: 'FRIENDS',
} as const;

export type LeaderboardType = typeof LeaderboardType[keyof typeof LeaderboardType];

// ============================================================================
// PAYMENT / STRIPE
// ============================================================================

export interface IStripeWebhookPayload {
  id: string;
  type: string;
  data: {
    object: IStripePaymentIntent;
  };
}

export interface IStripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customer: string;
  metadata: {
    userId: string;
    productType: string;
    productData: string; // JSON stringified
    idempotencyKey: string;
  };
}

export interface IProvisionOrderJob {
  transactionId: string;
  userId: string;
  stripePaymentId: string;
  productType: string;
  productData: Record<string, unknown>;
  idempotencyKey: string;
  attemptNumber: number;
}

export interface IProvisionResult {
  success: boolean;
  transactionId: string;
  provisioned: boolean;
  error?: ProvisionError;
}

export const ProvisionError = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  ALREADY_PROVISIONED: 'ALREADY_PROVISIONED',
  INVALID_PRODUCT: 'INVALID_PRODUCT',
  DATABASE_ERROR: 'DATABASE_ERROR',
  RETRY_LIMIT_EXCEEDED: 'RETRY_LIMIT_EXCEEDED',
} as const;

export type ProvisionError = typeof ProvisionError[keyof typeof ProvisionError];

export const ProductType = {
  PREMIUM_CURRENCY: 'PREMIUM_CURRENCY',
  ITEM_PACK: 'ITEM_PACK',
  SUBSCRIPTION: 'SUBSCRIPTION',
  BOOST: 'BOOST',
} as const;

export type ProductType = typeof ProductType[keyof typeof ProductType];

// ============================================================================
// BULLMQ JOB TYPES
// ============================================================================

export const QueueName = {
  CLICK_BUFFER: 'click-buffer',
  PROGRAM_COMPLETION: 'program-completion',
  OFFLINE_CALCULATION: 'offline-calculation',
  PROVISION_ORDER: 'provision-order',
  LEADERBOARD_UPDATE: 'leaderboard-update',
  ACHIEVEMENT_CHECK: 'achievement-check',
} as const;

export type QueueName = typeof QueueName[keyof typeof QueueName];

export interface IJobData {
  [QueueName.CLICK_BUFFER]: IRedisClickBuffer;
  [QueueName.PROGRAM_COMPLETION]: {
    programId: string;
    userId: string;
    programSlug: string;
  };
  [QueueName.OFFLINE_CALCULATION]: {
    userId: string;
    disconnectedAt: string; // ISO string
  };
  [QueueName.PROVISION_ORDER]: IProvisionOrderJob;
  [QueueName.LEADERBOARD_UPDATE]: {
    userId: string;
    newScore: string;
  };
  [QueueName.ACHIEVEMENT_CHECK]: {
    userId: string;
    achievementType: string;
    value: string;
  };
}

// ============================================================================
// gRPC SERVICE INTERFACES
// ============================================================================

export interface IProgressionServiceClient {
  getProgression(userId: string): Promise<IProgressionData>;
  updateBalance(userId: string, delta: string): Promise<IProgressionData>;
  addItem(userId: string, itemSlug: string, quantity: number): Promise<boolean>;
  checkAchievements(userId: string): Promise<string[]>; // Achievement IDs
}

export interface IProgressionData {
  userId: string;
  linesOfCode: string;
  level: number;
  experience: string;
  clickMultiplier: number;
  passiveMultiplier: number;
  criticalChance: number;
  criticalMultiplier: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type BigNumberString = string;

export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  timestamp: string;
}

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
