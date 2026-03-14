/**
 * Ingest Module (HTTP REST)
 * Receives keylogger events via HTTP endpoints
 * 
 * Provides proper authentication and validation
 * for anonymized key press events.
 */

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { RedisModule } from '../redis/redis.module';

import { HeuristicAntiCheatService } from './heuristic-anti-cheat.service';
import { TcpIngestController } from './tcp-ingest.controller';
import { TcpIngestService } from './tcp-ingest.service';

@Module({
  controllers: [TcpIngestController],
  exports: [TcpIngestService],
  imports: [
    ConfigModule,
    RedisModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
  ],
  providers: [TcpIngestService, HeuristicAntiCheatService],
})
export class TcpIngestModule {}
