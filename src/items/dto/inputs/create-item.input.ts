import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
  //! @Field() decorator is used to mark a specific class property as a GraphQL field. Only properties decorated with this decorator will be defined in the schema.
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
  @Field(() => Float)
  @IsPositive()
  quantity: number;
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  quantityUnits?: string;
}
