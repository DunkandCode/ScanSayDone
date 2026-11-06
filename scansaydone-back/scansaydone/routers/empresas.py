from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session

from scansaydone.catalogo import PREGUNTA_P1, PREGUNTA_P2
from scansaydone.db import get_session
from scansaydone.models import Empresa
from scansaydone.schemas import (
    MAX_CARACTERES_COMENTARIO,
    MAX_ID,
    EncuestaEmpresa,
    PreguntaAbierta,
    PreguntaAtributo,
    PreguntaEscala,
    PreguntasEncuesta,
)

router = APIRouter()


@router.get(
    "/api/v1/empresas/{empresa_id}/encuesta",
    response_model=EncuestaEmpresa,
    tags=["Empresas"],
)
def obtener_encuesta(empresa_id: int = Path(ge=1, le=MAX_ID), sesion: Session = Depends(get_session)):
    """
    Devuelve el negocio y los textos de las 5 preguntas de su rubro, para que el frontend
    arme la encuesta sin tener las preguntas escritas a mano.
    """
    empresa = sesion.get(Empresa, empresa_id)
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa no encontrada.")

    rubro = empresa.rubro
    return EncuestaEmpresa(
        empresa_id=empresa.empresa_id,
        nombre_negocio=empresa.nombre_negocio,
        rubro=rubro.nombre,
        preguntas=PreguntasEncuesta(
            p1=PreguntaEscala(texto=PREGUNTA_P1, escala=[0, 10]),
            p2=PreguntaEscala(texto=PREGUNTA_P2, escala=[1, 5]),
            p3=PreguntaAtributo(texto=rubro.p3_pregunta, etiqueta=rubro.p3_label, escala=[1, 5]),
            p4=PreguntaAtributo(texto=rubro.p4_pregunta, etiqueta=rubro.p4_label, escala=[1, 5]),
            p5=PreguntaAbierta(texto=rubro.p5_pregunta, max_caracteres=MAX_CARACTERES_COMENTARIO),
        ),
    )
