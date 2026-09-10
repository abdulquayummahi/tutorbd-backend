// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ENABLE CORS: Allows Next.js (Frontend) to communicate with NestJS (Backend)
  app.enableCors({
    origin: 'http://localhost:7000', // Your Next.js frontend URL
    credentials: true,
  });

  // 2. Global Validation Pipe (Rubric Req 4)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Starts the backend server on port 3001
  await app.listen(3001);
}
bootstrap();
