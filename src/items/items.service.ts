import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemInput, IdItem, UpdateItemInput } from './dto/';
import { Item } from './entities/item.entity';
import { DbService } from 'src/db/db.service';

@Injectable()
export class ItemsService {
  constructor(private readonly dbService: DbService) {}
  async create(createItemInput: CreateItemInput): Promise<Item> {
    const newItem = await this.dbService.item.create({ data: createItemInput });
    return newItem;
  }

  async findAll(): Promise<Item[]> {
    //return `This action returns all items`;
    return await this.dbService.item.findMany();
  }

  async findOne(idItem: IdItem): Promise<Item> {
    const item = await this.dbService.item.findUnique({
      where: { id: idItem.id },
    });
    if (!item)
      throw new NotFoundException(`Item with id ${idItem.id} not found`);
    return item;
  }

  async update(updateItemInput: UpdateItemInput): Promise<Item> {
    //const { id, name, quantity, quantityUnits } = updateItemInput;
    const { id, ...rest } = updateItemInput;
    //envio el argumento como objeto porque yo lo especifique como arg en el resolver caso contrario se enviava como un argumento normal
    await this.findOne({ id: id });
    const itemUpdated = await this.dbService.item.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
      },
    });
    return itemUpdated;
  }

  async remove(idItem: IdItem): Promise<Item> {
    //TODO: soft delete, integridad referencial
    await this.findOne({ id: idItem.id });
    const itemDeleted = await this.dbService.item.delete({
      where: {
        id: idItem.id,
      },
    });
    return itemDeleted;
  }
}
