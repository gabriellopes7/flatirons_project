import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { BullModule } from '@nestjs/bullmq';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { FileProcessor } from './file-processor.processor';
import { UploadBatch } from './entities/upload-batch.entity';
import { CsvModule } from '../csv/csv.module';
import { ProductModule } from '../product/product.module';
import { ExchangeRateModule } from '../exchange-rate/exchange-rate.module';
import { multerConfig } from '../config/multer.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadBatch]),
    MulterModule.register(multerConfig),
    BullModule.registerQueue({
      name: 'file-processing',
    }),
    CsvModule,
    ProductModule,
    ExchangeRateModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, FileProcessor],
  exports: [UploadService],
})
export class UploadModule {}
