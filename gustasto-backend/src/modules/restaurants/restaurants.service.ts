import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Restaurant, RestaurantDocument } from './schemas/restaurant.schema';
import { Table, TableDocument } from './schemas/table.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name) private restaurantModel: Model<RestaurantDocument>,
    @InjectModel(Table.name) private tableModel: Model<TableDocument>,
  ) {}

  async createRestaurant(name: string, logo: string, address: string, description: string): Promise<RestaurantDocument> {
    const restaurant = new this.restaurantModel({ name, logo, address, description });
    return restaurant.save();
  }

  async findAllRestaurants(): Promise<RestaurantDocument[]> {
    return this.restaurantModel.find().exec();
  }

  async findRestaurantById(id: string): Promise<RestaurantDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Keçərsiz Restoran ID formatı');
    }
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new NotFoundException('Restoran tapılmadı');
    }
    return restaurant;
  }

  async findTablesByRestaurant(restaurantId: string, branchId?: string): Promise<TableDocument[]> {
    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new NotFoundException('Keçərsiz Restoran ID formatı');
    }
    const query: any = { restaurantId: new Types.ObjectId(restaurantId) };
    if (branchId && Types.ObjectId.isValid(branchId)) {
      query.branchId = new Types.ObjectId(branchId);
    }
    return this.tableModel.find(query).exec();
  }

  async createTable(restaurantId: string, tableNumber: string, branchId?: string): Promise<TableDocument> {
    if (!Types.ObjectId.isValid(restaurantId)) {
      throw new NotFoundException('Keçərsiz Restoran ID formatı');
    }
    
    // Yoxlayırıq ki, belə bir restoran var
    const restaurant = await this.restaurantModel.findById(restaurantId).exec();
    if (!restaurant) {
      throw new NotFoundException('Restoran tapılmadı');
    }

    const tableData: any = {
      restaurantId: new Types.ObjectId(restaurantId),
      tableNumber,
    };

    if (branchId && Types.ObjectId.isValid(branchId)) {
      tableData.branchId = new Types.ObjectId(branchId);
    }

    const table = new this.tableModel(tableData);
    const savedTable = await table.save();
    
    // QR kod linkini təyin edirik
    // Müştəri tətbiqi http://localhost:5173 ünvanında işləyəcək
    const qrCodeUrl = `http://localhost:5173/?restaurantId=${restaurantId}&tableId=${savedTable._id}`;
    savedTable.qrCodeUrl = qrCodeUrl;
    return savedTable.save();
  }

  async findTableById(id: string): Promise<TableDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Keçərsiz Masa ID formatı');
    }
    const table = await this.tableModel.findById(id).exec();
    if (!table) {
      throw new NotFoundException('Masa tapılmadı');
    }
    return table;
  }

  async deleteTable(tableId: string): Promise<{ deleted: boolean }> {
    if (!Types.ObjectId.isValid(tableId)) {
      throw new NotFoundException('Keçərsiz Masa ID formatı');
    }
    const result = await this.tableModel.findByIdAndDelete(tableId).exec();
    if (!result) {
      throw new NotFoundException('Masa tapılmadı');
    }
    return { deleted: true };
  }
}
