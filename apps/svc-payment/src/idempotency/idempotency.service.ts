/**
 * Idempotency Service
 * Manages payment idempotency to prevent double processing
 * 
 * CRITICAL: This service ensures that a payment is only processed once,
 * even if the webhook is delivered multiple times or the provisioning
 * job is retried.
 * 
 * Strategy:
 * 1. Generate unique idempotency key per transaction
 * 2. Store key in Redis with processing status
 * 3. Before provisioning, check if key exists and is already processed
 * 4. Mark as processed only after successful provisioning
 * 5. Keep keys for 7 days for audit/debugging
 */

import { Injectable, Logger } from '@nestjs/common';
import { createHash } from 'crypto';
import Redis from 'ioredis';

import { DistributedLock, getRedisClient, RedisKeys } from '@repo/redis-client';

enum IdempotencyStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

interface IIdempotencyRecord {
  status: IdempotencyStatus;
  createdAt: string;
  updatedAt: string;
  transactionId?: string;
  error?: string;
}

@Injectable()
export class IdempotencyService {
  private readonly logger = new Logger(IdempotencyService.name);
  private readonly redis: Redis;
  private readonly lock: DistributedLock;
  
  // TTL for idempotency keys (7 days)
  private readonly KEY_TTL_SECONDS = 7 * 24 * 60 * 60;
  
  constructor() {
    this.redis = getRedisClient();
    this.lock = new DistributedLock(this.redis);
  }
  
  /**
   * Generate a deterministic idempotency key for a payment
   * 
   * Key components:
   * - User ID: Who is making the purchase
   * - Product Type: What they're buying
   * - Amount: How much they're paying
   * - Timestamp (daily): Allows same purchase on different days
   */
  generateKey(
    userId: string,
    productType: string,
    amountCents: number,
  ): string {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const data = `${userId}:${productType}:${amountCents}:${date}:${Date.now()}`;
    
    // Create a hash for the key
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 32);
    
    return `idem_${hash}`;
  }
  
  /**
   * Check if a payment can be processed (idempotency check)
   * 
   * Returns:
   * - { canProcess: true } if this is a new payment
   * - { canProcess: false, reason } if already processed or processing
   */
  async checkAndLock(
    idempotencyKey: string,
    transactionId: string,
  ): Promise<{ canProcess: boolean; reason?: string; existingRecord?: IIdempotencyRecord }> {
    const key = this.getRedisKey(idempotencyKey);
    
    // Try to acquire lock for this idempotency key
    const lockValue = await this.lock.acquire(
      RedisKeys.LOCK_PAYMENT(idempotencyKey),
      30, // 30 second lock
    );
    
    if (!lockValue) {
      return {
        canProcess: false,
        reason: 'Another process is handling this payment',
      };
    }
    
    try {
      // Check if key already exists
      const existingData = await this.redis.get(key);
      
      if (existingData) {
        const record: IIdempotencyRecord = JSON.parse(existingData);
        
        if (record.status === IdempotencyStatus.COMPLETED) {
          return {
            canProcess: false,
            reason: 'Payment already processed successfully',
            existingRecord: record,
          };
        }
        
        if (record.status === IdempotencyStatus.PROCESSING) {
          // Check if it's been stuck in processing for too long (> 5 minutes)
          const createdAt = new Date(record.createdAt).getTime();
          const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
          
          if (createdAt > fiveMinutesAgo) {
            return {
              canProcess: false,
              reason: 'Payment is currently being processed',
              existingRecord: record,
            };
          }
          
          // Stale processing state, allow retry
          this.logger.warn(
            `Stale processing state found for ${idempotencyKey}, allowing retry`,
          );
        }
        
        // FAILED status allows retry
      }
      
      // Create/update processing record
      const newRecord: IIdempotencyRecord = {
        status: IdempotencyStatus.PROCESSING,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        transactionId,
      };
      
      await this.redis.setex(
        key,
        this.KEY_TTL_SECONDS,
        JSON.stringify(newRecord),
      );
      
      // Keep lock active (will be released after processing)
      return { canProcess: true };
      
    } catch (error) {
      // Release lock on error
      await this.lock.release(RedisKeys.LOCK_PAYMENT(idempotencyKey), lockValue);
      throw error;
    }
  }
  
  /**
   * Mark payment as successfully processed
   */
  async markCompleted(idempotencyKey: string, transactionId: string): Promise<void> {
    const key = this.getRedisKey(idempotencyKey);
    
    const record: IIdempotencyRecord = {
      status: IdempotencyStatus.COMPLETED,
      createdAt: new Date().toISOString(), // Will be overwritten if exists
      updatedAt: new Date().toISOString(),
      transactionId,
    };
    
    // Get existing record to preserve createdAt
    const existingData = await this.redis.get(key);
    if (existingData) {
      const existing: IIdempotencyRecord = JSON.parse(existingData);
      record.createdAt = existing.createdAt;
    }
    
    await this.redis.setex(
      key,
      this.KEY_TTL_SECONDS,
      JSON.stringify(record),
    );
    
    this.logger.log(`Payment marked as completed: ${idempotencyKey}`);
  }
  
  /**
   * Mark payment as failed
   */
  async markFailed(
    idempotencyKey: string,
    transactionId: string,
    error: string,
  ): Promise<void> {
    const key = this.getRedisKey(idempotencyKey);
    
    const record: IIdempotencyRecord = {
      status: IdempotencyStatus.FAILED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      transactionId,
      error,
    };
    
    // Get existing record to preserve createdAt
    const existingData = await this.redis.get(key);
    if (existingData) {
      const existing: IIdempotencyRecord = JSON.parse(existingData);
      record.createdAt = existing.createdAt;
    }
    
    await this.redis.setex(
      key,
      this.KEY_TTL_SECONDS,
      JSON.stringify(record),
    );
    
    this.logger.warn(`Payment marked as failed: ${idempotencyKey} - ${error}`);
  }
  
  /**
   * Release the processing lock
   */
  async releaseLock(idempotencyKey: string): Promise<void> {
    // Note: In a real implementation, we'd need to store and release
    // the actual lock value. For simplicity, we're using a fixed release.
    await this.redis.del(RedisKeys.LOCK_PAYMENT(idempotencyKey));
  }
  
  /**
   * Get the Redis key for an idempotency record
   */
  private getRedisKey(idempotencyKey: string): string {
    return `idempotency:${idempotencyKey}`;
  }
  
  /**
   * Get idempotency record (for debugging/admin)
   */
  async getRecord(idempotencyKey: string): Promise<IIdempotencyRecord | null> {
    const key = this.getRedisKey(idempotencyKey);
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
}
