/**
 * Progression Controller
 * REST API endpoints + Redis @MessagePattern handlers for user progression
 */

import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Post,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  IApiResponse,
  IClickResult,
  IItemPurchaseRequest,
  IItemPurchaseResult,
  IKeyPressPayload,
  IProgressionData,
  LeaderboardType,
  ProgressionCommand,
} from '@repo/shared-types';

import { ItemCostCalculatorService } from '../services/item-cost-calculator.service';
import { LeaderboardSyncService } from '../services/leaderboard-sync.service';
import { ProgressionService } from '../services/progression.service';

@Controller('progression')
export class ProgressionController {
  private readonly logger = new Logger(ProgressionController.name);

  constructor(
    private readonly progressionService: ProgressionService,
    private readonly costCalculator: ItemCostCalculatorService,
    private readonly leaderboardSync: LeaderboardSyncService,
  ) {}

  // ========================================================================
  // REDIS @MessagePattern HANDLERS (called via ClientProxy from API Gateway)
  // ========================================================================

  @MessagePattern(ProgressionCommand.GET_PROGRESSION)
  handleGetProgression(@Payload() data: { userId: string }): IProgressionData {
    this.logger.debug(`[MQ] getProgression userId=${data.userId}`);
    return this.progressionService.getProgression(data.userId);
  }

  @MessagePattern(ProgressionCommand.GET_DEFAULT_PROGRESSION)
  handleGetDefaultProgression(
    @Payload() data: { userId: string },
  ): IProgressionData {
    this.logger.debug(`[MQ] getDefaultProgression userId=${data.userId}`);
    return this.progressionService.getProgression(data.userId);
  }

  @MessagePattern(ProgressionCommand.PROCESS_CLICK)
  handleProcessClick(
    @Payload()
    data: {
      payload: IKeyPressPayload;
      progression: IProgressionData;
    },
  ): IClickResult {
    this.logger.debug(`[MQ] processClick userId=${data.payload.userId}`);
    return this.progressionService.processClick(data.payload, data.progression);
  }

  @MessagePattern(ProgressionCommand.CALCULATE_OFFLINE_REWARDS)
  handleCalculateOfflineRewards(
    @Payload()
    data: {
      userId: string;
      disconnectedAt: number;
      reconnectedAt: number;
      passiveMultiplier: number;
    },
  ) {
    this.logger.debug(`[MQ] calculateOfflineRewards userId=${data.userId}`);
    return this.progressionService.calculateOfflineRewards(data);
  }

  @MessagePattern(ProgressionCommand.UPDATE_BALANCE)
  async handleUpdateBalance(
    @Payload() data: { userId: string; delta: string },
  ): Promise<IProgressionData> {
    this.logger.debug(
      `[MQ] updateBalance userId=${data.userId} delta=${data.delta}`,
    );
    return this.progressionService.updateBalance(data.userId, data.delta);
  }

  @MessagePattern(ProgressionCommand.ADD_EXPERIENCE)
  handleAddExperience(@Payload() data: { userId: string; expToAdd: string }): {
    newLevel: number;
    leveledUp: boolean;
  } {
    this.logger.debug(`[MQ] addExperience userId=${data.userId}`);
    return this.progressionService.addExperience(data.userId, data.expToAdd);
  }

  @MessagePattern(ProgressionCommand.PURCHASE_ITEM)
  handlePurchaseItem(
    @Payload() data: IItemPurchaseRequest,
  ): IItemPurchaseResult {
    this.logger.debug(
      `[MQ] purchaseItem userId=${data.userId} item=${data.itemSlug}`,
    );
    return this.progressionService.purchaseItem(data);
  }

  @MessagePattern(ProgressionCommand.ADD_ITEM)
  handleAddItem(
    @Payload() data: { userId: string; itemSlug: string; quantity: number },
  ): boolean {
    this.logger.debug(
      `[MQ] addItem userId=${data.userId} item=${data.itemSlug}`,
    );
    return this.progressionService.addItem(
      data.userId,
      data.itemSlug,
      data.quantity,
    );
  }

  @MessagePattern(ProgressionCommand.GET_AVAILABLE_ITEMS)
  handleGetAvailableItems(@Payload() data: { userId: string }) {
    this.logger.debug(`[MQ] getAvailableItems userId=${data.userId}`);
    return this.progressionService.getAvailableItems(data.userId);
  }

