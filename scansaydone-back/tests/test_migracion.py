import io
from datetime import date, time
from pathlib import Path

import pytest
import sqlalchemy as sa
from alembic import command
from alembic.autogenerate import compare_metadata
from alembic.config import Config
from alembic.migration import MigrationContext

from scansaydone.models import Base, Encuesta

ALEMBIC_INI = Path(__file__).resolve().parent.parent / "alembic.ini"

FILA_VALIDA = dict(
    empresa_id=1,
    fecha="2026-11-06",
    hora="09:15:00",
    p1_nps=9,
    p2_csat=5,
    p3_atributo=4,
    p4_atributo=4,
    p5_comentario=None,
    categoria_nps="Promotor",
    alerta="",
    tipo_comentario="Sin comentario",
    anio=2026,
    mes_nombre="Noviembre",
    semana_anio=45,
    dia_semana="Viernes",
    bloque_horario="Mañana",
)


@pytest.fixture
def bd_migrada(tmp_path, monkeypatch):
    """SQLite en archivo con la migración aplicada y una empresa (id 1) de rubro 2."""
    url = f"sqlite:///{tmp_path / 'migrada.db'}"
    monkeypatch.setenv("POSTGRES_URL_NON_POOLING", url)
    command.upgrade(Config(str(ALEMBIC_INI)), "head")
    engine = sa.create_engine(url)
    with engine.begin() as conexion:
        conexion.execute(sa.text("insert into dim_empresas (nombre_negocio, rubro_id) values ('Café', 2)"))
    yield engine
    engine.dispose()


def _insertar(engine, **cambios):
    fila = {**FILA_VALIDA, **cambios}
    columnas = ", ".join(fila)
    marcadores = ", ".join(f":{c}" for c in fila)
    with engine.begin() as conexion:
        conexion.execute(sa.text(f"insert into fact_encuestas ({columnas}) values ({marcadores})"), fila)


def test_migracion_crea_tablas_y_rubros(bd_migrada):
    assert {"dim_rubros", "dim_empresas", "fact_encuestas"} <= set(sa.inspect(bd_migrada).get_table_names())
    with bd_migrada.connect() as conexion:
        filas = conexion.execute(sa.text("select rubro_id, nombre from dim_rubros order by rubro_id")).all()
    assert len(filas) == 4
    assert filas[0] == (1, "Minimarket / almacén de barrio")


def test_migracion_activa_rls_en_todas_las_tablas_incluida_alembic_version(monkeypatch):
    """En Supabase, `public` es accesible con la clave anon: toda tabla debe tener RLS."""
    monkeypatch.setenv("POSTGRES_URL_NON_POOLING", "postgresql://u:p@h:5432/db")
    salida = io.StringIO()
    command.upgrade(Config(str(ALEMBIC_INI), output_buffer=salida), "head", sql=True)

    sql = salida.getvalue()
    for tabla in ("dim_rubros", "dim_empresas", "fact_encuestas", "alembic_version"):
        assert f"ALTER TABLE {tabla} ENABLE ROW LEVEL SECURITY" in sql


def test_migracion_acepta_fila_valida_y_pone_creado_en(bd_migrada):
    _insertar(bd_migrada)
    with bd_migrada.connect() as conexion:
        creado_en = conexion.execute(sa.text("select creado_en from fact_encuestas")).scalar_one()
    assert creado_en is not None


@pytest.mark.parametrize(
    "campo,valor",
    [
        ("p1_nps", 11),
        ("p1_nps", -1),
        ("p2_csat", 0),
        ("p3_atributo", 6),
        ("p4_atributo", 0),
        ("semana_anio", 54),
        ("categoria_nps", "Otro"),
        ("alerta", "alerta"),
        ("tipo_comentario", "Otro"),
        ("bloque_horario", "Madrugada"),
    ],
)
def test_migracion_checks_rechazan_valores_invalidos(bd_migrada, campo, valor):
    with pytest.raises(sa.exc.IntegrityError):
        _insertar(bd_migrada, **{campo: valor})


def test_migracion_coincide_con_los_modelos(bd_migrada):
    """Si alguien cambia models.py sin una migración nueva (o al revés), esta prueba falla."""
    with bd_migrada.connect() as conexion:
        diferencias = compare_metadata(MigrationContext.configure(conexion), Base.metadata)
    assert diferencias == []


def test_check_rechaza_p1_fuera_de_rango_en_el_modelo(sesion, empresa_cafe):
    sesion.add(
        Encuesta(
            empresa_id=empresa_cafe.empresa_id,
            fecha=date(2026, 11, 6),
            hora=time(9, 15),
            p1_nps=11,
            p2_csat=5,
            p3_atributo=4,
            p4_atributo=4,
            p5_comentario=None,
            categoria_nps="Promotor",
            alerta="",
            tipo_comentario="Sin comentario",
            anio=2026,
            mes_nombre="Noviembre",
            semana_anio=45,
            dia_semana="Viernes",
            bloque_horario="Mañana",
        )
    )
    with pytest.raises(sa.exc.IntegrityError):
        sesion.flush()
