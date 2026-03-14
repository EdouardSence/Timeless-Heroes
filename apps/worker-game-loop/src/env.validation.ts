/**
 * Environment variable validation for Worker Game Loop
 * Uses Zod to validate and crash early if required variables are missing.
 */

import { Logger } from '@nestjs/common';
import { z } from 'zod';

const envSchema = z.object({
  // Required — database connection
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Optional with sensible defaults
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_PORT: z.coerce.number().int().positive().default(6379),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5),
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
