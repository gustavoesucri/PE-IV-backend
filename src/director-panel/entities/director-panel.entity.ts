import { Entity, PrimaryColumn, Column } from 'typeorm';

// Tabela de Notificações Globais
@Entity('global_notifications')
export class GlobalNotification {
  @PrimaryColumn({ default: 1 })
  id: number;

  @Column({ type: 'jsonb', default: {} })
  notifications: Record<string, boolean>;
}