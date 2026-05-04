import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LoginService } from './login.service';
import { LoginDto, CreateUserDto, UserResponseDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordFirstLoginDto, VerifyEmailDto } from '../auth/dto/auth.dto';
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

  @Get('verify-email')
  @ApiOperation({
    summary: 'Verificar email com token',
    description: 'Verifica o email do usuário usando o token de verificação enviado por email.',
  })
  @ApiQuery({ name: 'token', description: 'Token de verificação de email', example: 'a1b2c3d4e5...' })
  @ApiResponse({ status: 200, description: 'Email verificado com sucesso' })
  @ApiResponse({ status: 400, description: 'Token inválido' })
  async verifyEmail(@Query('token') token: string) {
    return await this.loginService.verifyEmail(token);
  }

  @Post('change-password-first-login')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Alterar senha no primeiro login',
    description: 'Altera a senha obrigatória no primeiro login. Requer autenticação. Validação rigorosa de senha aplicada.',
  })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Senha já alterada anteriormente ou validação falhou' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async changePasswordFirstLogin(@Req() req: any, @Body() dto: ChangePasswordFirstLoginDto) {
    return await this.loginService.changePasswordFirstLogin(req.user.id, dto.newPassword, dto.newEmail);
  }

  @Post('send-verification-email')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Enviar email de verificação',
    description: 'Envia um token de verificação para o email informado. Usado no primeiro login.',
  })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 400, description: 'Email inválido ou já verificado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async sendVerificationEmail(@Req() req: any, @Body('email') email: string) {
    return await this.loginService.sendVerificationEmail(req.user.id, email);
  }

  @Get('check-email-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Verificar status do email do usuário logado',
    description: 'Retorna o status de verificação do email do usuário autenticado.',
  })
  @ApiResponse({ status: 200, description: 'Status do email retornado' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado' })
  async checkEmailStatus(@Req() req: any) {
    return await this.loginService.checkEmailStatus(req.user.id);
  }
}
