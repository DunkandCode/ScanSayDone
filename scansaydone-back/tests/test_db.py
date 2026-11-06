from sqlalchemy.pool import NullPool

from scansaydone import db


def _capturar_create_engine(monkeypatch):
    """Reemplaza create_engine por un espía: así se verifica la configuración sin conectarse."""
    capturado = {}

    def espia(url, **kwargs):
        capturado["url"] = url
        capturado.update(kwargs)
        return "engine-falso"

    monkeypatch.setattr(db, "create_engine", espia)
    db.obtener_engine.cache_clear()
    return capturado


def test_engine_postgres_usa_nullpool_sin_sentencias_preparadas_y_con_timeout(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "postgres://u:p@h:6543/postgres")
    capturado = _capturar_create_engine(monkeypatch)
    try:
        db.obtener_engine()
    finally:
        db.obtener_engine.cache_clear()

    assert capturado["url"] == "postgresql+psycopg://u:p@h:6543/postgres"
    assert capturado["poolclass"] is NullPool
    # Sin connect_timeout, una base que no responde tarda minutos en dar 503.
    assert capturado["connect_args"] == {"prepare_threshold": None, "connect_timeout": 5}


def test_engine_sqlite_no_recibe_argumentos_de_postgres(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "sqlite://")
    capturado = _capturar_create_engine(monkeypatch)
    try:
        db.obtener_engine()
    finally:
        db.obtener_engine.cache_clear()

    assert capturado["poolclass"] is NullPool
    assert "connect_args" not in capturado
