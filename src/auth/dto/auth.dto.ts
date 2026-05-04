import { IsString, IsEmail, MinLength, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'Diretor', description: 'Nome de usuário cadastrado' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'admin', description: 'Senha do usuário (mínimo 3 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  password: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'joao_professor', description: 'Nome de usuário (único)' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'joao@escola.com', description: 'Email do usuário (único)' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha (mínimo 3 caracteres)' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @ApiPropertyOptional({ example: 'professor', description: 'Cargo do usuário', enum: ['diretor', 'professor', 'psicologo', 'cadastrador de empresas'] })
  @IsString()
  @IsOptional()
  role?: string = 'user';
}

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'joao_professor' })
  username: string;

  @ApiProperty({ example: 'joao@escola.com' })
  email: string;

  @ApiProperty({ example: 'professor' })
  role: string;

  @ApiProperty({ example: true })
  primeiroLogin: boolean;

  @ApiProperty({ example: false })
  emailVerificado: boolean;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-15T10:30:00.000Z' })
  updatedAt: Date;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'joao@escola.com', description: 'Email cadastrado para recuperação de senha' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'a1b2c3d4e5...', description: 'Token recebido por email (64 caracteres hex)' })
  @IsString()
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;

  @ApiProperty({ example: 'novaSenha123', description: 'Nova senha (mínimo 3 caracteres)' })
  @IsString()
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @MinLength(3, { message: 'Senha deve ter pelo menos 3 caracteres' })
  newPassword: string;
}

export class ChangePasswordFirstLoginDto {
  @ApiProperty({ example: 'NovaSenha123!', description: 'Nova senha (mínimo 8 caracteres, maiúscula, minúscula, número e especial)' })
  @IsString()
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  newPassword: string;

  @ApiPropertyOptional({ example: 'novo@email.com', description: 'Novo email (opcional, para alteração no primeiro login)' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  newEmail?: string;
}

export class VerifyEmailDto {
  @ApiProperty({ example: 'a1b2c3d4e5...', description: 'Token de verificação de email' })
  @IsString()
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;
}
