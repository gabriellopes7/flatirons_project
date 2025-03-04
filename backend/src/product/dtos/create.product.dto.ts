import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDate, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name'
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the product',
    example: 10.00
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The expiration date of the product',
    example: '2024-01-01'
  })
  @IsNotEmpty()
  @IsDate()
  expiration: Date;
}
