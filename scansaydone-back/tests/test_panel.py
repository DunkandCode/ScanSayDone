"""Agregado del panel y GET /api/v1/empresas/{empresa_id}/panel."""

from datetime import date
from pathlib import Path

import pytest
from sqlalchemy import select

from scansaydone.models import Empresa, Encuesta
from scansaydone.panel import calcular_agregado
from scansaydone.simulacion import cargar_simulacion, leer_simulacion

EXCEL = Path(__file__).resolve().parents[2] / "docs" / "datos" / "datasets" / "simulacion_80_encuestas.xlsx"


@pytest.fixture
def cafe_con_simulacion(sesion):
    """Carga las 80 encuestas simuladas y devuelve la empresa «Café Rincón Andino»."""
    cargar_simulacion(sesion, leer_simulacion(EXCEL))
    sesion.commit()
    return sesion.scalar(select(Empresa).where(Empresa.nombre_negocio == "Café Rincón Andino"))


def _encuestas(sesion, empresa_id):
    return list(sesion.scalars(select(Encuesta).where(Encuesta.empresa_id == empresa_id)))


# --- Cálculo del agregado ------------------------------------------------------------------


def test_calcular_agregado_con_las_20_respuestas_del_cafe(sesion, cafe_con_simulacion):
    agregado = calcular_agregado(
        _encuestas(sesion, cafe_con_simulacion.empresa_id), "Calidad del producto", "Tiempo de servicio"
    )

    assert agregado.respuestas == 20
    assert (agregado.desde, agregado.hasta) == (date(2026, 10, 19), date(2026, 10, 31))
    assert agregado.nps == 25.0
    assert (agregado.promotores, agregado.pasivos, agregado.detractores) == (10, 5, 5)
    assert agregado.notas_8_a_10 == 14
    assert agregado.media_p1 == 8.15
    assert agregado.csat == 70.0
    assert agregado.media_p2 == 4.15
    assert agregado.p3.model_dump() == {"etiqueta": "Calidad del producto", "media": 3.75, "top_box": 70.0}
    assert agregado.p4.model_dump() == {"etiqueta": "Tiempo de servicio", "media": 4.1, "top_box": 85.0}
    assert agregado.alertas == 5
    assert agregado.comentarios.model_dump() == {
        "felicitacion": 9, "reclamo": 3, "sugerencia": 3, "sin_comentario": 5,
    }


def test_calcular_agregado_distribucion_tiene_las_11_notas(sesion, cafe_con_simulacion):
    agregado = calcular_agregado(_encuestas(sesion, cafe_con_simulacion.empresa_id), "a", "b")

    assert [fila.nota for fila in agregado.distribucion_p1] == list(range(11))
    assert sum(fila.cantidad for fila in agregado.distribucion_p1) == 20
    cantidades = {fila.nota: fila.cantidad for fila in agregado.distribucion_p1}
    assert (cantidades[0], cantidades[5], cantidades[10]) == (0, 3, 7)


def test_calcular_agregado_serie_diaria_solo_dias_con_respuestas_en_orden(sesion, cafe_con_simulacion):
    encuestas = _encuestas(sesion, cafe_con_simulacion.empresa_id)
    serie = calcular_agregado(encuestas, "a", "b").serie_diaria

    fechas = [dia.fecha for dia in serie]
    assert fechas == sorted(set(e.fecha for e in encuestas))
    assert sum(dia.respuestas for dia in serie) == 20
    assert sum(dia.suma_p1 for dia in serie) == sum(e.p1_nps for e in encuestas)
    assert all(dia.media_p1 == round(dia.suma_p1 / dia.respuestas, 2) for dia in serie)


def test_calcular_agregado_sin_respuestas_usa_null_y_listas_vacias():
    agregado = calcular_agregado([], "Calidad del producto", "Tiempo de servicio")

    assert agregado.respuestas == 0
    assert agregado.desde is None and agregado.hasta is None
    assert agregado.nps is None
    assert (agregado.promotores, agregado.pasivos, agregado.detractores, agregado.notas_8_a_10) == (0, 0, 0, 0)
    assert agregado.media_p1 is None and agregado.csat is None and agregado.media_p2 is None
    assert agregado.p3.model_dump() == {"etiqueta": "Calidad del producto", "media": None, "top_box": None}
    assert agregado.alertas == 0
    assert agregado.comentarios.model_dump() == {
        "felicitacion": 0, "reclamo": 0, "sugerencia": 0, "sin_comentario": 0,
    }
    assert [(f.nota, f.cantidad) for f in agregado.distribucion_p1] == [(n, 0) for n in range(11)]
    assert agregado.serie_diaria == []


# --- Endpoint ------------------------------------------------------------------------------


def test_panel_devuelve_empresa_agregado_y_respuestas(client, cafe_con_simulacion):
    respuesta = client.get(f"/api/v1/empresas/{cafe_con_simulacion.empresa_id}/panel")

    assert respuesta.status_code == 200
    cuerpo = respuesta.json()
    assert cuerpo["empresa"] == {
        "empresa_id": cafe_con_simulacion.empresa_id,
        "nombre_negocio": "Café Rincón Andino",
        "rubro": "Cafetería / restaurante",
    }
    assert cuerpo["agregado"]["nps"] == 25.0
    assert cuerpo["agregado"]["desde"] == "2026-10-19"
    assert cuerpo["agregado"]["p3"]["etiqueta"] == "Calidad del producto"
    assert len(cuerpo["respuestas"]) == 20


def test_panel_respuestas_traen_el_detalle_ordenado_del_mas_reciente(client, cafe_con_simulacion):
    respuestas = client.get(f"/api/v1/empresas/{cafe_con_simulacion.empresa_id}/panel").json()["respuestas"]

    momentos = [(r["fecha"], r["hora"]) for r in respuestas]
    assert momentos == sorted(momentos, reverse=True)
    assert set(respuestas[0]) == {
        "encuesta_id", "fecha", "hora", "creado_en", "p1_nps", "p2_csat", "p3_atributo",
        "p4_atributo", "p5_comentario", "categoria_nps", "alerta", "tipo_comentario", "bloque_horario",
    }
    assert {type(r["alerta"]) for r in respuestas} == {bool}
    assert sum(r["alerta"] for r in respuestas) == 5


def test_panel_de_empresa_sin_respuestas(client, empresa_cafe):
    cuerpo = client.get(f"/api/v1/empresas/{empresa_cafe.empresa_id}/panel").json()

    assert cuerpo["agregado"]["respuestas"] == 0
    assert cuerpo["agregado"]["nps"] is None
    assert cuerpo["respuestas"] == []


def test_panel_de_empresa_inexistente_responde_404(client, empresa_cafe):
    respuesta = client.get("/api/v1/empresas/999/panel")

    assert respuesta.status_code == 404
    assert respuesta.json() == {"detail": "Empresa no encontrada."}


def test_panel_con_id_invalido_responde_422(client):
    assert client.get("/api/v1/empresas/0/panel").status_code == 422
