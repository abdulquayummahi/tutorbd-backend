// src/auth/auth.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterTutorDto, RegisterStudentDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async registerStudent(dto: RegisterStudentDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    // Enterprise Creation: Map data to the base table AND the related profile table
    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      role: 'student',
      phone: dto.phone,
      address: dto.address,
      studentProfile: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        gradeLevel: dto.gradeLevel,
      },
    });

    // Cascading save: Saves the User, generates the User ID, and uses it as the Foreign Key for StudentProfile automatically!
    return await this.userRepo.save(user);
  }

  async registerTutor(dto: RegisterTutorDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) throw new ConflictException('Email already in use');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.userRepo.create({
      email: dto.email,
      passwordHash,
      role: 'tutor',
      phone: dto.phone,
      address: dto.address,
      tutorProfile: {
        fullName: dto.fullName,
        highestEducation: dto.highestEducation,
        preferredSubjects: dto.preferredSubjects,
      },
    });

    return await this.userRepo.save(user);
  }
}
