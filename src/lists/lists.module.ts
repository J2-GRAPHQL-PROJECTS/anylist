import { Module } from '@nestjs/common';
import { ListsService } from './lists.service';
import { ListsResolver } from './lists.resolver';
import { DbModule } from 'src/db/db.module';
import { HandlerErrorModule } from 'src/handler-error/handler-error.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  providers: [ListsResolver, ListsService],
  imports: [DbModule, HandlerErrorModule, ListItemModule],
  exports: [ListsService],
})
export class ListsModule {}
