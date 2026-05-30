import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AdminDocument } from './schemas/admin.schema';
import { LoginDto } from './dto/login.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private adminModel;
    private jwtService;
    private mailService;
    private sessions;
    constructor(adminModel: Model<AdminDocument>, jwtService: JwtService, mailService: MailService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        admin: {
            id: import("mongoose").Types.ObjectId;
            email: string;
            name: string;
            role: string;
            restaurantId: import("mongoose").Types.ObjectId;
        };
    }>;
    sendCode(sendCodeDto: SendCodeDto): Promise<{
        sessionId: string;
        expiresIn: number;
    }>;
    verifyCode(verifyCodeDto: VerifyCodeDto): Promise<{
        access_token: string;
        admin: {
            id: string;
            email: string;
            name: string;
            role: string;
            restaurantId: string | undefined;
        };
    }>;
}
