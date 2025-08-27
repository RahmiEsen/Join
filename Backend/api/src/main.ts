import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://join.rahmiesen.de',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.init();
  return app.getHttpAdapter().getInstance();
}

/**
 * Lokaler Start mit "npm run start:dev"
 * Nur ausführen, wenn NICHT auf Vercel
 */
if (process.env.VERCEL !== '1') {
  bootstrap().then(app => {
    app.listen(3000, () => {
      console.log(`🚀 Backend running on http://localhost:3000`);
    });
  });
}

/**
 * Export für Vercel (Serverless)
 */
export default async function handler(req: any, res: any) {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }
  return cachedServer(req, res);
}
