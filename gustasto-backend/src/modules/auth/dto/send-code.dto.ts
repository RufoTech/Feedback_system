import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SendCodeDto {
  @IsEmail({}, { message: 'Düzgün email daxil edin' })
  @IsNotEmpty({ message: 'Email boş ola bilməz' })
  email: string;

  @IsNotEmpty({ message: 'Şifrə boş ola bilməz' })
  @MinLength(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır' })
  password: string;
}
