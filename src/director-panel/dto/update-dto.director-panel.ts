import { IsObject, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePermissionsDto {
  @ApiPropertyOptional({
    example: { view_students: true, create_students: false },
    description: 'Objeto de permissões a atualizar',
  })
  @IsObject()
  @IsOptional()
  permissions?: Record<string, boolean>;
}

export class UpdateGlobalNotificationsDto {
  @ApiPropertyOptional({
    example: { manutencao_programada: true, aviso_geral: false },
    description: 'Notificações globais (chave: identificador, valor: ativo/inativo)',
  })
  @IsObject()
  @IsOptional()
  notifications?: Record<string, boolean>;
}