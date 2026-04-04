import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('assessment_questions')
export class AssessmentQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  code: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 20 })
  type: string;

  @Column({ type: 'int', name: 'display_order' })
  displayOrder: number;

  @Column({ type: 'jsonb', nullable: true })
  options: { value: string; label: string }[] | null;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'conditional_field' })
  conditionalField: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'conditional_not_value' })
  conditionalNotValue: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
