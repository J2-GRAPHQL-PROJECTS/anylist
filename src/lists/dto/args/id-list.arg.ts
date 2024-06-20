import { ArgsType, Field, ID } from '@nestjs/graphql';
import { IsString, IsUUID } from 'class-validator';
//!Decorator that marks a class as a resolver arguments type.
@ArgsType()
export class IdList {
  @Field(() => ID, {
    description: 'value of field Id',
  })
  //! Lo decoramos con class-validator y class-transformer
  @IsString()
  @IsUUID()
  id: string;
}
