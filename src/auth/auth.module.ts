import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from '../permissions/role-permission.entity';
import { UserSpecificPermission } from '../permissions/user-specific-permission.entity';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, UserSpecificPermission])],
  providers: [PermissionGuard],
  exports: [PermissionGuard, TypeOrmModule],
})
export class AuthModule {}
