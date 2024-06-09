import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
//import { ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    //!ConfigModule se usa para las variables de entorno
    ConfigModule.forRoot(),
    //!//! GraphQLModule forRoot Sincrono
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
    //! GraphQLModule forRoot Asincrono
    // GraphQLModule.forRootAsync({
    //   driver: ApolloDriver,
    //   imports: [AuthModule],
    //   inject: [JwtService],

    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   useFactory: async (jwtService: JwtService) => ({
    //     playground: false,
    //     autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //     plugins: [ApolloServerPluginLandingPageLocalDefault],
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     context({ req }) {
    //       // const token = req.headers.authorization?.replace('Bearer ','');
    //       // if ( !token ) throw Error('Token needed');
    //       // const payload = jwtService.decode( token );
    //       // if ( !payload ) throw Error('Token not valid');
    //     },
    //   }),
    // }),

    ItemsModule,
    DbModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
