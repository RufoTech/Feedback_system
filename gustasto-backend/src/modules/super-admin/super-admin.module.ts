import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { Restaurant, RestaurantSchema } from '../restaurants/schemas/restaurant.schema';
import { Admin, AdminSchema } from '../auth/schemas/admin.schema';
import { Table, TableSchema } from '../restaurants/schemas/table.schema';
import { Request, RequestSchema } from '../requests/schemas/request.schema';
import { AuthModule } from '../auth/auth.module';
import { R2UploadService } from '../requests/r2-upload.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Restaurant.name, schema: RestaurantSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Table.name, schema: TableSchema },
      { name: Request.name, schema: RequestSchema },
    ]),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, R2UploadService],
  exports: [SuperAdminService],
})
export class SuperAdminModule {}
