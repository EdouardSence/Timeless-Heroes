/**
 * Game WebSocket Gateway
 * Main real-time communication hub for the game
 * 
 * Handles:
 * - KEY_PRESS events (clicks)
 * - Balance updates
 * - Item purchases
 * - Program management
 * - Leaderboard updates
 * - Offline rewards
 */

import { Inject, Logger } from '@nestjs/common';
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
import Redis from 'ioredis';
import { Server, Socket } from 'socket.io';

import { LeaderboardService, RedisKeys } from '@repo/redis-client';
import {
  IClickResult,
  IKeyPressPayload,
  ILeaderboardUpdate,
  IProgressionData,
  LeaderboardType,
  WebSocketEvent,
} from '@repo/shared-types';
import { ClickProcessorService } from '../click-processor/click-processor.service';
import { ClickValidatorService } from '../click-processor/click-validator.service';

interface IAuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: '/game',
  transports: ['websocket', 'polling'],
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(GameGateway.name);

  constructor(
    private readonly clickProcessor: ClickProcessorService,
    private readonly clickValidator: ClickValidatorService,
    private readonly leaderboardService: LeaderboardService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) { }

  afterInit() {
    this.logger.log('🎮 Game WebSocket Gateway initialized');
  }

  /**
   * Handle new client connection
   */
  async handleConnection(client: IAuthenticatedSocket) {
    try {
      // Extract and verify JWT from handshake
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization;

      if (!token) {
        this.logger.warn(`Client ${client.id} connected without auth token`);
        // Allow connection but mark as unauthenticated
        // In production, you might want to disconnect
        return;
      }

      // TODO: Verify JWT and extract user info
      // For now, use a mock user ID from the token
      const userId = client.handshake.auth?.userId || 'anonymous';
      const username = client.handshake.auth?.username || 'Player';

      client.userId = userId;
      client.username = username;

      // Track connected user in Redis (replaces in-memory Map)
      await this.redis.hset(
        RedisKeys.WS_CONNECTED_USERS,
        userId,
        client.id,
      );

      // Join user-specific room for targeted messages
      await client.join(`user:${userId}`);

      // Track session in Redis
      await this.redis.set(
        RedisKeys.USER_SESSION(userId),
        JSON.stringify({
          socketId: client.id,
          connectedAt: Date.now(),
        }),
      );

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);

      // Send initial data to client
      await this.sendInitialData(client);

      // Calculate and send offline rewards if applicable
      await this.calculateOfflineRewards(client);

    } catch (error) {
      this.logger.error(`Connection error: ${error}`);
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
        86400 * 7, // Keep for 7 days
      );

      // Remove session
      await this.redis.del(RedisKeys.USER_SESSION(userId));
    }

    this.logger.log(`Client disconnected: ${client.id} (User: ${userId || 'unknown'})`);
  }

  /**
   * Handle KEY_PRESS event (main click handler)
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
      userId,
      timestamp: payload.timestamp || Date.now(),
      keyType: payload.keyType,
    };

    // 1. Validate click (anti-cheat)
    const validation = await this.clickValidator.validateClick(fullPayload);

    if (!validation.isValid) {
      this.logger.warn(
        `Click rejected for ${userId}: ${validation.reason}`,
      );

      client.emit(WebSocketEvent.ERROR, {
        code: validation.reason,
        message: `Click rejected: ${validation.reason}`,
        detectedCPS: validation.detectedCPS,
        maxCPS: validation.maxAllowedCPS,
      });

      return { error: validation.reason || 'Click rejected' };
    }

    // 2. Get user progression (cached)
    let progression = await this.clickProcessor.getProgressionCached(userId);

    if (!progression) {
      // Create default progression for new users
      // In production, this would fetch from the progression service
      progression = this.getDefaultProgression(userId);
      await this.clickProcessor.cacheProgression(progression);
    }

    // 3. Process the click
    const result = await this.clickProcessor.processClick(fullPayload, progression);

    // 4. Emit click result
    client.emit(WebSocketEvent.CLICK_PROCESSED, result);

    // 5. Optionally broadcast balance update (throttled)
    // This is handled by the buffer processor

    return result;
  }

  /**
   * Get leaderboard data
   */
  @SubscribeMessage('GET_LEADERBOARD')
  async handleGetLeaderboard(
    @ConnectedSocket() client: IAuthenticatedSocket,
    @MessageBody() data: { type?: LeaderboardType; count?: number },
  ): Promise<ILeaderboardUpdate> {
    const userId = client.userId || 'anonymous';
    const leaderboardType = data.type || LeaderboardType.GLOBAL;
    const count = Math.min(data.count || 100, 100);

    // Get leaderboard key based on type
    let leaderboardKey: string = RedisKeys.LEADERBOARD_GLOBAL;
    switch (leaderboardType) {
      case LeaderboardType.WEEKLY:
        leaderboardKey = RedisKeys.LEADERBOARD_WEEKLY;
        break;
      case LeaderboardType.DAILY:
        leaderboardKey = RedisKeys.LEADERBOARD_DAILY;
        break;
    }

    // Get top players and user's rank
    const [topPlayers, userRank, totalPlayers] = await Promise.all([
      this.leaderboardService.getTopPlayers(count, leaderboardKey),
      this.leaderboardService.getUserRank(userId, leaderboardKey),
      this.leaderboardService.getTotalPlayers(leaderboardKey),
    ]);

    // Map to response format
    const entries = topPlayers.map((entry) => ({
      rank: entry.rank,
      userId: entry.userId,
      username: `Player_${entry.userId.slice(0, 8)}`, // TODO: Fetch actual usernames
      score: entry.score.toString(),
      level: 1, // TODO: Fetch from progression
      prestigeLevel: 0,
    }));

    const response: ILeaderboardUpdate = {
      type: leaderboardType,
      entries,
      userRank: userRank || undefined,
      totalPlayers,
    };

    client.emit(WebSocketEvent.LEADERBOARD_UPDATE, response);

    return response;
  }

  /**
   * Send initial game data to newly connected client
   */
  private async sendInitialData(client: IAuthenticatedSocket): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    // Get or create progression
    let progression = await this.clickProcessor.getProgressionCached(userId);

    if (!progression) {
      progression = this.getDefaultProgression(userId);
      await this.clickProcessor.cacheProgression(progression);
    }

    // Send current balance
    client.emit(WebSocketEvent.BALANCE_UPDATE, {
      linesOfCode: progression.linesOfCode,
      level: progression.level,
      clickMultiplier: progression.clickMultiplier,
      passiveMultiplier: progression.passiveMultiplier,
    });

    // Get and send leaderboard position
    const userRank = await this.leaderboardService.getUserRank(userId);
    if (userRank) {
      const { entries } = await this.leaderboardService.getPlayersAroundUser(userId, 3);

      client.emit(WebSocketEvent.LEADERBOARD_UPDATE, {
        type: LeaderboardType.GLOBAL,
        entries: entries.map((e) => ({
          rank: e.rank,
          userId: e.userId,
          username: `Player_${e.userId.slice(0, 8)}`,
          score: e.score.toString(),
          level: 1,
          prestigeLevel: 0,
        })),
        userRank,
        totalPlayers: await this.leaderboardService.getTotalPlayers(),
      });
    }
  }

  /**
   * Calculate offline rewards for reconnecting player
   */
  private async calculateOfflineRewards(client: IAuthenticatedSocket): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    // Get last disconnect time
    const disconnectTime = await this.redis.get(`offline:disconnect:${userId}`);

    if (!disconnectTime) {
      return; // First login or no cached disconnect time
    }

    const disconnectedAt = parseInt(disconnectTime, 10);
    const reconnectedAt = Date.now();
    const offlineDuration = Math.floor((reconnectedAt - disconnectedAt) / 1000);

    // Minimum 1 minute offline for rewards
    if (offlineDuration < 60) {
      return;
    }

    // Max 8 hours of offline rewards
    const maxOfflineTime = 8 * 60 * 60; // 8 hours in seconds
    const effectiveDuration = Math.min(offlineDuration, maxOfflineTime);

    // Get progression for passive rate
    const progression = await this.clickProcessor.getProgressionCached(userId);
    if (!progression) return;

    // Calculate offline earnings (reduced rate - 50% of passive)
    const offlineRate = progression.passiveMultiplier * 0.5;
    const earnedLoc = Math.floor(offlineRate * effectiveDuration);

    if (earnedLoc > 0) {
      // TODO: Actually credit the earnings via progression service

      client.emit(WebSocketEvent.OFFLINE_REWARDS, {
        userId,
        disconnectedAt: new Date(disconnectedAt),
        reconnectedAt: new Date(reconnectedAt),
        offlineDuration,
        maxOfflineTime,
        effectiveDuration,
        offlineRate,
        earnedLoc: earnedLoc.toString(),
        earnedExp: '0', // TODO: Calculate EXP
        completedPrograms: [],
      });
    }

    // Clear the disconnect timestamp
    await this.redis.del(`offline:disconnect:${userId}`);
  }

  /**
   * Get default progression for new users
   */
  private getDefaultProgression(userId: string): IProgressionData {
    return {
      userId,
      linesOfCode: '0',
      level: 1,
      experience: '0',
      clickMultiplier: 1.0,
      passiveMultiplier: 0.0,
      criticalChance: 0.05,
      criticalMultiplier: 2.0,
    };
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
