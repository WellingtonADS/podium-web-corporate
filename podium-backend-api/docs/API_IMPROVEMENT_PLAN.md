# 📋 Plano de Sugestões de Melhoria - API Backend

**Data:** 16 de dezembro de 2025  
**Versão:** v0.1.0  
**Status:** Análise Completada  
**Próxima Revisão:** Após Sprint 1

---

## 📊 Resumo Executivo

A API backend serve atualmente **3 clientes principais**:
- 📱 **Mobile-Driver** (App do motorista) - 70% funcional
- 🖥️ **Web-Admin** (Painel administrativo) - 75% funcional
- 🏢 **Portal Corporativo** (Funcionários) - 0% implementado

Foram identificados **10 principais gaps** que precisam ser preenchidos para viabilizar a plataforma de forma completa.

---

## 👥 Análise por Cliente

### **1️⃣ Mobile-Driver (App do Motorista)**

#### ✅ Funcionalidades Implementadas
- Login com email/senha (JWT Bearer Token)
- Envio de telemetria GPS em tempo real
- Armazenamento seguro de token (expo-secure-store)
- Integração com mapa de localização

#### ❌ Funcionalidades Faltando
- Atualização de status da corrida (aceita → em andamento → finalizada)
- Visualização de histórico de corridas com dados da API
- Sincronização de ganhos da API (atualmente mock)
- Notificações em tempo real de novas solicitações
- Avaliação de passageiros pós-corrida

#### 📊 Endpoints Utilizados

| Endpoint | Método | Status | Observação |
|----------|--------|--------|-----------|
| `/api/v1/login` | POST | ✅ Implementado | Retorna apenas token |
| `/api/v1/users/me/location` | PATCH | ✅ Implementado | Telemetria GPS |
| `/api/v1/users/me` | GET | ❌ Faltando | Dados do perfil após login |
| `/api/v1/rides` | GET | ❌ Faltando | Histórico de corridas |
| `/api/v1/rides/{id}/status` | PATCH | ❌ Faltando | Atualizar status corrida |
| `/api/v1/drivers/me/earnings` | GET | ❌ Faltando | Ganhos do motorista |

#### 🔐 Segurança
- ✅ Token armazenado em expo-secure-store (seguro)
- ✅ Interceptor injeta Bearer token automaticamente
- ✅ Validação JWT no backend

---

### **2️⃣ Web-Admin (Painel Administrativo)**

#### ✅ Funcionalidades Implementadas
- Login com email/senha (JWT Bearer Token)
- Dashboard com KPIs em tempo real:
  - Total de motoristas online
  - Total de corridas do dia
  - Faturamento do dia
  - Ticket médio
- Listagem de motoristas com paginação
- Criação de novo motorista
- Visualização de localização em tempo real (mapa)

#### ❌ Funcionalidades Faltando
- Busca e filtros avançados (por nome, email, status)
- Edição de dados do motorista
- Deleção de motorista (soft delete)
- Suspensão de motorista
- Relatórios avançados (período customizado, exportação)
- Gestão de funcionários corporativos
- Histórico de auditoria

#### 📊 Endpoints Utilizados

| Endpoint | Método | Status | Observação |
|----------|--------|--------|-----------|
| `/api/v1/login` | POST | ✅ Implementado | Token em localStorage (risco) |
| `/api/v1/stats/dashboard` | GET | ✅ Implementado | KPIs agregados |
| `/api/v1/users` | GET | ✅ Implementado | Lista com paginação básica |
| `/api/v1/users/me` | GET | ❌ Faltando | Dados do admin autenticado |
| `/api/v1/users/{id}` | GET | ❌ Faltando | Detalhes de um usuário |
| `/api/v1/users/{id}` | PUT | ❌ Faltando | Editar usuário |
| `/api/v1/users/{id}` | DELETE | ❌ Faltando | Deletar usuário |
| `/api/v1/signup/employee` | POST | ⚠️ Parcial | Falta integração web |
| `/api/v1/signup/driver` | POST | ✅ Implementado | Criar motorista |

#### ⚠️ Segurança
- 🔴 Token armazenado em `localStorage` (vulnerável a XSS)
- 🔴 Sem HttpOnly cookies
- 🟡 Sem proteção CSRF adequada

