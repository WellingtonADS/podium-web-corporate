# Podium Monorepo - AI Coding Agent Instructions

> **🚨 REGRAS CRÍTICAS**: Windows PowerShell | Yarn (não npm) | Backend = SEMPRE venv

## 🎯 Big Picture

Este é um monorepo multi-stack para plataforma B2B de transporte corporativo com 5 aplicações independentes sincronizadas via **git subtree**:

- **podium-backend-api** (FastAPI/Python/PostgreSQL) - API REST em `/api/v1`
- **podium-web-admin** (React/Chakra UI/Vite) - Dashboard admin (porta 5174)
- **podium-web-corporate** (React/Chakra UI/Vite) - Portal empresas (porta 5175)
- **podium-web-site** (React/Chakra UI/Vite) - Site institucional (porta 5176)
- **podium-mobile-driver** (React Native/Expo) - App motoristas (porta 8081)
- **podium-docs-assets** - Documentação técnica e materiais de design

**Arquitetura chave**: Frontend comunica com backend via JWT Bearer auth + axios interceptors. Backend usa SQLModel (Pydantic v2 + SQLAlchemy) com multi-tenant B2B (companies/cost_centers/employees).

### Glossário de Domínio (B2B)

- **Company** (Empresa) - Cliente B2B que contrata o serviço
- **Cost Center** (Centro de Custo) - Divisões dentro da empresa (ex: "Diretoria", "Projeto X")
- **Employee** - Funcionário da empresa que solicita corridas
- **Driver** - Motorista que realiza as corridas
- **Admin** - Administrador da plataforma Podium
- **Lead** - Potencial cliente captado pelo site institucional
- **Pricing Rule** - Regras de precificação dinâmica (horário, distância, etc)

### Estrutura Completa do Monorepo

```
podium-monorepo/
├── .github/               # CI/CD workflows
├── podium-backend-api/    # FastAPI (Python 3.11+)
├── podium-web-admin/      # React + Chakra UI + Vite
├── podium-web-corporate/  # React + Chakra UI + Vite + React Query
├── podium-web-site/       # React + Chakra UI + Vite
├── podium-mobile-driver/  # React Native + Expo
├── podium-docs-assets/    # Documentação técnica
├── scripts/               # Scripts de automação
├── shared/                # Código compartilhado entre projetos
├── tests/                 # Testes E2E
└── wiki-pages/            # Documentação wiki
```

## ⚙️ Regras de Automação para AI Agents

### 🔴 CRITICAL: Environment & Package Management

**1. Sistema Operacional**: Windows (PowerShell)

- **✅ SEMPRE** usar comandos PowerShell, NUNCA bash/sh
- **✅ SEMPRE** criar scripts em `.ps1` (PowerShell), NÃO `.sh`

**2. Gerenciador de Pacotes**: Yarn (NÃO npm)

- **✅ FAZER**: `yarn install`, `yarn add`, `yarn dev`
- **❌ NÃO**: `npm install`, `npm i`, `npm run`

**3. Backend Python**: SEMPRE ativar venv ANTES

```powershell
# ✅ CORRETO - Ativar venv primeiro
cd podium-backend-api
.\venv\Scripts\Activate.ps1
pip install fastapi
python -m uvicorn app.main:app --reload

# ❌ ERRADO - Executar sem venv
cd podium-backend-api
pip install fastapi  # Vai instalar globalmente!
```

### 📝 Criando Scripts de Automação

**Template PowerShell Script**:

```powershell
# scripts/exemplo.ps1
# Descrição: [O que o script faz]

Write-Host "🚀 Iniciando processo..." -ForegroundColor Green

# Exemplo: Instalar dependências em todos os frontends
$projects = @("podium-web-admin", "podium-web-corporate", "podium-web-site")

foreach ($project in $projects) {
    Write-Host "📦 Instalando dependências em $project..." -ForegroundColor Cyan
    Set-Location $project
    yarn install
    Set-Location ..
}

Write-Host "✅ Concluído!" -ForegroundColor Green
```

### 🔧 Workflow Completo de Modificações

