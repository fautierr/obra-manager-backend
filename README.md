# Obra Manager API

A backend API built with **NestJS**, **GraphQL**, and **PostgreSQL** for managing projects, statuses, and related data.

## 📌 Features

- Built with **NestJS** (modular architecture, TypeScript)
- **GraphQL** API with schema-first or code-first approach
- PostgreSQL database integration via TypeORM
- Example query to fetch all projects
- Environment variable configuration

## 📂 Tech Stack

- [NestJS](https://nestjs.com/) - Node.js framework
- [GraphQL](https://graphql.org/) - Query language for APIs
- [TypeORM](https://typeorm.io/) - ORM for TypeScript & Node.js
- [PostgreSQL](https://www.postgresql.org/) - Relational database

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/fautierr/obra-manager-backend
cd obra-manager-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a .env file in the root directory:

```bash
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
PORT=4000
```

### 4. Start the server

```bash
npm run start:dev
```

The API will be available at:

```bash
http://localhost:4000/graphql
```

## 📌 Project Structure

```bash
src
├── projects
│   ├── projects.module.ts
│   ├── projects.service.ts
│   ├── projects.resolver.ts
│   ├── entities
│   └── dto
├── app.module.ts
└── main.ts
```
