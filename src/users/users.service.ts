import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async updateById(id: number, updateData: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Se houver atualização de senha, realizar hash
    if (updateData.password) {
      const hashed = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashed;
    }

    const merged = this.userRepository.merge(user, updateData as any);
    return await this.userRepository.save(merged);
  }

async create(userData: Partial<User>): Promise<User> {
  const existingByUsername = await this.userRepository.findOne({ where: { username: userData.username } });
  if (existingByUsername) {
    throw new BadRequestException('Nome de usuário já existe');
  }

  if (userData.email) {
    const existingByEmail = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingByEmail) {
      throw new BadRequestException('Email já cadastrado');
    }
  }

  if (userData.password) {
    userData.password = await bcrypt.hash(userData.password, 10);
  } else {
    userData.password = await bcrypt.hash('changeme', 10);
  }

  const user: User = this.userRepository.create(userData as User); // ← tipagem explícita
  const saved: User = await this.userRepository.save(user);        // ← tipagem explícita
  return saved;
}

  async listAll(): Promise<Partial<User>[]> {
    const list = await this.userRepository.find();
    return list.map((u: any) => {
      const { password, ...rest } = u;
      return rest;
    });
  }

  async verifyPassword(id: number, plainPassword: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    return await bcrypt.compare(plainPassword, user.password);
  }

  async deleteById(id: number) {
    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }
    return await this.userRepository.remove(user);
  }
}

export default UsersService;
