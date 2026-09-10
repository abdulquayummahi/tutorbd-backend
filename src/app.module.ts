// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TuitionModule } from './tuition/tuition.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { StudentModule } from './student/student.module';
import { TutorModule } from './tutor/tutor.module';
import { ModeratorModule } from './moderator/moderator.module';

// Import ALL your entities
import { User } from './entities/user.entity';
import { Tuition } from './entities/tuition.entity';
import { Application } from './entities/application.entity';
import { StudentProfile } from './entities/student-profile.entity';
import { TutorProfile } from './entities/tutor-profile.entity';
import { AdminProfile } from './entities/admin-profile.entity';

// 1. THE FIX: Import the Report entity here
import { Report } from './entities/report.entity';

import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5433),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', '123456'),
        database: configService.get<string>('DB_NAME', 'tutorbd'),

        // 2. THE FIX: Add Report to this entities array!
        entities: [
          User,
          Tuition,
          Application,
          StudentProfile,
          TutorProfile,
          AdminProfile,
          Report, // <-- Added here
        ],

        synchronize: true,
        dropSchema: false, // Reminder: Remove this after the database syncs!
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
    AdminModule,
    StudentModule,
    TutorModule,
    ModeratorModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
