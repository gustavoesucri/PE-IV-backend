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
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('🎓 Alunos')
@ApiBearerAuth('JWT')
@Controller('students')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions('create_students')
  @ApiOperation({ summary: 'Criar aluno', description: 'Cria um novo aluno no sistema. Requer permissão `create_students`.' })
  @ApiResponse({ status: 201, description: 'Aluno criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos (validação)' })
  @ApiResponse({ status: 403, description: 'Sem permissão create_students' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @Permissions('view_students')
  @ApiOperation({ summary: 'Listar todos os alunos', description: 'Retorna a lista completa de alunos. Requer permissão `view_students`.' })
  @ApiResponse({ status: 200, description: 'Lista de alunos' })
  @ApiResponse({ status: 403, description: 'Sem permissão view_students' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @Permissions('view_students')
  @ApiOperation({ summary: 'Buscar aluno por ID', description: 'Retorna dados de um aluno específico. Requer permissão `view_students`.' })
  @ApiParam({ name: 'id', description: 'ID do aluno', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados do aluno' })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('edit_students')
  @ApiOperation({ summary: 'Atualizar aluno', description: 'Atualiza dados de um aluno. Requer permissão `edit_students`. Apenas os campos enviados serão alterados.' })
  @ApiParam({ name: 'id', description: 'ID do aluno', example: 1 })
  @ApiResponse({ status: 200, description: 'Aluno atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Sem permissão edit_students' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(+id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('delete_students')
  @ApiOperation({ summary: 'Deletar aluno', description: 'Remove um aluno do sistema. Requer permissão `delete_students`. **Ação irreversível.**' })
  @ApiParam({ name: 'id', description: 'ID do aluno', example: 1 })
  @ApiResponse({ status: 204, description: 'Aluno deletado com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão delete_students' })
  @ApiResponse({ status: 404, description: 'Aluno não encontrado' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(+id);
  }
}