
import { Module } from '@nestjs/common';
import { ShopController } from './shop.controller';
import { ShopService } from './shop.service';
// import { PrismaModule } from '@repo/prisma-client'; // Shared module

@Module({
  imports: [
    // PrismaModule, 
  ],
  controllers: [ShopController],
  providers: [
    ShopService,
    // Provide a mock/real client if module not available yet
    /*
    {
      provide: 'PRISMA_CLIENT',
      useClass: PrismaClient,
    }
    */
  ],
  exports: [ShopService],
})
export class ShopModule {}
