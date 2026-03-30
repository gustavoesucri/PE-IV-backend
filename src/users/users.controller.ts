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
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { UserSettingsService } from '../users-settings/user-settings.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private userSettingsService: UserSettingsService,
  ) {}

  // GET /users  (lista de usuários) - apenas diretor
  @Get()
  @UseGuards(JwtAuthGuard)
  async listAll(@Req() req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }
    return await this.usersService.listAll();
  }

  // POST /users  (criar novo usuário) - apenas diretor
  @Post()
  @UseGuards(JwtAuthGuard)
  async createUser(@Body() body: any, @Req() req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const created = await this.usersService.create(body);

    // Criar userSettings padrão se o serviço estiver disponível
    try {
      if (this.userSettingsService) {
        await this.userSettingsService.create(created.id);
      }
    } catch (e) {
      console.warn('Falha ao criar userSettings automáticas:', e?.message || e);
    }

    const { password, ...rest } = created as any;
    return rest;
  }

  // GET /users/:id  (retorna usuário sem password)
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') idParam: string, @Req() req: any) {
    const id = parseInt(idParam, 10);
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Permite apenas ao próprio usuário ou ao diretor visualizar
    if (req.user?.id !== id && req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const { password, ...rest } = user as any;
    return rest;
  }

  // PATCH /users/:id  (atualiza dados do usuário)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') idParam: string, @Body() body: any, @Req() req: any) {
    const id = parseInt(idParam, 10);

    // Somente o próprio usuário pode atualizar seu perfil (ou diretor)
    if (req.user?.id !== id && req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    // Evitar que role/id sejam alterados indevidamente
    delete body.id;
    if (body.role && req.user.role !== 'diretor') {
      delete body.role;
    }

    const updated = await this.usersService.updateById(id, body);
    const { password, ...rest } = updated as any;
    return rest;
  }

  // POST /users/:id/verify-password
  @Post(':id/verify-password')
  @UseGuards(JwtAuthGuard)
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

  // DELETE /users/:id  (deletar usuário) - apenas diretor
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Param('id') idParam: string, @Req() req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const id = parseInt(idParam, 10);

    // Não permitir deletar o próprio usuário
    if (req.user?.id === id) {
      throw new BadRequestException('Você não pode deletar seu próprio usuário');
    }

    return await this.usersService.deleteById(id);
  }
}

export default UsersController;
