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
  
  @Column({ type: 'varchar', length: 255, nullable: true })
  complemento?: string;
  
  @Column({ type: 'varchar', length: 100, nullable: true })
  bairro?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cidade?: string;

  @Column({ type: 'varchar', length: 2, nullable: true })
  estado?: string;

  @Column({ type: 'varchar', length: 8, nullable: true })
  cep?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'nome_fantasia' })
  nomeFantasia?: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'razao_social' })
  razaoSocial?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefone?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'contato_rh_nome' })
  contatoRhNome?: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'contato_rh_email' })
  contatoRhEmail?: string;

  @Column({ type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
