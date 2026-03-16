/**
 * TCP Ingest Service
 * Handles authentication and key press processing from keylogger
 */

import * as crypto from 'node:crypto';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { ClickBufferService, RedisKeys } from '@repo/redis-client';
import {
  IProgressionData,
  KeyType,
  NATS_SERVICE,
  NatsPattern,
} from '@repo/shared-types';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';

import { ClickProcessorService } from '../click-processor/click-processor.service';

import { HeuristicAntiCheatService } from './heuristic-anti-cheat.service';
import {
  IAntiCheatResult,
  ITcpAuthResponse,
  ITcpKeyPressEvent,
  KeyCategory,
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
    @Inject(NATS_SERVICE.PROGRESSION)
    private readonly progressionClient: ClientProxy,
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
        const rawResponse: unknown = await firstValueFrom(
          this.progressionClient.send(NatsPattern.PROGRESSION_GET, { userId }),
        );
        // The NATS controller wraps the result in IApiResponse { success, data, timestamp }.
        // We must unwrap .data to get the actual IProgressionData.
        progression =
          rawResponse &&
          typeof rawResponse === 'object' &&
          'data' in rawResponse
            ? (rawResponse as { data: IProgressionData }).data
            : (rawResponse as IProgressionData);
        await this.clickProcessor.cacheProgression(progression);
      } catch (error) {
        this.logger.error(`Failed to fetch progression for ${userId}`, error);
      }
    }

    // Fallback if progression is truly unreachable
    progression ??= {
      clickMultiplier: 1,
      criticalChance: 0.05,
      criticalMultiplier: 2,
      experience: '0',
      experienceToNext: '100',
      level: 1,
      linesOfCode: '0',
      passiveMultiplier: 0,
      prestigeLevel: 0,
      prestigeMultiplier: 1,
      totalLinesWritten: '0',
      userId,
    };

    // 4. Delegate to ClickProcessorService to calculate final value (with multipliers) and buffer it
    // progression is guaranteed non-null here (fallback block above assigns a default)
    const clickResult = await this.clickProcessor.processClick(
      { keyType, timestamp, userId },
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
  // eslint-disable-next-line sonarjs/cognitive-complexity
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
      experienceToNext: string;
    } | null;
    antiCheat: {
      violations: number;
      maxViolations: number;
      banned: boolean;
      /** Seconds until the violation key expires (≈ unban time). -1 if not banned. */
      banExpiresIn: number;
    };
  }> {
    let accepted = 0;
    let rejected = 0;

    // Fetch progression once for the entire batch (cache it)
    let progression = await this.clickProcessor.getProgressionCached(userId);

    if (!progression) {
      try {
        const rawResponse: unknown = await firstValueFrom(
          this.progressionClient.send(NatsPattern.PROGRESSION_GET, { userId }),
        );
        progression =
          rawResponse &&
          typeof rawResponse === 'object' &&
          'data' in rawResponse
            ? (rawResponse as { data: IProgressionData }).data
            : (rawResponse as IProgressionData);
        await this.clickProcessor.cacheProgression(progression);
      } catch (error) {
        this.logger.error(`Failed to fetch progression for ${userId}`, error);
      }
    }

    // Fallback if progression is truly unreachable
    progression ??= {
      clickMultiplier: 1,
      criticalChance: 0.05,
      criticalMultiplier: 2,
      experience: '0',
      experienceToNext: '100',
      level: 1,
      linesOfCode: '0',
      passiveMultiplier: 0,
      prestigeLevel: 0,
      prestigeMultiplier: 1,
      totalLinesWritten: '0',
      userId,
    };

    // ── Batch-level anti-cheat (instead of per-key) ──
    // The desktop buffers keys for ~2s and sends them in a single HTTP batch.
    // Running per-key anti-cheat against Redis timestamps makes every batch
    // look like a burst (deltas ≈ 0ms between keys) and flags them all as
    // RATE_TOO_FAST. Instead, we validate the batch as a whole:
    //   1. Check if user is already banned (too many violations).
    //   2. Compute the average CPS over the batch's own timestamp span.
    //   3. If the batch CPS is reasonable, accept all keys.
    //   4. If the batch CPS is too high, reject the entire batch.
    // Small batches (< 5 keys) are exempt from CPS checks because
    // keyboard shortcuts (Ctrl+C, etc.) produce 2-3 keys in <15ms,
    // giving artificially high CPS that is not representative.

    // After ??= fallback, progression is guaranteed non-null. Bind to const for TS narrowing.
    const safeProgression = progression;

    const violations = await this.redis.get(RedisKeys.USER_VIOLATIONS(userId));
    const violationCount = violations ? Number.parseInt(violations, 10) : 0;
    const maxViolations = this.antiCheatService.getMaxViolations();

    if (violationCount >= maxViolations) {
      const ttl = await this.redis.ttl(RedisKeys.USER_VIOLATIONS(userId));
      this.logger.warn(
        `User ${userId} is banned (${violationCount} violations), rejecting batch`,
      );
      return {
        accepted: 0,
        antiCheat: {
          banExpiresIn: ttl > 0 ? ttl : -1,
          banned: true,
          maxViolations,
          violations: violationCount,
        },
        progression: null,
        rejected: events.length,
      };
    }

    // Compute average CPS from the batch timestamps (only for batches >= 5 keys)
    let batchRejected = false;
    if (events.length >= 5) {
      // eslint-disable-next-line unicorn/no-array-sort -- toSorted() unavailable with es2022 target
      const sortedTs = events.map((e) => e.timestamp).sort((a, b) => a - b);
      const first = sortedTs[0];
      const last = sortedTs.at(-1);
      if (first !== undefined && last !== undefined) {
        const spanMs = last - first;
        if (spanMs > 0) {
          const batchCPS = (events.length - 1) / (spanMs / 1000);
          const maxCPS = this.antiCheatService.getMaxCPS();
          if (batchCPS > maxCPS) {
            this.logger.warn(
              `Batch rejected for ${userId}: CPS=${batchCPS.toFixed(1)} exceeds max=${maxCPS}`,
            );
            batchRejected = true;
            // Increment violations with a 10-minute TTL so they expire naturally
            const violKey = RedisKeys.USER_VIOLATIONS(userId);
            await this.redis.incr(violKey);
            await this.redis.expire(violKey, 600);
          }
        }
      }
    }

    if (batchRejected) {
      rejected = events.length;
    } else {
      // All keys pass batch-level check — process them
      for (const event of events) {
        const keyType = this.categoryToKeyType(event.keyCategory);

        try {
          // progression is guaranteed non-null here (fallback block above assigns a default)
          await this.clickProcessor.processClick(
            { keyType, timestamp: event.timestamp, userId },
            safeProgression,
          );
          accepted++;
        } catch (error) {
          this.logger.error(
            `Failed to process click in batch for ${userId}`,
            error,
          );
          rejected++;
        }
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
      experienceToNext: string;
    } | null = null;

    if (accepted > 0) {
      try {
        // Atomically read and clear the buffer (Lua script: HGETALL + DEL)
        const flushed = await this.clickBufferService.flushBuffer(userId);

        if (flushed && Number.parseFloat(flushed.locToAdd) > 0) {
          // 1. Persist LoC to DB via NATS
          await firstValueFrom(
            this.progressionClient.send(
              NatsPattern.PROGRESSION_UPDATE_BALANCE,
              {
                delta: flushed.locToAdd,
                userId,
              },
            ),
          );

          // 2. Process XP and level-ups
          await firstValueFrom(
            this.progressionClient.send(
              NatsPattern.PROGRESSION_ADD_EXPERIENCE,
              {
                experience: flushed.clicks.toString(),
                userId,
              },
            ),
          ).catch((error: unknown) => {
            this.logger.warn(`Failed to add XP for ${userId}`, error);
          });

          // 3. Invalidate cache and fetch FRESH progression (reflects both LoC and XP/level updates)
          await this.redis.del(RedisKeys.CACHE_USER_PROGRESSION(userId));
          progressionResponse = await this.getCurrentProgression(userId);
        }
      } catch (error) {
        this.logger.error(`Failed to flush buffer to DB for ${userId}`, error);
      }
    }

    // Fallback: if direct flush failed or no keys were accepted, use getCurrentProgression
    if (!progressionResponse) {
      const freshProg = await this.getCurrentProgression(userId);
      if (freshProg) {
        progressionResponse = freshProg;
      }
    }

    // Last resort fallback (progression is guaranteed non-null by fallback block above)
    progressionResponse ??= {
      clickMultiplier: progression.clickMultiplier,
      experience: progression.experience,
      experienceToNext: progression.experienceToNext,
      level: progression.level,
      linesOfCode: progression.linesOfCode,
      passiveMultiplier: progression.passiveMultiplier,
    };

    // Re-read violation count (may have been incremented during this batch)
    const finalViolations = await this.redis.get(
      RedisKeys.USER_VIOLATIONS(userId),
    );
    const finalViolationCount = finalViolations
      ? Number.parseInt(finalViolations, 10)
      : 0;
    const finalTtl = await this.redis.ttl(RedisKeys.USER_VIOLATIONS(userId));

    this.logger.debug(
      `Batch processed for ${userId}: ${accepted} accepted, ${rejected} rejected, balance=${progressionResponse.linesOfCode}`,
    );

    return {
      accepted,
      antiCheat: {
        banExpiresIn:
          finalViolationCount >= maxViolations && finalTtl > 0 ? finalTtl : -1,
        banned: finalViolationCount >= maxViolations,
        maxViolations,
        violations: finalViolationCount,
      },
      progression: progressionResponse,
      rejected,
    };
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
    experienceToNext: string;
  } | null> {
    let progression: IProgressionData | null = null;

    try {
      const rawResponse: unknown = await firstValueFrom(
        this.progressionClient.send(NatsPattern.PROGRESSION_GET, { userId }),
      );
      progression =
        rawResponse && typeof rawResponse === 'object' && 'data' in rawResponse
          ? (rawResponse as { data: IProgressionData }).data
          : (rawResponse as IProgressionData);
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
    const inflight = Number.parseFloat(inflightLoc ?? '0') || 0;

    const baseLoc = Number.parseFloat(progression.linesOfCode || '0') || 0;
    const totalLoc = Math.floor(baseLoc + inflight);

    return {
      clickMultiplier: progression.clickMultiplier,
      experience: progression.experience,
      experienceToNext: progression.experienceToNext,
      level: progression.level,
      linesOfCode: totalLoc.toString(),
      passiveMultiplier: progression.passiveMultiplier,
    };
  }

  /**
   * Process passive income from desktop client.
   * Directly persists the LoC amount to DB via NATS (bypasses BullMQ pipeline
   * to avoid the same race condition as keystroke processing).
   */
  async processPassiveIncome(
    userId: string,
    locAmount: number,
  ): Promise<boolean> {
    try {
      // Directly persist passive LoC to DB via NATS (bypasses Redis buffer + BullMQ)
      await firstValueFrom(
        this.progressionClient.send(NatsPattern.PROGRESSION_UPDATE_BALANCE, {
          delta: locAmount.toString(),
          userId,
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
        `Failed to persist passive income for ${userId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      // Fallback: buffer in Redis (BullMQ will eventually flush it)
      try {
        await this.clickBufferService.incrementBuffer(
          userId,
          locAmount.toString(),
        );
        this.logger.warn(`Fallback: buffered passive income for ${userId}`);
        return true;
      } catch (bufferError) {
        this.logger.error(
          `Fallback buffering also failed for ${userId}`,
          bufferError,
        );
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
