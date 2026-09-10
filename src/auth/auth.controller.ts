// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterTutorDto, RegisterStudentDto, LoginDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('api')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  @Post('tutor/register')
  async registerTutor(@Body() dto: RegisterTutorDto) {
    return this.authService.registerTutor(dto);
  }

  @Post('student/register')
  async registerStudent(@Body() dto: RegisterStudentDto) {
    return this.authService.registerStudent(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/login')
  async login(@Body() dto: LoginDto) {
    // 1. Fetch user (TypeORM automatically joins StudentProfile/TutorProfile because of eager: true)
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Verify BCrypt Password
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. Generate JWT
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    // THE FIX: Dynamically resolve the user's name based on our Normalized Tables
    let displayName = 'User';
    if (user.role === 'student' && user.studentProfile) {
      displayName = `${user.studentProfile.firstName} ${user.studentProfile.lastName}`;
    } else if (user.role === 'tutor' && user.tutorProfile) {
      displayName = user.tutorProfile.fullName;
    } else if (user.role === 'admin') {
      displayName = 'Super Admin';
    }

    // 4. Return the payload to the frontend
    return {
      message: 'Login successful',
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: displayName, // Returns the correctly mapped name
      },
    };
  }
}
