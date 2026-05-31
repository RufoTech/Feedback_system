import { Model } from 'mongoose';
import { RequestDocument } from './schemas/request.schema';
import { TableDocument } from '../restaurants/schemas/table.schema';
export declare class RequestsService {
    private requestModel;
    private tableModel;
    constructor(requestModel: Model<RequestDocument>, tableModel: Model<TableDocument>);
    createRequest(data: {
        restaurantId: string;
        tableId: string;
        tableNumber: string;
        type: string;
        text: string;
        rating?: number;
        isAnonymous?: boolean;
        customerName?: string;
        customerPhone?: string;
        customerEmail?: string;
        photoUrl?: string;
    }): Promise<RequestDocument>;
    findRequestsByRestaurant(restaurantId: string, filters: {
        type?: string;
        startDate?: string;
        branchId?: string;
    }): Promise<RequestDocument[]>;
    getStats(restaurantId: string, branchId?: string): Promise<{
        totalRequests: number;
        avgCsat: number;
        typeDistribution: {
            service: number;
            suggestions: number;
            complaints: number;
        };
        chartLabels: string[];
        chartData: number[];
        peakActivity: {
            service: {
                morning: number;
                lunch: number;
                dinner: number;
            };
            feedback: {
                morning: number;
                lunch: number;
                dinner: number;
            };
            payment: {
                morning: number;
                lunch: number;
                dinner: number;
            };
        };
        topZones: {
            zoneName: string;
            description: string;
            csat: number;
        }[];
    }>;
}
