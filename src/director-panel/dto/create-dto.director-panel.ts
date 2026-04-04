import { IsString, IsObject, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRolePermissionDto {
  @ApiProperty({ example: 'professor', description: 'Nome do cargo', enum: ['diretor', 'professor', 'psicologo', 'cadastrador de empresas'] })
  @IsString()
  role: string;

  @ApiProperty({
    example: { view_students: true, create_students: true, edit_students: false, delete_students: false },
    description: 'Objeto com permissões (chave: nome da permissão, valor: true/false)',
  })
  @IsObject()
  permissions: Record<string, boolean>;
}

export class CreateUserSpecificPermissionDto {
  @ApiProperty({ example: 2, description: 'ID do usuário' })
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: { view_students: true, delete_students: true },
    description: 'Permissões específicas do usuário (sobrepõem as do cargo)',
  })
  @IsObject()
  permissions: Record<string, boolean>;
}