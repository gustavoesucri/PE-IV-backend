import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';

@Injectable()
export class DirectorGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new BadRequestException('Usuário não autenticado');
    }

    if (user.role !== 'diretor') {
      throw new BadRequestException('Acesso restrito ao Diretor');
    }

    return true;
  }
}
