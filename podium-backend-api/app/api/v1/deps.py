from typing import Optional, Callable
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from sqlmodel import Session, select
from app.core.config import settings
from app.core.database import get_session
from app.models.domain import User

# O endpoint que fornece o token (definiremos no próximo passo)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/login")

class TokenData(BaseModel):
    id: Optional[str] = None

def get_current_user(db: Session = Depends(get_session), token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais de autenticação inválidas",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id_raw = payload.get("sub")
        if user_id_raw is None:
            raise credentials_exception
        if not isinstance(user_id_raw, (str, int)):
            raise credentials_exception
        token_data = TokenData(id=str(user_id_raw))
    except JWTError:
        raise credentials_exception

    try:
        user_id_int = int(token_data.id) if token_data.id is not None else None
    except (TypeError, ValueError):
        raise credentials_exception
    if user_id_int is None:
        raise credentials_exception

    stmt = select(User).where(User.id == user_id_int)
    user = db.exec(stmt).first()
    if not user:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Usuário inativo")
    return user

def require_role(*allowed_roles: str) -> Callable[[User], User]:
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Permissão negada")
        return current_user
    return dependency