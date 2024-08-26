import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //?MOSTRAR CON LINDO FORMATO EL PORT
  const logger = new Logger('NestApplication');


  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

  await app.listen(process.env.PORT || 3000);
  logger.log(`Application is running on port: ${process.env.PORT}`);
}
bootstrap();
