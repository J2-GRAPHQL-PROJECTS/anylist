import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DbModule } from 'src/db/db.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [DbModule, ItemsModule],
  exports: [UsersService],
})
export class UsersModule {}
