/**
 * Game WebSocket Gateway
 * Main real-time communication hub for the game
 *
 * Handles:
 * - KEY_PRESS events (clicks)
 * - Balance updates
 * - Item purchases (via svc-user-progression)
 * - Shop item listing (via svc-user-progression)
 * - Leaderboard updates
 * - Offline rewards
 *
 * Business logic is delegated to microservices via ClientProxy (Redis transport).
 * Anti-cheat validation and Redis caching stay here (cross-cutting concerns).
 */

import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { LeaderboardService, RedisKeys } from '@repo/redis-client';
import {
  IClickResult,
  IItemPurchaseRequest,
  IItemPurchaseResult,
  IKeyPressPayload,
  ILeaderboardUpdate,
  IProgressionData,
  LeaderboardType,
  ProgressionCommand,
  ServiceToken,
  WebSocketEvent,
} from '@repo/shared-types';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { ClickProcessorService } from '../click-processor/click-processor.service';
import { ClickValidatorService } from '../click-processor/click-validator.service';

interface IAuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

@WebSocketGateway({
  cors: {
    credentials: true,
    origin: '*',
  },
  namespace: '/game',
  transports: ['websocket', 'polling'],
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(
    private readonly clickProcessor: ClickProcessorService,
    private readonly clickValidator: ClickValidatorService,
    private readonly leaderboardService: LeaderboardService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject(ServiceToken.PROGRESSION)
    private readonly progressionClient: ClientProxy,
    @Inject(ServiceToken.PAYMENT)
    private readonly paymentClient: ClientProxy,
  ) {}

  afterInit() {
    this.logger.log('Game WebSocket Gateway initialized');
  }

  /**
   * Handle new client connection
   */
  async handleConnection(client: IAuthenticatedSocket) {
    try {
      // Extract and verify JWT from handshake
      const token =
        (client.handshake.auth as { token?: string }).token ??
        client.handshake.headers.authorization;

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without auth token`);
        return;
      }

      // eslint-disable-next-line sonarjs/todo-tag
      // TODO: Verify JWT and extract user info (M5)
      const userId =
        (client.handshake.auth as { userId?: string }).userId ?? 'anonymous';
      const username =
        (client.handshake.auth as { username?: string }).username ?? 'Player';

      client.userId = userId;
      client.username = username;

      // Track connected user in Redis
      await this.redis.hset(RedisKeys.WS_CONNECTED_USERS, userId, client.id);

      // Join user-specific room for targeted messages
      await client.join(`user:${userId}`);

      // Track session in Redis
      await this.redis.set(
        RedisKeys.USER_SESSION(userId),
        JSON.stringify({
          connectedAt: Date.now(),
          socketId: client.id,
        }),
      );

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);

      // Send initial data to client
      await this.sendInitialData(client);

      // Calculate and send offline rewards if applicable
      await this.calculateOfflineRewards(client);
    } catch (error) {
      this.logger.error(
        `Connection error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  /**
   * Handle client disconnection
   */
  async handleDisconnect(client: IAuthenticatedSocket) {
    const userId = client.userId;

    if (userId) {
      // Remove from connected users in Redis
      await this.redis.hdel(RedisKeys.WS_CONNECTED_USERS, userId);

      // Record disconnect time for offline calculation
      await this.redis.set(
        `offline:disconnect:${userId}`,
        Date.now().toString(),
        'EX',
        86_400 * 7, // Keep for 7 days
      );

      // Remove session
      await this.redis.del(RedisKeys.USER_SESSION(userId));
    }

    this.logger.log(
      `Client disconnected: ${client.id} (User: ${userId ?? 'unknown'})`,
    );
  }

  /**
   * Handle KEY_PRESS event (main click handler)
   * Anti-cheat validation stays in gateway; click processing delegated to microservice.
   */
  @SubscribeMessage(WebSocketEvent.KEY_PRESS)
  async handleKeyPress(
    @ConnectedSocket() client: IAuthenticatedSocket,
    @MessageBody() payload: Partial<IKeyPressPayload>,
  ): Promise<IClickResult | { error: string }> {
    const userId = client.userId;

    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const fullPayload: IKeyPressPayload = {
      keyType: payload.keyType,
      timestamp: payload.timestamp ?? Date.now(),
      userId,
    };

    // 1. Validate click (anti-cheat — stays in gateway)
    const validation = await this.clickValidator.validateClick(fullPayload);

    if (!validation.isValid) {
      this.logger.warn(`Click rejected for ${userId}: ${validation.reason}`);

      client.emit(WebSocketEvent.ERROR, {
        code: validation.reason,
        detectedCPS: validation.detectedCPS,
        maxCPS: validation.maxAllowedCPS,
        message: `Click rejected: ${validation.reason}`,
      });

      return { error: validation.reason ?? 'Click rejected' };
    }

    // 2. Get user progression (from Redis cache or via microservice)
    let progression = await this.clickProcessor.getProgressionCached(userId);

    if (!progression) {
      // Fetch from progression microservice
      progression = await firstValueFrom(
        this.progressionClient.send<IProgressionData>(
          ProgressionCommand.GET_PROGRESSION,
          { userId },
        ),
      );
      await this.clickProcessor.cacheProgression(progression);
    }

    // 3. Delegate click processing to microservice
    const result = await firstValueFrom(
      this.progressionClient.send<IClickResult>(
        ProgressionCommand.PROCESS_CLICK,
        { payload: fullPayload, progression },
      ),
    );

    // 4. Buffer the click value in Redis (cross-cutting — stays in gateway)
    const bufferResult = await this.clickProcessor.bufferClickValue(
      userId,
      result.finalValue,
    );

    // 5. Estimate new balance from cache + buffer
    const cachedBalance = BigInt(progression.linesOfCode);
    const bufferedAmount = BigInt(
      Math.floor(Number.parseFloat(bufferResult.locToAdd)),
    );
    result.newBalance = (cachedBalance + bufferedAmount).toString();

    // 6. Emit click result
    client.emit(WebSocketEvent.CLICK_PROCESSED, result);

    return result;
  }

  // ========================================================================
  // SHOP & ITEM PURCHASE (delegated to svc-user-progression)
  // ========================================================================

  /**
   * Handle GET_SHOP event — fetch available items for the connected user
   * Delegated to svc-user-progression via ClientProxy
   */
  @SubscribeMessage(WebSocketEvent.GET_SHOP)
  async handleGetShop(
    @ConnectedSocket() client: IAuthenticatedSocket,
  ): Promise<{ error: string } | undefined> {
    const userId = client.userId;

    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const items: unknown = await firstValueFrom(
      this.progressionClient.send(ProgressionCommand.GET_AVAILABLE_ITEMS, {
        userId,
      }),
    );

    client.emit(WebSocketEvent.SHOP_DATA, { items });

    return undefined;
  }

  /**
   * Handle PURCHASE_ITEM event
   * Delegated to svc-user-progression via ClientProxy.
   * After a successful purchase the gateway invalidates the cached progression
   * so the next click uses fresh multipliers.
   */
  @SubscribeMessage(WebSocketEvent.PURCHASE_ITEM)
  async handlePurchaseItem(
    @ConnectedSocket() client: IAuthenticatedSocket,
    @MessageBody() data: { itemSlug: string; quantity?: number },
  ): Promise<IItemPurchaseResult | { error: string }> {
    const userId = client.userId;

    if (!userId) {
      return { error: 'Not authenticated' };
    }

    const request: IItemPurchaseRequest = {
      itemSlug: data.itemSlug,
      quantity: data.quantity ?? 1,
      userId,
    };

    const result = await firstValueFrom(
      this.progressionClient.send<IItemPurchaseResult>(
        ProgressionCommand.PURCHASE_ITEM,
        request,
      ),
    );

    if (result.success) {
      // Invalidate progression cache so next click picks up new multipliers
      await this.clickProcessor.invalidateCache(userId);

      // Emit purchase confirmation to the client
      client.emit(WebSocketEvent.ITEM_PURCHASED, result);

      // Also emit updated balance
      const progression = await firstValueFrom(
        this.progressionClient.send<IProgressionData>(
          ProgressionCommand.GET_PROGRESSION,
          { userId },
        ),
      );

      await this.clickProcessor.cacheProgression(progression);

      client.emit(WebSocketEvent.BALANCE_UPDATE, {
        clickMultiplier: progression.clickMultiplier,
        level: progression.level,
        linesOfCode: progression.linesOfCode,
        passiveMultiplier: progression.passiveMultiplier,
      });
    } else {
      client.emit(WebSocketEvent.ERROR, {
        code: result.error,
        message: `Purchase failed: ${result.error}`,
      });
    }

    return result;
  }

  // ========================================================================
  // LEADERBOARD
  // ========================================================================

  /**
   * Get leaderboard data
   */
  @SubscribeMessage('GET_LEADERBOARD')
  async handleGetLeaderboard(
    @ConnectedSocket() client: IAuthenticatedSocket,
    @MessageBody() data: { type?: LeaderboardType; count?: number },
  ): Promise<ILeaderboardUpdate> {
    const userId = client.userId ?? 'anonymous';
    const leaderboardType = data.type ?? LeaderboardType.GLOBAL;
    const count = Math.min(data.count ?? 100, 100);

    // Get leaderboard key based on type
    let leaderboardKey: string = RedisKeys.LEADERBOARD_GLOBAL;
    switch (leaderboardType) {
      case LeaderboardType.WEEKLY: {
        leaderboardKey = RedisKeys.LEADERBOARD_WEEKLY;
        break;
      }
      case LeaderboardType.DAILY: {
        leaderboardKey = RedisKeys.LEADERBOARD_DAILY;
        break;
      }
    }

    // Get top players and user's rank
    const [topPlayers, userRank, totalPlayers] = await Promise.all([
      this.leaderboardService.getTopPlayers(count, leaderboardKey),
      this.leaderboardService.getUserRank(userId, leaderboardKey),
      this.leaderboardService.getTotalPlayers(leaderboardKey),
    ]);

    // Map to response format
    const entries = topPlayers.map((entry) => ({
      // eslint-disable-next-line sonarjs/todo-tag
      level: 1, // TODO: Fetch from progression
      prestigeLevel: 0,
      rank: entry.rank,
      score: entry.score.toString(),
      userId: entry.userId,
      // eslint-disable-next-line sonarjs/todo-tag
      username: `Player_${entry.userId.slice(0, 8)}`, // TODO: Fetch actual usernames
    }));

    const response: ILeaderboardUpdate = {
      entries,
      totalPlayers,
      type: leaderboardType,
      userRank: userRank ?? undefined,
    };

    client.emit(WebSocketEvent.LEADERBOARD_UPDATE, response);

    return response;
  }

  // ========================================================================
  // PRIVATE HELPERS
  // ========================================================================

  /**
   * Send initial game data to newly connected client
   * Progression data fetched via ClientProxy from svc-user-progression
   */
  private async sendInitialData(client: IAuthenticatedSocket): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    // Get or create progression via microservice
    let progression = await this.clickProcessor.getProgressionCached(userId);

    if (!progression) {
      progression = await firstValueFrom(
        this.progressionClient.send<IProgressionData>(
          ProgressionCommand.GET_PROGRESSION,
          { userId },
        ),
      );
      await this.clickProcessor.cacheProgression(progression);
    }

    // Send current balance
    client.emit(WebSocketEvent.BALANCE_UPDATE, {
      clickMultiplier: progression.clickMultiplier,
      level: progression.level,
      linesOfCode: progression.linesOfCode,
      passiveMultiplier: progression.passiveMultiplier,
    });

    // Get and send leaderboard position
    const userRank = await this.leaderboardService.getUserRank(userId);
    if (userRank) {
      const { entries } = await this.leaderboardService.getPlayersAroundUser(
        userId,
        3,
      );

      client.emit(WebSocketEvent.LEADERBOARD_UPDATE, {
        entries: entries.map((e) => ({
          level: 1,
          prestigeLevel: 0,
          rank: e.rank,
          score: e.score.toString(),
          userId: e.userId,
          username: `Player_${e.userId.slice(0, 8)}`,
        })),
        totalPlayers: await this.leaderboardService.getTotalPlayers(),
        type: LeaderboardType.GLOBAL,
        userRank,
      });
    }
  }

  /**
   * Calculate offline rewards for reconnecting player
   * Delegated to svc-user-progression via ClientProxy
   */
  private async calculateOfflineRewards(
    client: IAuthenticatedSocket,
  ): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    // Get last disconnect time
    const disconnectTime = await this.redis.get(`offline:disconnect:${userId}`);

    if (!disconnectTime) {
      return; // First login or no cached disconnect time
    }

    const disconnectedAt = Number.parseInt(disconnectTime, 10);
    const reconnectedAt = Date.now();
    const offlineDuration = Math.floor((reconnectedAt - disconnectedAt) / 1000);

    // Minimum 1 minute offline for rewards
    if (offlineDuration < 60) {
      return;
    }

    // Get progression for passive rate
    const progression = await this.clickProcessor.getProgressionCached(userId);
    if (!progression) return;

    // Delegate offline reward calculation to microservice
    const rewards = await firstValueFrom(
      this.progressionClient.send<{
        earnedLoc: string;
        earnedExp: string;
        offlineDuration: number;
        effectiveDuration: number;
        maxOfflineTime: number;
        offlineRate: number;
      }>(ProgressionCommand.CALCULATE_OFFLINE_REWARDS, {
        disconnectedAt,
        passiveMultiplier: progression.passiveMultiplier,
        reconnectedAt,
        userId,
      }),
    );

    if (Number.parseInt(rewards.earnedLoc, 10) > 0) {
      client.emit(WebSocketEvent.OFFLINE_REWARDS, {
        completedPrograms: [],
        disconnectedAt: new Date(disconnectedAt),
        earnedExp: rewards.earnedExp,
        earnedLoc: rewards.earnedLoc,
        effectiveDuration: rewards.effectiveDuration,
        maxOfflineTime: rewards.maxOfflineTime,
        offlineDuration: rewards.offlineDuration,
        offlineRate: rewards.offlineRate,
        reconnectedAt: new Date(reconnectedAt),
        userId,
      });
    }

    // Clear the disconnect timestamp
    await this.redis.del(`offline:disconnect:${userId}`);
  }

  /**
   * Broadcast message to specific user
   */
  broadcastToUser(userId: string, event: WebSocketEvent, data: unknown): void {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /**
   * Broadcast message to all connected users
   */
  broadcastToAll(event: WebSocketEvent, data: unknown): void {
    this.server.emit(event, data);
  }

  /**
   * Get count of connected users (from Redis)
   */
  async getConnectedUsersCount(): Promise<number> {
    return this.redis.hlen(RedisKeys.WS_CONNECTED_USERS);
  }
}
