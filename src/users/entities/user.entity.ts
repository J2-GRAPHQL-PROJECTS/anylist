import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';

@ObjectType()
export class User {
  // @Field(() => Int, { description: 'Example field (placeholder)' })
  // exampleField: number;
  @Field(() => ID)
  id: string;
  @Field(() => String)
  fullName: string;
  @Field(() => String)
  email: string;
  //El password no se va a exponer en el graphql endpoint
  // @Field(() => String)
  password: string;
  @Field(() => [String])
  roles: string[];
  @Field(() => Boolean)
  isActive: boolean;
  //@Field(() => String, { nullable: true })
  //lastUpdateBy?: string;
  @Field(() => User, { nullable: true })
  lastUpdateBy?: User;

  @Field(() => [Item], { nullable: true }) //Asi no tenga items mostrara un array vacio
  items?: Item[];
}
