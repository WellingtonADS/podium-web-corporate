from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from datetime import datetime, timezone
from pydantic import BaseModel
from typing import cast

from app.core.database import get_session
from app.api.v1.deps import require_role
from app.models.domain import User, Ride

# 1. Definição do Schema de Resposta (Resolve 'reportUnknownVariableType')
class DashboardStats(BaseModel):
    drivers_online: int
    rides_today: int
    revenue_today: float
    average_ticket: float

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_session),
    _: User = Depends(require_role("admin")),
):
    """
    Retorna KPIs consolidados para o Dashboard Administrativo.
    """
    
    # 2. Total de Motoristas Ativos
    query_drivers = (
        select(func.count())
        .select_from(User)
        .where(User.role == "driver")
        .where(User.is_active)
    )
    total_drivers_raw = db.exec(query_drivers).one()
    drivers_value = cast(int | float | None, total_drivers_raw[0] if isinstance(total_drivers_raw, tuple) else total_drivers_raw)
    total_drivers = int(drivers_value or 0)

    # 3. Corridas de Hoje (Início do dia UTC)
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    query_rides = (
        select(func.count())
        .select_from(Ride)
        .where(Ride.created_at >= today)
    )
    total_rides_raw = db.exec(query_rides).one()
    rides_value = cast(int | float | None, total_rides_raw[0] if isinstance(total_rides_raw, tuple) else total_rides_raw)
    total_rides = int(rides_value or 0)

    # 4. Faturamento do Dia
    # func.sum pode retornar Decimal, float ou None. Tratamos com segurança.
    query_revenue = select(func.sum(Ride.price_fixed)).where(Ride.created_at >= today)
    revenue_raw = db.exec(query_revenue).one()
    revenue_value = cast(float | int | None, revenue_raw[0] if isinstance(revenue_raw, tuple) else revenue_raw)
    total_revenue = float(revenue_value or 0.0)

    return DashboardStats(
        drivers_online=total_drivers,
        rides_today=total_rides,
        revenue_today=total_revenue,
        average_ticket=(total_revenue / total_rides) if total_rides > 0 else 0.0
    )