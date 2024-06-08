import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput, IdItem } from './dto/';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(): Promise<Item[]> {
    return await this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'findOneItem' })
  //@Args('id', { type: () => ID }, ParseUUIDPipe ) id: string
  //! Lo maneje con un ArgsType()
  findOne(@Args() idItem: IdItem): Promise<Item> {
    return this.itemsService.findOne(idItem);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    //return this.itemsService.update(updateItemInput.id, updateItemInput);
    console.log(updateItemInput);
    return await this.itemsService.update(updateItemInput);
  }

  @Mutation(() => Item, {
    name: 'removeItem',
    description: 'devuelve el item eliminado',
  })
  async removeItem(@Args() idItem: IdItem): Promise<Item> {
    return await this.itemsService.remove(idItem);
  }
}
