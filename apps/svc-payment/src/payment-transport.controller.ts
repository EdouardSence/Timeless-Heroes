/**
 * Payment Transport Controller
 * Redis @MessagePattern handlers called via ClientProxy from API Gateway
 */

import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentCommand, ProductType } from '@repo/shared-types';

import { StripeService } from './stripe/stripe.service';

@Controller()
export class PaymentTransportController {
  private readonly logger = new Logger(PaymentTransportController.name);

  constructor(private readonly stripeService: StripeService) {}

  @MessagePattern(PaymentCommand.CREATE_PAYMENT_INTENT)
  async handleCreatePaymentIntent(
    @Payload()
    data: {
      userId: string;
      amountCents: number;
      currency: string;
      productType: ProductType;
      productData: Record<string, unknown>;
    },
  ) {
    this.logger.debug(`[MQ] createPaymentIntent userId=${data.userId}`);
    const intent = await this.stripeService.createPaymentIntent(
      data.userId,
      data.amountCents,
      data.currency,
      data.productType,
      data.productData,
    );

    // Return serializable subset (Stripe objects have circular refs)
    return {
      amount: intent.amount,
      clientSecret: intent.client_secret,
      currency: intent.currency,
      id: intent.id,
      status: intent.status,
    };
  }

  @MessagePattern(PaymentCommand.CREATE_CHECKOUT_SESSION)
  async handleCreateCheckoutSession(
    @Payload()
    data: {
      userId: string;
      priceId: string;
      successUrl: string;
      cancelUrl: string;
    },
  ) {
    this.logger.debug(`[MQ] createCheckoutSession userId=${data.userId}`);
    const session = await this.stripeService.createCheckoutSession(
      data.userId,
      data.priceId,
      data.successUrl,
      data.cancelUrl,
    );

    return {
      id: session.id,
      url: session.url,
    };
  }

  @MessagePattern(PaymentCommand.GET_PROVISION_STATUS)
  handleGetProvisionStatus(@Payload() data: { transactionId: string }) {
    this.logger.debug(`[MQ] getProvisionStatus txId=${data.transactionId}`);
    // Stub: In production, query the provision status from DB
    return {
      status: 'unknown',
      transactionId: data.transactionId,
    };
  }
}
