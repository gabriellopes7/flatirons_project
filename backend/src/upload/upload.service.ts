import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ExchangeRateService } from 'src/exchange-rate/exchange-rate.service';
import { CsvService } from 'src/csv/csv.service';
import { DataSource, Repository } from 'typeorm';
import { UploadBatch } from './entities/upload-batch.entity';
import { ProductService } from '../product/product.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadResponseDto } from './dtos/upload-response.dto';
import { plainToInstance } from 'class-transformer';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { FileProcessingJobDto } from './dtos/file-processing-job.dto';


@Injectable()
export class UploadService {
    constructor(
        private readonly exchangeRateService: ExchangeRateService,
        private readonly csvService: CsvService,
        private readonly dataSource: DataSource,
        @InjectRepository(UploadBatch)
        private readonly uploadBatchRepository: Repository<UploadBatch>,
        private readonly productService: ProductService,
        @InjectQueue('file-processing') private fileProcessingQueue: Queue
    ) { }

    async uploadFile(file: Express.Multer.File): Promise<UploadResponseDto> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }
        if (file.mimetype !== 'text/csv') {
            throw new BadRequestException('Invalid file type');
        }
        const batch = await this.createBatch(file.originalname);
        if (!batch) {
            throw new BadRequestException('Failed to create batch');
        }
        try {
            await this.fileProcessingQueue.add(
                'process-csv',
                FileProcessingJobDto.fromFileAndBatchId(file, batch.id),
                {
                    removeOnComplete: true
                });
            const uploadResponse = await this.uploadBatchRepository.findOne({
                where: { id: batch.id }
            });
            if (!uploadResponse) {
                throw new NotFoundException('Batch not found');
            }
            return plainToInstance(UploadResponseDto, uploadResponse, {
                excludeExtraneousValues: true
            });
        } catch (error) {
            batch.setStatus('failed');
            batch.setFinishedAt(new Date());
            await this.uploadBatchRepository.save(batch);
            throw new BadRequestException('Failed to process file');
        }
    }

    async processFileInBackground(file: Express.Multer.File, batch: UploadBatch): Promise<UploadBatch> {
        try {
            batch.setStatus('processing');
            await this.uploadBatchRepository.save(batch);
            const products = await this.csvService.parseCsvToProducts(file);
            batch.setTotalRows(products.length);
            await this.uploadBatchRepository.save(batch);
            await this.dataSource.transaction(async (manager) => {
                const exchangeRates = await this.exchangeRateService.fetchCurrentRates();
                await this.exchangeRateService.saveExchangeRates(manager, exchangeRates, batch.id);
                const chunkSize = 1000;
                for (let i = 0; i < products.length; i += chunkSize) {
                    const productChunk = products.slice(i, i + chunkSize);
                    await this.productService.createProducts(manager, productChunk, batch.id);
                    batch.setTotalRows(Math.min(i + chunkSize, products.length));
                    await manager.save(batch);
                }
            });
            batch.setStatus('finished');
            batch.setFinishedAt(new Date());
            await this.uploadBatchRepository.save(batch);
            return batch;
        } catch (error) {
            batch.setStatus('failed');
            batch.setFinishedAt(new Date());
            await this.uploadBatchRepository.save(batch);
            throw error;
        }
    }

    private async createBatch(fileName: string): Promise<UploadBatch> {
        const uploadBatch = await this.uploadBatchRepository.create({
            fileName: fileName,
            status: 'pending' as const,
            totalRows: 0,
            createdAt: new Date(),
            finishedAt: null,
        });
        return this.uploadBatchRepository.save(uploadBatch);
    }

    async getStatus(batchId: string): Promise<UploadResponseDto> {
        const batch = await this.uploadBatchRepository.findOne({
            where: { id: batchId }
        });
        if (!batch) {
            throw new NotFoundException('Batch not found');
        }
        return plainToInstance(UploadResponseDto, batch, {
            excludeExtraneousValues: true
        });
    }
}
