import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';
import { CreateItemInput, UpdateItemInput, IdItem } from './dto/';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
@Resolver(() => Item)
@UseGuards(JwtAuthGuard)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Mutation(() => Item)
  async createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return this.itemsService.create(currentUser.id, createItemInput);
  }

  @Query(() => [Item], { name: 'items' })
  async findAll(@CurrentUser() currentUser: User): Promise<Item[]> {
    return await this.itemsService.findAll(currentUser.id);
  }

  @Query(() => Item, { name: 'findOneItem' })
  //@Args('id', { type: () => ID }, ParseUUIDPipe ) id: string
  //! Lo maneje con un ArgsType()
  findOne(
    @Args() idItem: IdItem,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return this.itemsService.findOne(idItem, currentUser.id);
  }

  @Mutation(() => Item)
  async updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    //return this.itemsService.update(updateItemInput.id, updateItemInput);
    //console.log(updateItemInput);
    return await this.itemsService.update(updateItemInput, currentUser.id);
  }

  @Mutation(() => Item, {
    name: 'removeItem',
    description: 'devuelve el item eliminado',
  })
  async removeItem(
    @Args() idItem: IdItem,
    @CurrentUser() currentUser: User,
  ): Promise<Item> {
    return await this.itemsService.remove(idItem, currentUser.id);
  }
}
