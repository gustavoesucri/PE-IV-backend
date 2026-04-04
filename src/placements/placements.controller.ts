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
import { PlacementsService } from './placements.service';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('💼 Encaminhamentos')
@ApiBearerAuth('JWT')
@Controller('placements')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class PlacementsController {
  constructor(private readonly placementsService: PlacementsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions('create_placements')
  @ApiOperation({ summary: 'Criar encaminhamento', description: 'Registra um novo encaminhamento de aluno para empresa (estágio). Requer permissão `create_placements`.' })
  @ApiResponse({ status: 201, description: 'Encaminhamento criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão create_placements' })
  create(@Body() createPlacementDto: CreatePlacementDto) {
    return this.placementsService.create(createPlacementDto);
  }

  @Get()
  @Permissions('view_placements')
  @ApiOperation({ summary: 'Listar todos os encaminhamentos', description: 'Retorna a lista de encaminhamentos. Requer permissão `view_placements`.' })
  @ApiResponse({ status: 200, description: 'Lista de encaminhamentos' })
  @ApiResponse({ status: 403, description: 'Sem permissão view_placements' })
  findAll() {
    return this.placementsService.findAll();
  }

  @Get(':id')
  @Permissions('view_placements')
  @ApiOperation({ summary: 'Buscar encaminhamento por ID', description: 'Retorna dados de um encaminhamento. Requer permissão `view_placements`.' })
  @ApiParam({ name: 'id', description: 'ID do encaminhamento', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados do encaminhamento' })
  @ApiResponse({ status: 404, description: 'Encaminhamento não encontrado' })
  findOne(@Param('id') id: string) {
    return this.placementsService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('create_placements')
  @ApiOperation({ summary: 'Atualizar encaminhamento', description: 'Atualiza dados de um encaminhamento. Requer permissão `create_placements`.' })
  @ApiParam({ name: 'id', description: 'ID do encaminhamento', example: 1 })
  @ApiResponse({ status: 200, description: 'Encaminhamento atualizado' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  update(
    @Param('id') id: string,
    @Body() updatePlacementDto: UpdatePlacementDto,
  ) {
    return this.placementsService.update(+id, updatePlacementDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('delete_placements')
  @ApiOperation({ summary: 'Deletar encaminhamento', description: 'Remove um encaminhamento. Requer permissão `delete_placements`. **Ação irreversível.**' })
  @ApiParam({ name: 'id', description: 'ID do encaminhamento', example: 1 })
  @ApiResponse({ status: 204, description: 'Encaminhamento deletado' })
  @ApiResponse({ status: 403, description: 'Sem permissão delete_placements' })
  remove(@Param('id') id: string) {
    return this.placementsService.remove(+id);
  }
}