---

### **3️⃣ Portal Corporativo (Funcionários/Passageiros)**

#### 🚨 Status: NÃO IMPLEMENTADO

**O quê foi estruturado:**
- Modelo de dados `EmployeeProfile` criado
- Vinculação a `Company` e `CostCenter`
- Schema de entrada `EmployeeCreate`

**O quê está faltando:**
- Frontend completamente
- Endpoints de API
- Sistema de solicitação de corridas
- Histórico de corridas
- Rastreamento de gastos por centro de custo

#### 📊 Endpoints Necessários

| Endpoint | Método | Propósito |
|----------|--------|----------|
| `/api/v1/login` | POST | Login do funcionário |
| `/api/v1/signup/employee` | POST | Cadastro (via admin) |
| `/api/v1/rides/request` | POST | Solicitar nova corrida |
| `/api/v1/rides` | GET | Histórico de corridas |
| `/api/v1/rides/{id}` | GET | Detalhes da corrida |
| `/api/v1/employees/me` | GET | Dados do perfil |
| `/api/v1/employees/me/spending` | GET | Gastos por período |

---

## 🎯 Sugestões de Melhoria

### 🔴 **CRÍTICAS** (Implementar Imediatamente - Sprint 1)

#### **1. GET /api/v1/users/me - Perfil do Usuário Autenticado**

**Problema:** 
- Após login, cliente recebe apenas token
- Precisa fazer requisição extra para obter dados do usuário
- Aumenta latência e número de requisições

**Solução:**
```python
@router.get("/me", response_model=UserRead)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """Retorna perfil completo do usuário autenticado"""
    return current_user
```

**Impacto:**
- ✅ Reduz requisições ao login
- ✅ Melhora UX
- ✅ Consistência com padrão REST

**Tempo:** ~15 minutos

---

#### **2. CRUD de Corridas - Modelo e Endpoints**

**Problema:**
- Sistema de corridas é o core do negócio
- Sem endpoints, não há como criar/atualizar corridas

**Solução - Modelo (app/models/domain.py):**
```python
from enum import Enum

class RideStatus(str, Enum):
    pending = "pending"          # Aguardando motorista aceitar
    accepted = "accepted"        # Motorista aceitou
    in_progress = "in_progress"  # Corrida iniciada
    completed = "completed"      # Corrida finalizada
    cancelled = "cancelled"      # Corrida cancelada

class Ride(SQLModel, table=True):
    __tablename__ = "rides"
    
    id: Optional[int] = None
    employee_id: int = Field(foreign_key="users.id")  # Passageiro
    driver_id: Optional[int] = Field(foreign_key="users.id")  # Motorista (None até aceitar)
    
    # Localização
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    
    # Status e datas
    status: RideStatus = RideStatus.pending
    requested_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    accepted_at: Optional[datetime] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    # Valores
    estimated_price: Optional[float] = None
    final_price: Optional[float] = None
    
    # Relacionamentos
    employee: User = Relationship(back_populates="requested_rides")
    driver: Optional[User] = Relationship(back_populates="assigned_rides")
```

