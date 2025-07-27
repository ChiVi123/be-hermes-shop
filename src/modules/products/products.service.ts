import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { CreateProductDto } from '~/modules/products/dto/create-product.dto';
import { UpdateProductDto } from '~/modules/products/dto/update-product.dto';
import { Product } from '~/modules/products/entities/product.entity';

// const AGGREGATE_LIMIT = 12;
const AGGREGATE_LIMIT = 2;
const AGGREGATE_LOOKUP_VARIANTS: PipelineStage = {
  $lookup: {
    from: 'product_variants',
    localField: '_id',
    foreignField: 'productId',
    as: 'variants',
  },
};
const SELECT_PRODUCT_FIELDS = {
  _id: 1,
  name: 1,
  slugify: 1,
  shortDescription: 1,
  gender: 1,
};
const SELECT_VARIANT_FIELDS = {
  _id: 1,
  color: 1,
  price: 1,
  discountPrice: 1,
  sizes: 1,
};

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  // TODO: Implement query parameters for pagination, sorting, filtering, etc.
  findAll() {
    return this.productModel
      .aggregate([
        AGGREGATE_LOOKUP_VARIANTS,
        {
          $addFields: {
            variant: { $arrayElemAt: ['$variants', 0] }, // Get the first variant for each product
          },
        },
        {
          $project: {
            ...SELECT_PRODUCT_FIELDS,
            variant: SELECT_VARIANT_FIELDS,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $limit: AGGREGATE_LIMIT,
        },
      ])
      .exec();
  }

  async findOneBySlugify(slugify: string) {
    const result = await this.productModel
      .aggregate([
        { $match: { slugify } },
        AGGREGATE_LOOKUP_VARIANTS,
        {
          $project: {
            ...SELECT_PRODUCT_FIELDS,
            attrs: 1,
            variants: SELECT_VARIANT_FIELDS,
          },
        },
      ])
      .exec();
    return result.length > 0 ? (result[0] as unknown) : null;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: string) {
    return `This action removes a #${id} product`;
  }
}
