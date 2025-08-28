import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  app.enableCors({
    origin: ['https://join.rahmiesen.de', 'https://*.vercel.app'],
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204, // saubere OPTIONS-Antwort
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
