import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

class AcompanhamentoDto {
  @IsBoolean()
  @IsOptional()
  av1?: boolean;

  @IsBoolean()
  @IsOptional()
  av2?: boolean;

  @IsBoolean()
  @IsOptional()
  entrevista1?: boolean;

  @IsBoolean()
  @IsOptional()
  entrevista2?: boolean;

  @IsString()
  @IsOptional()
  @IsIn(['Pendente', 'Aprovado', 'Reprovado', 'Em andamento'])
  resultado?: string;
}

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  cpf: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  dataNascimento: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de ingresso é obrigatória' })
  dataIngresso: string;

  @IsDateString()
  @IsOptional()
  dataDesligamento?: string;

  @IsString()
  @IsOptional()
  @IsIn(['Ativo', 'Inativo'])
  status?: string;

  @IsString()
  @IsOptional()
  observacaoBreve?: string;

  @IsString()
  @IsOptional()
  observacaoDetalhada?: string;

  @ValidateNested()
  @Type(() => AcompanhamentoDto)
  @IsOptional()
  acompanhamento?: AcompanhamentoDto;
}