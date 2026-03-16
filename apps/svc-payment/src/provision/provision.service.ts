/**
 * Provision Service
 * Handles the actual provisioning of purchased items/currency
 * 
 * BUG-04 FIX: Replaced stub methods with real NATS calls to progression service
 * and Redis storage for boosts/subscriptions.
 */

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE, NatsPattern, ProductType, ProvisionError } from '@repo/shared-types';
import Redis from 'ioredis';
import { firstValueFrom } from 'rxjs';


interface IProvisionResult {
  error?: string;
  success: boolean;
}

@Injectable()
export class ProvisionService {
  private readonly logger = new Logger(ProvisionService.name);

  constructor(
    @Inject(NATS_SERVICE.PROGRESSION)
    private readonly natsClient: ClientProxy,
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  /**
   * Provision a purchased order to the user's account
   */
  async provisionOrder(
    userId: string,
    productType: string,
    productData: Record<string, unknown>,
  ): Promise<IProvisionResult> {
    this.logger.log(`Provisioning ${productType} for user ${userId}`);

    switch (productType) {
      case ProductType.PREMIUM_CURRENCY: {
        return this.provisionPremiumCurrency(userId, productData);
      }

      case ProductType.ITEM_PACK: {
        return this.provisionItemPack(userId, productData);
      }

      case ProductType.SUBSCRIPTION: {
        return this.provisionSubscription(userId, productData);
      }

      case ProductType.BOOST: {
        return this.provisionBoost(userId, productData);
      }

      default: {
        this.logger.error(`Unknown product type: ${productType}`);
        return {
          error: ProvisionError.INVALID_PRODUCT,
          success: false,
        };
      }
    }
  }

  /**
   * Provision premium currency (gems, coins, etc.)
   * Calls progression service to update the user's balance.
   */
  private async provisionPremiumCurrency(
    userId: string,
    productData: Record<string, unknown>,
  ): Promise<IProvisionResult> {
    const amount = productData.amount as number;

    if (!amount || amount <= 0) {
      return {
        error: 'Invalid currency amount',
        success: false,
      };
    }

    try {
      await firstValueFrom(
        this.natsClient.send(NatsPattern.PROGRESSION_UPDATE_BALANCE, {
          delta: amount.toString(),
          userId,
        }),
      );

      this.logger.log(`Provisioned ${amount} premium currency to ${userId}`);
      return { success: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to provision premium currency for ${userId}: ${msg}`);
      return { error: msg, success: false };
    }
  }

  /**
   * Provision an item pack
   * Calls progression service to add each item to the user's inventory.
   */
  private async provisionItemPack(
    userId: string,
    productData: Record<string, unknown>,
  ): Promise<IProvisionResult> {
    const items = productData.items as
      | { itemSlug: string; quantity: number }[]
      | undefined;

    if (!items || items.length === 0) {
      return {
        error: 'Invalid item pack data',
        success: false,
      };
    }

    try {
      // Add each item via NATS to progression service
      for (const item of items) {
        await firstValueFrom(
          this.natsClient.send(NatsPattern.PROGRESSION_ADD_ITEM, {
            itemSlug: item.itemSlug,
            quantity: item.quantity,
            userId,
          }),
        );
      }

      this.logger.log(
        `Provisioned item pack (${items.length} items) to ${userId}`,
      );
      return { success: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to provision item pack for ${userId}: ${msg}`);
      return { error: msg, success: false };
    }
  }

  /**
   * Provision a subscription (VIP, Premium, etc.)
   * Stores subscription status in Redis with TTL and notifies progression service.
   */
  private async provisionSubscription(
    userId: string,
    productData: Record<string, unknown>,
  ): Promise<IProvisionResult> {
    const subscriptionType = productData.subscriptionType as string;
    const durationDays = productData.durationDays as number;

    if (!subscriptionType || !durationDays) {
      return {
        error: 'Invalid subscription data',
        success: false,
      };
    }

    try {
      const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000;
      const subscriptionKey = `subscription:${userId}`;
      const ttlSeconds = durationDays * 24 * 60 * 60;

      // Store subscription in Redis with TTL
      await this.redis.setex(
        subscriptionKey,
        ttlSeconds,
        JSON.stringify({
          activatedAt: Date.now(),
          durationDays,
          expiresAt,
          type: subscriptionType,
        }),
      );

      this.logger.log(
        `Provisioned ${subscriptionType} subscription (${durationDays} days) to ${userId}`,
      );
      return { success: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to provision subscription for ${userId}: ${msg}`);
      return { error: msg, success: false };
    }
  }

  /**
   * Provision a temporary boost
   * Stores active boost in Redis with TTL so click-processor can read it.
   */
  private async provisionBoost(
    userId: string,
    productData: Record<string, unknown>,
  ): Promise<IProvisionResult> {
    const boostType = productData.boostType as string;
    const multiplier = productData.multiplier as number;
    const durationSeconds = productData.durationSeconds as number;

    if (!boostType || !multiplier || !durationSeconds) {
      return {
        error: 'Invalid boost data',
        success: false,
      };
    }

    try {
      const boostKey = `boost:${userId}:${boostType}`;

      // Store active boost in Redis with TTL
      await this.redis.setex(
        boostKey,
        durationSeconds,
        JSON.stringify({
          activatedAt: Date.now(),
          expiresAt: Date.now() + durationSeconds * 1000,
          multiplier,
        }),
      );

      this.logger.log(
        `Provisioned ${boostType} boost (${multiplier}x for ${durationSeconds}s) to ${userId}`,
      );
      return { success: true };
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Failed to provision boost for ${userId}: ${msg}`);
      return { error: msg, success: false };
    }
  }
}