**Solução - Endpoints (app/api/v1/rides.py - CRIAR):**
```python
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.core.database import get_session
from app.api.v1.deps import require_role, get_current_user
from app.models.domain import Ride, RideStatus, User
from datetime import datetime, timezone

router = APIRouter()

# --- CREATE: Funcionário solicita corrida ---
@router.post("/")
def create_ride(
    ride_in: RideCreate,  # origin_lat, origin_lng, destination_lat, destination_lng
    current_user: User = Depends(require_role("employee")),
    db: Session = Depends(get_session)
):
    """Funcionário solicita nova corrida"""
    ride = Ride(
        employee_id=current_user.id,
        origin_lat=ride_in.origin_lat,
        origin_lng=ride_in.origin_lng,
        destination_lat=ride_in.destination_lat,
        destination_lng=ride_in.destination_lng,
        status=RideStatus.pending
    )
    db.add(ride)
    db.commit()
    db.refresh(ride)
    return ride

# --- READ: Listar corridas (com filtros) ---
@router.get("/")
def list_rides(
    status: Optional[RideStatus] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Lista corridas do usuário (filtradas por role)"""
    query = select(Ride)
    
    # Motorista vê apenas suas corridas
    if current_user.role == "driver":
        query = query.where(Ride.driver_id == current_user.id)
    
    # Funcionário vê apenas suas solicitações
    elif current_user.role == "employee":
        query = query.where(Ride.employee_id == current_user.id)
    
    # Admin vê todas
    
    if status:
        query = query.where(Ride.status == status)
    
    query = query.offset(skip).limit(limit)
    rides = db.exec(query).all()
    return rides

# --- READ: Detalhes da corrida ---
@router.get("/{ride_id}")
def get_ride_details(
    ride_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Retorna detalhes de uma corrida (com validação de acesso)"""
    ride = db.get(Ride, ride_id)
    if not ride:
        raise HTTPException(404, "Corrida não encontrada")
    
    # Validar acesso: apenas envolvidos ou admin
    if current_user.role != "admin":
        if ride.employee_id != current_user.id and ride.driver_id != current_user.id:
            raise HTTPException(403, "Acesso negado")
    
    return ride

# --- UPDATE: Motorista aceita/rejeita corrida ---
@router.patch("/{ride_id}/status")
def update_ride_status(
    ride_id: int,
    status_update: RideStatusUpdate,  # new_status: RideStatus
    current_user: User = Depends(require_role("driver")),
    db: Session = Depends(get_session)
):
    """Motorista atualiza status da corrida"""
    ride = db.get(Ride, ride_id)
    if not ride:
        raise HTTPException(404, "Corrida não encontrada")
    
    # Validar transição de estado
    valid_transitions = {
        RideStatus.pending: [RideStatus.accepted, RideStatus.cancelled],
        RideStatus.accepted: [RideStatus.in_progress, RideStatus.cancelled],
        RideStatus.in_progress: [RideStatus.completed],
        RideStatus.completed: [],
        RideStatus.cancelled: []
    }
    
    if status_update.new_status not in valid_transitions.get(ride.status, []):
        raise HTTPException(
            400, 
            f"Transição inválida: {ride.status} → {status_update.new_status}"
        )
    
    # Atualizar status
    ride.status = status_update.new_status
    
    # Registrar timestamps
    if status_update.new_status == RideStatus.accepted:
        ride.driver_id = current_user.id
        ride.accepted_at = datetime.now(timezone.utc)
    elif status_update.new_status == RideStatus.in_progress:
        ride.started_at = datetime.now(timezone.utc)
    elif status_update.new_status == RideStatus.completed:
        ride.completed_at = datetime.now(timezone.utc)
    
    db.add(ride)
    db.commit()
    db.refresh(ride)
    return ride

# --- DELETE: Cancelar corrida (soft delete) ---
@router.delete("/{ride_id}")
def cancel_ride(
    ride_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_session)
):
    """Cancela uma corrida (apenas se não iniciada)"""
    ride = db.get(Ride, ride_id)
    if not ride:
        raise HTTPException(404, "Corrida não encontrada")
    
    # Validar se pode cancelar
    if ride.status in [RideStatus.completed, RideStatus.cancelled]:
        raise HTTPException(400, "Corrida não pode ser cancelada")
    
    # Validar acesso
    if current_user.role == "employee" and ride.employee_id != current_user.id:
        raise HTTPException(403, "Apenas o passageiro pode cancelar")
    if current_user.role == "driver" and ride.driver_id != current_user.id:
        raise HTTPException(403, "Apenas o motorista pode recusar")
    
    ride.status = RideStatus.cancelled
    db.add(ride)
    db.commit()
    return {"status": "cancelled"}
```

**Schemas (app/schemas/ride.py - CRIAR):**
```python
from pydantic import BaseModel
from typing import Optional
from app.models.domain import RideStatus

class RideCreate(BaseModel):
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float

class RideStatusUpdate(BaseModel):
    new_status: RideStatus

class RideRead(BaseModel):
    id: int
    employee_id: int
    driver_id: Optional[int]
    origin_lat: float
    origin_lng: float
    destination_lat: float
    destination_lng: float
    status: RideStatus
    estimated_price: Optional[float]
    final_price: Optional[float]
    requested_at: str
    accepted_at: Optional[str]
    started_at: Optional[str]
    completed_at: Optional[str]
    
    class Config:
        from_attributes = True
```

