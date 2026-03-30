import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
  IsObject,
} from 'class-validator';

export class CreateAssessmentDto {
  @IsInt()
  @IsNotEmpty({ message: 'studentId é obrigatório' })
  studentId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de entrada é obrigatória' })
  entryDate: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data da avaliação é obrigatória' })
  assessmentDate: string;

  @IsString()
  @IsNotEmpty({ message: 'Tipo de avaliação é obrigatório' })
  @IsIn(['primeira', 'segunda'], { message: 'Tipo deve ser "primeira" ou "segunda"' })
  evaluationType: string;

  @IsString()
  @IsNotEmpty({ message: 'Nome do professor é obrigatório' })
  professorName: string;

  @IsObject()
  @IsNotEmpty({ message: 'Respostas são obrigatórias' })
  responses: Record<string, string>;

  @IsInt()
  @IsOptional()
  registeredBy?: number;
}
