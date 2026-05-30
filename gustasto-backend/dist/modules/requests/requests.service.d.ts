import { Model } from 'mongoose';
import { RequestDocument } from './schemas/request.schema';
export declare class RequestsService {
    private requestModel;
    constructor(requestModel: Model<RequestDocument>);
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
        photoUrl?: string;
    }): Promise<RequestDocument>;
    findRequestsByRestaurant(restaurantId: string, filters: {
        type?: string;
        status?: string;
    }): Promise<RequestDocument[]>;
    updateStatus(requestId: string, status: string): Promise<RequestDocument>;
    getStats(restaurantId: string): Promise<{
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