**Integração (app/api/api.py):**
```python
from app.api.v1 import rides

router.include_router(rides.router, prefix="/api/v1/rides", tags=["rides"])
```

**Impacto:**
- ✅ Core do negócio funcional
- ✅ Permite fluxo completo de corridas
- ✅ Rastreamento de histórico

**Tempo:** ~4 horas

---

#### **3. PUT/DELETE - Edição e Deleção de Usuários**

**Problema:**
- Admin não pode editar dados do motorista (ex: placa do carro)
- Sem soft delete, dados ficam inconsistentes

**Solução (app/schemas/user.py):**
```python
class UserUpdate(BaseModel):
    """Schema para atualizar usuário (apenas admin)"""
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    # vehicle_model, vehicle_plate, cnh_number editáveis via DriverProfileUpdate

class DriverProfileUpdate(BaseModel):
    vehicle_model: Optional[str] = None
    vehicle_plate: Optional[str] = None
    cnh_number: Optional[str] = None
```

**Solução (app/api/v1/users.py):**
```python
from sqlmodel import func

@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user_update: UserUpdate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_session)
):
    """Admin edita dados do usuário"""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "Usuário não encontrado")
    
    # Validar email único se for alterado
    if user_update.full_name:
        user.full_name = user_update.full_name
    if user_update.is_active is not None:
        user.is_active = user_update.is_active
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.put("/drivers/{driver_id}/profile", response_model=UserRead)
def update_driver_profile(
    driver_id: int,
    profile_update: DriverProfileUpdate,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_session)
):
    """Admin edita dados veiculares do motorista"""
    user = db.get(User, driver_id)
    if not user or user.role != "driver":
        raise HTTPException(404, "Motorista não encontrado")
    
    if user.driver_profile:
        for field, value in profile_update.dict(exclude_unset=True).items():
            setattr(user.driver_profile, field, value)
        db.add(user.driver_profile)
        db.commit()
        db.refresh(user)
    
    return user

@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_session)
):
    """Admin deleta usuário (soft delete)"""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(404, "Usuário não encontrado")
    
    user.is_active = False
    db.add(user)
    db.commit()
    return {"status": "deleted", "user_id": user_id}
```

**Impacto:**
- ✅ Admin pode gerenciar dados
- ✅ Soft delete preserva dados para auditoria
- ✅ Consistência de dados

**Tempo:** ~1 hora

---

#### **4. HttpOnly Cookies para Web-Admin (Segurança Crítica)**

**Problema:**
- Web-Admin armazena token em `localStorage`
- Vulnerável a ataques XSS
- Qualquer JS malicioso pode acessar token

**Solução (app/api/v1/auth.py):**
```python
from fastapi.responses import JSONResponse

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_session)
):
    """Login com token em HttpOnly cookie"""
    # ... validação de credenciais ...
    
    token = create_access_token({"sub": str(user.id)})
    
    response = JSONResponse({"message": "Login successful"})
    response.set_cookie(
        key="podium_token",
        value=token,
        httponly=True,  # ✅ JS não consegue acessar
        secure=True,    # ✅ Apenas HTTPS
        samesite="Lax", # ✅ CSRF protection
        max_age=1800    # 30 minutos
    )
    return response

@router.post("/logout")
def logout():
    """Logout - remove cookie"""
    response = JSONResponse({"message": "Logout successful"})
    response.delete_cookie("podium_token")
    return response
```

**Mudanças em app/api/v1/deps.py:**
```python
from fastapi import Cookie, HTTPException
from typing import Optional

# Suporta tanto Bearer Token quanto Cookie
async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),  # Para mobile
    podium_token: Optional[str] = Cookie(None),    # Para web-admin
    db: Session = Depends(get_session)
) -> User:
    """Valida token de JWT (Bearer ou Cookie)"""
    actual_token = token or podium_token
    
    if not actual_token:
        raise HTTPException(401, "Token não fornecido")
    
    try:
        payload = jwt.decode(actual_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(401, "Token inválido")
    except JWTError:
        raise HTTPException(401, "Token inválido")
    
    user = db.get(User, int(user_id))
    if not user or not user.is_active:
        raise HTTPException(401, "Usuário não encontrado ou inativo")
    
    return user
```

