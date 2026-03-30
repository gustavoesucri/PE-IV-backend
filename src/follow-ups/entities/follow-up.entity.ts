import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';

@Entity('follow_ups')
export class FollowUp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'aluno_id' })
  alunoId: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aluno_id' })
  student: Student;

  @Column({ type: 'date', name: 'data_visita' })
  dataVisita: string;

  @Column({ type: 'varchar', length: 255, name: 'contato_com' })
  contatoCom: string;

  @Column({ type: 'text' })
  parecer: string;

  @Column({ type: 'date', name: 'data_registro' })
  dataRegistro: string;

  @Column({ type: 'int', nullable: true, name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
