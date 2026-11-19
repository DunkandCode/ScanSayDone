"""Credenciales del login de demostración: generar (texto plano) y cargar (cifradas)."""

import runpy
from pathlib import Path

import pytest
import sqlalchemy as sa
from alembic import command
from alembic.config import Config
from sqlalchemy import func, select

from scansaydone import db
from scansaydone.demo import asegurar_empresas_demo
from scansaydone.models import Empresa, Usuario
from scansaydone.seguridad import verificar_contrasena
from scansaydone.usuarios_demo import (
    Credencial,
    cargar_credenciales,
    escribir_csv,
    generar_credenciales,
    leer_csv,
    nombre_usuario,
)

RAIZ_BACKEND = Path(__file__).resolve().parent.parent


@pytest.fixture
def empresas_demo(sesion):
    ids = asegurar_empresas_demo(sesion)
    sesion.commit()
    return ids


@pytest.mark.parametrize(
    "negocio, esperado",
    [
        ("Minimarket Don Lucho", "minimarket_don_lucho"),
        ("Café Rincón Andino", "cafe_rincon_andino"),
        ("Peluquería Estilo Sur", "peluqueria_estilo_sur"),
        ("Cosmos Accesorios (Instagram)", "cosmos_accesorios"),
        ("  Ñandú & Cía.  ", "nandu_cia"),
    ],
)
def test_nombre_usuario_sale_del_nombre_del_negocio(negocio, esperado):
    assert nombre_usuario(negocio) == esperado


def test_generar_credenciales_crea_una_por_empresa_con_contrasena_aleatoria(sesion, empresas_demo):
    credenciales = generar_credenciales(sesion)

    assert {c.usuario: c.empresa_id for c in credenciales} == {
        "minimarket_don_lucho": empresas_demo["Minimarket Don Lucho"],
        "cafe_rincon_andino": empresas_demo["Café Rincón Andino"],
        "peluqueria_estilo_sur": empresas_demo["Peluquería Estilo Sur"],
        "cosmos_accesorios": empresas_demo["Cosmos Accesorios (Instagram)"],
    }
    assert all(len(c.contrasena) == 12 for c in credenciales)
    assert len({c.contrasena for c in credenciales}) == 4


def test_generar_credenciales_no_repite_usuarios_si_dos_nombres_chocan(sesion, empresas_demo):
    sesion.add(Empresa(nombre_negocio="Café Rincón Andino", rubro_id=2))
    sesion.commit()

    usuarios = [c.usuario for c in generar_credenciales(sesion)]

    assert len(usuarios) == len(set(usuarios)) == 5


def test_escribir_y_leer_csv_conservan_las_credenciales(tmp_path):
    credenciales = [Credencial("cafe_rincon_andino", "Abc123xyz789", 2, "Café Rincón Andino")]
    ruta = tmp_path / "credenciales.csv"

    escribir_csv(ruta, credenciales)

    assert leer_csv(ruta) == credenciales


def test_escribir_csv_no_sobrescribe_sin_forzar(tmp_path):
    ruta = tmp_path / "credenciales.csv"
    ruta.write_text("no tocar", encoding="utf-8")

    with pytest.raises(FileExistsError):
        escribir_csv(ruta, [])
    assert ruta.read_text(encoding="utf-8") == "no tocar"

    escribir_csv(ruta, [], forzar=True)
    assert ruta.read_text(encoding="utf-8") != "no tocar"


def test_cargar_credenciales_crea_y_luego_actualiza(sesion, empresas_demo):
    credenciales = generar_credenciales(sesion)

    primero = cargar_credenciales(sesion, credenciales)
    sesion.commit()
    nuevas = [Credencial(c.usuario, "OtraClave1234", c.empresa_id, c.nombre_negocio) for c in credenciales]
    segundo = cargar_credenciales(sesion, nuevas)
    sesion.commit()

    assert (primero.creados, primero.actualizados) == (4, 0)
    assert (segundo.creados, segundo.actualizados) == (0, 4)
    usuario = sesion.scalar(select(Usuario).where(Usuario.usuario == "cafe_rincon_andino"))
    assert verificar_contrasena("OtraClave1234", usuario.hash_contrasena)
    assert "OtraClave1234" not in usuario.hash_contrasena


def test_cargar_credenciales_con_empresa_inexistente_no_guarda_nada(sesion, empresas_demo):
    credenciales = generar_credenciales(sesion) + [Credencial("fantasma", "Abc123xyz789", 999, "Fantasma")]

    with pytest.raises(ValueError, match="999"):
        cargar_credenciales(sesion, credenciales)

    assert sesion.scalar(select(func.count()).select_from(Usuario)) == 0


def test_script_genera_y_carga_contra_una_bd_migrada(tmp_path, monkeypatch, capsys):
    url = f"sqlite:///{tmp_path / 'usuarios.db'}"
    monkeypatch.setenv("POSTGRES_URL_NON_POOLING", url)
    command.upgrade(Config(str(RAIZ_BACKEND / "alembic.ini")), "head")
    monkeypatch.setenv("DATABASE_URL", url)
    db.obtener_engine.cache_clear()
    archivo = tmp_path / "credenciales.csv"
    script = str(RAIZ_BACKEND / "scripts" / "usuarios_demo.py")
    try:
        runpy.run_path(str(RAIZ_BACKEND / "scripts" / "seed_demo.py"), run_name="__main__")
        for accion in ("generar", "cargar"):
            monkeypatch.setattr("sys.argv", ["usuarios_demo.py", accion, "--archivo", str(archivo)])
            runpy.run_path(script, run_name="__main__")
    finally:
        db.obtener_engine.cache_clear()

    salida = capsys.readouterr().out
    assert "cafe_rincon_andino" in salida
    assert "Creados: 4" in salida
    credenciales = leer_csv(archivo)
    engine = sa.create_engine(url)
    with engine.connect() as conexion:
        hashes = dict(conexion.execute(sa.text("select usuario, hash_contrasena from dim_usuarios")).all())
    engine.dispose()
    assert len(hashes) == 4
    assert all(verificar_contrasena(c.contrasena, hashes[c.usuario]) for c in credenciales)
