import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'jsonb', default: {} })
  widgetPositions: Record<string, any>;

  @Column({ type: 'jsonb', default: '[]' })
  sidebarOrder: string[];

  @Column({ type: 'jsonb', default: '[]' })
  notes: any[];

  @Column({ type: 'jsonb', default: '[]' })
  monitoredStudents: any[];

  @Column({ type: 'jsonb', default: '[]' })
  favoriteCompanies: any[];

  @Column({ type: 'jsonb', default: '[]' })
  companies: any[];

  @Column({ type: 'jsonb', default: '{}' })
  settings: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
