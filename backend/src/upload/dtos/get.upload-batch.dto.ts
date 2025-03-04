import { Expose, Type } from "class-transformer";
import { GetExchangeRateDto } from "src/exchange-rate/dtos/get.exchange-rate.dto";

export class UploadBatchDto {
    @Expose()
    id: string;
    
    @Expose()
    @Type(() => GetExchangeRateDto)
    exchangeRates: GetExchangeRateDto[];
  }