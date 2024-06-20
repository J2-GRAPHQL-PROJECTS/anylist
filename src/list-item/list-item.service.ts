import { Injectable } from '@nestjs/common';
import { CreateListItemInput } from './dto/create-list-item.input';
import { DbService } from 'src/db/db.service';
import { ListItem } from './entities/list-item.entity';
import { HandlerErrorService } from '../handler-error/handler-error.service';
import { List } from 'src/lists/entities/list.entity';
import { PaginationArgs } from 'src/common/dto/args';
import { UpdateListItemInput } from './dto/update-list-item.input';
//import { PaginationArgs, SearchArgs } from 'src/common/dto/args';

@Injectable()
export class ListItemService {
  constructor(
    private readonly dbService: DbService,
    private readonly handlerErrorService: HandlerErrorService,
  ) {}
  async create(
    createListItemInput: CreateListItemInput,
  ): Promise<ListItem | void> {
    const { listId, itemId, ...rest } = createListItemInput;
    try {
      return this.dbService.listItem.create({
        data: {
          ...rest,
          item: { connect: { id: itemId } },
          list: { connect: { id: listId } },
        },
        include: { item: true, list: true },
      });
    } catch (error) {
      return this.handlerErrorService.handlerErrorException(
        error,
        'Error on create listitem',
      );
    }
  }

  async findAll(
    list: List,
    paginationArgs: PaginationArgs,
    //searchArgs: SearchArgs,
  ): Promise<ListItem[]> {
    // return this.dbService.listItem.findMany({
    //   where: {
    //     list: { id: list.id },
    //   },
    //   include: { item: true, list: true },
    // });

    const { offset, limit } = paginationArgs;
    //const { search } = searchArgs;

    return await this.dbService.listItem.findMany({
      skip: !offset ? 0 : offset,
      take: !limit ? 10 : limit,
      where: {
        //list: { id: list.id },
        listId: list.id,
        //name: { contains: !search ? '' : search, mode: 'insensitive' },
      },

      include: { item: true, list: true },
    });
  }

  async getTotalItemsByList(list: List): Promise<number> {
    return this.dbService.listItem.count({ where: { list: { id: list.id } } });
  }

  async findOne(id: string): Promise<ListItem> {
    try {
      return await this.dbService.listItem.findFirstOrThrow({
        where: {
          id: id,
        },
        include: { item: true, list: true },
      });
    } catch (error) {
      this.handlerErrorService.handlerErrorException(
        error,
        `List item with id ${id} not found`,
      );
    }
  }

  async update(updateListItemInput: UpdateListItemInput): Promise<ListItem> {
    console.log(updateListItemInput);
    const { id, ...rest } = updateListItemInput;
    return await this.dbService.listItem.update({
      where: {
        id: id,
      },
      data: { ...rest },
      include: { list: true, item: true },
    });
  }

  // remove(id: number) {
  //   return `This action removes a #${id} listItem`;
  // }
}
