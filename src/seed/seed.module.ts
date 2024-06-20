import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';
import { UsersModule } from 'src/users/users.module';
import { ItemsModule } from 'src/items/items.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from 'src/db/db.module';
import { ListsModule } from 'src/lists/lists.module';
import { ListItemModule } from 'src/list-item/list-item.module';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [
    UsersModule,
    DbModule,
    ItemsModule,
    ConfigModule,
    ListsModule,
    ListItemModule,
  ],
})
export class SeedModule {}
