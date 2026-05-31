import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TableDocument = Table & Document;

@Schema({ timestamps: true })
export class Table {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true })
  restaurantId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, default: null, index: true })
  branchId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  tableNumber: string;

  @Prop({ default: '' })
  qrCodeUrl: string;
}

export const TableSchema = SchemaFactory.createForClass(Table);
