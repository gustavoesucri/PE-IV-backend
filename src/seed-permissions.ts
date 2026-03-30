import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DataSource } from 'typeorm';
import { RolePermission } from './permissions/role-permission.entity';
import { User } from './users/entities/user.entity';

async function seedPermissions() {
  console.log('🔐 Populando permissões do sistema...');

  let app: any;
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

    // Define as permissões por papel
    const rolesPermissions = {
      diretor: {
        view_students: true,
        create_students: true,
        edit_students: true,
        delete_students: true,
        view_companies: true,
        create_companies: true,
        edit_companies: true,
        delete_companies: true,
        view_assessments: true,
        create_assessments: true,
        view_users: true,
        create_users: true,
        edit_users: true,
        delete_users: true,
        view_permissions: true,
        view_settings: true,
        edit_settings: true,
        view_follow_up: true,
        create_follow_up: true,
        view_placements: true,
        create_placements: true,
        delete_placements: true,
        view_control: true,
        create_control: true,
        view_observations: true,
        create_observations: true,
      },
      professor: {
        view_students: true,
        create_students: true,
        edit_students: true,
        view_companies: false,
        view_assessments: true,
        create_assessments: true,
        view_follow_up: true,
        view_placements: true,
        view_observations: true,
      },
      psicologo: {
        view_students: true,
        view_companies: false,
        view_assessments: true,
        create_assessments: false,
        view_follow_up: true,
        create_follow_up: true,
        view_placements: true,
        view_observations: true,
        create_observations: true,
      },
      'cadastrador de empresas': {
        view_students: false,
        view_companies: true,
        create_companies: true,
        edit_companies: true,
        view_placements: true,
      },
    };

    console.log('🗑️ Limpando permissões antigas...');
    await dataSource.createQueryBuilder().delete().from(RolePermission).execute().catch(() => null);

    console.log('⚙️ Criando permissões para cada papel...');
    const rolePermissionRepository = dataSource.getRepository(RolePermission);

    for (const [role, permissions] of Object.entries(rolesPermissions)) {
      console.log(`  - Criando permissões para: ${role}`);
      const rolePermission = rolePermissionRepository.create({
        role,
        permissions,
      });
      await rolePermissionRepository.save(rolePermission);
    }

    console.log('✅ Seed de permissões completo!');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro ao fazer seed de permissões:');
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

seedPermissions().catch((error) => {
  console.error('Erro fatal no seed de permissões:', error);
  process.exit(1);
});
