import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DirectorPanelController } from './director-panel.controller';
import { DirectorPanelService } from './director-panel.service';
import { GlobalNotification } from './entities/director-panel.entity';
import { RolePermission } from '../permissions/role-permission.entity';
import { UserSpecificPermission } from '../permissions/user-specific-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RolePermission, UserSpecificPermission, GlobalNotification])
  ],
  controllers: [DirectorPanelController],
  providers: [DirectorPanelService],
})
export class DirectorPanelModule {}