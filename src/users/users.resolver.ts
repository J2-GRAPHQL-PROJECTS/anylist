import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ValidRolArgs } from './dto/args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { UpdateUserInput } from './dto/update-user.input';
import { ItemsService } from 'src/items/items.service';

// import { CreateUserInput } from './dto/create-user.input';
// import { UpdateUserInput } from './dto/update-user.input';

//!Como todos los endpoint retornan un User, le podemos decir al decorador @Resolver que todos los metodos devolveran un User: () => User
@Resolver(() => User)
//!Protegemos todas las rutas con JwtAuthGuard
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  // @Mutation(() => User)
  // createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
  //   return this.usersService.create(createUserInput);
  // }

  @Query(() => [User], { name: 'users' })
  //! ValidRolArgs es un tipo de dato de graphql. en este punto podemos definir un tipo de argumento personalizado dato del tipo Args.

  // async findAll(
  //   @Args('validRoles', { type: () => [String], nullable: true })
  //   validRoles: string[],
  // ): Promise<User[]>
  async findAll(
    @Args() validRoles: ValidRolArgs,
    //!SOlo usuarios con rol admin pueden ingresar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User[]> {
    //console.log(user);
    return await this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  async findOneById(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    //console.log(user);
    return await this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    //console.log(updateUserInput);
    return await this.usersService.update(
      updateUserInput.id,
      updateUserInput,
      user,
    );
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) user: User,
  ): Promise<User> {
    //console.log(user.id);
    return this.usersService.blockUser(id, user);
  }

  //!Creamos un field personazlidado que aparecera como un query con nombre itemCount
  @ResolveField(() => Int, { name: 'itemCount' })
  //!Con el decorador @Parent tenemos acceso a los datos del field que lo contiene, en este caso user
  // query Query {
  //   users {
  //     itemCount
  //     fullName
  //     email
  //   }
  // }
  async itemCount(
    @Parent() user: User,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) adminUser: User,
  ): Promise<number> {
    return await this.itemsService.coutItemByUser(user.id);
  }
}
