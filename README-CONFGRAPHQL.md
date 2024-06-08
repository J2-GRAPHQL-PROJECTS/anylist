<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

### Crear Proyecto
```
nest new anylist
```
### Paquetes de Graphql
```
npm i @nestjs/graphql @nestjs/apollo @apollo/server graphql
```
### Creamos el modulo
```
nest generate module helloWorld
```

### creamos el resolver de graphql
```
nest generate resolver helloWorld --no-spec
```


### Import en appModule
```
imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
```
### Para levantar apollo studio
```
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
playground: false,
plugins: [ApolloServerPluginLandingPageLocalDefault()],
```

### Para Instalar class-validator, class-transformer
```
npm install class-validator class-transformer
```

### Instalar variables de entorno
```
npm install @nestjs/config
```
### Import de variables de entorno
```
imports: [ConfigModule.forRoot()]
```

### Instalar paquetes de Passport y JWT
```
npm install @nestjs/passport passport
npm install @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```