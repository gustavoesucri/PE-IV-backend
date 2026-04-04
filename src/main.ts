import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('PE-IV — Sistema de Gestão Educacional')
    .setDescription(
      '**API completa do sistema PE-IV** para gestão de alunos, empresas, estágios, avaliações e controle acadêmico.\n\n' +
      '## Autenticação\n' +
      'A maioria dos endpoints requer autenticação via **JWT Bearer Token**.\n' +
      '1. Faça login em `POST /auth/login` com username e password\n' +
      '2. Copie o `token` da resposta\n' +
      '3. Clique em **Authorize** 🔒 e cole: `Bearer <seu_token>`\n\n' +
      '## Roles (Cargos)\n' +
      '| Role | Descrição |\n' +
      '|---|---|\n' +
      '| `diretor` | Acesso total a tudo |\n' +
      '| `professor` | Acesso conforme permissões |\n' +
      '| `psicologo` | Acesso conforme permissões |\n' +
      '| `cadastrador de empresas` | Acesso conforme permissões |\n\n' +
      '## Permissões\n' +
      'Cada role tem permissões configuráveis no Painel do Diretor. ' +
      'Diretores podem também definir permissões específicas por usuário que sobrepõem as do cargo.'
    )
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Insira o token JWT obtido no login' },
      'JWT',
    )
    .addTag('🏠 App', 'Health check e status do servidor')
    .addTag('🔐 Autenticação', 'Login, registro, perfil do usuário e recuperação de senha')
    .addTag('👤 Usuários', 'CRUD de usuários do sistema (restrito ao diretor)')
    .addTag('🎓 Alunos', 'CRUD de alunos — requer permissões view/create/edit/delete_students')
    .addTag('🏢 Empresas', 'CRUD de empresas parceiras — requer permissões view/create/edit/delete_companies')
    .addTag('💼 Encaminhamentos', 'CRUD de encaminhamentos (estágio) — requer permissões view/create/delete_placements')
    .addTag('📝 Avaliações', 'CRUD de avaliações dos alunos — requer permissões view/create_assessments')
    .addTag('📊 Controle', 'CRUD de controle de entrevistas — requer permissões view/create_control')
    .addTag('📋 Acompanhamento', 'CRUD de acompanhamento/follow-up — requer permissões view/create_follow_up')
    .addTag('🔑 Permissões', 'Consulta de permissões de cargo e específicas do usuário')
    .addTag('🎛️ Painel do Diretor', 'Gerenciamento de permissões e notificações globais (apenas diretor)')
    .addTag('⚙️ Configurações', 'Preferências e configurações do usuário (widgets, sidebar, notas)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'PE-IV API — Swagger',
    customCss: '.swagger-ui .topbar { background-color: #1976d2; }',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      tagsSorter: 'alpha',
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Servidor rodando em http://localhost:${process.env.PORT ?? 3000}`);
  console.log(`📚 Swagger disponível em http://localhost:${process.env.PORT ?? 3000}/api/docs`);
}
bootstrap();
