import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { DbService } from 'src/db/db.service';

@Module({
  providers: [ItemsResolver, ItemsService, DbService],
})
export class ItemsModule {}
