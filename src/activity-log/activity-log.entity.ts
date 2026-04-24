import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action!: string;

  @Column()
  entity!: string;

  @Column({ nullable: true })
  entityId!: number;

  @Column({ nullable: true })
   metadata?: string;

  @CreateDateColumn()
  createdAt!: Date;
}