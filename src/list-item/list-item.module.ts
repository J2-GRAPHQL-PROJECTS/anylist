import { Module } from '@nestjs/common';
import { ListItemService } from './list-item.service';
import { ListItemResolver } from './list-item.resolver';
import { DbModule } from 'src/db/db.module';
import { HandlerErrorModule } from 'src/handler-error/handler-error.module';

@Module({
  providers: [ListItemResolver, ListItemService],
  imports: [DbModule, HandlerErrorModule],
  exports: [ListItemService],
})
export class ListItemModule {}
