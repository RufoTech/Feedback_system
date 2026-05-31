import { SuperAdminService } from './super-admin.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { R2UploadService } from '../requests/r2-upload.service';
export declare class SuperAdminController {
    private readonly superAdminService;
    private readonly r2UploadService;
    constructor(superAdminService: SuperAdminService, r2UploadService: R2UploadService);
    getAllRestaurants(): Promise<{
        id: import("mongoose").Types.ObjectId;
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
        id: import("mongoose").Types.ObjectId;
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
        id: import("mongoose").Types.ObjectId;
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
    uploadLogo(file: any): Promise<{
        url: string;
    }>;
}
