import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { UserSettings } from './users-settings/entities/user-settings.entity';
import { Company } from './companies/entities/company.entity';
import { RolePermission } from './permissions/role-permission.entity';

// ── Dados ──────────────────────────────────────────────────────────────

async function seedData(dataSource: DataSource) {
  console.log('\n── 1/3  Dados base ──────────────────────────────────');

  // Limpa dados existentes
  console.log('🗑️ Limpando dados antigos...');
  await dataSource.createQueryBuilder().delete().from(UserSettings).execute().catch(() => null);
  await dataSource.createQueryBuilder().delete().from(Company).execute().catch(() => null);
  await dataSource.createQueryBuilder().delete().from(User).execute().catch(() => null);

  // Cria o usuário Diretor
  console.log('👤 Criando usuário Diretor...');
  const hashedPassword = await bcrypt.hash('admin', 10);

  const directorUser = dataSource.getRepository(User).create({
    username: 'Diretor',
    email: 'rodrigo.editado2@gmail.com',
    password: hashedPassword,
    role: 'diretor',
  });

  const savedUser = await dataSource.getRepository(User).save(directorUser);

  // Configurações padrão de widgets
  const defaultWidgetPositions = {
    studentsWidget: { x: 59, y: 63, width: 600, height: 300 },
    companiesWidget: { x: 849, y: 64, width: 593, height: 300 },
    counterWidget: { x: 26, y: 418, width: 300, height: 100 },
    statsWidget: { x: 700, y: 424, width: 400, height: 257 },
  };

  const defaultSidebarOrder = [
    'administration', 'settings', 'students', 'director-panel',
    'companies', 'employment-placement', 'assessment', 'control', 'follow-up',
  ];

  const defaultSettings = { notifySystem: false, notifyEmail: false };

  // Cria UserSettings para o Diretor
  console.log('⚙️ Criando configurações padrão para Diretor...');
  const userSettings = dataSource.getRepository(UserSettings).create({
    userId: savedUser.id,
    widgetPositions: defaultWidgetPositions,
    sidebarOrder: defaultSidebarOrder,
    notes: [],
    monitoredStudents: [],
    favoriteCompanies: [],
    companies: [],
    settings: defaultSettings,
  });

  await dataSource.getRepository(UserSettings).save(userSettings);

  // Cria empresas de exemplo
  console.log('🏢 Criando empresas de exemplo...');
  const companiesRepo = dataSource.getRepository(Company);

  const companiesData = [
    { nome: 'Tech Solutions Ltda', cnpj: '12345678000101', rua: 'Rua da Tecnologia', numero: '100', bairro: 'Centro', estado: 'SP', cep: '01001000' },
    { nome: 'Inovação Digital S.A.', cnpj: '98765432000102', rua: 'Avenida Brasil', numero: '500', bairro: 'Jardim América', estado: 'RJ', cep: '20040020' },
    { nome: 'Construtora ABC', cnpj: '11222333000103', rua: 'Rua das Obras', numero: '250', bairro: 'Industrial', estado: 'MG', cep: '30130000' },
    { nome: 'Farmácia Saúde Total', cnpj: '44555666000104', rua: 'Avenida Principal', numero: '75', bairro: 'Vila Nova', estado: 'PR', cep: '80010100' },
    { nome: 'Supermarket Express', cnpj: '77888999000105', rua: 'Rua do Comércio', numero: '300', bairro: 'Centro', estado: 'SC', cep: '88010001' },
  ];

  for (const companyData of companiesData) {
    const company = companiesRepo.create(companyData);
    await companiesRepo.save(company);
  }

  console.log(`✅ ${companiesData.length} empresas criadas`);
  console.log('✅ Usuário Diretor criado (senha: admin)');
}

// ── Permissões ─────────────────────────────────────────────────────────

async function seedPermissions(dataSource: DataSource) {
  console.log('\n── 2/3  Permissões ─────────────────────────────────');

  const rolesPermissions: Record<string, Record<string, boolean>> = {
    diretor: {
      view_students: true, create_students: true, edit_students: true, delete_students: true,
      view_companies: true, create_companies: true, edit_companies: true, delete_companies: true,
      view_assessments: true, create_assessments: true,
      view_users: true, create_users: true, edit_users: true, delete_users: true,
      view_permissions: true,
      view_settings: true, edit_settings: true,
      view_follow_up: true, create_follow_up: true,
      view_placements: true, create_placements: true, delete_placements: true,
      view_control: true, create_control: true,
      view_observations: true, create_observations: true,
    },
    professor: {
      view_students: true, create_students: true, edit_students: true,
      view_companies: false,
      view_assessments: true, create_assessments: true,
      view_follow_up: true,
      view_placements: true,
      view_observations: true,
    },
    psicologo: {
      view_students: true,
      view_companies: false,
      view_assessments: true, create_assessments: false,
      view_follow_up: true, create_follow_up: true,
      view_placements: true,
      view_observations: true, create_observations: true,
    },
    'cadastrador de empresas': {
      view_students: false,
      view_companies: true, create_companies: true, edit_companies: true,
      view_placements: true,
    },
  };

  console.log('🗑️ Limpando permissões antigas...');
  await dataSource.createQueryBuilder().delete().from(RolePermission).execute().catch(() => null);

  const rolePermissionRepo = dataSource.getRepository(RolePermission);

  for (const [role, permissions] of Object.entries(rolesPermissions)) {
    console.log(`  🔑 ${role}`);
    const rolePermission = rolePermissionRepo.create({ role, permissions });
    await rolePermissionRepo.save(rolePermission);
  }

  console.log('✅ 4 papéis com permissões criados');
}

// ── Entry point ────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Iniciando seed completo do banco de dados...');

  let app: any;
  let dataSource: DataSource;

  try {
    app = await NestFactory.create(AppModule);
    dataSource = app.get(DataSource);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    console.log('✅ Conexão com banco estabelecida');
    console.log('📋 Sincronizando tabelas...');
    await dataSource.synchronize();

    await seedData(dataSource);
    await seedPermissions(dataSource);

    console.log('\n── 3/3  Resumo ─────────────────────────────────────');
    console.log('📋 Usuário: Diretor | Senha: admin | Role: diretor');
    console.log('🏢 5 empresas de exemplo');
    console.log('🔑 4 papéis com permissões');
    console.log('🎉 Seed completo com sucesso!\n');
  } catch (error) {
    console.error('❌ Erro ao fazer seed:');
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    } else {
      console.error(error);
    }
    process.exit(1);
  } finally {
    if (app) {
      await app.close();
    }
    process.exit(0);
  }
}

seed().catch((error) => {
  console.error('Erro fatal no seed:', error);
  process.exit(1);
});
