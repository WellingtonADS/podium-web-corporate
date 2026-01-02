from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_session
from app.models import pricing as models
from app.schemas import pricing as schemas
# from app.api import deps # Descomente se precisar de autenticação (ex: get_current_admin_user)

router = APIRouter()

@router.post("/", response_model=schemas.PricingRule)
def create_pricing_rule(
    rule: schemas.PricingRuleCreate,
    db: Session = Depends(get_session)
):
    """
    Cria uma nova regra de precificação (Tabela de Preço).
    Se a regra for marcada como 'default', ela se torna a padrão do sistema.
    """
    # Se for default, remove o default das outras regras existentes
    if rule.is_default:
        db.query(models.PricingRule).filter(models.PricingRule.is_default).update({"is_default": False})

    # 1. Cria a Regra Principal (Mestre)
    db_rule = models.PricingRule(
        name=rule.name,
        category=rule.category,
        is_tiered=rule.is_tiered,
        price_per_km_after_tiers=rule.price_per_km_after_tiers,
        is_active=rule.is_active,
        is_default=rule.is_default
    )
    db.add(db_rule)
    db.commit()
    db.refresh(db_rule)

    # 2. Cria as faixas de preço (Detalhes/Tiers) associadas
    for tier in rule.tiers:
        db_tier = models.PricingTier(
            pricing_rule_id=db_rule.id,
            min_distance_km=tier.min_distance_km,
            max_distance_km=tier.max_distance_km,
            fixed_price=tier.fixed_price
        )
        db.add(db_tier)

    db.commit()
    db.refresh(db_rule)
    return db_rule

@router.get("/", response_model=List[schemas.PricingRule])
def read_pricing_rules(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_session)
):
    """
    Lista todas as tabelas de preço cadastradas.
    Inclui automaticamente as faixas (tiers) aninhadas.
    """
    rules = db.query(models.PricingRule).offset(skip).limit(limit).all()
    return rules