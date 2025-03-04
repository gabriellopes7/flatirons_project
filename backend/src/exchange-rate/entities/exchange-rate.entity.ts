import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UploadBatch } from '../../upload/entities/upload-batch.entity';

@Entity()
export class ExchangeRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  currency: string;

  @Column('decimal', { precision: 10, scale: 6 })
  rate: number;

  @Column({name: 'upload_batch_id'})
  uploadBatchId: string;

  @ManyToOne(() => UploadBatch, (batch) => batch.exchangeRates, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'upload_batch_id' })
  uploadBatch: UploadBatch;
}
