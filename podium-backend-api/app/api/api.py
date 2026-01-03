# V1 Routers
from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.corporate import router as corporate_router
from app.api.v1.leads import router as leads_router
from app.api.v1.pricing import router as pricing_router
from app.api.v1.stats import router as stats_router
from app.api.v1.users import router as users_router

router = APIRouter()

# Aggregates all versioned routers
router.include_router(auth_router, prefix="/api/v1", tags=["auth"])
router.include_router(stats_router, prefix="/api/v1/stats", tags=["stats"])
router.include_router(users_router, prefix="/api/v1/users", tags=["users"])
router.include_router(pricing_router, prefix="/api/v1/pricing", tags=["pricing"])
router.include_router(leads_router, prefix="/api/v1", tags=["leads"])
router.include_router(
    corporate_router, prefix="/api/v1/corporate", tags=["Corporate B2B"]
)
