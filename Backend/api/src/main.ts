import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// BENÖTIGTE IMPORTE HINZUGEFÜGT
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  // APP-TYP GEÄNDERT, UM useStaticAssets() NUTZEN ZU KÖNNEN
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: false });
  
  const allowFixed = new Set([
    'https://join.rahmiesen.de',
    'http://localhost:4200',
  ]);
  const vercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i;
  
  app.enableCors({
    origin: (origin, cb) => {
      if (!origin || allowFixed.has(origin) || vercelPreview.test(origin)) cb(null, true);
      else cb(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    maxAge: 86400,
  });
  
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      const origin = req.headers.origin || '*';
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.setHeader(
        'Access-Control-Allow-Headers',
        req.headers['access-control-request-headers'] || 'Content-Type, Authorization'
      );
      return res.sendStatus(204);
    }
    next();
  });
  
  // VALIDATIONPIPE MIT DEN NÖTIGEN OPTIONEN KONFIGURIERT
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true, // Diese Zeile ist entscheidend!
  }));

  // HINZUGEFÜGT: Stellt den 'uploads'-Ordner unter der URL /uploads bereit
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();