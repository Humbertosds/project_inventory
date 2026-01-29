# 📦 API de Gestão de Estoque

> Backend RESTful para controle de inventário, movimentações e indicadores de estoque.

[![Node](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Drizzle](https://img.shields.io/badge/Drizzle_ORM-0.45-FFCC00?style=flat-square)](https://orm.drizzle.team)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-6BA539?style=flat-square&logo=openapi-initiative&logoColor=white)](https://www.openapis.org/)

---

## O que o projeto faz

API para **gestão de estoque** com:

- **Autenticação** — login/logout e sessão via token Bearer
- **Usuários** — cadastro, listagem, edição e avatar (upload com Sharp)
- **Categorias** — CRUD de categorias para organizar produtos
- **Produtos** — cadastro com preço, quantidade mínima/máxima e unidade (kg, g, l, ml, un)
- **Movimentações** — entradas e saídas de estoque (in/out) com histórico
- **Dashboard** — valor total do inventário, resumo de movimentações, gráficos, produtos em baixo/alto estoque e produtos parados

Todas as rotas (exceto `/api/auth/login`, `/api/auth/logout` e `/api/ping`) exigem autenticação via header `Authorization: Bearer <token>`.

---

## Stack

| Camada        | Tecnologia |
|---------------|------------|
| Runtime       | Node.js (ESM) |
| Linguagem     | TypeScript |
| Framework     | Express 5 |
| Banco de dados| PostgreSQL |
| ORM           | Drizzle ORM |
| Validação     | Zod |
| Autenticação  | bcrypt + token em texto (header) |
| Upload        | Multer + Sharp (redimensionamento de imagens) |
| Documentação  | OpenAPI 3.0 + Swagger UI (swagger-ui-express) |

---

## Documentação OpenAPI

A API está documentada com **OpenAPI 3.0**. Com o servidor rodando, a documentação interativa (Swagger UI) fica disponível em:

**http://localhost:4000/api-docs**

Na interface você pode:

- Ver todos os endpoints, parâmetros e schemas de request/response
- Testar as rotas diretamente ("Try it out")
- Autenticar com o token obtido em `POST /auth/login` (botão **Authorize**) para chamar rotas protegidas

A especificação está em `src/config/openapi.ts` e cobre Auth, Users, Categories, Products, Moves e Dashboard.

---

## Estrutura da API

Base URL: `/api`

| Recurso     | Endpoints | Descrição |
|------------|-----------|-----------|
| **Auth**   | `POST /auth/login`, `POST /auth/logout`, `GET /auth/me` | Login, logout e dados do usuário logado |
| **Users**  | `GET|POST /users`, `GET|PUT|DELETE /users/:id` | CRUD de usuários (avatar no PUT) |
| **Categories** | `GET|POST /categories`, `GET|PUT|DELETE /categories/:id` | CRUD de categorias |
| **Products**   | `GET|POST /products`, `GET|PUT|DELETE /products/:id` | CRUD de produtos (paginação e busca) |
| **Moves**  | `GET /moves`, `POST /moves` | Listar movimentações (paginação) e registrar entrada/saída |
| **Dashboard** | `GET /dashboard/inventory-value`, `moves-summary`, `moves-graph`, `low-stock`, `high-stock`, `stagnant-products` | Métricas e indicadores |

Health check: `GET /api/ping` → `{ "pong": true }`.

---

## Modelo de dados (resumo)

- **users** — nome, email, senha (hash), avatar, isAdmin, token
- **categories** — nome, soft delete (deletedAt)
- **products** — nome, categoria, preço unitário, tipo de unidade (kg, g, l, ml, un), quantidade, mínimo, máximo, soft delete
- **moves** — produto, usuário, tipo (in/out), quantidade, preço unitário, data

---

## Como rodar o projeto

### Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente ou via URL remota

### 1. Clonar e instalar dependências

```bash
git clone <repo>
cd projeto_estoque
npm install
```

### 2. Variáveis de ambiente

Crie um arquivo `.env` na raiz (o app usa `--env-file=.env`):

```env
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://usuario:senha@localhost:5432/projeto_estoque
```

Ajuste `DATABASE_URL` para o seu PostgreSQL.

### 3. Banco de dados

Aplicar migrações (schema já gerado em `drizzle/`):

```bash
npm run db:migrate
```

Ou, em desenvolvimento, sincronizar direto com o schema:

```bash
npm run db:push
```

(Opcional) Abrir Drizzle Studio para inspecionar dados:

```bash
npm run db:studio
```

### 4. Subir o servidor

**Desenvolvimento**:

```bash
npm run dev
```

**Produção** (build + start):

```bash
npm run build
npm start
```

O servidor sobe em `http://localhost:4000` (ou na `PORT` do `.env`).

---

## Scripts disponíveis

| Comando        | Uso |
|----------------|-----|
| `npm run dev`  | Sobe o servidor em modo desenvolvimento (tsx watch + .env) |
| `npm run build`| Compila TypeScript para `dist/` |
| `npm start`    | Roda o app compilado em produção |
| `npm run db:generate` | Gera migrações Drizzle a partir do schema |
| `npm run db:migrate`  | Aplica migrações no banco |
| `npm run db:push`     | Sincroniza schema com o banco (dev) |
| `npm run db:studio`   | Abre Drizzle Studio |

---

## Estrutura do repositório

```
projeto_estoque/
├── src/
│   ├── config/       # Especificação OpenAPI (openapi.ts)
│   ├── controllers/   # Lógica das rotas (auth, users, categories, products, moves, dashboard)
│   ├── db/
│   │   ├── schema/    # Tabelas Drizzle (users, categories, products, moves)
│   │   └── connection.ts
│   ├── middlewares/   # auth, erro global, upload de avatar
│   ├── routes/       # Definição das rotas e montagem em /api
│   ├── services/     # Regras de negócio e acesso a dados
│   ├── types/        # Tipos Express (ex.: user no request)
│   ├── utils/        # AppError
│   ├── validators/   # Schemas Zod por domínio
│   └── server.ts     # App Express, CORS, JSON, roteador, error handler
├── drizzle/          # Migrações e metadados Drizzle
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---
