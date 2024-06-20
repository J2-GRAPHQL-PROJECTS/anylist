import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { User } from 'src/users/entities/user.entity';
@ObjectType()
export class List {
  @Field(() => ID)
  id: string;
  @Field(() => String)
  name: string;
  @Field(() => User, { nullable: true })
  user?: User;
  listItem?: ListItem[];
}
