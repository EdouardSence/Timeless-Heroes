import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ProductType } from '@repo/shared-types';
import { IsEnum, IsInt, IsNotEmpty, IsObject, IsString, Min } from 'class-validator';
import { StripeService } from '../stripe/stripe.service';

export class CreatePaymentIntentDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsInt()
    @Min(1)
    amountCents: number;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsEnum(ProductType)
    productType: ProductType;

    @IsObject()
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
