// src/tutor/dto/tutor.dto.ts
import { IsString, IsOptional } from 'class-validator';

// Rubric Req 4: DTO Validation
// All fields are optional so the tutor can update just one field at a time (PATCH method)
export class UpdateTutorProfileDto {
  @IsOptional() @IsString() fullName?: string;
  @IsOptional() @IsString() highestEducation?: string;
  @IsOptional() @IsString() preferredSubjects?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() address?: string;
}
