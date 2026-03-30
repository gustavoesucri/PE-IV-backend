import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class CreateFollowUpDto {
  @IsInt()
  @IsNotEmpty({ message: 'alunoId é obrigatório' })
  alunoId: number;

  @IsDateString()
  @IsNotEmpty({ message: 'Data da visita é obrigatória' })
  dataVisita: string;

  @IsString()
  @IsNotEmpty({ message: 'Contato com é obrigatório' })
  contatoCom: string;

  @IsString()
  @IsNotEmpty({ message: 'Parecer é obrigatório' })
  parecer: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Data de registro é obrigatória' })
  dataRegistro: string;

  @IsInt()
  @IsOptional()
  createdBy?: number;
}
