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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