**Impacto:**
- ✅ Elimina vulnerabilidade crítica XSS
- ✅ Padrão de segurança industry
- ✅ CSRF protection automático

**Tempo:** ~30 minutos

---

### 🟠 **IMPORTANTES** (Sprint 1-2)

#### **5. Busca e Filtros Avançados**

**Problema:**
- Admin não consegue filtrar motoristas por nome/email
- Sem busca, listagem é inútil com muitos registros

**Solução (app/api/v1/users.py):**
```python
from sqlalchemy import or_, func

@router.get("/", response_model=PaginatedResponse[UserRead])
def read_users(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    role: Optional[str] = Query(None, description="Filtrar por papel"),
    search: Optional[str] = Query(None, description="Buscar por email/nome"),
    is_active: Optional[bool] = Query(None, description="Filtrar por status"),
    current_user: User = Depends(require_role("admin")),
    db: Session = Depends(get_session)
):
    """Listagem com busca, filtros e paginação"""
    query = select(User)
    
    # Filtro por role
    if role:
        query = query.where(User.role == role)
    
    # Busca por texto
    if search:
        query = query.where(
            or_(
                User.email.ilike(f"%{search}%"),
                User.full_name.ilike(f"%{search}%")
            )
        )
    
    # Filtro por status
    if is_active is not None:
        query = query.where(User.is_active == is_active)
    
    # Contar total antes de paginar
    total = db.exec(select(func.count(User.id)).select_from(User)).one()
    
    # Paginar
    users = db.exec(query.offset(skip).limit(limit)).all()
    
    return PaginatedResponse(
        data=users,
        meta=PaginationMeta(
            total=total,
            skip=skip,
            limit=limit,
            pages=(total + limit - 1) // limit
        )
    )
```

**Tempo:** ~1 hora

---

#### **6. Motoristas Próximos - Busca Geoespacial**

**Problema:**
- Ao solicitar corrida, não há como encontrar motoristas próximos
- Necessário para matching automático

**Solução (app/api/v1/drivers.py - CRIAR):**
```python
from math import radians, cos, sin, asin, sqrt

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calcula distância entre dois pontos em km (fórmula de Haversine)"""
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return 6371 * c  # 6371 = raio da Terra em km

@router.get("/nearby")
def get_nearby_drivers(
    lat: float = Query(..., description="Latitude origem"),
    lng: float = Query(..., description="Longitude origem"),
    radius_km: float = Query(5, ge=1, le=50, description="Raio em km"),
    db: Session = Depends(get_session)
):
    """Retorna motoristas ativos próximos à localização"""
    # Buscar todos os motoristas ativos
    drivers = db.exec(
        select(User).where(
            (User.role == "driver") & (User.is_active == True)
        )
    ).all()
    
    nearby = []
    for driver in drivers:
        if driver.driver_profile and driver.driver_profile.current_lat:
            dist = haversine_distance(
                lat, lng,
                driver.driver_profile.current_lat,
                driver.driver_profile.current_lng
            )
            if dist <= radius_km:
                nearby.append({
                    "driver": driver,
                    "distance_km": round(dist, 2)
                })
    
    # Ordenar por distância (mais próximos primeiro)
    return sorted(nearby, key=lambda x: x["distance_km"])
```

**Nota Futura:** Usar PostGIS no PostgreSQL para queries geoespaciais mais eficientes em produção.

**Tempo:** ~1.5 horas

---

#### **7. Sistema de Ganhos do Motorista**

**Problema:**
- Motorista não vê seus ganhos na API
- Dados estão em mock no app mobile

**Solução - Modelo (app/models/domain.py):**
```python
class RideEarning(SQLModel, table=True):
    __tablename__ = "ride_earnings"
    
    id: Optional[int] = None
    driver_id: int = Field(foreign_key="users.id")
    ride_id: int = Field(foreign_key="rides.id")
    
    amount: float  # Valor total da corrida
    commission: float = 0.10  # Taxa da plataforma (10%)
    net_amount: float  # Ganho líquido
    
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

**Solução - Endpoint (app/api/v1/drivers.py):**
```python
from datetime import timedelta

