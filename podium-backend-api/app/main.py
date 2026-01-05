from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <--- OBRIGATÓRIO

from app.api.api import router as api_router
from app.core.config import settings
from app.core.database import create_db_and_tables
from app.models import domain


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Import side effect: registers models with SQLModel
    _ = domain
    create_db_and_tables()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# --- CORREÇÃO DO CORS ---
origins = [
    # Web-admin (5174)
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://192.168.15.18:5174",
    # Web-corporate (5175)
    "http://localhost:5175",
    "http://127.0.0.1:5175",
    "http://192.168.15.18:5175",
    # Web-site (5176)
    "http://localhost:5176",
    "http://127.0.0.1:5176",
    "http://192.168.15.18:5176",
    # Legacy local 3000
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://192.168.15.18:3000",
    # Mobile Metro (Expo)
    "http://192.168.15.18:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ------------------------

# Agregador de rotas (v1): inclui todas as rotas versionadas
app.include_router(api_router)


@app.get("/")
def root():
    return {"message": "Podium API is running!", "status": "active"}


@app.get("/health")
def health_check():
    return {"db_status": "connected"}
