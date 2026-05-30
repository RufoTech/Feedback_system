import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type RequestDocument = Request & Document;

@Schema({ timestamps: true })
export class Request {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true })
  restaurantId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true })
  tableId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  tableNumber: string;

  @Prop({ required: true, enum: ['review', 'suggestion', 'complaint'], index: true })
  type: string;

  @Prop({ required: true })
  text: string;

  @Prop({ default: 0 })
  rating: number; // Star rating (1-5), primarily for review types or quick rating

  @Prop({ default: false })
  isAnonymous: boolean;

  @Prop({ default: '' })
  customerName: string;

  @Prop({ default: '' })
  customerPhone: string;

  @Prop({ default: '' })
  photoUrl: string;

  @Prop({ default: 'pending', enum: ['pending', 'in_progress', 'completed'], index: true })
  status: string;

  createdAt: Date;
  updatedAt: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
