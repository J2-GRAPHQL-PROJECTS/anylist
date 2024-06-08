import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { DbModule } from 'src/db/db.module';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  providers: [AuthResolver, AuthService, JwtStrategy],
  imports: [
    //Importamos las variables de entorno
    ConfigModule,
    //Importamos y configuramos el modulo Passport y definimos la estrategia en este caso jwt
    PassportModule.register({ defaultStrategy: 'jwt' }),
    //Importamos y configuramos el modulo JwtModule de manera async porque asi nos aseguramos de leer las variables de entorno.
    //! En AuthService podemos inyectar JwtService
    JwtModule.registerAsync({
      //como JwtModule es un modulo aparte, necesita que importar ConfigModule y ConfigService
      imports: [ConfigModule],
      inject: [ConfigService],
      //Inyectamos la dependencia ConfigService
      useFactory: (configService: ConfigService) => {
        //console.log(configService.get('JWT_SECRET'));
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '4h',
          },
        };
      },
    }),
    DbModule,
    UsersModule,
  ],
  //Para exportar a al mundo exterior exportamos los siguientes modulos de manera completa.
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
