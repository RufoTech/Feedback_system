"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperAdminService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcrypt"));
const restaurant_schema_1 = require("../restaurants/schemas/restaurant.schema");
const admin_schema_1 = require("../auth/schemas/admin.schema");
const table_schema_1 = require("../restaurants/schemas/table.schema");
const request_schema_1 = require("../requests/schemas/request.schema");
let SuperAdminService = class SuperAdminService {
    restaurantModel;
    adminModel;
    tableModel;
    requestModel;
    constructor(restaurantModel, adminModel, tableModel, requestModel) {
        this.restaurantModel = restaurantModel;
        this.adminModel = adminModel;
        this.tableModel = tableModel;
        this.requestModel = requestModel;
    }
    async getAllRestaurants() {
        const restaurants = await this.restaurantModel.find().sort({ createdAt: -1 }).exec();
        const results = [];
        for (const r of restaurants) {
            const admin = await this.adminModel.findOne({ restaurantId: r._id, role: 'admin' }).exec();
            results.push({
                id: r._id,
                name: r.name,
                logo: r.logo,
                address: r.address,
                description: r.description,
                branches: r.branches || [],
                adminEmail: admin ? admin.email : '',
                adminName: admin ? admin.name : '',
                createdAt: r.createdAt,
            });
        }
        return results;
    }
    async createRestaurant(dto) {
        const existingAdmin = await this.adminModel.findOne({ email: dto.adminEmail.toLowerCase() }).exec();
        if (existingAdmin) {
            throw new common_1.BadRequestException('Bu email ünvanı ilə artıq admin mövcuddur');
        }
        const restaurant = new this.restaurantModel({
            name: dto.name,
            address: dto.address || '',
            description: dto.description || '',
            logo: dto.logo || '',
            branches: dto.branches || [],
        });
        const savedRestaurant = await restaurant.save();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.adminPassword, salt);
        const admin = new this.adminModel({
            email: dto.adminEmail.toLowerCase(),
            password: hashedPassword,
            name: dto.adminName,
            role: 'admin',
            restaurantId: savedRestaurant._id,
        });
        await admin.save();
        return {
            id: savedRestaurant._id,
            name: savedRestaurant.name,
            logo: savedRestaurant.logo,
            address: savedRestaurant.address,
            description: savedRestaurant.description,
            branches: savedRestaurant.branches,
            adminEmail: admin.email,
            adminName: admin.name,
        };
    }
    async updateRestaurant(id, dto) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Keçərsiz Restoran ID formatı');
        }
        const restaurant = await this.restaurantModel.findById(id).exec();
        if (!restaurant) {
            throw new common_1.NotFoundException('Restoran tapılmadı');
        }
        if (dto.name)
            restaurant.name = dto.name;
        if (dto.address !== undefined)
            restaurant.address = dto.address;
        if (dto.description !== undefined)
            restaurant.description = dto.description;
        if (dto.logo !== undefined)
            restaurant.logo = dto.logo;
        if (dto.branches !== undefined)
            restaurant.branches = dto.branches;
        const savedRestaurant = await restaurant.save();
        let admin = await this.adminModel.findOne({ restaurantId: restaurant._id, role: 'admin' }).exec();
        if (dto.adminEmail || dto.adminPassword || dto.adminName) {
            if (!admin) {
                if (!dto.adminEmail || !dto.adminPassword) {
                    throw new common_1.BadRequestException('Admin hesabı tapılmadı. Yeni admin yaratmaq üçün email və şifrə mütləqdir');
                }
                const existingAdmin = await this.adminModel.findOne({ email: dto.adminEmail.toLowerCase() }).exec();
                if (existingAdmin) {
                    throw new common_1.BadRequestException('Bu email ünvanı ilə artıq admin mövcuddur');
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(dto.adminPassword, salt);
                admin = new this.adminModel({
                    email: dto.adminEmail.toLowerCase(),
                    password: hashedPassword,
                    name: dto.adminName || 'Admin',
                    role: 'admin',
                    restaurantId: restaurant._id,
                });
                await admin.save();
            }
            else {
                if (dto.adminEmail && dto.adminEmail.toLowerCase() !== admin.email) {
                    const existingAdmin = await this.adminModel.findOne({ email: dto.adminEmail.toLowerCase() }).exec();
                    if (existingAdmin) {
                        throw new common_1.BadRequestException('Bu email ünvanı artıq başqa bir istifadəçi tərəfindən istifadə olunur');
                    }
                    admin.email = dto.adminEmail.toLowerCase();
                }
                if (dto.adminPassword) {
                    const salt = await bcrypt.genSalt(10);
                    admin.password = await bcrypt.hash(dto.adminPassword, salt);
                }
                if (dto.adminName) {
                    admin.name = dto.adminName;
                }
                await admin.save();
            }
        }
        return {
            id: savedRestaurant._id,
            name: savedRestaurant.name,
            logo: savedRestaurant.logo,
            address: savedRestaurant.address,
            description: savedRestaurant.description,
            branches: savedRestaurant.branches,
            adminEmail: admin ? admin.email : '',
            adminName: admin ? admin.name : '',
        };
    }
    async deleteRestaurant(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Keçərsiz Restoran ID formatı');
        }
        const restaurant = await this.restaurantModel.findByIdAndDelete(id).exec();
        if (!restaurant) {
            throw new common_1.NotFoundException('Restoran tapılmadı');
        }
        const restaurantId = new mongoose_2.Types.ObjectId(id);
        await this.adminModel.deleteMany({ restaurantId }).exec();
        await this.tableModel.deleteMany({ restaurantId }).exec();
        await this.requestModel.deleteMany({ restaurantId }).exec();
        return { deleted: true };
    }
    async getStats() {
        const totalRestaurants = await this.restaurantModel.countDocuments().exec();
        const totalRequests = await this.requestModel.countDocuments().exec();
        const totalTables = await this.tableModel.countDocuments().exec();
        return {
            totalRestaurants,
            totalRequests,
            totalTables,
        };
    }
};
exports.SuperAdminService = SuperAdminService;
exports.SuperAdminService = SuperAdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(restaurant_schema_1.Restaurant.name)),
    __param(1, (0, mongoose_1.InjectModel)(admin_schema_1.Admin.name)),
    __param(2, (0, mongoose_1.InjectModel)(table_schema_1.Table.name)),
    __param(3, (0, mongoose_1.InjectModel)(request_schema_1.Request.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], SuperAdminService);
//# sourceMappingURL=super-admin.service.js.map