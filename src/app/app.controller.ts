import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('🏠 App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check', description: 'Verifica se o servidor está online. Usado pelo frontend para detectar status do servidor.' })
  @ApiResponse({ status: 200, description: 'Servidor online — retorna "Hello World!"' })
  getHello(): string {
    return this.appService.getHello();
  }
}
