import {
  Controller,
  Get,
  Param,
  Body,
  Post,
  Delete,
  Patch,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserSettingsService } from '../users-settings/user-settings.service';
import { EmailService } from '../email/email.service';

@ApiTags('👤 Usuários')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private userSettingsService: UserSettingsService,
    private emailService: EmailService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Listar todos os usuários', description: 'Retorna lista de todos os usuários (sem password). **Apenas diretor.**' })
  @ApiResponse({ status: 200, description: 'Lista de usuários retornada com sucesso' })
  @ApiResponse({ status: 400, description: 'Acesso negado — não é diretor' })
  async listAll(@Req() req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }
    return await this.usersService.listAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Criar novo usuário', description: 'Cria um novo usuário e suas configurações padrão. Envia email de boas-vindas. **Apenas diretor.**' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['username', 'email', 'password'],
      properties: {
        username: { type: 'string', example: 'novo_professor' },
        email: { type: 'string', example: 'professor@escola.com' },
        password: { type: 'string', example: 'SenhaTemp123!' },
        role: { type: 'string', example: 'professor', enum: ['diretor', 'professor', 'psicologo', 'cadastrador de empresas'] },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso. Email de boas-vindas enviado.' })
  @ApiResponse({ status: 400, description: 'Acesso negado ou dados inválidos' })
  async createUser(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const tempPassword = body.password || 'SenhaTemp123!';
    body.password = tempPassword;

    const created = await this.usersService.create(body);

    try {
      if (this.userSettingsService) {
        await this.userSettingsService.create(created.id);
      }
    } catch (e: any) {
      console.warn('Falha ao criar userSettings automáticas:', e?.message || e);
    }

    // Enviar email de boas-vindas
    try {
      await this.emailService.sendWelcomeEmail(
        created.email,
        created.username,
        tempPassword,
        created.tokenVerificacaoEmail,
      );
      console.log(`📧 Email de boas-vindas enviado para ${created.email}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar email de boas-vindas para ${created.email}:`, error);
    }

    const { password, tokenVerificacaoEmail, ...rest } = created as any;
    return { ...rest, message: 'Usuário criado. Email de boas-vindas enviado.' };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Buscar usuário por ID', description: 'Retorna dados de um usuário (sem password). Apenas o próprio usuário ou diretor.' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados do usuário' })
  @ApiResponse({ status: 400, description: 'Usuário não encontrado ou acesso negado' })
  async getById(@Param('id') idParam: string, @Req() req: any) {
    const id = parseInt(idParam, 10);
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (req.user?.id !== id && req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const { password, ...rest } = user as any;
    return rest;
  }

  @Patch('me/username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar próprio username', description: 'Permite que qualquer usuário autenticado altere apenas o próprio nome de usuário.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['username'],
      properties: {
        username: { type: 'string', example: 'novo_usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Username atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Username inválido ou já existente' })
  async updateOwnUsername(@Body() body: { username: string }, @Req() req: any) {
    const updated = await this.usersService.updateOwnUsername(req.user.id, body.username);
    const { password, tokenVerificacaoEmail, tokenRecuperacao, validadeToken, ...rest } = updated as any;
    return rest;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Deletar usuário', description: 'Remove um usuário do sistema. **Apenas diretor.** Não pode deletar a si mesmo.' })
  @ApiParam({ name: 'id', description: 'ID do usuário a deletar', example: 2 })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 400, description: 'Acesso negado ou tentativa de auto-exclusão' })
  async deleteUser(@Param('id') idParam: string, @Req() req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const id = parseInt(idParam, 10);

    if (req.user?.id === id) {
      throw new BadRequestException('Você não pode deletar seu próprio usuário');
    }

    return await this.usersService.deleteById(id);
  }
}

export default UsersController;
