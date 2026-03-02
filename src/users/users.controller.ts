import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Post,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // GET /api/users/:id  (retorna usuário sem password)
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

  // PATCH /api/users/:id  (atualiza dados do usuário)
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

  // POST /api/users/:id/verify-password
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
}

export default UsersController;
