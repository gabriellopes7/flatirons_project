import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class FileDto {
    @IsNotEmpty()
    @IsString()
    path: string;
  
    @IsNotEmpty()
    @IsString()
    originalname: string;
  
    @IsNotEmpty()
    @IsString()
    mimetype: string;
  
    @IsNotEmpty()
    @IsNumber()
    size: number;
}