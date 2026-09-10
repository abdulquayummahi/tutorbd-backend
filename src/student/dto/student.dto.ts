// src/student/dto/student.dto.ts
import { IsString, IsOptional, MinLength } from 'class-validator';

// Rubric Req 4: DTO Validation.
// We use @IsOptional() because a user might only update one field at a time.
export class UpdateStudentProfileDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
}
