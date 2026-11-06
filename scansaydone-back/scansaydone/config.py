"""Configuración del backend a partir de variables de entorno.

Nada de este módulo se conecta a la base de datos: las URLs solo se resuelven
cuando alguien las pide, así `import main` funciona sin variables (CI).
"""

import os
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from dotenv import load_dotenv

# Carga scansaydone-back/.env si existe (desarrollo local). No pisa variables ya definidas.
load_dotenv(Path(__file__).resolve().parent.parent / ".env")

ESQUEMA_DRIVER = "postgresql+psycopg"

# Parámetros de la URL que libpq/psycopg aceptan. Las URLs de la integración de
# Supabase pueden traer otros (p. ej. `supa=...`) que psycopg rechaza.
PARAMETROS_PERMITIDOS = frozenset(
    {"sslmode", "connect_timeout", "application_name", "options", "target_session_attrs"}
)

ORIGENES_POR_DEFECTO = ["http://localhost:3000", "https://scansaydone.vercel.app"]


class ConfiguracionError(RuntimeError):
    """Falta una variable de entorno necesaria para conectarse a la base de datos."""


def normalizar_url_db(url: str) -> str:
    """Convierte `postgres://` o `postgresql://` al driver psycopg 3 y limpia parámetros no soportados."""
    partes = urlsplit(url)
    if partes.scheme not in ("postgres", "postgresql"):
        return url
    consulta = [
        (clave, valor)
        for clave, valor in parse_qsl(partes.query, keep_blank_values=True)
        if clave in PARAMETROS_PERMITIDOS
    ]
    return urlunsplit((ESQUEMA_DRIVER, partes.netloc, partes.path, urlencode(consulta), partes.fragment))


def _primera_variable(*nombres: str) -> str | None:
    for nombre in nombres:
        valor = os.environ.get(nombre, "").strip()
        if valor:
            return valor
    return None


def obtener_url_db() -> str:
    """URL que usa la aplicación: `DATABASE_URL` tiene prioridad sobre `POSTGRES_URL`."""
    valor = _primera_variable("DATABASE_URL", "POSTGRES_URL")
    if valor is None:
        raise ConfiguracionError("Falta DATABASE_URL o POSTGRES_URL en el entorno.")
    return normalizar_url_db(valor)


def obtener_url_migraciones() -> str:
    """URL que usa Alembic: prefiere la conexión sin pooler."""
    valor = _primera_variable("POSTGRES_URL_NON_POOLING")
    if valor is not None:
        return normalizar_url_db(valor)
    return obtener_url_db()


def origenes_permitidos() -> list[str]:
    """Orígenes CORS desde `ALLOWED_ORIGINS` (separados por comas) o los valores por defecto."""
    crudo = os.environ.get("ALLOWED_ORIGINS", "").strip()
    if not crudo:
        return list(ORIGENES_POR_DEFECTO)
    return [origen.strip() for origen in crudo.split(",") if origen.strip()]


def regex_origenes() -> str | None:
    """Expresión regular opcional de orígenes permitidos (vistas previas de Vercel)."""
    return os.environ.get("ALLOWED_ORIGIN_REGEX", "").strip() or None
