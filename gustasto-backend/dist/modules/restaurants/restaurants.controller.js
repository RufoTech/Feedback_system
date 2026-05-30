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
exports.RestaurantsController = void 0;
const common_1 = require("@nestjs/common");
const restaurants_service_1 = require("./restaurants.service");
let RestaurantsController = class RestaurantsController {
    restaurantsService;
    constructor(restaurantsService) {
        this.restaurantsService = restaurantsService;
    }
    async getAllRestaurants() {
        return this.restaurantsService.findAllRestaurants();
    }
    async getRestaurantById(id) {
        return this.restaurantsService.findRestaurantById(id);
    }
    async getTablesByRestaurant(id) {
        return this.restaurantsService.findTablesByRestaurant(id);
    }
    async createTable(restaurantId, tableNumber) {
        return this.restaurantsService.createTable(restaurantId, tableNumber);
    }
    async deleteTable(tableId) {
        return this.restaurantsService.deleteTable(tableId);
    }
    async getTableById(tableId) {
        const table = await this.restaurantsService.findTableById(tableId);
        const restaurant = await this.restaurantsService.findRestaurantById(table.restaurantId.toString());
        return {
            id: table._id,
            tableNumber: table.tableNumber,
            qrCodeUrl: table.qrCodeUrl,
            restaurant: {
                id: restaurant._id,
                name: restaurant.name,
                logo: restaurant.logo,
                address: restaurant.address,
            },
        };
    }
};
exports.RestaurantsController = RestaurantsController;
__decorate([
    (0, common_1.Get)('restaurants'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getAllRestaurants", null);
__decorate([
    (0, common_1.Get)('restaurants/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getRestaurantById", null);
__decorate([
    (0, common_1.Get)('restaurants/:id/tables'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getTablesByRestaurant", null);
__decorate([
    (0, common_1.Post)('restaurants/:id/tables'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('tableNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "createTable", null);
__decorate([
    (0, common_1.Delete)('tables/:tableId'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('tableId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "deleteTable", null);
__decorate([
    (0, common_1.Get)('tables/:tableId'),
    __param(0, (0, common_1.Param)('tableId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RestaurantsController.prototype, "getTableById", null);
exports.RestaurantsController = RestaurantsController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [restaurants_service_1.RestaurantsService])
], RestaurantsController);
//# sourceMappingURL=restaurants.controller.js.map