import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type AdminDocument = Admin & Document;

@Schema({ timestamps: true })
export class Admin {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: 'admin' })
  role: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: null })
  restaurantId: mongoose.Types.ObjectId;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

