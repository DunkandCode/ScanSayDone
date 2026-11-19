"""Modelos Pydantic de entrada y salida de la API."""

from datetime import date, datetime, time
from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

MAX_CARACTERES_COMENTARIO = 300
# Máximo de la columna INTEGER: un id mayor jamás existe y no debe llegar a la base de datos.
MAX_ID = 2_147_483_647


class RespuestasEncuesta(BaseModel):
    """Las 5 respuestas de una encuesta, validadas igual venga de la API o de una carga masiva.

    Los enteros son estrictos: `"9"`, `9.0` y `true` se rechazan en vez de convertirse.
    Se rechazan también los campos desconocidos.
    """

    model_config = ConfigDict(extra="forbid")

    p1_nps: int = Field(strict=True, ge=0, le=10, description="Probabilidad de recomendar (0-10)")
    p2_csat: int = Field(strict=True, ge=1, le=5, description="Satisfacción global (1-5)")
    p3_atributo: int = Field(strict=True, ge=1, le=5, description="Atributo 1 del rubro (1-5)")
    p4_atributo: int = Field(strict=True, ge=1, le=5, description="Atributo 2 del rubro (1-5)")
    p5_comentario: (
        Annotated[str, StringConstraints(strip_whitespace=True, max_length=MAX_CARACTERES_COMENTARIO)] | None
    ) = Field(default=None, description="Comentario opcional, máximo 300 caracteres")

    @field_validator("p5_comentario")
    @classmethod
    def comentario_valido(cls, valor: str | None) -> str | None:
        # PostgreSQL no puede guardar el carácter NUL en un texto: sin esta validación
        # el INSERT fallaría y el cliente recibiría un 500 en vez de un 422.
        if valor and "\x00" in valor:
            raise ValueError("El comentario contiene caracteres no permitidos.")
        return valor or None  # un comentario vacío tras recortar se guarda como NULL


class RespuestaEntrada(RespuestasEncuesta):
    """Payload de POST /api/v1/respuestas: las 5 respuestas más el negocio que las recibe."""

    empresa_id: int = Field(strict=True, ge=1, le=MAX_ID)


class RespuestaCreada(BaseModel):
    encuesta_id: int


class PreguntaEscala(BaseModel):
    texto: str
    escala: list[int]


class PreguntaAtributo(PreguntaEscala):
    etiqueta: str


class PreguntaAbierta(BaseModel):
    texto: str
    max_caracteres: int


class PreguntasEncuesta(BaseModel):
    p1: PreguntaEscala
    p2: PreguntaEscala
    p3: PreguntaAtributo
    p4: PreguntaAtributo
    p5: PreguntaAbierta


class EncuestaEmpresa(BaseModel):
    empresa_id: int
    nombre_negocio: str
    rubro: str
    preguntas: PreguntasEncuesta


class LoginEntrada(BaseModel):
    """Payload de POST /api/v1/auth/login.

    El usuario se normaliza (sin espacios a los lados y en minúsculas); la contraseña se
    compara tal cual, pero no puede estar vacía ni ser solo espacios.
    """

    model_config = ConfigDict(extra="forbid")

    usuario: Annotated[str, StringConstraints(strip_whitespace=True, to_lower=True, min_length=1, max_length=40)]
    contrasena: str = Field(min_length=1, max_length=128)

    @field_validator("contrasena")
    @classmethod
    def contrasena_no_vacia(cls, valor: str) -> str:
        if not valor.strip():
            raise ValueError("La contraseña no puede estar vacía.")
        return valor


class SesionDemo(BaseModel):
    usuario: str
    empresa_id: int
    nombre_negocio: str


# --- Panel de la empresa: GET /api/v1/empresas/{empresa_id}/panel ----------------------------
# Números crudos y fechas ISO; `None` cuando no hay datos para calcular (nunca 0).


class EmpresaPanel(BaseModel):
    empresa_id: int
    nombre_negocio: str
    rubro: str


class AtributoPanel(BaseModel):
    etiqueta: str
    media: float | None
    top_box: float | None = Field(description="% de respuestas 4 o 5")


class ComentariosPanel(BaseModel):
    felicitacion: int
    reclamo: int
    sugerencia: int
    sin_comentario: int


class NotaCantidad(BaseModel):
    nota: int
    cantidad: int


class DiaPanel(BaseModel):
    fecha: date
    respuestas: int
    suma_p1: int
    media_p1: float


class AgregadoPanel(BaseModel):
    respuestas: int
    desde: date | None
    hasta: date | None
    nps: float | None = Field(description="% promotores (9-10) - % detractores (0-6)")
    promotores: int
    pasivos: int
    detractores: int
    notas_8_a_10: int
    media_p1: float | None
    csat: float | None = Field(description="% de P2 en 4 o 5")
    media_p2: float | None
    p3: AtributoPanel
    p4: AtributoPanel
    alertas: int
    comentarios: ComentariosPanel
    distribucion_p1: list[NotaCantidad]
    serie_diaria: list[DiaPanel]


class RespuestaPanel(BaseModel):
    encuesta_id: int
    fecha: date
    hora: time
    creado_en: datetime
    p1_nps: int
    p2_csat: int
    p3_atributo: int
    p4_atributo: int
    p5_comentario: str | None
    categoria_nps: str
    alerta: bool
    tipo_comentario: str
    bloque_horario: str


class PanelEmpresa(BaseModel):
    empresa: EmpresaPanel
    agregado: AgregadoPanel
    respuestas: list[RespuestaPanel]
