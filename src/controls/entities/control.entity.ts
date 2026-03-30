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

@Entity('controls')
export class Control {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'date', name: 'data_ingresso', nullable: true })
  dataIngresso: string;

  @Column({ type: 'date', name: 'data_entrevista1', nullable: true })
  dataEntrevista1: string;

  @Column({ type: 'date', name: 'data_entrevista2', nullable: true })
  dataEntrevista2: string;

  @Column({ type: 'date', name: 'data_resultado', nullable: true })
  dataResultado: string;

  @Column({ type: 'varchar', length: 50, default: 'Pendente' })
  resultado: string;

  @Column({ type: 'int', nullable: true, name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
