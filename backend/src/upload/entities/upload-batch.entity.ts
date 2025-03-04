import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { ExchangeRate } from '../../exchange-rate/entities/exchange-rate.entity';

@Entity()
export class UploadBatch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({name: 'file_name'})
  fileName: string;

  @Column({name: 'status'})
  status: string;

  @Column({name: 'total_rows'})
  totalRows: number;

  @CreateDateColumn({name: 'created_at', default: new Date()})
  createdAt: Date;

  @UpdateDateColumn({name: 'finished_at', default: null})
  finishedAt: Date;

  @OneToMany(() => Product, product => product.uploadBatch, { onDelete: 'CASCADE' })
  products: Product[];

  @OneToMany(() => ExchangeRate, rate => rate.uploadBatch, { onDelete: 'CASCADE' })
  exchangeRates: ExchangeRate[];

  setTotalRows(totalRows: number) {
    this.totalRows = totalRows;
  }

  setStatus(status: string) {
    this.status = status;
  }

  setFinishedAt(finishedAt: Date) {
    this.finishedAt = finishedAt;
  }
}
