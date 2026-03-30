import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Placement } from './entities/placement.entity';
import { CreatePlacementDto } from './dto/create-placement.dto';
import { UpdatePlacementDto } from './dto/update-placement.dto';

@Injectable()
export class PlacementsService {
  constructor(
    @InjectRepository(Placement)
    private placementsRepository: Repository<Placement>,
  ) {}

  async create(createPlacementDto: CreatePlacementDto): Promise<Placement> {
    // Verificar encaminhamento duplicado ativo
    const existing = await this.placementsRepository.findOne({
      where: {
        studentId: createPlacementDto.studentId,
        empresaId: createPlacementDto.empresaId,
        status: 'Ativo',
      },
    });

    if (existing) {
      throw new ConflictException(
        'Este estudante já possui um encaminhamento ativo para esta empresa',
      );
    }

    // Validar datas
    const admissionDate = new Date(createPlacementDto.dataAdmissao);
    const dischargeDate = new Date(createPlacementDto.dataDesligamento);
    if (admissionDate >= dischargeDate) {
      throw new ConflictException(
        'A data de desligamento deve ser posterior à data de admissão',
      );
    }

    const placement = this.placementsRepository.create({
      ...createPlacementDto,
      status: createPlacementDto.status || 'Ativo',
    });

    return await this.placementsRepository.save(placement);
  }

  async findAll(): Promise<Placement[]> {
    return await this.placementsRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Placement> {
    const placement = await this.placementsRepository.findOne({
      where: { id },
    });
    if (!placement) {
      throw new NotFoundException(`Encaminhamento com ID ${id} não encontrado`);
    }
    return placement;
  }

  async update(
    id: number,
    updatePlacementDto: UpdatePlacementDto,
  ): Promise<Placement> {
    const placement = await this.findOne(id);

    // Se mudou estudante + empresa, verificar duplicata
    if (
      updatePlacementDto.studentId &&
      updatePlacementDto.empresaId &&
      (updatePlacementDto.studentId !== placement.studentId ||
        updatePlacementDto.empresaId !== placement.empresaId)
    ) {
      const existing = await this.placementsRepository.findOne({
        where: {
          studentId: updatePlacementDto.studentId,
          empresaId: updatePlacementDto.empresaId,
          status: 'Ativo',
        },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException(
          'Este estudante já possui um encaminhamento ativo para esta empresa',
        );
      }
    }

    Object.assign(placement, updatePlacementDto);
    return await this.placementsRepository.save(placement);
  }

  async remove(id: number): Promise<void> {
    const placement = await this.findOne(id);
    await this.placementsRepository.remove(placement);
  }
}
