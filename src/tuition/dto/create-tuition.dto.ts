// src/tuition/dto/create-tuition.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTuitionDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() gradeLevel: string;
  @IsString() @IsNotEmpty() subjects: string;
  @IsString() @IsNotEmpty() daysPerWeek: string;
  @IsString() @IsNotEmpty() location: string;

  // THE FIX: Parses the string from the frontend into a JavaScript Number!
  @Type(() => Number)
  @IsNumber()
  @Min(500)
  salary: number;
}
