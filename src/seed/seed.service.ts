import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class SeedService {
  private isProd: boolean;
  constructor(
    private readonly configService: ConfigService,
    private readonly dbService: DbService,
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
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
    return true;
  }
  async deleteDatabase() {
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
}
