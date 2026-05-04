import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
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

  async updateOwnUsername(id: number, username: string): Promise<User> {
    const trimmedUsername = username?.trim();
    if (!trimmedUsername) {
      throw new BadRequestException('Nome de usuário é obrigatório');
    }

    const user = await this.findById(id);
    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const existingByUsername = await this.userRepository.findOne({ where: { username: trimmedUsername } });
    if (existingByUsername && existingByUsername.id !== id) {
      throw new BadRequestException('Nome de usuário já existe');
    }

    user.username = trimmedUsername;
    return await this.userRepository.save(user);
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

  // Marcar como primeiro login e não verificado
  userData.primeiroLogin = true;
  userData.emailVerificado = false;
  userData.tokenVerificacaoEmail = crypto.randomBytes(32).toString('hex');

  const user: User = this.userRepository.create(userData as User);
  const saved: User = await this.userRepository.save(user);
  return saved;
}

/**
 * Busca usuário por token de verificação de email
 */
async findByVerificationToken(token: string): Promise<User | null> {
  return await this.userRepository.findOne({ where: { tokenVerificacaoEmail: token } });
}

  async listAll(): Promise<Partial<User>[]> {
    const list = await this.userRepository.find();
    return list.map((u: any) => {
      const { password, ...rest } = u;
      return rest;
    });
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
