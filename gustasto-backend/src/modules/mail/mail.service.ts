import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<string>('MAIL_SECURE') === 'true',
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    const fromName = this.configService.get<string>('MAIL_FROM_NAME') || 'Gusto Admin';
    const fromEmail = this.configService.get<string>('MAIL_FROM') || this.configService.get<string>('MAIL_USER');

    await this.transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: email,
      subject: 'Gusto Admin Panelinə Giriş Kodu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background-color: #fbf9f9; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #1b1c1c; font-size: 24px; margin: 0;">Gusto Admin</h1>
          </div>
          <div style="background: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
            <h2 style="color: #1b1c1c; font-size: 18px; margin: 0 0 8px 0;">Admin Panelinə Giriş</h2>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0;">
              Admin panelinə daxil olmaq üçün aşağıdakı doğrulama kodundan istifadə edin:
            </p>
            <div style="text-align: center; margin: 24px 0;">
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #735c00; background: #f5f3f3; padding: 16px 24px; border-radius: 12px; display: inline-block;">
                ${code}
              </div>
            </div>
            <p style="color: #6b7280; font-size: 13px; margin: 16px 0 0 0;">
              Bu kod 5 dəqiqə ərzində etibarlıdır. Əgər bu girişi siz etməmisinizsə, bu e-poçtu nəzərə almayın.
            </p>
          </div>
          <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
            &copy; 2026 Gusto Kiosk. Bütün hüquqlar qorunur.
          </p>
        </div>
      `,
    });
  }
}
