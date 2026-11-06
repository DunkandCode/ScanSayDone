"""Reglas de negocio derivadas de una respuesta (ERD: fact_encuestas).

Son funciones puras, sin pandas. Las reglas replican las del pipeline del área de
datos (docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py) y del ERD.
"""

from dataclasses import dataclass
from datetime import date, datetime, time
from zoneinfo import ZoneInfo

ZONA_HORARIA = ZoneInfo("America/Santiago")

MESES = (
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
)
DIAS = ("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo")


@dataclass(frozen=True)
class VariablesTemporales:
    fecha: date
    hora: time
    anio: int
    mes_nombre: str
    semana_anio: int
    dia_semana: str
    bloque_horario: str


def categoria_nps(p1: int) -> str:
    """Promotor (9-10), Pasivo (7-8) o Detractor (0-6)."""
    if p1 >= 9:
        return "Promotor"
    if p1 >= 7:
        return "Pasivo"
    return "Detractor"


def alerta(p1: int, p2: int) -> str:
    """`"ALERTA"` si P1 <= 6 o P2 <= 2; en caso contrario cadena vacía."""
    return "ALERTA" if p1 <= 6 or p2 <= 2 else ""


def bloque_horario(hora: int) -> str:
    """Mañana 06:00-11:59, Tarde 12:00-19:59, Noche 20:00-05:59."""
    if 6 <= hora < 12:
        return "Mañana"
    if 12 <= hora < 20:
        return "Tarde"
    return "Noche"


def variables_temporales(momento: datetime) -> VariablesTemporales:
    """Deriva fecha, hora y variables temporales en hora de Chile.

    `momento` debe traer zona horaria: se convierte a `America/Santiago` y la hora se
    trunca a segundos.
    """
    local = momento.astimezone(ZONA_HORARIA)
    return VariablesTemporales(
        fecha=local.date(),
        hora=local.time().replace(microsecond=0),
        anio=local.year,
        mes_nombre=MESES[local.month - 1],
        semana_anio=local.isocalendar()[1],
        dia_semana=DIAS[local.weekday()],
        bloque_horario=bloque_horario(local.hour),
    )


def ahora_chile() -> datetime:
    """Instante actual con la zona horaria de Chile."""
    return datetime.now(ZONA_HORARIA)
