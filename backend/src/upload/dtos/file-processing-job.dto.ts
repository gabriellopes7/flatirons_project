import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type, plainToInstance } from 'class-transformer';
import { FileDto } from './file.dto';

export class FileProcessingJobDto {
  @ValidateNested()
  @Type(() => FileDto)
  file: FileDto;

  @IsNotEmpty()
  @IsString()
  batchId: string;

  static fromFileAndBatchId(file: Express.Multer.File, batchId: string): FileProcessingJobDto {
    const plainObject = {
      file: {
        path: file.path,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      },
      batchId
    };
    return plainToInstance(FileProcessingJobDto, plainObject);
  }
} 