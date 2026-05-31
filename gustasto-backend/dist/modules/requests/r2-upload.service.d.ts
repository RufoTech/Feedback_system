import { ConfigService } from '@nestjs/config';
export declare class R2UploadService {
    private configService;
    private s3Client;
    constructor(configService: ConfigService);
    uploadFile(file: any): Promise<string>;
}
