/**
 * Stripe Webhook Controller
 * Receives and validates Stripe webhooks
 */

import {
    BadRequestException,
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Logger,
    Post,
    RawBodyRequest,
    Req,
} from '@nestjs/common';
import { Request } from 'express';

import { StripeService } from './stripe.service';

@Controller('webhooks')
export class StripeWebhookController {
  private readonly logger = new Logger(StripeWebhookController.name);
  
  constructor(private readonly stripeService: StripeService) {}
  
  /**
   * Stripe Webhook Endpoint
   * POST /webhooks/stripe
   * 
   * IMPORTANT: This endpoint receives raw body for signature verification
   */
  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ): Promise<{ received: boolean }> {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    
    const rawBody = request.rawBody;
    if (!rawBody) {
      throw new BadRequestException('Missing request body');
    }
    
    try {
      // Verify and process the webhook
      await this.stripeService.handleWebhook(rawBody, signature);
      
      return { received: true };
    } catch (error) {
      this.logger.error(`Webhook processing failed: ${error}`);
      throw error;
    }
  }
}
