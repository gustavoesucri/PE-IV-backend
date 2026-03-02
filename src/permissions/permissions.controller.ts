import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { PermissionsService } from './permissions.service';

@Controller('api')
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}

  /**
   * GET /api/rolePermissions?role=diretor
   * Busca permissões por role
   */
  @Get('rolePermissions')
  async getRolePermissions(@Query('role') role: string) {
    if (!role) {
      throw new BadRequestException('role é obrigatório');
    }

    const permissions = await this.permissionsService.getRolePermissions(role);

    if (!permissions) {
      // Retorna permissões padrão vazias
      return [];
    }

    return [permissions]; // Retorna como array para compatibilidade
  }

  /**
   * GET /api/userSpecificPermissions?userId=1
   * Busca permissões específicas do usuário
   */
  @Get('userSpecificPermissions')
  async getUserPermissions(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    const userIdNum = parseInt(userId, 10);
    const permissions = await this.permissionsService.getUserPermissions(userIdNum);

    if (!permissions) {
      return [];
    }

    return [permissions]; // Retorna como array
  }
}
