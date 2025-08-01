import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductVariantDocument = HydratedDocument<ProductVariant>;

@Schema({ collection: 'product_variants', timestamps: true })
export class ProductVariant {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Prop()
  color: string;

  @Prop()
  price: number;

  @Prop()
  discountPrice: number;

  @Prop()
  sizes: { size: string; stock: number }[];

  @Prop()
  imageIds: string[];
}

export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);
