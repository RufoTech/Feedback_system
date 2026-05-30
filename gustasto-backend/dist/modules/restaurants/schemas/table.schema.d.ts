import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type TableDocument = Table & Document;
export declare class Table {
    restaurantId: mongoose.Types.ObjectId;
    tableNumber: string;
    qrCodeUrl: string;
}
export declare const TableSchema: mongoose.Schema<Table, mongoose.Model<Table, any, any, any, any, any, Table>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Table, Document<unknown, {}, Table, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Table & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    restaurantId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Table, Document<unknown, {}, Table, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Table & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tableNumber?: mongoose.SchemaDefinitionProperty<string, Table, Document<unknown, {}, Table, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Table & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    qrCodeUrl?: mongoose.SchemaDefinitionProperty<string, Table, Document<unknown, {}, Table, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Table & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Table>;
