import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ unique: true, length: 14 })
  cnpj: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  rua?: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  numero?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bairro?: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  estado?: string;

  @Column({ type: 'varchar', length: 8, nullable: true })
  cep?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
