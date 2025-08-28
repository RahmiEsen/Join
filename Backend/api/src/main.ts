import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // Kein CORS im Konstruktor, wir steuern es selbst:
  const app = await NestFactory.create(AppModule, { cors: false });

  // Zulässige Origins
  const allowFixed = new Set([
    'https://join.rahmiesen.de',
    'http://localhost:4200',
  ]);
  const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i; // matcht alle Preview-URLs

  app.enableCors({
    origin: (origin, cb) => {
      // origin ist bei Curl/Healthchecks/SSR evtl. undefined → erlauben
      if (!origin || allowFixed.has(origin) || vercelPreview.test(origin)) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization','X-Requested-With'],
    credentials: true,          // nur relevant, wenn du Cookies nutzt
    maxAge: 86400,              // preflight cache
  });

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
