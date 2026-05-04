import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string; // Armazenaremos como hash bcrypt

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, default: 'user' })
  role: string; // diretor, professor, psicologo, cadastrador de empresas

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'token_recuperacao' })
  tokenRecuperacao: string;

  @Column({ type: 'timestamp', nullable: true, name: 'validade_token' })
  validadeToken: Date;

  @Column({ type: 'boolean', default: true, name: 'primeiro_login' })
  primeiroLogin: boolean;

  @Column({ type: 'boolean', default: false, name: 'email_verificado' })
  emailVerificado: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'token_verificacao_email' })
  tokenVerificacaoEmail: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
