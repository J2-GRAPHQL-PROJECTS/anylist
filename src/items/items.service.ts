import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, IdItem, UpdateItemInput } from './dto/';
import { Item } from './entities/item.entity';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ItemsService {
  constructor(private readonly dbService: DbService) {}

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

  async findAll(currentUserId: string): Promise<Item[]> {
    //return `This action returns all items`;
    //console.log(currentUserId);
    return await this.dbService.item.findMany({
      where: { userId: currentUserId },
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
      this.handlerErrorException(error);
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
  async coutItemByUser(userId: string): Promise<number> {
    return await this.dbService.item.count({ where: { userId } });
  }
  private handlerErrorException(error: any) {
    //console.log({ error });
    console.log(error.message);
    if (error.code === 'P2025') throw new NotFoundException(`Item not found`);
  }
}
