import { Controller, Get, Post, Body, Param, HttpStatus, HttpCode, Delete } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';

@Controller()
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get('restaurants')
  async getAllRestaurants() {
    return this.restaurantsService.findAllRestaurants();
  }

  @Get('restaurants/:id')
  async getRestaurantById(@Param('id') id: string) {
    return this.restaurantsService.findRestaurantById(id);
  }

  @Get('restaurants/:id/tables')
  async getTablesByRestaurant(@Param('id') id: string) {
    return this.restaurantsService.findTablesByRestaurant(id);
  }

  @Post('restaurants/:id/tables')
  @HttpCode(HttpStatus.CREATED)
  async createTable(
    @Param('id') restaurantId: string,
    @Body('tableNumber') tableNumber: string,
  ) {
    return this.restaurantsService.createTable(restaurantId, tableNumber);
  }

  @Delete('tables/:tableId')
  @HttpCode(HttpStatus.OK)
  async deleteTable(@Param('tableId') tableId: string) {
    return this.restaurantsService.deleteTable(tableId);
  }

  @Get('tables/:tableId')
  async getTableById(@Param('tableId') tableId: string) {
    const table = await this.restaurantsService.findTableById(tableId);
    // Həmçinin restoran məlumatlarını da gətiririk
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
}
