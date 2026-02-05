-- CreateEnum
CREATE TYPE "ItemCategory" AS ENUM ('HARDWARE', 'SOFTWARE', 'COFFEE', 'TEAM_MEMBER', 'INFRASTRUCTURE');

-- CreateEnum
CREATE TYPE "EffectType" AS ENUM ('CLICK_BONUS', 'PASSIVE_BONUS', 'CLICK_MULTIPLIER', 'PASSIVE_MULTIPLIER', 'CRIT_CHANCE', 'CRIT_MULTIPLIER', 'EXPERIENCE_BONUS');

-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC');

-- CreateEnum
CREATE TYPE "ProgramCategory" AS ENUM ('BUG_FIX', 'FEATURE', 'REFACTORING', 'ARCHITECTURE', 'DEPLOYMENT', 'RESEARCH');

-- CreateEnum
CREATE TYPE "ProgramStatus" AS ENUM ('RUNNING', 'COMPLETED', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "ProductType" AS ENUM ('PREMIUM_CURRENCY', 'ITEM_PACK', 'SUBSCRIPTION', 'BOOST');

-- CreateEnum
CREATE TYPE "AchievementCondition" AS ENUM ('TOTAL_LINES_WRITTEN', 'TOTAL_CLICKS', 'TOTAL_PLAYTIME', 'LEVEL_REACHED', 'PRESTIGE_LEVEL', 'ITEMS_OWNED', 'PROGRAMS_COMPLETED', 'CRITICAL_HITS');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "lastActiveAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progression" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linesOfCode" DECIMAL(30,0) NOT NULL DEFAULT 0,
    "totalLinesWritten" DECIMAL(30,0) NOT NULL DEFAULT 0,
    "clickMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "passiveMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "criticalChance" DOUBLE PRECISION NOT NULL DEFAULT 0.05,
    "criticalMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 2.0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" DECIMAL(20,0) NOT NULL DEFAULT 0,
    "experienceToNext" DECIMAL(20,0) NOT NULL DEFAULT 100,
    "prestigeLevel" INTEGER NOT NULL DEFAULT 0,
    "prestigePoints" DECIMAL(20,0) NOT NULL DEFAULT 0,
    "totalClicks" BIGINT NOT NULL DEFAULT 0,
    "totalPlaytimeSeconds" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ItemCategory" NOT NULL,
    "baseCost" DECIMAL(30,0) NOT NULL,
    "baseEffect" DOUBLE PRECISION NOT NULL,
    "effectType" "EffectType" NOT NULL,
    "costMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.15,
    "maxQuantity" INTEGER,
    "unlockLevel" INTEGER NOT NULL DEFAULT 1,
    "unlockItemSlug" TEXT,
    "iconUrl" TEXT,
    "rarity" "Rarity" NOT NULL DEFAULT 'COMMON',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OwnedItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "level" INTEGER NOT NULL DEFAULT 1,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OwnedItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramType" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "baseDurationSecs" INTEGER NOT NULL,
    "baseReward" DECIMAL(30,0) NOT NULL,
    "experienceReward" DECIMAL(20,0) NOT NULL,
    "rewardMultiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "unlockLevel" INTEGER NOT NULL DEFAULT 1,
    "lootTable" JSONB,
    "iconUrl" TEXT,
    "category" "ProgramCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActiveProgram" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "programTypeId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estimatedEndAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "status" "ProgramStatus" NOT NULL DEFAULT 'RUNNING',
    "bullJobId" TEXT,
    "earnedReward" DECIMAL(30,0),
    "earnedExp" DECIMAL(20,0),
    "lootItems" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActiveProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'eur',
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "processedAt" TIMESTAMP(3),
    "idempotencyKey" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "productData" JSONB NOT NULL,
    "fulfilled" BOOLEAN NOT NULL DEFAULT false,
    "fulfilledAt" TIMESTAMP(3),
    "fulfillmentJobId" TEXT,
    "lastError" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "conditionType" "AchievementCondition" NOT NULL,
    "conditionValue" DECIMAL(30,0) NOT NULL,
    "rewardLoC" DECIMAL(30,0),
    "rewardExp" DECIMAL(20,0),
    "rewardItemSlug" TEXT,
    "iconUrl" TEXT,
    "points" INTEGER NOT NULL DEFAULT 10,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimed" BOOLEAN NOT NULL DEFAULT false,
    "claimedAt" TIMESTAMP(3),

    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfflineSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "disconnectedAt" TIMESTAMP(3) NOT NULL,
    "reconnectedAt" TIMESTAMP(3),
    "earnedLoC" DECIMAL(30,0),
    "earnedExp" DECIMAL(20,0),
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfflineSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Progression_userId_key" ON "Progression"("userId");

-- CreateIndex
CREATE INDEX "Progression_userId_idx" ON "Progression"("userId");

-- CreateIndex
CREATE INDEX "Progression_totalLinesWritten_idx" ON "Progression"("totalLinesWritten");

-- CreateIndex
CREATE UNIQUE INDEX "Item_slug_key" ON "Item"("slug");

-- CreateIndex
CREATE INDEX "Item_category_idx" ON "Item"("category");

-- CreateIndex
CREATE INDEX "Item_rarity_idx" ON "Item"("rarity");

-- CreateIndex
CREATE INDEX "OwnedItem_userId_idx" ON "OwnedItem"("userId");

-- CreateIndex
CREATE INDEX "OwnedItem_itemId_idx" ON "OwnedItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "OwnedItem_userId_itemId_key" ON "OwnedItem"("userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramType_slug_key" ON "ProgramType"("slug");

-- CreateIndex
CREATE INDEX "ProgramType_category_idx" ON "ProgramType"("category");

-- CreateIndex
CREATE INDEX "ProgramType_unlockLevel_idx" ON "ProgramType"("unlockLevel");

-- CreateIndex
CREATE INDEX "ActiveProgram_userId_idx" ON "ActiveProgram"("userId");

-- CreateIndex
CREATE INDEX "ActiveProgram_status_idx" ON "ActiveProgram"("status");

-- CreateIndex
CREATE INDEX "ActiveProgram_estimatedEndAt_idx" ON "ActiveProgram"("estimatedEndAt");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_stripePaymentId_key" ON "Transaction"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_idempotencyKey_key" ON "Transaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "Transaction_userId_idx" ON "Transaction"("userId");

-- CreateIndex
CREATE INDEX "Transaction_stripePaymentId_idx" ON "Transaction"("stripePaymentId");

-- CreateIndex
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");

-- CreateIndex
CREATE INDEX "Transaction_idempotencyKey_idx" ON "Transaction"("idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_slug_key" ON "Achievement"("slug");

-- CreateIndex
CREATE INDEX "Achievement_conditionType_idx" ON "Achievement"("conditionType");

-- CreateIndex
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");

-- CreateIndex
CREATE INDEX "OfflineSession_userId_idx" ON "OfflineSession"("userId");

-- CreateIndex
CREATE INDEX "OfflineSession_processed_idx" ON "OfflineSession"("processed");

-- AddForeignKey
ALTER TABLE "Progression" ADD CONSTRAINT "Progression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnedItem" ADD CONSTRAINT "OwnedItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OwnedItem" ADD CONSTRAINT "OwnedItem_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveProgram" ADD CONSTRAINT "ActiveProgram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActiveProgram" ADD CONSTRAINT "ActiveProgram_programTypeId_fkey" FOREIGN KEY ("programTypeId") REFERENCES "ProgramType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
