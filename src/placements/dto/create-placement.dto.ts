import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePlacementDto {
  @ApiProperty({ example: 1, description: 'ID do aluno' })
  @IsInt()
  @IsNotEmpty({ message: 'studentId é obrigatório' })
  studentId: number;

  @ApiProperty({ example: 1, description: 'ID da empresa' })
  @IsInt()
  @IsNotEmpty({ message: 'empresaId é obrigatório' })
  empresaId: number;

  @ApiProperty({ example: '2025-03-01', description: 'Data de admissão (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data de admissão é obrigatória' })
  dataAdmissao: string;

  @ApiProperty({ example: 'Auxiliar Administrativo', description: 'Função/cargo do estágio' })
  @IsString()
  @IsNotEmpty({ message: 'Função é obrigatória' })
  funcao: string;

  @ApiProperty({ example: 'Carolina - rh@empresa.com', description: 'Contato do RH da empresa' })
  @IsString()
  @IsNotEmpty({ message: 'Contato do RH é obrigatório' })
  contatoRh: string;

  @ApiProperty({ example: '2025-12-31', description: 'Data de desligamento (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data de desligamento é obrigatória' })
  dataDesligamento: string;

  @ApiPropertyOptional({ example: '2025-11-30', description: 'Data provável de desligamento' })
  @IsDateString()
  @IsOptional()
  dataProvavelDesligamento?: string;

  @ApiPropertyOptional({ example: 'Término de contrato', description: 'Justificativa do desligamento' })
  @IsString()
  @IsOptional()
  justificativaDesligamento?: string;

  @ApiPropertyOptional({ example: 'Bom desempenho', description: 'Observações gerais' })
  @IsString()
  @IsOptional()
  observacoes?: string;

  @ApiPropertyOptional({ example: 'Ativo', enum: ['Ativo', 'Inativo', 'Finalizado'], default: 'Ativo' })
  @IsString()
  @IsOptional()
  @IsIn(['Ativo', 'Inativo', 'Finalizado'])
  status?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID do usuário que criou o registro' })
  @IsInt()
  @IsOptional()
  createdBy?: number;
}
