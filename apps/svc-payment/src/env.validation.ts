/**
 * Environment variable validation for Payment Service
 * Uses Zod to validate and crash early if required variables are missing.
 */

import { Logger } from '@nestjs/common';
import { z } from 'zod';

const envSchema = z.object({
  // Optional with sensible defaults
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PAYMENT_PORT: z.coerce.number().int().positive().default(3003),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),

  // Required — Stripe keys
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables at startup.
 * Throws and crashes the process if required variables are missing or invalid.
 */
export function validateEnv(): Env {
  const logger = new Logger('EnvValidation');

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    logger.error('Environment validation failed:');
    for (const issue of result.error.issues) {
      logger.error(`  ${issue.path.join('.')}: ${issue.message}`);
    }
    logger.error('Service cannot start without valid environment variables.');
    throw new Error('Environment validation failed — see logs above');
  }

  logger.log('Environment variables validated successfully');
  return result.data;
}
