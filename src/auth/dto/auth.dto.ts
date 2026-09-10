// src/auth/dto/auth.dto.ts
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterTutorDto {
  @IsString() @IsNotEmpty() fullName: string;
  @IsEmail({}, { message: 'Invalid email format' }) email: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsNotEmpty() highestEducation: string;
  @IsString() @IsNotEmpty() preferredSubjects: string;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @MinLength(6) password: string;
}

// THE FIX: Updated to match the frontend Student form perfectly!
export class RegisterStudentDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() phone: string;
  @IsString() @IsNotEmpty() address: string;
  @IsString() @IsNotEmpty() gradeLevel: string; // Matches frontend dropdown
  @IsString() @MinLength(6) password: string;
}

export class LoginDto {
  @IsEmail() email: string;
  @IsString() password: string;
}
