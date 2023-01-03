import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const ENV=process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ENV.SERVER_PORT);
}
bootstrap();
