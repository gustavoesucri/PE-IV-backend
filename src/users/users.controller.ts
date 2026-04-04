import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserSettingsService } from '../users-settings/user-settings.service';

@ApiTags('👤 Usuários')
@ApiBearerAuth('JWT')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private userSettingsService: UserSettingsService,
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
  @ApiOperation({ summary: 'Criar novo usuário', description: 'Cria um novo usuário e suas configurações padrão. **Apenas diretor.**' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['username', 'email', 'password'],
      properties: {
        username: { type: 'string', example: 'novo_professor' },
        email: { type: 'string', example: 'professor@escola.com' },
        password: { type: 'string', example: '123456' },
        role: { type: 'string', example: 'professor', enum: ['diretor', 'professor', 'psicologo', 'cadastrador de empresas'] },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Acesso negado ou dados inválidos' })
  async createUser(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const created = await this.usersService.create(body);

    try {
      if (this.userSettingsService) {
        await this.userSettingsService.create(created.id);
      }
    } catch (e: any) {
      console.warn('Falha ao criar userSettings automáticas:', e?.message || e);
    }

    const { password, ...rest } = created as any;
    return rest;
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

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza dados do usuário. O próprio usuário ou diretor. Somente diretor pode alterar role.' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'novo_nome' },
        email: { type: 'string', example: 'novo@email.com' },
        password: { type: 'string', example: 'novaSenha' },
        role: { type: 'string', example: 'professor', description: 'Apenas diretor pode alterar' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Acesso negado' })
  async update(@Param('id') idParam: string, @Body() body: any, @Req() req: any) {
    const id = parseInt(idParam, 10);

    if (req.user?.id !== id && req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    delete body.id;
    if (body.role && req.user.role !== 'diretor') {
      delete body.role;
    }

    const updated = await this.usersService.updateById(id, body);
    const { password, ...rest } = updated as any;
    return rest;
  }

  @Post(':id/verify-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verificar senha do usuário', description: 'Verifica se a senha informada é a senha atual do usuário. Útil antes de permitir alteração de senha.' })
  @ApiParam({ name: 'id', description: 'ID do usuário', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['password'],
      properties: { password: { type: 'string', example: '123' } },
    },
  })
  @ApiResponse({ status: 200, description: '{ ok: true } — senha correta' })
  @ApiResponse({ status: 400, description: 'Senha inválida ou acesso negado' })
  async verifyPassword(@Param('id') idParam: string, @Body() body: { password: string }, @Req() req: any) {
    const id = parseInt(idParam, 10);

    if (req.user?.id !== id && req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const ok = await this.usersService.verifyPassword(id, body.password || '');
    if (!ok) {
      throw new BadRequestException('Senha inválida');
    }

    return { ok: true };
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
