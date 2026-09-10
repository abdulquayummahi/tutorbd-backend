// src/tutor/tutor.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorController } from './tutor.controller';
import { TutorService } from './tutor.service';
import { User } from '../entities/user.entity';
import { Application } from '../entities/application.entity';
import { AuthModule } from '../auth/auth.module'; // Required for Guards

@Module({
  imports: [TypeOrmModule.forFeature([User, Application]), AuthModule],
  controllers: [TutorController],
  providers: [TutorService],
})
export class TutorModule {}
