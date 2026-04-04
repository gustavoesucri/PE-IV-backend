import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsEmail, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Solutions Ltda', description: 'Nome da empresa' })
  @IsString()
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório' })
  nome: string;

  @ApiProperty({ example: '12345678000190', description: 'CNPJ da empresa (14 dígitos, sem pontuação)' })
  @IsString()
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj: string;

  @ApiPropertyOptional({ example: 'Rua das Indústrias' })
  @IsString()
  @IsOptional()
  rua?: string;

  @ApiPropertyOptional({ example: '500' })
  @IsString()
  @IsOptional()
  numero?: string;

  @ApiPropertyOptional({ example: 'Centro' })
  @IsString()
  @IsOptional()
  bairro?: string;

  @ApiPropertyOptional({ example: 'SP', description: '2 letras maiúsculas (UF)' })
  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser 2 letras maiúsculas' })
  estado?: string;

  @ApiPropertyOptional({ example: '01001000', description: '8 dígitos, sem hífen' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos' })
  cep?: string;

  @ApiPropertyOptional({ example: 'TechSol' })
  @IsString()
  @IsOptional()
  nomeFantasia?: string;

  @ApiPropertyOptional({ example: 'Tech Solutions Ltda ME' })
  @IsString()
  @IsOptional()
  razaoSocial?: string;

  @ApiPropertyOptional({ example: '1133445566' })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiPropertyOptional({ example: 'Carolina Mendes', description: 'Nome do contato do RH' })
  @IsString()
  @IsOptional()
  contatoRhNome?: string;

  @ApiPropertyOptional({ example: 'rh@techsol.com.br', description: 'Email do contato do RH' })
  @IsEmail({}, { message: 'Email do contato RH inválido' })
  @IsOptional()
  contatoRhEmail?: string;

  @ApiPropertyOptional({ example: true, default: true, description: 'Se a empresa está ativa' })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;
}
