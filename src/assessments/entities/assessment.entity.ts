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
import { User } from '../../users/entities/user.entity';

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

  // ── Questões de múltipla escolha (q1–q46) ──────────────────────────
  @Column({ type: 'varchar', length: 20, nullable: true }) q1: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q2: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q3: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q4: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q5: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q6: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q7: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q8: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q9: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q10: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q11: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q12: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q13: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q14: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q15: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q16: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q17: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q18: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q19: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q20: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q21: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q22: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q23: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q24: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q25: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q26: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q27: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q28: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q29: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q30: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q31: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q32: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q33: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q34: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q35: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q36: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q37: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q38: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q39: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q40: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q41: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q42: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q43: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q44: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q45: string;
  @Column({ type: 'varchar', length: 20, nullable: true }) q46: string;

  // ── Questões abertas (openQ1–openQ3) ────────────────────────────────
  @Column({ type: 'text', nullable: true, name: 'open_q1' }) openQ1: string;
  @Column({ type: 'text', nullable: true, name: 'open_q2' }) openQ2: string;
  @Column({ type: 'text', nullable: true, name: 'open_q3' }) openQ3: string;

  @Column({ type: 'int', nullable: true, name: 'registered_by' })
  registeredBy: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'registered_by' })
  registeredByUser: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
