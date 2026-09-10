// src/admin/dto/admin.dto.ts
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';

export class CreateStaffDto {
  @IsString() @IsNotEmpty() fullName: string;
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  // Strictly limits the dropdown options from your frontend
  @IsEnum(['admin', 'moderator']) role: string;
}

export class UpdateUserStatusDto {
  @IsEnum(['Active', 'Suspended']) status: string;
}
