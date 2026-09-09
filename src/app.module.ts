// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TuitionModule } from './tuition/tuition.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { Tuition } from './entities/tuition.entity';
import { Application } from './entities/application.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // THE FIX: Use forRootAsync and inject ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgresql'),
        // Fetches your actual password from the .env file dynamically
        password: configService.get<string>('DB_PASSWORD', '123456'),
        database: configService.get<string>('DB_NAME', 'tutorbd'),
        entities: [User, Tuition, Application],
        synchronize: true,
      }),
    }),

    MailerModule.forRoot({
      transport: {
        host: 'smtp.example.com',
        auth: { user: 'admin@tutorbd.com', pass: 'securepass' },
      },
    }),

    AuthModule,
    TuitionModule,
  ],
})
export class AppModule {}
