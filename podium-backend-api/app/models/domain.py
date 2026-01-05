from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel  # type: ignore[attr-defined]


# --- 1. EMPRESAS (CLIENTE B2B) ---
class Company(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    cnpj: str = Field(unique=True, index=True)
    contract_status: str = "active"  # active, suspended
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relacionamentos
    cost_centers: List["CostCenter"] = Relationship(back_populates="company")
    employees: List["EmployeeProfile"] = Relationship(back_populates="company")


# --- 2. CENTROS DE CUSTO ---
class CostCenter(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str  # Ex: "Diretoria", "Projeto Samsung"
    code: str  # Ex: "CC-001"
    budget_limit: Optional[float] = None

    company_id: Optional[int] = Field(default=None, foreign_key="company.id")
    company: Optional[Company] = Relationship(back_populates="cost_centers")


# --- 3. PERFIL DO MOTORISTA (Dados que só motorista tem) ---
class DriverProfile(SQLModel, table=True):
    __tablename__ = "driver_profiles"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")

    vehicle_model: str
    vehicle_plate: str
    cnh_number: str
    rating: float = 5.0

    # NOVOS CAMPOS DE TELEMETRIA
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    last_location_at: Optional[datetime] = None

    # Relacionamento Reverso
    user: "User" = Relationship(back_populates="driver_profile")


# --- 4. PERFIL DO FUNCIONÁRIO/PASSAGEIRO (Dados B2B) ---
class EmployeeProfile(SQLModel, table=True):
    __tablename__ = "employee_profiles"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")

    company_id: int = Field(foreign_key="company.id")
    department: Optional[str] = None

    # Relacionamento Reverso
    user: "User" = Relationship(back_populates="employee_profile")
    company: "Company" = Relationship(back_populates="employees")


# --- 5. USUÁRIO BASE (Login e Acesso) ---
class User(SQLModel, table=True):
    __tablename__ = "users"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str

    class Role(str, Enum):
        admin = "admin"
        driver = "driver"
        employee = "employee"

    role: Role  # papéis suportados
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    # Relacionamentos (Opcionais, pois depende do role)
    driver_profile: Optional[DriverProfile] = Relationship(back_populates="user")
    employee_profile: Optional[EmployeeProfile] = Relationship(back_populates="user")


# --- 4. LEADS (CAPTURAS DE SITE) ---
class Lead(SQLModel, table=True):
    __tablename__ = "leads"  # type: ignore[assignment]

    id: Optional[int] = Field(default=None, primary_key=True)
    full_name: str
    email: str = Field(unique=True, index=True)
    phone: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# --- 5. REGRAS DE PREÇO (TABELA FIXA) ---
class PricingRule(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str  # "Tabela Padrão 2025"
    min_km: float
    max_km: float
    fixed_price: float
    extra_km_price: float = 0.0  # Se exceder o max_km


# --- 6. CORRIDAS (O CORE) ---
class Ride(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    status: str = "requested"  # requested, accepted, in_progress, completed, cancelled

    # Dados Geográficos
    origin_lat: float
    origin_lng: float
    origin_address: str
    dest_lat: float
    dest_lng: float
    dest_address: str
    distance_km: float

    # Dados Financeiros (CONGELADOS NO MOMENTO DO PEDIDO)
    price_fixed: float

    # Vínculos
    passenger_id: int = Field(foreign_key="users.id")
    driver_id: Optional[int] = Field(default=None, foreign_key="users.id")
    cost_center_id: int = Field(foreign_key="costcenter.id")
