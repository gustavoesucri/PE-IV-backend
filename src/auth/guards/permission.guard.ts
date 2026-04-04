import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { RolePermission } from '../../permissions/role-permission.entity';
import { UserSpecificPermission } from '../../permissions/user-specific-permission.entity';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(RolePermission)
    private rolePermRepo: Repository<RolePermission>,
    @InjectRepository(UserSpecificPermission)
    private userPermRepo: Repository<UserSpecificPermission>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    // Director has full access
    if (user.role === 'diretor') {
      return true;
    }

    // Check user-specific permissions first (overrides role permissions)
    const userPerm = await this.userPermRepo.findOne({ where: { userId: user.id } });
    if (userPerm) {
      const hasPermission = requiredPermissions.every(
        (perm) => userPerm.permissions[perm] === true,
      );
      if (hasPermission) return true;
    }

    // Check role-based permissions
    const rolePerm = await this.rolePermRepo.findOne({ where: { role: user.role } });
    if (rolePerm) {
      const hasPermission = requiredPermissions.every(
        (perm) => rolePerm.permissions[perm] === true,
      );
      if (hasPermission) return true;
    }

    throw new ForbiddenException('Você não tem permissão para acessar este recurso');
  }
}
