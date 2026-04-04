import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('🔑 Permissões')
@ApiBearerAuth('JWT')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('role-permissions')
  @ApiOperation({
    summary: 'Obter permissões de um cargo',
    description: 'Retorna as permissões configuradas para um cargo específico. Usado pelo frontend para determinar o que o usuário pode ver/fazer.',
  })
  @ApiQuery({ name: 'role', description: 'Nome do cargo', example: 'professor', required: true })
  @ApiResponse({ status: 200, description: 'Array com as permissões do cargo (ou array vazio se não encontrado)' })
  async getRolePermissions(@Query('role') role: string) {
    console.log(`🔍 Buscando permissões para role: ${role}`);
    try {
      const permissions = await this.permissionsService.getRolePermissions(role);
      console.log('✅ Permissões encontradas:', permissions);
      
      if (!permissions) {
        return [];
      }
      
      return [permissions];
    } catch (error) {
      console.error('❌ Erro ao buscar permissões:', error);
      return [];
    }
  }

  @Get('user-specific-permissions')
  @ApiOperation({
    summary: 'Obter permissões específicas de um usuário',
    description: 'Retorna permissões que foram configuradas individualmente para um usuário. Essas permissões sobrepõem as do cargo.',
  })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', example: '2', required: true })
  @ApiResponse({ status: 200, description: 'Array com as permissões específicas (ou array vazio)' })
  async getUserSpecificPermissions(@Query('userId') userId: string) {
    console.log(`🔍 Buscando permissões específicas para userId: ${userId}`);
    try {
      const permissions = await this.permissionsService.getUserPermissions(parseInt(userId));
      console.log('✅ Permissões específicas encontradas:', permissions);
      
      if (!permissions) {
        return [];
      }
      
      return [permissions];
    } catch (error) {
      console.error('❌ Erro ao buscar permissões específicas:', error);
      return [];
    }
  }
}