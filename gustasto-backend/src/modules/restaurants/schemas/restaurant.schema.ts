import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RestaurantDocument = Restaurant & Document;

@Schema({ timestamps: true })
export class Restaurant {
  @Prop({ required: true })
  name: string;

  @Prop({ default: '' })
  logo: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  description: string;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
