import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { fetchConfig } from './app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = fetchConfig('app', 'port');

  await app.listen(port);
}
bootstrap();
