"""Modelos SQLAlchemy del ERD (docs/datos/modelo_relacional/esquema_modelo_datos_erd.docx).

Las restricciones CHECK hacen que la base rechace datos imposibles aunque falle la validación
de la API. La migración Alembic 0001 debe mantenerse idéntica a estas definiciones.
"""

from datetime import date, datetime, time

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    SmallInteger,
    String,
    Text,
    Time,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class Rubro(Base):
    __tablename__ = "dim_rubros"
    __table_args__ = (UniqueConstraint("nombre", name="uq_dim_rubros_nombre"),)

    # IDs fijos (1 Minimarket, 2 Cafetería, 3 Peluquería, 4 Online): no son autoincrementales.
    rubro_id: Mapped[int] = mapped_column(SmallInteger, primary_key=True, autoincrement=False)
    nombre: Mapped[str] = mapped_column(String(80))
    p3_label: Mapped[str] = mapped_column(String(80))
    p4_label: Mapped[str] = mapped_column(String(80))
    p3_pregunta: Mapped[str] = mapped_column(Text)
    p4_pregunta: Mapped[str] = mapped_column(Text)
    p5_pregunta: Mapped[str] = mapped_column(Text)


class Empresa(Base):
    __tablename__ = "dim_empresas"

    empresa_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre_negocio: Mapped[str] = mapped_column(String(120))
    rubro_id: Mapped[int] = mapped_column(SmallInteger, ForeignKey("dim_rubros.rubro_id"))

    rubro: Mapped[Rubro] = relationship()


class Encuesta(Base):
    __tablename__ = "fact_encuestas"
    __table_args__ = (
        CheckConstraint("p1_nps BETWEEN 0 AND 10", name="ck_fact_encuestas_p1_nps"),
        CheckConstraint("p2_csat BETWEEN 1 AND 5", name="ck_fact_encuestas_p2_csat"),
        CheckConstraint("p3_atributo BETWEEN 1 AND 5", name="ck_fact_encuestas_p3_atributo"),
        CheckConstraint("p4_atributo BETWEEN 1 AND 5", name="ck_fact_encuestas_p4_atributo"),
        CheckConstraint(
            "categoria_nps IN ('Promotor', 'Pasivo', 'Detractor')",
            name="ck_fact_encuestas_categoria_nps",
        ),
        CheckConstraint("alerta IN ('ALERTA', '')", name="ck_fact_encuestas_alerta"),
        CheckConstraint(
            "tipo_comentario IN ('Felicitación', 'Reclamo', 'Sugerencia / mixto', 'Sin comentario')",
            name="ck_fact_encuestas_tipo_comentario",
        ),
        CheckConstraint("semana_anio BETWEEN 1 AND 53", name="ck_fact_encuestas_semana_anio"),
        CheckConstraint(
            "bloque_horario IN ('Mañana', 'Tarde', 'Noche')",
            name="ck_fact_encuestas_bloque_horario",
        ),
        Index("ix_fact_encuestas_empresa_id", "empresa_id"),
    )

    encuesta_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    empresa_id: Mapped[int] = mapped_column(Integer, ForeignKey("dim_empresas.empresa_id"))
    fecha: Mapped[date] = mapped_column(Date)
    hora: Mapped[time] = mapped_column(Time)
    creado_en: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Entrada cruda
    p1_nps: Mapped[int] = mapped_column(SmallInteger)
    p2_csat: Mapped[int] = mapped_column(SmallInteger)
    p3_atributo: Mapped[int] = mapped_column(SmallInteger)
    p4_atributo: Mapped[int] = mapped_column(SmallInteger)
    p5_comentario: Mapped[str | None] = mapped_column(String(300))

    # Calculadas / derivadas
    categoria_nps: Mapped[str] = mapped_column(String(10))
    alerta: Mapped[str] = mapped_column(String(6), server_default="")
    tipo_comentario: Mapped[str] = mapped_column(String(20))
    anio: Mapped[int] = mapped_column(SmallInteger)
    mes_nombre: Mapped[str] = mapped_column(String(10))
    semana_anio: Mapped[int] = mapped_column(SmallInteger)
    dia_semana: Mapped[str] = mapped_column(String(9))
    bloque_horario: Mapped[str] = mapped_column(String(6))