@router.get("/me/earnings")
def get_driver_earnings(
    period: str = Query("today", regex="^(today|week|month)$"),
    current_user: User = Depends(require_role("driver")),
    db: Session = Depends(get_session)
):
    """Retorna ganhos do motorista por período"""
    now = datetime.now(timezone.utc)
    
    # Calcular data de início
    if period == "today":
        start_date = now.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "week":
        start_date = now - timedelta(days=now.weekday())
        start_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    elif period == "month":
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    earnings = db.exec(
        select(RideEarning).where(
            (RideEarning.driver_id == current_user.id) &
            (RideEarning.created_at >= start_date)
        )
    ).all()
    
    return {
        "period": period,
        "total_rides": len(earnings),
        "gross_amount": sum(e.amount for e in earnings),
        "total_commission": sum(e.commission for e in earnings),
        "net_amount": sum(e.net_amount for e in earnings),
        "earnings": earnings
    }
```

**Tempo:** ~1.5 horas

---

### 🟡 **MELHORIAS** (Sprint 2-3)

#### **8. Paginação com Meta (Resposta Padrão)**

**Schema (app/schemas/pagination.py - CRIAR):**
```python
from pydantic import BaseModel
from typing import Generic, TypeVar, List

T = TypeVar("T")

class PaginationMeta(BaseModel):
    total: int
    skip: int
    limit: int
    pages: int

class PaginatedResponse(BaseModel, Generic[T]):
    data: List[T]
    meta: PaginationMeta
```

**Tempo:** ~30 minutos

---

#### **9. Rate Limiting**

**Instalação:**
```bash
pip install slowapi
```

**Implementação (app/main.py):**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Aplicar a rotas sensíveis
@router.post("/login")
@limiter.limit("5/minute")
def login(request: Request, ...):
    pass
```

**Tempo:** ~45 minutos

---

#### **10. Auditoria e Logs**

**Modelo (app/models/domain.py):**
```python
class AuditLog(SQLModel, table=True):
    __tablename__ = "audit_logs"
    
    id: Optional[int] = None
    user_id: Optional[int] = Field(foreign_key="users.id")
    action: str  # "create", "update", "delete", "login"
    resource: str  # "User", "Ride", etc
    resource_id: int
    old_values: dict = Field(default_factory=dict)
    new_values: dict = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    ip_address: str
```

**Tempo:** ~3 horas

---

## 📊 Tabela de Prioridades

| # | Feature | Impacto | Esforço | Prioridade | Tempo Est. |
|---|---------|--------|--------|-----------|-----------|
| 1 | GET /me endpoint | Crítico | Baixo | 🔴 Agora | 15min |
| 2 | CRUD Corridas | Crítico | Alto | 🔴 Agora | 4h |
| 3 | PUT/DELETE usuários | Alto | Médio | 🔴 Agora | 1h |
| 4 | HttpOnly Cookies | Crítico (seg) | Baixo | 🔴 Agora | 30min |
| 5 | Filtros avançados | Médio | Baixo | 🟠 Sprint 1 | 1h |
| 6 | Motoristas próximos | Alto | Médio | 🟠 Sprint 1 | 1.5h |
| 7 | Ganhos motorista | Médio | Médio | 🟠 Sprint 1 | 1.5h |
| 8 | Paginação meta | Médio | Baixo | 🟡 Sprint 2 | 30min |
| 9 | Rate limiting | Médio | Baixo | 🟡 Sprint 2 | 45min |
| 10 | Auditoria | Baixo | Alto | 🟡 Sprint 3 | 3h |

**Total Críticas (Sprint 1 - Primeira Semana):** ~5.75 horas  
**Total Importantes (Sprint 1-2):** ~4 horas  
**Total Melhorias (Sprint 2-3):** ~4.25 horas  

**Total Projeto:** ~14 horas

---

## 🗂️ Estrutura de Arquivos a Criar/Modificar

### **Novos Arquivos**
```
app/
├── api/v1/
│   ├── rides.py              # ✨ NOVO: endpoints de corridas
│   ├── drivers.py            # ✨ NOVO: endpoints específicos motorista
│   └── employees.py          # ✨ NOVO: endpoints funcionários corporativos
├── models/
│   └── domain.py             # 🔄 MODIFICAR: adicionar Ride, RideEarning
└── schemas/
    ├── ride.py               # ✨ NOVO: schemas de corrida
    ├── pagination.py         # ✨ NOVO: resposta paginada genérica
    └── user.py               # 🔄 MODIFICAR: adicionar UserUpdate
```

