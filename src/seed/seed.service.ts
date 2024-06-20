import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { SEED_ITEMS, SEED_LIST, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ItemsService } from 'src/items/items.service';
import { ListsService } from 'src/lists/lists.service';
import { ListItemService } from 'src/list-item/list-item.service';
import { List } from 'src/lists/entities/list.entity';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: DbService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
    private readonly listsService: ListsService,
    private readonly listItemservice: ListItemService,
  ) {
    //solo si STATE es igual a prod isProd sera igual a true.
    this.isProd = configService.get('STATE') === 'prod';
  }
  async executeSeed() {
    if (this.isProd)
      throw new BadGatewayException(`can't execute seed in prod`);
    //todo: borrar todo.
    await this.deleteDatabase();
    //todo: cargar usuarios
    //Capturamos un usuario porque es necesario para crear el item
    const user = await this.loadUsers();
    //todo: cargar items
    await this.loadItems(user.id);

    //todo: cargar listas
    const list = await this.loadList(user.id);
    //console.log({ list });
    //todo: cargar listitems

    const listItemForLoad = await this.itemsService.findAll(
      user.id,
      {
        limit: 15,
        offset: 0,
      },
      {},
    );
    console.log(JSON.stringify(listItemForLoad, null, 2));

    await this.loadListItem(list, listItemForLoad);
    return true;
  }
  async deleteDatabase() {
    await this.dbService.listItem.deleteMany({});
    await this.dbService.list.deleteMany({});
    await this.dbService.item.deleteMany({});
    await this.dbService.user.deleteMany({});
  }

  async loadUsers(): Promise<User> {
    const users = [];

    for (const user of SEED_USERS) {
      const newUser = await this.usersService.create(user);
      users.push(newUser);
    }
    //console.log(users[0]);
    return users[0];
  }
  async loadItems(userId: string): Promise<void> {
    const promiseArray = [];
    SEED_ITEMS.forEach((item) => {
      //sin el await no se ejecuta la promesa pero la promesa se incluye en el array

      //! tuve que enviar el argumento createItemInput como objeto porque me daba conflicto con el campo category que viene en el seed
      promiseArray.push(
        this.itemsService.create(userId, {
          name: item.name,
          quantityUnits: item.quantityUnits,
        }),
      );
    });
    await Promise.all(promiseArray);
  }

  async loadList(userId: string): Promise<List> {
    const list = [];

    for (const listElement of SEED_LIST) {
      const newList = await this.listsService.create(userId, {
        name: listElement.name,
      });
      list.push(newList);
    }
    //console.log(users[0]);
    return list[0];
  }

  async loadListItem(list: List, listItemForLoad: Item[]) {
    listItemForLoad.forEach(async (item) => {
      await this.listItemservice.create({
        quantity: Math.round(Math.random() * 10),
        completed: Math.round(Math.random() * 1) === 1 ? true : false,
        listId: list.id,
        itemId: item.id,
      });
    });
  }
}
