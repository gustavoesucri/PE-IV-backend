import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from './role-permission.entity';
import { UserSpecificPermission } from './user-specific-permission.entity';
import { PermissionsService } from './permissions.service';
// Controller removido daqui

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission, UserSpecificPermission]),
  ],
  // controllers: [PermissionsController], <-- Remova ou comente esta linha
  providers: [PermissionsService],
  exports: [PermissionsService], // Mantemos o service exportado caso outros módulos precisem ler permissões internamente
})
export class PermissionsModule {}