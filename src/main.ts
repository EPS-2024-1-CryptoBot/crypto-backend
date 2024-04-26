import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { fetchConfig } from './app.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const port = fetchConfig('app', 'port');

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}
bootstrap();
