import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProductType } from '@repo/shared-types';
import { StripeService } from '../stripe/stripe.service';

export class CreatePaymentIntentDto {
    userId: string;
    amountCents: number;
    currency: string;
    productType: ProductType;
    productData: Record<string, unknown>;
}

@Controller('payments')
export class PaymentController {
    constructor(private readonly stripeService: StripeService) { }

    @Post('create-intent')
    @HttpCode(HttpStatus.OK)
    async createIntent(@Body() dto: CreatePaymentIntentDto) {
        const paymentIntent = await this.stripeService.createPaymentIntent(
            dto.userId,
            dto.amountCents,
            dto.currency,
            dto.productType,
            dto.productData,
        );

        return {
            clientSecret: paymentIntent.client_secret,
        };
    }
}
