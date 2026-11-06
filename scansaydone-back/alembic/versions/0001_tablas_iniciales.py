"""Tablas iniciales: dim_rubros, dim_empresas y fact_encuestas

Revision ID: 0001
Revises:
"""
import sqlalchemy as sa
from alembic import op

from scansaydone.catalogo import RUBROS

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

TABLAS = ("dim_rubros", "dim_empresas", "fact_encuestas")


def upgrade() -> None:
    rubros = op.create_table(
        "dim_rubros",
        sa.Column("rubro_id", sa.SmallInteger(), primary_key=True, autoincrement=False),
        sa.Column("nombre", sa.String(80), nullable=False),
        sa.Column("p3_label", sa.String(80), nullable=False),
        sa.Column("p4_label", sa.String(80), nullable=False),
        sa.Column("p3_pregunta", sa.Text(), nullable=False),
        sa.Column("p4_pregunta", sa.Text(), nullable=False),
        sa.Column("p5_pregunta", sa.Text(), nullable=False),
        sa.UniqueConstraint("nombre", name="uq_dim_rubros_nombre"),
    )

    op.create_table(
        "dim_empresas",
        sa.Column("empresa_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("nombre_negocio", sa.String(120), nullable=False),
        sa.Column("rubro_id", sa.SmallInteger(), sa.ForeignKey("dim_rubros.rubro_id"), nullable=False),
    )

    op.create_table(
        "fact_encuestas",
        sa.Column("encuesta_id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("empresa_id", sa.Integer(), sa.ForeignKey("dim_empresas.empresa_id"), nullable=False),
        sa.Column("fecha", sa.Date(), nullable=False),
        sa.Column("hora", sa.Time(), nullable=False),
        sa.Column("creado_en", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.Column("p1_nps", sa.SmallInteger(), nullable=False),
        sa.Column("p2_csat", sa.SmallInteger(), nullable=False),
        sa.Column("p3_atributo", sa.SmallInteger(), nullable=False),
        sa.Column("p4_atributo", sa.SmallInteger(), nullable=False),
        sa.Column("p5_comentario", sa.String(300), nullable=True),
        sa.Column("categoria_nps", sa.String(10), nullable=False),
        sa.Column("alerta", sa.String(6), nullable=False, server_default=""),
        sa.Column("tipo_comentario", sa.String(20), nullable=False),
        sa.Column("anio", sa.SmallInteger(), nullable=False),
        sa.Column("mes_nombre", sa.String(10), nullable=False),
        sa.Column("semana_anio", sa.SmallInteger(), nullable=False),
        sa.Column("dia_semana", sa.String(9), nullable=False),
        sa.Column("bloque_horario", sa.String(6), nullable=False),
        sa.CheckConstraint("p1_nps BETWEEN 0 AND 10", name="ck_fact_encuestas_p1_nps"),
        sa.CheckConstraint("p2_csat BETWEEN 1 AND 5", name="ck_fact_encuestas_p2_csat"),
        sa.CheckConstraint("p3_atributo BETWEEN 1 AND 5", name="ck_fact_encuestas_p3_atributo"),
        sa.CheckConstraint("p4_atributo BETWEEN 1 AND 5", name="ck_fact_encuestas_p4_atributo"),
        sa.CheckConstraint(
            "categoria_nps IN ('Promotor', 'Pasivo', 'Detractor')",
            name="ck_fact_encuestas_categoria_nps",
        ),
        sa.CheckConstraint("alerta IN ('ALERTA', '')", name="ck_fact_encuestas_alerta"),
        sa.CheckConstraint(
            "tipo_comentario IN ('Felicitación', 'Reclamo', 'Sugerencia / mixto', 'Sin comentario')",
            name="ck_fact_encuestas_tipo_comentario",
        ),
        sa.CheckConstraint("semana_anio BETWEEN 1 AND 53", name="ck_fact_encuestas_semana_anio"),
        sa.CheckConstraint(
            "bloque_horario IN ('Mañana', 'Tarde', 'Noche')",
            name="ck_fact_encuestas_bloque_horario",
        ),
    )
    op.create_index("ix_fact_encuestas_empresa_id", "fact_encuestas", ["empresa_id"])

    op.bulk_insert(rubros, RUBROS)

    # RLS sin políticas: los roles anon/authenticated de la API pública de Supabase no pueden
    # leer ni escribir. El backend se conecta con el dueño de las tablas, que no está sujeto a RLS.
    if op.get_bind().dialect.name == "postgresql":
        for tabla in TABLAS:
            op.execute(f"ALTER TABLE {tabla} ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.drop_index("ix_fact_encuestas_empresa_id", table_name="fact_encuestas")
    op.drop_table("fact_encuestas")
    op.drop_table("dim_empresas")
    op.drop_table("dim_rubros")
