import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private companiesRepository: Repository<Company>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const existingCnpj = await this.companiesRepository.findOne({
      where: { cnpj: createCompanyDto.cnpj },
    });
    if (existingCnpj) {
      throw new ConflictException('CNPJ já cadastrado');
    }

    const existingNome = await this.companiesRepository.findOne({
      where: { nome: createCompanyDto.nome },
    });
    if (existingNome) {
      throw new ConflictException('Nome da empresa já cadastrado');
    }

    const company = this.companiesRepository.create(createCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async findAll(): Promise<Company[]> {
    return await this.companiesRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companiesRepository.findOne({ where: { id } });
    if (!company) {
      throw new NotFoundException(`Empresa com ID ${id} não encontrada`);
    }
    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);

    if (updateCompanyDto.cnpj && updateCompanyDto.cnpj !== company.cnpj) {
      const existingCnpj = await this.companiesRepository.findOne({
        where: { cnpj: updateCompanyDto.cnpj },
      });
      if (existingCnpj) {
        throw new ConflictException('CNPJ já cadastrado para outra empresa');
      }
    }

    if (updateCompanyDto.nome && updateCompanyDto.nome !== company.nome) {
      const existingNome = await this.companiesRepository.findOne({
        where: { nome: updateCompanyDto.nome },
      });
      if (existingNome) {
        throw new ConflictException('Nome da empresa já cadastrado para outra empresa');
      }
    }

    Object.assign(company, updateCompanyDto);
    return await this.companiesRepository.save(company);
  }

  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companiesRepository.remove(company);
  }
}
