from pydantic import BaseModel, EmailStr
from typing import Optional

# --- BASE (Comum a todos) ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

# --- INPUTS (O que o Front envia) ---

# 1. Criar ADMIN (Simples)
class AdminCreate(UserBase):
    password: str

# 2. Criar MOTORISTA (Exige carro)
class DriverCreate(UserBase):
    password: str
    vehicle_model: str
    vehicle_plate: str
    cnh_number: str

# 3. Criar FUNCIONÁRIO (Exige empresa)
class EmployeeCreate(UserBase):
    password: str
    company_id: int
    department: Optional[str] = None

# --- OUTPUTS (O que a API devolve) ---
class UserRead(UserBase):
    id: int
    role: str
    is_active: bool
