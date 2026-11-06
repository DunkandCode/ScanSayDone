import importlib

import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def cliente_cors(monkeypatch):
    """App recargada sin variables de CORS, para usar los orígenes por defecto."""
    monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)
    monkeypatch.delenv("ALLOWED_ORIGIN_REGEX", raising=False)
    import main

    importlib.reload(main)
    return TestClient(main.app)


def _preflight(cliente, origen):
    return cliente.options(
        "/api/v1/nps/calculate",
        headers={
            "Origin": origen,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "content-type",
        },
    )


def test_preflight_localhost_permitido(cliente_cors):
    r = _preflight(cliente_cors, "http://localhost:3000")
    assert r.status_code == 200
    assert r.headers["access-control-allow-origin"] == "http://localhost:3000"


def test_origen_desconocido_rechazado(cliente_cors):
    r = _preflight(cliente_cors, "https://malicioso.example")
    assert "access-control-allow-origin" not in r.headers
