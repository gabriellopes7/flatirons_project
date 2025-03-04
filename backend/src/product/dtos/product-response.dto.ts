import { Expose, Type } from 'class-transformer';
import { UploadBatchDto } from 'src/upload/dtos/get.upload-batch.dto';

export class ProductResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  expiration: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  uploadBatchId: string;

  @Expose()
  @Type(() => UploadBatchDto)
  uploadBatch: UploadBatchDto;
} 