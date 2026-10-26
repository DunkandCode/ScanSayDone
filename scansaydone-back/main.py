"""
ScanSayDone API - Backend FastAPI
Equipo: Dunk & Code XD | Talento Digital 2026
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
from typing import List, Optional
import io
import qrcode

app = FastAPI(
    title="ScanSayDone API",
    description="API para generación de encuestas QR y cálculo de NPS en tiempo real para MiPymes.",
    version="0.1.0"
)

# Configuración CORS para permitir conexiones desde Next.js (Localhost y Vercel)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción se especifica el dominio de Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modelos Pydantic
class NPSCalculationRequest(BaseModel):
    ratings: List[int] = Field(..., description="Lista de calificaciones del 0 al 10")

class NPSCalculationResponse(BaseModel):
    total_responses: int
    promoters: int
    passives: int
    detractors: int
    nps_score: float
    category: str

@app.get("/", tags=["General"])
def root():
    return {
        "app": "ScanSayDone API",
        "team": "Dunk & Code XD",
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health", tags=["General"])
def health_check():
    return {"status": "ok", "version": "0.1.0"}

@app.get("/api/v1/qr/generate", tags=["QR"])
def generate_qr(
    target_url: str = Query(..., description="URL de destino a codificar en el QR"),
    box_size: int = Query(10, ge=1, le=50, description="Tamaño de los bloques del QR"),
    border: int = Query(4, ge=1, le=10, description="Grosor del borde blanco")
):
    """
    Genera una imagen PNG con el código QR para el local comercial.
    """
    try:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=box_size,
            border=border,
        )
        qr.add_data(target_url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format="PNG")
        buffer.seek(0)

        return Response(content=buffer.getvalue(), media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generando código QR: {str(e)}")

@app.post("/api/v1/nps/calculate", response_model=NPSCalculationResponse, tags=["Analytics"])
def calculate_nps(data: NPSCalculationRequest):
    """
    Calcula el Net Promoter Score (NPS) a partir de una lista de notas del 0 al 10.
    Fórmula: % Promotores (9-10) - % Detractores (0-6).
    """
    if not data.ratings:
        raise HTTPException(status_code=400, detail="La lista de calificaciones no puede estar vacía.")

    for r in data.ratings:
        if r < 0 or r > 10:
            raise HTTPException(status_code=400, detail=f"Calificación inválida: {r}. Debe ser entre 0 y 10.")

    total = len(data.ratings)
    promoters = sum(1 for r in data.ratings if r >= 9)
    passives = sum(1 for r in data.ratings if 7 <= r <= 8)
    detractors = sum(1 for r in data.ratings if r <= 6)

    nps = ((promoters - detractors) / total) * 100

    if nps >= 50:
        category = "Excelente"
    elif nps >= 0:
        category = "Bueno"
    else:
        category = "Crítico / Necesita atención"

    return NPSCalculationResponse(
        total_responses=total,
        promoters=promoters,
        passives=passives,
        detractors=detractors,
        nps_score=round(nps, 2),
        category=category
    )
