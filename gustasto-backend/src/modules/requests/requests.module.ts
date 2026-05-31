import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { Request, RequestSchema } from './schemas/request.schema';
import { Table, TableSchema } from '../restaurants/schemas/table.schema';
import { R2UploadService } from './r2-upload.service';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Request.name, schema: RequestSchema },
      { name: Table.name, schema: TableSchema },
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, R2UploadService],
  exports: [RequestsService],
})
export class RequestsModule {}
