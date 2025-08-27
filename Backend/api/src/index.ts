/* import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'https://join.rahmiesen.de',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap(); */

/* export default function handler(req, res) {
  const message = 'Test erfolgreich: Vercel führt diesen Code aus!';
  console.log(message);
  res.status(200).send(message);
} */

/* import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Dieser Block fängt jeden Absturz während des Startvorgangs ab
  try {
    console.log('[Checkpoint 1] Bootstrap-Funktion gestartet.');

    const app = await NestFactory.create(AppModule);
    console.log('[Checkpoint 2] NestJS-App erfolgreich erstellt.');

    app.enableCors({
      origin: 'https://join.rahmiesen.de',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
    console.log('[Checkpoint 3] CORS aktiviert.');

    app.useGlobalPipes(new ValidationPipe());
    console.log('[Checkpoint 4] Validation Pipes konfiguriert.');

    await app.listen(3000);
    console.log('[Checkpoint 5] App gestartet und hört zu (diese Log-Nachricht erscheint auf Vercel möglicherweise nicht).');

  } catch (error) {
    // Wenn irgendetwas oben schiefgeht, wird dieser Fehler protokolliert!
    console.error('[FATALER ABSTURZ] Ein Fehler ist beim Starten der App aufgetreten:', error);
  }
}

console.log('[Checkpoint 0] Die Datei main.ts wird jetzt ausgeführt.');
bootstrap(); */

export default function handler(req, res) {
  const message = 'Der Index-Test war erfolgreich!';
  res.status(200).send(message);
}