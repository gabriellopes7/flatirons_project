import { Expose } from 'class-transformer';

export class GetExchangeRateDto {
  @Expose()
  id: string;

  @Expose()
  currency: string;

  @Expose()
  rate: number;
} 