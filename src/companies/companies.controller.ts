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
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { PermissionGuard } from '../auth/guards/permission.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@ApiTags('🏢 Empresas')
@ApiBearerAuth('JWT')
@Controller('companies')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Permissions('create_companies')
  @ApiOperation({ summary: 'Cadastrar empresa', description: 'Cadastra uma nova empresa parceira. Requer permissão `create_companies`.' })
  @ApiResponse({ status: 201, description: 'Empresa criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos (ex: CNPJ já existe)' })
  @ApiResponse({ status: 403, description: 'Sem permissão create_companies' })
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @Permissions('view_companies')
  @ApiOperation({ summary: 'Listar todas as empresas', description: 'Retorna a lista completa de empresas. Requer permissão `view_companies`.' })
  @ApiResponse({ status: 200, description: 'Lista de empresas' })
  @ApiResponse({ status: 403, description: 'Sem permissão view_companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @Permissions('view_companies')
  @ApiOperation({ summary: 'Buscar empresa por ID', description: 'Retorna dados de uma empresa. Requer permissão `view_companies`.' })
  @ApiParam({ name: 'id', description: 'ID da empresa', example: 1 })
  @ApiResponse({ status: 200, description: 'Dados da empresa' })
  @ApiResponse({ status: 404, description: 'Empresa não encontrada' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(+id);
  }

  @Patch(':id')
  @Permissions('edit_companies')
  @ApiOperation({ summary: 'Atualizar empresa', description: 'Atualiza dados de uma empresa. Requer permissão `edit_companies`.' })
  @ApiParam({ name: 'id', description: 'ID da empresa', example: 1 })
  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão edit_companies' })
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(+id, updateCompanyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('delete_companies')
  @ApiOperation({ summary: 'Deletar empresa', description: 'Remove uma empresa do sistema. Requer permissão `delete_companies`. **Ação irreversível.**' })
  @ApiParam({ name: 'id', description: 'ID da empresa', example: 1 })
  @ApiResponse({ status: 204, description: 'Empresa deletada com sucesso' })
  @ApiResponse({ status: 403, description: 'Sem permissão delete_companies' })
  remove(@Param('id') id: string) {
    return this.companiesService.remove(+id);
  }
}
