import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from main import app
from scansaydone.catalogo import RUBROS
from scansaydone.db import get_session
from scansaydone.models import Base, Empresa, Rubro


@pytest.fixture
def engine_prueba():
    """SQLite en memoria con las tablas del modelo y los 4 rubros cargados."""
    engine = create_engine(
        "sqlite://", poolclass=StaticPool, connect_args={"check_same_thread": False}
    )
    Base.metadata.create_all(engine)
    with Session(engine) as sesion:
        sesion.add_all(Rubro(**rubro) for rubro in RUBROS)
        sesion.commit()
    yield engine
    engine.dispose()


@pytest.fixture
def sesion(engine_prueba):
    with Session(engine_prueba) as sesion:
        yield sesion


@pytest.fixture
def empresa_cafe(sesion):
    """Empresa de rubro «Cafetería / restaurante» (rubro_id 2) ya guardada."""
    empresa = Empresa(nombre_negocio="Café Rincón Andino", rubro_id=2)
    sesion.add(empresa)
    sesion.commit()
    return empresa


@pytest.fixture
def client(engine_prueba):
    """TestClient de la app usando la BD de prueba en lugar de Supabase."""

    def _sesion_de_prueba():
        with Session(engine_prueba) as sesion:
            yield sesion

    app.dependency_overrides[get_session] = _sesion_de_prueba
    yield TestClient(app)
    app.dependency_overrides.clear()
