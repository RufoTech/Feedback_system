import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { LoginDto } from './dto/login.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  // Müvəqqəti session yaddaşı (real layihədə Redis və ya DB istifadə olunmalıdır)
  private sessions: Map<string, { adminId: string; email: string; name: string; role: string; code: string; restaurantId?: string }> = new Map();

  constructor(
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Admini tapırıq
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new UnauthorizedException('E-poçt ünvanı və ya şifrə yanlışdır');
    }

    // Şifrəni yoxlayırıq
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-poçt ünvanı və ya şifrə yanlışdır');
    }

    // JWT payload yaradılır
    const payload = { sub: admin._id, email: admin.email, role: admin.role };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        restaurantId: admin.restaurantId,
      },
    };
  }

  async sendCode(sendCodeDto: SendCodeDto) {
    const { email, password } = sendCodeDto;

    // Admini tapırıq
    const admin = await this.adminModel.findOne({ email }).exec();
    if (!admin) {
      throw new UnauthorizedException('E-poçt ünvanı və ya şifrə yanlışdır');
    }

    // Şifrəni yoxlayırıq
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-poçt ünvanı və ya şifrə yanlışdır');
    }

    // Unikal session ID yaradırıq
    const sessionId = uuidv4();

    // Müvəqqəti kod (real layihədə email ilə göndəriləcək)
    // ŞİMDİLİK: random kod yaradırıq, amma verifyCode-da istənilən kodu qəbul edəcik
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Session məlumatlarını saxlayırıq
    this.sessions.set(sessionId, {
      adminId: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
      code: generatedCode,
      restaurantId: admin.restaurantId?.toString(),
    });

    // Session-u 5 dəqiqə sonra təmizləyirik
    setTimeout(() => {
      this.sessions.delete(sessionId);
    }, 5 * 60 * 1000);

    // Email ilə kodu göndəririk
    try {
      await this.mailService.sendVerificationCode(admin.email, generatedCode);
    } catch (error) {
      console.error(`[MAIL GÖNDƏRİLMƏDİ] ${admin.email} üçün kod: ${generatedCode}`, error?.message || error);
    }

    return {
      sessionId,
      expiresIn: 300, // 5 dəqiqə
    };
  }

  async verifyCode(verifyCodeDto: VerifyCodeDto) {
    const { sessionId, code } = verifyCodeDto;

    // Session-u tapırıq
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new BadRequestException('Sessiya müddəti bitmiş və ya etibarsızdır. Yenidən daxil olun.');
    }

    // ŞİMDİLİK: İstənilən kodu qəbul edir (kod boş deyilsə)
    // Real layihədə: if (code !== session.code) throw new UnauthorizedException('Kod yanlışdır');
    if (!code || code.trim().length === 0) {
      throw new BadRequestException('Kod boş ola bilməz');
    }

    // Session-u təmizləyirik (bir dəfəlik istifadə)
    this.sessions.delete(sessionId);

    // JWT payload yaradılır
    const payload = { sub: session.adminId, email: session.email, role: session.role };

    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: session.adminId,
        email: session.email,
        name: session.name,
        role: session.role,
        restaurantId: session.restaurantId,
      },
    };
  }
}
