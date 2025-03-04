import { Expose } from 'class-transformer';

export class UploadResponseDto {
  @Expose()
  id: string;

  @Expose()
  totalRows: number;
  
  @Expose()
  status: string;

  @Expose()
  createdAt: Date;
  
  @Expose()
  finishedAt: Date;
}
