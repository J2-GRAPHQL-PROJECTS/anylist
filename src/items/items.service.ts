import { Injectable } from '@nestjs/common';
import { CreateItemInput, IdItem, UpdateItemInput } from './dto/';
import { Item } from './entities/item.entity';
import { DbService } from 'src/db/db.service';
import { PaginationArgs, SearchArgs } from 'src/common/dto/args';
import { HandlerErrorService } from 'src/handler-error/handler-error.service';

@Injectable()
export class ItemsService {
  constructor(
    private readonly dbService: DbService,
    private readonly handlerError: HandlerErrorService,
  ) {}

  async create(
    currentUserId: string,
    createItemInput: CreateItemInput,
  ): Promise<Item> {
    const newItem = await this.dbService.item.create({
      data: {
        ...createItemInput,
        user: {
          connect: {
            id: currentUserId,
          },
        },
      },
      include: { user: true },
    });
    return newItem;
  }

  async findAll(
    currentUserId: string,
    paginationArgs: PaginationArgs,
    searchArgs: SearchArgs,
  ): Promise<Item[]> {
    //return `This action returns all items`;
    //console.log(currentUserId);
    //console.log(paginationArgs);

    const { offset, limit } = paginationArgs;
    const { search } = searchArgs;
    // console.log('offset', JSON.stringify(offset, null, 2));
    // console.log('limit', JSON.stringify(limit, null, 2));
    // console.log('search', JSON.stringify(search, null, 2));

    //! si ingresan explicitamente los valores null en los args desde el apolo client causara un error en base de datos por ese motivo hay que hacer la validacion con el operador ternario

    //!Enfoque 1 con rawQuery no optimo
    // const idItems = await this.dbService.$queryRaw<
    //   {
    //     id: string;
    //   }[]
    // >`select id from public."Item" where "userId"=${currentUserId} and lower("name") like ${!search ? '%%' : `%${search}%`} `;
    // console.log(idItems);
    // return await this.dbService.item.findMany({
    //   skip: !offset ? 0 : offset,
    //   take: !limit ? 10 : limit,
    //   // el field in evalua un array
    //   where: { id: { in: idItems.map((row) => row.id) } },
    //   include: { user: true },
    // });

    //!Enfoque 2 100% optimo
    return await this.dbService.item.findMany({
      skip: !offset ? 0 : offset,
      take: !limit ? 10 : limit,
      where: {
        userId: currentUserId,
        name: { contains: !search ? '' : search, mode: 'insensitive' },
      },
      include: { user: true },
    });
  }

  async findOne(idItem: IdItem, currentUserId: string): Promise<Item> {
    try {
      const item = await this.dbService.item.findUniqueOrThrow({
        where: { id: idItem.id, userId: currentUserId },
        include: { user: true },
      });
      // if (!item)
      //   throw new NotFoundException(`Item with id ${idItem.id} not found`);
      return item;
    } catch (error) {
      this.handlerError.handlerErrorException(
        error,
        `Item with id ${idItem.id} not found`,
      );
    }
  }

  async update(
    updateItemInput: UpdateItemInput,
    currentUserId: string,
  ): Promise<Item> {
    //const { id, name, quantity, quantityUnits } = updateItemInput;
    const { id, ...rest } = updateItemInput;
    //envio el argumento como objeto porque yo lo especifique como arg en el resolver caso contrario se enviava como un argumento normal
    await this.findOne({ id: id }, currentUserId);
    const itemUpdated = await this.dbService.item.update({
      where: {
        id: id,
        userId: currentUserId,
      },
      data: {
        ...rest,
      },
      include: { user: true },
    });
    return itemUpdated;
  }

  async remove(idItem: IdItem, currentUserId: string): Promise<Item> {
    //TODO: soft delete, integridad referencial
    await this.findOne({ id: idItem.id }, currentUserId);
    const itemDeleted = await this.dbService.item.delete({
      where: {
        id: idItem.id,
        userId: currentUserId,
      },
      include: { user: true },
    });
    return itemDeleted;
  }
  async countItemByUser(userId: string): Promise<number> {
    return await this.dbService.item.count({ where: { userId } });
  }

  // private handlerErrorException(error: any) {
  //   //console.log({ error });
  //   console.log(error.message);
  //   if (error.code === 'P2025') throw new NotFoundException(`Item not found`);
  // }
}
