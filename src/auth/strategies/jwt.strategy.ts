import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET', 'sua-chave-secreta-mude-em-producao');
    console.log('🔑 JwtStrategy inicializado com:', {
      secret: secret.substring(0, 10) + '...',
      isDefault: secret === 'your-secret-key'
    });
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('🔐 JWT validado:', {
      userId: payload.id,
      username: payload.username,
      role: payload.role
    });
    return { id: payload.id, username: payload.username, role: payload.role };
  }
}