**Frontend (React/TypeScript)**:

```powershell
# 1. Navegar para o projeto
cd podium-web-admin

# 2. Instalar dependências (se necessário)
yarn add axios

# 3. Fazer alterações no código
# ... editar arquivos ...

# 4. Testar
yarn dev

# 5. Buildar (verificar erros)
yarn build
```

**Backend (Python/FastAPI)**:

```powershell
# 1. Navegar e ativar venv
cd podium-backend-api
.\venv\Scripts\Activate.ps1

# 2. Instalar dependências (se necessário)
pip install sqlalchemy

# 3. Fazer alterações no código
# ... editar arquivos ...

# 4. Rodar testes
pytest -v

# 5. Iniciar servidor
python -m uvicorn app.main:app --reload

# 6. Desativar venv quando terminar
deactivate
```

**Mobile (React Native/Expo)**:

```powershell
# 1. Navegar para o projeto
cd podium-mobile-driver

# 2. Instalar dependências (se necessário)
yarn add expo-location

# 3. Limpar cache e iniciar
yarn start --clear
```

### 🤖 Checklist para AI Agents

Antes de executar QUALQUER comando:

- [ ] Estou usando PowerShell? (não bash/sh)
- [ ] Estou usando `yarn`? (não npm)
- [ ] Se for backend Python, ativei o venv? (`.\venv\Scripts\Activate.ps1`)
- [ ] Estou no diretório correto?
- [ ] Testei o comando antes de executar?

## 🏗️ Arquitetura Limpa & Melhores Práticas

### Princípios Fundamentais

**SEMPRE** seguir ao criar código, arquivos ou estruturas:

1. **SOLID Principles**
   - Single Responsibility: Uma classe/função = uma responsabilidade
   - Open/Closed: Aberto para extensão, fechado para modificação
   - Liskov Substitution: Subtipos devem ser substituíveis
   - Interface Segregation: Interfaces específicas > genéricas
   - Dependency Inversion: Depender de abstrações, não implementações

