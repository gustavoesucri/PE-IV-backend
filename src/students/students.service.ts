import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const existingCpf = await this.studentsRepository.findOne({
      where: { cpf: createStudentDto.cpf },
    });
    if (existingCpf) {
      throw new ConflictException('CPF já cadastrado');
    }

    const existingNome = await this.studentsRepository.findOne({
      where: { nome: createStudentDto.nome },
    });
    if (existingNome) {
      throw new ConflictException('Nome do estudante já cadastrado');
    }

    const student = this.studentsRepository.create({
      ...createStudentDto,
      status: createStudentDto.status || 'Ativo',
      acompanhamento: createStudentDto.acompanhamento || {
        av1: false,
        av2: false,
        entrevista1: false,
        entrevista2: false,
        resultado: 'Pendente',
      },
    });

    return await this.studentsRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentsRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException(`Estudante com ID ${id} não encontrado`);
    }
    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);

    if (updateStudentDto.cpf && updateStudentDto.cpf !== student.cpf) {
      const existingCpf = await this.studentsRepository.findOne({
        where: { cpf: updateStudentDto.cpf },
      });
      if (existingCpf) {
        throw new ConflictException('CPF já cadastrado para outro estudante');
      }
    }

    if (updateStudentDto.nome && updateStudentDto.nome !== student.nome) {
      const existingNome = await this.studentsRepository.findOne({
        where: { nome: updateStudentDto.nome },
      });
      if (existingNome) {
        throw new ConflictException('Nome do estudante já cadastrado para outro estudante');
      }
    }

    Object.assign(student, updateStudentDto);
    return await this.studentsRepository.save(student);
  }

  async remove(id: number): Promise<void> {
    const student = await this.findOne(id);
    await this.studentsRepository.remove(student);
  }
}