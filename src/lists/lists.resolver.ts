import { ListsService } from './lists.service';
import { List } from './entities/list.entity';
import { CreateListInput } from './dto/create-list.input';
//import { UpdateListInput } from './dto/update-list.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { IdList } from './dto/args/id-list.arg';
import { UpdateListInput } from './dto/update-list.input';
import { ListItem } from 'src/list-item/entities/list-item.entity';
import { ListItemService } from 'src/list-item/list-item.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuard)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly listItemsService: ListItemService,
  ) {}

  @Mutation(() => List)
  //!En mutations si es necesario especificar el nombre de la propiedad en el decorador @Args()
  async createList(
    @Args('createListInput') createListInput: CreateListInput,
    @CurrentUser() currentUser: User,
  ): Promise<List> {
    return await this.listsService.create(currentUser.id, createListInput);
  }

  @Query(() => [List], { name: 'lists' })
  //!En query no es necesario especificar el nombre de la propiedad en el decorador @Args() y los nombres de las propiedades del arg seran los definidos en los ArgsObjectTypes como por ejemplo offset y limit definido en PaginationArgs
  async findAll(
    @CurrentUser() currentUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs,
  ): Promise<List[]> {
    return await this.listsService.findAll(
      currentUser.id,
      paginationArgs,
      searchArgs,
    );
  }

  @Query(() => List, { name: 'list' })
  //! Lo maneje con un ArgsType()
  async findOne(
    //! Tambien se puede hacer de la siguiente manera en @args cuabdo es query sin necesidad de crear un ArgType
    //@Args('id',{type: () => ID},ParseUUIDPipe) idList: string
    @Args() idList: IdList,
    @CurrentUser() currentUser: User,
  ): Promise<List> {
    return await this.listsService.findOne(idList, currentUser.id);
  }

  @Mutation(() => List)
  async updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUser() currentUser: User,
  ): Promise<List> {
    return await this.listsService.update(updateListInput, currentUser.id);
  }

  @Mutation(() => List, {
    name: 'removeList',
    description: 'devuelve el item eliminado',
  })
  async removeItem(
    //! Tambien se puede hacer de la siguiente manera en @args cuabdo es query sin necesidad de crear un ArgType
    //@Args('id',{type: () => ID},ParseUUIDPipe) idList: string
    @Args() idList: IdList,
    @CurrentUser() currentUser: User,
  ): Promise<List> {
    return await this.listsService.remove(idList, currentUser.id);
  }

  @ResolveField(() => Int, { name: 'TotalItemsBylist' })
  async getCountItemsByList(@Parent() list: List): Promise<number> {
    return await this.listItemsService.getTotalItemsByList(list);
  }

  //!Creamos un field personalizado que aparecera como un query con nombre ItemsIncluded se devolvera informacion que correspodera a cada list que tenga en Usuario
  @ResolveField(() => [ListItem], { name: 'ItemsIncluded' })
  async getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
    //@Args() searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    return await this.listItemsService.findAll(
      list,
      paginationArgs,
      //searchArgs,
    );
  }
}
