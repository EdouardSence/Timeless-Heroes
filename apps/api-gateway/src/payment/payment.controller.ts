import { Body, Controller, HttpCode, HttpStatus, Logger, Post, Req, UseGuards } from '@nestjs/common';
import { ProductType } from '@repo/shared-types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { IsEnum, IsInt, IsNotEmpty, IsObject, IsString, Min } from 'class-validator';

export class CreatePaymentIntentDto {
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
// @UseGuards(JwtAuthGuard) // TODO: Re-enable when frontend auth is ready
export class PaymentController {
    private readonly logger = new Logger(PaymentController.name);

    // Note: Hardcoded for localhost based on your monorepo setup. 
    // In production, use ConfigService to get the internal payment service URL.
    private readonly paymentServiceUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:3003';

    @Post('create-intent')
    @HttpCode(HttpStatus.OK)
    async createIntent(@Req() req: any, @Body() dto: CreatePaymentIntentDto) {
        // Mock user ID for testing until JWT auth is fully connected
        const userId = req.user?.id || 'test_user_123';

        this.logger.log(`Proxying create-intent request for user ${userId} to ${this.paymentServiceUrl}`);

        try {
            const response = await fetch(`${this.paymentServiceUrl}/payments/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    amountCents: dto.amountCents,
                    currency: dto.currency,
                    productType: dto.productType,
                    productData: dto.productData,
                }),
            });

            if (!response.ok) {
                let errorMsg = 'Payment service error';
                try {
                    const errBody = await response.json();
                    errorMsg = errBody.message || errorMsg;
                } catch (e) { }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            this.logger.error(`Failed to create payment intent: ${error}`);
            throw error;
        }
    }
}
