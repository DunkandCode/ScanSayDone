"""Agregado del panel de una empresa.

Mismas fórmulas que `calcular_metricas_satisfaccion` del pipeline del área de datos
(docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py) y que la metodología
(docs/datos/metodologia/cuestionarios_nps_por_rubro.docx):

- NPS = % promotores (P1 9-10) − % detractores (P1 0-6), 1 decimal.
- CSAT y top box de P3/P4 = % de respuestas 4 o 5, 1 decimal.
- Medias con 2 decimales.

Función pura: recibe las filas ya leídas, no consulta la base.
"""

from collections import Counter, defaultdict
from collections.abc import Sequence
from datetime import date

from scansaydone.models import Encuesta
from scansaydone.schemas import AgregadoPanel, AtributoPanel, ComentariosPanel, DiaPanel, NotaCantidad

TIPOS_COMENTARIO = {
    "Felicitación": "felicitacion",
    "Reclamo": "reclamo",
    "Sugerencia / mixto": "sugerencia",
    "Sin comentario": "sin_comentario",
}


def _porcentaje(parte: int, total: int) -> float | None:
    return round(parte / total * 100, 1) if total else None


def _media(valores: Sequence[int]) -> float | None:
    return round(sum(valores) / len(valores), 2) if valores else None


def _atributo(etiqueta: str, valores: list[int]) -> AtributoPanel:
    return AtributoPanel(
        etiqueta=etiqueta,
        media=_media(valores),
        top_box=_porcentaje(sum(v >= 4 for v in valores), len(valores)),
    )


def calcular_agregado(encuestas: Sequence[Encuesta], p3_etiqueta: str, p4_etiqueta: str) -> AgregadoPanel:
    n = len(encuestas)
    p1 = [e.p1_nps for e in encuestas]
    p2 = [e.p2_csat for e in encuestas]
    categorias = Counter(e.categoria_nps for e in encuestas)
    promotores, detractores = categorias["Promotor"], categorias["Detractor"]
    tipos = Counter(e.tipo_comentario for e in encuestas)
    notas = Counter(p1)

    por_dia: dict[date, list[int]] = defaultdict(list)
    for e in encuestas:
        por_dia[e.fecha].append(e.p1_nps)

    return AgregadoPanel(
        respuestas=n,
        desde=min(por_dia) if por_dia else None,
        hasta=max(por_dia) if por_dia else None,
        # Igual que el pipeline: se resta y se redondea una sola vez.
        nps=round((promotores - detractores) / n * 100, 1) if n else None,
        promotores=promotores,
        pasivos=categorias["Pasivo"],
        detractores=detractores,
        notas_8_a_10=sum(nota >= 8 for nota in p1),
        media_p1=_media(p1),
        csat=_porcentaje(sum(v >= 4 for v in p2), n),
        media_p2=_media(p2),
        p3=_atributo(p3_etiqueta, [e.p3_atributo for e in encuestas]),
        p4=_atributo(p4_etiqueta, [e.p4_atributo for e in encuestas]),
        alertas=sum(e.alerta == "ALERTA" for e in encuestas),
        comentarios=ComentariosPanel(**{clave: tipos[tipo] for tipo, clave in TIPOS_COMENTARIO.items()}),
        distribucion_p1=[NotaCantidad(nota=nota, cantidad=notas[nota]) for nota in range(11)],
        serie_diaria=[
            DiaPanel(fecha=dia, respuestas=len(v), suma_p1=sum(v), media_p1=_media(v))
            for dia, v in sorted(por_dia.items())
        ],
    )
