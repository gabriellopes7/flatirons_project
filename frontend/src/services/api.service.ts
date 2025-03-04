import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ProductResponse, ProductFilters } from '../types/product.interface';
import { UploadResponse } from '../types/upload-response.interface';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.get<T>(url, config);
  }
  
  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.api.post<T>(url, data, config);
  }

  public async getProducts(filters?: ProductFilters): Promise<AxiosResponse<ProductResponse[]>> {
    const params = new URLSearchParams();    
    if (filters?.name) params.append('name', filters.name);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.fromDate) params.append('fromDate', filters.fromDate);
    if (filters?.toDate) params.append('toDate', filters.toDate);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());    
    return this.api.get<ProductResponse[]>(`/products?${params.toString()}`);
  }

  public async uploadProductsFile(file: File): Promise<AxiosResponse<any>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.api.post('/products/csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async uploadCsvFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);      
      const response = await this.api.post<UploadResponse>('/upload/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer upload do arquivo:', error);
      throw error;
    }
  }

  async checkUploadStatus(batchId: string): Promise<UploadResponse> {
    try {
      const response = await this.api.get<UploadResponse>(`/upload/status/${batchId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao verificar status do upload:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 