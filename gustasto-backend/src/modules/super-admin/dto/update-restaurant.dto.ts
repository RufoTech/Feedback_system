import { IsEmail, IsOptional, IsString, MinLength, IsArray } from 'class-validator';

export class UpdateRestaurantDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEmail({}, { message: 'Düzgün email daxil edin' })
  @IsOptional()
  adminEmail?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır' })
  adminPassword?: string;

  @IsString()
  @IsOptional()
  adminName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsArray()
  @IsOptional()
  branches?: Array<{ _id?: string; name: string; address?: string; description?: string }>;
}
