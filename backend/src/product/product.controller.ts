import { Controller, Get, Query, UseInterceptors, UsePipes } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductFiltersDto } from './dtos/product-filters.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'List products with filters and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of products returned successfully'
  })
  @Get()
  @UseInterceptors(new TransformInterceptor(ProductResponseDto, true))
  async findAll(@Query() filters: ProductFiltersDto) : Promise<[ProductResponseDto[], number]> {
    return this.productService.findAll(filters);
  }
}
