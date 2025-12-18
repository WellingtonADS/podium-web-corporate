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

## ✅ Testes

### Requisitos de teste
- As dependências `pytest` e `httpx` já estão no `requirements.txt`.

### Executar suíte de testes (FastAPI + integração)
```bash
python -m pytest -q
```

### Rodar somente os testes de múltiplos motoristas
```bash
python -m pytest app/tests/test_multi_drivers_integration.py -q
```

### Teste manual (requer servidor rodando)
```bash
uvicorn app.main:app --reload
python -m app.tests.test_multi_drivers
```
Resultado esperado inclui mensagem de sucesso mostrando os dois motoristas com coordenadas válidas.

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

## 🌐 CORS

O backend está configurado com `CORSMiddleware` permitindo chamadas do frontend local:

- http://localhost:3000
- http://127.0.0.1:3000

Para adicionar novas origens, edite `app/main.py` e inclua os domínios no array `origins`.

Exemplo:
```python
origins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	"https://seu-dominio.com",
]
```

## ❤️ Health Check

Endpoints de verificação rápida para confirmar disponibilidade da API:

```bash
curl -s http://127.0.0.1:8000/ | jq
curl -s http://127.0.0.1:8000/health | jq
```

Respostas esperadas:

```json
{"message": "Podium Serviços API"}
```

```json
{"status": "ok"}
```

## 🔑 Endpoints Principais

### Autenticação

- `POST /api/v1/signup/admin` - Cadastrar administrador
- `POST /api/v1/signup/driver` - Cadastrar motorista
- `POST /api/v1/signup/employee` - Cadastrar funcionário
- `POST /api/v1/login` - Login (retorna JWT)

### Telemetria GPS (Motoristas)

- `PATCH /api/v1/users/me/location` - Atualizar localização do motorista
- `GET /api/v1/users?role=driver` - Listar motoristas com localização (admin only)

Notas de implementação:
- A listagem de usuários usa eager loading com `selectinload` para evitar N+1 e garantir o carregamento de `driver_profile` durante a serialização.
- Os schemas usam Pydantic v2 (`model_config=ConfigDict(from_attributes=True)`).

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

- [x] CRUD completo de usuários (admin, motoristas, funcionários)
- [x] Sistema de telemetria GPS para motoristas
- [x] Exposição de coordenadas para visualização em dashboards
- [ ] Gestão completa de corridas
- [ ] Sistema de matching motorista-passageiro por proximidade
- [ ] Notificações em tempo real
- [ ] Relatórios e dashboards com mapas
- [ ] Integração com APIs de mapas (Google Maps, OpenStreetMap)

## 👥 Autores

Podium Serviços - Sistema de Transporte Corporativo

## 📄 Licença

Projeto proprietário - Todos os direitos reservados

---

**Última atualização:** Dezembro 2025  
**Versão:** v0.1.0 (com telemetria GPS)
