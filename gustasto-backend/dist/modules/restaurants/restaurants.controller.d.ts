import { RestaurantsService } from './restaurants.service';
export declare class RestaurantsController {
    private readonly restaurantsService;
    constructor(restaurantsService: RestaurantsService);
    getAllRestaurants(): Promise<import("./schemas/restaurant.schema").RestaurantDocument[]>;
    getRestaurantById(id: string): Promise<import("./schemas/restaurant.schema").RestaurantDocument>;
    getTablesByRestaurant(id: string, branchId?: string): Promise<import("./schemas/table.schema").TableDocument[]>;
    createTable(restaurantId: string, tableNumber: string, branchId?: string): Promise<import("./schemas/table.schema").TableDocument>;
    deleteTable(tableId: string): Promise<{
        deleted: boolean;
    }>;
    getTableById(tableId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        tableNumber: string;
        qrCodeUrl: string;
        restaurant: {
            id: import("mongoose").Types.ObjectId;
            name: string;
            logo: string;
            address: string;
        };
        branch: {
            id: any;
            name: string;
            address: string | undefined;
        } | null;
    }>;
}
