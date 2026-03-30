import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateControlDto {
  @IsInt()
  @IsNotEmpty({ message: 'studentId é obrigatório' })
  studentId: number;

  @IsDateString()
  @IsOptional()
  dataIngresso?: string;

  @IsDateString()
  @IsOptional()
  dataEntrevista1?: string;

  @IsDateString()
  @IsOptional()
  dataEntrevista2?: string;

  @IsDateString()
  @IsOptional()
  dataResultado?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Aprovado', 'Reprovado', 'Em andamento', 'Pendente'])
  resultado?: string;

  @IsInt()
  @IsOptional()
  createdBy?: number;
}
