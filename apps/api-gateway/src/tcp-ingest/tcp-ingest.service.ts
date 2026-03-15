/**
 * TCP Ingest Service
 * Handles authentication and key press processing from keylogger
 */

import * as crypto from 'node:crypto';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { ClickBufferService, RedisKeys } from '@repo/redis-client';
import { KeyType, NATS_SERVICE, NatsPattern, IProgressionData } from '@repo/shared-types';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';

import { ClickProcessorService } from '../click-processor/click-processor.service';
import { HeuristicAntiCheatService } from './heuristic-anti-cheat.service';
import {
  ITcpKeyPressEvent,
  ITcpAuthResponse,
  KeyCategory,
  IAntiCheatResult,
} from './tcp-ingest.types';

@Injectable()
export class TcpIngestService {
  private readonly logger = new Logger(TcpIngestService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly clickBufferService: ClickBufferService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly antiCheatService: HeuristicAntiCheatService,
    private readonly clickProcessor: ClickProcessorService,
    @Inject(NATS_SERVICE.PROGRESSION) private readonly progressionClient: ClientProxy,
  ) {}

  /**
   * Authenticate a client using JWT token
   */
  async authenticateClient(token: string): Promise<ITcpAuthResponse> {
    try {
      // Verify JWT
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token);

      const userId = payload.sub;
      const sessionId = this.generateSessionId();
      const ttlSeconds = 7 * 24 * 60 * 60; // 7 days

      // Store session in Redis (replaces in-memory Map)
      await this.redis.setex(
        RedisKeys.TCP_SESSION(sessionId),
        ttlSeconds,
        JSON.stringify({ expiresAt: Date.now() + ttlSeconds * 1000, userId }),
      );

      // Also store user session reference
      await this.redis.setex(
        RedisKeys.USER_SESSION(userId),
        ttlSeconds,
        JSON.stringify({ authenticatedAt: Date.now(), sessionId }),
      );

      return {
        message: 'Authentication successful',
        sessionId,
        success: true,
        userId,
      };
    } catch (error) {
      this.logger.warn(
        `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return {
        message: 'Invalid or expired token',
        success: false,
      };
    }
  }

  /**
   * Process an anonymized key press event
   * This is the core ingestion logic
   */
  async processKeyPress(
    event: ITcpKeyPressEvent,
  ): Promise<{ buffered: boolean; antiCheat: IAntiCheatResult }> {
    const { keyCategory, timestamp, userId } = event;

    // 1. Run anti-cheat heuristics
    const antiCheatResult = await this.antiCheatService.analyzeKeyPress(
      userId,
      timestamp,
    );

    if (!antiCheatResult.allowed) {
      this.logger.warn(
        `Anti-cheat blocked key press from ${userId}: ${antiCheatResult.reason}`,
      );

      // Track violations in Redis
      await this.redis.incr(RedisKeys.USER_VIOLATIONS(userId));

      return { antiCheat: antiCheatResult, buffered: false };
    }

    // 2. Convert key category to KeyType for multiplier calculation
    const keyType = this.categoryToKeyType(keyCategory);

    // 3. Fetch progression to apply multipliers (cached or NATS)
    let progression = await this.clickProcessor.getProgressionCached(userId);
    
    if (!progression) {
      try {
        const rawResponse = await firstValueFrom(
          this.progressionClient.send<any>(NatsPattern.PROGRESSION_GET, { userId }),
        );
        // The NATS controller wraps the result in IApiResponse { success, data, timestamp }.
        // We must unwrap .data to get the actual IProgressionData.
        progression = (rawResponse && typeof rawResponse === 'object' && 'data' in rawResponse)
          ? rawResponse.data as IProgressionData
          : rawResponse as IProgressionData;
        if (progression) {
          await this.clickProcessor.cacheProgression(progression);
        }
      } catch (e) {
        this.logger.error(`Failed to fetch progression for ${userId}`, e);
      }
    }

    // Fallback if progression is truly unreachable
    if (!progression) {
      progression = {
        userId,
        linesOfCode: '0',
        clickMultiplier: 1.0,
        criticalChance: 0.05,
        criticalMultiplier: 2.0,
        passiveMultiplier: 0.0,
        level: 1,
        totalLinesWritten: '0',
        experience: '0',
      };
    }

    // 4. Delegate to ClickProcessorService to calculate final value (with multipliers) and buffer it
    const clickResult = await this.clickProcessor.processClick(
      { keyType, userId, timestamp },
      progression,
    );

    this.logger.debug(
      `Buffered key press for ${userId}: category=${keyCategory}, finalValue=${clickResult.finalValue}`,
    );

    return {
      antiCheat: antiCheatResult,
      buffered: true,
    };
  }

  /**
   * Convert anonymous category to KeyType enum
   */
  private categoryToKeyType(category: KeyCategory): KeyType {
    switch (category) {
      case 'FUNCTION': {
        return KeyType.FUNCTION;
      }
      case 'MODIFIER': {
        return KeyType.SPECIAL;
      }
      default: {
        return KeyType.NORMAL;
      }
    }
  }

  /**
   * Process passive income from desktop client.
   * Buffers the LoC amount in Redis for the next flush cycle.
   * This ensures passive income earned locally is persisted server-side.
   */
  async processPassiveIncome(userId: string, locAmount: number): Promise<boolean> {
    try {
      // Buffer the passive LoC exactly like a click, but as a single lump sum.
      // The click-buffer flush will pick it up and persist via NATS.
      await this.clickBufferService.incrementBuffer(userId, locAmount.toString());

      this.logger.debug(
        `Buffered passive income for ${userId}: +${locAmount} LoC`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to buffer passive income for ${userId}: ${error instanceof Error ? error.message : error}`,
      );
      return false;
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    // Use cryptographically secure randomness for session identifiers
    const randomPart = crypto.randomBytes(16).toString('hex');
    return `sess_${randomPart}`;
  }

  /**
   * Validate if a session is still valid (checks Redis)
   */
  async isSessionValid(sessionId: string): Promise<boolean> {
    const data = await this.redis.get(RedisKeys.TCP_SESSION(sessionId));
    if (!data) return false;

    const session = JSON.parse(data) as { userId: string; expiresAt: number };
    if (Date.now() > session.expiresAt) {
      await this.redis.del(RedisKeys.TCP_SESSION(sessionId));
      return false;
    }
    return true;
  }

  /**
   * Get user ID from session (from Redis)
   */
  async getUserIdFromSession(sessionId: string): Promise<string | null> {
    const data = await this.redis.get(RedisKeys.TCP_SESSION(sessionId));
    if (!data) return null;

    const session = JSON.parse(data) as { userId: string; expiresAt: number };
    return session.userId;
  }
}
