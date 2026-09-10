// src/moderator/moderator.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModeratorController } from './moderator.controller';
import { ModeratorService } from './moderator.service';
import { Tuition } from '../entities/tuition.entity';
import { TutorProfile } from '../entities/tutor-profile.entity';
import { Report } from '../entities/report.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tuition, TutorProfile, Report]),
    AuthModule,
  ],
  controllers: [ModeratorController],
  providers: [ModeratorService],
})
export class ModeratorModule {}
