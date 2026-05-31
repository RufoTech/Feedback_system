import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Restaurant, RestaurantDocument } from '../restaurants/schemas/restaurant.schema';
import { Admin, AdminDocument } from '../auth/schemas/admin.schema';
import { Table, TableDocument } from '../restaurants/schemas/table.schema';
import { Request, RequestDocument } from '../requests/schemas/request.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(Admin.name) private adminModel: Model<AdminDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
    @InjectModel(Request.name) private requestModel: Model<RequestDocument>,
  ) {}

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
        createdAt: (r as any).createdAt,
      });
    }
    return results;
  }

  async createRestaurant(dto: CreateRestaurantDto) {
    // Check if email already exists
    const existingAdmin = await this.adminModel.findOne({ email: dto.adminEmail.toLowerCase() }).exec();
    if (existingAdmin) {
      throw new BadRequestException('Bu email ünvanı ilə artıq admin mövcuddur');
    }

    // Create Restaurant
    const restaurant = new this.restaurantModel({
      name: dto.name,
      address: dto.address || '',
      description: dto.description || '',
      logo: dto.logo || '',
      branches: dto.branches || [],
    });
    const savedRestaurant = await restaurant.save();

    // Create Admin
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

  async updateRestaurant(id: string, dto: UpdateRestaurantDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Keçərsiz Restoran ID formatı');
    }

    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new NotFoundException('Restoran tapılmadı');
    }

    // Update restaurant info
    if (dto.name) restaurant.name = dto.name;
    if (dto.address !== undefined) restaurant.address = dto.address;
    if (dto.description !== undefined) restaurant.description = dto.description;
    if (dto.logo !== undefined) restaurant.logo = dto.logo;
    if (dto.branches !== undefined) restaurant.branches = dto.branches as any;
    const savedRestaurant = await restaurant.save();

    // Update or create admin info
    let admin = await this.adminModel.findOne({ restaurantId: restaurant._id, role: 'admin' }).exec();
    
    if (dto.adminEmail || dto.adminPassword || dto.adminName) {
      if (!admin) {
        // If admin doesn't exist, we must create a new one but adminPassword and adminEmail must be provided
        if (!dto.adminEmail || !dto.adminPassword) {
          throw new BadRequestException('Admin hesabı tapılmadı. Yeni admin yaratmaq üçün email və şifrə mütləqdir');
        }
        
        const existingAdmin = await this.adminModel.findOne({ email: dto.adminEmail.toLowerCase() }).exec();
        if (existingAdmin) {
          throw new BadRequestException('Bu email ünvanı ilə artıq admin mövcuddur');
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
      } else {
        // Update existing admin
        if (dto.adminEmail && dto.adminEmail.toLowerCase() !== admin.email) {
          const existingAdmin = await this.adminModel.findOne({ email: dto.adminEmail.toLowerCase() }).exec();
          if (existingAdmin) {
            throw new BadRequestException('Bu email ünvanı artıq başqa bir istifadəçi tərəfindən istifadə olunur');
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

  async deleteRestaurant(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Keçərsiz Restoran ID formatı');
    }

    const restaurant = await this.restaurantModel.findByIdAndDelete(id).exec();
    if (!restaurant) {
      throw new NotFoundException('Restoran tapılmadı');
    }

    const restaurantId = new Types.ObjectId(id);

    // Delete associated admins
    await this.adminModel.deleteMany({ restaurantId }).exec();

    // Delete associated tables
    await this.tableModel.deleteMany({ restaurantId }).exec();

    // Delete associated requests
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
}
