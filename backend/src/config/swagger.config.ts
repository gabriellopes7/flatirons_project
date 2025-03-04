import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Flatirons API')
    .setDescription('API for Product Management and CSV File Processing')
    .setVersion('1.0')
    .addTag('products', 'Operations related to products')
    .addTag('upload', 'Operations for uploading CSV files')
    .addTag('exchange-rates', 'Operations related to exchange rates')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}; 