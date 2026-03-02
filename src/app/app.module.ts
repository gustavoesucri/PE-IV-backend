import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from '../login/login.module';
import { UserSettingsModule } from '../users/user-settings.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UsersModule } from '../users/users.module';
import { User } from '../users/user.entity';
import { UserSettings } from '../users/user-settings.entity';
import { RolePermission } from '../permissions/role-permission.entity';
import { UserSpecificPermission } from '../permissions/user-specific-permission.entity';

@Module({
  imports: [
    // 1. Configuração de variáveis de ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 2. Configuração do TypeORM com PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'postgres'),
        database: configService.get<string>('DB_NAME'), // Nome do banco atual
        
        // Carrega entidades explicitamente
        entities: [User, UserSettings, RolePermission, UserSpecificPermission],
        
        // Sincronização controlada por variável de ambiente (Segurança para Prod)
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',

        // Logging SQL no terminal
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
    }),

    // 3. Módulo de Login com Autenticação JWT
    LoginModule,
    
    // 4. Módulo de Configurações do Usuário
    UserSettingsModule,
    
    // 5. Módulo de Permissões
    PermissionsModule,
    // 6. Módulo de Usuários
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}