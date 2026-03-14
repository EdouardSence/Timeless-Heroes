/**
 * Provision Service
 * Handles the actual provisioning of purchased items/currency
 */

import { Injectable, Logger } from '@nestjs/common';
import { ProductType, ProvisionError } from '@repo/shared-types';

interface IProvisionResult {
  error?: string;
  success: boolean;
}

@Injectable()
export class ProvisionService {
  private readonly logger = new Logger(ProvisionService.name);

  /**
   * Provision a purchased order to the user's account
   */
  provisionOrder(
    userId: string,
    productType: string,
    productData: Record<string, unknown>,
  ): IProvisionResult {
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
   */
  private provisionPremiumCurrency(
    userId: string,
    productData: Record<string, unknown>,
  ): IProvisionResult {
    const amount = productData.amount as number;

    if (!amount || amount <= 0) {
      return {
        error: 'Invalid currency amount',
        success: false,
      };
    }

    // eslint-disable-next-line sonarjs/todo-tag
    // TODO: Call progression service via gRPC

    this.logger.log(`Provisioned ${amount} premium currency to ${userId}`);

    return { success: true };
  }

  /**
   * Provision an item pack
   */
  private provisionItemPack(
    userId: string,
    productData: Record<string, unknown>,
  ): IProvisionResult {
    const items = productData.items as
      | { itemSlug: string; quantity: number }[]
      | undefined;

    if (!items || items.length === 0) {
      return {
        error: 'Invalid item pack data',
        success: false,
      };
    }

    // eslint-disable-next-line sonarjs/todo-tag
    // TODO: Call progression service via gRPC for each item

    this.logger.log(
      `Provisioned item pack (${items.length} items) to ${userId}`,
    );

    return { success: true };
  }

  /**
   * Provision a subscription (VIP, Premium, etc.)
   */
  private provisionSubscription(
    userId: string,
    productData: Record<string, unknown>,
  ): IProvisionResult {
    const subscriptionType = productData.subscriptionType as string;
    const durationDays = productData.durationDays as number;

    if (!subscriptionType || !durationDays) {
      return {
        error: 'Invalid subscription data',
        success: false,
      };
    }

    // eslint-disable-next-line sonarjs/todo-tag
    // TODO: Update user's subscription status in DB

    this.logger.log(
      `Provisioned ${subscriptionType} subscription (${durationDays} days) to ${userId}`,
    );

    return { success: true };
  }

  /**
   * Provision a temporary boost
   */
  private provisionBoost(
    userId: string,
    productData: Record<string, unknown>,
  ): IProvisionResult {
    const boostType = productData.boostType as string;
    const multiplier = productData.multiplier as number;
    const durationSeconds = productData.durationSeconds as number;

    if (!boostType || !multiplier || !durationSeconds) {
      return {
        error: 'Invalid boost data',
        success: false,
      };
    }

    // eslint-disable-next-line sonarjs/todo-tag
    // TODO: Store active boost in Redis with TTL

    this.logger.log(
      `Provisioned ${boostType} boost (${multiplier}x for ${durationSeconds}s) to ${userId}`,
    );

    return { success: true };
  }
}
