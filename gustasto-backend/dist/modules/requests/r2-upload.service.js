"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.R2UploadService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
let R2UploadService = class R2UploadService {
    configService;
    s3Client;
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: this.configService.get('R2_ENDPOINT'),
            credentials: {
                accessKeyId: this.configService.get('R2_ACCESS_KEY_ID') || '',
                secretAccessKey: this.configService.get('R2_SECRET_ACCESS_KEY') || '',
            },
        });
    }
    async uploadFile(file) {
        const bucketName = this.configService.get('R2_BUCKET_NAME');
        const publicUrl = this.configService.get('R2_PUBLIC_URL');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`;
        await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: file.buffer,
            ContentType: file.mimetype,
        }));
        return `${publicUrl}/${filename}`;
    }
};
exports.R2UploadService = R2UploadService;
exports.R2UploadService = R2UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], R2UploadService);
//# sourceMappingURL=r2-upload.service.js.map