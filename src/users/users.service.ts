import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

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

  async verifyPassword(id: number, plainPassword: string): Promise<boolean> {
    const user = await this.findById(id);
    if (!user) return false;
    return await bcrypt.compare(plainPassword, user.password);
  }
}

export default UsersService;
