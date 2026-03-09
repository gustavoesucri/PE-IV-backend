import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from '../login/login.module'; // Verifique se o caminho está correto
import { UserSettingsModule } from '../users-settings/user-settings.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UsersModule } from '../users/users.module';

// --- IMPORTAÇÕES DO DIRECTOR PANEL ---
import { DirectorPanelModule } from '../director-panel/director-panel.module';
import { GlobalNotification } from '../director-panel/entity/director-panel.entity';

// Importações de entidades existentes
import { User } from '../users/entity/user.entity';
import { UserSettings } from '../users-settings/entity/user-settings.entity';
import { RolePermission } from '../permissions/role-permission.entity';
import { UserSpecificPermission } from '../permissions/user-specific-permission.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME'),
        
        // Adicionamos a GlobalNotification aqui!
        entities: [User, UserSettings, RolePermission, UserSpecificPermission, GlobalNotification],
        
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
    }),

    LoginModule,
    UserSettingsModule,
    PermissionsModule,
    UsersModule,
    
    // Registramos o Módulo do Diretor aqui!
    DirectorPanelModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}