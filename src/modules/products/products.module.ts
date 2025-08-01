import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '~/modules/products/entities/product.entity';
import { ProductVariantsModule } from '~/modules/products/product-variants/product-variants.module';
import { ProductsController } from '~/modules/products/products.controller';
import { ProductsService } from '~/modules/products/products.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]), ProductVariantsModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
