import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsArray } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  @IsNotEmpty({ message: 'Restoran adı boş ola bilməz' })
  name: string;

  @IsEmail({}, { message: 'Düzgün email daxil edin' })
  @IsNotEmpty({ message: 'Admin emaili boş ola bilməz' })
  adminEmail: string;

  @IsString()
  @IsNotEmpty({ message: 'Admin şifrəsi boş ola bilməz' })
  @MinLength(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır' })
  adminPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Admin adı boş ola bilməz' })
  adminName: string;

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
  branches?: Array<{ name: string; address?: string; description?: string }>;
}