2. **Clean Code**
   - Nomes descritivos e auto-explicativos
   - Funções pequenas e focadas (< 20 linhas ideal)
   - Evitar comentários desnecessários (código deve ser auto-documentado)
   - DRY (Don't Repeat Yourself)
   - KISS (Keep It Simple, Stupid)

3. **Separation of Concerns**
   - Camadas bem definidas (presentation → business logic → data access)
   - Não misturar responsabilidades
   - Dependências unidirecionais

### Estrutura de Diretórios e Arquivos

**Backend (FastAPI)**:
```
podium-backend-api/
├── app/
│   ├── api/v1/           # Endpoints (controllers)
│   │   ├── auth.py       # Um arquivo por domínio
│   │   └── users.py
│   ├── core/             # Configuração e utilitários
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   ├── models/           # Modelos de domínio (entidades)
│   │   └── domain.py
│   ├── schemas/          # DTOs (Pydantic)
│   │   └── user.py
│   ├── services/         # Lógica de negócio
│   │   └── user_service.py
│   └── repositories/     # Acesso a dados (se necessário)
```

**✅ FAZER**:
```python
# ✅ Service Layer separado
# app/services/user_service.py
class UserService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_user(self, user_data: UserCreate) -> User:
        """Lógica de negócio isolada"""
        # Validações
        # Transformações
        # Persistência
        return user

# ✅ Endpoint limpo
# app/api/v1/users.py
@router.post("/users")
def create_user(user: UserCreate, service: UserService = Depends()):
    return service.create_user(user)
```

**❌ NÃO FAZER**:
```python
# ❌ Lógica de negócio misturada no endpoint
@router.post("/users")
def create_user(user: UserCreate, db: Session = Depends()):
    # Validações aqui
    # Transformações aqui
    # Tudo junto = difícil testar e manter
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    return db_user
```

**Frontend (React/TypeScript)**:
```
src/
├── components/           # Componentes reutilizáveis
│   ├── UI/              # Componentes base (Button, Input)
│   ├── Cards/           # Cards específicos
│   └── Tables/          # Tabelas
├── pages/               # Páginas (rotas)
├── services/            # API clients (NÃO lógica de negócio)
├── hooks/               # Custom hooks
├── contexts/            # Context API
├── types/               # TypeScript types/interfaces
├── utils/               # Funções utilitárias puras
└── layouts/             # Layouts compartilhados
```

**✅ FAZER**:
```typescript
// ✅ Componente focado e reutilizável
// components/UI/Button.tsx
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
  children: ReactNode;
}

export default function Button({ variant, onClick, children }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
}

// ✅ Service layer
// services/user.ts
export const UserService = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>('/users');
    return data;
  }
};

// ✅ Hook customizado
// hooks/useUsers.ts
export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchUsers = async () => {
    setLoading(true);
    const data = await UserService.getUsers();
    setUsers(data);
    setLoading(false);
  };
  
  return { users, loading, fetchUsers };
}
```

**❌ NÃO FAZER**:
```typescript
// ❌ Componente com múltiplas responsabilidades
function UserPage() {
  // ❌ API call direto no componente
  // ❌ Lógica de negócio no componente
  // ❌ State management complexo
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    axios.get('/users').then(res => {
      // ❌ Transformações aqui
      const transformed = res.data.map(u => ({...u, fullName: u.first + ' ' + u.last}));
      setUsers(transformed);
    });
  }, []);
  
  return <div>...</div>;
}
```

### Convenções de Nomenclatura

**Backend (Python)**:
```python
# ✅ Nomes descritivos
def calculate_ride_price(distance_km: float, time_minutes: int) -> float:
    """Calcula preço baseado em distância e tempo"""
    pass

# ✅ Classes representam entidades
class CostCenter(SQLModel, table=True):
    pass

# ❌ Nomes genéricos
def calc(d, t):  # O que calcula? O que são d e t?
    pass
```

**Frontend (TypeScript)**:
```typescript
// ✅ Componentes: PascalCase
export default function EmployeeList() {}

// ✅ Hooks: use prefix + camelCase
export function useEmployeeData() {}

// ✅ Utilitários: camelCase
export function formatCurrency(value: number) {}

// ✅ Tipos: PascalCase
export interface UserProfile {}

// ✅ Constantes: UPPER_SNAKE_CASE
export const API_BASE_URL = 'http://localhost:8000';
```

### Testes e Qualidade

**✅ Escrever testes para**:
- Lógica de negócio (services)
- Transformações de dados
- Validações críticas
- Fluxos de autenticação

```python
# Backend: pytest
def test_create_user_with_valid_data():
    user = UserService.create_user(valid_data)
    assert user.email == valid_data.email
    assert user.hashed_password != valid_data.password  # Nunca salvar senha em texto

# Frontend: Jest
test('should format currency correctly', () => {
  expect(formatCurrency(1000)).toBe('R$ 1.000,00');
});
```

### Code Review Checklist

Antes de commitar, verificar:
- [ ] Código segue princípios SOLID?
- [ ] Funções têm responsabilidade única?
- [ ] Nomes são descritivos e auto-explicativos?
- [ ] Não há duplicação de código (DRY)?
- [ ] Camadas estão separadas (presentation/business/data)?
- [ ] Tipos estão bem definidos (TypeScript/Python type hints)?
- [ ] Erros são tratados adequadamente?
- [ ] Código está testável e testado?
- [ ] Sem magic numbers ou hardcoded values?
- [ ] Imports estão organizados?

## 🔧 Critical Developer Workflows

### Starting Development (3 servidores em paralelo)

```bash
# Raiz do monorepo - inicia tudo com concurrently
yarn dev

# Ou individualmente:
yarn dev:web       # web-admin (5174)
yarn dev:api       # backend FastAPI (8000) - usa PowerShell + venv
yarn dev:mobile    # Expo Metro (8081)
yarn dev:corporate # web-corporate (5175)
```

### Backend API Setup (CRÍTICO - venv PowerShell)

```powershell
cd podium-backend-api
python -m venv venv
.\venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt

# Criar admin inicial (seed)
python -m app.scripts.seed_admin

# Rodar servidor
python -m uvicorn app.main:app --reload
```

### Git Subtree Sync (NÃO usar git submodule)

```bash
# PULL: Monorepo <- Subrepos individuais
yarn sync:pull:backend-api    # release/v0.1.0
yarn sync:pull:web-admin       # release/v0.1.0
yarn sync:pull:mobile-driver   # release/v1.0.0

# PUSH: Monorepo -> Subrepos
yarn sync:push:backend-api
yarn sync:push:web-admin
yarn sync:push:mobile-driver
```

**⚠️ ATENÇÃO**: Cada subrepo tem branch default diferente (ver tabela no README). mobile-driver usa `release/v1.0.0`, backend/web-admin usam `release/v0.1.0`.

**Git Subtree Architecture**: Cada subprojeto (backend-api, web-admin, mobile-driver, web-corporate, web-site) é um repositório independente sincronizado via `git subtree`. Mudanças podem ser feitas no monorepo OU no subrepo individual. Scripts de sync mantêm ambos atualizados.

### Testing

```bash
# Backend (pytest)
cd podium-backend-api
pytest -v                          # Todos os testes
pytest app/tests/test_auth.py -v   # Arquivo específico

# Web Admin (Jest)
cd podium-web-admin
yarn test                          # Watch mode
yarn test:coverage                 # Com coverage

# Mobile (Jest + React Native Testing Library)
cd podium-mobile-driver
yarn test
yarn typecheck  # TypeScript check sem build
```

### CI/CD (GitHub Actions)

- **backend-api-ci.yml** - Ruff + Flake8 + pytest (Python 3.11)
- **mobile-driver-typecheck.yml** - TypeScript check (tsc --noEmit)
- **Nenhum workflow** para web-admin/corporate/site (adicionar se necessário)

### Environment Variables (.env)

```bash
# Backend API (.env na raiz de podium-backend-api)
PROJECT_NAME=Podium API
DATABASE_URL=postgresql://user:password@localhost/podium_db
SECRET_KEY=sua-chave-secreta-segura-aqui
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend (.env na raiz de cada projeto web)
VITE_API_URL=http://localhost:8000  # Aponta para o backend
```

**⚠️ NUNCA** commitar `.env` com credenciais reais - usar `.env.example` como template.

## 📐 Project-Specific Patterns

### Backend (FastAPI + SQLModel)

#### Autenticação JWT e Sistema de Roles

```python
# app/api/v1/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

def get_current_user(db: Session = Depends(get_session), token: str = Depends(oauth2_scheme)) -> User:
    # Valida JWT, retorna User do DB
    # NUNCA retornar senha hashada nas respostas

# Sistema de roles (admin, driver, employee)
def require_role(*allowed_roles: str) -> Callable[[User], User]:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=403, detail="Permissão negada")
        return current_user
    return dependency

# Uso em rotas:
@router.get("/cost-centers")
def list_cost_centers(
    current_user: User = Depends(require_role("admin", "employee")),
    # ...
):
```

**Login endpoint usa `application/x-www-form-urlencoded`** (OAuth2PasswordRequestForm):

```python
@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # form_data.username contém email
    # Retorna {"access_token": "...", "token_type": "bearer"}
```

#### API Endpoints Principais (v1)

**Auth** (Público):

- `POST /api/v1/login` - Autenticação (OAuth2 form-urlencoded)
- `POST /api/v1/register` - Registro de novos usuários

**Users** (Requer Auth):

- `GET /api/v1/users/me` - Dados do usuário autenticado
- `GET /api/v1/users` - Listar usuários (admin only)
- `GET /api/v1/users/{id}` - Usuário específico
- `PUT /api/v1/users/{id}` - Atualizar usuário

**Corporate B2B** (admin + employee):

- `GET /api/v1/corporate/cost-centers` - Centros de custo da empresa
- `POST /api/v1/corporate/cost-centers` - Criar centro de custo
- `GET /api/v1/corporate/employees` - Funcionários da empresa
- `POST /api/v1/corporate/employees` - Criar funcionário

**Stats** (admin + employee):

- `GET /api/v1/stats/dashboard` - Estatísticas gerais (admin)
- `GET /api/v1/stats/corporate-dashboard` - Dashboard corporativo (empresa)

**Leads** (Público - Site):

- `POST /api/v1/leads` - Criar lead (captação sem auth)

**Pricing** (admin only):

- `GET /api/v1/pricing/rules` - Listar regras de preço
- `POST /api/v1/pricing/rules` - Criar regra

**Versionamento**: Todas as rotas usam `/api/v1` prefix. Para adicionar novos endpoints, criar em `app/api/v1/` e registrar em `app/api/api.py`.

#### Estrutura de Models vs Schemas

**Models** (app/models/domain.py) - Entidades do banco:

```python
class Company(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    cnpj: str = Field(unique=True, index=True)
    cost_centers: List["CostCenter"] = Relationship(back_populates="company")
    employees: List["EmployeeProfile"] = Relationship(back_populates="company")

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str  # NUNCA expor em schemas
    role: str  # "admin" | "driver" | "employee"
    driver_profile: DriverProfile | None = Relationship(back_populates="user")
    employee_profile: EmployeeProfile | None = Relationship(back_populates="user")

class DriverProfile(SQLModel, table=True):
    user_id: int = Field(foreign_key="users.id")
    vehicle_model: str
    current_lat: float | None  # Telemetria GPS
    current_lng: float | None
```

**Schemas** (app/schemas/) - DTOs para API:

```python
class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    driver_profile: DriverProfileRead | None  # Nested quando role=driver
    employee_profile: EmployeeProfileRead | None  # Nested quando role=employee
    # SEM hashed_password!
```

**⚠️ IMPORTANTE**: Models têm `hashed_password`, Schemas NUNCA expõem senhas.

#### CORS Configuration (app/main.py)

```python
origins = [
    "http://localhost:5174",  # web-admin
    "http://localhost:5175",  # web-corporate
    "http://192.168.15.18:8081",  # Expo Metro mobile
    # Adicionar IPs locais + production domains
]
```

**⚠️ SEMPRE** adicionar nova porta/IP ao adicionar frontend.

#### Database Schema e Migrations

```python
# app/core/database.py
def create_db_and_tables():
    """Cria tabelas automaticamente via SQLModel.metadata.create_all()"""
    SQLModel.metadata.create_all(engine)
```

**⚠️ NÃO usa Alembic** - Schema é criado automaticamente na inicialização. Para alterações em produção, considerar migração manual ou implementar Alembic.

**Seed Scripts**:

- `python -m app.scripts.seed_admin` - Cria usuário admin inicial
- `python -m app.scripts.seed_data` - Popula dados de teste

#### Error Handling Patterns

```python
# Backend: Sempre usar HTTPException com status_code apropriado
from fastapi import HTTPException, status

if not user:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Usuário não encontrado"
    )

if not current_user.is_active:
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Usuário inativo"
    )
```

Status codes padrão:

- **401** - Não autenticado (token inválido/expirado)
- **403** - Sem permissão (role inadequado)
- **404** - Recurso não encontrado
- **400** - Bad request (validação falhou)
- **409** - Conflito (email duplicado, etc)

### Frontend (React/TypeScript/Vite)

#### API Service Layer (PADRÃO OBRIGATÓRIO)

```typescript
// services/api.ts - Cliente base
const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const api = axios.create({ baseURL: `${API_BASE}/api/v1` });

// Interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@Podium:token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

```typescript
// services/corporate.ts - Camada de serviço (NÃO chamar api diretamente em componentes)
export const CorporateService = {
  getCostCenters: async (): Promise<CostCenter[]> => {
    const { data } = await api.get<CostCenter[]>("/corporate/cost-centers");
    return data;
  },
  // ... outros métodos
};
```

**✅ FAZER**: Criar service layer (`CorporateService`, `DriversService`, etc)  
**❌ NÃO**: Chamar `api.get()` direto em componentes  
**❌ NÃO**: Usar mock data em handlers (sempre buscar API real)

#### AuthContext Pattern

```typescript
// contexts/AuthContext.tsx
const signIn = async ({ email, password }) => {
  try {
    // 1. POST /login com form-urlencoded
    const formData = new URLSearchParams();
    formData.append("username", email); // Backend espera 'username'
    formData.append("password", password);

    const { data } = await api.post("/login", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // 2. Setar token ANTES de outras chamadas
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${data.access_token}`;
    localStorage.setItem("@Podium:token", data.access_token);

    // 3. Buscar usuário real (NÃO criar objeto fake)
    const { data: userData } = await api.get<User>("/users/me");
    setUser(userData);
    localStorage.setItem("@Podium:user", JSON.stringify(userData));
  } catch (error) {
    // Limpar estado em caso de erro
    localStorage.removeItem("@Podium:token");
    localStorage.removeItem("@Podium:user");
    delete api.defaults.headers.common["Authorization"];
    throw error; // Propagar para componente tratar
  }
};

const signOut = () => {
  localStorage.removeItem("@Podium:token");
  localStorage.removeItem("@Podium:user");
  delete api.defaults.headers.common["Authorization"];
  setUser(null);
};
```

**❌ NUNCA** criar objeto `User` fake após login - sempre buscar `/users/me`.  
**✅ SEMPRE** limpar estado completo no logout e erros de auth.

#### Type-Safe API Calls

```typescript
// types/index.ts - SSOT (Single Source of Truth)
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: "admin" | "driver" | "employee";
  company_id?: number;
}

// Uso em componente
const [users, setUsers] = useState<User[]>([]);
const data = await CorporateService.getEmployees(); // Retorna Promise<User[]>
setUsers(data);
```

#### React Query (web-corporate only)

```typescript
// hooks/useCostCenters.ts - Exemplo com @tanstack/react-query
import { useQuery } from "@tanstack/react-query";
import { CorporateService } from "../services/corporate";

export const useCostCenters = () => {
  return useQuery({
    queryKey: ["cost-centers"],
    queryFn: CorporateService.getCostCenters,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Uso no componente
const { data: costCenters, isLoading, error } = useCostCenters();
```

**✅ FAZER**: Usar React Query em web-corporate para cache automático  
**❌ NÃO**: Usar React Query em web-admin ou web-site (não instalado)

### Mobile (React Native + Expo)

#### Armazenamento Seguro (Expo Secure Store)

```typescript
import * as SecureStore from "expo-secure-store";

// Salvar token de forma segura (criptografado)
await SecureStore.setItemAsync("@Podium:token", accessToken);

// Recuperar token
const token = await SecureStore.getItemAsync("@Podium:token");

// Deletar token (logout)
await SecureStore.deleteItemAsync("@Podium:token");
```

**⚠️ IMPORTANTE**: Usar SecureStore para tokens/credenciais, NÃO AsyncStorage (não é criptografado).

#### Localização GPS (Expo Location)

```typescript
import * as Location from "expo-location";

// SEMPRE pedir permissão antes
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== "granted") {
  // Erro - não pode usar GPS
}

// Tracking contínuo (watchPositionAsync)
const subscription = await Location.watchPositionAsync(
  { accuracy: Location.Accuracy.High, distanceInterval: 10 },
  (location) => {
    // Enviar para API a cada 10 metros
  }
);
```

#### Navigation (React Navigation 6)

```typescript
// Stack + Tab hybrid
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab navigator dentro de Stack
<Stack.Screen name="Main">
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
  </Tab.Navigator>
</Stack.Screen>;
```

## 🔗 Integration Points

### Backend → Frontend Data Flow

```
1. Frontend: POST /api/v1/login (form-urlencoded)
2. Backend: Valida bcrypt, retorna JWT
3. Frontend: Armazena token → localStorage + axios header
4. Frontend: GET /api/v1/users/me (com Bearer token)
5. Backend: Valida JWT → retorna User (sem password)
6. Frontend: Atualiza AuthContext.user
```

### Multi-Tenant B2B (Corporate)

```python
# Backend: Filtragem automática por company_id do token JWT
@router.get("/corporate/cost-centers")
async def get_cost_centers(current_user: User = Depends(get_current_user)):
    # SQLModel query filtra por current_user.company_id automaticamente
    return session.exec(select(CostCenter).where(CostCenter.company_id == current_user.company_id))
```

**⚠️ NUNCA** confiar em `company_id` do request body - sempre extrair do JWT.

### Mobile ↔ Backend GPS Sync

```typescript
// Mobile: Envia coordenadas a cada 10m ou 1min
await api.put(`/drivers/${driverId}/location`, {
  lat: location.coords.latitude,
  lng: location.coords.longitude,
});

// Backend: Atualiza DriverProfile.current_lat/lng
driver_profile.current_lat = location.lat;
driver_profile.current_lng = location.lng;
session.add(driver_profile);
session.commit();
```

## 📚 Documentation Structure

- **podium-docs-assets/technical/** - Documentação técnica detalhada (integracao-completa.md, resumo-integracao.md, checklist-validacao.md)
- **README.md de cada subprojeto** - Setup, scripts, estrutura
- **Backend API /docs** - FastAPI Swagger (http://localhost:8000/docs)

## 🎨 Code Style & Formatting

### Backend (Python)

- **Linter**: Ruff + Flake8 (CI enforced)
- **Type hints**: Usar Python 3.11+ union types (`int | None` ao invés de `Optional[int]`)
- **Imports**: Order: stdlib → third-party → local (isort padrão)
- **Naming**: snake_case para funções/variáveis, PascalCase para classes

```python
# ✅ FAZER
def get_user_by_id(user_id: int) -> User | None:
    return session.get(User, user_id)

# ❌ NÃO
def GetUserById(userId: int) -> Optional[User]:
    return session.get(User, userId)
```

### Frontend (TypeScript)

- **Linter**: ESLint + typescript-eslint
- **Formatter**: Prettier (script: `format:check`)
- **Naming**: camelCase para variáveis/funções, PascalCase para componentes/tipos
- **Hooks**: Prefixo `use` obrigatório
- **Components**: Um componente por arquivo, export default

```typescript
// ✅ FAZER
export default function EmployeeList() {
  const { data, isLoading } = useEmployees();
}

// ❌ NÃO
export function employee_list() {
  const { Data, IsLoading } = GetEmployees();
}
```

## 🛠️ Tools & Dependencies

- **Backend**: fastapi, sqlmodel, pydantic>=2, bcrypt, python-jose[cryptography], uvicorn, pytest, httpx
- **Web (todos)**: react, typescript, axios, react-router-dom, vite
- **Web Admin/Corporate/Site**: @chakra-ui/react, @emotion/react, framer-motion
- **Web Corporate**: @tanstack/react-query (para cache e sync de API)
- **Mobile**: expo, react-native, react-navigation, expo-location, react-native-maps, expo-secure-store

## 🐛 Debugging & Troubleshooting

### Backend (FastAPI)

```bash
# Ver logs do servidor (uvicorn)
python -m uvicorn app.main:app --reload --log-level debug

# Testar endpoint direto
curl -X POST http://localhost:8000/api/v1/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@example.com&password=admin123"

# Verificar DB (psql)
psql -d podium_db -c "SELECT id, email, role FROM users;"

# Rodar seed se DB vazio
python -m app.scripts.seed_admin
```

### Frontend (React)

```powershell
# Verificar build errors
yarn build  # Deve completar sem erros

# Limpar cache se comportamento estranho (PowerShell)
Remove-Item -Recurse -Force node_modules\.vite
yarn dev

# Verificar token no localStorage (DevTools Console)
localStorage.getItem('@Podium:token')
localStorage.getItem('@Podium:user')

# Ver requisições no Network tab
# Filtrar por: Fetch/XHR → verificar status 200/401/403
```

### Mobile (Expo)

```powershell
# Limpar cache Expo
yarn start --clear

# Verificar IP do Metro Bundler
# Deve aparecer algo como: http://192.168.15.18:8081
# CORS do backend DEVE incluir esse IP

# Logs do dispositivo
npx react-native log-android  # Android
npx react-native log-ios       # iOS
```

### Problemas Comuns

**401 Unauthorized**:

- Token expirado → Fazer logout e login novamente
- Token não enviado → Verificar interceptor axios
- Backend não rodando → Iniciar `yarn dev:api`

**CORS Error**:

- Adicionar origin em `app/main.py` origins list
- Reiniciar backend após mudança

**Database Error**:

- DB não criado → Rodar `create_db_and_tables()` na inicialização
- Credenciais erradas → Verificar DATABASE_URL no .env

## ⚠️ Common Pitfalls

1. **PowerShell no Windows**: Usar comandos PowerShell, NÃO bash (ex: `Remove-Item` ao invés de `rm -rf`)
2. **Yarn obrigatório**: SEMPRE usar `yarn`, NUNCA `npm` (ex: `yarn add` ao invés de `npm install`)
3. **Backend venv**: SEMPRE ativar venv ANTES (`.\venv\Scripts\Activate.ps1`) de qualquer comando Python
4. **Scripts**: Criar em `.ps1` (PowerShell), NÃO `.sh` (bash)
5. **Git subtree**: Cada subrepo tem branch default diferente (verificar tabela no README antes de push/pull)
6. **Mock data**: Remover TODOS os dados falsificados - sempre buscar API real
7. **CORS**: Adicionar novo origin em `app/main.py` ao criar novo frontend
8. **Login form**: Backend espera `username` (não `email`) no OAuth2PasswordRequestForm
9. **Tipos desalinhados**: Manter `types/index.ts` sincronizado com schemas Pydantic do backend
10. **JWT no interceptor**: Setar token ANTES de qualquer chamada que exija autenticação
11. **Multi-tenant**: Sempre filtrar por `company_id` extraído do JWT, nunca do body
12. **localStorage keys**: Padrão é `@Podium:token` e `@Podium:user` (com prefixo `@Podium:`)
13. **Database schema**: Não há migrations - schema é criado automaticamente. Cuidado com alterações em produção
14. **UI Library**: Todos os frontends (admin/corporate/site) usam Chakra UI, não MUI
15. **Leads endpoint**: `/api/v1/leads` é público (sem autenticação) para captação do site

## 🚀 Performance & Best Practices

### Backend Performance

```python
# ✅ FAZER: Usar paginação em listagens
@router.get("/users")
def list_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_session)):
    return db.exec(select(User).offset(skip).limit(limit)).all()

# ✅ FAZER: Eager loading para evitar N+1 queries
from sqlmodel import selectinload
users = session.exec(
    select(User).options(selectinload(User.driver_profile))
).all()

# ❌ NÃO: Buscar tudo sem limite
def list_users(db: Session = Depends(get_session)):
    return db.exec(select(User)).all()  # Pode retornar milhares!
```

### Frontend Performance

```typescript
// ✅ FAZER: Usar React Query para cache
const { data } = useQuery({
  queryKey: ["cost-centers"],
  queryFn: CorporateService.getCostCenters,
  staleTime: 5 * 60 * 1000, // Cache por 5min
});

// ✅ FAZER: Lazy loading de componentes
const Dashboard = lazy(() => import("./pages/Dashboard"));

// ❌ NÃO: Fetch em loop ou useEffect sem dependências
useEffect(() => {
  fetchUsers(); // Sem array de dependências = loop infinito!
});
```

### Mobile Performance

```typescript
// ✅ FAZER: Throttle de updates GPS
let lastUpdate = 0;
const MIN_INTERVAL = 10000; // 10 segundos

Location.watchPositionAsync({}, (location) => {
  const now = Date.now();
  if (now - lastUpdate > MIN_INTERVAL) {
    updateBackend(location);
    lastUpdate = now;
  }
});

// ❌ NÃO: Enviar toda atualização GPS
Location.watchPositionAsync({}, (location) => {
  updateBackend(location); // Vai bombardear o backend!
});
```
