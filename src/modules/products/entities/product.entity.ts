import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop()
  name: string;

  @Prop()
  slugify: string;

  @Prop()
  shortDescription: string;

  @Prop()
  attrs: { key: string; value: string }[];

  @Prop({ enum: ['men', 'women'], default: 'men' })
  gender: 'men' | 'women';

  @Prop({ default: 0 })
  rating: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
