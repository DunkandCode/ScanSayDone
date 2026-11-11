from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from scansaydone.metricas import calcular_nps

router = APIRouter()


class NPSCalculationRequest(BaseModel):
    ratings: list[int] = Field(..., description="Lista de calificaciones del 0 al 10")


class NPSCalculationResponse(BaseModel):
    total_responses: int
    promoters: int
    passives: int
    detractors: int
    nps_score: float
    category: str


@router.post("/api/v1/nps/calculate", response_model=NPSCalculationResponse, tags=["Analytics"])
def calculate_nps(data: NPSCalculationRequest):
    """
    Calcula el Net Promoter Score (NPS) a partir de una lista de notas del 0 al 10.
    Fórmula: % Promotores (9-10) - % Detractores (0-6).
    """
    try:
        return NPSCalculationResponse(**calcular_nps(data.ratings))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
