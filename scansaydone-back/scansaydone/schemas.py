"""Modelos Pydantic de entrada y salida de la API."""

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

MAX_CARACTERES_COMENTARIO = 300
# Máximo de la columna INTEGER: un id mayor jamás existe y no debe llegar a la base de datos.
MAX_ID = 2_147_483_647


class RespuestaEntrada(BaseModel):
    """Payload de POST /api/v1/respuestas.

    Los enteros son estrictos: `"9"`, `9.0` y `true` se rechazan en vez de convertirse.
    Se rechazan también los campos desconocidos.
    """

    model_config = ConfigDict(extra="forbid")

    empresa_id: int = Field(strict=True, ge=1, le=MAX_ID)
    p1_nps: int = Field(strict=True, ge=0, le=10, description="Probabilidad de recomendar (0-10)")
    p2_csat: int = Field(strict=True, ge=1, le=5, description="Satisfacción global (1-5)")
    p3_atributo: int = Field(strict=True, ge=1, le=5, description="Atributo 1 del rubro (1-5)")
    p4_atributo: int = Field(strict=True, ge=1, le=5, description="Atributo 2 del rubro (1-5)")
    p5_comentario: (
        Annotated[str, StringConstraints(strip_whitespace=True, max_length=MAX_CARACTERES_COMENTARIO)] | None
    ) = Field(default=None, description="Comentario opcional, máximo 300 caracteres")

    @field_validator("p5_comentario")
    @classmethod
    def comentario_vacio_es_nulo(cls, valor: str | None) -> str | None:
        return valor or None


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
