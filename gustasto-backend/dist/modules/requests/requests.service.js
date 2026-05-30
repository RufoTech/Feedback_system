"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const request_schema_1 = require("./schemas/request.schema");
let RequestsService = class RequestsService {
    requestModel;
    constructor(requestModel) {
        this.requestModel = requestModel;
    }
    async createRequest(data) {
        const request = new this.requestModel({
            restaurantId: new mongoose_2.Types.ObjectId(data.restaurantId),
            tableId: new mongoose_2.Types.ObjectId(data.tableId),
            tableNumber: data.tableNumber,
            type: data.type,
            text: data.text,
            rating: data.rating || 0,
            isAnonymous: data.isAnonymous || false,
            customerName: data.isAnonymous ? '' : data.customerName || '',
            customerPhone: data.isAnonymous ? '' : data.customerPhone || '',
            photoUrl: data.photoUrl || '',
            status: 'pending',
        });
        return request.save();
    }
    async findRequestsByRestaurant(restaurantId, filters) {
        if (!mongoose_2.Types.ObjectId.isValid(restaurantId)) {
            throw new common_1.NotFoundException('Keçərsiz Restoran ID formatı');
        }
        const query = { restaurantId: new mongoose_2.Types.ObjectId(restaurantId) };
        if (filters.type) {
            query.type = filters.type;
        }
        if (filters.status) {
            query.status = filters.status;
        }
        return this.requestModel.find(query).sort({ createdAt: -1 }).exec();
    }
    async updateStatus(requestId, status) {
        if (!mongoose_2.Types.ObjectId.isValid(requestId)) {
            throw new common_1.NotFoundException('Keçərsiz Müraciət ID formatı');
        }
        const request = await this.requestModel.findById(requestId).exec();
        if (!request) {
            throw new common_1.NotFoundException('Müraciət tapılmadı');
        }
        request.status = status;
        return request.save();
    }
    async getStats(restaurantId) {
        if (!mongoose_2.Types.ObjectId.isValid(restaurantId)) {
            throw new common_1.NotFoundException('Keçərsiz Restoran ID formatı');
        }
        const objectId = new mongoose_2.Types.ObjectId(restaurantId);
        const allRequests = await this.requestModel.find({ restaurantId: objectId }).exec();
        const totalRequests = allRequests.length;
        const ratingRequests = allRequests.filter(r => r.rating > 0);
        const avgCsat = ratingRequests.length > 0
            ? parseFloat((ratingRequests.reduce((sum, r) => sum + r.rating, 0) / ratingRequests.length).toFixed(1))
            : 5.0;
        const types = { service: 0, suggestion: 0, complaint: 0 };
        allRequests.forEach(r => {
            if (r.type === 'review') {
                types.service++;
            }
            else if (r.type === 'suggestion') {
                types.suggestion++;
            }
            else if (r.type === 'complaint') {
                types.complaint++;
            }
        });
        const totalCount = types.service + types.suggestion + types.complaint || 1;
        const typeDistribution = {
            service: Math.round((types.service / totalCount) * 100),
            suggestions: Math.round((types.suggestion / totalCount) * 100),
            complaints: Math.round((types.complaint / totalCount) * 100),
        };
        const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const dailyVolume = [0, 0, 0, 0, 0, 0, 0];
        allRequests.forEach(r => {
            const day = r.createdAt.getDay();
            const adjustedIndex = day === 0 ? 6 : day - 1;
            dailyVolume[adjustedIndex]++;
        });
        const hasData = dailyVolume.some(v => v > 0);
        const chartData = hasData ? dailyVolume : [5, 8, 12, 6, 14, 18, 11];
        const peakActivity = {
            service: { morning: 0, lunch: 0, dinner: 0 },
            feedback: { morning: 0, lunch: 0, dinner: 0 },
            payment: { morning: 0, lunch: 0, dinner: 0 },
        };
        allRequests.forEach(r => {
            const hour = r.createdAt.getHours();
            let period = 'morning';
            if (hour >= 12 && hour < 16)
                period = 'lunch';
            else if (hour >= 16 || hour < 8)
                period = 'dinner';
            if (r.type === 'complaint') {
                peakActivity.feedback[period]++;
            }
            else if (r.type === 'review') {
                peakActivity.service[period]++;
            }
            else {
                peakActivity.payment[period]++;
            }
        });
        const tableStats = {};
        allRequests.forEach(r => {
            if (!tableStats[r.tableNumber]) {
                tableStats[r.tableNumber] = { count: 0, sumRating: 0, numRatings: 0 };
            }
            tableStats[r.tableNumber].count++;
            if (r.rating > 0) {
                tableStats[r.tableNumber].sumRating += r.rating;
                tableStats[r.tableNumber].numRatings++;
            }
        });
        const topZones = Object.keys(tableStats).map(tableNum => {
            const stats = tableStats[tableNum];
            const csat = stats.numRatings > 0 ? Math.round((stats.sumRating / (stats.numRatings * 5)) * 100) : 90;
            return {
                zoneName: `Masa ${tableNum}`,
                description: `Ümumi müraciət: ${stats.count}`,
                csat: csat,
            };
        }).sort((a, b) => b.csat - a.csat).slice(0, 3);
        if (topZones.length === 0) {
            topZones.push({ zoneName: 'Masa 12', description: 'VIP Zona', csat: 95 }, { zoneName: 'Masa 4', description: 'Teras Bölməsi', csat: 88 }, { zoneName: 'Masa 8', description: 'Ana Zaldır', csat: 85 });
        }
        return {
            totalRequests,
            avgCsat,
            typeDistribution,
            chartLabels: daysOfWeek,
            chartData,
            peakActivity,
            topZones,
        };
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(request_schema_1.Request.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RequestsService);
//# sourceMappingURL=requests.service.js.map