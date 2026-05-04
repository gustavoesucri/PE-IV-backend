import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/entities/user.entity';
import { LoginDto, CreateUserDto, UserResponseDto } from '../auth/dto/auth.dto';
import { UserSettingsService } from '../users-settings/user-settings.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userSettingsService: UserSettingsService,
    private emailService: EmailService,
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

    try {
      await this.emailService.sendPasswordResetEmail(email, token, user.username);
      console.log(`� Email de recuperação enviado para ${email}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar email para ${email}:`, error);
      // Still return success to avoid email enumeration, but log the error
    }

    return { message: 'Se o email existir, um token de recuperação foi gerado.' };
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
    user.primeiroLogin = false;
    await this.userRepository.save(user);

    return { message: 'Senha alterada com sucesso' };
  }

  /**
   * Verifica email do usuário com token
   */
  async verifyEmail(token: string): Promise<{ message: string; username: string; tempPassword: string }> {
    const user = await this.userRepository.findOne({
      where: { tokenVerificacaoEmail: token },
    });

    if (!user) {
      throw new BadRequestException('Token de verificação inválido');
    }

    user.emailVerificado = true;
    user.tokenVerificacaoEmail = null as any;
    await this.userRepository.save(user);

    return {
      message: 'Email verificado com sucesso',
      username: user.username,
      tempPassword: 'senha_temporaria_enviada_por_email', // O usuário já recebeu a senha no email de boas-vindas
    };
  }

  /**
   * Altera senha obrigatória no primeiro login
   */
  async changePasswordFirstLogin(userId: number, newPassword: string, newEmail?: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (!user.primeiroLogin) {
      throw new BadRequestException('Senha já foi alterada anteriormente');
    }

    // Validação rigorosa de senha
    const passwordValidation = this.validatePassword(newPassword);
    if (!passwordValidation.valid) {
      throw new BadRequestException(passwordValidation.message);
    }

    // Verificar se o novo email existe (se fornecido)
    if (newEmail && newEmail !== user.email) {
      const existingEmail = await this.userRepository.findOne({ where: { email: newEmail } });
      if (existingEmail && existingEmail.id !== userId) {
        throw new BadRequestException('Este email já está em uso por outro usuário');
      }

      // Enviar email de confirmação
      try {
        await this.emailService.sendEmailChangedConfirmation(newEmail, user.username);
      } catch (error) {
        console.error('Erro ao enviar email de confirmação:', error);
      }

      user.email = newEmail;
      user.emailVerificado = true;
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.primeiroLogin = false;

    const updatedUser = await this.userRepository.save(user);
    return this.toUserResponseDto(updatedUser);
  }

  /**
   * Valida senha com regras rigorosas
   */
  private validatePassword(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: 'A senha deve ter pelo menos 8 caracteres' };
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra maiúscula' };
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos uma letra minúscula' };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos um número' };
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { valid: false, message: 'A senha deve conter pelo menos um caractere especial' };
    }

    return { valid: true, message: '' };
  }

  /**
   * Envia email de verificação para o usuário no primeiro login
   */
  async sendVerificationEmail(userId: number, email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    if (user.emailVerificado) {
      throw new BadRequestException('Email já verificado');
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Email inválido');
    }

    // Verificar se o email já está em uso por outro usuário
    const existingEmail = await this.userRepository.findOne({ where: { email } });
    if (existingEmail && existingEmail.id !== userId) {
      throw new BadRequestException('Este email já está em uso por outro usuário');
    }

    // Atualizar email do usuário
    user.email = email;

    // Gerar token de verificação
    const token = crypto.randomBytes(32).toString('hex');
    user.tokenVerificacaoEmail = token;
    await this.userRepository.save(user);

    // Enviar email de verificação
    try {
      await this.emailService.sendEmailVerification(email, user.username, token);
      console.log(`📧 Email de verificação enviado para ${email}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar email de verificação para ${email}:`, error);
      throw new BadRequestException('Erro ao enviar email de verificação');
    }

    return { message: 'Email de verificação enviado com sucesso' };
  }

  /**
   * Verifica status do email do usuário
   */
  async checkEmailStatus(userId: number): Promise<{ email: string; emailVerificado: boolean }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    return {
      email: user.email,
      emailVerificado: user.emailVerificado,
    };
  }

  /**
   * Gera token de verificação de email para novos usuários
   */
  async generateEmailVerificationToken(userId: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.tokenVerificacaoEmail = token;
    await this.userRepository.save(user);

    return token;
  }
}
