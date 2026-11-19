from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy import select
from sqlalchemy.orm import Session

from scansaydone.catalogo import PREGUNTA_P1, PREGUNTA_P2
from scansaydone.db import get_session
from scansaydone.models import Empresa, Encuesta
from scansaydone.panel import calcular_agregado
from scansaydone.schemas import (
    MAX_CARACTERES_COMENTARIO,
    MAX_ID,
    EmpresaPanel,
    EncuestaEmpresa,
    PanelEmpresa,
    PreguntaAbierta,
    PreguntaAtributo,
    PreguntaEscala,
    PreguntasEncuesta,
    RespuestaPanel,
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


@router.get(
    "/api/v1/empresas/{empresa_id}/panel",
    response_model=PanelEmpresa,
    tags=["Empresas"],
)
def obtener_panel(empresa_id: int = Path(ge=1, le=MAX_ID), sesion: Session = Depends(get_session)):
    """
    Devuelve el panel de la empresa: sus datos, el agregado (NPS, CSAT, atributos, alertas,
    comentarios, distribución y serie diaria) y el detalle de cada respuesta, de la más
    reciente a la más antigua.

    No filtra por fechas: entrega todo el historial. Sin autenticación (demo): cualquiera que
    conozca el `empresa_id` puede consultarlo.
    """
    empresa = sesion.get(Empresa, empresa_id)
    if empresa is None:
        raise HTTPException(status_code=404, detail="Empresa no encontrada.")

    encuestas = list(
        sesion.scalars(
            select(Encuesta)
            .where(Encuesta.empresa_id == empresa_id)
            .order_by(Encuesta.creado_en.desc(), Encuesta.encuesta_id.desc())
        )
    )
    rubro = empresa.rubro
    return PanelEmpresa(
        empresa=EmpresaPanel(
            empresa_id=empresa.empresa_id, nombre_negocio=empresa.nombre_negocio, rubro=rubro.nombre
        ),
        agregado=calcular_agregado(encuestas, rubro.p3_label, rubro.p4_label),
        respuestas=[
            RespuestaPanel(
                encuesta_id=e.encuesta_id,
                fecha=e.fecha,
                hora=e.hora,
                creado_en=e.creado_en,
                p1_nps=e.p1_nps,
                p2_csat=e.p2_csat,
                p3_atributo=e.p3_atributo,
                p4_atributo=e.p4_atributo,
                p5_comentario=e.p5_comentario,
                categoria_nps=e.categoria_nps,
                alerta=e.alerta == "ALERTA",
                tipo_comentario=e.tipo_comentario,
                bloque_horario=e.bloque_horario,
            )
            for e in encuestas
        ],
    )
