import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductVariant } from '~/modules/products/product-variants/entities/product-variant.entity';

@Injectable()
export class ProductVariantsService {
  constructor(@InjectModel(ProductVariant.name) private productVariantModel: Model<ProductVariant>) {}

  findAll() {
    return this.productVariantModel.find().sort({ createdAt: -1 }).limit(12).exec();
  }

  syncCollection() {
    return this.productVariantModel
      .updateMany({}, [
        {
          $set: {
            createdAt: {
              $cond: {
                if: { $isNumber: '$createdAt' },
                then: { $toDate: '$createdAt' },
                else: '$createdAt',
              },
            },
          },
        },
        {
          $unset: ['_hidden'],
        },
      ])
      .exec();
  }
}
