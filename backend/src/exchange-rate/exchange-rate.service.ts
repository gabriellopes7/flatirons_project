import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ExchangeRate } from './entities/exchange-rate.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CreateExchangeRateDto } from './dtos/create.exchange-rate.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ExchangeRateService {
    private readonly logger = new Logger(ExchangeRateService.name);
    private readonly currencies = ['brl', 'mxn', 'cad', 'eur', 'gbp'];
    private readonly baseUrl: string;
    private readonly baseCurrency: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.baseUrl = this.configService.get<string>(
            'EXCHANGE_RATE_API_BASE_URL',
            'https://cdn.jsdelivr.net'
        );
        this.baseCurrency = this.configService.get<string>(
            'EXCHANGE_RATE_BASE_CURRENCY',
            'usd'
        ).toLowerCase();
    }

    async fetchCurrentRates(): Promise<ExchangeRate[]> {
        try {
            const apiUrl = `${this.baseUrl}/npm/@fawazahmed0/currency-api@latest/v1/currencies/${this.baseCurrency}.json`;
            const { data } = await firstValueFrom(
                this.httpService.get(apiUrl)
            );
            if (!data || !data[this.baseCurrency]) {
                throw new Error(`Failed to fetch exchange rates: Invalid API response for ${this.baseCurrency}`);
            }
            const rates = data[this.baseCurrency];
            this.logger.log(`Fetched ${rates.length} exchange rates`);
            const filteredRates = this.currencies
                .filter(currency => rates[currency] !== undefined)
                .map(currency => (plainToInstance(ExchangeRate, {
                    currency,
                    rate: rates[currency]
                })));
            return filteredRates;
        } catch (error) {
            this.logger.error(`Error fetching exchange rates: ${error.message}`);
            throw new Error(`Failed to fetch exchange rates: ${error.message}`);
        }
    }

    async saveExchangeRates(manager: EntityManager, rates: ExchangeRate[], batchId: string): Promise<ExchangeRate[]> {
        const exchangeRateEntities = rates.map((rateData) =>
            manager.create(ExchangeRate, { uploadBatchId: batchId, ...rateData })
        );
        if (exchangeRateEntities.length === 0) {
            throw new Error('No exchange rates to save');
        }
        return manager.save(exchangeRateEntities);
    }
}
