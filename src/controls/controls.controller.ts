import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ControlsService } from './controls.service';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('📊 Controle')
@ApiBearerAuth('JWT')
@Controller('controls')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class ControlsController {
  constructor(private readonly controlsService: ControlsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions('create_control')
  @ApiOperation({ summary: 'Criar registro de controle', description: 'Registra um novo controle de entrevista/processo para um aluno. Requer permissão `create_control`.' })
  @ApiResponse({ status: 201, description: 'Controle criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão create_control' })
  create(@Body() createControlDto: CreateControlDto) {
    return this.controlsService.create(createControlDto);
  }

  @Get()
  @Permissions('view_control')
  @ApiOperation({ summary: 'Listar todos os controles', description: 'Retorna a lista de controles de entrevista. Requer permissão `view_control`.' })
  @ApiResponse({ status: 200, description: 'Lista de controles' })
  @ApiResponse({ status: 403, description: 'Sem permissão view_control' })
  findAll() {
    return this.controlsService.findAll();
  }

  @Get(':id')
  @Permissions('view_control')
  @ApiOperation({ summary: 'Buscar controle por ID', description: 'Retorna dados de um controle. Requer permissão `view_control`.' })
  @ApiParam({ name: 'id', description: 'ID do controle', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados do controle' })
  @ApiResponse({ status: 404, description: 'Controle não encontrado' })
  findOne(@Param('id') id: string) {
    return this.controlsService.findOne(+id);
  }

  @Put(':id')
  @Permissions('create_control')
  @ApiOperation({ summary: 'Atualizar controle', description: 'Atualiza dados de um controle (PUT — substitui todos os campos). Requer permissão `create_control`.' })
  @ApiParam({ name: 'id', description: 'ID do controle', example: 1 })
  @ApiResponse({ status: 200, description: 'Controle atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  update(
    @Param('id') id: string,
    @Body() updateControlDto: UpdateControlDto,
  ) {
    return this.controlsService.update(+id, updateControlDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('create_control')
  @ApiOperation({ summary: 'Deletar controle', description: 'Remove um registro de controle. Requer permissão `create_control`. **Ação irreversível.**' })
  @ApiParam({ name: 'id', description: 'ID do controle', example: 1 })
  @ApiResponse({ status: 204, description: 'Controle deletado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  remove(@Param('id') id: string) {
    return this.controlsService.remove(+id);
  }
}
