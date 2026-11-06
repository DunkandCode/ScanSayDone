import logging
from datetime import datetime

import pytest
import sqlalchemy as sa
from fastapi.testclient import TestClient

from scansaydone import db, reglas
from scansaydone.db import get_session
from scansaydone.models import Encuesta
from scansaydone.routers.respuestas import reloj

RUTA = "/api/v1/respuestas"
DETAIL_503 = {"detail": "Servicio no disponible, intenta nuevamente."}

VALIDO = {
    "p1_nps": 5,
    "p2_csat": 3,
    "p3_atributo": 2,
    "p4_atributo": 2,
    "p5_comentario": "  El jugo estaba muy aguado y sin sabor.  ",
}


@pytest.fixture
def reloj_fijo(client):
    """Fija «ahora» en viernes 06-11-2026 09:15, hora de Chile."""
    client.app.dependency_overrides[reloj] = lambda: datetime(2026, 11, 6, 9, 15, tzinfo=reglas.ZONA_HORARIA)


def test_crea_respuesta_con_derivadas(client, sesion, empresa_cafe, reloj_fijo):
    r = client.post(RUTA, json={**VALIDO, "empresa_id": empresa_cafe.empresa_id})

    assert r.status_code == 201
    assert set(r.json()) == {"encuesta_id"}
    e = sesion.get(Encuesta, r.json()["encuesta_id"])
    assert (e.categoria_nps, e.alerta, e.tipo_comentario) == ("Detractor", "ALERTA", "Reclamo")
    assert e.p5_comentario == "El jugo estaba muy aguado y sin sabor."
    assert (e.p1_nps, e.p2_csat, e.p3_atributo, e.p4_atributo) == (5, 3, 2, 2)
    assert (
        str(e.fecha),
        str(e.hora),
        e.anio,
        e.mes_nombre,
        e.dia_semana,
        e.bloque_horario,
        e.semana_anio,
    ) == ("2026-11-06", "09:15:00", 2026, "Noviembre", "Viernes", "Mañana", 45)


def test_promotor_satisfecho_no_genera_alerta(client, sesion, empresa_cafe, reloj_fijo):
    cuerpo = {**VALIDO, "p1_nps": 10, "p2_csat": 5, "p5_comentario": "Los mejores sándwiches, muy recomendados."}
    r = client.post(RUTA, json={**cuerpo, "empresa_id": empresa_cafe.empresa_id})

    e = sesion.get(Encuesta, r.json()["encuesta_id"])
    assert (e.categoria_nps, e.alerta, e.tipo_comentario) == ("Promotor", "", "Felicitación")


def test_comentario_solo_espacios_queda_nulo(client, sesion, empresa_cafe, reloj_fijo):
    r = client.post(RUTA, json={**VALIDO, "empresa_id": empresa_cafe.empresa_id, "p5_comentario": " \n\t "})

    assert r.status_code == 201
    e = sesion.get(Encuesta, r.json()["encuesta_id"])
    assert e.p5_comentario is None
    assert e.tipo_comentario == "Sin comentario"


def test_comentario_300_caracteres_con_tildes_y_emoji_se_acepta(client, empresa_cafe, reloj_fijo):
    texto = "ñá😀" * 100  # 300 caracteres
    assert len(texto) == 300
    r = client.post(RUTA, json={**VALIDO, "empresa_id": empresa_cafe.empresa_id, "p5_comentario": f"  {texto}  "})
    assert r.status_code == 201


def test_comentario_301_caracteres_se_rechaza(client, empresa_cafe):
    r = client.post(RUTA, json={**VALIDO, "empresa_id": empresa_cafe.empresa_id, "p5_comentario": "a" * 301})
    assert r.status_code == 422


@pytest.mark.parametrize(
    "cambio",
    [
        {"p1_nps": 11},
        {"p1_nps": -1},
        {"p2_csat": 0},
        {"p4_atributo": 6},
        {"p1_nps": "9"},
        {"p1_nps": 9.0},
        {"p1_nps": True},
        {"empresa_id": 0},
        {"empresa_id": 2147483648},  # mayor que el máximo de INTEGER
        {"p5_comentario": "hola\u0000"},  # PostgreSQL no admite NUL en texto: sería un 500 al insertar
        {"extra": 1},
    ],
)
def test_payload_invalido_da_422(client, empresa_cafe, cambio):
    r = client.post(RUTA, json={**VALIDO, "empresa_id": empresa_cafe.empresa_id, **cambio})
    assert r.status_code == 422


def test_sin_comentario_es_valido(client, empresa_cafe, reloj_fijo):
    cuerpo = {k: v for k, v in VALIDO.items() if k != "p5_comentario"}
    r = client.post(RUTA, json={**cuerpo, "empresa_id": empresa_cafe.empresa_id})
    assert r.status_code == 201


def test_empresa_inexistente_da_404(client, reloj_fijo):
    r = client.post(RUTA, json={**VALIDO, "empresa_id": 999})
    assert r.status_code == 404
    assert r.json() == {"detail": "Empresa no encontrada."}


def test_bd_caida_da_503_y_deja_rastro_en_el_log(client, reloj_fijo, caplog):
    def sesion_caida():
        raise sa.exc.OperationalError("SELECT 1", None, Exception("conexión rechazada"))
        yield  # pragma: no cover  (convierte la función en generador, como get_session)

    client.app.dependency_overrides[get_session] = sesion_caida

    with caplog.at_level(logging.ERROR, logger="scansaydone"):
        r = client.post(RUTA, json={**VALIDO, "empresa_id": 1})

    assert r.status_code == 503
    assert r.json() == DETAIL_503
    assert "conexión rechazada" in caplog.text  # el motivo real queda en los logs, no en la respuesta


def test_sin_variables_de_entorno_da_503(monkeypatch):
    import main

    for variable in ("DATABASE_URL", "POSTGRES_URL", "POSTGRES_URL_NON_POOLING"):
        monkeypatch.delenv(variable, raising=False)
    db.obtener_engine.cache_clear()
    try:
        r = TestClient(main.app).post(RUTA, json={**VALIDO, "empresa_id": 1})
    finally:
        db.obtener_engine.cache_clear()

    assert r.status_code == 503
    assert r.json() == DETAIL_503
