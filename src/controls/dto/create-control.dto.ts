import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateControlDto {
  @ApiProperty({ example: 1, description: 'ID do aluno' })
  @IsInt()
  @IsNotEmpty({ message: 'studentId é obrigatório' })
  studentId: number;

  @ApiPropertyOptional({ example: '2025-02-01', description: 'Data de ingresso (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  dataIngresso?: string;

  @ApiPropertyOptional({ example: '2025-03-15', description: 'Data da entrevista 1 (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  dataEntrevista1?: string;

  @ApiPropertyOptional({ example: '2025-04-15', description: 'Data da entrevista 2 (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  dataEntrevista2?: string;

  @ApiPropertyOptional({ example: '2025-05-01', description: 'Data do resultado (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  dataResultado?: string;

  @ApiPropertyOptional({ example: 'Pendente', enum: ['Aprovado', 'Reprovado', 'Em andamento', 'Pendente'], default: 'Pendente' })
  @IsString()
  @IsOptional()
  @IsIn(['Aprovado', 'Reprovado', 'Em andamento', 'Pendente'])
  resultado?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID do usuário que criou o registro' })
  @IsInt()
  @IsOptional()
  createdBy?: number;
}
