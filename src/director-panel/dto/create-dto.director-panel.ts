import { IsString, IsObject, IsNumber, IsOptional } from 'class-validator';

export class CreateRolePermissionDto {
  @IsString()
  role: string;

  @IsObject()
  permissions: Record<string, boolean>;
}

export class CreateUserSpecificPermissionDto {
  @IsNumber()
  userId: number;

  @IsObject()
  permissions: Record<string, boolean>;
}