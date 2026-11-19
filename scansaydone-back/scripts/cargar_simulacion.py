"""Carga las 80 encuestas simuladas del Excel en `fact_encuestas` (issue #16).

Uso (desde scansaydone-back/, con .env configurado, migraciones aplicadas y
`pip install -r requirements-dev.txt`):
    python scripts/cargar_simulacion.py            # carga y guarda
    python scripts/cargar_simulacion.py --prueba   # valida y simula la carga sin guardar nada

Crea las 4 empresas de demostración si faltan. Es idempotente: volver a ejecutarlo no duplica
encuestas.
"""

import argparse
import sys
from pathlib import Path

# Al ejecutar `python scripts/cargar_simulacion.py`, la carpeta del script es la primera en
# sys.path; se agrega la raíz del backend para poder importar el paquete `scansaydone`.
RAIZ_BACKEND = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ_BACKEND))

from sqlalchemy.orm import Session  # noqa: E402

from scansaydone.db import obtener_engine  # noqa: E402
from scansaydone.simulacion import cargar_simulacion, leer_simulacion  # noqa: E402

EXCEL = RAIZ_BACKEND.parent / "docs" / "datos" / "datasets" / "simulacion_80_encuestas.xlsx"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--excel", type=Path, default=EXCEL, help="Ruta del Excel (por defecto, el dataset del repo)")
    parser.add_argument("--prueba", action="store_true", help="Simula la carga y deshace todo al final")
    argumentos = parser.parse_args()

    filas = leer_simulacion(argumentos.excel)
    print(f"Filas leídas y validadas: {len(filas)}")

    with Session(obtener_engine()) as sesion:
        resumen = cargar_simulacion(sesion, filas)
        if argumentos.prueba:
            sesion.rollback()
        else:
            sesion.commit()

    print(f"Insertadas: {resumen.insertadas}")
    print(f"Omitidas (ya estaban cargadas): {resumen.omitidas}")
    if argumentos.prueba:
        print("Modo prueba: no se guardó ningún cambio.")


if __name__ == "__main__":
    main()
