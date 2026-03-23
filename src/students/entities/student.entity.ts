import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  nome: string;

  @Column({ unique: true, length: 11 })
  cpf: string;

  @Column({ type: 'date', name: 'data_nascimento' })
  dataNascimento: string;

  @Column({ type: 'date', name: 'data_ingresso' })
  dataIngresso: string;

  @Column({ type: 'date', name: 'data_desligamento', nullable: true })
  dataDesligamento?: string;

  @Column({ type: 'varchar', length: 50, default: 'Ativo' })
  status: string;

  @Column({ type: 'text', nullable: true, name: 'observacao_breve' })
  observacaoBreve?: string;

  @Column({ type: 'text', nullable: true, name: 'observacao_detalhada' })
  observacaoDetalhada?: string;

  @Column({ type: 'json', nullable: true })
  acompanhamento: {
    av1: boolean;
    av2: boolean;
    entrevista1: boolean;
    entrevista2: boolean;
    resultado: string;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}