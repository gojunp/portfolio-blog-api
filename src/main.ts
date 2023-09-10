import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { validate } from '../env-validation';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '../swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const envConfig = validate(process.env);

  setupSwagger(app);

  await app.listen(envConfig.PORT);
}
bootstrap();
