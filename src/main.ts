import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as DotEnv from 'dotenv';
DotEnv.config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
