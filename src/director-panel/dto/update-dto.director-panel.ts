import { IsObject, IsOptional } from 'class-validator';

export class UpdatePermissionsDto {
  @IsObject()
  @IsOptional()
  permissions?: Record<string, boolean>;
}

export class UpdateGlobalNotificationsDto {
  @IsObject()
  @IsOptional()
  notifications?: Record<string, boolean>;
}