/**
 * Progression Controller
 * NATS @MessagePattern handlers for inter-service communication
 * Called by api-gateway via ClientProxy (transport-agnostic)
 */

import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
    IApiResponse,
    IItemPurchaseRequest,
    IItemPurchaseResult,
    IProgressionData,
    LeaderboardType,
    NatsPattern,
} from '@repo/shared-types';
import { ItemCostCalculatorService } from '../services/item-cost-calculator.service';
import { LeaderboardSyncService } from '../services/leaderboard-sync.service';
import { ProgressionService } from '../services/progression.service';

@Controller()
export class ProgressionController {
  private readonly logger = new Logger(ProgressionController.name);
  
  constructor(
    private readonly progressionService: ProgressionService,
    private readonly costCalculator: ItemCostCalculatorService,
    private readonly leaderboardSync: LeaderboardSyncService,
  ) {}

  // ── HTTP: Health check ────────────────────────────────────────────

  @Get('health')
  health() {
    return { status: 'ok', service: 'svc-user-progression', timestamp: new Date().toISOString() };
  }

  // ── NATS: Health check ────────────────────────────────────────────

  @MessagePattern(NatsPattern.HEALTH_CHECK)
  handleHealthCheck() {
    return { status: 'ok', service: 'svc-user-progression' };
  }

  // ── NATS: Get user progression ────────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_GET)
  async getProgression(
    @Payload() data: { userId: string },
  ): Promise<IApiResponse<IProgressionData>> {
    this.logger.debug(`NATS ${NatsPattern.PROGRESSION_GET}: ${data.userId}`);
    const result = await this.progressionService.getProgression(data.userId);
    
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  // ── NATS: Update balance ──────────────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_UPDATE_BALANCE)
  async updateBalance(
    @Payload() data: { userId: string; delta: string },
  ): Promise<IApiResponse<IProgressionData>> {
    this.logger.debug(`NATS ${NatsPattern.PROGRESSION_UPDATE_BALANCE}: ${data.userId} delta=${data.delta}`);
    const result = await this.progressionService.updateBalance(data.userId, data.delta);

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  }

  // ── NATS: Add experience ──────────────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_ADD_EXPERIENCE)
  async addExperience(
    @Payload() data: { userId: string; experience: string },
  ): Promise<{ newLevel: number; leveledUp: boolean }> {
    this.logger.debug(`NATS ${NatsPattern.PROGRESSION_ADD_EXPERIENCE}: ${data.userId}`);
    return this.progressionService.addExperience(data.userId, data.experience);
  }

  // ── NATS: Purchase item ───────────────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_PURCHASE_ITEM)
  async purchaseItem(
    @Payload() request: IItemPurchaseRequest,
  ): Promise<IApiResponse<IItemPurchaseResult>> {
    this.logger.debug(`NATS ${NatsPattern.PROGRESSION_PURCHASE_ITEM}: ${request.userId} → ${request.itemSlug}`);
    const result = await this.progressionService.purchaseItem(request);
    
    return {
      success: result.success,
      data: result,
      error: result.error ? {
        code: result.error,
        message: `Purchase failed: ${result.error}`,
      } : undefined,
      timestamp: new Date().toISOString(),
    };
  }

  // ── NATS: Add item to inventory ───────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_ADD_ITEM)
  async addItem(
    @Payload() data: { userId: string; itemSlug: string; quantity: number },
  ): Promise<boolean> {
    this.logger.debug(`NATS ${NatsPattern.PROGRESSION_ADD_ITEM}: ${data.userId} +${data.quantity}x ${data.itemSlug}`);
    return this.progressionService.addItem(data.userId, data.itemSlug, data.quantity);
  }

  // ── NATS: Get available items ─────────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_GET_ITEMS)
  async getAvailableItems(
    @Payload() data: { userId: string },
  ) {
    const items = await this.progressionService.getAvailableItems(data.userId);
    
    return {
      success: true,
      data: items.map(i => ({
        item: {
          slug: i.item.slug,
          name: i.item.name,
          baseCost: i.item.baseCost,
          costMultiplier: i.item.costMultiplier,
          baseEffect: i.item.baseEffect,
          effectType: i.item.effectType,
          unlockLevel: i.item.unlockLevel,
        },
        owned: i.owned,
        nextCost: i.nextCost,
        canAfford: i.canAfford,
      })),
      timestamp: new Date().toISOString(),
    };
  }
  
  // ── NATS: Calculate cost ──────────────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_CALCULATE_COST)
  calculateCost(
    @Payload() body: {
      baseCost: string;
      amountOwned: number;
      quantity?: number;
      multiplier?: number;
    },
  ) {
    const { baseCost, amountOwned, quantity = 1, multiplier } = body;
    
    if (quantity === 1) {
      const cost = this.costCalculator.calculateNextCost(baseCost, amountOwned, multiplier);
      return { cost, quantity: 1 };
    }
    
    const cost = this.costCalculator.calculateBulkCost(baseCost, amountOwned, quantity, multiplier);
    return { cost, quantity };
  }
  
  // ── NATS: Get leaderboard ─────────────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_GET_LEADERBOARD)
  async getLeaderboard(
    @Payload() data: { type: string },
  ) {
    const leaderboardType = (data.type.toUpperCase() as LeaderboardType) || LeaderboardType.GLOBAL;
    const entries = await this.leaderboardSync.getLeaderboard(leaderboardType);
    
    return {
      success: true,
      data: { type: leaderboardType, entries },
      timestamp: new Date().toISOString(),
    };
  }
  
  // ── NATS: Get user ranks ──────────────────────────────────────────

  @MessagePattern(NatsPattern.PROGRESSION_GET_RANKS)
  async getUserRanks(
    @Payload() data: { userId: string },
  ) {
    const ranks = await this.leaderboardSync.getUserRanks(data.userId);
    
    return {
      success: true,
      data: ranks,
      timestamp: new Date().toISOString(),
    };
  }
}
