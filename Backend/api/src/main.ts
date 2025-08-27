import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

// Dies stellt sicher, dass die App nur einmal gestartet wird (wichtig für serverless)
let cachedServer: any;

async function bootstrap(): Promise<any> {
  if (!cachedServer) {
    const expressApp = express();
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    // Hier kommt deine wichtige CORS-Einstellung rein
    nestApp.enableCors({
      origin: 'https://join.rahmiesen.de',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    await nestApp.init();
    cachedServer = expressApp;
  }
  return cachedServer;
}

// Exportiere die Funktion, damit Vercel sie aufrufen kann
export default async (req, res) => {
  const server = await bootstrap();
  server(req, res);
};