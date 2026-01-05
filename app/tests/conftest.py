"""
Configuração de fixtures pytest para testes de integração.
"""

import pytest
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool
from app.core.database import get_session
from app.core.security import get_password_hash
from app.models.domain import User
from app.main import app


@pytest.fixture(name="db_session")
def db_session_fixture():
    """
    Cria uma sessão de banco de dados em memória para testes.
    Cada teste terá um banco limpo e isolado.
    """
    # Engine em memória com StaticPool para SQLite
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    
    # Criar todas as tabelas
    SQLModel.metadata.create_all(engine)
    
    with Session(engine) as session:
        # Criar admin de teste para autenticação
        admin = User(
            email="admin@podium.com",
            full_name="Test Admin",
            hashed_password=get_password_hash("Admin123!"),
            role=User.Role.admin,
            is_active=True
        )
        session.add(admin)
        session.commit()
        
        yield session
    
    # Limpar após teste
    SQLModel.metadata.drop_all(engine)


@pytest.fixture(name="client")
def client_fixture(db_session: Session):
    """
    Cliente de teste do FastAPI com banco de dados mocado.
    """
    from fastapi.testclient import TestClient
    
    def get_session_override():
        return db_session
    
    app.dependency_overrides[get_session] = get_session_override
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()
