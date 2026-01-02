from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator


class LeadBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str


class LeadCreate(LeadBase):
    """Schema para criação de um novo lead via POST"""

    @field_validator("full_name")
    @classmethod
    def full_name_not_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Nome completo não pode estar vazio")
        return v.strip()

    @field_validator("phone")
    @classmethod
    def phone_format(cls, v: str) -> str:
        # Aceita formato (XX) XXXXX-XXXX ou apenas dígitos
        cleaned = "".join(c for c in v if c.isdigit())
        if len(cleaned) < 10 or len(cleaned) > 11:
            raise ValueError("Telefone deve conter entre 10 e 11 dígitos")
        return v.strip()


class LeadRead(LeadBase):
    """Schema para leitura de um lead (resposta da API)"""

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
