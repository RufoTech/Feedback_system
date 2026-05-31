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
exports.RestaurantsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const restaurant_schema_1 = require("./schemas/restaurant.schema");
const table_schema_1 = require("./schemas/table.schema");
let RestaurantsService = class RestaurantsService {
    restaurantModel;
    tableModel;
    constructor(restaurantModel, tableModel) {
        this.restaurantModel = restaurantModel;
        this.tableModel = tableModel;
    }
    async createRestaurant(name, logo, address, description) {
        const restaurant = new this.restaurantModel({ name, logo, address, description });
        return restaurant.save();
    }
    async findAllRestaurants() {
        return this.restaurantModel.find().exec();
    }
    async findRestaurantById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Keçərsiz Restoran ID formatı');
        }
        const restaurant = await this.restaurantModel.findById(id).exec();
        if (!restaurant) {
            throw new common_1.NotFoundException('Restoran tapılmadı');
        }
        return restaurant;
    }
    async findTablesByRestaurant(restaurantId, branchId) {
        if (!mongoose_2.Types.ObjectId.isValid(restaurantId)) {
            throw new common_1.NotFoundException('Keçərsiz Restoran ID formatı');
        }
        const query = { restaurantId: new mongoose_2.Types.ObjectId(restaurantId) };
        if (branchId && mongoose_2.Types.ObjectId.isValid(branchId)) {
            query.branchId = new mongoose_2.Types.ObjectId(branchId);
        }
        return this.tableModel.find(query).exec();
    }
    async createTable(restaurantId, tableNumber, branchId) {
        if (!mongoose_2.Types.ObjectId.isValid(restaurantId)) {
            throw new common_1.NotFoundException('Keçərsiz Restoran ID formatı');
        }
        const restaurant = await this.restaurantModel.findById(restaurantId).exec();
        if (!restaurant) {
            throw new common_1.NotFoundException('Restoran tapılmadı');
        }
        const tableData = {
            restaurantId: new mongoose_2.Types.ObjectId(restaurantId),
            tableNumber,
        };
        if (branchId && mongoose_2.Types.ObjectId.isValid(branchId)) {
            tableData.branchId = new mongoose_2.Types.ObjectId(branchId);
        }
        const table = new this.tableModel(tableData);
        const savedTable = await table.save();
        const qrCodeUrl = `http://localhost:5173/?restaurantId=${restaurantId}&tableId=${savedTable._id}`;
        savedTable.qrCodeUrl = qrCodeUrl;
        return savedTable.save();
    }
    async findTableById(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.NotFoundException('Keçərsiz Masa ID formatı');
        }
        const table = await this.tableModel.findById(id).exec();
        if (!table) {
            throw new common_1.NotFoundException('Masa tapılmadı');
        }
        return table;
    }
    async deleteTable(tableId) {
        if (!mongoose_2.Types.ObjectId.isValid(tableId)) {
            throw new common_1.NotFoundException('Keçərsiz Masa ID formatı');
        }
        const result = await this.tableModel.findByIdAndDelete(tableId).exec();
        if (!result) {
            throw new common_1.NotFoundException('Masa tapılmadı');
        }
        return { deleted: true };
    }
};
exports.RestaurantsService = RestaurantsService;
exports.RestaurantsService = RestaurantsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(restaurant_schema_1.Restaurant.name)),
    __param(1, (0, mongoose_1.InjectModel)(table_schema_1.Table.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], RestaurantsService);
//# sourceMappingURL=restaurants.service.js.map