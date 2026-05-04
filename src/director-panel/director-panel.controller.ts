import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, 
  UseGuards, ParseIntPipe 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DirectorPanelService } from './director-panel.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { DirectorGuard } from '../auth/guards/director.guard';
import { CreateRolePermissionDto, CreateUserSpecificPermissionDto } from './dto/create-dto.director-panel';
import { UpdatePermissionsDto, UpdateGlobalNotificationsDto } from './dto/update-dto.director-panel';

@ApiTags('🎛️ Painel do Diretor')
@ApiBearerAuth('JWT')
@Controller('api')
@UseGuards(JwtAuthGuard, DirectorGuard)
export class DirectorPanelController {
  constructor(private readonly service: DirectorPanelService) {}

  // ================= ROLE PERMISSIONS =================
  @Get('rolePermissions')
  @ApiOperation({ summary: 'Listar permissões de cargo', description: 'Retorna permissões de todos os cargos ou de um cargo específico via query. **Requer role diretor.**' })
  @ApiQuery({ name: 'role', required: false, description: 'Filtrar por cargo', example: 'professor' })
  @ApiResponse({ status: 200, description: 'Lista de permissões de cargo' })
  getRolePermissions(@Query('role') role?: string) {
    return this.service.findAllRolePermissions(role);
  }

  @Post('rolePermissions')
  @ApiOperation({ summary: 'Criar permissões de cargo', description: 'Cria um novo registro de permissões para um cargo. **Apenas diretor.**' })
  @ApiResponse({ status: 201, description: 'Permissões do cargo criadas' })
  @ApiResponse({ status: 400, description: 'Acesso negado ou cargo já existe' })
  createRolePermission(@Body() dto: CreateRolePermissionDto) {
    return this.service.createRolePermission(dto);
  }

  @Patch('rolePermissions/:id')
  @ApiOperation({ summary: 'Atualizar permissões de cargo', description: 'Atualiza as permissões de um cargo pelo ID do registro. **Apenas diretor.**' })
  @ApiParam({ name: 'id', description: 'ID do registro de permissões do cargo', example: 1 })
  @ApiResponse({ status: 200, description: 'Permissões atualizadas' })
  updateRolePermission(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionsDto) {
    return this.service.updateRolePermission(id, dto);
  }

  @Delete('rolePermissions/:id')
  @ApiOperation({ summary: 'Deletar permissões de cargo', description: 'Remove o registro de permissões de um cargo. **Apenas diretor. Ação irreversível.**' })
  @ApiParam({ name: 'id', description: 'ID do registro', example: 1 })
  @ApiResponse({ status: 200, description: 'Permissões deletadas' })
  deleteRolePermission(@Param('id', ParseIntPipe) id: number) {
    return this.service.deleteRolePermission(id);
  }

  // ================= USER SPECIFIC PERMISSIONS =================
  @Get('userSpecificPermissions')
  @ApiOperation({ summary: 'Listar permissões específicas de usuários', description: 'Retorna permissões específicas de todos os usuários ou de um usuário específico. **Apenas diretor.**' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filtrar por ID do usuário', example: '2' })
  @ApiResponse({ status: 200, description: 'Lista de permissões específicas' })
  getUserPermissions(@Query('userId') userId?: string) {
    return this.service.findAllUserPermissions(userId ? parseInt(userId, 10) : undefined);
  }

  @Post('userSpecificPermissions')
  @ApiOperation({ summary: 'Criar permissões específicas de usuário', description: 'Cria permissões que sobrepõem as do cargo para um usuário. **Apenas diretor.**' })
  @ApiResponse({ status: 201, description: 'Permissões específicas criadas' })
  createUserPermission(@Body() dto: CreateUserSpecificPermissionDto) {
    return this.service.createUserPermission(dto);
  }

  @Patch('userSpecificPermissions/:id')
  @ApiOperation({ summary: 'Atualizar permissões específicas de usuário', description: 'Atualiza as permissões específicas pelo ID do registro. **Apenas diretor.**' })
  @ApiParam({ name: 'id', description: 'ID do registro de permissões específicas', example: 1 })
  @ApiResponse({ status: 200, description: 'Permissões específicas atualizadas' })
  updateUserPermission(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionsDto) {
    return this.service.updateUserPermission(id, dto);
  }

  // ================= GLOBAL NOTIFICATIONS =================
  @Get('globalNotifications')
  @ApiOperation({ summary: 'Obter notificações globais', description: 'Retorna as notificações globais do sistema. **Apenas diretor.**' })
  @ApiResponse({ status: 200, description: 'Notificações globais' })
  getGlobalNotifications() {
    return this.service.getGlobalNotifications();
  }

  @Patch('globalNotifications/:id')
  @ApiOperation({ summary: 'Atualizar notificações globais', description: 'Atualiza as notificações globais do sistema. **Apenas diretor.**' })
  @ApiParam({ name: 'id', description: 'ID do registro de notificações (geralmente 1)', example: 1 })
  @ApiResponse({ status: 200, description: 'Notificações atualizadas' })
  updateGlobalNotifications(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGlobalNotificationsDto) {
    return this.service.updateGlobalNotifications(id, dto);
  }
}