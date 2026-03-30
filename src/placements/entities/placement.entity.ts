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
import { Company } from '../../companies/entities/company.entity';

@Entity('placements')
export class Placement {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'student_id' })
  studentId: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ type: 'int', name: 'empresa_id' })
  empresaId: number;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empresa_id' })
  company: Company;

  @Column({ type: 'date', name: 'data_admissao' })
  dataAdmissao: string;

  @Column({ type: 'varchar', length: 255 })
  funcao: string;

  @Column({ type: 'varchar', length: 255, name: 'contato_rh' })
  contatoRh: string;

  @Column({ type: 'date', name: 'data_desligamento' })
  dataDesligamento: string;

  @Column({ type: 'varchar', length: 50, default: 'Ativo' })
  status: string;

  @Column({ type: 'int', nullable: true, name: 'created_by' })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
