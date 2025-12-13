from fastapi import APIRouter


# V1 Routers
from app.api.v1.auth import router as auth_router
from app.api.v1.stats import router as stats_router
from app.api.v1 import auth, stats, users

router = APIRouter()

# Aggregates all versioned routers
router.include_router(auth_router, prefix="/api/v1", tags=["auth"])
router.include_router(stats_router, prefix="/api/v1/stats", tags=["stats"]) 
router.include_router(users.router, prefix="/api/v1/users", tags=["users"])
