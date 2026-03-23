import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('role-permissions')
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