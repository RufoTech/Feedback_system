import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyCodeDto {
  @IsString()
  @IsNotEmpty({ message: 'Session ID boş ola bilməz' })
  sessionId: string;

  @IsString()
  @IsNotEmpty({ message: 'Doğrulama kodu boş ola bilməz' })
  code: string;
}
