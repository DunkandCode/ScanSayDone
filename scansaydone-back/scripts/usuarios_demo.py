"""Credenciales del login de demostración: un usuario por empresa, en dos pasos.

Uso (desde scansaydone-back/, con .env configurado y las migraciones aplicadas):
    python scripts/usuarios_demo.py generar   # crea credenciales_demo.csv (texto plano, fuera de git)
    # → guardar las credenciales antes de seguir
    python scripts/usuarios_demo.py cargar    # cifra las contraseñas y las guarda en dim_usuarios

`generar` no sobrescribe un CSV existente salvo con --forzar. Volver a generar y cargar
cambia las contraseñas.
"""

import argparse
import sys
from pathlib import Path

# Al ejecutar `python scripts/usuarios_demo.py`, la carpeta del script es la primera en
# sys.path; se agrega la raíz del backend para poder importar el paquete `scansaydone`.
RAIZ_BACKEND = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ_BACKEND))

from sqlalchemy.orm import Session  # noqa: E402

from scansaydone.db import obtener_engine  # noqa: E402
from scansaydone.usuarios_demo import (  # noqa: E402
    cargar_credenciales,
    escribir_csv,
    generar_credenciales,
    leer_csv,
)

ARCHIVO = RAIZ_BACKEND / "credenciales_demo.csv"


def generar(archivo: Path, forzar: bool) -> None:
    with Session(obtener_engine()) as sesion:
        credenciales = generar_credenciales(sesion)
    try:
        escribir_csv(archivo, credenciales, forzar=forzar)
    except FileExistsError:
        sys.exit(f"{archivo} ya existe. Usa --forzar para reemplazarlo (las contraseñas cambiarán).")

    print("empresa_id\tusuario\tcontraseña\tnegocio")
    for c in credenciales:
        print(f"{c.empresa_id}\t{c.usuario}\t{c.contrasena}\t{c.nombre_negocio}")
    print(f"\nGuardadas en {archivo}. Respáldalas antes de ejecutar `cargar`; no se suben a git.")


def cargar(archivo: Path) -> None:
    credenciales = leer_csv(archivo)
    with Session(obtener_engine()) as sesion:
        resumen = cargar_credenciales(sesion, credenciales)
        sesion.commit()
    print(f"Creados: {resumen.creados}")
    print(f"Actualizados: {resumen.actualizados}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    acciones = parser.add_subparsers(dest="accion", required=True)
    p_generar = acciones.add_parser("generar", help="Crea el CSV con usuarios y contraseñas en texto plano")
    p_generar.add_argument("--archivo", type=Path, default=ARCHIVO)
    p_generar.add_argument("--forzar", action="store_true", help="Reemplaza el CSV si ya existe")
    p_cargar = acciones.add_parser("cargar", help="Cifra las contraseñas del CSV y las guarda en la base")
    p_cargar.add_argument("--archivo", type=Path, default=ARCHIVO)
    argumentos = parser.parse_args()

    if argumentos.accion == "generar":
        generar(argumentos.archivo, argumentos.forzar)
    else:
        cargar(argumentos.archivo)


if __name__ == "__main__":
    main()
