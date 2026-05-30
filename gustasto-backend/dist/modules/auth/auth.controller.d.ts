import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { VerifyCodeDto } from './dto/verify-code.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    getProfile(req: any): any;
}
