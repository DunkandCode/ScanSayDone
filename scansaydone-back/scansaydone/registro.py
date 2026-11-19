"""Construcción de una fila de `fact_encuestas` a partir de las respuestas y el momento.

La usan el endpoint POST /api/v1/respuestas y la carga del dataset simulado (#16), para que
ambos calculen las variables derivadas exactamente igual.
"""

from datetime import datetime

from scansaydone.models import Encuesta
from scansaydone.nlp import clasificar_comentario
from scansaydone.reglas import alerta, categoria_nps, variables_temporales
from scansaydone.schemas import RespuestasEncuesta


def construir_encuesta(
    empresa_id: int, respuestas: RespuestasEncuesta, momento: datetime
) -> Encuesta:
    """Devuelve la `Encuesta` (sin guardar) con categoría, alerta, tipo y variables temporales.

    `momento` debe traer zona horaria; las variables temporales se calculan en hora de Chile.
    """
    tiempo = variables_temporales(momento)
    return Encuesta(
        empresa_id=empresa_id,
        fecha=tiempo.fecha,
        hora=tiempo.hora,
        p1_nps=respuestas.p1_nps,
        p2_csat=respuestas.p2_csat,
        p3_atributo=respuestas.p3_atributo,
        p4_atributo=respuestas.p4_atributo,
        p5_comentario=respuestas.p5_comentario,
        categoria_nps=categoria_nps(respuestas.p1_nps),
        alerta=alerta(respuestas.p1_nps, respuestas.p2_csat),
        tipo_comentario=clasificar_comentario(respuestas.p5_comentario),
        anio=tiempo.anio,
        mes_nombre=tiempo.mes_nombre,
        semana_anio=tiempo.semana_anio,
        dia_semana=tiempo.dia_semana,
        bloque_horario=tiempo.bloque_horario,
    )
