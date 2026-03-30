import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Assessment } from './entities/assessment.entity';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private assessmentsRepository: Repository<Assessment>,
  ) {}

  async create(createAssessmentDto: CreateAssessmentDto): Promise<Assessment> {
    // Verificar se já existe avaliação do mesmo tipo para o estudante
    const existing = await this.assessmentsRepository.findOne({
      where: {
        studentId: createAssessmentDto.studentId,
        evaluationType: createAssessmentDto.evaluationType,
      },
    });

    if (existing) {
      const tipo = createAssessmentDto.evaluationType === 'primeira' ? 'primeira' : 'segunda';
      throw new ConflictException(
        `Já existe uma ${tipo} avaliação para este estudante`,
      );
    }

    const assessment = this.assessmentsRepository.create(createAssessmentDto);
    return await this.assessmentsRepository.save(assessment);
  }

  async findAll(): Promise<Assessment[]> {
    return await this.assessmentsRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Assessment> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (!assessment) {
      throw new NotFoundException(`Avaliação com ID ${id} não encontrada`);
    }
    return assessment;
  }

  async update(
    id: number,
    updateAssessmentDto: UpdateAssessmentDto,
  ): Promise<Assessment> {
    const assessment = await this.findOne(id);

    // Se mudou studentId ou evaluationType, verificar duplicata
    if (
      updateAssessmentDto.studentId &&
      updateAssessmentDto.evaluationType &&
      (updateAssessmentDto.studentId !== assessment.studentId ||
        updateAssessmentDto.evaluationType !== assessment.evaluationType)
    ) {
      const existing = await this.assessmentsRepository.findOne({
        where: {
          studentId: updateAssessmentDto.studentId,
          evaluationType: updateAssessmentDto.evaluationType,
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Já existe uma avaliação deste tipo para este estudante',
        );
      }
    }

    Object.assign(assessment, updateAssessmentDto);
    return await this.assessmentsRepository.save(assessment);
  }

  async remove(id: number): Promise<void> {
    const assessment = await this.findOne(id);
    await this.assessmentsRepository.remove(assessment);
  }
}
