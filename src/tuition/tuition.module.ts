// src/tuition/tuition.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TuitionController } from './tuition.controller';
import { TuitionService } from './tuition.service';
import { Tuition } from '../entities/tuition.entity';
import { Application } from '../entities/application.entity';

@Module({
  // Register the entities so the Service can inject their Repositories
  imports: [TypeOrmModule.forFeature([Tuition, Application])],
  controllers: [TuitionController],
  providers: [TuitionService],
})
export class TuitionModule {}
