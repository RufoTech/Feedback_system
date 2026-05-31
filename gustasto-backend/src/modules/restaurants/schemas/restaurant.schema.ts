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

  @Prop({
    type: [{
      name: { type: String, required: true },
      address: { type: String, default: '' },
      description: { type: String, default: '' }
    }],
    default: []
  })
  branches: Array<{ _id: any; name: string; address?: string; description?: string }>;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

