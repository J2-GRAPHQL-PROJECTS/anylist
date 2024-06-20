import { Injectable } from '@nestjs/common';

//import { UpdateListInput } from './dto/update-list.input';
import { CreateListInput } from './dto/create-list.input';
import { DbService } from 'src/db/db.service';
import { List } from './entities/list.entity';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { IdList } from './dto/args/id-list.arg';
import { UpdateListInput } from './dto/update-list.input';
import { HandlerErrorService } from 'src/handler-error/handler-error.service';

@Injectable()
export class ListsService {
  constructor(
    private readonly dbService: DbService,
    private readonly handlerError: HandlerErrorService,
  ) {}
  async create(
    currentUserId: string,
    createListInput: CreateListInput,
  ): Promise<List> {
    const newList = await this.dbService.list.create({
      data: {
        ...createListInput,
        user: {
          connect: {
            id: currentUserId,
          },
        },
      },
      include: {
        user: true,
      },
    });
    return newList;
  }

  async findAll(
    currentUserId: string,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<List[]> {
    const { offset, limit } = paginationArgs;
    const { search } = searchArgs;
    return await this.dbService.list.findMany({
      skip: !offset ? 0 : offset,
      take: !limit ? 10 : limit,
      where: {
        userId: currentUserId,
        name: { contains: !search ? '' : search, mode: 'insensitive' },
      },
      include: { user: true },
    });
  }

  async findOne(idList: IdList, currentUserId: string): Promise<List> {
    try {
      return await this.dbService.list.findUniqueOrThrow({
        where: { id: idList.id, userId: currentUserId },
        include: { user: true },
      });
    } catch (error) {
      this.handlerError.handlerErrorException(
        error,
        `List withd id ${idList.id} not found`,
      );
    }
  }

  async update(
    updateListInput: UpdateListInput,
    currentUserId: string,
  ): Promise<List> {
    try {
      const { id, ...rest } = updateListInput;
      await this.findOne({ id }, currentUserId);
      return this.dbService.list.update({
        where: { id: id, userId: currentUserId },
        data: { ...rest },
        include: { user: true },
      });
    } catch (error) {
      this.handlerError.handlerErrorException(error, 'Error al actualizar');
    }
  }

  async remove(idList: IdList, currentUserId: string): Promise<List> {
    //TODO: soft delete, integridad referencial
    await this.findOne({ id: idList.id }, currentUserId);
    const listDeleted = await this.dbService.list.delete({
      where: {
        id: idList.id,
        userId: currentUserId,
      },
      include: { user: true },
    });
    return listDeleted;
  }

  async countListByUser(userId: string): Promise<number> {
    return await this.dbService.list.count({ where: { userId } });
  }
}
