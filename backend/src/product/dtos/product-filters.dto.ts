import { IsOptional, IsString, IsNumber, IsDateString, IsEnum, IsArray, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProductFiltersDto {
  @ApiProperty({
    description: 'Filter products by name (partial search)',
    required: false,
    example: 'Organic'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Minimum product price',
    required: false,
    default: 0,
    example: 5.99
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number = 0;

  @ApiProperty({
    description: 'Maximum product price',
    required: false,
    default: Number.MAX_SAFE_INTEGER,
    example: 50
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number = Number.MAX_SAFE_INTEGER;

  @ApiProperty({
    description: 'Expiration date from (format YYYY-MM-DD)',
    required: false,
    default: '1970-01-01',
    example: '2024-01-01'
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string = '1970-01-01';

  @ApiProperty({
    description: 'Expiration date to (format YYYY-MM-DD)',
    required: false,
    default: '2100-12-31',
    example: '2024-12-31'
  })
  @IsOptional()
  @IsDateString()
  toDate?: string = '2100-12-31';

  @ApiProperty({
    description: 'Field for sorting',
    required: false,
    enum: ['name', 'price', 'expiration'],
    default: 'name'
  })
  @IsOptional()
  @IsEnum(['name', 'price', 'expiration'])
  sortBy?: 'name' | 'price' | 'expiration' = 'name';

  @ApiProperty({
    description: 'Sorting direction',
    required: false,
    enum: ['ASC', 'DESC'],
    default: 'ASC'
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'ASC';

  @ApiProperty({
    description: 'Page number (starting at 1)',
    required: false,
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page (maximum 50)',
    required: false,
    default: 10,
    maximum: 50
  })
  @IsOptional()
  @IsNumber()
  @Max(50)
  @Type(() => Number)
  limit?: number = 10;

  getMinPrice(): number {
    return this.minPrice ?? 0;
  }

  getMaxPrice(): number {
    return this.maxPrice ?? Number.MAX_SAFE_INTEGER;
  }

  getFromDate(): Date {
    return this.fromDate ? new Date(this.fromDate) : new Date('1970-01-01');
  }

  getToDate(): Date {
    return this.toDate ? new Date(this.toDate) : new Date('2100-12-31');
  }
}
