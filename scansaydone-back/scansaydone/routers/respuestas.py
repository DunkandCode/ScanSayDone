from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from scansaydone.db import get_session
from scansaydone.models import Empresa, Encuesta
from scansaydone.nlp import clasificar_comentario
from scansaydone.reglas import ahora_chile, alerta, categoria_nps, variables_temporales
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

    tiempo = variables_temporales(momento)
    encuesta = Encuesta(
        empresa_id=datos.empresa_id,
        fecha=tiempo.fecha,
        hora=tiempo.hora,
        p1_nps=datos.p1_nps,
        p2_csat=datos.p2_csat,
        p3_atributo=datos.p3_atributo,
        p4_atributo=datos.p4_atributo,
        p5_comentario=datos.p5_comentario,
        categoria_nps=categoria_nps(datos.p1_nps),
        alerta=alerta(datos.p1_nps, datos.p2_csat),
        tipo_comentario=clasificar_comentario(datos.p5_comentario),
        anio=tiempo.anio,
        mes_nombre=tiempo.mes_nombre,
        semana_anio=tiempo.semana_anio,
        dia_semana=tiempo.dia_semana,
        bloque_horario=tiempo.bloque_horario,
    )
    sesion.add(encuesta)
    sesion.flush()
    encuesta_id = encuesta.encuesta_id
    sesion.commit()
    return RespuestaCreada(encuesta_id=encuesta_id)
