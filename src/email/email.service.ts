import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER', ''),
        pass: this.configService.get<string>('SMTP_PASS', ''),
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string, username: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Sistema de Gestão de Alunos" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject: 'Recuperação de Senha - Sistema de Gestão de Alunos',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #2c5aa0; text-align: center;">Recuperação de Senha</h2>
          <p>Olá, <strong>${username}</strong>!</p>
          <p>Recebemos uma solicitação para redefinir sua senha no Sistema de Gestão de Alunos.</p>
          <p>Para criar uma nova senha, clique no link abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2c5aa0; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Redefinir Senha</a>
          </div>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">${resetLink}</p>
          <p><strong>Importante:</strong></p>
          <ul>
            <li>Este link expira em <strong>1 hora</strong>.</li>
            <li>Se você não solicitou esta recuperação, ignore este email.</li>
            <li>Sua senha atual permanecerá inalterada.</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Se não foi você quem solicitou isso, por favor ignore este email ou entre em contato com o administrador do sistema.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcomeEmail(to: string, username: string, tempPassword: string, verificationToken?: string): Promise<void> {
    const mailOptions = {
      from: `"Sistema de Gestão de Alunos" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject: 'Bem-vindo ao Sistema de Gestão de Alunos',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #2c5aa0; text-align: center;">Bem-vindo ao Sistema!</h2>
          <p>Olá, <strong>${username}</strong>!</p>
          <p>Você foi cadastrado no Sistema de Gestão de Alunos.</p>
          <p><strong>Seu usuário:</strong> <code style="background-color: #f5f5f5; padding: 5px 10px; border-radius: 4px; font-size: 16px;">${username}</code></p>
          <p><strong>Sua senha temporária:</strong> <code style="background-color: #f5f5f5; padding: 5px 10px; border-radius: 4px; font-size: 16px;">${tempPassword}</code></p>
          <p><strong>Atenção:</strong></p>
          <ul>
            <li>No primeiro login, você será solicitado a <strong>verificar seu email</strong> e <strong>criar uma nova senha</strong>.</li>
            <li>Esta senha temporária expirará após o primeiro login.</li>
            <li>Se não foi você quem solicitou este cadastro, ignore este email.</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Este é um email automático do Sistema de Gestão de Alunos.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendEmailVerification(to: string, username: string, verificationToken: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    const verificationLink = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"Sistema de Gestão de Alunos" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject: 'Confirme seu Email - Sistema de Gestão de Alunos',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #2c5aa0; text-align: center;">Confirme seu Email</h2>
          <p>Olá, <strong>${username}</strong>!</p>
          <p>Para ativar sua conta, confirme seu email clicando no link abaixo:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Confirmar Email</a>
          </div>
          <p>Ou copie e cole este link no seu navegador:</p>
          <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">${verificationLink}</p>
          <p><strong>Atenção:</strong></p>
          <ul>
            <li>Após confirmar seu email, você poderá continuar com a configuração da sua conta.</li>
            <li>Se não foi você quem solicitou este cadastro, ignore este email.</li>
          </ul>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Este é um email automático do Sistema de Gestão de Alunos.
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendEmailChangedConfirmation(to: string, username: string): Promise<void> {
    const mailOptions = {
      from: `"Sistema de Gestão de Alunos" <${this.configService.get<string>('SMTP_USER')}>`,
      to,
      subject: 'Email Alterado - Sistema de Gestão de Alunos',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #2c5aa0; text-align: center;">Email Atualizado</h2>
          <p>Olá, <strong>${username}</strong>!</p>
          <p>Seu email foi alterado com sucesso no Sistema de Gestão de Alunos.</p>
          <p>Este é o novo email associado à sua conta.</p>
          <p><strong>Se você não realizou esta alteração, entre em contato com o administrador imediatamente.</strong></p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Sistema de Gestão de Alunos - Email automático
          </p>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
