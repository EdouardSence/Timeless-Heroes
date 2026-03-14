/**
 * Stripe Service
 * Handles Stripe API interactions and webhook processing
 */

import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IProvisionOrderJob, ProductType, QueueName } from '@repo/shared-types';
import { Queue } from 'bullmq';
import Stripe from 'stripe';

import { IdempotencyService } from '../idempotency/idempotency.service';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private readonly stripe: Stripe;
  private readonly webhookSecret: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(QueueName.PROVISION_ORDER)
    private readonly provisionQueue: Queue<IProvisionOrderJob>,
    private readonly idempotencyService: IdempotencyService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY', 'sk_test_...'),
      {
        apiVersion: '2023-10-16',
        typescript: true,
      },
    );

    this.webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
      'whsec_...',
    );
  }

  /**
   * Handle incoming Stripe webhook
   */
  async handleWebhook(rawBody: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;

    try {
      // Verify webhook signature
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (error) {
      this.logger.error(
        `Webhook signature verification failed: ${String(error)}`,
      );
      throw new BadRequestException('Invalid signature');
    }

    this.logger.log(`Received Stripe event: ${event.type} (${event.id})`);

    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded': {
        await this.handlePaymentIntentSucceeded(event.data.object);
        break;
      }

      case 'payment_intent.payment_failed': {
        this.handlePaymentIntentFailed(event.data.object);
        break;
      }

      case 'checkout.session.completed': {
        this.handleCheckoutSessionCompleted(event.data.object);
        break;
      }

      default: {
        this.logger.debug(`Unhandled event type: ${event.type}`);
      }
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(
    paymentIntent: Stripe.PaymentIntent,
  ): Promise<void> {
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);

    const { metadata } = paymentIntent;

    // Validate required metadata
    if (!metadata.userId || !metadata.productType || !metadata.idempotencyKey) {
      this.logger.error(
        `Missing required metadata in payment: ${paymentIntent.id}`,
      );
      return;
    }

    // Create provision order job
    const jobData: IProvisionOrderJob = {
      attemptNumber: 1,
      idempotencyKey: metadata.idempotencyKey,
      productData: metadata.productData
        ? (JSON.parse(metadata.productData) as Record<string, unknown>)
        : {},
      productType: metadata.productType,
      stripePaymentId: paymentIntent.id,
      transactionId: paymentIntent.id,
      userId: metadata.userId,
    };

    // Add to provision queue with retry logic
    await this.provisionQueue.add(`provision-${paymentIntent.id}`, jobData, {
      attempts: 5,
      backoff: {
        delay: 2000, // Start with 2 seconds
        type: 'exponential',
      },
      removeOnComplete: false, // Keep for audit
      removeOnFail: false,
    });

    this.logger.log(`Queued provision order for payment: ${paymentIntent.id}`);
  }

  /**
   * Handle failed payment intent
   */
  private handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): void {
    this.logger.warn(`Payment failed: ${paymentIntent.id}`);

    // Log failure for analytics
    // Could notify user via email/push
  }

  /**
   * Handle completed checkout session
   */
  private handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ): void {
    this.logger.log(`Checkout completed: ${session.id}`);

    // For checkout sessions, the payment_intent.succeeded event
    // will handle the actual provisioning
  }

  /**
   * Create a payment intent for a purchase
   */
  async createPaymentIntent(
    userId: string,
    amountCents: number,
    currency: string,
    productType: ProductType,
    productData: Record<string, unknown>,
  ): Promise<Stripe.PaymentIntent> {
    // Generate idempotency key
    const idempotencyKey = this.idempotencyService.generateKey(
      userId,
      productType,
      amountCents,
    );

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amountCents,
      automatic_payment_methods: {
        enabled: true,
      },
      currency,
      metadata: {
        idempotencyKey,
        productData: JSON.stringify(productData),
        productType,
        userId,
      },
    });

    this.logger.log(
      `Created payment intent: ${paymentIntent.id} for user ${userId}`,
    );

    return paymentIntent;
  }

  /**
   * Create a checkout session for a purchase
   */
  async createCheckoutSession(
    userId: string,
    priceId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      cancel_url: cancelUrl,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: successUrl,
    });

    return session;
  }
}
