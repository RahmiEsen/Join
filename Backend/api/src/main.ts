import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

let cachedServer: any;

async function createServer() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'https://join.rahmiesen.de',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });
  
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://join.rahmiesen.de');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });
  
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  return app.getHttpAdapter().getInstance();
}

if (process.env.VERCEL !== '1') {
  createServer().then(server => {
    server.listen(3000, () => console.log('🚀 http://localhost:3000'));
  });
}

export default async function handler(req: any, res: any) {
  if (!cachedServer) cachedServer = await createServer();
  return cachedServer(req, res);
}