/**
 * Stripe Service
 * Handles Stripe API interactions and webhook processing
 */

import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import Stripe from 'stripe';

import { IProvisionOrderJob, ProductType, QueueName } from '@repo/shared-types';
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
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err}`);
      throw new BadRequestException('Invalid signature');
    }

    this.logger.log(`Received Stripe event: ${event.type} (${event.id})`);

    // Handle specific event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        this.logger.debug(`Unhandled event type: ${event.type}`);
    }
  }

  /**
   * Handle successful payment intent
   */
  private async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    this.logger.log(`Payment succeeded: ${paymentIntent.id}`);

    const { metadata } = paymentIntent;

    // Validate required metadata
    if (!metadata.userId || !metadata.productType || !metadata.idempotencyKey) {
      this.logger.error(`Missing required metadata in payment: ${paymentIntent.id}`);
      return;
    }

    // Create provision order job
    const jobData: IProvisionOrderJob = {
      transactionId: paymentIntent.id,
      userId: metadata.userId,
      stripePaymentId: paymentIntent.id,
      productType: metadata.productType,
      productData: metadata.productData ? JSON.parse(metadata.productData) : {},
      idempotencyKey: metadata.idempotencyKey,
      attemptNumber: 1,
    };

    // Add to provision queue with retry logic
    await this.provisionQueue.add(
      `provision-${paymentIntent.id}`,
      jobData,
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000, // Start with 2 seconds
        },
        removeOnComplete: false, // Keep for audit
        removeOnFail: false,
      },
    );

    this.logger.log(`Queued provision order for payment: ${paymentIntent.id}`);
  }

  /**
   * Handle failed payment intent
   */
  private async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    this.logger.warn(`Payment failed: ${paymentIntent.id}`);

    // Log failure for analytics
    // Could notify user via email/push
  }

  /**
   * Handle completed checkout session
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
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
      currency,
      metadata: {
        userId,
        productType,
        productData: JSON.stringify(productData),
        idempotencyKey,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    this.logger.log(`Created payment intent: ${paymentIntent.id} for user ${userId}`);

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
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    return session;
  }
}
