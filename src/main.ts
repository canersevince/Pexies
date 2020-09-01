import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as DotEnv from 'dotenv';
import { urlencoded, json } from 'express'
DotEnv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
