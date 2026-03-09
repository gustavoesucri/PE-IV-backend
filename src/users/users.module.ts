import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSettingsModule } from '../users-settings/user-settings.module';
import { UserSettingsService } from '../users-settings/user-settings.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserSettingsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

export default UsersModule;
