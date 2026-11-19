"""Usuarios del login de demostración: dim_usuarios

Revision ID: 0002
Revises: 0001
"""
import sqlalchemy as sa
from alembic import op

revision = "0002"
down_revision = "0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "dim_usuarios",
        sa.Column("usuario_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("usuario", sa.String(40), nullable=False),
        sa.Column("hash_contrasena", sa.String(255), nullable=False),
        sa.Column("empresa_id", sa.Integer(), sa.ForeignKey("dim_empresas.empresa_id"), nullable=False),
        sa.Column("creado_en", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("usuario", name="uq_dim_usuarios_usuario"),
    )

    # Igual que la 0001: RLS sin políticas, solo el backend (dueño de la tabla) accede.
    if op.get_bind().dialect.name == "postgresql":
        op.execute("ALTER TABLE dim_usuarios ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.drop_table("dim_usuarios")
