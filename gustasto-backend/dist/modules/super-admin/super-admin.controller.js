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
exports.SuperAdminController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const super_admin_service_1 = require("./super-admin.service");
const super_admin_guard_1 = require("../auth/guards/super-admin.guard");
const create_restaurant_dto_1 = require("./dto/create-restaurant.dto");
const update_restaurant_dto_1 = require("./dto/update-restaurant.dto");
const r2_upload_service_1 = require("../requests/r2-upload.service");
let SuperAdminController = class SuperAdminController {
    superAdminService;
    r2UploadService;
    constructor(superAdminService, r2UploadService) {
        this.superAdminService = superAdminService;
        this.r2UploadService = r2UploadService;
    }
    async getAllRestaurants() {
        return this.superAdminService.getAllRestaurants();
    }
    async createRestaurant(dto) {
        return this.superAdminService.createRestaurant(dto);
    }
    async updateRestaurant(id, dto) {
        return this.superAdminService.updateRestaurant(id, dto);
    }
    async deleteRestaurant(id) {
        return this.superAdminService.deleteRestaurant(id);
    }
    async getStats() {
        return this.superAdminService.getStats();
    }
    async uploadLogo(file) {
        if (!file) {
            throw new common_1.BadRequestException('Fayl yüklənməyib');
        }
        const url = await this.r2UploadService.uploadFile(file);
        return { url };
    }
};
exports.SuperAdminController = SuperAdminController;
__decorate([
    (0, common_1.Get)('restaurants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getAllRestaurants", null);
__decorate([
    (0, common_1.Post)('restaurants'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_restaurant_dto_1.CreateRestaurantDto]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "createRestaurant", null);
__decorate([
    (0, common_1.Put)('restaurants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_restaurant_dto_1.UpdateRestaurantDto]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "updateRestaurant", null);
__decorate([
    (0, common_1.Delete)('restaurants/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "deleteRestaurant", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SuperAdminController.prototype, "uploadLogo", null);
exports.SuperAdminController = SuperAdminController = __decorate([
    (0, common_1.Controller)('super-admin'),
    (0, common_1.UseGuards)(super_admin_guard_1.SuperAdminGuard),
    __metadata("design:paramtypes", [super_admin_service_1.SuperAdminService,
        r2_upload_service_1.R2UploadService])
], SuperAdminController);
//# sourceMappingURL=super-admin.controller.js.map