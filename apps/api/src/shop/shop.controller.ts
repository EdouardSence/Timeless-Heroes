
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ShopService } from './shop.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Uncomment when Auth is ready

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('items')
  // @UseGuards(JwtAuthGuard)
  async getItems(@Req() req: any) {
    // Mock user ID if auth not ready
    const userId = req.user?.id || 'default-user-id'; 
    return this.shopService.getShopItems(userId);
  }

  @Post('buy')
  // @UseGuards(JwtAuthGuard)
  async purchaseItem(@Req() req: any, @Body() body: { slug: string }) {
    const userId = req.user?.id || 'default-user-id';
    return this.shopService.purchaseItem(userId, body.slug);
  }
}
