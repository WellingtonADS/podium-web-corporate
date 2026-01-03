# 🔧 Podium Backend API

API REST para gerenciamento de transporte corporativo B2B, desenvolvido com FastAPI e PostgreSQL. Sistema completo com autenticação JWT, telemetria GPS em tempo real, gerenciamento de usuários e regras de precificação.

## 📋 Descrição

A Podium Backend API é responsável por:

- **Autenticação segura** - JWT com tokens e refresh tokens
- **Gerenciamento de usuários** - Administradores, motoristas, funcionários
- **Telemetria GPS** - Rastreamento em tempo real de motoristas
- **Gestão de empresas** - Multi-tenant B2B com centros de custo
- **Regras de precificação** - Cálculo dinâmico de tarifas
- **Gestão de corridas** - Criação, atualização e rastreamento
- **Health checks** - Verificação de disponibilidade da API

## 🛠️ Stack Tecnológico

| Tecnologia     | Versão   | Propósito                     |
| -------------- | -------- | ----------------------------- |
| **FastAPI**    | 0.104+   | Framework web moderno ASGI    |
| **Python**     | 3.11+    | Linguagem de programação      |
| **PostgreSQL** | 14+      | Banco de dados relacional     |
| **SQLModel**   | 0.0.14+  | ORM com Pydantic + SQLAlchemy |
| **Pydantic**   | 2+       | Validação de dados            |
| **JWT**        | PyJWT 2+ | Autenticação por tokens       |
| **Bcrypt**     | 4+       | Hash seguro de senhas         |
| **Uvicorn**    | 0.24+    | Servidor ASGI                 |
| **Pytest**     | 7+       | Framework de testes           |
| **HTTPX**      | 0.25+    | Cliente HTTP para testes      |

## 📁 Estrutura de Diretórios

```
podium-backend-api/
├── app/
│   ├── api/
│   │   └── v1/                      # Rotas versionadas
│   │       ├── auth.py              # Autenticação e registro
│   │       ├── deps.py              # Dependências compartilhadas
│   │       ├── stats.py             # Endpoints de estatísticas
│   │       ├── users.py             # CRUD de usuários
│   │       └── pricing.py           # Regras de precificação
│   ├── core/                        # Configuração da aplicação
│   │   ├── __init__.py
│   │   ├── config.py                # Settings e variáveis de ambiente
│   │   ├── database.py              # Conexão e session do PostgreSQL
│   │   └── security.py              # JWT, bcrypt e autenticação
│   ├── models/                      # Modelos SQLModel (Banco de dados)
│   │   ├── __init__.py
│   │   ├── domain.py                # Entidades: Company, User, DriverProfile
│   │   └── pricing.py               # PricingRule model
│   ├── schemas/                     # Pydantic schemas (DTOs)
│   │   ├── __init__.py
│   │   ├── user.py                  # UserCreate, UserUpdate, UserResponse
│   │   └── pricing.py               # PricingRuleCreate, PricingRuleResponse
│   ├── services/                    # Regras de negócio
│   │   └── __init__.py
│   ├── scripts/                     # Scripts utilitários
│   │   ├── __init__.py
│   │   ├── seed_admin.py            # Criar primeiro usuário admin
│   │   └── seed_data.py             # Popula dados de teste
│   ├── tests/                       # Suite de testes
│   │   ├── __init__.py
│   │   ├── conftest.py              # Fixtures e configuração
│   │   ├── test_multi_drivers.py    # Testes unitários
│   │   └── test_multi_drivers_integration.py # Testes de integração
│   ├── __init__.py
│   ├── __pycache__/
│   └── main.py                      # Aplicação principal FastAPI
├── docs/                            # Documentação adicional
│   ├── API_IMPROVEMENT_PLAN.md
│   ├── FIXES_AND_IMPROVEMENTS.md
│   ├── MULTI_DRIVER_BUG_ANALYSIS.md
│   └── TEST_DATA.md
├── .env                             # Variáveis de ambiente
├── .env.example                     # Template de .env
├── .gitignore
├── CONTRIBUTING.md                  # Guia de contribuição
├── requirements.txt                 # Dependências Python
├── pytest.ini                       # Configuração pytest
└── README.md
```

