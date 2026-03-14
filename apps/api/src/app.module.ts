import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinksModule } from './links/links.module';


@Module({
  controllers: [AppController],
  imports: [LinksModule],
  providers: [AppService],
})
export class AppModule {}
