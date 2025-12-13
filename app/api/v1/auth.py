from typing import Union
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from app.core.database import get_session
from app.core.security import create_access_token, get_password_hash, verify_password
from app.models.domain import User, DriverProfile, EmployeeProfile
from app.schemas.user import AdminCreate, DriverCreate, EmployeeCreate, UserRead

router = APIRouter()

# --- FUNÇÃO AUXILIAR PARA CRIAR O USUÁRIO BASE ---
def create_base_user(db: Session, user_in: Union[AdminCreate, DriverCreate, EmployeeCreate], role: str) -> User:
    # Verifica email duplicado
    query = select(User).where(User.email == user_in.email)
    if db.exec(query).first():
        raise HTTPException(status_code=400, detail="Email já cadastrado.")
    
    # Cria usuário base
    db_user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        role=role,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- ROTA 1: CADASTRO DE ADMIN ---
@router.post("/signup/admin", response_model=UserRead)
def signup_admin(user_in: AdminCreate, db: Session = Depends(get_session)):
    """Cria um Administrador do Sistema (Backoffice)."""
    return create_base_user(db, user_in, role="admin")

# --- ROTA 2: CADASTRO DE MOTORISTA ---
@router.post("/signup/driver", response_model=UserRead)
def signup_driver(user_in: DriverCreate, db: Session = Depends(get_session)):
    """Cria um Motorista e seu perfil veicular."""
    # 1. Cria o User
    new_user = create_base_user(db, user_in, role="driver")
    
    # 2. Cria o Perfil de Motorista
    if new_user.id is None:
        raise HTTPException(status_code=500, detail="Erro ao criar usuário")
    
    driver_profile = DriverProfile(
        user_id=new_user.id,
        vehicle_model=user_in.vehicle_model,
        vehicle_plate=user_in.vehicle_plate,
        cnh_number=user_in.cnh_number
    )
    db.add(driver_profile)
    db.commit()
    
    return new_user

# --- ROTA 3: CADASTRO DE FUNCIONÁRIO (APP PASSAGEIRO) ---
@router.post("/signup/employee", response_model=UserRead)
def signup_employee(user_in: EmployeeCreate, db: Session = Depends(get_session)):
    """Cria um Funcionário vinculado a uma empresa."""
    # 1. Cria o User
    new_user = create_base_user(db, user_in, role="employee")
    
    # 2. Cria o Perfil de Funcionário
    if new_user.id is None:
        raise HTTPException(status_code=500, detail="Erro ao criar usuário")
    
    emp_profile = EmployeeProfile(
        user_id=new_user.id,
        company_id=user_in.company_id,
        department=user_in.department
    )
    db.add(emp_profile)
    db.commit()
    
    return new_user

# --- ROTA DE LOGIN (MANTÉM A MESMA) ---
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_session)):
    """Realiza login e retorna o token de acesso."""
    query = select(User).where(User.email == form_data.username)
    user = db.exec(query).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Credenciais inválidas")
        
    return {"access_token": create_access_token(user.id), "token_type": "bearer"}