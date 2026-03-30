import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Control } from './entities/control.entity';
import { CreateControlDto } from './dto/create-control.dto';
import { UpdateControlDto } from './dto/update-control.dto';

@Injectable()
export class ControlsService {
  constructor(
    @InjectRepository(Control)
    private controlsRepository: Repository<Control>,
  ) {}

  async create(createControlDto: CreateControlDto): Promise<Control> {
    const control = this.controlsRepository.create({
      ...createControlDto,
      resultado: createControlDto.resultado || 'Pendente',
    });
    return await this.controlsRepository.save(control);
  }

  async findAll(): Promise<Control[]> {
    return await this.controlsRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Control> {
    const control = await this.controlsRepository.findOne({
      where: { id },
    });
    if (!control) {
      throw new NotFoundException(`Controle com ID ${id} não encontrado`);
    }
    return control;
  }

  async update(
    id: number,
    updateControlDto: UpdateControlDto,
  ): Promise<Control> {
    const control = await this.findOne(id);
    Object.assign(control, updateControlDto);
    return await this.controlsRepository.save(control);
  }

  async remove(id: number): Promise<void> {
    const control = await this.findOne(id);
    await this.controlsRepository.remove(control);
  }
}
