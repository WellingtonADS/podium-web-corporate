from pydantic import BaseModel, EmailStr
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
    
    # Habilita leitura de objeto ORM (SQLAlchemy/SQLModel)
    class Config:
        from_attributes = True # Pydantic V2
        orm_mode = True        # Pydantic V1 (Legacy)

class UserRead(UserBase):
    id: int
    role: str
    is_active: bool
    driver_profile: Optional[DriverProfileRead] = None

    # Habilita leitura de objeto ORM (SQLAlchemy/SQLModel)
    class Config:
        from_attributes = True # Pydantic V2
        orm_mode = True        # Pydantic V1 (Legacy)

# --- Schemas genéricos ---
class UserCreate(UserBase):
    password: str
    role: Literal["admin", "driver", "employee"]

class Token(BaseModel):
    access_token: str
    token_type: str