### **Modificações Existentes**
```
app/
├── api/
│   ├── api.py                # 🔄 MODIFICAR: incluir novos routers
│   └── v1/
│       ├── auth.py           # 🔄 MODIFICAR: adicionar logout, HttpOnly cookie
│       ├── users.py          # 🔄 MODIFICAR: GET /me, PUT, DELETE, filtros
│       └── deps.py           # 🔄 MODIFICAR: suportar Cookie além de Bearer
├── core/
│   └── database.py           # ✅ Sem mudanças (reusa Session)
└── main.py                   # 🔄 MODIFICAR: adicionar limiter, CORS ajustes
```

---

## 🚀 Roadmap de Implementação

### **Fase 1: MVP Completo (Semana 1-2)**
- [x] Análise realizada
- [ ] GET /me endpoint
- [ ] CRUD Corridas
- [ ] PUT/DELETE usuários
- [ ] HttpOnly Cookies
- [ ] Testes de integração
- [ ] Deploy em staging

### **Fase 2: Otimizações (Semana 3-4)**
- [ ] Filtros avançados
- [ ] Motoristas próximos (geoloc)
- [ ] Sistema de ganhos
- [ ] Documentação de API (OpenAPI)
- [ ] Performance tuning

### **Fase 3: Robustez (Semana 5-6)**
- [ ] Paginação meta
- [ ] Rate limiting
- [ ] Auditoria completa
- [ ] Testes de carga
- [ ] Setup CI/CD

### **Fase 4: Portal Corporativo (Semana 7+)**
- [ ] Endpoints para funcionários
- [ ] Solicitação de corridas
- [ ] Histórico de gastos
- [ ] Integração com centro de custo
- [ ] Frontend corporativo

---

## ✅ Checklist de Implementação

### **Semana 1: Features Críticas**
- [ ] Branch `feat/core-endpoints` criada
- [ ] GET /me endpoint implemented
- [ ] Ride model + migrations criadas
- [ ] POST /rides endpoint working
- [ ] PATCH /rides/{id}/status working
- [ ] GET /rides working
- [ ] PUT /users/{id} working
- [ ] DELETE /users/{id} working (soft delete)
- [ ] HttpOnly cookies implemented
- [ ] Cookie support em deps.py
- [ ] Testes unitários escritos
- [ ] PR aberto para review

### **Semana 2: Validação e Otimização**
- [ ] Testes de integração executados
- [ ] Deploy em staging
- [ ] Teste com clientes reais (mobile + web)
- [ ] Bugs corrigidos
- [ ] Documentação atualizada
- [ ] Performance acceptável (<200ms p95)
- [ ] Merge para release/v0.2.0

---

## 📝 Notas Importantes

### **Segurança**
1. **Nunca** store tokens em localStorage no frontend
2. **Sempre** validar role e acesso em backend
3. **Usar** HttpOnly, Secure, SameSite cookies
4. **Implementar** rate limiting antes de produção

### **Performance**
1. Índices no banco para `(role, is_active)`, `email`, `driver_id` em Ride
2. Cache de motoristas próximos (expira a cada minuto)
3. Paginação obrigatória em listas

### **Testing**
1. Testes de RBAC (role-based access control)
2. Testes de transições de status de Ride
3. Testes de concorrência (2 motoristas aceitam mesma corrida)

---

## 📞 Referências

- [FastAPI Best Practices](https://fastapi.tiangolo.com/advanced/security/oauth2-jwt/)
- [OWASP Top 10 API Security](https://owasp.org/www-project-api-security/)
- [REST API Design Best Practices](https://restfulapi.net/)
- [SQLAlchemy ORM Tutorial](https://docs.sqlalchemy.org/en/20/orm/)

---

**Próximos Passos:**
1. Revisar sugestões com time
2. Priorizar conforme roadmap
3. Criar tasks no backlog (GitHub Issues)
4. Iniciar Sprint 1 com features críticas
5. Setup de CI/CD antes dos testes

**Status:** ✅ Pronto para implementação