// seed.ts - VERSÃO COM READLINE (SEM DEPENDÊNCIAS EXTERNAS)
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { UserSettings } from './users-settings/entities/user-settings.entity';
import { Company } from './companies/entities/company.entity';
import { RolePermission } from './permissions/role-permission.entity';
import { AssessmentQuestion } from './assessments/entities/assessment-question.entity';
import { Student } from './students/entities/student.entity';
import { Assessment } from './assessments/entities/assessment.entity';
import { Placement } from './placements/entities/placement.entity';
import * as readline from 'readline';

// ====================== FUNÇÕES AUXILIARES PARA BULK ======================
function calcularDigitos(cnpjBase: string): string {
  const calc = (base: string, pesos: number[]) => {
    const soma = base.split('').reduce((acc, num, i) => acc + Number(num) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  const pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
  const pesos2 = [6, ...pesos1];
  const d1 = calc(cnpjBase, pesos1);
  const d2 = calc(cnpjBase + d1, pesos2);
  return `${d1}${d2}`;
}

function gerarCNPJ(index: number): string {
  const raiz = "12345678";
  const filial = String(1000 + index).padStart(4, "0");
  const base = raiz + filial;
  return base + calcularDigitos(base);
}

function criarPayloadAssessment(studentId: number, tipo: string, registeredBy: number) {
  return {
    studentId,
    entryDate: "2025-02-01",
    assessmentDate: "2025-06-15",
    evaluationType: tipo,
    professorName: "Prof. João Silva",
    q1: "sim", q2: "sim", q3: "nao", q4: "maioria",
    q5: "sim", q6: "nao", q7: "maioria", q8: "sim",
    q9: "nao", q10: "raras", q11: "raras", q12: "nao",
    q13: "raras", q14: "sim", q15: "sim", q16: "sim",
    q17: "nao", q18: "raras", q19: "sim", q20: "sim",
    q21: "sim", q22: "nao", q23: "sim", q24: "nao",
    q25: "sim", q26: "sim", q27: "nao", q28: "nao",
    q29: "sim", q30: "sim", q31: "sim", q32: "sim",
    q33: "sim", q34: "sim", q35: "sim", q36: "nao",
    q37: "sim", q38: "nao", q39: "sim", q40: "sim",
    q41: "raras", q42: "nao", q43: "sim", q44: "sim",
    q45: "sim", q46: "sim",
    openQ1: "Sim, o aluno demonstra perfil adequado para a instituição.",
    openQ2: "Quando contrariado por colegas.",
    openQ3: "Faz uso de Ritalina.",
    registeredBy
  };
}

// ====================== SEED BÁSICO (ORIGINAL) ======================
async function seedData(dataSource: DataSource) {
  console.log('\n── 1/3  Dados base ──────────────────────────────────');

  console.log('🗑️ Limpando dados antigos...');
  await dataSource.createQueryBuilder().delete().from(UserSettings).execute().catch(() => null);
  await dataSource.createQueryBuilder().delete().from(Company).execute().catch(() => null);
  await dataSource.createQueryBuilder().delete().from(User).execute().catch(() => null);

  console.log('👤 Criando usuário Diretor...');
  const hashedPassword = await bcrypt.hash('admin', 10);

  const directorUser = dataSource.getRepository(User).create({
    username: 'Diretor',
    email: 'rodrigo.editado2@gmail.com',
    password: hashedPassword,
    role: 'diretor',
  });

  const savedUser = await dataSource.getRepository(User).save(directorUser);

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

  console.log('🏢 Criando empresas de exemplo...');
  const companiesRepo = dataSource.getRepository(Company);

  const companiesData = [
    { nome: 'Tech Solutions Ltda', nomeFantasia: 'Tech Solutions', razaoSocial: 'Tech Solutions Ltda ME', cnpj: '12345678000101', rua: 'Rua da Tecnologia', numero: '100', bairro: 'Centro', cidade: 'São Paulo', complemento: 'Sala 101', estado: 'SP', cep: '01001000', telefone: '11999990001', contatoRhNome: 'Ana Silva', contatoRhEmail: 'rh@techsolutions.com', ativo: true },
    { nome: 'Inovação Digital S.A.', nomeFantasia: 'Inovação Digital', razaoSocial: 'Inovação Digital S.A.', cnpj: '98765432000102', rua: 'Avenida Brasil', numero: '500', bairro: 'Jardim América', cidade: 'Rio de Janeiro', complemento: 'Bloco B', estado: 'RJ', cep: '20040020', telefone: '21999990002', contatoRhNome: 'Carlos Santos', contatoRhEmail: 'rh@inovacaodigital.com', ativo: true },
    { nome: 'Construtora ABC', nomeFantasia: 'ABC Construções', razaoSocial: 'Construtora ABC Ltda', cnpj: '11222333000103', rua: 'Rua das Obras', numero: '250', bairro: 'Industrial', cidade: 'Belo Horizonte', complemento: 'Loja 5', estado: 'MG', cep: '30130000', telefone: '31999990003', contatoRhNome: 'Maria Oliveira', contatoRhEmail: 'rh@construtorabc.com', ativo: true },
    { nome: 'Farmácia Saúde Total', nomeFantasia: 'Saúde Total', razaoSocial: 'Farmácia Saúde Total Ltda', cnpj: '44555666000104', rua: 'Avenida Principal', numero: '75', bairro: 'Vila Nova', cidade: 'Curitiba', complemento: 'Apto 201', estado: 'PR', cep: '80010100', telefone: '41999990004', contatoRhNome: 'João Pereira', contatoRhEmail: 'rh@saudetotal.com', ativo: true },
    { nome: 'Supermarket Express', nomeFantasia: 'Express Market', razaoSocial: 'Supermarket Express Ltda', cnpj: '77888999000105', rua: 'Rua do Comércio', numero: '300', bairro: 'Centro', cidade: 'Florianópolis', complemento: 'Fundos', estado: 'SC', cep: '88010001', telefone: '48999990005', contatoRhNome: 'Lucia Mendes', contatoRhEmail: 'rh@expressmarket.com', ativo: true },
  ];

  for (const companyData of companiesData) {
    const company = companiesRepo.create(companyData);
    await companiesRepo.save(company);
  }

  console.log(`✅ ${companiesData.length} empresas criadas`);
  console.log('✅ Usuário Diretor criado (senha: admin)');
  
  return savedUser.id;
}

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

async function seedAssessmentQuestions(dataSource: DataSource) {
  console.log('\n── 3/4  Questões da avaliação ───────────────────────');

  const repo = dataSource.getRepository(AssessmentQuestion);
  await repo.clear().catch(() => null);

  const opcoes = [
    { value: 'sim', label: 'Sim' },
    { value: 'maioria', label: 'Maioria das vezes' },
    { value: 'raras', label: 'Raras vezes' },
    { value: 'nao', label: 'Não' },
  ];

  const questoes: Partial<AssessmentQuestion>[] = [
    { code: 'q1',  displayOrder: 1,  type: 'multiple_choice', options: opcoes, text: 'Atende as regras.' },
    { code: 'q2',  displayOrder: 2,  type: 'multiple_choice', options: opcoes, text: 'Socializa com o grupo.' },
    { code: 'q3',  displayOrder: 3,  type: 'multiple_choice', options: opcoes, text: 'Isola-se do grupo.' },
    { code: 'q4',  displayOrder: 4,  type: 'multiple_choice', options: opcoes, text: 'Possui tolerância a frustração.' },
    { code: 'q5',  displayOrder: 5,  type: 'multiple_choice', options: opcoes, text: 'Respeita colega e professores.' },
    { code: 'q6',  displayOrder: 6,  type: 'multiple_choice', options: opcoes, text: 'Faz relatos fantasiosos.' },
    { code: 'q7',  displayOrder: 7,  type: 'multiple_choice', options: opcoes, text: 'Concentra-se nas atividades.' },
    { code: 'q8',  displayOrder: 8,  type: 'multiple_choice', options: opcoes, text: 'Tem iniciativa.' },
    { code: 'q9',  displayOrder: 9,  type: 'multiple_choice', options: opcoes, text: 'Sonolência durante as atividades em sala de aula.' },
    { code: 'q10', displayOrder: 10, type: 'multiple_choice', options: opcoes, text: 'Alterações intensas de humor.' },
    { code: 'q11', displayOrder: 11, type: 'multiple_choice', options: opcoes, text: 'Indica oscilação repentina de humor.' },
    { code: 'q12', displayOrder: 12, type: 'multiple_choice', options: opcoes, text: 'Irrita-se com facilidade.' },
    { code: 'q13', displayOrder: 13, type: 'multiple_choice', options: opcoes, text: 'Ansiedade.' },
    { code: 'q14', displayOrder: 14, type: 'multiple_choice', options: opcoes, text: 'Escuta quando seus colegas falam.' },
    { code: 'q15', displayOrder: 15, type: 'multiple_choice', options: opcoes, text: 'Escuta e segue orientação dos professores.' },
    { code: 'q16', displayOrder: 16, type: 'multiple_choice', options: opcoes, text: 'Mantém-se em sala de aula.' },
    { code: 'q17', displayOrder: 17, type: 'multiple_choice', options: opcoes, text: 'Desloca-se muito na sala.' },
    { code: 'q18', displayOrder: 18, type: 'multiple_choice', options: opcoes, text: 'Fala demasiadamente.' },
    { code: 'q19', displayOrder: 19, type: 'multiple_choice', options: opcoes, text: 'É pontual.' },
    { code: 'q20', displayOrder: 20, type: 'multiple_choice', options: opcoes, text: 'É assíduo.' },
    { code: 'q21', displayOrder: 21, type: 'multiple_choice', options: opcoes, text: 'Demonstra desejo de trabalhar.' },
    { code: 'q22', displayOrder: 22, type: 'multiple_choice', options: opcoes, text: 'Apropria-se indevidamente daquilo que não é seu.' },
    { code: 'q23', displayOrder: 23, type: 'multiple_choice', options: opcoes, text: 'Indica hábito de banho diário.' },
    { code: 'q24', displayOrder: 24, type: 'multiple_choice', options: opcoes, text: 'Indica hábito de escovação e qualidade na escovação.' },
    { code: 'q25', displayOrder: 25, type: 'multiple_choice', options: opcoes, text: 'Indica cuidado com a aparência e limpeza do uniforme.' },
    { code: 'q26', displayOrder: 26, type: 'multiple_choice', options: opcoes, text: 'Indica autonomia quanto a estes hábitos (23, 24, 25).' },
    { code: 'q27', displayOrder: 27, type: 'multiple_choice', options: opcoes, text: 'Indica falta do uso de medicação com oscilações de comportamento.' },
    { code: 'q28', displayOrder: 28, type: 'multiple_choice', options: opcoes, text: 'Tem meio articulado de conseguir receitas e aquisições das medicações.' },
    { code: 'q29', displayOrder: 29, type: 'multiple_choice', options: opcoes, text: 'Traz seus materiais organizados.' },
    { code: 'q30', displayOrder: 30, type: 'multiple_choice', options: opcoes, text: 'Usa transporte coletivo.' },
    { code: 'q31', displayOrder: 31, type: 'multiple_choice', options: opcoes, text: 'Tem iniciativa diante das atividades propostas.' },
    { code: 'q32', displayOrder: 32, type: 'multiple_choice', options: opcoes, text: 'Localiza-se no espaço da Instituição.' },
    { code: 'q33', displayOrder: 33, type: 'multiple_choice', options: opcoes, text: 'Situa-se nas trocas de sala e atividades.' },
    { code: 'q34', displayOrder: 34, type: 'multiple_choice', options: opcoes, text: 'Interage par a par.' },
    { code: 'q35', displayOrder: 35, type: 'multiple_choice', options: opcoes, text: 'Interage em grupo.' },
    { code: 'q36', displayOrder: 36, type: 'multiple_choice', options: opcoes, text: 'Cria conflitos e intrigas.' },
    { code: 'q37', displayOrder: 37, type: 'multiple_choice', options: opcoes, text: 'Promove a harmonia.' },
    { code: 'q38', displayOrder: 38, type: 'multiple_choice', options: opcoes, text: 'Faz intrigas entre colegas x professores.' },
    { code: 'q39', displayOrder: 39, type: 'multiple_choice', options: opcoes, text: 'Demonstra interesse em participar das atividades extraclasses.' },
    { code: 'q40', displayOrder: 40, type: 'multiple_choice', options: opcoes, text: 'Você percebe que existe interação/participação da família em apoio ao usuário na Instituição.' },
    { code: 'q41', displayOrder: 41, type: 'multiple_choice', options: opcoes, text: 'Você percebe superproteção por parte da família quanto a autonomia do usuário.' },
    { code: 'q42', displayOrder: 42, type: 'multiple_choice', options: opcoes, text: 'Usuário traz relatos negativos da família (de forma geral).' },
    { code: 'q43', displayOrder: 43, type: 'multiple_choice', options: opcoes, text: 'Usuário traz relatos positivos da família (de forma geral).' },
    { code: 'q44', displayOrder: 44, type: 'multiple_choice', options: opcoes, text: 'Você percebe incentivo quanto a busca de autonomia para o usuário por parte da família.' },
    { code: 'q45', displayOrder: 45, type: 'multiple_choice', options: opcoes, text: 'Você percebe incentivo quanto a inserção do usuário no mercado de trabalho por parte da família.' },
    { code: 'q46', displayOrder: 46, type: 'multiple_choice', options: opcoes, text: 'Traz os documentos enviados pela Instituição assinado.' },
    { code: 'openQ1', displayOrder: 47, type: 'text', options: null, text: 'Em sua opinião o usuário tem perfil para esta instituição? Por quê?', conditionalField: null, conditionalNotValue: null },
    { code: 'openQ2', displayOrder: 48, type: 'text', options: null, text: 'Em que situações demonstra irritações?', conditionalField: 'q12', conditionalNotValue: 'nao' },
    { code: 'openQ3', displayOrder: 49, type: 'text', options: null, text: 'Caso o aluno faça uso de medicação. Observações:', conditionalField: 'q27,q28', conditionalNotValue: 'nao' },
  ];

  for (const q of questoes) {
    const entity = repo.create(q);
    await repo.save(entity);
  }

  console.log(`✅ ${questoes.length} questões de avaliação cadastradas`);
}

// ====================== FUNÇÕES DE BULK (100 REGISTROS) ======================
async function seedBulkCompanies(dataSource: DataSource) {
  console.log('\n🏢 Criando +100 Empresas extras...');
  const repo = dataSource.getRepository(Company);
  const entities = [];

  for (let i = 1; i <= 100; i++) {
    const company = repo.create({
      nome: `Tech Solutions Ltda${i}`,
      cnpj: gerarCNPJ(i),
      rua: "Rua das Indústrias",
      numero: "500",
      bairro: "Centro",
      estado: "SP",
      cep: "01001000",
      nomeFantasia: `TechSol${i}`,
      razaoSocial: `Tech Solutions Ltda ME ${i}`,
      telefone: "1133445566",
      contatoRhNome: "Carolina Mendes",
      contatoRhEmail: `rh${i}@techsol.com.br`,
      ativo: true
    });
    entities.push(company);
  }

  await repo.save(entities);
  console.log('✅ +100 Empresas extras criadas!');
}

async function seedBulkStudents(dataSource: DataSource) {
  console.log('\n👨‍🎓 Criando +100 Alunos...');
  const repo = dataSource.getRepository(Student);
  const entities = [];
  let cpfBase = 45672328910;

  for (let i = 1; i <= 100; i++) {
    const student = repo.create({
      nome: `Maria Silva Cardoso${i}`,
      cpf: String(cpfBase + i),
      dataNascimento: "2005-03-15",
      dataIngresso: "2025-02-01",
      dataDesligamento: "2025-12-31",
      status: "Ativo",
      observacaoBreve: "Aluno dedicado",
      observacaoDetalhada: "Mostra interesse em programação...",
      telefone: "11999887766",
      email: `maria2${i}@example.com`,
      endereco: "Rua das Flores, 123",
      nomeResponsavel: "Ana Silva",
      telefoneResponsavel: "11988776655",
      usaMedicamento: false,
      infoMedicamentos: "Ritalina 10mg",
      acompanhamento: { av1: false, av2: false, entrevista1: false, entrevista2: false, resultado: "Pendente" }
    });
    entities.push(student);
  }

  await repo.save(entities);
  console.log('✅ +100 Alunos criados!');
}

async function seedBulkAssessments(dataSource: DataSource, userId: number) {
  console.log('\n📝 Criando Avaliações...');
  const repo = dataSource.getRepository(Assessment);
  const students = await dataSource.getRepository(Student).find({ take: 100, order: { id: 'ASC' } });

  let count = 0;
  for (const student of students) {
    const requests = [];
    if (student.id % 3 === 0) {
      requests.push(criarPayloadAssessment(student.id, "primeira", userId));
      requests.push(criarPayloadAssessment(student.id, "segunda", userId));
    } else {
      const tipo = student.id % 2 === 0 ? "segunda" : "primeira";
      requests.push(criarPayloadAssessment(student.id, tipo, userId));
    }

    for (const payload of requests) {
      count++;
      const assessment = repo.create(payload);
      await repo.save(assessment);
    }
  }
  console.log(`✅ ${count} Avaliações criadas!`);
}

async function seedBulkPlacements(dataSource: DataSource, userId: number) {
  console.log('\n💼 Criando Encaminhamentos...');
  const placementRepo = dataSource.getRepository(Placement);
  const companies = await dataSource.getRepository(Company).find({ select: ['id'] });
  const students = await dataSource.getRepository(Student).find({ take: 100, order: { id: 'ASC' }, select: ['id'] });

  if (students.length === 0 || companies.length === 0) {
    console.log('⚠️ Sem alunos ou empresas suficientes para criar encaminhamentos');
    return;
  }

  for (let i = 0; i < 100; i++) {
    const payload = {
      studentId: students[i % students.length].id,
      empresaId: companies[i % companies.length].id,
      dataAdmissao: "2025-03-01",
      funcao: `Auxiliar Administrativo ${i + 1}`,
      contatoRh: `Carolina - rh${i + 1}@empresa.com`,
      dataDesligamento: "2025-12-31",
      dataProvavelDesligamento: "2025-11-30",
      observacoes: `Bom desempenho ${i + 1}`,
      status: "Ativo",
      createdBy: userId
    };

    const placement = placementRepo.create(payload);
    await placementRepo.save(placement);
  }
  console.log('✅ +100 Encaminhamentos criados!');
}

// ====================== FUNÇÃO PARA PERGUNTAR NO TERMINAL ======================
function perguntarOpcao(): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log('\n📋 Escolha uma opção:\n');
    console.log('  1 → Seed Básico (usuário, 5 empresas, permissões, questões)');
    console.log('  2 → Seed Completo (Básico + 100 alunos, empresas, avaliações, encaminhamentos)\n');
    
    rl.question('Digite 1 ou 2: ', (answer) => {
      rl.close();
      const opcao = parseInt(answer);
      resolve(opcao === 2 ? 2 : 1);
    });
  });
}

