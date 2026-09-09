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
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    // Passes the validated payload to your existing AuthService method
    return this.authService.registerUser(dto.email, dto.password, dto.role);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: LoginDto) {
    // 1. Check if user exists
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    // 2. Security Check (Requirement 8): Compare plain text with BCrypt Hash
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    // 3. Generate JWT (Requirement 7)
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      access_token,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }
}
