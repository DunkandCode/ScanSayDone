import pytest

from scansaydone.nlp import clasificar_comentario


@pytest.mark.parametrize(
    "texto,esperado",
    [
        (None, "Sin comentario"),
        ("", "Sin comentario"),
        ("   \n ", "Sin comentario"),
        ("Los mejores sándwiches de la zona, muy recomendados.", "Felicitación"),
        ("El jugo estaba muy aguado y sin sabor.", "Reclamo"),
        ("Buena atención, ojalá tuvieran más opciones de verduras.", "Sugerencia / mixto"),
        ("El color quedó más claro de lo acordado, no quedé conforme.", "Reclamo"),
        ("Todo normal", "Sugerencia / mixto"),
        ("EXCELENTE servicio", "Felicitación"),
    ],
)
def test_clasificar_comentario(texto, esperado):
    assert clasificar_comentario(texto) == esperado
