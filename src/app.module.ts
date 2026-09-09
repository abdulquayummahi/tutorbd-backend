// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TuitionModule } from './tuition/tuition.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Tuition } from './entities/tuition.entity';
import { Application } from './entities/application.entity';

@Module({
  imports: [
    // 1. Loads environment variables (e.g., DB_PASSWORD)
    ConfigModule.forRoot({ isGlobal: true }),

    // 2. Database Connection (PostgreSQL)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      // Inside src/app.module.ts TypeOrmModule.forRoot({...})
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER || 'user123',
      password: process.env.DB_PASSWORD || 'pass123',
      database: process.env.DB_NAME || 'TutorBD_Backend',
      entities: [User, Tuition, Application],
      synchronize: true, // Auto-creates database tables based on your Entities (turn off in actual production)
    }),

    // 3. Bonus Feature: Mailer Setup
    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        auth: { user: 'admin@tutorbd.com', pass: 'securepass' },
      },
    }),

    // 4. Feature Modules (Completing N-Tier Architecture)
    AuthModule,
    TuitionModule,
  ],
})
export class AppModule {}
