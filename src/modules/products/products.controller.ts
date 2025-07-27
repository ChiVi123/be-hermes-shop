import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { Public } from '~/decorators/public';
import { CreateProductDto } from '~/modules/products/dto/create-product.dto';
import { UpdateProductDto } from '~/modules/products/dto/update-product.dto';
import { ProductsService } from '~/modules/products/products.service';
import { handleIsMongoId } from '~/utils/validation-error';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Public()
  @Get(':slugify')
  findOne(@Param('slugify') slugify: string) {
    return this.productsService.findOneBySlugify(slugify);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    handleIsMongoId(id, `Invalid product ID: ${id}`);
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    handleIsMongoId(id, `Invalid product ID: ${id}`);
    return this.productsService.remove(id);
  }
}
