import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from 'src/product/dtos/create.product.dto';
import { plainToInstance } from 'class-transformer';
import * as csv from 'csv-parser';
import * as fs from 'fs';

@Injectable()
export class CsvService {
    private readonly logger = new Logger(CsvService.name);

    async parseCsvToProducts(file: Express.Multer.File): Promise<CreateProductDto[]> {
        return new Promise((resolve, reject) => {
            const products: any[] = [];            
            fs.createReadStream(file.path)
                .pipe(csv({
                    separator: ';'
                }))
                .on('data', (data) => {
                    try {
                        const validatedData = this.validateAndCleanRow(data);
                        if (validatedData) {
                            products.push(validatedData);
                        }
                    } catch (error) {
                        this.logger.warn(`Error processing row: ${error.message}`);
                    }
                })
                .on('end', () => {
                    this.logger.log(`Processed ${products.length} valid products`);
                    const productDtos = plainToInstance(CreateProductDto, products);
                    fs.unlink(file.path, (err) => {
                        if (err) this.logger.error('Error deleting temp file:', err);
                    });
                    resolve(productDtos);
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    }

    private validateAndCleanRow(data: any): { name: string; price: number; expiration: Date } | null {
        const rawName = data.name || Object.keys(data)[0] || '';
        const rawPrice = data.price || Object.values(data)[0] || '';
        const rawDate = data.expiration || Object.values(data)[1] || '';
        const name = this.cleanProductName(rawName);
        if (!name || name.length < 2) {
            this.logger.warn(`Invalid product name: "${rawName}"`);
            return null;
        }
        const price = this.convertToFloat(rawPrice);
        if (price <= 0) {
            this.logger.warn(`Invalid price: "${rawPrice}"`);
            return null;
        }
        const expiration = this.parseDate(rawDate);
        if (!expiration) {
            this.logger.warn(`Invalid date: "${rawDate}"`);
            return null;
        }        
        return { name, price, expiration };
    }

    private cleanProductName(rawName: string): string {
        if (!rawName || typeof rawName !== 'string') {
            return '';
        }
        let name = rawName;
        const hashIndex = name.indexOf('#(');
        if (hashIndex > 0) {
            name = name.substring(0, hashIndex);
        }
        name = name.replace(/[^\x20-\x7E]/g, '').trim();        
        return name;
    }

    private convertToFloat(priceString: string): number {
        if (!priceString || typeof priceString !== 'string') {
            return 0;
        }
        let cleanPrice = priceString.replace(/[$,£€\s]/g, '');
        cleanPrice = cleanPrice.replace(',', '.');
        const floatValue = parseFloat(cleanPrice);
        return isNaN(floatValue) ? 0 : floatValue;
    }

    private parseDate(dateString: string): Date | null {
        if (!dateString || typeof dateString !== 'string') {
            return null;
        }        
        try {
            const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
            const match = dateString.match(dateRegex);
            if (match) {
                const [, month, day, year] = match;
                const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);                
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
            const fallbackDate = new Date(dateString);
            if (!isNaN(fallbackDate.getTime())) {
                return fallbackDate;
            }            
            return null;
        } catch (error) {
            this.logger.error(`Error parsing date: ${dateString}`, error);
            return null;
        }
    }
}
