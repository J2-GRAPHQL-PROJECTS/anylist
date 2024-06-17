import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      //! Para api-rest si se tiene en true se hace la validacion de que no se envie campos que no existen en los dto.
      //!En graphql este ya se encarga de hacer esta verificacion
      //forbidNonWhitelisted: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
