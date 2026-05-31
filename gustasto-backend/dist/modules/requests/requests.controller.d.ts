import { RequestsService } from './requests.service';
import { R2UploadService } from './r2-upload.service';
export declare class RequestsController {
    private readonly requestsService;
    private readonly r2UploadService;
    constructor(requestsService: RequestsService, r2UploadService: R2UploadService);
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
        customerEmail?: string;
    }, file: any): Promise<import("./schemas/request.schema").RequestDocument>;
    getRequests(req: any, type?: string, startDate?: string, branchId?: string): Promise<import("./schemas/request.schema").RequestDocument[]>;
    getStats(req: any, branchId?: string): Promise<{
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