## 📋 Pré-requisitos

- **Python** 3.11 ou superior
- **PostgreSQL** 14 ou superior
- **Pip** ou **Poetry** para gerenciamento de dependências
- **Git** para controle de versão

## 📦 Instalação

### 1. Clone o repositório e entre no diretório

```bash
git clone https://github.com/WellingtonADS/podium-backend-api.git
cd podium-backend-api
```

### 2. Crie e ative um ambiente virtual

**Windows:**

```bash
python -m venv venv
venv\Scripts\Activate.ps1
```

**Linux/Mac:**

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Instale as dependências

```bash
pip install -r requirements.txt
```

### 4. Configure variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Projeto
PROJECT_NAME=Podium Services API
DEBUG=True

# Banco de dados
DATABASE_URL=postgresql://user:password@localhost:5432/podium_db

# Segurança
SECRET_KEY=sua-chave-secreta-super-segura-aqui-minimo-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_V1_STR=/api/v1

# CORS (frontend)
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

### 5. Crie o banco de dados (opcional - SQLModel cria automaticamente)

```sql
-- Criar database PostgreSQL
CREATE DATABASE podium_db;
```

### 6. Inicie o servidor

```bash
uvicorn app.main:app --reload
```

A API estará disponível em: **http://127.0.0.1:8000**

## 🔧 Scripts Disponíveis

| Comando                                                                                 | Descrição                      |
| --------------------------------------------------------------------------------------- | ------------------------------ |
| `uvicorn app.main:app --reload`                                                         | Inicia servidor com hot reload |
| `uvicorn app.main:app --host 0.0.0.0 --port 8000`                                       | Inicia servidor em produção    |
| `python -m pytest -q`                                                                   | Executa todos os testes        |
| `python -m pytest app/tests/test_multi_drivers_integration.py -q`                       | Testa drivers múltiplos        |
| `python -m pytest -v --tb=short`                                                        | Testes com output verboso      |
| `python -m pytest --cov=app --cov-report=html`                                          | Cobertura de testes            |
| `python -m app.scripts.seed_admin --email admin@podium.com --password TroqueEstaSenha!` | Cria primeiro admin            |
| `python -m app.scripts.seed_data`                                                       | Popula dados de teste          |

## 📡 Documentação da API

Após iniciar o servidor, acesse a documentação interativa:

