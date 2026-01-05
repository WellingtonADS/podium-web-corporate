from sqlmodel import SQLModel, create_engine, Session
from app.core.config import settings

# check_same_thread=False é necessário apenas para SQLite, mas como usamos Postgres, removemos.
engine = create_engine(settings.DATABASE_URL, echo=True)

def get_session():
    """Dependência para injetar a sessão do banco nas rotas."""
    with Session(engine) as session:
        yield session

def create_db_and_tables():
    """Cria as tabelas no banco de dados (útil para desenvolvimento inicial)."""
    SQLModel.metadata.create_all(engine)