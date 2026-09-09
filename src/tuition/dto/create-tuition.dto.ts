// src/tuition/dto/create-tuition.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTuitionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(500, { message: 'Salary must be at least 500 BDT' })
  salary: number;
}
