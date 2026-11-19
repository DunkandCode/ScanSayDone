"""Carga del dataset simulado de 80 encuestas (issue #16).

Fuente: hoja «Datos_encuesta» de docs/datos/datasets/simulacion_80_encuestas.xlsx (la misma
que lee el pipeline del área de datos). Del Excel se toman solo los datos crudos: fecha, hora,
negocio y P1–P5. Las columnas calculadas (categoría, tipo de comentario, alerta) se recalculan
con las mismas reglas del endpoint, igual que hace el pipeline con el tipo de comentario.

Este módulo usa `openpyxl` (dependencia de desarrollo) y no lo importa la API.
"""

from dataclasses import dataclass
from datetime import date, datetime, time
from pathlib import Path

from pydantic import ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from scansaydone.catalogo import RUBROS
from scansaydone.demo import EMPRESAS_DEMO, asegurar_empresas_demo
from scansaydone.models import Encuesta
from scansaydone.reglas import ZONA_HORARIA
from scansaydone.registro import construir_encuesta
from scansaydone.schemas import RespuestasEncuesta

HOJA = "Datos_encuesta"
COLUMNAS = {
    "id": "ID",
    "fecha": "Fecha",
    "hora": "Hora",
    "rubro": "Rubro",
    "negocio": "Negocio (simulado)",
    "p1": "P1. Probabilidad de recomendar (0-10)",
    "p2": "P2. Satisfacción global (1-5)",
    "p3": "P3. Atributo 1 (1-5)",
    "atributo_p3": "Atributo P3",
    "p4": "P4. Atributo 2 (1-5)",
    "atributo_p4": "Atributo P4",
    "p5": "P5. Comentario (opcional)",
}

_RUBRO_POR_NEGOCIO = dict(EMPRESAS_DEMO)
_RUBROS_POR_ID = {rubro["rubro_id"]: rubro for rubro in RUBROS}


class ErrorSimulacion(ValueError):
    """El Excel no cuadra con el modelo de datos; el mensaje indica la fila (ID) y el motivo."""


@dataclass(frozen=True)
class FilaSimulada:
    id_origen: int
    negocio: str
    momento: datetime
    respuesta: RespuestasEncuesta


@dataclass(frozen=True)
class ResumenCarga:
    insertadas: int
    omitidas: int


def leer_simulacion(ruta: Path | str) -> list[FilaSimulada]:
    """Lee y valida todas las filas; si alguna no cuadra, falla sin devolver nada."""
    import openpyxl

    libro = openpyxl.load_workbook(ruta, read_only=True, data_only=True)
    try:
        filas = libro[HOJA].iter_rows(values_only=True)
        encabezado = next(filas)
        indice = _indices_de_columnas(encabezado)
        return [
            _leer_fila({clave: valores[i] for clave, i in indice.items()})
            for valores in filas
            if any(v is not None for v in valores)
        ]
    finally:
        libro.close()


def cargar_simulacion(sesion: Session, filas: list[FilaSimulada]) -> ResumenCarga:
    """Inserta las encuestas que falten. No hace commit; lo hace quien llama.

    Es idempotente: una encuesta se considera ya cargada si existe otra de la misma empresa con
    igual fecha, hora y respuestas. Crea las empresas de demostración que falten.
    """
    ids_empresa = asegurar_empresas_demo(sesion)
    existentes = _claves_existentes(sesion, set(ids_empresa.values()))

    insertadas = omitidas = 0
    for fila in filas:
        encuesta = construir_encuesta(ids_empresa[fila.negocio], fila.respuesta, fila.momento)
        encuesta.creado_en = fila.momento
        clave = _clave(encuesta)
        if clave in existentes:
            omitidas += 1
            continue
        sesion.add(encuesta)
        existentes.add(clave)
        insertadas += 1
    sesion.flush()
    return ResumenCarga(insertadas=insertadas, omitidas=omitidas)


def _indices_de_columnas(encabezado: tuple) -> dict[str, int]:
    faltantes = [nombre for nombre in COLUMNAS.values() if nombre not in encabezado]
    if faltantes:
        raise ErrorSimulacion(f"Faltan columnas en la hoja «{HOJA}»: {', '.join(faltantes)}")
    return {clave: encabezado.index(nombre) for clave, nombre in COLUMNAS.items()}


def _leer_fila(celdas: dict) -> FilaSimulada:
    id_origen = celdas["id"]
    prefijo = f"ID {id_origen}"

    negocio = celdas["negocio"]
    if negocio not in _RUBRO_POR_NEGOCIO:
        raise ErrorSimulacion(f"{prefijo}: negocio «{negocio}» no está en las empresas de demostración")
    rubro = _RUBROS_POR_ID[_RUBRO_POR_NEGOCIO[negocio]]
    esperado = (rubro["nombre"], rubro["p3_label"], rubro["p4_label"])
    obtenido = (celdas["rubro"], celdas["atributo_p3"], celdas["atributo_p4"])
    if obtenido != esperado:
        raise ErrorSimulacion(f"{prefijo}: rubro/atributos {obtenido} no coinciden con el catálogo {esperado}")

    fecha, hora = celdas["fecha"], celdas["hora"]
    if isinstance(fecha, datetime):
        fecha = fecha.date()
    if not isinstance(fecha, date) or not isinstance(hora, time):
        raise ErrorSimulacion(f"{prefijo}: fecha/hora inválidas ({fecha!r}, {hora!r})")

    try:
        respuesta = RespuestasEncuesta(
            p1_nps=celdas["p1"],
            p2_csat=celdas["p2"],
            p3_atributo=celdas["p3"],
            p4_atributo=celdas["p4"],
            p5_comentario=celdas["p5"],
        )
    except ValidationError as error:
        raise ErrorSimulacion(f"{prefijo}: respuestas inválidas\n{error}") from error

    momento = datetime.combine(fecha, hora.replace(microsecond=0), tzinfo=ZONA_HORARIA)
    return FilaSimulada(id_origen=id_origen, negocio=negocio, momento=momento, respuesta=respuesta)


def _clave(encuesta: Encuesta) -> tuple:
    return (
        encuesta.empresa_id, encuesta.fecha, encuesta.hora, encuesta.p1_nps, encuesta.p2_csat,
        encuesta.p3_atributo, encuesta.p4_atributo, encuesta.p5_comentario,
    )


def _claves_existentes(sesion: Session, empresa_ids: set[int]) -> set[tuple]:
    encuestas = sesion.scalars(select(Encuesta).where(Encuesta.empresa_id.in_(empresa_ids)))
    return {_clave(encuesta) for encuesta in encuestas}
