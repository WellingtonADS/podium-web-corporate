from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api.v1.deps import require_role
from app.core.database import get_session
from app.core.security import get_password_hash
from app.models.domain import CostCenter, EmployeeProfile, User
from app.schemas.corporate import CostCenterCreate, CostCenterRead, EmployeeRead
from app.schemas.user import EmployeeCreate

router = APIRouter()


# --- ENDPOINTS ---


@router.get("/cost-centers", response_model=List[CostCenterRead])
def list_cost_centers(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(require_role("admin", "employee")),
    db: Session = Depends(get_session),
):
    """
    Lista Centros de Custo da empresa do usuário.

    - **Employees**: Vêem apenas os CCs da sua empresa (Soberania).
    - **Admins**: Precisam estar associados a uma empresa.
    """
    if current_user.role == "employee":
        if not current_user.employee_profile:
            raise HTTPException(status_code=400, detail="Employee profile not found")
        company_id = current_user.employee_profile.company_id
    else:
        raise HTTPException(
            status_code=403, detail="Only employees can list cost centers"
        )

    stmt = (
        select(CostCenter)
        .where(CostCenter.company_id == company_id)
        .offset(skip)
        .limit(limit)
    )

    cost_centers = db.exec(stmt).all()
    return cost_centers


@router.post(
    "/cost-centers", response_model=CostCenterRead, status_code=status.HTTP_201_CREATED
)
def create_cost_center(
    cost_center_data: CostCenterCreate,
    company_id: int,
    current_user: User = Depends(require_role("admin", "employee")),
    db: Session = Depends(get_session),
):
    """
    Cria um novo Centro de Custo.

    **Soberania**: O CC é sempre vinculado à empresa do usuário.
    Se um employee tentar criar com outro company_id, será ignorado.
    """
    if current_user.role == "employee":
        if not current_user.employee_profile:
            raise HTTPException(status_code=400, detail="Employee profile not found")
        user_company_id = current_user.employee_profile.company_id
    else:
        raise HTTPException(
            status_code=403, detail="Only employees can create cost centers"
        )

    if company_id != user_company_id:
        raise HTTPException(
            status_code=403,
            detail="You can only create cost centers for your own company",
        )

    new_cost_center = CostCenter(
        name=cost_center_data.name,
        code=cost_center_data.code,
        budget_limit=cost_center_data.budget_limit,
        is_active=cost_center_data.is_active,
        company_id=company_id,
    )

    db.add(new_cost_center)
    db.commit()
    db.refresh(new_cost_center)

    return new_cost_center


@router.post(
    "/employees", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED
)
def create_employee(
    employee_data: EmployeeCreate,
    company_id: int,
    cost_center_id: Optional[int] = None,
    current_user: User = Depends(require_role("admin", "employee")),
    db: Session = Depends(get_session),
):
    """
    Cria um novo Funcionário (role=employee) vinculado a um Centro de Custo.

    **Soberania**: O funcionário é sempre criado na empresa do usuário atual.
    Se tentar criar em outra empresa, será ignorado.
    """
    if current_user.role == "employee":
        if not current_user.employee_profile:
            raise HTTPException(status_code=400, detail="Employee profile not found")
        user_company_id = current_user.employee_profile.company_id
    else:
        raise HTTPException(
            status_code=403, detail="Only employees can create new employees"
        )

    if company_id != user_company_id:
        raise HTTPException(
            status_code=403, detail="You can only create employees for your own company"
        )

    stmt = select(User).where(User.email == employee_data.email)
    existing_user = db.exec(stmt).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(
        email=employee_data.email,
        full_name=employee_data.full_name,
        hashed_password=get_password_hash(employee_data.password),
        role=User.Role.employee,
        is_active=True,
    )

    db.add(new_user)
    db.flush()

    phone = (
        employee_data.phone
        if hasattr(employee_data, "phone") and employee_data.phone
        else None
    )

    new_employee_profile = EmployeeProfile(
        user_id=int(new_user.id or 0),  # Type assertion para satisfazer o type checker
        company_id=company_id,
        cost_center_id=cost_center_id,
        department=employee_data.department,
        phone=phone,
    )

    db.add(new_employee_profile)
    db.commit()
    db.refresh(new_user)

    return new_user
