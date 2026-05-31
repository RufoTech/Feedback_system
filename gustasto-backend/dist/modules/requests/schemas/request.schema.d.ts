import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
export type RequestDocument = Request & Document;
export declare class Request {
    restaurantId: mongoose.Types.ObjectId;
    branchId: mongoose.Types.ObjectId;
    tableId: mongoose.Types.ObjectId;
    tableNumber: string;
    type: string;
    text: string;
    rating: number;
    isAnonymous: boolean;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    photoUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RequestSchema: mongoose.Schema<Request, mongoose.Model<Request, any, any, any, any, any, Request>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Request, Document<unknown, {}, Request, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<Request & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    restaurantId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    branchId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tableId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    tableNumber?: mongoose.SchemaDefinitionProperty<string, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    type?: mongoose.SchemaDefinitionProperty<string, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    text?: mongoose.SchemaDefinitionProperty<string, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    rating?: mongoose.SchemaDefinitionProperty<number, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    isAnonymous?: mongoose.SchemaDefinitionProperty<boolean, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customerName?: mongoose.SchemaDefinitionProperty<string, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customerPhone?: mongoose.SchemaDefinitionProperty<string, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    customerEmail?: mongoose.SchemaDefinitionProperty<string, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    photoUrl?: mongoose.SchemaDefinitionProperty<string, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    createdAt?: mongoose.SchemaDefinitionProperty<Date, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    updatedAt?: mongoose.SchemaDefinitionProperty<Date, Request, Document<unknown, {}, Request, {
        id: string;
    }, mongoose.DefaultSchemaOptions> & Omit<Request & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, Request>;
