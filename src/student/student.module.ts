// src/student/student.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { User } from '../entities/user.entity';
import { Tuition } from '../entities/tuition.entity';
import { Application } from '../entities/application.entity';
import { AuthModule } from '../auth/auth.module'; // Required for JwtAuthGuard

@Module({
  imports: [TypeOrmModule.forFeature([User, Tuition, Application]), AuthModule],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
