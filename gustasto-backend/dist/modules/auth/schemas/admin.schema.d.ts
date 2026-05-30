import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type AdminDocument = Admin & Document;
export declare class Admin {
    email: string;
    password: string;
    name: string;
    role: string;
    restaurantId: mongoose.Types.ObjectId;
}
export declare const AdminSchema: mongoose.Schema<Admin, mongoose.Model<Admin, any, any, any, any, any, Admin>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Admin, Document<unknown, {}, Admin, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Admin & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    email?: mongoose.SchemaDefinitionProperty<string, Admin, Document<unknown, {}, Admin, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Admin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    password?: mongoose.SchemaDefinitionProperty<string, Admin, Document<unknown, {}, Admin, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Admin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    name?: mongoose.SchemaDefinitionProperty<string, Admin, Document<unknown, {}, Admin, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Admin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    role?: mongoose.SchemaDefinitionProperty<string, Admin, Document<unknown, {}, Admin, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Admin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    restaurantId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Admin, Document<unknown, {}, Admin, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Admin & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Admin>;
