import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
@ObjectType()
export class AuthResponse {
  @Field(() => String)
  token: string;
  //User es un objectType
  @Field(() => User)
  //El password no se va a mostrar porque no es un campo de Graphql
  user: User;
}
