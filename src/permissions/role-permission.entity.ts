import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('role_permissions')
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ type: 'jsonb', default: {} })
  permissions: Record<string, boolean>;
}
