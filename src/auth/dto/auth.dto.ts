// src/auth/dto/auth.dto.ts
import { IsEmail, IsString, MinLength, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @IsEnum(['student', 'tutor', 'admin', 'moderator'])
  role: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
