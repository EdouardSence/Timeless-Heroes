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

  // ── Shop Catalog ──
  SHOP_GET_CATALOG: 'shop.getCatalog',

  // ── Payment Service ──
  PAYMENT_CREATE_INTENT: 'payment.createIntent',
  PAYMENT_PROVISION: 'payment.provision',

  // ── Health (all services) ──
  HEALTH_CHECK: 'health.check',
} as const;

export type NatsPattern = (typeof NatsPattern)[keyof typeof NatsPattern];

/** Injection tokens for ClientProxy instances in the gateway */
export const NATS_SERVICE = {
  PROGRESSION: 'NATS_PROGRESSION_SERVICE',
  PAYMENT: 'NATS_PAYMENT_SERVICE',
  WORKER: 'NATS_WORKER_SERVICE',
} as const;

// ============================================================================
// ROLES (mirrors Prisma enum Role)
// ============================================================================

export enum Role {
  PLAYER = 'PLAYER',
  ADMIN = 'ADMIN',
}

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
  GET_SHOP_CATALOG: 'GET_SHOP_CATALOG',

  // Server -> Client
  CLICK_PROCESSED: 'CLICK_PROCESSED',
  BALANCE_UPDATE: 'BALANCE_UPDATE',
  ITEM_PURCHASED: 'ITEM_PURCHASED',
  PROGRAM_STARTED: 'PROGRAM_STARTED',
  PROGRAM_COMPLETED: 'PROGRAM_COMPLETED',
  ACHIEVEMENT_UNLOCKED: 'ACHIEVEMENT_UNLOCKED',
  LEADERBOARD_UPDATE: 'LEADERBOARD_UPDATE',
  OFFLINE_REWARDS: 'OFFLINE_REWARDS',
  SHOP_CATALOG: 'SHOP_CATALOG',
  ERROR: 'ERROR',
} as const;

export type WebSocketEvent =
  (typeof WebSocketEvent)[keyof typeof WebSocketEvent];

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

export type KeyType = (typeof KeyType)[keyof typeof KeyType];

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

export type ClickRejectionReason =
  (typeof ClickRejectionReason)[keyof typeof ClickRejectionReason];

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

export type ItemPurchaseError =
  (typeof ItemPurchaseError)[keyof typeof ItemPurchaseError];

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

export type ProgramError = (typeof ProgramError)[keyof typeof ProgramError];

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

export type LeaderboardType =
  (typeof LeaderboardType)[keyof typeof LeaderboardType];

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

export type ProvisionError =
  (typeof ProvisionError)[keyof typeof ProvisionError];

export const ProductType = {
  PREMIUM_CURRENCY: 'PREMIUM_CURRENCY',
  ITEM_PACK: 'ITEM_PACK',
  SUBSCRIPTION: 'SUBSCRIPTION',
  BOOST: 'BOOST',
} as const;

export type ProductType = (typeof ProductType)[keyof typeof ProductType];

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

export type QueueName = (typeof QueueName)[keyof typeof QueueName];

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
  /** Monotonically increasing total — used for leaderboard ranking */
  totalLinesWritten: string;
  level: number;
  experience: string;
  /** Experience threshold for the next level-up */
  experienceToNext: string;
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

// ============================================================================
// SHOP ITEMS CATALOG (Single Source of Truth)
// Must match the DB seed in scripts/db/01-init.sql exactly.
// ============================================================================

export const ItemCategory = {
  HARDWARE: 'HARDWARE',
  SOFTWARE: 'SOFTWARE',
  COFFEE: 'COFFEE',
  TEAM_MEMBER: 'TEAM_MEMBER',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
} as const;

export type ItemCategory = (typeof ItemCategory)[keyof typeof ItemCategory];

export const EffectType = {
  CLICK_BONUS: 'CLICK_BONUS',
  CLICK_MULTIPLIER: 'CLICK_MULTIPLIER',
  PASSIVE_BONUS: 'PASSIVE_BONUS',
  PASSIVE_MULTIPLIER: 'PASSIVE_MULTIPLIER',
  CRIT_CHANCE: 'CRIT_CHANCE',
  CRIT_MULTIPLIER: 'CRIT_MULTIPLIER',
  EXPERIENCE_BONUS: 'EXPERIENCE_BONUS',
} as const;

export type EffectType = (typeof EffectType)[keyof typeof EffectType];

export const ItemRarity = {
  COMMON: 'COMMON',
  UNCOMMON: 'UNCOMMON',
  RARE: 'RARE',
  EPIC: 'EPIC',
  LEGENDARY: 'LEGENDARY',
  MYTHIC: 'MYTHIC',
} as const;

export type ItemRarity = (typeof ItemRarity)[keyof typeof ItemRarity];

export interface IShopItem {
  /** Slug — matches the `slug` column in the DB `Item` table */
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ItemCategory;
  rarity: ItemRarity;
  baseCost: number;
  costMultiplier: number;
  effect: {
    type: EffectType;
    value: number;
  };
  unlockLevel: number;
  maxQuantity?: number;
}

