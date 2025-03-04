import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, FindOptionsOrder, EntityManager } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductFiltersDto } from './dtos/product-filters.dto';
import { CreateProductDto } from './dtos/create.product.dto';
import { ProductResponseDto } from './dtos/product-response.dto';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(productFilters: ProductFiltersDto): Promise<[ProductResponseDto[], number]> { 
    const where: any = {};    
    if (productFilters.name) {
      where.name = Like(`%${productFilters.name}%`);
    }
    where.price = Between(
      productFilters.getMinPrice(), 
      productFilters.getMaxPrice()
    );    
    where.expiration = Between(
      productFilters.getFromDate(), 
      productFilters.getToDate()
    );    
    const order: FindOptionsOrder<Product> = {};
    order[productFilters.sortBy] = productFilters.sortOrder;    
    const [products, total] = await this.productRepository.findAndCount({
      where,
      order,
      skip: (productFilters.page - 1) * productFilters.limit,
      take: productFilters.limit,
      relations: ['uploadBatch.exchangeRates'],
    });
    return [products.map(product => plainToInstance(ProductResponseDto, product, {
      excludeExtraneousValues: true
    })), total];
  }

  async createProducts(manager: EntityManager, products: CreateProductDto[], uploadBatchId: string) : Promise<Product[]> {
    const productsToCreate = products.map(productData =>
      manager.create(Product, {
        name: productData.name,
        price: productData.price,
        expiration: productData.expiration,
        uploadBatchId: uploadBatchId
      })
    );
    return manager.save(productsToCreate);
  }
}