import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serves uploaded photos statically
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // CORS — frontend kiosk (5173, 5175), admin panel (5174) və superadmin panel (5176) üçün
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Gustasto backend running on http://localhost:${port}`);
}
bootstrap();
