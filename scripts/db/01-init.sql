-- ============================================================================
-- Timeless-Heroes: Database Initialization & Seed Script
-- Runs automatically on first PostgreSQL container start via
-- docker-entrypoint-initdb.d volume mount.
--
-- This script:
--   1. Enables the uuid-ossp extension for UUID generation
--   2. Creates all tables matching the Prisma schema
--   3. Seeds reference data (items, program types, achievements)
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE "ItemCategory" AS ENUM (
  'HARDWARE', 'SOFTWARE', 'COFFEE', 'TEAM_MEMBER', 'INFRASTRUCTURE'
);

CREATE TYPE "EffectType" AS ENUM (
  'CLICK_BONUS', 'PASSIVE_BONUS', 'CLICK_MULTIPLIER',
  'PASSIVE_MULTIPLIER', 'CRIT_CHANCE', 'CRIT_MULTIPLIER',
  'EXPERIENCE_BONUS'
);

CREATE TYPE "Rarity" AS ENUM (
  'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'
);

CREATE TYPE "ProgramCategory" AS ENUM (
  'BUG_FIX', 'FEATURE', 'REFACTORING', 'ARCHITECTURE', 'DEPLOYMENT', 'RESEARCH'
);

CREATE TYPE "ProgramStatus" AS ENUM (
  'RUNNING', 'COMPLETED', 'CANCELLED', 'FAILED'
);

CREATE TYPE "TransactionStatus" AS ENUM (
  'PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED'
);

CREATE TYPE "ProductType" AS ENUM (
  'PREMIUM_CURRENCY', 'ITEM_PACK', 'SUBSCRIPTION', 'BOOST'
);

CREATE TYPE "AchievementCondition" AS ENUM (
  'TOTAL_LINES_WRITTEN', 'TOTAL_CLICKS', 'TOTAL_PLAYTIME',
  'LEVEL_REACHED', 'PRESTIGE_LEVEL', 'ITEMS_OWNED',
  'PROGRAMS_COMPLETED', 'CRITICAL_HITS'
);

-- ============================================================================
-- TABLES
-- ============================================================================

