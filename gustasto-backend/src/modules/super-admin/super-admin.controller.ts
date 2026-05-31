import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminGuard } from '../auth/guards/super-admin.guard';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { R2UploadService } from '../requests/r2-upload.service';

@Controller('super-admin')
@UseGuards(SuperAdminGuard)
export class SuperAdminController {
  constructor(
    private readonly superAdminService: SuperAdminService,
    private readonly r2UploadService: R2UploadService,
  ) {}

  @Get('restaurants')
  async getAllRestaurants() {
    return this.superAdminService.getAllRestaurants();
  }

  @Post('restaurants')
  @HttpCode(HttpStatus.CREATED)
  async createRestaurant(@Body() dto: CreateRestaurantDto) {
    return this.superAdminService.createRestaurant(dto);
  }

  @Put('restaurants/:id')
  async updateRestaurant(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
    return this.superAdminService.updateRestaurant(id, dto);
  }

  @Delete('restaurants/:id')
  @HttpCode(HttpStatus.OK)
  async deleteRestaurant(@Param('id') id: string) {
    return this.superAdminService.deleteRestaurant(id);
  }

  @Get('stats')
  async getStats() {
    return this.superAdminService.getStats();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @HttpCode(HttpStatus.OK)
  async uploadLogo(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Fayl yüklənməyib');
    }
    const url = await this.r2UploadService.uploadFile(file);
    return { url };
  }
}
