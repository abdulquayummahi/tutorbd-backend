// src/auth/dto/auth.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class RegisterStudentDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;

  // THE FIX: Prevents 400 Bad Request if the frontend Zod schema sends this
  @IsOptional() @IsString() confirmPassword?: string;

  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @IsNotEmpty() gradeLevel: string;
}

export class RegisterTutorDto {
  @IsString() @IsNotEmpty() fullName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;

  // THE FIX: Whitelisted for the tutor registration as well
  @IsOptional() @IsString() confirmPassword?: string;

  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @IsNotEmpty() highestEducation: string;
  @IsString() @IsNotEmpty() preferredSubjects: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
}
