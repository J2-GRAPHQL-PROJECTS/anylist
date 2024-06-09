import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
// import { CreateUserInput } from './dto/create-user.input';
// import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SignupInput } from '../auth/dto/inputs/signup.input';
import { DbService } from 'src/db/db.service';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}
  private logger = new Logger('UserServices');
  async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = await this.dbService.user.create({
        data: {
          ...signupInput,
          password: bcrypt.hashSync(signupInput.password, 10),
        },
      });
      //console.log(newUser);
      return newUser;
    } catch (error) {
      this.errorMessageHandler(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    // SI no especifico ningun rol en particular se van a mostrar todos los usuarios
    if (roles.length === 0)
      return await this.dbService.user.findMany({
        include: { lastUpdateBy: true, items: true },
      });
    // en este punto si podemos tener roles ['user','admin','superUser']
    //todo hacer el query con arrays
    const users = await this.dbService.user.findMany({
      where: {
        roles: {
          //hacemos spread de roles: ['user','admin','superUser']
          //con has some al menos un elemento de roles tiene que estar incluido en el campo tipo array roles
          hasSome: [...roles],
        },
      },
      include: { lastUpdateBy: true, items: true },
    });
    return users;
  }

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.dbService.user.findUnique({
        where: {
          id,
        },
        include: { lastUpdateBy: true },
      });
      if (!user) throw Error;
      return user;
    } catch (error) {
      //this.errorMessageHandler(error);
      // throw new NotFoundException({
      //   code: 'NOT-FOUND',
      //   message: `User with id ${id} dosn't exist`,
      // });
      throw new NotFoundException(`User with id ${id} dosn't exist`);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      const user = await this.dbService.user.findUnique({
        where: {
          email,
        },
        //include: { lastUpdateBy: true, items: { include: { user: true } } },
        include: { lastUpdateBy: true },
      });
      if (!user) throw Error;
      return user;
    } catch (error) {
      // this.errorMessageHandler({cod: `123`,detail: `${email} not found`});
      //this.errorMessageHandler(error);
      throw new NotFoundException(`User with email ${email} dosn't exist`);
    }
  }

  async update(
    id: string,
    updateUserInput: UpdateUserInput,
    adminUser: User,
  ): Promise<User> {
    console.log('UpdateDto', updateUserInput);
    await this.findOneById(id);
    try {
      const updateUser = await this.dbService.user.update({
        where: {
          id: id,
        },
        data: {
          ...updateUserInput,
          lastUpdateBy: {
            connect: {
              id: adminUser.id,
            },
          },
        },
        include: { lastUpdateBy: true },
      });
      return updateUser;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`Please check server logs`);
    }
  }

  async blockUser(id: string, adminUser: User): Promise<User> {
    try {
      //este metodo ya maneja la excepcion si no encuentra el usuario
      await this.findOneById(id);

      const userUpdated = await this.dbService.user.update({
        where: {
          id: id,
        },
        data: {
          isActive: false,
          lastUpdateBy: {
            connect: {
              id: adminUser.id,
            },
          },
        },
        include: { lastUpdateBy: true },
      });
      console.log(userUpdated);
      // const test = await this.dbService.user.findUniqueOrThrow({
      //   where: {
      //     id: id,
      //   },
      //   include: { admin: true },
      // });

      //console.log('test', test);

      return userUpdated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(`Please check server logs`);
    }
  }
  private errorMessageHandler(error: any) {
    //console.log(error.response);
    if (error.code === 'P2002') {
      throw new BadRequestException(error.meta);
    }
    if (error.response.code === 'NOT-FOUND') {
      throw new NotFoundException(error.response.message);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Please check server logs`);
  }
}
