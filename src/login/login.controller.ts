import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto, CreateUserDto, UserResponseDto, ForgotPasswordDto, ResetPasswordDto } from '../auth/dto/auth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('🔐 Autenticação')
@Controller('auth')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Fazer login',
    description: 'Autentica o usuário e retorna um token JWT. Use esse token no header Authorization: Bearer <token>',
  })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso. Retorna { token, user }' })
  @ApiResponse({ status: 400, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto) {
    return await this.loginService.login(loginDto);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Cria um novo usuário no sistema. O username e email devem ser únicos.',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Username ou email já existe / dados inválidos' })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.loginService.createUser(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Obter perfil do usuário logado',
    description: 'Retorna os dados do usuário autenticado pelo token JWT.',
  })
  @ApiResponse({ status: 200, description: 'Dados do usuário', type: UserResponseDto })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async getProfile(@Req() req: any): Promise<UserResponseDto> {
    return await this.loginService.getUserById(req.user.id);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Listar todos os usuários (apenas diretor)',
    description: 'Retorna lista de todos os usuários do sistema. Requer role "diretor".',
  })
  @ApiResponse({ status: 200, description: 'Lista de usuários', type: [UserResponseDto] })
  @ApiResponse({ status: 400, description: 'Acesso negado — não é diretor' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async getAllUsers(@Req() req: any): Promise<UserResponseDto[]> {
    if (req.user.role !== 'diretor') {
      throw new BadRequestException('Acesso negado. Apenas diretores podem acessar esta rota.');
    }

    return await this.loginService.getAllUsers();
  }

  @Post('forgot-password')
  @ApiOperation({
    summary: 'Solicitar recuperação de senha',
    description: 'Envia um token de recuperação para o email informado. O token expira em 1 hora. (⚠️ Envio de email ainda não implementado — token aparece no console do servidor)',
  })
  @ApiResponse({ status: 200, description: 'Mensagem genérica (não revela se email existe)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.loginService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Redefinir senha com token',
    description: 'Redefine a senha do usuário usando o token de recuperação. O token deve ser válido e não ter expirado (1h).',
  })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.loginService.resetPassword(dto.token, dto.newPassword);
  }
}
