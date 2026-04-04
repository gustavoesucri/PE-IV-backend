import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFollowUpDto {
  @ApiProperty({ example: 1, description: 'ID do aluno acompanhado' })
  @IsInt()
  @IsNotEmpty({ message: 'alunoId é obrigatório' })
  alunoId: number;

  @ApiProperty({ example: '2025-06-10', description: 'Data da visita de acompanhamento (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data da visita é obrigatória' })
  dataVisita: string;

  @ApiProperty({ example: 'Supervisor de estágio', description: 'Com quem foi o contato na visita' })
  @IsString()
  @IsNotEmpty({ message: 'Contato com é obrigatório' })
  contatoCom: string;

  @ApiProperty({ example: 'Aluno demonstra bom desempenho e pontualidade.', description: 'Parecer do acompanhamento' })
  @IsString()
  @IsNotEmpty({ message: 'Parecer é obrigatório' })
  parecer: string;

  @ApiProperty({ example: '2025-06-10', description: 'Data de registro do acompanhamento (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data de registro é obrigatória' })
  dataRegistro: string;

  @ApiPropertyOptional({ example: 1, description: 'ID da empresa' })
  @IsInt()
  @IsOptional()
  companyId?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID do usuário que registrou' })
  @IsInt()
  @IsOptional()
  registeredBy?: number;

  @ApiPropertyOptional({ example: 2, description: 'ID do responsável do RH' })
  @IsInt()
  @IsOptional()
  responsavelRhId?: number;

  @ApiPropertyOptional({ example: '2025-03-01', description: 'Data de admissão do aluno na empresa' })
  @IsDateString()
  @IsOptional()
  admissionDate?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID do usuário criador' })
  @IsInt()
  @IsOptional()
  createdBy?: number;
}
