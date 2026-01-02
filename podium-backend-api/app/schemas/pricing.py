from pydantic import BaseModel
from typing import List
from datetime import datetime

# --- Tiers (Faixas) ---
class PricingTierBase(BaseModel):
    min_distance_km: float
    max_distance_km: float
    fixed_price: float

class PricingTierCreate(PricingTierBase):
    pass

class PricingTier(PricingTierBase):
    id: int
    pricing_rule_id: int

    class Config:
        from_attributes = True

# --- Rules (Regras) ---
class PricingRuleBase(BaseModel):
    name: str
    category: str = "B2B"
    is_tiered: bool = True
    price_per_km_after_tiers: float = 2.50
    is_active: bool = True
    is_default: bool = False

class PricingRuleCreate(PricingRuleBase):
    # Recebe uma lista de faixas na criação
    tiers: List[PricingTierCreate] = []

class PricingRule(PricingRuleBase):
    id: int
    created_at: datetime
    tiers: List[PricingTier] = []

    class Config:
        from_attributes = True