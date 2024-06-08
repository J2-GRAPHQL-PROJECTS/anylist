import { IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID)
  //SI no especificamos que es de tipo IsUUID nos va a dar un error
  @IsUUID()
  id: string;
}
