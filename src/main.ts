// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so your Next.js frontend running on port 3000 can communicate with the backend
  app.enableCors();

  // Rubric Requirement 4: Global Validation Pipe
  // This automatically intercepts incoming requests and validates them against our DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties not defined in the DTO
      forbidNonWhitelisted: true, // Throws an error if unexpected data is sent
    }),
  );

  await app.listen(3001);
}
bootstrap();
