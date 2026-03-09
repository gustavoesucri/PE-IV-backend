import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RolePermission } from '../permissions/role-permission.entity';
import { UserSpecificPermission } from '../permissions/user-specific-permission.entity';
import { GlobalNotification } from './entity/director-panel.entity'; 
import { CreateRolePermissionDto, CreateUserSpecificPermissionDto } from './dto/create-dto.director-panel';
import { UpdatePermissionsDto, UpdateGlobalNotificationsDto } from './dto/update-dto.director-panel';

@Injectable()
export class DirectorPanelService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermRepo: Repository<RolePermission>,
    @InjectRepository(UserSpecificPermission)
    private userPermRepo: Repository<UserSpecificPermission>,
    @InjectRepository(GlobalNotification)
    private globalNotifRepo: Repository<GlobalNotification>,
  ) {}

  // ================= ROLE PERMISSIONS =================
  async createRolePermission(dto: CreateRolePermissionDto) {
    const newRole = this.rolePermRepo.create(dto);
    return this.rolePermRepo.save(newRole);
  }

  async findAllRolePermissions(role?: string) {
    if (role) return this.rolePermRepo.find({ where: { role } });
    return this.rolePermRepo.find();
  }

  async updateRolePermission(id: number, dto: UpdatePermissionsDto) {
    // Correção do JSONB aplicada aqui
    await this.rolePermRepo.update(id, { permissions: dto.permissions });
    const role = await this.rolePermRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Cargo não encontrado');
    return role;
  }

  // 🚨 O MÉTODO QUE ESTAVA FALTANDO VOLTOU AQUI 🚨
  async deleteRolePermission(id: number) {
    return this.rolePermRepo.delete(id);
  }

  // ================= USER SPECIFIC PERMISSIONS =================
  async createUserPermission(dto: CreateUserSpecificPermissionDto) {
    const newPerm = this.userPermRepo.create(dto);
    return this.userPermRepo.save(newPerm);
  }

  async findAllUserPermissions(userId?: number) {
    if (userId) return this.userPermRepo.find({ where: { userId } });
    return this.userPermRepo.find();
  }

  async updateUserPermission(id: number, dto: UpdatePermissionsDto) {
    // Correção do JSONB aplicada aqui
    await this.userPermRepo.update(id, { permissions: dto.permissions });
    const perm = await this.userPermRepo.findOne({ where: { id } });
    if (!perm) throw new NotFoundException('Permissão específica não encontrada');
    return perm;
  }

  // ================= GLOBAL NOTIFICATIONS =================
  async getGlobalNotifications() {
    let config = await this.globalNotifRepo.findOne({ where: { id: 1 } });
    if (!config) {
      config = this.globalNotifRepo.create({
        id: 1,
        notifications: { new_student: true, new_evaluation: true, new_observation: true, user_created: true }
      });
      await this.globalNotifRepo.save(config);
    }
    return [config]; 
  }

  async updateGlobalNotifications(id: number, dto: UpdateGlobalNotificationsDto) {
    await this.globalNotifRepo.update(id, dto);
    return this.globalNotifRepo.findOne({ where: { id } });
  }
}