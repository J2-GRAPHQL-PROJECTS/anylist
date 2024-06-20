import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ListItemService } from './list-item.service';
import { ListItem } from './entities/list-item.entity';
import { CreateListItemInput } from './dto/create-list-item.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateListItemInput } from './dto/update-list-item.input';
//import { List } from 'src/lists/entities/list.entity';
//import { PaginationArgs } from 'src/common/dto/args';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => ListItem)
@UseGuards(JwtAuthGuard)
export class ListItemResolver {
  constructor(private readonly listItemService: ListItemService) {}

  @Mutation(() => ListItem)
  async createListItem(
    @Args('createListItemInput') createListItemInput: CreateListItemInput,
    //se puede pedir el currentuser para validar
  ): Promise<void | ListItem> {
    return await this.listItemService.create(createListItemInput);
  }

  // @Query(() => [ListItem], { name: 'listItem' })
  // async findAll() {
  //   return await this.listItemService.findAll();
  // }

  @Query(() => ListItem, { name: 'listItem' })
  async findOne(@Args('id', { type: () => String }, ParseUUIDPipe) id: string) {
    return await this.listItemService.findOne(id);
  }

  @Mutation(() => ListItem, { name: 'UpdateListItem' })
  async updateListItem(
    @Args('updateListItemInput') updateListItemInput: UpdateListItemInput,
  ): Promise<ListItem> {
    return await this.listItemService.update(updateListItemInput);
  }

  // @Mutation(() => ListItem)
  // removeListItem(@Args('id', { type: () => Int }) id: number) {
  //   return this.listItemService.remove(id);
  // }
}
