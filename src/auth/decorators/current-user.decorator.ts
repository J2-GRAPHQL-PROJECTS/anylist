import {
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  //!roles va a ser de type array de validRoles que es un enum
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    //!Configuramos el context para GraphQl
    //console.log(`roles permitidos en el endpoint [${roles}]`);
    const ctx = GqlExecutionContext.create(context);
    //! req.user lo envia la clase JwtStrategy por medio del metodo validate()
    const user: User = ctx.getContext().req.user;
    //! se puede dar el caso de que no pase por el JwtAuthGuard y el user no se encuentre en la request
    if (!user) {
      throw new InternalServerErrorException(
        `No user inside the request - make sure that we used the AuthGuard`,
      );
    }
    //Si no se recibieron roles en el argumento roles puede seguir usando el endpoint, esto quiere decir  que cualquier privilegio lo puede consultar
    if (roles.length === 0) return user;
    //Me barro los roles que estan en la base de datos para ver si uno de esos roles estan incluidos en el array de roles recibidos en esta funcion.
    //console.log(user.roles);
    for (const role of user.roles) {
      //preguntamos si un role configurado en el usuario esta incluido en la lista de roles que permite el endpoint
      if (roles.includes(role as ValidRoles)) {
        //! Si el usuario existe devolvemos el usuario
        return user;
      }
    }
    throw new ForbiddenException(
      `User ${user.fullName} need a valid rol [${roles}]`,
    );
  },
);