- **Swagger UI (Recomendado):** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc:** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
- **OpenAPI JSON:** [http://127.0.0.1:8000/openapi.json](http://127.0.0.1:8000/openapi.json)

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação segura.

### Fluxo de Autenticação

```
1. POST /api/v1/login          → Recebe email + password
   ↓
2. API valida credenciais       → bcrypt.verify()
   ↓
3. Retorna access_token (JWT)   → Válido por 30 minutos
   ↓
4. Cliente envia no header      → Authorization: Bearer <token>
   ↓
5. Middleware valida token      → Identifica usuário
```

### Exemplo: Login e Requisição Autenticada

```bash
# 1. Login
curl -X POST "http://127.0.0.1:8000/api/v1/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@podium.com&password=TroqueEstaSenha!"

# Resposta:
# {
#   "access_token": "eyJhbGc...",
#   "token_type": "bearer"
# }

# 2. Usar token em próxima requisição
curl -X GET "http://127.0.0.1:8000/api/v1/users/me" \
  -H "Authorization: Bearer eyJhbGc..."
```

## 🧪 Testes

### Estrutura de Testes

Os testes estão organizados em `app/tests/`:

```
app/tests/
├── conftest.py                      # Fixtures globais
├── test_multi_drivers.py            # Testes unitários
└── test_multi_drivers_integration.py # Testes de integração
```

### Executar Testes

```bash
# Todos os testes
python -m pytest -q

# Apenas integração
python -m pytest app/tests/test_multi_drivers_integration.py -q

# Com output verboso
python -m pytest -v

# Com cobertura de código
python -m pytest --cov=app

# Modo watch (rerun ao salvar)
python -m pytest -q --lf  # Rerun last failed
```

### Exemplo de Teste

```python
# app/tests/test_multi_drivers.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_create_driver(client):
    response = client.post(
        "/api/v1/signup/driver",
        json={
            "email": "driver@example.com",
            "password": "secure123",
            "name": "João Driver"
        }
    )
    assert response.status_code == 201
    assert response.json()["email"] == "driver@example.com"
```

## 🌍 Endpoints Principais

### 🔑 Autenticação

```
POST   /api/v1/login                    # Login (email + password)
POST   /api/v1/signup/admin             # Registrar administrador
POST   /api/v1/signup/driver            # Registrar motorista
POST   /api/v1/signup/employee          # Registrar funcionário
GET    /api/v1/users/me                 # Perfil do usuário autenticado
```

### 👥 Gerenciamento de Usuários

```
GET    /api/v1/users                    # Listar todos os usuários
GET    /api/v1/users/{user_id}          # Obter usuário por ID
PATCH  /api/v1/users/{user_id}          # Atualizar usuário
DELETE /api/v1/users/{user_id}          # Deletar usuário
GET    /api/v1/users?role=driver        # Filtrar por role (driver/employee/admin)
```

### 🗺️ Telemetria GPS (Motoristas)

```
PATCH  /api/v1/users/me/location        # Atualizar localização do motorista
GET    /api/v1/users?role=driver        # Listar motoristas com coordenadas (admin only)
```

**Exemplo de atualização de localização:**

```bash
curl -X PATCH "http://127.0.0.1:8000/api/v1/users/me/location" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -23.5505,
    "longitude": -46.6333
  }'
```

### 💰 Precificação

```
GET    /api/v1/pricing                  # Listar regras de precificação
POST   /api/v1/pricing                  # Criar regra de precificação
GET    /api/v1/pricing/{pricing_id}     # Obter regra por ID
PATCH  /api/v1/pricing/{pricing_id}     # Atualizar regra
DELETE /api/v1/pricing/{pricing_id}     # Deletar regra
```

### 📊 Estatísticas

```
GET    /api/v1/stats/drivers            # Estatísticas gerais de motoristas
GET    /api/v1/stats/rides              # Estatísticas de corridas
GET    /api/v1/stats/revenue            # Dados de receita
```

### ❤️ Health Check

```
GET    /                                # Status da API
GET    /health                          # Health check simples
```

```bash
curl -s http://127.0.0.1:8000/ | jq
# {"message": "Podium Serviços API"}

curl -s http://127.0.0.1:8000/health | jq
# {"status": "ok"}
```

## 🗄️ Modelos de Dados

### Company (Empresa)

- ID, nome, CNPJ
- Informações de contato
- Plano de serviço
- Data de criação/atualização

### CostCenter (Centro de Custo)

- ID, código, nome
- Empresa relacionada
- Orçamento mensal
- Responsável

### User (Usuário Base)

- ID, email, senha (bcrypt)
- Nome, role (admin/driver/employee)
- Status (ativo/inativo)
- Timestamp de criação/atualização

### DriverProfile (Perfil de Motorista)

- ID, usuário relacionado
- Licença (CNH), dados do veículo
- Localização atual (latitude/longitude)
- Rating médio
- Status (ativo/inativo/bloqueado)

### EmployeeProfile (Perfil de Funcionário)

- ID, usuário relacionado
- Centro de custo
- Departamento
- Manager

### PricingRule (Regra de Precificação)

- ID, nome, descrição
- Tipo (base/por_km/por_minuto)
- Valores
- Ativa/Inativa
- Data de vigência

### Ride (Corrida)

- ID, motorista, passageiro
- Localização origem/destino
- Status (pending/accepted/completed/cancelled)
- Valor, distância, duração
- Timestamp

## 🔒 Segurança

### Implementações

✅ **Senhas**: Criptografadas com bcrypt (não reversível)  
✅ **Tokens**: JWT com expiração (30 minutos)  
✅ **CORS**: Configurável por origem (localhost:3000, etc)  
✅ **SQL Injection**: Prevenido com ORM parameterizado  
✅ **Validação**: Pydantic valida todos os inputs  
✅ **Rate Limiting**: Implementado em endpoints críticos  
✅ **Headers de Segurança**: HTTPS recomendado em produção

### Configurar CORS

Edite `app/main.py` para adicionar domínios:

```python
origins = [
    "http://localhost:3000",      # Frontend local
    "http://localhost:5173",      # Vite dev server
    "https://seu-dominio.com",    # Produção
]
```

## 🚀 Deployment

### Variáveis de Ambiente (Produção)

```env
DEBUG=False
DATABASE_URL=postgresql://prod_user:prod_password@prod_db:5432/podium_prod
SECRET_KEY=gerar-chave-aleatoria-segura-em-producao
```

### Docker (Opcional)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app ./app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📝 Roadmap

- [x] CRUD completo de usuários (admin, motoristas, funcionários)
- [x] Autenticação JWT com tokens
- [x] Telemetria GPS em tempo real
- [x] Exposição de coordenadas para dashboards
- [x] Regras de precificação dinâmica
- [ ] Matching motorista-passageiro por proximidade
- [ ] WebSockets para notificações em tempo real
- [ ] Relatórios e dashboards com mapas
- [ ] Integração com Google Maps/OpenStreetMap
- [ ] Sistema de avaliações (ratings)
- [ ] Chat em tempo real
- [ ] Suporte a múltiplas moedas

## 🤝 Fluxo de Desenvolvimento

1. **Branch**: Crie uma branch descritiva

   ```bash
   git checkout -b feature/nova-autenticacao
   ```

2. **Código**: Faça as alterações

   ```bash
   # Edite files, rodar testes
   python -m pytest -q
   ```

3. **Commit**: Mensagem clara e descritiva

   ```bash
   git commit -m "feat: adicionar suporte a múltiplos provedores OAuth"
   ```

4. **Push**: Para seu fork

   ```bash
   git push origin feature/nova-autenticacao
   ```

5. **Pull Request**: Abra PR na branch principal

## 🐛 Troubleshooting

### Erro: "database connection refused"

```bash
# Verifique se PostgreSQL está rodando
psql -U postgres  # Test connection

# Ou configure DATABASE_URL corretamente em .env
DATABASE_URL=postgresql://user:password@localhost:5432/podium_db
```

### Erro: "SECRET_KEY not found"

```bash
# Configure em .env ou variáveis de ambiente
export SECRET_KEY="sua-chave-aqui"
```

### Erro: "No such module 'app'"

```bash
# Esteja no diretório raiz
cd podium-backend-api
python -m uvicorn app.main:app --reload
```

## 📚 Documentação Adicional

- [FastAPI Official Docs](https://fastapi.tiangolo.com)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com)
- [Pydantic Validation](https://docs.pydantic.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [JWT.io](https://jwt.io) - Entenda tokens JWT

## 📞 Suporte

Para dúvidas, bugs ou sugestões:

- Abra uma issue em: [GitHub Issues](https://github.com/WellingtonADS/podium-backend-api/issues)
- Consulte a documentação: [docs/](./docs/)
- Acesse o Swagger: http://127.0.0.1:8000/docs

## 📄 Licença

Proprietário: WellingtonADS

---

**Versão:** 0.1.0 (Release)  
**Última atualização:** 2 de janeiro de 2026
