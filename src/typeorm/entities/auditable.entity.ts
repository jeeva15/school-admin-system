import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class AuditableEntity {
  @CreateDateColumn({ name: 'created_date' })
  createdDate: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate: Date;

  @Column({ name: 'created_by', nullable: true, type: 'bigint' })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true, type: 'bigint' })
  updatedBy: number;
}
