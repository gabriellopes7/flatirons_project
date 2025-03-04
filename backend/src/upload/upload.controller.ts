import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Param, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UploadResponseDto } from './dtos/upload-response.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { FileProcessingJobDto } from './dtos/file-processing-job.dto';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiOperation({ summary: 'Upload a CSV file with product data' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File uploadd and processing Started',
    type: UploadResponseDto
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        }
      }
    }
  })
  @Post('csv')
  @UseInterceptors(FileInterceptor('file'), new TransformInterceptor(UploadResponseDto, false))
  async uploadCsv(@UploadedFile() file: Express.Multer.File) : Promise<UploadResponseDto> {    
    const result = await this.uploadService.uploadFile(file);
    return result;
  }

  @ApiOperation({ summary: 'Get the status of a file processing job' })
  @ApiParam({ name: 'batchId', type: 'string', description: 'The ID of the batch to get the status of' })
  @ApiResponse({
    status: 200,
    description: 'The status of the file processing job'
  })
  @Get('status/:batchId')
  async getStatus(@Param('batchId') batchId: string) : Promise<UploadResponseDto> {
    const result = await this.uploadService.getStatus(batchId);
    return result;
  }
}
