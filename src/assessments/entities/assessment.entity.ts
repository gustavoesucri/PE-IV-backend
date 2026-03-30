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

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'date', name: 'entry_date' })
  entryDate: string;

  @Column({ type: 'date', name: 'assessment_date' })
  assessmentDate: string;

  @Column({ type: 'varchar', length: 50, name: 'evaluation_type' })
  evaluationType: string;

  @Column({ type: 'varchar', length: 255, name: 'professor_name' })
  professorName: string;

  @Column({ type: 'jsonb', default: {} })
  responses: Record<string, string>;

  @Column({ type: 'int', nullable: true, name: 'registered_by' })
  registeredBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
