"""
ScanSayDone API - Backend FastAPI
Equipo: Dunk & Code XD | Talento Digital 2026
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from scansaydone import config
from scansaydone.routers import analytics, general, qr

app = FastAPI(
    title="ScanSayDone API",
    description="API para generación de encuestas QR y cálculo de NPS en tiempo real para MiPymes.",
    version=config.VERSION,
)

# CORS: solo los orígenes de ALLOWED_ORIGINS (por defecto localhost:3000 y el dominio de Vercel).
# En producción el front y la API comparten dominio; esto cubre el desarrollo local.
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.origenes_permitidos(),
    allow_origin_regex=config.regex_origenes(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(general.router)
app.include_router(qr.router)
app.include_router(analytics.router)
