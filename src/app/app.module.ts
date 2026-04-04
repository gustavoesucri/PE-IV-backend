import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from '../login/login.module'; // Verifique se o caminho está correto
import { AuthModule } from '../auth/auth.module';
import { UserSettingsModule } from '../users-settings/user-settings.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UsersModule } from '../users/users.module';
import { StudentsModule } from '../students/students.module';

// --- IMPORTAÇÕES DO DIRECTOR PANEL ---
import { DirectorPanelModule } from '../director-panel/director-panel.module';
import { GlobalNotification } from '../director-panel/entities/director-panel.entity';
import { CompaniesModule } from '../companies/companies.module';
import { PlacementsModule } from '../placements/placements.module';
import { AssessmentsModule } from '../assessments/assessments.module';
import { ControlsModule } from '../controls/controls.module';
import { FollowUpsModule } from '../follow-ups/follow-ups.module';

// Importações de entidades existentes
import { User } from '../users/entities/user.entity';
import { UserSettings } from '../users-settings/entities/user-settings.entity';
import { RolePermission } from '../permissions/role-permission.entity';
import { UserSpecificPermission } from '../permissions/user-specific-permission.entity';
import { Student } from '../students/entities/student.entity';
import { Company } from '../companies/entities/company.entity';
import { Placement } from '../placements/entities/placement.entity';
import { Assessment } from '../assessments/entities/assessment.entity';
import { AssessmentQuestion } from '../assessments/entities/assessment-question.entity';
import { Control } from '../controls/entities/control.entity';
import { FollowUp } from '../follow-ups/entities/follow-up.entity';

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
        
        // Adicionamos a GlobalNotification e Company aqui!
        entities: [User, UserSettings, RolePermission, UserSpecificPermission, GlobalNotification, Student, Company, Placement, Assessment, AssessmentQuestion, Control, FollowUp],
        
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
        logging: configService.get<string>('DB_LOGGING') === 'true',
      }),
    }),

    LoginModule,
    AuthModule,
    UserSettingsModule,
    PermissionsModule,
    UsersModule,
    StudentsModule,
    CompaniesModule,
    PlacementsModule,
    AssessmentsModule,
    ControlsModule,
    FollowUpsModule,
    
    // Registramos o Módulo do Diretor aqui!
    DirectorPanelModule, 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}