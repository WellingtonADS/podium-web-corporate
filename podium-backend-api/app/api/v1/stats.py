from datetime import datetime, timezone
from typing import cast

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlmodel import Session, func, select

from app.api.v1.deps import require_role
from app.core.database import get_session
from app.models.domain import CostCenter, EmployeeProfile, Ride, User


# 1. Definição do Schema de Resposta (Resolve 'reportUnknownVariableType')
class DashboardStats(BaseModel):
    drivers_online: int
    rides_today: int
    revenue_today: float
    average_ticket: float


class CorporateDashboardStats(BaseModel):
    """Stats específicas para o Dashboard Corporativo"""

    monthly_consumption: float
    active_employees: int
    rides_completed: int
    remaining_budget: float


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
    drivers_value = cast(
        int | float | None,
        total_drivers_raw[0]
        if isinstance(total_drivers_raw, tuple)
        else total_drivers_raw,
    )
    total_drivers = int(drivers_value or 0)

    # 3. Corridas de Hoje (Início do dia UTC)
    today = datetime.now(timezone.utc).replace(
        hour=0, minute=0, second=0, microsecond=0
    )

    query_rides = select(func.count()).select_from(Ride).where(Ride.created_at >= today)
    total_rides_raw = db.exec(query_rides).one()
    rides_value = cast(
        int | float | None,
        total_rides_raw[0] if isinstance(total_rides_raw, tuple) else total_rides_raw,
    )
    total_rides = int(rides_value or 0)

    # 4. Faturamento do Dia
    # func.sum pode retornar Decimal, float ou None. Tratamos com segurança.
    query_revenue = select(func.sum(Ride.price_fixed)).where(Ride.created_at >= today)
    revenue_raw = db.exec(query_revenue).one()
    revenue_value = cast(
        float | int | None,
        revenue_raw[0] if isinstance(revenue_raw, tuple) else revenue_raw,
    )
    total_revenue = float(revenue_value or 0.0)

    return DashboardStats(
        drivers_online=total_drivers,
        rides_today=total_rides,
        revenue_today=total_revenue,
        average_ticket=(total_revenue / total_rides) if total_rides > 0 else 0.0,
    )


@router.get("/corporate/dashboard", response_model=CorporateDashboardStats)
def get_corporate_dashboard_stats(
    db: Session = Depends(get_session),
    current_user: User = Depends(require_role("admin", "employee")),
):
    """
    Retorna KPIs consolidados para o Dashboard Corporativo.

    Filtra dados por company_id do usuário atual (Soberania).
    """

    # Obter company_id do usuário
    if current_user.role == "employee":
        if not current_user.employee_profile:
            raise HTTPException(status_code=400, detail="Employee profile not found")
        company_id = current_user.employee_profile.company_id
    else:
        raise HTTPException(
            status_code=403, detail="Only employees can access corporate dashboard"
        )

    # 1. Funcionários ativos da empresa
    query_employees = (
        select(func.count())
        .select_from(User)
        .join(EmployeeProfile, User.id == EmployeeProfile.user_id)  # type: ignore
        .where(EmployeeProfile.company_id == company_id)
        .where(User.is_active)
        .where(User.role == "employee")
    )
    active_employees_raw = db.exec(query_employees).one()
    employees_value = cast(
        int | float | None,
        active_employees_raw[0]
        if isinstance(active_employees_raw, tuple)
        else active_employees_raw,
    )
    active_employees = int(employees_value or 0)

    # 2. Corridas completadas este mês
    today = datetime.now(timezone.utc)
    month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

    query_rides = (
        select(func.count())
        .select_from(Ride)
        .join(User, Ride.driver_id == User.id)  # type: ignore
        .join(EmployeeProfile, User.id == EmployeeProfile.user_id)  # type: ignore
        .where(EmployeeProfile.company_id == company_id)
        .where(Ride.created_at >= month_start)
    )
    rides_raw = db.exec(query_rides).one()
    rides_value = cast(
        int | float | None, rides_raw[0] if isinstance(rides_raw, tuple) else rides_raw
    )
    rides_completed = int(rides_value or 0)

    # 3. Orçamento total da empresa (soma de todos CCs)
    query_budget = select(func.sum(CostCenter.budget_limit)).where(
        CostCenter.company_id == company_id
    )
    budget_raw = db.exec(query_budget).one()
    budget_value = cast(
        float | int | None,
        budget_raw[0] if isinstance(budget_raw, tuple) else budget_raw,
    )
    total_budget = float(budget_value or 0.0)

    # 4. Consumo este mês (soma de preços das corridas)
    query_consumption = (
        select(func.sum(Ride.price_fixed))
        .select_from(Ride)
        .join(User, Ride.driver_id == User.id)  # type: ignore
        .join(EmployeeProfile, User.id == EmployeeProfile.user_id)  # type: ignore
        .where(EmployeeProfile.company_id == company_id)
        .where(Ride.created_at >= month_start)
    )
    consumption_raw = db.exec(query_consumption).one()
    consumption_value = cast(
        float | int | None,
        consumption_raw[0] if isinstance(consumption_raw, tuple) else consumption_raw,
    )
    monthly_consumption = float(consumption_value or 0.0)

    remaining_budget = total_budget - monthly_consumption

    return CorporateDashboardStats(
        monthly_consumption=monthly_consumption,
        active_employees=active_employees,
        rides_completed=rides_completed,
        remaining_budget=remaining_budget,
    )
