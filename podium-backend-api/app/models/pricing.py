from sqlmodel import SQLModel, Field, Relationship # type: ignore[attr-defined]
from datetime import datetime, timezone

class PricingRule(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}

    id: int = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    category: str = Field(default="B2B")
    is_tiered: bool = Field(default=True)
    price_per_km_after_tiers: float = Field(default=2.50)
    is_active: bool = Field(default=True)
    is_default: bool = Field(default=False)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    tiers: list["PricingTier"] = Relationship(back_populates="rule")

class PricingTier(SQLModel, table=True):
    __table_args__ = {"extend_existing": True}

    id: int = Field(default=None, primary_key=True)
    pricing_rule_id: int = Field(foreign_key="pricingrule.id")
    min_distance_km: float = Field()
    max_distance_km: float = Field()

    rule: PricingRule = Relationship(back_populates="tiers")