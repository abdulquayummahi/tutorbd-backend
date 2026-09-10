// src/moderator/dto/moderator.dto.ts
import { IsString, IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
