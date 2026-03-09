import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, 
  UseGuards, Req, BadRequestException, ParseIntPipe 
} from '@nestjs/common';
import { DirectorPanelService } from './director-panel.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateRolePermissionDto, CreateUserSpecificPermissionDto } from './dto/create-dto.director-panel';
import { UpdatePermissionsDto, UpdateGlobalNotificationsDto } from './dto/update-dto.director-panel';

@Controller('api')
@UseGuards(JwtAuthGuard)
export class DirectorPanelController {
  constructor(private readonly service: DirectorPanelService) {}

  private ensureDirector(req: any) {
    if (req.user?.role !== 'diretor') {
      throw new BadRequestException('Acesso restrito ao Diretor');
    }
  }

  // ================= ROLE PERMISSIONS =================
  @Get('rolePermissions')
  getRolePermissions(@Query('role') role?: string) {
    return this.service.findAllRolePermissions(role);
  }

  @Post('rolePermissions')
  createRolePermission(@Req() req: any, @Body() dto: CreateRolePermissionDto) {
    this.ensureDirector(req);
    return this.service.createRolePermission(dto);
  }

  @Patch('rolePermissions/:id')
  updateRolePermission(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionsDto) {
    this.ensureDirector(req);
    return this.service.updateRolePermission(id, dto);
  }

  @Delete('rolePermissions/:id')
  deleteRolePermission(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    this.ensureDirector(req);
    return this.service.deleteRolePermission(id);
  }

  // ================= USER SPECIFIC PERMISSIONS =================
  @Get('userSpecificPermissions')
  getUserPermissions(@Req() req: any, @Query('userId') userId?: string) {
    this.ensureDirector(req);
    return this.service.findAllUserPermissions(userId ? parseInt(userId, 10) : undefined);
  }

  @Post('userSpecificPermissions')
  createUserPermission(@Req() req: any, @Body() dto: CreateUserSpecificPermissionDto) {
    this.ensureDirector(req);
    return this.service.createUserPermission(dto);
  }

  @Patch('userSpecificPermissions/:id')
  updateUserPermission(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePermissionsDto) {
    this.ensureDirector(req);
    return this.service.updateUserPermission(id, dto);
  }

  // ================= GLOBAL NOTIFICATIONS =================
  @Get('globalNotifications')
  getGlobalNotifications(@Req() req: any) {
    this.ensureDirector(req);
    return this.service.getGlobalNotifications();
  }

  @Patch('globalNotifications/:id')
  updateGlobalNotifications(@Req() req: any, @Param('id', ParseIntPipe) id: number, @Body() dto: UpdateGlobalNotificationsDto) {
    this.ensureDirector(req);
    return this.service.updateGlobalNotifications(id, dto);
  }
}