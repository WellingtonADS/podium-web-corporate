from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- OBRIGATÓRIO
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.models import domain  # Importa os modelos para o SQLModel registrá-los
from app.api.api import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# --- CORREÇÃO DO CORS ---
origins = [
    "http://localhost:3000",      # React Local
    "http://127.0.0.1:3000",      # Alternativa Local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------

# Evento de inicialização para criar tabelas (se não existirem)
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Agregador de rotas (v1): inclui todas as rotas versionadas
app.include_router(api_router)

@app.get("/")
def root():
    return {"message": "Podium API is running!", "status": "active"}

@app.get("/health")
def health_check():
    return {"db_status": "connected"}