// ====================== FUNÇÃO PRINCIPAL ======================
async function seed() {
  console.clear();
  console.log('🌱 === SEED INTERATIVO PE-IV ===\n');

  let app: any;
  let dataSource: DataSource;

  try {
    app = await NestFactory.create(AppModule, { logger: false });
    dataSource = app.get(DataSource);

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }

    console.log('✅ Conexão com banco estabelecida');
    console.log('📋 Sincronizando tabelas...');
    await dataSource.synchronize();

    // Pergunta a opção usando readline
    const opcao = await perguntarOpcao();

    if (opcao === 1) {
      await seedData(dataSource);
      await seedPermissions(dataSource);
      await seedAssessmentQuestions(dataSource);
    } else {
      // Pega o ID do usuário criado
      const userId = await seedData(dataSource);
      await seedPermissions(dataSource);
      await seedAssessmentQuestions(dataSource);
      await seedBulkCompanies(dataSource);
      await seedBulkStudents(dataSource);
      await seedBulkAssessments(dataSource, userId);
      await seedBulkPlacements(dataSource, userId);
    }

    console.log('\n── 4/4  Resumo ─────────────────────────────────────');
    console.log('📋 Usuário: Diretor | Senha: admin | Role: diretor');
    console.log('🏢 5 empresas de exemplo + 100 extras (se completo)');
    console.log('🔑 4 papéis com permissões');
    console.log('📝 49 questões de avaliação');
    console.log('🎉 Seed finalizado com sucesso!\n');
    
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

seed();