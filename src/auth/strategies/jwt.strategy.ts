import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/users/entities/user.entity';
import { JwtPayload } from '../interface/jwt-payload.interface';
import { AuthService } from '../auth.service';
//Como se va a inyectar en un servicio hay que decorar con @Injectable, esta clase sera importada en la opcion providers[] dentro del AuthModule
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    //enviamos los datos al constructor de la clase padre PassportStrategy
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    //console.log({ payload });
    const { id } = payload;
    const user = await this.authService.validateUser(id);
    //console.log(user);
    //! esto devuelver el objeto user a la request Ex: req.user
    return user;
  }
}
