import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthResponse } from './types/auth-response.type';
import { DbService } from '../db/db.service';
//import { User } from 'src/users/entities/user.entity';
import { SignupInput, SigninInput } from './dto/inputs';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
@Injectable()
export class AuthService {
  constructor(
    private readonly dbService: DbService,
    private readonly usersService: UsersService,
    //Como en AuthModule importamos JwtModule en esta clase podemos usar JwtService que ya incluye la configuracion hecha en JwtModule
    private readonly jwtService: JwtService,
  ) {}
  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    //console.log(singupInput);
    //!creamos el usuario usando la dependencia de usersService
    const newUser = await this.usersService.create(signupInput);
    const token = this.generateJwtToken({ id: newUser.id });
    return {
      token: token,
      //user: new User(),
      user: newUser,
    };
    //throw new Error(`Method not implemented`);
  }
  async signin(signinInput: SigninInput): Promise<AuthResponse> {
    //console.log(signinInput);
    //!buscamos el usuario usando la dependencia de usersService
    const { email, password } = signinInput;
    const user = await this.usersService.findOneByEmail(email);

    //!Comparar password
    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException(`Password is invalid.`);
    }

    const token = this.generateJwtToken({ id: user.id });
    return {
      token: token,
      //user: new User(),
      user: user,
    };
    //throw new Error(`Method not implemented`);
  }
  private generateJwtToken(payload: { id: string }): string {
    //console.log(payload);
    const token = this.jwtService.sign(payload);
    return token;
  }
  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user.isActive) throw new UnauthorizedException(`user is inactive`);
    //!intente hacerlo con rest pero no me funciono.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //const { password, ...rest } = user;
    //return { ...rest };
    //delete user.password;
    return user;
  }
  //!no hay metodos asyncronos en esta funcion
  revalidateToken(user: User): AuthResponse {
    const newToken = this.generateJwtToken({ id: user.id });
    return {
      user: user,
      token: newToken,
    };
  }
}
