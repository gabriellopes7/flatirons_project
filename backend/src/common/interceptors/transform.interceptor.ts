import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance, ClassConstructor } from 'class-transformer';
import { PaginatedResponseDto } from '../dtos/pagination.dto';

@Injectable()
export class TransformInterceptor<T, R> implements NestInterceptor<T, R> {
  constructor(
    private readonly dtoClass: ClassConstructor<R>,
    private readonly isPaginated: boolean = false
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (this.isPaginated) {
          return this.transformPaginated(data, context);
        }
        return this.transform(data);
      }),
    );
  }

  private transform(data: any): R {
    return plainToInstance(this.dtoClass, data, {
      excludeExtraneousValues: true
    });
  }

  private transformPaginated(data: [any[], number], context: ExecutionContext): PaginatedResponseDto<R> {
    const [items, total] = data;
    const request = context.switchToHttp().getRequest();
    const page = Number(request.query.page) || 1;
    const limit = Number(request.query.limit) || 10;    
    return {
      data: items.map(item => this.transform(item)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
} 