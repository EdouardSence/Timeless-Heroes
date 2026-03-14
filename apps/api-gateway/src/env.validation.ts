/**
 * Environment variable validation for API Gateway
 * Uses Zod to validate and crash early if required variables are missing.
 * No fallbacks for security-sensitive variables (JWT_SECRET).
 */

import { Logger } from '@nestjs/common';
import { z } from 'zod';

const envSchema = z.object({
  // Optional with sensible defaults
  CORS_ORIGIN: z.string().default('*'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Required — no fallback for security
  JWT_SECRET: z
    .string()
    .min(16, 'JWT_SECRET must be at least 16 characters')
    .refine(
      (val) => val !== 'your-super-secret-jwt-key-change-in-production',
      'JWT_SECRET must be changed from the default placeholder',
    ),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
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
