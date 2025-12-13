from fastapi import FastAPI
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.models import domain  # Importa os modelos para o SQLModel registrá-los
from app.api.v1 import auth

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Evento de inicialização para criar tabelas (se não existirem)
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Autenticação"])

@app.get("/")
def root():
    return {"message": "Podium API is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"db_status": "connected (check logs for echo)"}