CREATE TABLE "User" (
  "id"            TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "email"         TEXT NOT NULL,
  "username"      TEXT NOT NULL,
  "password"      TEXT NOT NULL,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastLoginAt"   TIMESTAMP(3),
  "lastActiveAt"  TIMESTAMP(3),
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "User_email_key"    ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE INDEX "User_email_idx"           ON "User"("email");
CREATE INDEX "User_username_idx"        ON "User"("username");

CREATE TABLE "Progression" (
  "id"                   TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "userId"               TEXT NOT NULL,
  "linesOfCode"          DECIMAL(30,0) NOT NULL DEFAULT 0,
  "totalLinesWritten"    DECIMAL(30,0) NOT NULL DEFAULT 0,
  "clickMultiplier"      DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "passiveMultiplier"    DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  "criticalChance"       DOUBLE PRECISION NOT NULL DEFAULT 0.05,
  "criticalMultiplier"   DOUBLE PRECISION NOT NULL DEFAULT 2.0,
  "level"                INTEGER NOT NULL DEFAULT 1,
  "experience"           DECIMAL(20,0) NOT NULL DEFAULT 0,
  "experienceToNext"     DECIMAL(20,0) NOT NULL DEFAULT 100,
  "prestigeLevel"        INTEGER NOT NULL DEFAULT 0,
  "prestigePoints"       DECIMAL(20,0) NOT NULL DEFAULT 0,
  "totalClicks"          BIGINT NOT NULL DEFAULT 0,
  "totalPlaytimeSeconds" BIGINT NOT NULL DEFAULT 0,
  "createdAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Progression_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Progression_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "Progression_userId_key" ON "Progression"("userId");
CREATE INDEX "Progression_userId_idx"        ON "Progression"("userId");
CREATE INDEX "Progression_totalLinesWritten_idx" ON "Progression"("totalLinesWritten");

CREATE TABLE "Item" (
  "id"              TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "slug"            TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "description"     TEXT NOT NULL,
  "category"        "ItemCategory" NOT NULL,
  "baseCost"        DECIMAL(30,0) NOT NULL,
  "baseEffect"      DOUBLE PRECISION NOT NULL,
  "effectType"      "EffectType" NOT NULL,
  "costMultiplier"  DOUBLE PRECISION NOT NULL DEFAULT 1.15,
  "maxQuantity"     INTEGER,
  "unlockLevel"     INTEGER NOT NULL DEFAULT 1,
  "unlockItemSlug"  TEXT,
  "iconUrl"         TEXT,
  "rarity"          "Rarity" NOT NULL DEFAULT 'COMMON',
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Item_slug_key" ON "Item"("slug");
CREATE INDEX "Item_category_idx"    ON "Item"("category");
CREATE INDEX "Item_rarity_idx"      ON "Item"("rarity");

CREATE TABLE "OwnedItem" (
  "id"          TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "userId"      TEXT NOT NULL,
  "itemId"      TEXT NOT NULL,
  "quantity"    INTEGER NOT NULL DEFAULT 1,
  "level"       INTEGER NOT NULL DEFAULT 1,
  "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OwnedItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OwnedItem_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "OwnedItem_itemId_fkey"
    FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "OwnedItem_userId_itemId_key" ON "OwnedItem"("userId","itemId");
CREATE INDEX "OwnedItem_userId_idx" ON "OwnedItem"("userId");
CREATE INDEX "OwnedItem_itemId_idx" ON "OwnedItem"("itemId");

CREATE TABLE "ProgramType" (
  "id"                TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "slug"              TEXT NOT NULL,
  "name"              TEXT NOT NULL,
  "description"       TEXT NOT NULL,
  "baseDurationSecs"  INTEGER NOT NULL,
  "baseReward"        DECIMAL(30,0) NOT NULL,
  "experienceReward"  DECIMAL(20,0) NOT NULL,
  "rewardMultiplier"  DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  "unlockLevel"       INTEGER NOT NULL DEFAULT 1,
  "lootTable"         JSONB,
  "iconUrl"           TEXT,
  "category"          "ProgramCategory" NOT NULL,
  "createdAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"         TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProgramType_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "ProgramType_slug_key"     ON "ProgramType"("slug");
CREATE INDEX "ProgramType_category_idx"        ON "ProgramType"("category");
CREATE INDEX "ProgramType_unlockLevel_idx"     ON "ProgramType"("unlockLevel");

CREATE TABLE "ActiveProgram" (
  "id"              TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "userId"          TEXT NOT NULL,
  "programTypeId"   TEXT NOT NULL,
  "startedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "estimatedEndAt"  TIMESTAMP(3) NOT NULL,
  "completedAt"     TIMESTAMP(3),
  "status"          "ProgramStatus" NOT NULL DEFAULT 'RUNNING',
  "bullJobId"       TEXT,
  "earnedReward"    DECIMAL(30,0),
  "earnedExp"       DECIMAL(20,0),
  "lootItems"       JSONB,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActiveProgram_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ActiveProgram_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "ActiveProgram_programTypeId_fkey"
    FOREIGN KEY ("programTypeId") REFERENCES "ProgramType"("id") ON DELETE CASCADE
);
CREATE INDEX "ActiveProgram_userId_idx"         ON "ActiveProgram"("userId");
CREATE INDEX "ActiveProgram_status_idx"         ON "ActiveProgram"("status");
CREATE INDEX "ActiveProgram_estimatedEndAt_idx" ON "ActiveProgram"("estimatedEndAt");

CREATE TABLE "Transaction" (
  "id"                  TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "userId"              TEXT NOT NULL,
  "stripePaymentId"     TEXT NOT NULL,
  "stripeCustomerId"    TEXT,
  "amountCents"         INTEGER NOT NULL,
  "currency"            TEXT NOT NULL DEFAULT 'eur',
  "status"              "TransactionStatus" NOT NULL DEFAULT 'PENDING',
  "processedAt"         TIMESTAMP(3),
  "idempotencyKey"      TEXT NOT NULL,
  "productType"         "ProductType" NOT NULL,
  "productData"         JSONB NOT NULL,
  "fulfilled"           BOOLEAN NOT NULL DEFAULT FALSE,
  "fulfilledAt"         TIMESTAMP(3),
  "fulfillmentJobId"    TEXT,
  "lastError"           TEXT,
  "retryCount"          INTEGER NOT NULL DEFAULT 0,
  "createdAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"           TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Transaction_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "Transaction_stripePaymentId_key" ON "Transaction"("stripePaymentId");
CREATE UNIQUE INDEX "Transaction_idempotencyKey_key"  ON "Transaction"("idempotencyKey");
CREATE INDEX "Transaction_userId_idx"          ON "Transaction"("userId");
CREATE INDEX "Transaction_stripePaymentId_idx" ON "Transaction"("stripePaymentId");
CREATE INDEX "Transaction_status_idx"          ON "Transaction"("status");
CREATE INDEX "Transaction_idempotencyKey_idx"  ON "Transaction"("idempotencyKey");

CREATE TABLE "Achievement" (
  "id"              TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "slug"            TEXT NOT NULL,
  "name"            TEXT NOT NULL,
  "description"     TEXT NOT NULL,
  "conditionType"   "AchievementCondition" NOT NULL,
  "conditionValue"  DECIMAL(30,0) NOT NULL,
  "rewardLoC"       DECIMAL(30,0),
  "rewardExp"       DECIMAL(20,0),
  "rewardItemSlug"  TEXT,
  "iconUrl"         TEXT,
  "points"          INTEGER NOT NULL DEFAULT 10,
  "hidden"          BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Achievement_slug_key"     ON "Achievement"("slug");
CREATE INDEX "Achievement_conditionType_idx"   ON "Achievement"("conditionType");

CREATE TABLE "UserAchievement" (
  "id"            TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "userId"        TEXT NOT NULL,
  "achievementId" TEXT NOT NULL,
  "unlockedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "claimed"       BOOLEAN NOT NULL DEFAULT FALSE,
  "claimedAt"     TIMESTAMP(3),
  CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserAchievement_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "UserAchievement_achievementId_fkey"
    FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key"
  ON "UserAchievement"("userId","achievementId");
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

CREATE TABLE "OfflineSession" (
  "id"              TEXT NOT NULL DEFAULT uuid_generate_v4()::TEXT,
  "userId"          TEXT NOT NULL,
  "disconnectedAt"  TIMESTAMP(3) NOT NULL,
  "reconnectedAt"   TIMESTAMP(3),
  "earnedLoC"       DECIMAL(30,0),
  "earnedExp"       DECIMAL(20,0),
  "processed"       BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OfflineSession_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "OfflineSession_userId_idx"    ON "OfflineSession"("userId");
CREATE INDEX "OfflineSession_processed_idx" ON "OfflineSession"("processed");

-- ============================================================================
-- Prisma migrations metadata table
-- Required so Prisma doesn't try to re-run migrations on an already-seeded DB
-- ============================================================================

CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id"                    TEXT NOT NULL,
  "checksum"              TEXT NOT NULL,
  "finished_at"           TIMESTAMP(3),
  "migration_name"        TEXT NOT NULL,
  "logs"                  TEXT,
  "rolled_back_at"        TIMESTAMP(3),
  "started_at"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "applied_steps_count"   INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- Mark the initial migration as applied
INSERT INTO "_prisma_migrations" ("id", "checksum", "migration_name", "finished_at", "applied_steps_count")
VALUES (
  uuid_generate_v4()::TEXT,
  'docker-init-seed',
  '00000000000000_docker_init',
  CURRENT_TIMESTAMP,
  1
);

-- ============================================================================
-- SEED DATA: Shop Items
-- ============================================================================

INSERT INTO "Item" ("id", "slug", "name", "description", "category", "baseCost", "baseEffect", "effectType", "costMultiplier", "maxQuantity", "unlockLevel", "rarity") VALUES
-- HARDWARE (Click bonuses)
(uuid_generate_v4()::TEXT, 'rubber-duck',          'Rubber Duck',              'Every dev needs a debugging companion. +1 LoC/click.',                'HARDWARE', 10,       1.0,  'CLICK_BONUS',      1.15, NULL, 1,  'COMMON'),
(uuid_generate_v4()::TEXT, 'mechanical-keyboard',  'Mechanical Keyboard',      'Cherry MX Blues. Annoying but productive. +5 LoC/click.',             'HARDWARE', 100,      5.0,  'CLICK_BONUS',      1.15, NULL, 3,  'COMMON'),
(uuid_generate_v4()::TEXT, 'ultrawide-monitor',    'Ultrawide Monitor',        '49-inch curved display. More pixels, more code. +25 LoC/click.',     'HARDWARE', 1000,     25.0, 'CLICK_BONUS',      1.15, NULL, 8,  'UNCOMMON'),
(uuid_generate_v4()::TEXT, 'standing-desk',        'Standing Desk',            'Motorized sit-stand desk. Better posture = better code. +100 LoC/click.', 'HARDWARE', 10000, 100.0,'CLICK_BONUS',      1.15, NULL, 15, 'RARE'),
(uuid_generate_v4()::TEXT, 'quantum-processor',    'Quantum Processor',        'Experimental quantum chip. Compiles in superposition. +500 LoC/click.', 'HARDWARE', 100000, 500.0,'CLICK_BONUS',      1.18, NULL, 30, 'EPIC'),

-- SOFTWARE (Click multipliers)
(uuid_generate_v4()::TEXT, 'vim-config',           'Custom Vim Config',        'Years of tweaking .vimrc finally pay off. x1.1 click multiplier.',    'SOFTWARE', 500,      0.1,  'CLICK_MULTIPLIER', 1.20, 10,  5,  'UNCOMMON'),
(uuid_generate_v4()::TEXT, 'copilot-ai',           'AI Copilot',               'Your AI pair programmer. x1.25 click multiplier.',                   'SOFTWARE', 5000,     0.25, 'CLICK_MULTIPLIER', 1.25, 5,   12, 'RARE'),
(uuid_generate_v4()::TEXT, 'custom-ide',           'Custom IDE',               'Built your own IDE from scratch. x1.5 click multiplier.',             'SOFTWARE', 50000,    0.5,  'CLICK_MULTIPLIER', 1.30, 3,   20, 'EPIC'),

-- TEAM MEMBERS (Passive generation)
(uuid_generate_v4()::TEXT, 'intern',               'Junior Intern',            'Fresh out of bootcamp. Generates 1 LoC/sec passively.',              'TEAM_MEMBER', 200,    1.0,  'PASSIVE_BONUS',    1.15, NULL, 2,  'COMMON'),
(uuid_generate_v4()::TEXT, 'junior-dev',           'Junior Developer',         'Knows React. Generates 5 LoC/sec passively.',                       'TEAM_MEMBER', 2000,   5.0,  'PASSIVE_BONUS',    1.15, NULL, 7,  'UNCOMMON'),
(uuid_generate_v4()::TEXT, 'senior-dev',           'Senior Developer',         '10 years experience. Generates 25 LoC/sec passively.',               'TEAM_MEMBER', 20000,  25.0, 'PASSIVE_BONUS',    1.15, NULL, 14, 'RARE'),
(uuid_generate_v4()::TEXT, 'tech-lead',            'Tech Lead',                'Designs the architecture. Generates 100 LoC/sec passively.',         'TEAM_MEMBER', 200000, 100.0,'PASSIVE_BONUS',    1.18, NULL, 22, 'EPIC'),
(uuid_generate_v4()::TEXT, 'cto',                  'CTO',                      'The mythical 10x engineer. Generates 500 LoC/sec passively.',        'TEAM_MEMBER', 2000000,500.0,'PASSIVE_BONUS',    1.20, 1,   35, 'LEGENDARY'),

-- COFFEE (Temporary boosts via crit)
(uuid_generate_v4()::TEXT, 'espresso',             'Espresso Shot',            'Quick caffeine hit. +2% critical chance.',                           'COFFEE', 300,       0.02, 'CRIT_CHANCE',      1.20, 20,  4,  'COMMON'),
(uuid_generate_v4()::TEXT, 'cold-brew',            'Cold Brew Concentrate',    'Slow-drip perfection. +5% critical chance.',                        'COFFEE', 3000,      0.05, 'CRIT_CHANCE',      1.25, 10,  10, 'UNCOMMON'),
(uuid_generate_v4()::TEXT, 'energy-drink',         'Energy Drink IV Drip',     'Maximum caffeine delivery. x1.5 critical multiplier.',               'COFFEE', 8000,      0.5,  'CRIT_MULTIPLIER',  1.20, 5,   16, 'RARE'),

-- INFRASTRUCTURE (Passive multipliers)
(uuid_generate_v4()::TEXT, 'cloud-vps',            'Cloud VPS',                'A small server in the cloud. x1.1 passive multiplier.',              'INFRASTRUCTURE', 5000,   0.1,  'PASSIVE_MULTIPLIER', 1.20, NULL, 6,  'UNCOMMON'),
(uuid_generate_v4()::TEXT, 'kubernetes-cluster',   'Kubernetes Cluster',       'Container orchestration at scale. x1.3 passive multiplier.',         'INFRASTRUCTURE', 50000,  0.3,  'PASSIVE_MULTIPLIER', 1.25, 5,   18, 'RARE'),
(uuid_generate_v4()::TEXT, 'data-center',          'Private Data Center',      'Your own rack. x1.5 passive multiplier.',                           'INFRASTRUCTURE', 500000, 0.5,  'PASSIVE_MULTIPLIER', 1.30, 3,   28, 'EPIC'),
(uuid_generate_v4()::TEXT, 'quantum-mainframe',    'Quantum Mainframe',        'The ultimate compute. x2.0 passive multiplier.',                    'INFRASTRUCTURE', 5000000,1.0,  'PASSIVE_MULTIPLIER', 1.35, 1,   40, 'LEGENDARY');

-- ============================================================================
-- SEED DATA: Program Types (Expeditions)
-- ============================================================================

INSERT INTO "ProgramType" ("id", "slug", "name", "description", "baseDurationSecs", "baseReward", "experienceReward", "rewardMultiplier", "unlockLevel", "category", "lootTable") VALUES
-- BUG_FIX: Quick, low reward
(uuid_generate_v4()::TEXT, 'fix-typo',              'Fix a Typo',             'A missing semicolon. Classic.',                           30,    50,    10,  1.0, 1,  'BUG_FIX',     NULL),
(uuid_generate_v4()::TEXT, 'fix-null-pointer',      'Fix Null Pointer',       'The dreaded NullPointerException strikes again.',         120,   200,   40,  1.0, 5,  'BUG_FIX',     NULL),
(uuid_generate_v4()::TEXT, 'fix-race-condition',    'Fix Race Condition',     'Two threads walk into a bar...',                          600,   1000,  150, 1.0, 15, 'BUG_FIX',     NULL),

-- FEATURE: Medium duration
(uuid_generate_v4()::TEXT, 'add-login-page',        'Build Login Page',       'Username, password, forgot password. The classics.',      300,   500,   80,  1.0, 3,  'FEATURE',     NULL),
(uuid_generate_v4()::TEXT, 'add-rest-api',          'Implement REST API',     'CRUD endpoints with validation and auth.',                900,   2000,  300, 1.0, 10, 'FEATURE',     NULL),
(uuid_generate_v4()::TEXT, 'add-real-time-chat',    'Build Real-Time Chat',   'WebSocket-powered chat with rooms and typing indicators.',1800,  5000,  600, 1.0, 20, 'FEATURE',     '[{"itemSlug":"vim-config","dropRate":0.1,"quantity":1}]'),

-- REFACTORING: Experience-focused
(uuid_generate_v4()::TEXT, 'refactor-spaghetti',    'Refactor Spaghetti Code','Untangle the mess. No one remembers who wrote it.',       600,   300,   500, 1.0, 8,  'REFACTORING', NULL),
(uuid_generate_v4()::TEXT, 'migrate-to-typescript', 'Migrate to TypeScript',  'Add types everywhere. Find bugs you never knew existed.', 1800,  1000,  1500,1.0, 18, 'REFACTORING', NULL),

-- ARCHITECTURE: Long duration, high reward
(uuid_generate_v4()::TEXT, 'design-microservices',  'Design Microservices',   'Split the monolith into 12 perfectly-sized services.',    3600,  10000, 2000,1.0, 25, 'ARCHITECTURE','[{"itemSlug":"kubernetes-cluster","dropRate":0.05,"quantity":1}]'),
(uuid_generate_v4()::TEXT, 'build-ci-cd-pipeline',  'Build CI/CD Pipeline',   'Automated testing, linting, and deployment.',             2400,  8000,  1800,1.0, 22, 'ARCHITECTURE', NULL),

-- DEPLOYMENT: Variable
(uuid_generate_v4()::TEXT, 'deploy-to-prod',        'Deploy to Production',   'YOLO deploy on a Friday evening.',                        300,   1500,  200, 1.0, 6,  'DEPLOYMENT',  NULL),
(uuid_generate_v4()::TEXT, 'setup-kubernetes',       'Setup Kubernetes',       'Helm charts, ingress controllers, service mesh.',         3600,  12000, 2500,1.0, 28, 'DEPLOYMENT',  '[{"itemSlug":"cloud-vps","dropRate":0.15,"quantity":1}]'),

-- RESEARCH: Very long, unlocks items
(uuid_generate_v4()::TEXT, 'study-rust',            'Study Rust',             'Ownership, borrowing, lifetimes. Worth it.',              7200,  5000,  5000,1.0, 30, 'RESEARCH',    '[{"itemSlug":"custom-ide","dropRate":0.08,"quantity":1}]'),
(uuid_generate_v4()::TEXT, 'learn-quantum-computing','Learn Quantum Computing','Qubits, superposition, entanglement. The future.',       14400, 20000, 10000,1.0,40, 'RESEARCH',    '[{"itemSlug":"quantum-processor","dropRate":0.03,"quantity":1}]');

-- ============================================================================
-- SEED DATA: Achievements
-- ============================================================================

INSERT INTO "Achievement" ("id", "slug", "name", "description", "conditionType", "conditionValue", "rewardLoC", "rewardExp", "points", "hidden") VALUES
-- Lines of Code milestones
(uuid_generate_v4()::TEXT, 'hello-world',           'Hello, World!',           'Write your first 100 lines of code.',         'TOTAL_LINES_WRITTEN', 100,        50,    25,   5,  FALSE),
(uuid_generate_v4()::TEXT, 'script-kiddie',          'Script Kiddie',           'Write 1,000 lines of code.',                  'TOTAL_LINES_WRITTEN', 1000,       500,   100,  10, FALSE),
(uuid_generate_v4()::TEXT, 'junior-coder',           'Junior Coder',            'Write 10,000 lines of code.',                 'TOTAL_LINES_WRITTEN', 10000,      5000,  500,  20, FALSE),
(uuid_generate_v4()::TEXT, 'code-monkey',            'Code Monkey',             'Write 100,000 lines of code.',                'TOTAL_LINES_WRITTEN', 100000,     50000, 2000, 30, FALSE),
(uuid_generate_v4()::TEXT, 'senior-engineer',        'Senior Engineer',         'Write 1,000,000 lines of code.',              'TOTAL_LINES_WRITTEN', 1000000,    500000,10000,50, FALSE),
(uuid_generate_v4()::TEXT, 'code-legend',            'Code Legend',             'Write 100,000,000 lines of code.',            'TOTAL_LINES_WRITTEN', 100000000,  NULL,  50000,100,FALSE),

-- Click milestones
(uuid_generate_v4()::TEXT, 'first-click',            'First Click',             'Click for the first time.',                   'TOTAL_CLICKS', 1,          10,    5,    5,  FALSE),
(uuid_generate_v4()::TEXT, 'click-enthusiast',       'Click Enthusiast',        'Click 1,000 times.',                          'TOTAL_CLICKS', 1000,       1000,  200,  10, FALSE),
(uuid_generate_v4()::TEXT, 'carpal-tunnel',          'Carpal Tunnel Syndrome',  'Click 100,000 times. Please stretch.',        'TOTAL_CLICKS', 100000,     50000, 5000, 30, FALSE),
(uuid_generate_v4()::TEXT, 'click-god',              'Click God',               'Click 1,000,000 times.',                      'TOTAL_CLICKS', 1000000,    500000,20000,50, TRUE),

-- Level milestones
(uuid_generate_v4()::TEXT, 'level-10',               'Getting Started',         'Reach level 10.',                             'LEVEL_REACHED', 10,         500,   100,  10, FALSE),
(uuid_generate_v4()::TEXT, 'level-25',               'Mid-Career',              'Reach level 25.',                             'LEVEL_REACHED', 25,         5000,  1000, 25, FALSE),
(uuid_generate_v4()::TEXT, 'level-50',               'Veteran',                 'Reach level 50.',                             'LEVEL_REACHED', 50,         50000, 5000, 50, FALSE),
(uuid_generate_v4()::TEXT, 'level-100',              'Master Developer',        'Reach level 100.',                            'LEVEL_REACHED', 100,        500000,25000,100,TRUE),

-- Playtime milestones
(uuid_generate_v4()::TEXT, 'one-hour',               'First Hour',              'Play for 1 hour total.',                      'TOTAL_PLAYTIME', 3600,       200,   50,   5,  FALSE),
(uuid_generate_v4()::TEXT, 'eight-hours',            'Full Work Day',           'Play for 8 hours total.',                     'TOTAL_PLAYTIME', 28800,      2000,  500,  15, FALSE),
(uuid_generate_v4()::TEXT, 'one-hundred-hours',      'Dedicated Developer',     'Play for 100 hours total.',                   'TOTAL_PLAYTIME', 360000,     50000, 5000, 40, FALSE),

-- Programs completed
(uuid_generate_v4()::TEXT, 'first-program',          'First Deployment',        'Complete your first program.',                'PROGRAMS_COMPLETED', 1,       100,   30,   5,  FALSE),
(uuid_generate_v4()::TEXT, 'ten-programs',           'Productive Week',         'Complete 10 programs.',                       'PROGRAMS_COMPLETED', 10,      2000,  500,  15, FALSE),
(uuid_generate_v4()::TEXT, 'hundred-programs',       'Sprint Champion',         'Complete 100 programs.',                      'PROGRAMS_COMPLETED', 100,     20000, 3000, 30, FALSE),

-- Items owned
(uuid_generate_v4()::TEXT, 'first-purchase',         'Shopaholic',              'Buy your first item.',                        'ITEMS_OWNED', 1,            100,   20,   5,  FALSE),
(uuid_generate_v4()::TEXT, 'collector',              'Item Collector',          'Own 50 items total.',                         'ITEMS_OWNED', 50,           10000, 2000, 25, FALSE),

-- Prestige
(uuid_generate_v4()::TEXT, 'first-prestige',         'Prestige I',              'Prestige for the first time.',                'PRESTIGE_LEVEL', 1,         0,     0,    50, FALSE),
(uuid_generate_v4()::TEXT, 'prestige-five',          'Prestige V',              'Reach prestige level 5.',                     'PRESTIGE_LEVEL', 5,         0,     0,    100,TRUE);

-- ============================================================================
-- VERIFICATION: Print seed summary
-- ============================================================================

DO $$
DECLARE
  item_count     INTEGER;
  program_count  INTEGER;
  achieve_count  INTEGER;
BEGIN
  SELECT COUNT(*) INTO item_count    FROM "Item";
  SELECT COUNT(*) INTO program_count FROM "ProgramType";
  SELECT COUNT(*) INTO achieve_count FROM "Achievement";

  RAISE NOTICE '========================================';
  RAISE NOTICE 'Timeless-Heroes DB Seed Complete!';
  RAISE NOTICE '  Items:        %', item_count;
  RAISE NOTICE '  Programs:     %', program_count;
  RAISE NOTICE '  Achievements: %', achieve_count;
  RAISE NOTICE '========================================';
END $$;
