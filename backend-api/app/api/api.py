from fastapi import APIRouter


# V1 Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.stats import router as stats_router
from app.api.v1 import users
from app.api.v1.pricing import router as pricing_router

router = APIRouter()

# Aggregates all versioned routers
router.include_router(auth_router, prefix="/api/v1", tags=["auth"])
router.include_router(stats_router, prefix="/api/v1/stats", tags=["stats"]) 
router.include_router(users.router, prefix="/api/v1/users", tags=["users"])
router.include_router(pricing_router, prefix="/api/v1/pricing", tags=["pricing"])
