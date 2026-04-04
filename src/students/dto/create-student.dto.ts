import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsEmail, ValidateNested, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class AcompanhamentoDto {
  @ApiPropertyOptional({ example: false, description: 'Avaliação 1 realizada' })
  @IsBoolean()
  @IsOptional()
  av1?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Avaliação 2 realizada' })
  @IsBoolean()
  @IsOptional()
  av2?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Entrevista 1 realizada' })
  @IsBoolean()
  @IsOptional()
  entrevista1?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Entrevista 2 realizada' })
  @IsBoolean()
  @IsOptional()
  entrevista2?: boolean;

  @ApiPropertyOptional({ example: 'Pendente', enum: ['Pendente', 'Aprovado', 'Reprovado', 'Em andamento'] })
  @IsString()
  @IsOptional()
  @IsIn(['Pendente', 'Aprovado', 'Reprovado', 'Em andamento'])
  resultado?: string;
}

export class CreateStudentDto {
  @ApiProperty({ example: 'Maria Silva', description: 'Nome completo do aluno' })
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  nome: string;

  @ApiProperty({ example: '12345678901', description: 'CPF do aluno (11 dígitos, sem pontuação)' })
  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  cpf: string;

  @ApiProperty({ example: '2005-03-15', description: 'Data de nascimento (formato YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  dataNascimento: string;

  @ApiProperty({ example: '2025-02-01', description: 'Data de ingresso no programa (formato YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty({ message: 'Data de ingresso é obrigatória' })
  dataIngresso: string;

  @ApiPropertyOptional({ example: '2025-12-31', description: 'Data de desligamento (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  dataDesligamento?: string;

  @ApiPropertyOptional({ example: 'Ativo', enum: ['Ativo', 'Inativo'], default: 'Ativo' })
  @IsString()
  @IsOptional()
  @IsIn(['Ativo', 'Inativo'])
  status?: string;

  @ApiPropertyOptional({ example: 'Aluno dedicado', description: 'Observação breve sobre o aluno' })
  @IsString()
  @IsOptional()
  observacaoBreve?: string;

  @ApiPropertyOptional({ example: 'Mostra interesse em programação...', description: 'Observação detalhada' })
  @IsString()
  @IsOptional()
  observacaoDetalhada?: string;

  @ApiPropertyOptional({ example: '11999887766', description: 'Telefone do aluno' })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({ example: 'maria@email.com', description: 'Email do aluno' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Rua das Flores, 123', description: 'Endereço completo' })
  @IsString()
  @IsOptional()
  endereco?: string;

  @ApiPropertyOptional({ example: 'Ana Silva', description: 'Nome do responsável' })
  @IsString()
  @IsOptional()
  nomeResponsavel?: string;

  @ApiPropertyOptional({ example: '11988776655', description: 'Telefone do responsável' })
  @IsString()
  @IsOptional()
  telefoneResponsavel?: string;

  @ApiPropertyOptional({ example: false, description: 'Aluno usa medicamento?' })
  @IsBoolean()
  @IsOptional()
  usaMedicamento?: boolean;

  @ApiPropertyOptional({ example: 'Ritalina 10mg', description: 'Informações sobre medicamentos' })
  @IsString()
  @IsOptional()
  infoMedicamentos?: string;

  @ApiPropertyOptional({ description: 'Dados de acompanhamento do aluno', type: AcompanhamentoDto })
  @ValidateNested()
  @Type(() => AcompanhamentoDto)
  @IsOptional()
  acompanhamento?: AcompanhamentoDto;
}