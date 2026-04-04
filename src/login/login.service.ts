import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { LoginDto, CreateUserDto, UserResponseDto } from '../auth/dto/auth.dto';
import { UserSettingsService } from '../users-settings/user-settings.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userSettingsService: UserSettingsService,
  ) {}

  /**
   * Realiza login do usuário
   * @param loginDto Contém username e password
   * @returns Token JWT e dados do usuário
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Busca usuário por username
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    // Valida password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    // Cria payload do JWT
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    // Gera token JWT
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '24h',
    });

    // Retorna token e dados do usuário (sem password)
    const userResponse = this.toUserResponseDto(user);

    return {
      accessToken,
      user: userResponse,
    };
  }

  /**
   * Cria novo usuário
   * @param createUserDto Dados do novo usuário
   * @returns Usuário criado
   */
  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { username, email, password, role } = createUserDto;

    // Valida se usuário já existe
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new BadRequestException('Usuário ou email já cadastrado');
    }

    // Hash da password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário
    const newUser = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const savedUser = await this.userRepository.save(newUser);

    // Cria UserSettings padrão para o novo usuário
    console.log(`📊 Criando userSettings padrão para usuário: ${username}`);
    try {
      await this.userSettingsService.create(savedUser.id);
    } catch (error) {
      console.error(`⚠️ Erro ao criar userSettings para ${username}:`, error);
      // Continua mesmo se der erro ao criar userSettings
    }

    return this.toUserResponseDto(savedUser);
  }

  /**
   * Converte User entity para DTO (sem password)
   */
  private toUserResponseDto(user: User): UserResponseDto {
    const { password, ...result } = user;
    return result as UserResponseDto;
  }

  /**
   * Busca usuário por ID
   */
  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return this.toUserResponseDto(user);
  }

  /**
   * Busca todos os usuários
   */
  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map(user => this.toUserResponseDto(user));
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    // Always return success to avoid email enumeration
    if (!user) {
      return { message: 'Se o email existir, um token de recuperação foi gerado.' };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Token valid for 1 hour

    user.tokenRecuperacao = token;
    user.validadeToken = expiration;
    await this.userRepository.save(user);

    // In production, send email with token. For now, log it.
    console.log(`🔑 Token de recuperação para ${email}: ${token}`);

    return { message: 'Se o email existir, um token de recuperação foi gerado.', };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({
      where: {
        tokenRecuperacao: token,
        validadeToken: MoreThan(new Date()),
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.tokenRecuperacao = null as any;
    user.validadeToken = null as any;
    await this.userRepository.save(user);

    return { message: 'Senha alterada com sucesso' };
  }
}
