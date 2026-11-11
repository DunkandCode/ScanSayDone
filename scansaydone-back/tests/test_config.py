import pytest

from scansaydone import config


def test_normaliza_esquema_postgres():
    assert config.normalizar_url_db("postgres://u:p@h:6543/postgres") == "postgresql+psycopg://u:p@h:6543/postgres"
    assert config.normalizar_url_db("postgresql://u:p@h:5432/postgres") == "postgresql+psycopg://u:p@h:5432/postgres"


def test_elimina_parametros_desconocidos_y_conserva_sslmode():
    url = "postgres://u:p@h:6543/postgres?sslmode=require&supa=base-pooler.x"
    assert config.normalizar_url_db(url) == "postgresql+psycopg://u:p@h:6543/postgres?sslmode=require"


def test_no_toca_urls_sqlite():
    assert config.normalizar_url_db("sqlite:///./x.db") == "sqlite:///./x.db"


def test_database_url_tiene_prioridad(monkeypatch):
    monkeypatch.setenv("POSTGRES_URL", "postgres://a@h/db")
    monkeypatch.setenv("DATABASE_URL", "postgres://b@h/db")
    assert config.obtener_url_db() == "postgresql+psycopg://b@h/db"


def test_sin_url_lanza_configuracion_error(monkeypatch):
    for var in ("DATABASE_URL", "POSTGRES_URL", "POSTGRES_URL_NON_POOLING"):
        monkeypatch.delenv(var, raising=False)
    with pytest.raises(config.ConfiguracionError):
        config.obtener_url_db()


def test_migraciones_prefieren_non_pooling(monkeypatch):
    monkeypatch.setenv("POSTGRES_URL", "postgres://pool@h:6543/db")
    monkeypatch.setenv("POSTGRES_URL_NON_POOLING", "postgres://directa@h:5432/db")
    monkeypatch.delenv("DATABASE_URL", raising=False)
    assert config.obtener_url_migraciones() == "postgresql+psycopg://directa@h:5432/db"


def test_origenes_por_defecto(monkeypatch):
    monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)
    assert config.origenes_permitidos() == ["http://localhost:3000", "https://scansaydone.vercel.app"]


def test_origenes_desde_variable(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", "https://a.cl, https://b.cl")
    assert config.origenes_permitidos() == ["https://a.cl", "https://b.cl"]
