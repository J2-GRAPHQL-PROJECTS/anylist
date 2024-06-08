import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { DbModule } from 'src/db/db.module';

@Module({
  providers: [UsersResolver, UsersService],
  imports: [DbModule],
  exports: [UsersService],
})
export class UsersModule {}
