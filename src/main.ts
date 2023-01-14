import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const ENV=process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    },"access-token")
    .setTitle('AniShorts example')
    .setDescription('AniShorts API description')
    .setVersion('1.0')
    .addTag('AniShorts')
    .build()
  app.enableCors({
    origin: true,//여기에 url을 넣어도된다. 
    credentials: true,
  });
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  await app.listen(ENV.SERVER_PORT);
}
bootstrap();
