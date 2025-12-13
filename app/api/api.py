from fastapi import APIRouter

# V1 Routers
from app.api.v1.auth import router as auth_router

router = APIRouter()

# Aggregates all versioned routers
router.include_router(auth_router, prefix="/api/v1", tags=["auth"]) 
