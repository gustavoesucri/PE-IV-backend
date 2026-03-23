import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './role-permission.entity';
import { UserSpecificPermission } from './user-specific-permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission, UserSpecificPermission]),
  ],
  controllers: [PermissionsController], // Adicionar o controller
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}