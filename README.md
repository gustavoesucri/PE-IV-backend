# PE-IV - Como Executar

## Pré-requisitos

- Node.js 16+
- PostgreSQL rodando
- npm ou yarn

## Configuração

1. Copie `.env.example` para `.env`
2. Configure as variáveis conforme necessário

## Backend

```bash
cd PE-IV-backend
npm install
createdb idf-pev    # cria o banco de dados (idf-pev é o nome do BD sugerido no .env.example, altere se necessário)
npm run seed        # popula o banco com dados
npm run start       # inicia o servidor
```

## Frontend

```bash
cd PE-IV-frontend
npm install
npm run start       # inicia o cliente
```

## Login

**Usuário:** Diretor  
**Senha:** admin

Será solicitado o seu e-mail (foi modificado para NÃO precisar alterar o que estiver ali) e uma nova senha, aconselha-se uma senha rápida e prática: 

    Qwert12345!

Isso provavelmente gerará um alerta, clique para permanecer na página e já terá o acesso. Para logar novamente utilize a senha que você colocou.

---

OBS: Não mais será enviado um e-mail. No momento, um e-mail só seria enviado se usar o .env do outro desenvolvedor. Contudo, ainda assim foi modificado para que isso não gerasse um atrito extra, então, no máximo será um e-mail avisando que o e-mail foi modificado, caso o .env dele (completo com SMTP) seja utilizado.




