import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateListItemInput {
  //SI tiene valor por defecto en typescript se define como nulleable en graphql
  @Field(() => Number, { nullable: false })
  @IsNumber()
  @Min(1)
  //@IsOptional()
  quantity: number;
  //SI tiene valor por defecto en typescript se define como nulleable en graphql
  @Field(() => Boolean, { nullable: false })
  @IsBoolean()
  @IsOptional()
  completed: boolean;

  @Field(() => String)
  @IsUUID()
  listId: string;
  @Field(() => String)
  @IsUUID()
  itemId: string;
}
