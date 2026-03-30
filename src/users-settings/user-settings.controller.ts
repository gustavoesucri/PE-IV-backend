import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { UserSettingsService } from './user-settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('user-settings')
export class UserSettingsController {
  constructor(private userSettingsService: UserSettingsService) {}

  /**
   * GET /user-settings?userId=1
   * Busca UserSettings por userId
   */
  @Get()
  async getByUserId(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    const userIdNum = parseInt(userId, 10);
    const settings = await this.userSettingsService.getByUserId(userIdNum);

    if (!settings) {
      // Retorna array vazio (como o JSON-server faz)
      return [];
    }

    return [settings]; // Retorna como array para compatibilidade
  }

  /**
   * POST /user-settings
   * Cria novas UserSettings
   * Não requer autenticação - é chamado após login automático
   */
  @Post()
  async create(@Body() body: any) {
    if (!body.userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    console.log('📝 Criando userSettings para userId:', body.userId);
    const created = await this.userSettingsService.create(body.userId);
    console.log('✅ UserSettings criado com sucesso:', created.id);
    return created;
  }

  /**
   * PATCH /user-settings/:id
   * Atualiza UserSettings pelo ID da tabela user_settings
   * Valida se o usuário pode acessar suas próprias configurações
   */
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') settingsId: string,
    @Body() updateData: any,
    @Req() req: any,
  ) {
    console.log('🔐 PATCH /user-settings/:id recebido', {
      settingsId,
      hasReqUser: !!req.user,
      userId: req.user?.id,
      userRole: req.user?.role,
      updateKeys: Object.keys(updateData)
    });

    const id = parseInt(settingsId, 10);
    const settings = await this.userSettingsService.getById(id);

    if (!settings) {
      console.warn('⚠️ Settings não encontrado:', id);
      throw new BadRequestException('Configurações não encontradas');
    }

    console.log('✅ Settings encontrado:', {
      settingsId: settings.id,
      settingsUserId: settings.userId,
      requestUserId: req.user?.id,
      match: settings.userId === req.user?.id
    });

    // Valida se o usuário pode atualizar seus próprios settings
    if (settings.userId !== req.user.id && req.user.role !== 'diretor') {
      console.error('❌ Acesso negado:', {
        settingsUserId: settings.userId,
        requestUserId: req.user?.id,
        requestRole: req.user?.role
      });
      throw new BadRequestException('Acesso negado');
    }

    const updated = await this.userSettingsService.updateById(id, updateData);
    console.log('✅ Settings atualizado com sucesso:', updated.id);
    return updated;
  }

  /**
   * PATCH /user-settings/:id/widget-positions
   * Atualiza apenas posições dos widgets usando ID da tabela user_settings
   */
  @Patch(':id/widget-positions')
  @UseGuards(JwtAuthGuard)
  async updateWidgetPositions(
    @Param('id') settingsId: string,
    @Body() body: { widgetPositions: Record<string, any> },
    @Req() req: any,
  ) {
    const id = parseInt(settingsId, 10);
    const settings = await this.userSettingsService.getById(id);

    if (!settings) {
      throw new BadRequestException('Configurações não encontradas');
    }

    if (settings.userId !== req.user.id && req.user.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    return await this.userSettingsService.updateWidgetPositionsById(
      id,
      body.widgetPositions,
    );
  }
}
