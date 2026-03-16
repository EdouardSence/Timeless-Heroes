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

import { Inject, Logger, UseGuards } from '@nestjs/common';
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
  IKeyPressPayload,
  ILeaderboardUpdate,
  IProgressionData,
  LeaderboardType,
  NATS_SERVICE,
  NatsPattern,
  WebSocketEvent,
} from '@repo/shared-types';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';
import { Server } from 'socket.io';

import { AuthService } from '../auth/auth.service';
import { IAuthenticatedSocket, WsJwtGuard } from '../auth/ws-jwt.guard';
import { ClickProcessorService } from '../click-processor/click-processor.service';
import { ClickValidatorService } from '../click-processor/click-validator.service';

@UseGuards(WsJwtGuard)
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
    private readonly authService: AuthService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    @Inject(NATS_SERVICE.PROGRESSION)
    private readonly progressionClient: ClientProxy,
  ) {}

  afterInit() {
    this.logger.log('🎮 Game WebSocket Gateway initialized');
  }

  /**
   * Handle new client connection
   * Verifies JWT token and rejects unauthenticated clients
   */
  async handleConnection(client: IAuthenticatedSocket) {
    try {
      // Extract token from handshake (auth object, header, or query)
      const rawToken: unknown =
        (client.handshake.auth as Record<string, unknown>).token ??
        client.handshake.headers.authorization ??
        (client.handshake.query.token as string | undefined);

      if (!rawToken || typeof rawToken !== 'string') {
        this.logger.warn(`Client ${client.id} rejected: no auth token`);
        client.emit(WebSocketEvent.ERROR, {
          code: 'AUTH_REQUIRED',
          message: 'JWT token required',
        });
        client.disconnect(true);
        return;
      }

      // Strip "Bearer " prefix if present
      const token = rawToken.startsWith('Bearer ')
        ? rawToken.slice(7)
        : rawToken;

      // Verify JWT and extract payload
      const payload = await this.authService.verifyToken(token);

      const userId = payload.sub;
      const username = payload.username || 'Player';

      client.userId = userId;
      client.username = username;

      // Track connected user in Redis (replaces in-memory Map)
      await this.redis.hset(RedisKeys.WS_CONNECTED_USERS, userId, client.id);

      // Join user-specific room for targeted messages
      await client.join(`user:${userId}`);

      // Track session in Redis (include username for leaderboard lookups)
      await this.redis.set(
        RedisKeys.USER_SESSION(userId),
        JSON.stringify({
          connectedAt: Date.now(),
          socketId: client.id,
          username,
        }),
      );

      this.logger.log(`Client connected: ${client.id} (User: ${userId})`);

      // Send initial data to client
      await this.sendInitialData(client);

      // Calculate and send offline rewards if applicable
      await this.calculateOfflineRewards(client);
    } catch (error) {
      this.logger.warn(
        `Client ${client.id} rejected: invalid token — ${error instanceof Error ? error.message : String(error)}`,
      );
      client.emit(WebSocketEvent.ERROR, {
        code: 'AUTH_FAILED',
        message: 'Invalid or expired JWT token',
      });
      client.disconnect(true);
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

    // 1. Validate click (anti-cheat)
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

    // 2. Get user progression (cached or from microservice)
    let progression = await this.clickProcessor.getProgressionCached(userId);

    if (!progression) {
      // Fetch from progression microservice via NATS
      const rawResponse: unknown = await firstValueFrom(
        this.progressionClient.send(NatsPattern.PROGRESSION_GET, {
          userId,
        }),
      );
      // Unwrap IApiResponse { success, data, timestamp } → IProgressionData
      progression =
        rawResponse && typeof rawResponse === 'object' && 'data' in rawResponse
          ? (rawResponse as { data: IProgressionData }).data
          : (rawResponse as IProgressionData);
      await this.clickProcessor.cacheProgression(progression);
    }

    // 3. Process the click
    const result = await this.clickProcessor.processClick(
      fullPayload,
      progression,
    );

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

    // Map to response format — fetch real usernames and levels via NATS
    const entries = await Promise.all(
      topPlayers.map(async (entry) => {
        let username = `Player_${entry.userId.slice(0, 8)}`;
        let level = 1;
        const prestigeLevel = 0;

        try {
          const rawProg: unknown = await firstValueFrom(
            this.progressionClient.send(NatsPattern.PROGRESSION_GET, {
              userId: entry.userId,
            }),
          );
          const progression =
            rawProg && typeof rawProg === 'object' && 'data' in rawProg
              ? (rawProg as { data: IProgressionData }).data
              : (rawProg as IProgressionData);
          level = progression.level;
        } catch {
          // Fallback to defaults if progression service is unavailable
        }

        // Try to get username from Redis session data
        const sessionData = await this.redis.get(
          RedisKeys.USER_SESSION(entry.userId),
        );
        if (sessionData) {
          try {
            const session = JSON.parse(sessionData) as { username?: string };
            if (session.username) {
              username = session.username;
            }
          } catch {
            // ignore parse errors
          }
        }

        return {
          level,
          prestigeLevel,
          rank: entry.rank,
          score: entry.score.toString(),
          userId: entry.userId,
          username,
        };
      }),
    );

    const response: ILeaderboardUpdate = {
      entries,
      totalPlayers,
      type: leaderboardType,
      userRank: userRank ?? undefined,
    };

    client.emit(WebSocketEvent.LEADERBOARD_UPDATE, response);

    return response;
  }

  /**
   * Get shop catalog from progression service
   */
  @SubscribeMessage(WebSocketEvent.GET_SHOP_CATALOG)
  async handleGetShopCatalog(@ConnectedSocket() client: IAuthenticatedSocket) {
    try {
      const result: unknown = await firstValueFrom(
        this.progressionClient.send(NatsPattern.SHOP_GET_CATALOG, {}),
      );

      client.emit(WebSocketEvent.SHOP_CATALOG, result);
      return result as Record<string, unknown>;
    } catch (error) {
      this.logger.error('Failed to fetch shop catalog:', error);
      return { error: 'Failed to fetch shop catalog', success: false };
    }
  }

  /**
   * Send initial game data to newly connected client
   */
  private async sendInitialData(client: IAuthenticatedSocket): Promise<void> {
    const userId = client.userId;
    if (!userId) return;

    // Get or create progression from microservice
    let progression = await this.clickProcessor.getProgressionCached(userId);

    if (!progression) {
      // Fetch from progression microservice via NATS
      const rawResponse: unknown = await firstValueFrom(
        this.progressionClient.send(NatsPattern.PROGRESSION_GET, {
          userId,
        }),
      );
      // Unwrap IApiResponse { success, data, timestamp } → IProgressionData
      progression =
        rawResponse && typeof rawResponse === 'object' && 'data' in rawResponse
          ? (rawResponse as { data: IProgressionData }).data
          : (rawResponse as IProgressionData);
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
        entries: await Promise.all(
          entries.map(async (e) => {
            let username = `Player_${e.userId.slice(0, 8)}`;
            let level = 1;

            try {
              const rawProg: unknown = await firstValueFrom(
                this.progressionClient.send(NatsPattern.PROGRESSION_GET, {
                  userId: e.userId,
                }),
              );
              const prog =
                rawProg && typeof rawProg === 'object' && 'data' in rawProg
                  ? (rawProg as { data: IProgressionData }).data
                  : (rawProg as IProgressionData);
              level = prog.level;
            } catch {
              // fallback
            }

            // Try to get username from Redis session
            const sessionData = await this.redis.get(
              RedisKeys.USER_SESSION(e.userId),
            );
            if (sessionData) {
              try {
                const session = JSON.parse(sessionData) as {
                  username?: string;
                };
                if (session.username) {
                  username = session.username;
                }
              } catch {
                // ignore
              }
            }

            return {
              level,
              prestigeLevel: 0,
              rank: e.rank,
              score: e.score.toString(),
              userId: e.userId,
              username,
            };
          }),
        ),
        totalPlayers: await this.leaderboardService.getTotalPlayers(),
        type: LeaderboardType.GLOBAL,
        userRank,
      });
    }
  }

  /**
   * Calculate offline rewards for reconnecting player
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
      // Credit offline earnings via NATS -> svc-user-progression
      const earnedExp = Math.floor(earnedLoc * 0.1);

      await firstValueFrom(
        this.progressionClient.send(NatsPattern.PROGRESSION_UPDATE_BALANCE, {
          delta: earnedLoc.toString(),
          userId,
        }),
      );

      await firstValueFrom(
        this.progressionClient.send(NatsPattern.PROGRESSION_ADD_EXPERIENCE, {
          experience: earnedExp,
          userId,
        }),
      );

      client.emit(WebSocketEvent.OFFLINE_REWARDS, {
        completedPrograms: [],
        disconnectedAt: new Date(disconnectedAt),
        earnedExp: earnedExp.toString(),
        earnedLoc: earnedLoc.toString(),
        effectiveDuration,
        maxOfflineTime,
        offlineDuration,
        offlineRate,
        reconnectedAt: new Date(reconnectedAt),
        userId,
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
      clickMultiplier: 1,
      criticalChance: 0.05,
      criticalMultiplier: 2,
      experience: '0',
      experienceToNext: '100',
      level: 1,
      linesOfCode: '0',
      passiveMultiplier: 0,
      totalLinesWritten: '0',
      userId,
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
