import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Item {
  //   @Field(() => Int, { description: 'Example field (placeholder)' })
  //   exampleField: number;
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;
  // @Field(() => Float)
  // quantity: number;
  @Field(() => String, { nullable: true })
  quantityUnits?: string; //g,ml,kg,tsp

  @Field(() => User, { nullable: true })
  user?: User;
  listItem?: ListItem[];
}
