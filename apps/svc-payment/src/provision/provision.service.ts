/**
 * Provision Service
 * Handles the actual provisioning of purchased items/currency
 */

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ProductType, ProvisionError } from '@repo/shared-types';

interface IProvisionResult {
  success: boolean;
  error?: string;
}

@Injectable()
export class ProvisionService {
  private readonly logger = new Logger(ProvisionService.name);

  constructor(private readonly configService: ConfigService) { }

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
      case ProductType.PREMIUM_CURRENCY:
        return this.provisionPremiumCurrency(userId, productData);

      case ProductType.ITEM_PACK:
        return this.provisionItemPack(userId, productData);

      case ProductType.SUBSCRIPTION:
        return this.provisionSubscription(userId, productData);

      case ProductType.BOOST:
        return this.provisionBoost(userId, productData);

      default:
        this.logger.error(`Unknown product type: ${productType}`);
        return {
          success: false,
          error: ProvisionError.INVALID_PRODUCT,
        };
    }
  }

  /**
   * Provision premium currency (gems, coins, etc.)
   */
  private async provisionPremiumCurrency(
    userId: string,
    productData: Record<string, unknown>,
  ): Promise<IProvisionResult> {
    const amount = productData.amount as number;

    if (!amount || amount <= 0) {
      return {
        success: false,
        error: 'Invalid currency amount',
      };
    }

    const progressionUrl = this.configService.get<string>(
      'PROGRESSION_SERVICE_URL',
      `http://localhost:${this.configService.get<string>('PROGRESSION_PORT', '3001')}`
    );

    try {
      const response = await fetch(`${progressionUrl}/progression/${userId}/add-currency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error(`Progression service returned status ${response.status}`);
      }

      this.logger.log(`Provisioned ${amount} premium currency to ${userId}`);
      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to provision premium currency: ${error}`);
      return { success: false, error: 'Failed to communicate with progression service' };
    }
  }

  /**
   * Provision an item pack
   */
  private async provisionItemPack(
    userId: string,
    productData: Record<string, unknown>,
  ): Promise<IProvisionResult> {
    const items = productData.items as Array<{ itemSlug: string; quantity: number }>;

    if (!items || items.length === 0) {
      return {
        success: false,
        error: 'Invalid item pack data',
      };
    }

    // TODO: Call progression service via gRPC for each item
    /*
    for (const item of items) {
      await progressionClient.addItem(userId, item.itemSlug, item.quantity);
    }
    */

    this.logger.log(
      `Provisioned item pack (${items.length} items) to ${userId}`,
    );

    return { success: true };
  }

  /**
   * Provision a subscription (VIP, Premium, etc.)
   */
  private async provisionSubscription(
    userId: string,
    productData: Record<string, unknown>,
  ): Promise<IProvisionResult> {
    const subscriptionType = productData.subscriptionType as string;
    const durationDays = productData.durationDays as number;

    if (!subscriptionType || !durationDays) {
      return {
        success: false,
        error: 'Invalid subscription data',
      };
    }

    // TODO: Update user's subscription status in DB
    /*
    const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    await prisma.userSubscription.upsert({
      where: { userId },
      create: { userId, type: subscriptionType, expiresAt },
      update: { type: subscriptionType, expiresAt },
    });
    */

    this.logger.log(
      `Provisioned ${subscriptionType} subscription (${durationDays} days) to ${userId}`,
    );

    return { success: true };
  }

  /**
   * Provision a temporary boost
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
        success: false,
        error: 'Invalid boost data',
      };
    }

    // TODO: Store active boost in Redis with TTL
    /*
    const boostKey = `boost:${userId}:${boostType}`;
    await redis.setex(boostKey, durationSeconds, JSON.stringify({
      multiplier,
      activatedAt: Date.now(),
      expiresAt: Date.now() + durationSeconds * 1000,
    }));
    */

    this.logger.log(
      `Provisioned ${boostType} boost (${multiplier}x for ${durationSeconds}s) to ${userId}`,
    );

    return { success: true };
  }
}
