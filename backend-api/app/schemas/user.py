from pydantic import BaseModel, EmailStr, ConfigDict
from typing import Optional, Literal

# --- BASE (Comum a todos) ---
class UserBase(BaseModel):
    email: EmailStr
    full_name: str

# --- INPUTS (Inputs não precisam de ORM Mode) ---

class AdminCreate(UserBase):
    password: str

class DriverCreate(UserBase):
    password: str
    vehicle_model: str
    vehicle_plate: str
    cnh_number: str

class EmployeeCreate(UserBase):
    password: str
    company_id: int
    department: Optional[str] = None

# --- OUTPUTS (Aqui está a correção!) ---

class DriverProfileRead(BaseModel):
    vehicle_model: str
    vehicle_plate: str
    cnh_number: str
    # NOVOS CAMPOS EXPOSTOS
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None

    # Pydantic v2: leitura de objetos ORM/SQLModel
    model_config = ConfigDict(from_attributes=True)

class UserRead(UserBase):
    id: int
    role: str
    is_active: bool
    driver_profile: Optional[DriverProfileRead] = None

    # Pydantic v2: leitura de objetos ORM/SQLModel
    model_config = ConfigDict(from_attributes=True)

# --- Schemas genéricos ---
class UserCreate(UserBase):
    password: str
    role: Literal["admin", "driver", "employee"]

class Token(BaseModel):
    access_token: str
    token_type: str