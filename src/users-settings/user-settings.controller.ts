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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { UserSettingsService } from './user-settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('⚙️ Configurações')
@ApiBearerAuth('JWT')
@Controller('user-settings')
@UseGuards(JwtAuthGuard)
export class UserSettingsController {
  constructor(private userSettingsService: UserSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Buscar configurações por userId', description: 'Retorna as configurações do usuário (widgets, sidebar, notas, etc). Apenas o próprio usuário ou diretor. Retorna array para compatibilidade com o frontend.' })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', example: '1', required: true })
  @ApiResponse({ status: 200, description: 'Array com configurações do usuário (ou array vazio)' })
  @ApiResponse({ status: 400, description: 'Acesso negado' })
  async getByUserId(@Query('userId') userId: string, @Req() req: any) {
    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    const userIdNum = parseInt(userId, 10);

    // Verificar se é o próprio usuário ou diretor
    if (req.user?.id !== userIdNum && req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    const settings = await this.userSettingsService.getByUserId(userIdNum);

    if (!settings) {
      return [];
    }

    return [settings];
  }

  @Post()
  @ApiOperation({ summary: 'Criar configurações de usuário', description: 'Cria as configurações padrão para um novo usuário. Apenas o próprio usuário ou diretor.' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['userId'],
      properties: { userId: { type: 'number', example: 1, description: 'ID do usuário' } },
    },
  })
  @ApiResponse({ status: 201, description: 'Configurações criadas com sucesso' })
  @ApiResponse({ status: 400, description: 'Acesso negado ou userId é obrigatório' })
  async create(@Body() body: any, @Req() req: any) {
    if (!body.userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    // Verificar se é o próprio usuário ou diretor
    if (req.user?.id !== body.userId && req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso negado');
    }

    console.log('📝 Criando userSettings para userId:', body.userId);
    const created = await this.userSettingsService.create(body.userId);
    console.log('✅ UserSettings criado com sucesso:', created.id);
    return created;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar configurações', description: 'Atualiza as configurações do usuário (qualquer campo). O próprio usuário ou diretor.' })
  @ApiParam({ name: 'id', description: 'ID do registro em user_settings (não é o userId)', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        sidebarOrder: { type: 'array', items: { type: 'string' }, example: ['students', 'companies', 'assessments'] },
        notes: { type: 'array', items: { type: 'object' }, example: [{ text: 'Lembrete', date: '2025-06-01' }] },
        settings: { type: 'object', example: { theme: 'dark', language: 'pt-BR' } },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Configurações atualizadas' })
  @ApiResponse({ status: 400, description: 'Não encontrado ou acesso negado' })
  async update(
    @Param('id') settingsId: string,
    @Body() updateData: any,
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

    const updated = await this.userSettingsService.updateById(id, updateData);
    return updated;
  }

  @Patch(':id/widget-positions')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Atualizar posições dos widgets', description: 'Atualiza apenas as posições dos widgets no dashboard do usuário.' })
  @ApiParam({ name: 'id', description: 'ID do registro em user_settings', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['widgetPositions'],
      properties: {
        widgetPositions: {
          type: 'object',
          example: { students: { x: 0, y: 0, w: 6, h: 4 }, companies: { x: 6, y: 0, w: 6, h: 4 } },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Posições dos widgets atualizadas' })
  @ApiResponse({ status: 400, description: 'Não encontrado ou acesso negado' })
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
