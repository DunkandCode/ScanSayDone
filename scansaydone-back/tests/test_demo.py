import runpy
from pathlib import Path

import sqlalchemy as sa
from alembic import command
from alembic.config import Config
from sqlalchemy import func, select

from scansaydone import db
from scansaydone.demo import EMPRESAS_DEMO, asegurar_empresas_demo
from scansaydone.models import Empresa

RAIZ_BACKEND = Path(__file__).resolve().parent.parent


def test_asegurar_empresas_demo_es_idempotente(sesion):
    primero = asegurar_empresas_demo(sesion)
    segundo = asegurar_empresas_demo(sesion)

    assert primero == segundo
    assert set(primero) == {nombre for nombre, _ in EMPRESAS_DEMO}
    assert sesion.scalar(select(func.count()).select_from(Empresa)) == 4
    rubros = {e.nombre_negocio: e.rubro_id for e in sesion.scalars(select(Empresa))}
    assert rubros == dict(EMPRESAS_DEMO)


def test_asegurar_empresas_demo_no_duplica_una_empresa_existente(sesion, empresa_cafe):
    ids = asegurar_empresas_demo(sesion)

    assert ids["Café Rincón Andino"] == empresa_cafe.empresa_id
    assert sesion.scalar(select(func.count()).select_from(Empresa)) == 4


def test_script_seed_demo_crea_las_empresas_e_imprime_los_ids(tmp_path, monkeypatch, capsys):
    url = f"sqlite:///{tmp_path / 'seed.db'}"
    monkeypatch.setenv("POSTGRES_URL_NON_POOLING", url)
    command.upgrade(Config(str(RAIZ_BACKEND / "alembic.ini")), "head")
    monkeypatch.setenv("DATABASE_URL", url)
    db.obtener_engine.cache_clear()
    try:
        runpy.run_path(str(RAIZ_BACKEND / "scripts" / "seed_demo.py"), run_name="__main__")
    finally:
        db.obtener_engine.cache_clear()

    salida = capsys.readouterr().out
    for nombre, _ in EMPRESAS_DEMO:
        assert nombre in salida
    engine = sa.create_engine(url)
    with engine.connect() as conexion:
        assert conexion.execute(sa.text("select count(*) from dim_empresas")).scalar_one() == 4
    engine.dispose()
