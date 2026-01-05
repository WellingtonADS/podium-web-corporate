import logging
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.database import get_session
from app.models.domain import Lead
from app.schemas.leads import LeadCreate, LeadRead

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("/leads", response_model=LeadRead, status_code=status.HTTP_201_CREATED)
def create_lead(
    lead: LeadCreate,
    session: Session = Depends(get_session),
) -> Lead:
    """
    Cria um novo lead a partir de uma solicitação do site.

    **Campos esperados:**
    - full_name: Nome completo do interessado
    - email: Email válido e único
    - phone: Telefone em qualquer formato (será validado)

    **Retorna:** Lead criado com id e created_at
    """

    # Verificar se email já existe
    statement = select(Lead).where(Lead.email == lead.email)
    existing_lead = session.exec(statement).first()

    if existing_lead:
        logger.warning(f"Lead com email {lead.email} já existe")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Este email já foi registrado anteriormente",
        )

    # Criar novo lead
    db_lead = Lead(
        full_name=lead.full_name,
        email=lead.email,
        phone=lead.phone,
        created_at=datetime.now(timezone.utc),
    )

    session.add(db_lead)
    session.commit()
    session.refresh(db_lead)

    logger.info(f"Lead criado: {db_lead.id} - {db_lead.email}")

    return db_lead
