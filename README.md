# Backend API - Podium Serviços

Sistema de gestão de transporte corporativo B2B com clean architecture, desenvolvido com FastAPI e PostgreSQL.

## 📋 Descrição

API REST para gerenciar corridas corporativas, usuários (admin, motoristas, funcionários), empresas e centros de custo. Implementa autenticação JWT e arquitetura limpa.

## 🚀 Versão Atual

**v0.1.0** - Versão inicial com estrutura base

## 🏗️ Arquitetura

```
backend-api/
├── app/
│   ├── api/
│   │   └── v1/           # Rotas versionadas
│   │       └── auth.py   # Autenticação e cadastro
│   ├── core/             # Configurações
│   │   ├── config.py     # Settings
│   │   ├── database.py   # Conexão DB
│   │   └── security.py   # JWT e hash de senhas
│   ├── models/           # Modelos SQLModel
│   │   └── domain.py     # Entidades do domínio
│   ├── schemas/          # Pydantic schemas
│   │   └── user.py       # DTOs de usuário
│   ├── services/         # Regras de negócio
│   ├── __init__.py
│   └── main.py           # Aplicação FastAPI
├── .env                  # Variáveis de ambiente
├── .gitignore
├── requirements.txt      # Dependências
└── README.md
```

## 🛠️ Tecnologias

- **FastAPI** - Framework web moderno e rápido
- **SQLModel** - ORM com Pydantic e SQLAlchemy
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **Uvicorn** - Servidor ASGI

## 📦 Instalação

### Pré-requisitos

- Python 3.12+
- PostgreSQL 14+

### Setup

1. Clone o repositório
```bash
git clone <repo-url>
cd backend-api
```

2. Crie e ative o ambiente virtual
```bash
python -m venv venv
venv\Scripts\Activate.ps1  # Windows
# source venv/bin/activate  # Linux/Mac
```

3. Instale as dependências
```bash
pip install -r requirements.txt
```

4. Configure as variáveis de ambiente
```bash
# Crie o arquivo .env com:
PROJECT_NAME="Podium Serviços API"
DATABASE_URL="postgresql://user:password@localhost/podium_db"
SECRET_KEY="sua-chave-secreta-aqui"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

5. Execute a aplicação
```bash
uvicorn app.main:app --reload
```

### Seed do primeiro admin (necessário para usar rotas protegidas de signup)

Com o venv ativo e variáveis de ambiente carregadas:

```bash
python -m app.scripts.seed_admin \
	--email admin@podium.com \
	--name "Admin" \
	--password "TroqueEstaSenha!"
```

Você também pode definir via ambiente:

```bash
set SEED_ADMIN_EMAIL=admin@podium.com
set SEED_ADMIN_NAME=Admin
set SEED_ADMIN_PASSWORD=TroqueEstaSenha!
python -m app.scripts.seed_admin
```

## 📚 Documentação da API

Após iniciar o servidor, acesse:
- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc

## 🔑 Endpoints Principais

### Autenticação

- `POST /api/v1/signup/admin` - Cadastrar administrador
- `POST /api/v1/signup/driver` - Cadastrar motorista
- `POST /api/v1/signup/employee` - Cadastrar funcionário
- `POST /api/v1/login` - Login (retorna JWT)

## 🗄️ Modelos de Dados

### Entidades Principais

- **Company** - Empresas clientes B2B
- **CostCenter** - Centros de custo das empresas
- **User** - Usuário base (admin/driver/employee)
- **DriverProfile** - Perfil específico de motorista
- **EmployeeProfile** - Perfil específico de funcionário
- **PricingRule** - Regras de precificação
- **Ride** - Corridas solicitadas

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação JWT (Bearer Token)
- Validação de dados com Pydantic
- Foreign keys e constraints no banco

## 📝 Roadmap

- [ ] CRUD completo de empresas
- [ ] Gestão de corridas
- [ ] Sistema de matching motorista-passageiro
- [ ] Notificações em tempo real
- [ ] Relatórios e dashboards
- [ ] Integração com mapas

## 👥 Autores

Podium Serviços - Sistema de Transporte Corporativo

## 📄 Licença

Projeto proprietário - Todos os direitos reservados

---

**Última atualização:** Dezembro 2025
