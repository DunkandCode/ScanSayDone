"""Carga del dataset simulado de 80 encuestas (issue #16)."""

import runpy
from collections import Counter
from datetime import date, datetime, time
from pathlib import Path

import openpyxl
import pytest
import sqlalchemy as sa
from alembic import command
from alembic.config import Config
from sqlalchemy import func, select

from scansaydone import db
from scansaydone.models import Empresa, Encuesta
from scansaydone.reglas import ZONA_HORARIA
from scansaydone.simulacion import (
    ErrorSimulacion,
    cargar_simulacion,
    leer_simulacion,
)

RAIZ_BACKEND = Path(__file__).resolve().parent.parent
EXCEL = RAIZ_BACKEND.parent / "docs" / "datos" / "datasets" / "simulacion_80_encuestas.xlsx"

ENCABEZADO = (
    "ID", "Fecha", "Hora", "Rubro", "Negocio (simulado)",
    "P1. Probabilidad de recomendar (0-10)", "Categoría NPS", "P2. Satisfacción global (1-5)",
    "P3. Atributo 1 (1-5)", "Atributo P3", "P4. Atributo 2 (1-5)", "Atributo P4",
    "P5. Comentario (opcional)", "Tipo de comentario", "Alerta",
)
FILA_VALIDA = (
    1, datetime(2026, 10, 19), time(10, 15), "Cafetería / restaurante", "Café Rincón Andino",
    9, "Promotor", 5, 4, "Calidad del producto", 4, "Tiempo de servicio",
    "Los mejores sándwiches de la zona.", "Felicitación", "",
)


def escribir_excel(ruta: Path, *filas: tuple) -> Path:
    """Excel mínimo con la hoja «Datos_encuesta» y el encabezado del dataset real."""
    libro = openpyxl.Workbook()
    hoja = libro.active
    hoja.title = "Datos_encuesta"
    hoja.append(ENCABEZADO)
    for fila in filas:
        hoja.append(fila)
    libro.save(ruta)
    return ruta


def con(fila: tuple, **cambios) -> tuple:
    """Copia de `fila` con columnas reemplazadas por nombre corto."""
    posiciones = {"negocio": 4, "rubro": 3, "p1": 5, "atributo_p3": 9, "p5": 12, "hora": 2}
    valores = list(fila)
    for nombre, valor in cambios.items():
        valores[posiciones[nombre]] = valor
    return tuple(valores)


# --- Lectura -------------------------------------------------------------------------------


def test_leer_simulacion_devuelve_las_80_filas_del_dataset_real():
    filas = leer_simulacion(EXCEL)

    assert len(filas) == 80
    assert Counter(f.negocio for f in filas) == {
        "Minimarket Don Lucho": 20,
        "Café Rincón Andino": 20,
        "Peluquería Estilo Sur": 20,
        "Cosmos Accesorios (Instagram)": 20,
    }


def test_leer_simulacion_interpreta_fecha_y_hora_en_hora_de_chile():
    primera = leer_simulacion(EXCEL)[0]

    assert primera.id_origen == 1
    assert primera.negocio == "Café Rincón Andino"
    assert primera.momento == datetime(2026, 10, 19, 10, 15, tzinfo=ZONA_HORARIA)
    assert primera.respuesta.p1_nps == 9
    assert primera.respuesta.p5_comentario == "Los mejores sándwiches de la zona, muy recomendados."


def test_leer_simulacion_rechaza_negocio_con_rubro_distinto_al_de_la_demo(tmp_path):
    ruta = escribir_excel(tmp_path / "x.xlsx", con(FILA_VALIDA, rubro="Peluquería / centro de estética"))

    with pytest.raises(ErrorSimulacion, match="ID 1"):
        leer_simulacion(ruta)


def test_leer_simulacion_rechaza_negocio_desconocido(tmp_path):
    ruta = escribir_excel(tmp_path / "x.xlsx", con(FILA_VALIDA, negocio="Botillería Inventada"))

    with pytest.raises(ErrorSimulacion, match="Botillería Inventada"):
        leer_simulacion(ruta)


def test_leer_simulacion_rechaza_etiqueta_de_atributo_distinta_al_catalogo(tmp_path):
    ruta = escribir_excel(tmp_path / "x.xlsx", con(FILA_VALIDA, atributo_p3="Ambiente"))

    with pytest.raises(ErrorSimulacion, match="ID 1"):
        leer_simulacion(ruta)


def test_leer_simulacion_valida_las_respuestas_igual_que_la_api(tmp_path):
    ruta = escribir_excel(tmp_path / "x.xlsx", con(FILA_VALIDA, p1=11))

    with pytest.raises(ErrorSimulacion, match="ID 1"):
        leer_simulacion(ruta)


def test_leer_simulacion_trata_el_comentario_vacio_como_nulo(tmp_path):
    ruta = escribir_excel(tmp_path / "x.xlsx", con(FILA_VALIDA, p5="   "))

    assert leer_simulacion(ruta)[0].respuesta.p5_comentario is None


# --- Carga ---------------------------------------------------------------------------------


