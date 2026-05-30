import { RequestsService } from './requests.service';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    createRequest(body: {
        restaurantId: string;
        tableId: string;
        tableNumber: string;
        type: string;
        text: string;
        rating?: string;
        isAnonymous?: string;
        customerName?: string;
        customerPhone?: string;
    }, file: any): Promise<import("./schemas/request.schema").RequestDocument>;
    getRequests(req: any, type?: string, status?: string): Promise<import("./schemas/request.schema").RequestDocument[]>;
    getStats(req: any): Promise<{
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
    updateStatus(id: string, status: string): Promise<import("./schemas/request.schema").RequestDocument>;
}
