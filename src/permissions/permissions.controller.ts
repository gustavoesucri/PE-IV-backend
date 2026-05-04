import { Controller, Get, Query, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('🔑 Permissões')
@ApiBearerAuth('JWT')
@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  private ensureDirector(req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso restrito ao Diretor');
    }
  }

  @Get('role-permissions')
  @ApiOperation({
    summary: 'Obter permissões de um cargo',
    description: 'Retorna as permissões configuradas para um cargo específico. **Apenas diretor.**',
  })
  @ApiQuery({ name: 'role', description: 'Nome do cargo', example: 'professor', required: true })
  @ApiResponse({ status: 200, description: 'Array com as permissões do cargo (ou array vazio se não encontrado)' })
  @ApiResponse({ status: 400, description: 'Acesso negado' })
  async getRolePermissions(@Query('role') role: string, @Req() req: any) {
    this.ensureDirector(req);
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
    description: 'Retorna permissões que foram configuradas individualmente para um usuário. **Apenas diretor.**',
  })
  @ApiQuery({ name: 'userId', description: 'ID do usuário', example: '2', required: true })
  @ApiResponse({ status: 200, description: 'Array com as permissões específicas (ou array vazio)' })
  @ApiResponse({ status: 400, description: 'Acesso negado' })
  async getUserSpecificPermissions(@Query('userId') userId: string, @Req() req: any) {
    this.ensureDirector(req);
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