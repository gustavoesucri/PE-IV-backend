import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { UserSpecificPermission } from './user-specific-permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserSpecificPermission)
    private userSpecificPermissionRepository: Repository<UserSpecificPermission>,
  ) {}

  /**
   * Busca permissões por role
   */
  async getRolePermissions(role: string): Promise<RolePermission | null> {
    return await this.rolePermissionRepository.findOne({
      where: { role },
    });
  }

  /**
   * Busca permissões específicas do usuário
   */
  async getUserPermissions(userId: number): Promise<UserSpecificPermission | null> {
    return await this.userSpecificPermissionRepository.findOne({
      where: { userId },
    });
  }

  /**
   * Criar permissões padrão para role
   */
  async createRolePermissions(
    role: string,
    permissions: Record<string, boolean>,
  ): Promise<RolePermission> {
    const rolePermission = this.rolePermissionRepository.create({
      role,
      permissions,
    });
    return await this.rolePermissionRepository.save(rolePermission);
  }

  /**
   * Atualizar permissões de um usuário específico
   */
  async createUserPermissions(
    userId: number,
    permissions: Record<string, boolean>,
  ): Promise<UserSpecificPermission> {
    const userPermission = this.userSpecificPermissionRepository.create({
      userId,
      permissions,
    });
    return await this.userSpecificPermissionRepository.save(userPermission);
  }
}
