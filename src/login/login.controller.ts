import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto, CreateUserDto, UserResponseDto } from '../auth/dto/auth.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('auth')
export class LoginController {
  constructor(private loginService: LoginService) {}

  /**
   * POST /auth/login
   * Realiza login do usuário
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.loginService.login(loginDto);
  }

  /**
   * POST /auth/register
   * Cria novo usuário
   */
  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.loginService.createUser(createUserDto);
  }

  /**
   * GET /auth/me
   * Retorna dados do usuário autenticado
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Req() req: any): Promise<UserResponseDto> {
    return await this.loginService.getUserById(req.user.id);
  }

  /**
   * GET /auth/users (apenas para admin/diretor)
   * Retorna lista de todos os usuários
   */
  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Req() req: any): Promise<UserResponseDto[]> {
    // Valida se é diretor
    if (req.user.role !== 'diretor') {
      throw new BadRequestException('Acesso negado. Apenas diretores podem acessar esta rota.');
    }

    return await this.loginService.getAllUsers();
  }
}
