import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Item {
  //   @Field(() => Int, { description: 'Example field (placeholder)' })
  //   exampleField: number;
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
  @Field(() => Float)
  quantity: number;

  @Field(() => String, { nullable: true })
  quantityUnits?: string; //g,ml,kg,tsp
}
