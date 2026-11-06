"""Clasificador léxico de comentarios (P5).

COPIA FIEL de `clasificar_comentario_nlp` en
docs/datos/scripts_analitica/pipeline_nlp_y_metricas.py. Si cambian las palabras clave
o el orden de prioridad, hay que aplicar el cambio en AMBOS archivos para que el backend
y el análisis del área de datos clasifiquen igual.
"""

PALABRAS_RECLAMO = [
    "malo", "mala", "demorado", "demoraron", "espera", "frío", "defecto", "tardaron", "tarde",
    "seco", "duro", "inferior", "mala calidad", "mala atención", "no entendieron", "aguado",
    "no quedé conforme", "claro", "tardó", "disconforme", "disparejo", "demoró", "demora",
    "demorar", "vencidos", "faltaron", "acaba", "ruidoso", "desorden", "desordenado", "distinto",
    "no era", "sin sabor", "varias veces",
]
PALABRAS_FELICITACION = [
    "excelente", "me encantó", "encantó", "mejor", "mejores", "recomendado", "recomendados",
    "super", "súper", "delicioso", "perfecto", "gracias", "feliz", "rápidos", "amables",
    "buena", "agradable", "felicitacion", "felicitaciones", "felicitar", "entendieron",
    "contenta", "acogedor", "satisfecho", "satisfechos", "rico", "buen", "agradecí",
]
PALABRAS_SUGERENCIA = [
    "podrían", "ojalá", "agregar", "cambiar", "opciones", "variedad", "más", "falta",
]


def clasificar_comentario(texto: str | None) -> str:
    """Devuelve Reclamo, Sugerencia / mixto, Felicitación o Sin comentario."""
    if texto is None or texto.strip() == "":
        return "Sin comentario"

    minusculas = texto.lower()

    if any(palabra in minusculas for palabra in PALABRAS_RECLAMO):
        return "Reclamo"
    if any(palabra in minusculas for palabra in PALABRAS_SUGERENCIA):
        return "Sugerencia / mixto"
    if any(palabra in minusculas for palabra in PALABRAS_FELICITACION):
        return "Felicitación"
    return "Sugerencia / mixto"
