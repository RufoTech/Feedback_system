"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const uuid_1 = require("uuid");
const admin_schema_1 = require("./schemas/admin.schema");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    adminModel;
    jwtService;
    mailService;
    sessions = new Map();
    constructor(adminModel, jwtService, mailService) {
        this.adminModel = adminModel;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const admin = await this.adminModel.findOne({ email }).exec();
        if (!admin) {
            throw new common_1.UnauthorizedException('E-poçt ünvanı və ya şifrə yanlışdır');
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('E-poçt ünvanı və ya şifrə yanlışdır');
        }
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
    async sendCode(sendCodeDto) {
        const { email, password } = sendCodeDto;
        const admin = await this.adminModel.findOne({ email }).exec();
        if (!admin) {
            throw new common_1.UnauthorizedException('E-poçt ünvanı və ya şifrə yanlışdır');
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('E-poçt ünvanı və ya şifrə yanlışdır');
        }
        const sessionId = (0, uuid_1.v4)();
        const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
        this.sessions.set(sessionId, {
            adminId: admin._id.toString(),
            email: admin.email,
            name: admin.name,
            role: admin.role,
            code: generatedCode,
            restaurantId: admin.restaurantId?.toString(),
        });
        setTimeout(() => {
            this.sessions.delete(sessionId);
        }, 5 * 60 * 1000);
        try {
            await this.mailService.sendVerificationCode(admin.email, generatedCode);
        }
        catch (error) {
            console.error(`[MAIL GÖNDƏRİLMƏDİ] ${admin.email} üçün kod: ${generatedCode}`, error?.message || error);
        }
        return {
            sessionId,
            expiresIn: 300,
        };
    }
    async verifyCode(verifyCodeDto) {
        const { sessionId, code } = verifyCodeDto;
        const session = this.sessions.get(sessionId);
        if (!session) {
            throw new common_1.BadRequestException('Sessiya müddəti bitmiş və ya etibarsızdır. Yenidən daxil olun.');
        }
        if (!code || code.trim().length === 0) {
            throw new common_1.BadRequestException('Kod boş ola bilməz');
        }
        this.sessions.delete(sessionId);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map