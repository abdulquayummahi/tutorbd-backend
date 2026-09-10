// src/tuition/tuition.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TuitionController } from './tuition.controller';
import { TuitionService } from './tuition.service';
import { Tuition } from '../entities/tuition.entity';
import { Application } from '../entities/application.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // Registering entities for repository injection
    TypeOrmModule.forFeature([Tuition, Application]),
    AuthModule, // Imports AuthModule so JwtAuthGuard can be utilized
  ],
  controllers: [TuitionController],
  providers: [TuitionService],
})
export class TuitionModule {}
