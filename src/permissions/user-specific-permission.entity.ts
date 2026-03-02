import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('user_specific_permissions')
export class UserSpecificPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, boolean>;
}
