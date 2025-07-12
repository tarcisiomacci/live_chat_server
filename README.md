# 🧠 Live Chat

Projeto desenvolvido utilizando tecnologias modernas para criação de uma API robusta e eficiente.

---

## 🚀 Tecnologias

- **Node.js** com **TypeScript** nativo (`--experimental-strip-types`)
- **Fastify** – Framework web rápido e eficiente
- **PostgreSQL** com extensão **pgvector** para vetores
- **Drizzle ORM** – Operações de banco type-safe
- **Zod** – Validação de schemas
- **Docker** – Containerização do banco de dados
- **Biome** – Linting e formatação de código

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura modular com:

- Separação de responsabilidades entre rotas, schemas e conexão com banco
- Validação de schemas com **Zod** para segurança de tipos
- ORM **type-safe** com **Drizzle**
- Validação centralizada de variáveis de ambiente

---

## ⚙️ Setup e Configuração

### ✅ Pré-requisitos

- Node.js (versão com suporte a `--experimental-strip-types`)
- Docker e Docker Compose

### 📦 Passo a passo

1. Clone o repositório e acesse a pasta `server`
2. Configure o banco de dados com `docker-compose up -d`
3. Crie um arquivo `.env` na raiz do projeto com:
   - `PORT=3333`
   - `DATABASE_URL=postgresql://docker:docker@localhost:5432/agents`
4. Instale as dependências com `npm install`
5. Execute as migrações do banco com `npx drizzle-kit migrate`
6. (Opcional) Popule o banco com dados de exemplo com `npm run db:seed`
7. Execute o projeto:
   - Desenvolvimento: `npm run dev`
   - Produção: `npm start`

---

## 📚 Scripts Disponíveis

- `npm run dev` – Executa o servidor em modo de desenvolvimento com hot reload
- `npm start` – Executa o servidor em modo de produção
- `npm run db:seed` – Popula o banco de dados com dados de exemplo

---

## 🌐 Endpoints

A API estará disponível em: **http://localhost:3333**

- `GET /health` – Health check da aplicação
- `GET /rooms` – Lista as salas disponíveis
