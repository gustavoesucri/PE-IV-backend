import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from './users/entity/user.entity';
import { UserSettings } from './users-settings/entity/user-settings.entity';

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  let app;
  let dataSource: DataSource;

  try {
    console.log('📦 Inicializando aplicação...');
    app = await NestFactory.create(AppModule);
    
    console.log('🔌 Obtendo DataSource...');
    dataSource = app.get(DataSource);

    // Verifica conexão
    if (!dataSource.isInitialized) {
      console.log('⚠️ DataSource não está inicializado. Inicializando...');
      await dataSource.initialize();
    }

    console.log('✅ Conexão com banco estabelecida');

    // Garante que as tabelas existem
    console.log('📋 Sincronizando tabelas...');
    await dataSource.synchronize();

    // Limpa dados existentes usando query builder
    console.log('🗑️ Limpando dados antigos...');
    await dataSource.createQueryBuilder().delete().from(UserSettings).execute().catch(() => null);
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
      studentsWidget: {
        x: 59,
        y: 63,
        width: 600,
        height: 300,
      },
      companiesWidget: {
        x: 849,
        y: 64,
        width: 593,
        height: 300,
      },
      counterWidget: {
        x: 26,
        y: 418,
        width: 300,
        height: 100,
      },
      statsWidget: {
        x: 700,
        y: 424,
        width: 400,
        height: 257,
      },
    };

    const defaultSidebarOrder = [
      'administration',
      'settings',
      'students',
      'director-panel',
      'companies',
      'employment-placement',
      'assessment',
      'control',
      'follow-up',
    ];

    const defaultSettings = {
      notifySystem: false,
      notifyEmail: false,
    };

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

    console.log('✅ Seed completo com sucesso!');
    console.log('');
    console.log('📋 Usuário criado:');
    console.log('  - Username: Diretor');
    console.log('  - Senha: admin');
    console.log('  - Email: rodrigo.editado2@gmail.com');
    console.log('  - Role: diretor');
    console.log('');
  } catch (error) {
    console.error('❌ Erro ao fazer seed:');
    if (error instanceof Error) {
      console.error('Message:', error.message);
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
