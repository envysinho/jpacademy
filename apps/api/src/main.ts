import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { loadConfig } from './config/config';

async function bootstrap() {
  const config = loadConfig();
  const app = await NestFactory.create(AppModule);
  // CORS abierto solo para desarrollo; restringir orígenes antes de producción.
  app.enableCors();
  await app.listen(config.port);
  console.log(`API escuchando en http://localhost:${config.port}`);
}

void bootstrap();
