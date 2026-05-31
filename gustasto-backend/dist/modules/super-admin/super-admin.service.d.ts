import { Model, Types } from 'mongoose';
import { RestaurantDocument } from '../restaurants/schemas/restaurant.schema';
import { AdminDocument } from '../auth/schemas/admin.schema';
import { TableDocument } from '../restaurants/schemas/table.schema';
import { RequestDocument } from '../requests/schemas/request.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
export declare class SuperAdminService {
    private restaurantModel;
    private adminModel;
    private tableModel;
    private requestModel;
    constructor(restaurantModel: Model<RestaurantDocument>, adminModel: Model<AdminDocument>, tableModel: Model<TableDocument>, requestModel: Model<RequestDocument>);
    getAllRestaurants(): Promise<{
        id: Types.ObjectId;
        name: string;
        logo: string;
        address: string;
        description: string;
        branches: {
            _id: any;
            name: string;
            address?: string;
            description?: string;
        }[];
        adminEmail: string;
        adminName: string;
        createdAt: any;
    }[]>;
    createRestaurant(dto: CreateRestaurantDto): Promise<{
        id: Types.ObjectId;
        name: string;
        logo: string;
        address: string;
        description: string;
        branches: {
            _id: any;
            name: string;
            address?: string;
            description?: string;
        }[];
        adminEmail: string;
        adminName: string;
    }>;
    updateRestaurant(id: string, dto: UpdateRestaurantDto): Promise<{
        id: Types.ObjectId;
        name: string;
        logo: string;
        address: string;
        description: string;
        branches: {
            _id: any;
            name: string;
            address?: string;
            description?: string;
        }[];
        adminEmail: string;
        adminName: string;
    }>;
    deleteRestaurant(id: string): Promise<{
        deleted: boolean;
    }>;
    getStats(): Promise<{
        totalRestaurants: number;
        totalRequests: number;
        totalTables: number;
    }>;
}
