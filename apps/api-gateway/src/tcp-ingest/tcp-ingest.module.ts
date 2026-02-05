/**
 * TCP Ingest Module
 * NestJS microservice transport for receiving keylogger events
 * 
 * This replaces the raw Node.js TCP server in the keylogger app
 * and provides proper authentication and validation.
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TcpIngestController } from './tcp-ingest.controller';
import { TcpIngestService } from './tcp-ingest.service';
import { TcpAuthGuard } from './tcp-auth.guard';
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
        secret: configService.get<string>('JWT_SECRET', 'your-super-secret-jwt-key'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '7d'),
        },
      }),
    }),
  ],
  controllers: [TcpIngestController],
  providers: [TcpIngestService, TcpAuthGuard, HeuristicAntiCheatService],
  exports: [TcpIngestService],
})
export class TcpIngestModule { }
