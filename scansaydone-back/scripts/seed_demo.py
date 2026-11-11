"""Crea los negocios de demostración en la base de datos y muestra sus IDs.

Uso (desde scansaydone-back/, con .env configurado y las migraciones aplicadas):
    python scripts/seed_demo.py

Es idempotente: se puede ejecutar varias veces sin duplicar negocios.
"""

import sys
from pathlib import Path

# Al ejecutar `python scripts/seed_demo.py`, la carpeta del script es la primera en sys.path;
# se agrega la raíz del backend para poder importar el paquete `scansaydone`.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.orm import Session  # noqa: E402

from scansaydone.db import obtener_engine  # noqa: E402
from scansaydone.demo import asegurar_empresas_demo  # noqa: E402


def main() -> None:
    with Session(obtener_engine()) as sesion:
        ids = asegurar_empresas_demo(sesion)
        sesion.commit()
    print("empresa_id\tnegocio")
    for nombre, empresa_id in ids.items():
        print(f"{empresa_id}\t{nombre}")


if __name__ == "__main__":
    main()
