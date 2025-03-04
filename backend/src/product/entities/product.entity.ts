import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UploadBatch } from '../../upload/entities/upload-batch.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'date' })
  expiration: Date;

  @Column({name: 'upload_batch_id'})
  uploadBatchId: string;

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @ManyToOne(() => UploadBatch, batch => batch.products, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'upload_batch_id' })
  uploadBatch: UploadBatch;

  setName(name: string): void {
    this.name = name;
  }

  setPrice(price: number): void {
    this.price = price;
  }

  setExpiration(expiration: Date): void {
    this.expiration = expiration;
  }

  setUploadBatchId(uploadBatchId: string): void {
    this.uploadBatchId = uploadBatchId;
  }  
}
