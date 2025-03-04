export interface ProductFilters {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  fromDate?: string;
  toDate?: string;
  sortBy?: string | 'name';
  sortOrder?: string | 'ASC';
  page?: number | 1;
  limit?: number | 25;
} 

export interface ExchangeRate {
    id: string;
    currency: string;
    rate: string;
}

export interface UploadBatch {
    id: string;
    exchangeRates: ExchangeRate[];
}

export interface ProductResponse {
    id: string;
    name: string;
    price: string;
    expiration: string;
    createdAt: string;
    uploadBatchId: string;
    uploadBatch: UploadBatch;
}

export interface PaginatedResponse {
    data: ProductResponse[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
