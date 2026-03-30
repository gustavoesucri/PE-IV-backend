import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome da empresa é obrigatório' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @Matches(/^\d{14}$/, { message: 'CNPJ deve conter 14 dígitos' })
  cnpj: string;

  @IsString()
  @IsOptional()
  rua?: string;

  @IsString()
  @IsOptional()
  numero?: string;

  @IsString()
  @IsOptional()
  bairro?: string;

  @IsString()
  @IsOptional()
  @Matches(/^[A-Z]{2}$/, { message: 'Estado deve ser 2 letras maiúsculas' })
  estado?: string;

  @IsString()
  @IsOptional()
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos' })
  cep?: string;
}
