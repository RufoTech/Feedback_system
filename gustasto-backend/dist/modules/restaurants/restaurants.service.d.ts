import { Model } from 'mongoose';
import { RestaurantDocument } from './schemas/restaurant.schema';
import { TableDocument } from './schemas/table.schema';
export declare class RestaurantsService {
    private restaurantModel;
    private tableModel;
    constructor(restaurantModel: Model<RestaurantDocument>, tableModel: Model<TableDocument>);
    createRestaurant(name: string, logo: string, address: string, description: string): Promise<RestaurantDocument>;
    findAllRestaurants(): Promise<RestaurantDocument[]>;
    findRestaurantById(id: string): Promise<RestaurantDocument>;
    findTablesByRestaurant(restaurantId: string, branchId?: string): Promise<TableDocument[]>;
    createTable(restaurantId: string, tableNumber: string, branchId?: string): Promise<TableDocument>;
    findTableById(id: string): Promise<TableDocument>;
    deleteTable(tableId: string): Promise<{
        deleted: boolean;
    }>;
}
