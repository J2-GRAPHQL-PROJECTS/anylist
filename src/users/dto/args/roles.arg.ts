import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

//!Primero le decimos a Graphql que es un tipo de dato personalizado de argumento  del tipo ArgsType
@ArgsType()
export class ValidRolArgs {
  //! es necesario que validRoles este registrado como una enumeracion en graphql
  @Field(() => [ValidRoles], { nullable: true })
  @IsArray()
  roles: ValidRoles[] = [];
}
