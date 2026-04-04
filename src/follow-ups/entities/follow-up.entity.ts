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
import { User } from '../../users/entities/user.entity';

@Entity('follow_ups')
export class FollowUp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'aluno_id' })
  alunoId: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'aluno_id' })
  student: Student;

  @Column({ type: 'int', nullable: true, name: 'company_id' })
  companyId: number;

  @ManyToOne(() => Company, { nullable: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ type: 'int', nullable: true, name: 'registered_by' })
  registeredBy: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'registered_by' })
  registeredByUser: User;

  @Column({ type: 'int', nullable: true, name: 'responsavel_rh_id' })
  responsavelRhId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'responsavel_rh_id' })
  responsavelRh: User;

  @Column({ type: 'date', nullable: true, name: 'admission_date' })
  admissionDate: string;

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

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