// ---------------------------------------------------------------------------
// 20 items — mirrors scripts/db/01-init.sql seed data exactly.
// ---------------------------------------------------------------------------

export const SHOP_ITEMS: IShopItem[] = [
  // ── HARDWARE (Click bonuses) ──────────────────────────────────────────────
  {
    id: 'rubber-duck',
    name: 'Rubber Duck',
    description: 'Every dev needs a debugging companion. +1 LoC/click.',
    icon: '🦆',
    category: ItemCategory.HARDWARE,
    rarity: ItemRarity.COMMON,
    baseCost: 10,
    costMultiplier: 1.15,
    effect: { type: EffectType.CLICK_BONUS, value: 1.0 },
    unlockLevel: 1,
  },
  {
    id: 'mechanical-keyboard',
    name: 'Mechanical Keyboard',
    description: 'Cherry MX Blues. Annoying but productive. +5 LoC/click.',
    icon: '⌨️',
    category: ItemCategory.HARDWARE,
    rarity: ItemRarity.COMMON,
    baseCost: 100,
    costMultiplier: 1.15,
    effect: { type: EffectType.CLICK_BONUS, value: 5.0 },
    unlockLevel: 3,
  },
  {
    id: 'ultrawide-monitor',
    name: 'Ultrawide Monitor',
    description:
      '49-inch curved display. More pixels, more code. +25 LoC/click.',
    icon: '🖥️',
    category: ItemCategory.HARDWARE,
    rarity: ItemRarity.UNCOMMON,
    baseCost: 1000,
    costMultiplier: 1.15,
    effect: { type: EffectType.CLICK_BONUS, value: 25.0 },
    unlockLevel: 8,
  },
  {
    id: 'standing-desk',
    name: 'Standing Desk',
    description:
      'Motorized sit-stand desk. Better posture = better code. +100 LoC/click.',
    icon: '🪑',
    category: ItemCategory.HARDWARE,
    rarity: ItemRarity.RARE,
    baseCost: 10000,
    costMultiplier: 1.15,
    effect: { type: EffectType.CLICK_BONUS, value: 100.0 },
    unlockLevel: 15,
  },
  {
    id: 'quantum-processor',
    name: 'Quantum Processor',
    description:
      'Experimental quantum chip. Compiles in superposition. +500 LoC/click.',
    icon: '⚛️',
    category: ItemCategory.HARDWARE,
    rarity: ItemRarity.EPIC,
    baseCost: 100000,
    costMultiplier: 1.18,
    effect: { type: EffectType.CLICK_BONUS, value: 500.0 },
    unlockLevel: 30,
  },

  // ── SOFTWARE (Click multipliers) ──────────────────────────────────────────
  {
    id: 'vim-config',
    name: 'Custom Vim Config',
    description:
      'Years of tweaking .vimrc finally pay off. x1.1 click multiplier.',
    icon: '📝',
    category: ItemCategory.SOFTWARE,
    rarity: ItemRarity.UNCOMMON,
    baseCost: 500,
    costMultiplier: 1.2,
    effect: { type: EffectType.CLICK_MULTIPLIER, value: 0.1 },
    unlockLevel: 5,
    maxQuantity: 10,
  },
  {
    id: 'copilot-ai',
    name: 'AI Copilot',
    description: 'Your AI pair programmer. x1.25 click multiplier.',
    icon: '🤖',
    category: ItemCategory.SOFTWARE,
    rarity: ItemRarity.RARE,
    baseCost: 5000,
    costMultiplier: 1.25,
    effect: { type: EffectType.CLICK_MULTIPLIER, value: 0.25 },
    unlockLevel: 12,
    maxQuantity: 5,
  },
  {
    id: 'custom-ide',
    name: 'Custom IDE',
    description: 'Built your own IDE from scratch. x1.5 click multiplier.',
    icon: '💻',
    category: ItemCategory.SOFTWARE,
    rarity: ItemRarity.EPIC,
    baseCost: 50000,
    costMultiplier: 1.3,
    effect: { type: EffectType.CLICK_MULTIPLIER, value: 0.5 },
    unlockLevel: 20,
    maxQuantity: 3,
  },

  // ── TEAM MEMBERS (Passive generation) ─────────────────────────────────────
  {
    id: 'intern',
    name: 'Junior Intern',
    description: 'Fresh out of bootcamp. Generates 5 LoC/sec passively.',
    icon: '👶',
    category: ItemCategory.TEAM_MEMBER,
    rarity: ItemRarity.COMMON,
    baseCost: 200,
    costMultiplier: 1.15,
    effect: { type: EffectType.PASSIVE_BONUS, value: 5.0 },
    unlockLevel: 2,
  },
  {
    id: 'junior-dev',
    name: 'Junior Developer',
    description: 'Knows React. Generates 20 LoC/sec passively.',
    icon: '👨‍💻',
    category: ItemCategory.TEAM_MEMBER,
    rarity: ItemRarity.UNCOMMON,
    baseCost: 2000,
    costMultiplier: 1.15,
    effect: { type: EffectType.PASSIVE_BONUS, value: 20.0 },
    unlockLevel: 7,
  },
  {
    id: 'senior-dev',
    name: 'Senior Developer',
    description: '10 years experience. Generates 50 LoC/sec passively.',
    icon: '👩‍💻',
    category: ItemCategory.TEAM_MEMBER,
    rarity: ItemRarity.RARE,
    baseCost: 20000,
    costMultiplier: 1.15,
    effect: { type: EffectType.PASSIVE_BONUS, value: 50.0 },
    unlockLevel: 14,
  },
  {
    id: 'tech-lead',
    name: 'Tech Lead',
    description: 'Designs the architecture. Generates 200 LoC/sec passively.',
    icon: '🧑‍💼',
    category: ItemCategory.TEAM_MEMBER,
    rarity: ItemRarity.EPIC,
    baseCost: 200000,
    costMultiplier: 1.18,
    effect: { type: EffectType.PASSIVE_BONUS, value: 200.0 },
    unlockLevel: 22,
  },
  {
    id: 'cto',
    name: 'CTO',
    description: 'The mythical 10x engineer. Generates 1000 LoC/sec passively.',
    icon: '👑',
    category: ItemCategory.TEAM_MEMBER,
    rarity: ItemRarity.LEGENDARY,
    baseCost: 2000000,
    costMultiplier: 1.2,
    effect: { type: EffectType.PASSIVE_BONUS, value: 1000.0 },
    unlockLevel: 35,
    maxQuantity: 1,
  },

  // ── COFFEE (Crit chance / crit multiplier) ────────────────────────────────
  {
    id: 'espresso',
    name: 'Espresso Shot',
    description: 'Quick caffeine hit. +2% critical chance.',
    icon: '☕',
    category: ItemCategory.COFFEE,
    rarity: ItemRarity.COMMON,
    baseCost: 300,
    costMultiplier: 1.2,
    effect: { type: EffectType.CRIT_CHANCE, value: 0.02 },
    unlockLevel: 4,
    maxQuantity: 20,
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew Concentrate',
    description: 'Slow-drip perfection. +5% critical chance.',
    icon: '🧊',
    category: ItemCategory.COFFEE,
    rarity: ItemRarity.UNCOMMON,
    baseCost: 3000,
    costMultiplier: 1.25,
    effect: { type: EffectType.CRIT_CHANCE, value: 0.05 },
    unlockLevel: 10,
    maxQuantity: 10,
  },
  {
    id: 'energy-drink',
    name: 'Energy Drink IV Drip',
    description: 'Maximum caffeine delivery. x1.5 critical multiplier.',
    icon: '⚡',
    category: ItemCategory.COFFEE,
    rarity: ItemRarity.RARE,
    baseCost: 8000,
    costMultiplier: 1.2,
    effect: { type: EffectType.CRIT_MULTIPLIER, value: 0.5 },
    unlockLevel: 16,
    maxQuantity: 5,
  },

  // ── INFRASTRUCTURE (Passive multipliers) ──────────────────────────────────
  {
    id: 'cloud-vps',
    name: 'Cloud VPS',
    description: 'A small server in the cloud. x1.1 passive multiplier.',
    icon: '☁️',
    category: ItemCategory.INFRASTRUCTURE,
    rarity: ItemRarity.UNCOMMON,
    baseCost: 5000,
    costMultiplier: 1.2,
    effect: { type: EffectType.PASSIVE_MULTIPLIER, value: 0.1 },
    unlockLevel: 6,
  },
  {
    id: 'kubernetes-cluster',
    name: 'Kubernetes Cluster',
    description: 'Container orchestration at scale. x1.3 passive multiplier.',
    icon: '🐳',
    category: ItemCategory.INFRASTRUCTURE,
    rarity: ItemRarity.RARE,
    baseCost: 50000,
    costMultiplier: 1.25,
    effect: { type: EffectType.PASSIVE_MULTIPLIER, value: 0.3 },
    unlockLevel: 18,
    maxQuantity: 5,
  },
  {
    id: 'data-center',
    name: 'Private Data Center',
    description: 'Your own rack. x1.5 passive multiplier.',
    icon: '🏢',
    category: ItemCategory.INFRASTRUCTURE,
    rarity: ItemRarity.EPIC,
    baseCost: 500000,
    costMultiplier: 1.3,
    effect: { type: EffectType.PASSIVE_MULTIPLIER, value: 0.5 },
    unlockLevel: 28,
    maxQuantity: 3,
  },
  {
    id: 'quantum-mainframe',
    name: 'Quantum Mainframe',
    description: 'The ultimate compute. x2.0 passive multiplier.',
    icon: '🔮',
    category: ItemCategory.INFRASTRUCTURE,
    rarity: ItemRarity.LEGENDARY,
    baseCost: 5000000,
    costMultiplier: 1.35,
    effect: { type: EffectType.PASSIVE_MULTIPLIER, value: 1.0 },
    unlockLevel: 40,
    maxQuantity: 1,
  },
];
