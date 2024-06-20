import { Module } from '@nestjs/common';
import { HandlerErrorService } from './handler-error.service';

@Module({
  providers: [HandlerErrorService],
  exports: [HandlerErrorService],
})
export class HandlerErrorModule {}
