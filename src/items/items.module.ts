import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { DbModule } from 'src/db/db.module';
import { HandlerErrorModule } from 'src/handler-error/handler-error.module';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [DbModule, HandlerErrorModule],
  exports: [ItemsService],
})
export class ItemsModule {}