def test_cargar_simulacion_inserta_las_80_encuestas_con_sus_derivados(sesion):
    resumen = cargar_simulacion(sesion, leer_simulacion(EXCEL))
    sesion.commit()

    assert (resumen.insertadas, resumen.omitidas) == (80, 0)
    encuestas = sesion.scalars(select(Encuesta)).all()
    assert Counter(e.categoria_nps for e in encuestas) == {
        "Promotor": 42, "Pasivo": 17, "Detractor": 21,
    }
    assert sum(e.alerta == "ALERTA" for e in encuestas) == 21
    assert Counter(e.bloque_horario for e in encuestas) == {"Tarde": 63, "Mañana": 15, "Noche": 2}
    assert min(e.fecha for e in encuestas) == date(2026, 10, 19)
    assert max(e.fecha for e in encuestas) == date(2026, 10, 31)


def test_cargar_simulacion_usa_el_momento_de_la_encuesta_como_creado_en(sesion):
    cargar_simulacion(sesion, leer_simulacion(EXCEL)[:1])
    sesion.commit()

    encuesta = sesion.scalar(select(Encuesta))
    assert (encuesta.fecha, encuesta.hora) == (date(2026, 10, 19), time(10, 15))
    # SQLite no guarda la zona horaria: se compara la hora local de Chile.
    assert encuesta.creado_en.replace(tzinfo=None) == datetime(2026, 10, 19, 10, 15)
    assert (encuesta.anio, encuesta.mes_nombre, encuesta.dia_semana) == (2026, "Octubre", "Lunes")


def test_cargar_simulacion_crea_las_empresas_demo_y_asigna_cada_encuesta_a_la_suya(sesion):
    cargar_simulacion(sesion, leer_simulacion(EXCEL))
    sesion.commit()

    por_negocio = dict(
        sesion.execute(
            select(Empresa.nombre_negocio, func.count(Encuesta.encuesta_id))
            .join(Encuesta, Encuesta.empresa_id == Empresa.empresa_id)
            .group_by(Empresa.nombre_negocio)
        ).all()
    )
    assert por_negocio == {
        "Minimarket Don Lucho": 20,
        "Café Rincón Andino": 20,
        "Peluquería Estilo Sur": 20,
        "Cosmos Accesorios (Instagram)": 20,
    }


def test_cargar_simulacion_es_idempotente(sesion):
    filas = leer_simulacion(EXCEL)
    cargar_simulacion(sesion, filas)
    sesion.commit()

    resumen = cargar_simulacion(sesion, filas)
    sesion.commit()

    assert (resumen.insertadas, resumen.omitidas) == (0, 80)
    assert sesion.scalar(select(func.count()).select_from(Encuesta)) == 80


def test_cargar_simulacion_no_toca_respuestas_reales_de_la_misma_empresa(sesion, empresa_cafe):
    momento = datetime(2026, 11, 2, 18, 4, tzinfo=ZONA_HORARIA)
    real = Encuesta(
        empresa_id=empresa_cafe.empresa_id, fecha=momento.date(), hora=momento.time(),
        p1_nps=10, p2_csat=5, p3_atributo=5, p4_atributo=5, p5_comentario=None,
        categoria_nps="Promotor", alerta="", tipo_comentario="Sin comentario", anio=2026,
        mes_nombre="Noviembre", semana_anio=45, dia_semana="Lunes", bloque_horario="Tarde",
    )
    sesion.add(real)
    sesion.commit()

    resumen = cargar_simulacion(sesion, leer_simulacion(EXCEL))
    sesion.commit()

    assert resumen.insertadas == 80
    assert sesion.scalar(select(func.count()).select_from(Encuesta)) == 81


# --- Script --------------------------------------------------------------------------------


def _bd_migrada(tmp_path, monkeypatch) -> str:
    url = f"sqlite:///{tmp_path / 'simulacion.db'}"
    monkeypatch.setenv("POSTGRES_URL_NON_POOLING", url)
    command.upgrade(Config(str(RAIZ_BACKEND / "alembic.ini")), "head")
    monkeypatch.setenv("DATABASE_URL", url)
    db.obtener_engine.cache_clear()
    return url


def _contar_encuestas(url: str) -> int:
    engine = sa.create_engine(url)
    with engine.connect() as conexion:
        total = conexion.execute(sa.text("select count(*) from fact_encuestas")).scalar_one()
    engine.dispose()
    return total


def _ejecutar_script(monkeypatch, *argumentos: str) -> None:
    monkeypatch.setattr("sys.argv", ["cargar_simulacion.py", *argumentos])
    try:
        runpy.run_path(str(RAIZ_BACKEND / "scripts" / "cargar_simulacion.py"), run_name="__main__")
    finally:
        db.obtener_engine.cache_clear()


def test_script_cargar_simulacion_carga_y_resume(tmp_path, monkeypatch, capsys):
    url = _bd_migrada(tmp_path, monkeypatch)

    _ejecutar_script(monkeypatch)

    salida = capsys.readouterr().out
    assert "Insertadas: 80" in salida
    assert _contar_encuestas(url) == 80


def test_script_cargar_simulacion_en_modo_prueba_no_guarda_nada(tmp_path, monkeypatch, capsys):
    url = _bd_migrada(tmp_path, monkeypatch)

    _ejecutar_script(monkeypatch, "--prueba")

    salida = capsys.readouterr().out
    assert "Insertadas: 80" in salida
    assert "no se guardó" in salida.lower()
    assert _contar_encuestas(url) == 0
