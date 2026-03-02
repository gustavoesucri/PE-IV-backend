import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

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

  @Column({ type: 'simple-array', default: '' })
  sidebarOrder: string[];

  @Column({ type: 'jsonb', default: '[]' })
  notes: any[];

  @Column({ type: 'simple-array', default: '' })
  monitoredStudents: string[];

  @Column({ type: 'jsonb', default: '[]' })
  favoriteCompanies: any[];

  @Column({ type: 'jsonb', default: '[]' })
  companies: any[];

  @Column({ type: 'jsonb', default: '{}' })
  settings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
