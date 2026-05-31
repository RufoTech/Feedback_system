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
exports.RequestsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const requests_service_1 = require("./requests.service");
const r2_upload_service_1 = require("./r2-upload.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let RequestsController = class RequestsController {
    requestsService;
    r2UploadService;
    constructor(requestsService, r2UploadService) {
        this.requestsService = requestsService;
        this.r2UploadService = r2UploadService;
    }
    async createRequest(body, file) {
        const isAnon = body.isAnonymous === 'true' || body.isAnonymous === true;
        const ratingVal = body.rating ? parseInt(body.rating, 10) : 0;
        let photoUrl = '';
        if (file) {
            photoUrl = await this.r2UploadService.uploadFile(file);
        }
        return this.requestsService.createRequest({
            restaurantId: body.restaurantId,
            tableId: body.tableId,
            tableNumber: body.tableNumber,
            type: body.type,
            text: body.text,
            rating: ratingVal,
            isAnonymous: isAnon,
            customerName: body.customerName,
            customerPhone: body.customerPhone,
            customerEmail: body.customerEmail,
            photoUrl,
        });
    }
    async getRequests(req, type, startDate, branchId) {
        const restaurantId = req.user.restaurantId?.toString();
        if (!restaurantId) {
            return [];
        }
        return this.requestsService.findRequestsByRestaurant(restaurantId, { type, startDate, branchId });
    }
    async getStats(req, branchId) {
        const restaurantId = req.user.restaurantId?.toString();
        if (!restaurantId) {
            return {
                totalRequests: 0,
                avgCsat: 5.0,
                typeDistribution: { service: 0, suggestions: 0, complaints: 0 },
                chartLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                chartData: [0, 0, 0, 0, 0, 0, 0],
                peakActivity: {
                    service: { morning: 0, lunch: 0, dinner: 0 },
                    feedback: { morning: 0, lunch: 0, dinner: 0 },
                    payment: { morning: 0, lunch: 0, dinner: 0 },
                },
                topZones: [],
            };
        }
        return this.requestsService.getStats(restaurantId, branchId);
    }
};
exports.RequestsController = RequestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('photo')),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "createRequest", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('type')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getRequests", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RequestsController.prototype, "getStats", null);
exports.RequestsController = RequestsController = __decorate([
    (0, common_1.Controller)('requests'),
    __metadata("design:paramtypes", [requests_service_1.RequestsService,
        r2_upload_service_1.R2UploadService])
], RequestsController);
//# sourceMappingURL=requests.controller.js.map