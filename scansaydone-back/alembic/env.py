"""Entorno de Alembic: la URL sale de las variables de entorno, nunca del repositorio."""

from alembic import context
from sqlalchemy import create_engine, pool

from scansaydone import config
from scansaydone.models import Base

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    context.configure(
        url=config.obtener_url_migraciones(),
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    url = config.obtener_url_migraciones()
    argumentos = {}
    if url.startswith("postgresql"):
        # Por si se usa el pooler de transacciones: no admite sentencias preparadas.
        argumentos["connect_args"] = {"prepare_threshold": None}
    engine = create_engine(url, poolclass=pool.NullPool, **argumentos)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
