import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: false });

  // 1) CORS: erlaube das konkrete Origin (und alle Previews, falls nötig)
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
    credentials: true, // nur relevant bei Cookies; schadet nicht
    methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
    // Lass allowedHeaders weg -> cors spiegelt automatisch die vom Browser angefragten Header
    maxAge: 86400,
  });

  // 2) Fallback für Preflight (falls irgendein anderes Middleware-Setup dazwischenfunkt)
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

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();