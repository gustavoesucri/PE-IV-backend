import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { FollowUpsService } from './follow-ups.service';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('📋 Acompanhamento')
@ApiBearerAuth('JWT')
@Controller('follow-ups')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class FollowUpsController {
  constructor(private readonly followUpsService: FollowUpsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions('create_follow_up')
  @ApiOperation({ summary: 'Criar acompanhamento', description: 'Registra uma nova visita de acompanhamento do aluno na empresa. Requer permissão `create_follow_up`.' })
  @ApiResponse({ status: 201, description: 'Acompanhamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão create_follow_up' })
  create(@Body() createFollowUpDto: CreateFollowUpDto) {
    return this.followUpsService.create(createFollowUpDto);
  }

  @Get()
  @Permissions('view_follow_up')
  @ApiOperation({ summary: 'Listar todos os acompanhamentos', description: 'Retorna a lista de follow-ups. Requer permissão `view_follow_up`.' })
  @ApiResponse({ status: 200, description: 'Lista de acompanhamentos' })
  @ApiResponse({ status: 403, description: 'Sem permissão view_follow_up' })
  findAll() {
    return this.followUpsService.findAll();
  }

  @Get(':id')
  @Permissions('view_follow_up')
  @ApiOperation({ summary: 'Buscar acompanhamento por ID', description: 'Retorna dados de um acompanhamento. Requer permissão `view_follow_up`.' })
  @ApiParam({ name: 'id', description: 'ID do acompanhamento', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados do acompanhamento' })
  @ApiResponse({ status: 404, description: 'Acompanhamento não encontrado' })
  findOne(@Param('id') id: string) {
    return this.followUpsService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('create_follow_up')
  @ApiOperation({ summary: 'Atualizar acompanhamento', description: 'Atualiza dados de um acompanhamento. Requer permissão `create_follow_up`.' })
  @ApiParam({ name: 'id', description: 'ID do acompanhamento', example: 1 })
  @ApiResponse({ status: 200, description: 'Acompanhamento atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  update(
    @Param('id') id: string,
    @Body() updateFollowUpDto: UpdateFollowUpDto,
  ) {
    return this.followUpsService.update(+id, updateFollowUpDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('create_follow_up')
  @ApiOperation({ summary: 'Deletar acompanhamento', description: 'Remove um acompanhamento. Requer permissão `create_follow_up`. **Ação irreversível.**' })
  @ApiParam({ name: 'id', description: 'ID do acompanhamento', example: 1 })
  @ApiResponse({ status: 204, description: 'Acompanhamento deletado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  remove(@Param('id') id: string) {
    return this.followUpsService.remove(+id);
  }
}
