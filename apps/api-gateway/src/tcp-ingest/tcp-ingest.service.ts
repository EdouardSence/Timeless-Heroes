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
   * Process a BATCH of anonymized key press events.
   * Returns the server-authoritative progression after processing all keys.
   * This is the preferred endpoint for the desktop client.
   */
  async processKeyPressBatch(
    userId: string,
    events: ITcpKeyPressEvent[],
  ): Promise<{
    accepted: number;
    rejected: number;
    progression: {
      linesOfCode: string;
      level: number;
      clickMultiplier: number;
      passiveMultiplier: number;
      experience: string;
    } | null;
  }> {
    let accepted = 0;
    let rejected = 0;

    // Fetch progression once for the entire batch (cache it)
    let progression = await this.clickProcessor.getProgressionCached(userId);

    if (!progression) {
      try {
        const rawResponse = await firstValueFrom(
          this.progressionClient.send<any>(NatsPattern.PROGRESSION_GET, { userId }),
        );
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

    // Process each key event in the batch
    let lastClickResult: import('@repo/shared-types').IClickResult | null = null;

    for (const event of events) {
      // Anti-cheat per key
      const antiCheatResult = await this.antiCheatService.analyzeKeyPress(
        userId,
        event.timestamp,
      );

      if (!antiCheatResult.allowed) {
        rejected++;
        await this.redis.incr(RedisKeys.USER_VIOLATIONS(userId));
        continue;
      }

      const keyType = this.categoryToKeyType(event.keyCategory);

      try {
        lastClickResult = await this.clickProcessor.processClick(
          { keyType, userId, timestamp: event.timestamp },
          progression,
        );
        accepted++;
      } catch (e) {
        this.logger.error(`Failed to process click in batch for ${userId}`, e);
        rejected++;
      }
    }

    // ── Immediately flush Redis buffer to DB (bypasses BullMQ race condition) ──
    // Instead of relying on the BullMQ worker (which runs every 5s and can clear
    // the buffer between processClick and getCurrentProgression), we atomically
    // flush the buffer and persist the delta to the DB right here, so the
    // returned progression reflects the REAL persisted balance.
    let progressionResponse: {
      linesOfCode: string;
      level: number;
      clickMultiplier: number;
      passiveMultiplier: number;
      experience: string;
    } | null = null;

    if (accepted > 0) {
      try {
        // Atomically read and clear the buffer (Lua script: HGETALL + DEL)
        const flushed = await this.clickBufferService.flushBuffer(userId);

        if (flushed && parseFloat(flushed.locToAdd) > 0) {
          // Directly persist to DB via NATS (bypasses BullMQ queue entirely)
          const rawUpdateResp = await firstValueFrom(
            this.progressionClient.send<any>(NatsPattern.PROGRESSION_UPDATE_BALANCE, {
              userId,
              delta: flushed.locToAdd,
            }),
          );
          const updatedProg = (rawUpdateResp && typeof rawUpdateResp === 'object' && 'data' in rawUpdateResp)
            ? rawUpdateResp.data as IProgressionData
            : rawUpdateResp as IProgressionData;

          // Add experience (1 XP per click)
          await firstValueFrom(
            this.progressionClient.send<any>(NatsPattern.PROGRESSION_ADD_EXPERIENCE, {
              userId,
              experience: flushed.clicks.toString(),
            }),
          ).catch(e => this.logger.warn(`Failed to add XP for ${userId}`, e));

          // Invalidate cached progression so next read is fresh
          await this.redis.del(RedisKeys.CACHE_USER_PROGRESSION(userId));

          if (updatedProg) {
            progressionResponse = {
              linesOfCode: updatedProg.linesOfCode,
              level: updatedProg.level,
              clickMultiplier: updatedProg.clickMultiplier,
              passiveMultiplier: updatedProg.passiveMultiplier,
              experience: updatedProg.experience,
            };
          }
        }
      } catch (e) {
        this.logger.error(`Failed to flush buffer to DB for ${userId}`, e);
      }
    }

    // Fallback: if direct flush failed or no keys were accepted, use getCurrentProgression
    if (!progressionResponse) {
      const freshProg = await this.getCurrentProgression(userId);
      if (freshProg) {
        progressionResponse = freshProg;
      }
    }

    // Last resort fallback
    if (!progressionResponse && progression) {
      progressionResponse = {
        linesOfCode: progression.linesOfCode,
        level: progression.level,
        clickMultiplier: progression.clickMultiplier,
        passiveMultiplier: progression.passiveMultiplier,
        experience: progression.experience,
      };
    }

    this.logger.debug(
      `Batch processed for ${userId}: ${accepted} accepted, ${rejected} rejected, balance=${progressionResponse?.linesOfCode}`,
    );

    return { accepted, rejected, progression: progressionResponse };
  }

  /**
   * Get current server-authoritative progression for a user.
   * ALWAYS fetches fresh from DB via NATS (never uses stale cache for LOC).
   *
   * NOTE: The NATS response from svc-user-progression.getProgression() already
   * includes the unflushed Redis buffer (extraLoC). We must NOT add the buffer
   * again here — only add in-flight amounts (flushed from buffer but not yet
   * persisted to DB) which are NOT included in the NATS response.
   */
  async getCurrentProgression(userId: string): Promise<{
    linesOfCode: string;
    level: number;
    clickMultiplier: number;
    passiveMultiplier: number;
    experience: string;
  } | null> {
    let progression: IProgressionData | null = null;

    try {
      const rawResponse = await firstValueFrom(
        this.progressionClient.send<any>(NatsPattern.PROGRESSION_GET, { userId }),
      );
      progression = (rawResponse && typeof rawResponse === 'object' && 'data' in rawResponse)
        ? rawResponse.data as IProgressionData
        : rawResponse as IProgressionData;
    } catch {
      // Fallback to cache if NATS fails
      progression = await this.clickProcessor.getProgressionCached(userId);
    }

    if (!progression) return null;

    // The NATS response (baseLoc) already includes the unflushed Redis buffer
    // (added by svc-user-progression.getProgression). Do NOT add it again.
    // Only add in-flight LOC (flushed from buffer but not yet persisted to DB),
    // which is NOT included in the NATS response.
    const inflightKey = RedisKeys.INFLIGHT_CLICKS(userId);
    const inflightLoc = await this.redis.hget(inflightKey, 'locToAdd');
    const inflight = parseFloat(inflightLoc || '0') || 0;

    const baseLoc = parseFloat(progression.linesOfCode || '0') || 0;
    const totalLoc = Math.floor(baseLoc + inflight);

    return {
      linesOfCode: totalLoc.toString(),
      level: progression.level,
      clickMultiplier: progression.clickMultiplier,
      passiveMultiplier: progression.passiveMultiplier,
      experience: progression.experience,
    };
  }

  /**
   * Process passive income from desktop client.
   * Directly persists the LoC amount to DB via NATS (bypasses BullMQ pipeline
   * to avoid the same race condition as keystroke processing).
   */
  async processPassiveIncome(userId: string, locAmount: number): Promise<boolean> {
    try {
      // Directly persist passive LoC to DB via NATS (bypasses Redis buffer + BullMQ)
      const rawUpdateResp = await firstValueFrom(
        this.progressionClient.send<any>(NatsPattern.PROGRESSION_UPDATE_BALANCE, {
          userId,
          delta: locAmount.toString(),
        }),
      );

      // Invalidate cached progression so next read is fresh
      await this.redis.del(RedisKeys.CACHE_USER_PROGRESSION(userId));

      this.logger.debug(
        `Persisted passive income for ${userId}: +${locAmount} LoC`,
      );

      return true;
    } catch (error) {
      this.logger.error(
        `Failed to persist passive income for ${userId}: ${error instanceof Error ? error.message : error}`,
      );
      // Fallback: buffer in Redis (BullMQ will eventually flush it)
      try {
        await this.clickBufferService.incrementBuffer(userId, locAmount.toString());
        this.logger.warn(`Fallback: buffered passive income for ${userId}`);
        return true;
      } catch (bufferError) {
        this.logger.error(`Fallback buffering also failed for ${userId}`, bufferError);
        return false;
      }
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
