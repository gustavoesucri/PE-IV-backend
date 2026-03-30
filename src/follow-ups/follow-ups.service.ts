import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FollowUp } from './entities/follow-up.entity';
import { CreateFollowUpDto } from './dto/create-follow-up.dto';
import { UpdateFollowUpDto } from './dto/update-follow-up.dto';

@Injectable()
export class FollowUpsService {
  constructor(
    @InjectRepository(FollowUp)
    private followUpsRepository: Repository<FollowUp>,
  ) {}

  async create(createFollowUpDto: CreateFollowUpDto): Promise<FollowUp> {
    // Verificar duplicata: mesmo aluno na mesma data de visita
    const existing = await this.followUpsRepository.findOne({
      where: {
        alunoId: createFollowUpDto.alunoId,
        dataVisita: createFollowUpDto.dataVisita,
      },
    });

    if (existing) {
      throw new ConflictException(
        'Já existe um acompanhamento para este aluno nesta data de visita',
      );
    }

    const followUp = this.followUpsRepository.create(createFollowUpDto);
    return await this.followUpsRepository.save(followUp);
  }

  async findAll(): Promise<FollowUp[]> {
    return await this.followUpsRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<FollowUp> {
    const followUp = await this.followUpsRepository.findOne({
      where: { id },
    });
    if (!followUp) {
      throw new NotFoundException(`Acompanhamento com ID ${id} não encontrado`);
    }
    return followUp;
  }

  async update(
    id: number,
    updateFollowUpDto: UpdateFollowUpDto,
  ): Promise<FollowUp> {
    const followUp = await this.findOne(id);
    Object.assign(followUp, updateFollowUpDto);
    return await this.followUpsRepository.save(followUp);
  }

  async remove(id: number): Promise<void> {
    const followUp = await this.findOne(id);
    await this.followUpsRepository.remove(followUp);
  }
}
