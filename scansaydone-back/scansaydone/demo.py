"""Negocios de demostración: los 4 negocios simulados del dataset de 80 encuestas.

Sirven para probar el endpoint y para que el área de datos cargue las encuestas simuladas
(issue #16) usando los mismos `empresa_id`. No son parte de la migración: son datos de prueba.
"""

from sqlalchemy import select
from sqlalchemy.orm import Session

from scansaydone.models import Empresa

# (nombre_negocio, rubro_id) — nombres tal como aparecen en docs/datos/datasets/simulacion_80_encuestas.xlsx
EMPRESAS_DEMO = [
    ("Minimarket Don Lucho", 1),
    ("Café Rincón Andino", 2),
    ("Peluquería Estilo Sur", 3),
    ("Cosmos Accesorios (Instagram)", 4),
]


def asegurar_empresas_demo(session: Session) -> dict[str, int]:
    """Crea las empresas de demostración que falten y devuelve {nombre: empresa_id}.

    Es idempotente: busca cada una por `nombre_negocio` y solo crea las ausentes.
    No hace commit; lo hace quien llama.
    """
    ids: dict[str, int] = {}
    for nombre, rubro_id in EMPRESAS_DEMO:
        empresa = session.scalar(select(Empresa).where(Empresa.nombre_negocio == nombre))
        if empresa is None:
            empresa = Empresa(nombre_negocio=nombre, rubro_id=rubro_id)
            session.add(empresa)
            session.flush()
        ids[nombre] = empresa.empresa_id
    return ids
