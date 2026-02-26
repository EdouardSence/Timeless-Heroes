/**
 * Environment Variables Validation
 *
 * Validates required environment variables at application startup.
 * The application will fail fast with clear error messages
 * if any required configuration is missing.
 */

import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

export class EnvironmentVariables {
  /**
   * JWT secret key for signing tokens.
   * MUST be set in production - no fallback allowed.
   */
  @IsString()
  @IsNotEmpty({ message: 'JWT_SECRET is required - set it in your .env file' })
  @MinLength(32, { message: 'JWT_SECRET must be at least 32 characters for security' })
  JWT_SECRET!: string;

  /**
   * JWT token expiration time (e.g., '7d', '24h', '3600s')
   */
  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN?: string = '7d';

  /**
   * NATS server URL for microservice communication
   */
  @IsString()
  @IsOptional()
  NATS_URL?: string = 'nats://localhost:4222';

  /**
   * Redis URL for caching and pub/sub
   */
  @IsString()
  @IsOptional()
  REDIS_URL?: string = 'redis://localhost:6379';

  /**
   * Server port for HTTP/WebSocket
   */
  @IsString()
  @IsOptional()
  PORT?: string = '3000';

  /**
   * WebSocket port (if different from HTTP)
   */
  @IsString()
  @IsOptional()
  WS_PORT?: string;

  /**
   * Node environment
   */
  @IsString()
  @IsOptional()
  NODE_ENV?: string = 'development';
}

/**
 * Validation function for NestJS ConfigModule.
 * Throws descriptive errors if required env vars are missing.
 */
export function validate(config: Record<string, unknown>): EnvironmentVariables {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = Object.values(error.constraints ?? {}).join(', ') || 'Invalid value';
        return `  - ${error.property}: ${constraints}`;
      })
      .join('\n');

    throw new Error(
      `\n\n❌ Environment validation failed:\n${errorMessages}\n\n` +
        `Please check your .env file and ensure all required variables are set.\n`,
    );
  }

  return validatedConfig;
}
