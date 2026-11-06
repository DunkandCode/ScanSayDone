"""
ScanSayDone API - Backend FastAPI
Equipo: Dunk & Code XD | Talento Digital 2026
"""

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError

from scansaydone import config
from scansaydone.config import ConfiguracionError
from scansaydone.routers import analytics, empresas, general, qr, respuestas

logger = logging.getLogger("scansaydone")

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


async def servicio_no_disponible(request: Request, exc: Exception) -> JSONResponse:
    """La base de datos no responde o falta configuración: 503 sin detalles internos.

    El motivo real queda en el log (sin la URL de conexión ni credenciales).
    """
    logger.error("Servicio no disponible (%s): %s", type(exc).__name__, getattr(exc, "orig", exc))
    return JSONResponse(
        status_code=503,
        content={"detail": "Servicio no disponible, intenta nuevamente."},
    )


app.add_exception_handler(OperationalError, servicio_no_disponible)
app.add_exception_handler(ConfiguracionError, servicio_no_disponible)

app.include_router(general.router)
app.include_router(qr.router)
app.include_router(analytics.router)
app.include_router(respuestas.router)
app.include_router(empresas.router)
