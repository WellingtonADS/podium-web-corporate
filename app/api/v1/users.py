from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from app.core.database import get_session
# CORREÇÃO: Removemos a importação errada de 'security'
# get_current_user e require_role vêm ambos de 'deps'
from app.api.v1.deps import require_role
from app.models.domain import User
from app.schemas.user import UserRead 

router = APIRouter()

@router.get("/", response_model=List[UserRead])
def read_users(
    skip: int = 0,
    limit: int = 100,
    role: Optional[str] = Query(None, description="Filtrar por papel (admin, driver, employee)"),
    # require_role já cuida de verificar o usuário, não precisamos importar get_current_user explicitamente aqui
    current_user: User = Depends(require_role("admin")), 
    db: Session = Depends(get_session),
):
    """
    Lista usuários do sistema com paginação e filtro opcional por Role.
    Apenas para Administradores.
    """
    query = select(User)
    
    if role:
        query = query.where(User.role == role)
        
    query = query.offset(skip).limit(limit)
    users = db.exec(query).all()
    
    return users