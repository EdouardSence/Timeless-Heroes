/**
 * Ingest Module (HTTP REST)
 * Receives keylogger events via HTTP endpoints
 * 
 * Provides proper authentication and validation
 * for anonymized key press events.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TcpIngestController } from './tcp-ingest.controller';
import { TcpIngestService } from './tcp-ingest.service';
import { HeuristicAntiCheatService } from './heuristic-anti-cheat.service';
import { RedisModule } from '../redis/redis.module';

@Module({
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
  controllers: [TcpIngestController],
  providers: [TcpIngestService, HeuristicAntiCheatService],
  exports: [TcpIngestService],
})
export class TcpIngestModule { }
