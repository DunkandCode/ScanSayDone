from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from scansaydone.db import get_session
from scansaydone.models import Empresa
from scansaydone.reglas import ahora_chile
from scansaydone.registro import construir_encuesta
from scansaydone.schemas import RespuestaCreada, RespuestaEntrada

router = APIRouter()


def reloj() -> datetime:
    """Instante actual en hora de Chile. Dependencia aparte para poder fijarla en las pruebas."""
    return ahora_chile()


@router.post(
    "/api/v1/respuestas",
    response_model=RespuestaCreada,
    status_code=201,
    tags=["Respuestas"],
)
def registrar_respuesta(
    datos: RespuestaEntrada,
    sesion: Session = Depends(get_session),
    momento: datetime = Depends(reloj),
):
    """
    Registra una encuesta de 5 preguntas de forma anónima (sin login).

    El servidor calcula la categoría NPS, la alerta, el tipo de comentario y las variables
    temporales (hora de Chile); el cliente solo envía las respuestas.
    """
    if sesion.get(Empresa, datos.empresa_id) is None:
        raise HTTPException(status_code=404, detail="Empresa no encontrada.")

    encuesta = construir_encuesta(datos.empresa_id, datos, momento)
    sesion.add(encuesta)
    sesion.flush()
    encuesta_id = encuesta.encuesta_id
    sesion.commit()
    return RespuestaCreada(encuesta_id=encuesta_id)
