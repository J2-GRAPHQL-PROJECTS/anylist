import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignupInput, SigninInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
//import { validRoles } from './enums/valid-roles.enum';

//!Como todos los endpoint retornan un AuthResponse, le podemos decir al decorador @Resolver que todos los metodos devolveran un AuthResponse: () => AuthResponse
@Resolver(() => User)
@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => AuthResponse, { name: 'signup' })
  async signUp(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<AuthResponse> {
    return await this.authService.signup(signupInput);
  }

  @Mutation(() => AuthResponse, { name: 'signin' })
  async signIn(
    @Args('signinInput') singinInput: SigninInput,
  ): Promise<AuthResponse> {
    return await this.authService.signin(singinInput);
  }

  // @Mutation(() => String,{name:'revalidate'})
  @Query(() => AuthResponse, { name: 'revalidate' })
  //! Tenemos que usar JwtAuthGuard (que es una implementacion personalizada basada en AuthGuard) porque para GraphQl AuthGuard de  @nestjs/passport no funciona igual
  //! JwtAuthGuard finalmente siempre va buscar y a ejecutar el metodo validate() de la clase JwtStrategy que extiende PassportStrategy()
  //@UseGuards(AuthGuard)
  @UseGuards(JwtAuthGuard)
  //!obtenemos el user con el decorador personalizado CurrentUser() que a su vez se alimenta del Guard JwtAuthGuard().

  //! el decorador @CurrentUser va a recibir como argumente un array de validRoles
  revalidate(
    @CurrentUser() //[validRoles.admin, validRoles.superUser]
    user: User,
  ): AuthResponse {
    //console.log(user);
    //throw new Error(`Method no implemented`);
    return this.authService.revalidateToken(user);
  }
}
