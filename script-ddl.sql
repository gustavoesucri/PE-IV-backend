-- =========================
-- USERS / ROLES / PERMISSIONS
-- =========================

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  token_recuperacao VARCHAR(255),
  validade_token TIMESTAMP,
  primeiro_login BOOLEAN NOT NULL DEFAULT TRUE,
  email_verificado BOOLEAN NOT NULL DEFAULT FALSE,
  token_verificacao_email VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT now(),
  updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE role_permissions (
  id SERIAL PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE TABLE user_specific_permissions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT fk_user_specific_permissions_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- STUDENTS
-- =========================

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(11) NOT NULL UNIQUE,
  data_nascimento DATE NOT NULL,
  data_ingresso DATE NOT NULL,
  data_desligamento DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'Ativo',
  observacao_breve TEXT,
  observacao_detalhada TEXT,
  acompanhamento JSON,
  telefone VARCHAR(20),
  email VARCHAR(255),
  endereco TEXT,
  nome_responsavel VARCHAR(255),
  telefone_responsavel VARCHAR(20),
  usa_medicamento BOOLEAN DEFAULT FALSE,
  info_medicamentos TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- =========================
-- COMPANIES
-- =========================

CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(14) NOT NULL UNIQUE,
  rua VARCHAR(255),
  numero VARCHAR(10),
  complemento VARCHAR(255),
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(8),
  nome_fantasia VARCHAR(255),
  razao_social VARCHAR(255),
  telefone VARCHAR(20),
  contato_rh_nome VARCHAR(100),
  contato_rh_email VARCHAR(100),
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- =========================
-- PLACEMENTS
-- =========================

CREATE TABLE placements (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  empresa_id INT NOT NULL,
  data_admissao DATE NOT NULL,
  funcao VARCHAR(255) NOT NULL,
  contato_rh VARCHAR(255) NOT NULL,
  data_desligamento DATE NOT NULL,
  data_provavel_desligamento DATE,
  justificativa_desligamento TEXT,
  observacoes TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'Ativo',
  created_by INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_placements_student
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,

  CONSTRAINT fk_placements_company
    FOREIGN KEY (empresa_id) REFERENCES companies(id) ON DELETE CASCADE,

  CONSTRAINT fk_placements_user
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- =========================
-- ASSESSMENTS
-- =========================

CREATE TABLE assessment_questions (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  text TEXT NOT NULL,
  type VARCHAR(20) NOT NULL,
  display_order INT NOT NULL,
  options JSONB,
  conditional_field VARCHAR(50),
  conditional_not_value VARCHAR(20),
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE assessments (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  entry_date DATE NOT NULL,
  assessment_date DATE NOT NULL,
  evaluation_type VARCHAR(50) NOT NULL,
  professor_name VARCHAR(255) NOT NULL,

  q1 VARCHAR(20),
  q2 VARCHAR(20),
  q3 VARCHAR(20),
  q4 VARCHAR(20),
  q5 VARCHAR(20),
  q6 VARCHAR(20),
  q7 VARCHAR(20),
  q8 VARCHAR(20),
  q9 VARCHAR(20),
  q10 VARCHAR(20),
  q11 VARCHAR(20),
  q12 VARCHAR(20),
  q13 VARCHAR(20),
  q14 VARCHAR(20),
  q15 VARCHAR(20),
  q16 VARCHAR(20),
  q17 VARCHAR(20),
  q18 VARCHAR(20),
  q19 VARCHAR(20),
  q20 VARCHAR(20),
  q21 VARCHAR(20),
  q22 VARCHAR(20),
  q23 VARCHAR(20),
  q24 VARCHAR(20),
  q25 VARCHAR(20),
  q26 VARCHAR(20),
  q27 VARCHAR(20),
  q28 VARCHAR(20),
  q29 VARCHAR(20),
  q30 VARCHAR(20),
  q31 VARCHAR(20),
  q32 VARCHAR(20),
  q33 VARCHAR(20),
  q34 VARCHAR(20),
  q35 VARCHAR(20),
  q36 VARCHAR(20),
  q37 VARCHAR(20),
  q38 VARCHAR(20),
  q39 VARCHAR(20),
  q40 VARCHAR(20),
  q41 VARCHAR(20),
  q42 VARCHAR(20),
  q43 VARCHAR(20),
  q44 VARCHAR(20),
  q45 VARCHAR(20),
  q46 VARCHAR(20),

  open_q1 TEXT,
  open_q2 TEXT,
  open_q3 TEXT,

  registered_by INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_assessments_student
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,

  CONSTRAINT fk_assessments_user
    FOREIGN KEY (registered_by) REFERENCES users(id)
);

-- =========================
-- CONTROLS
-- =========================

CREATE TABLE controls (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  data_ingresso DATE,
  data_entrevista1 DATE,
  data_entrevista2 DATE,
  data_resultado DATE,
  resultado VARCHAR(50) NOT NULL DEFAULT 'Pendente',
  created_by INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_controls_student
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,

  CONSTRAINT fk_controls_user
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- =========================
-- FOLLOW UPS
-- =========================

CREATE TABLE follow_ups (
  id SERIAL PRIMARY KEY,
  aluno_id INT NOT NULL,
  company_id INT,
  registered_by INT,
  responsavel_rh_id INT,
  admission_date DATE,
  data_visita DATE NOT NULL,
  contato_com VARCHAR(255) NOT NULL,
  parecer TEXT NOT NULL,
  data_registro DATE NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_followups_student
    FOREIGN KEY (aluno_id) REFERENCES students(id) ON DELETE CASCADE,

  CONSTRAINT fk_followups_company
    FOREIGN KEY (company_id) REFERENCES companies(id),

  CONSTRAINT fk_followups_registered_by
    FOREIGN KEY (registered_by) REFERENCES users(id),

  CONSTRAINT fk_followups_rh
    FOREIGN KEY (responsavel_rh_id) REFERENCES users(id),

  CONSTRAINT fk_followups_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- =========================
-- USER SETTINGS / NOTIFICATIONS
-- =========================

CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  "userId" INT NOT NULL,
  "widgetPositions" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "sidebarOrder" JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes JSONB NOT NULL DEFAULT '[]'::jsonb,
  "monitoredStudents" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "favoriteCompanies" JSONB NOT NULL DEFAULT '[]'::jsonb,
  companies JSONB NOT NULL DEFAULT '[]'::jsonb,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),

  CONSTRAINT fk_user_settings_user
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE global_notifications (
  id INT PRIMARY KEY DEFAULT 1,
  notifications JSONB NOT NULL DEFAULT '{}'::jsonb
);