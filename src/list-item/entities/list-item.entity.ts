import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Item } from 'src/items/entities/item.entity';
import { List } from 'src/lists/entities/list.entity';
@ObjectType()
export class ListItem {
  @Field(() => ID)
  id: string;
  //Vamos a tener decimales por eso se definio como number
  @Field(() => Number)
  quantity: number;
  @Field(() => Boolean)
  completed: boolean;
  @Field(() => List)
  list: List;
  @Field(() => Item)
  item: Item;
}
