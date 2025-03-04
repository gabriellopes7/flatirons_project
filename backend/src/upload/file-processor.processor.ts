import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { UploadService } from './upload.service';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadBatch } from './entities/upload-batch.entity';

@Processor('file-processing')
export class FileProcessor extends WorkerHost {
  private readonly logger = new Logger(FileProcessor.name);

  constructor(
    private readonly uploadService: UploadService,
    @InjectRepository(UploadBatch)
    private readonly uploadBatchRepository: Repository<UploadBatch>
  ) {
    super();
  }

  async process(job: Job<{ file: Express.Multer.File, batchId: string }>, token?: string): Promise<any> {
    this.logger.log(`Processing CSV file for batch: ${job.data.batchId}`);    
    try {
      const batch = await this.uploadBatchRepository.findOne({
        where: { id: job.data.batchId }
      });      
      if (!batch) {
        throw new Error(`Batch with id ${job.data.batchId} not found`);
      }    
      await this.uploadService.processFileInBackground(
        job.data.file as Express.Multer.File,
        batch   
      );      
      this.logger.log(`Successfully processed batch ${job.data.batchId}`);
    } catch (error) {
      this.logger.error(`Failed to process batch ${job.data.batchId}: ${error.message}`);
      throw error;
    }
  }
} 