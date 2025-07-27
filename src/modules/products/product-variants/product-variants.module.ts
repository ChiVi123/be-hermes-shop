import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductVariant,
  ProductVariantSchema,
} from '~/modules/products/product-variants/entities/product-variant.entity';
import { ProductVariantsService } from '~/modules/products/product-variants/product-variants.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: ProductVariant.name, schema: ProductVariantSchema }])],
  providers: [ProductVariantsService],
  exports: [ProductVariantsService],
})
export class ProductVariantsModule {}
