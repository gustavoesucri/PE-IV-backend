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
} from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Controller('assessments')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAssessmentDto: CreateAssessmentDto) {
    return this.assessmentsService.create(createAssessmentDto);
  }

  @Get()
  findAll() {
    return this.assessmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assessmentsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAssessmentDto: UpdateAssessmentDto,
  ) {
    return this.assessmentsService.update(+id, updateAssessmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.assessmentsService.remove(+id);
  }
}
