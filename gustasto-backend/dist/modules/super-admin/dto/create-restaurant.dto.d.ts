export declare class CreateRestaurantDto {
    name: string;
    adminEmail: string;
    adminPassword: string;
    adminName: string;
    address?: string;
    description?: string;
    logo?: string;
    branches?: Array<{
        name: string;
        address?: string;
        description?: string;
    }>;
}
