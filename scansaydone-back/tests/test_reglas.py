from datetime import date, datetime, time, timezone

import pytest

from scansaydone import reglas


@pytest.mark.parametrize(
    "p1,esperado",
    [(0, "Detractor"), (6, "Detractor"), (7, "Pasivo"), (8, "Pasivo"), (9, "Promotor"), (10, "Promotor")],
)
def test_categoria_nps(p1, esperado):
    assert reglas.categoria_nps(p1) == esperado


@pytest.mark.parametrize(
    "p1,p2,esperado",
    [(6, 5, "ALERTA"), (7, 2, "ALERTA"), (7, 3, ""), (10, 1, "ALERTA"), (9, 5, "")],
)
def test_alerta(p1, p2, esperado):
    assert reglas.alerta(p1, p2) == esperado


@pytest.mark.parametrize(
    "hora,esperado",
    [(5, "Noche"), (6, "Mañana"), (11, "Mañana"), (12, "Tarde"), (19, "Tarde"), (20, "Noche"), (0, "Noche")],
)
def test_bloque_horario(hora, esperado):
    assert reglas.bloque_horario(hora) == esperado


def test_variables_temporales_convierte_utc_a_chile_cerca_de_medianoche():
    # 06-11-2026 02:30 UTC = 05-11-2026 23:30 en Chile (UTC-3, horario de verano)
    v = reglas.variables_temporales(datetime(2026, 11, 6, 2, 30, 15, 999, tzinfo=timezone.utc))
    assert v.fecha == date(2026, 11, 5)
    assert v.hora == time(23, 30, 15)
    assert (v.anio, v.mes_nombre, v.dia_semana, v.bloque_horario) == (2026, "Noviembre", "Jueves", "Noche")
    assert v.semana_anio == 45


def test_variables_temporales_dia_y_mes_con_tilde():
    v = reglas.variables_temporales(datetime(2026, 9, 9, 13, 0, tzinfo=reglas.ZONA_HORARIA))
    assert (v.mes_nombre, v.dia_semana, v.bloque_horario) == ("Septiembre", "Miércoles", "Tarde")


def test_ahora_chile_tiene_zona():
    assert reglas.ahora_chile().tzinfo is not None
