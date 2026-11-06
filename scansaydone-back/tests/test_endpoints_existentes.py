"""Regresión: los endpoints que ya existían deben conservar su contrato exacto."""

from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_root():
    assert client.get("/").json() == {
        "app": "ScanSayDone API",
        "team": "Dunk & Code XD",
        "status": "online",
        "docs": "/docs",
    }


def test_health():
    assert client.get("/health").json() == {"status": "ok", "version": "0.1.0"}


def test_qr_png():
    r = client.get("/api/v1/qr/generate", params={"target_url": "https://scansaydone.vercel.app/encuesta/2"})
    assert r.status_code == 200
    assert r.headers["content-type"] == "image/png"
    assert r.content[:8] == b"\x89PNG\r\n\x1a\n"


def test_nps_calculo():
    r = client.post("/api/v1/nps/calculate", json={"ratings": [10, 9, 8, 4]})
    assert r.json() == {
        "total_responses": 4,
        "promoters": 2,
        "passives": 1,
        "detractors": 1,
        "nps_score": 25.0,
        "category": "Bueno",
    }


def test_nps_vacio():
    r = client.post("/api/v1/nps/calculate", json={"ratings": []})
    assert r.status_code == 400
    assert r.json()["detail"] == "La lista de calificaciones no puede estar vacía."


def test_nps_fuera_de_rango():
    r = client.post("/api/v1/nps/calculate", json={"ratings": [11]})
    assert r.status_code == 400
    assert r.json()["detail"] == "Calificación inválida: 11. Debe ser entre 0 y 10."
