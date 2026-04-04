import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const OPCOES = ['sim', 'maioria', 'raras', 'nao'] as const;

export class CreateAssessmentDto {
  @ApiProperty({ example: 1, description: 'ID do aluno avaliado' })
  @IsInt()
  @IsNotEmpty({ message: 'studentId é obrigatório' })
  studentId: number;

  @ApiProperty({ example: '2025-02-01', description: 'Data de entrada do aluno (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data de entrada é obrigatória' })
  entryDate: string;

  @ApiProperty({ example: '2025-06-15', description: 'Data da avaliação (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data da avaliação é obrigatória' })
  assessmentDate: string;

  @ApiProperty({ example: 'primeira', enum: ['primeira', 'segunda'], description: 'Tipo da avaliação' })
  @IsString()
  @IsNotEmpty({ message: 'Tipo de avaliação é obrigatório' })
  @IsIn(['primeira', 'segunda'], { message: 'Tipo deve ser "primeira" ou "segunda"' })
  evaluationType: string;

  @ApiProperty({ example: 'Prof. João Silva', description: 'Nome do professor avaliador' })
  @IsString()
  @IsNotEmpty({ message: 'Nome do professor é obrigatório' })
  professorName: string;

  // ── Questões de múltipla escolha (q1–q46) ──────────────────────────
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q1: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q2: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q3: string;
  @ApiProperty({ example: 'maioria', enum: OPCOES }) @IsString() @IsIn(OPCOES) q4: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q5: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q6: string;
  @ApiProperty({ example: 'maioria', enum: OPCOES }) @IsString() @IsIn(OPCOES) q7: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q8: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q9: string;
  @ApiProperty({ example: 'raras', enum: OPCOES }) @IsString() @IsIn(OPCOES) q10: string;
  @ApiProperty({ example: 'raras', enum: OPCOES }) @IsString() @IsIn(OPCOES) q11: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q12: string;
  @ApiProperty({ example: 'raras', enum: OPCOES }) @IsString() @IsIn(OPCOES) q13: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q14: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q15: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q16: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q17: string;
  @ApiProperty({ example: 'raras', enum: OPCOES }) @IsString() @IsIn(OPCOES) q18: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q19: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q20: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q21: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q22: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q23: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q24: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q25: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q26: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q27: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q28: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q29: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q30: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q31: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q32: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q33: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q34: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q35: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q36: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q37: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q38: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q39: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q40: string;
  @ApiProperty({ example: 'raras', enum: OPCOES }) @IsString() @IsIn(OPCOES) q41: string;
  @ApiProperty({ example: 'nao', enum: OPCOES }) @IsString() @IsIn(OPCOES) q42: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q43: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q44: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q45: string;
  @ApiProperty({ example: 'sim', enum: OPCOES }) @IsString() @IsIn(OPCOES) q46: string;

  // ── Questões abertas (openQ1–openQ3) ────────────────────────────────
  @ApiProperty({ example: 'Sim, o aluno demonstra perfil adequado para a instituição.', description: 'Em sua opinião o usuário tem perfil para esta instituição? Por quê?' })
  @IsString()
  @IsNotEmpty({ message: 'openQ1 é obrigatória' })
  openQ1: string;

  @ApiPropertyOptional({ example: 'Quando contrariado por colegas.', description: 'Em que situações demonstra irritações? (obrigatório se q12 ≠ "nao")' })
  @IsString()
  @IsOptional()
  openQ2?: string;

  @ApiPropertyOptional({ example: 'Faz uso de Ritalina.', description: 'Caso o aluno faça uso de medicação. Observações (obrigatório se q27 ou q28 ≠ "nao")' })
  @IsString()
  @IsOptional()
  openQ3?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID do usuário que registrou a avaliação' })
  @IsInt()
  @IsOptional()
  registeredBy?: number;
}
