import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from '../schemas/admin.schema';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private adminModel;
    constructor(configService: ConfigService, adminModel: Model<AdminDocument>);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<import("mongoose").Document<unknown, {}, AdminDocument, {}, import("mongoose").DefaultSchemaOptions> & Admin & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
export {};
