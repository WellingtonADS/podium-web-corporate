from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from datetime import datetime, timezone
from pydantic import BaseModel

from app.core.database import get_session
from app.api.v1.deps import get_current_user
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
    current_user: User = Depends(get_current_user)
):
    """
    Retorna KPIs consolidados para o Dashboard Administrativo.
    """
    
    # 2. Total de Motoristas Ativos
    # CORREÇÃO: Usamos select_from(User) e func.count() sem argumentos.
    # Isso evita o erro 'int | None cannot be assigned to expression'.
    query_drivers = (
        select(func.count())
        .select_from(User)
        .where(User.role == "driver")
        .where(User.is_active)
    )
    # O 'or 0' garante int caso o banco retorne None (embora count geralmente retorne 0)
    total_drivers = db.exec(query_drivers).one() or 0

    # 3. Corridas de Hoje (Início do dia UTC)
    today = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    
    query_rides = (
        select(func.count())
        .select_from(Ride)
        .where(Ride.created_at >= today)
    )
    total_rides = db.exec(query_rides).one() or 0

    # 4. Faturamento do Dia
    # func.sum pode retornar Decimal, float ou None. Tratamos com segurança.
    query_revenue = select(func.sum(Ride.price_fixed)).where(Ride.created_at >= today)
    result_revenue = db.exec(query_revenue).one()
    
    total_revenue = float(result_revenue) if result_revenue else 0.0

    return DashboardStats(
        drivers_online=int(total_drivers),
        rides_today=int(total_rides),
        revenue_today=total_revenue,
        average_ticket=(total_revenue / total_rides) if total_rides > 0 else 0.0
    )