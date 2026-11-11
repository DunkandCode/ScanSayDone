"""Conexión a la base de datos, creada de forma diferida en el primer uso."""

from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import NullPool

from scansaydone.config import obtener_url_db

SEGUNDOS_ESPERA_CONEXION = 5


@lru_cache(maxsize=1)
def obtener_engine() -> Engine:
    """Crea el engine la primera vez que se pide; `import main` nunca llega aquí."""
    url = obtener_url_db()
    argumentos = {}
    if url.startswith("postgresql"):
        # prepare_threshold=None: el pooler de transacciones de Supabase no admite sentencias
        # preparadas. connect_timeout: sin él, una base que no responde tarda minutos en fallar
        # (y la función de Vercel moriría por tiempo antes de poder devolver el 503).
        argumentos["connect_args"] = {
            "prepare_threshold": None,
            "connect_timeout": SEGUNDOS_ESPERA_CONEXION,
        }
    # NullPool: en serverless cada invocación abre y cierra su conexión.
    return create_engine(url, poolclass=NullPool, **argumentos)


def get_session() -> Iterator[Session]:
    """Dependencia de FastAPI: una sesión por petición."""
    with Session(obtener_engine()) as sesion:
        yield sesion
