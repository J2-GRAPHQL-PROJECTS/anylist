import { registerEnumType } from '@nestjs/graphql';

//todo: implementar enum como Graph enum type
export enum ValidRoles {
  admin = 'admin',
  user = 'user',
  superUser = 'superUser',
}

//! las enumeraciones de typescript no necesitan decorador , solo se tienen que registrar para que graphql lo reconozca
registerEnumType(ValidRoles, {
  name: 'ValidRoles',
  description: `Roles permitidos: user, admin, superUser`,
});
