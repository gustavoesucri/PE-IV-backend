import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { User } from '../users/entity/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { UserSettingsModule } from '../users-settings/user-settings.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // DEPOIS
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>(
          'JWT_SECRET',
          'sua-chave-secreta-mude-em-producao',
        ),
        signOptions: { expiresIn: '24h' },
      }),
    }),
    UserSettingsModule,
  ],
  controllers: [LoginController],
  providers: [LoginService, JwtStrategy],
  exports: [LoginService, JwtModule, PassportModule],
})
export class LoginModule {}
