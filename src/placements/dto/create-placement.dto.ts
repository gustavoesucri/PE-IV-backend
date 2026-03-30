import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreatePlacementDto {
  @IsInt()
  @IsNotEmpty({ message: 'studentId é obrigatório' })
  studentId: number;

  @IsInt()
  @IsNotEmpty({ message: 'empresaId é obrigatório' })
  empresaId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de admissão é obrigatória' })
  dataAdmissao: string;

  @IsString()
  @IsNotEmpty({ message: 'Função é obrigatória' })
  funcao: string;

  @IsString()
  @IsNotEmpty({ message: 'Contato do RH é obrigatório' })
  contatoRh: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de desligamento é obrigatória' })
  dataDesligamento: string;

  @IsString()
  @IsOptional()
  @IsIn(['Ativo', 'Inativo', 'Finalizado'])
  status?: string;

  @IsInt()
  @IsOptional()
  createdBy?: number;
}
