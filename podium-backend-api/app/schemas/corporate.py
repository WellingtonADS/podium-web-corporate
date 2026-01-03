from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


# --- COST CENTER SCHEMAS ---
class CostCenterBase(BaseModel):
    name: str
    code: str
    budget_limit: float = 0.0
    is_active: bool = True


class CostCenterCreate(CostCenterBase):
    pass


class CostCenterUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    budget_limit: Optional[float] = None
    is_active: Optional[bool] = None


class CostCenterRead(CostCenterBase):
    id: int
    company_id: int

    model_config = ConfigDict(from_attributes=True)


# --- EMPLOYEE PROFILE SCHEMAS ---
class EmployeeProfileBase(BaseModel):
    department: Optional[str] = None
    phone: Optional[str] = None


class EmployeeProfileCreate(EmployeeProfileBase):
    user_id: int
    company_id: int
    cost_center_id: Optional[int] = None


class EmployeeProfileRead(EmployeeProfileBase):
    id: int
    user_id: int
    company_id: int
    cost_center_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)


# --- EMPLOYEE (USER + PROFILE) SCHEMAS ---
class EmployeeCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    department: Optional[str] = None
    phone: Optional[str] = None


class EmployeeRead(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    employee_profile: Optional[EmployeeProfileRead] = None

    model_config = ConfigDict(from_attributes=True)
