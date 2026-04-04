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
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('📝 Avaliações')
@ApiBearerAuth('JWT')
@Controller('assessments')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions('create_assessments')
  @ApiOperation({ summary: 'Criar avaliação', description: 'Registra uma nova avaliação de aluno com 46 questões de múltipla escolha (q1–q46) e 3 abertas (openQ1–openQ3). Requer permissão `create_assessments`.' })
  @ApiResponse({ status: 201, description: 'Avaliação criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão create_assessments' })
  create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentsService.create(createAssessmentDto);
  }

  @Get()
  @Permissions('view_assessments')
  @ApiOperation({ summary: 'Listar todas as avaliações', description: 'Retorna a lista de avaliações. Requer permissão `view_assessments`.' })
  @ApiResponse({ status: 200, description: 'Lista de avaliações' })
  @ApiResponse({ status: 403, description: 'Sem permissão view_assessments' })
  findAll() {
    return this.assessmentsService.findAll();
  }

  @Get('questions')
  @ApiOperation({ summary: 'Listar questões da avaliação', description: 'Retorna as 49 questões (46 múltipla escolha + 3 abertas) cadastradas no banco. Não requer permissão especial, apenas autenticação JWT.' })
  @ApiResponse({ status: 200, description: 'Lista de questões com opções, condições e ordem' })
  findAllQuestions() {
    return this.assessmentsService.findAllQuestions();
  }

  @Get(':id')
  @Permissions('view_assessments')
  @ApiOperation({ summary: 'Buscar avaliação por ID', description: 'Retorna dados de uma avaliação. Requer permissão `view_assessments`.' })
  @ApiParam({ name: 'id', description: 'ID da avaliação', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados da avaliação' })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('create_assessments')
  @ApiOperation({ summary: 'Atualizar avaliação', description: 'Atualiza dados de uma avaliação. Requer permissão `create_assessments`.' })
  @ApiParam({ name: 'id', description: 'ID da avaliação', example: 1 })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  update(
    @Param('id') id: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ) {
    return this.assessmentsService.update(+id, updateAssessmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('create_assessments')
  @ApiOperation({ summary: 'Deletar avaliação', description: 'Remove uma avaliação. Requer permissão `create_assessments`. **Ação irreversível.**' })
  @ApiParam({ name: 'id', description: 'ID da avaliação', example: 1 })
  @ApiResponse({ status: 204, description: 'Avaliação deletada' })
  @ApiResponse({ status: 403, description: 'Sem permissão' })
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(+id);
  }
}