  @MessagePattern(ProgressionCommand.GET_LEADERBOARD)
  async handleGetLeaderboardMQ(@Payload() data: { type: string }) {
    this.logger.debug(`[MQ] getLeaderboard type=${data.type}`);
    const leaderboardType = data.type.toUpperCase() as LeaderboardType;
    return this.leaderboardSync.getLeaderboard(leaderboardType);
  }

  @MessagePattern(ProgressionCommand.GET_USER_RANKS)
  async handleGetUserRanksMQ(@Payload() data: { userId: string }) {
    this.logger.debug(`[MQ] getUserRanks userId=${data.userId}`);
    return this.leaderboardSync.getUserRanks(data.userId);
  }

  // ========================================================================
  // HTTP ENDPOINTS (kept for backward compatibility / direct HTTP access)
  // ========================================================================

  /**
   * Get user progression
   * GET /progression/:userId
   */
  @Get(':userId')
  getProgression(
    @Param('userId') userId: string,
  ): IApiResponse<IProgressionData> {
    const data = this.progressionService.getProgression(userId);

    return {
      data,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Purchase an item
   * POST /progression/purchase
   */
  @Post('purchase')
  @HttpCode(HttpStatus.OK)
  purchaseItem(
    @Body() request: IItemPurchaseRequest,
  ): IApiResponse<IItemPurchaseResult> {
    const result = this.progressionService.purchaseItem(request);

    return {
      data: result,
      error: result.error
        ? {
            code: result.error,
            message: `Purchase failed: ${result.error}`,
          }
        : undefined,
      success: result.success,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get available items for a user
   * GET /progression/:userId/items
   */
  @Get(':userId/items')
  getAvailableItems(@Param('userId') userId: string): {
    success: boolean;
    data: {
      item: {
        slug: string;
        name: string;
        baseCost: string;
        costMultiplier: number;
        baseEffect: number;
        effectType: string;
        unlockLevel: number;
      };
      owned: number;
      nextCost: string;
      canAfford: boolean;
    }[];
    timestamp: string;
  } {
    const items = this.progressionService.getAvailableItems(userId);

    return {
      data: items.map((i) => ({
        canAfford: i.canAfford,
        item: {
          baseCost: i.item.baseCost,
          baseEffect: i.item.baseEffect,
          costMultiplier: i.item.costMultiplier,
          effectType: i.item.effectType,
          name: i.item.name,
          slug: i.item.slug,
          unlockLevel: i.item.unlockLevel,
        },
        nextCost: i.nextCost,
        owned: i.owned,
      })),
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Calculate item cost
   * POST /progression/calculate-cost
   */
  @Post('calculate-cost')
  @HttpCode(HttpStatus.OK)
  calculateCost(
    @Body()
    body: {
      baseCost: string;
      amountOwned: number;
      quantity?: number;
      multiplier?: number;
    },
  ) {
    const { amountOwned, baseCost, multiplier, quantity = 1 } = body;

    if (quantity === 1) {
      const cost = this.costCalculator.calculateNextCost(
        baseCost,
        amountOwned,
        multiplier,
      );
      return { cost, quantity: 1 };
    }

    const cost = this.costCalculator.calculateBulkCost(
      baseCost,
      amountOwned,
      quantity,
      multiplier,
    );

    return { cost, quantity };
  }

  /**
   * Get leaderboard
   * GET /progression/leaderboard/:type
   */
  @Get('leaderboard/:type')
  async getLeaderboard(@Param('type') type: string) {
    const leaderboardType = type.toUpperCase() as LeaderboardType;
    const entries = await this.leaderboardSync.getLeaderboard(leaderboardType);

    return {
      data: {
        entries,
        type: leaderboardType,
      },
      success: true,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get user's ranks across leaderboards
   * GET /progression/:userId/ranks
   */
  @Get(':userId/ranks')
  async getUserRanks(@Param('userId') userId: string) {
    const ranks = await this.leaderboardSync.getUserRanks(userId);

    return {
      data: ranks,
      success: true,
      timestamp: new Date().toISOString(),
    };
  }
}
