export declare class UpdateRestaurantDto {
    name?: string;
    adminEmail?: string;
    adminPassword?: string;
    adminName?: string;
    address?: string;
    description?: string;
    logo?: string;
    branches?: Array<{
        _id?: string;
        name: string;
        address?: string;
        description?: string;
    }>;
}
