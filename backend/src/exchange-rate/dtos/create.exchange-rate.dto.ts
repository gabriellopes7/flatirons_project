import { IsCurrency, IsNumber, IsString } from "class-validator";
import { IsNotEmpty } from "class-validator";

export class CreateExchangeRateDto {
    @IsString()
    @IsNotEmpty()
    @IsCurrency()
    currency: string;

    @IsNumber()
    @IsNotEmpty()
    rate: number;
}

