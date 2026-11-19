"""Credenciales del login de demostración, en dos pasos.

1. `generar_credenciales` + `escribir_csv`: un usuario por empresa con contraseña aleatoria,
   en texto plano en un CSV local (fuera de git) para poder guardarlas.
2. `leer_csv` + `cargar_credenciales`: cifra las contraseñas y las guarda en `dim_usuarios`.

Diseño: docs/integracion/BACKEND-LOGIN-Y-PANEL-2026-11-18.md (§6.3).
"""

import csv
import re
import secrets
import string
import unicodedata
from dataclasses import astuple, dataclass, fields
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from scansaydone.models import Empresa, Usuario
from scansaydone.seguridad import cifrar_contrasena

LARGO_CONTRASENA = 12
LARGO_MAX_USUARIO = 40
ALFABETO = string.ascii_letters + string.digits


@dataclass(frozen=True)
class Credencial:
    usuario: str
    contrasena: str
    empresa_id: int
    nombre_negocio: str


@dataclass(frozen=True)
class ResumenUsuarios:
    creados: int
    actualizados: int


COLUMNAS = [campo.name for campo in fields(Credencial)]


def nombre_usuario(nombre_negocio: str) -> str:
    """`Café Rincón Andino (X)` → `cafe_rincon_andino`: minúsculas, sin tildes ni paréntesis."""
    sin_parentesis = re.sub(r"\([^)]*\)", " ", nombre_negocio)
    sin_tildes = unicodedata.normalize("NFKD", sin_parentesis).encode("ascii", "ignore").decode()
    palabras = re.findall(r"[a-z0-9]+", sin_tildes.lower())
    return "_".join(palabras)[:LARGO_MAX_USUARIO]


def generar_credenciales(sesion: Session) -> list[Credencial]:
    """Una credencial por empresa, en orden de `empresa_id`. No escribe en la base."""
    credenciales = []
    usados: set[str] = set()
    for empresa in sesion.scalars(select(Empresa).order_by(Empresa.empresa_id)):
        usuario = nombre_usuario(empresa.nombre_negocio)
        if usuario in usados:
            sufijo = f"_{empresa.empresa_id}"
            usuario = usuario[: LARGO_MAX_USUARIO - len(sufijo)] + sufijo
        usados.add(usuario)
        contrasena = "".join(secrets.choice(ALFABETO) for _ in range(LARGO_CONTRASENA))
        credenciales.append(Credencial(usuario, contrasena, empresa.empresa_id, empresa.nombre_negocio))
    return credenciales


def escribir_csv(ruta: Path | str, credenciales: list[Credencial], forzar: bool = False) -> None:
    """Escribe el CSV (UTF-8 con BOM, para que Excel muestre bien las tildes).

    Sin `forzar`, falla con `FileExistsError` si el archivo ya existe.
    """
    with open(ruta, "w" if forzar else "x", encoding="utf-8-sig", newline="") as archivo:
        escritor = csv.writer(archivo)
        escritor.writerow(COLUMNAS)
        escritor.writerows(astuple(c) for c in credenciales)


def leer_csv(ruta: Path | str) -> list[Credencial]:
    with open(ruta, encoding="utf-8-sig", newline="") as archivo:
        return [
            Credencial(fila["usuario"], fila["contrasena"], int(fila["empresa_id"]), fila["nombre_negocio"])
            for fila in csv.DictReader(archivo)
        ]


def cargar_credenciales(sesion: Session, credenciales: list[Credencial]) -> ResumenUsuarios:
    """Cifra y guarda: crea los usuarios nuevos y actualiza la contraseña de los existentes.

    Valida todas las empresas antes de escribir: si falta alguna, lanza `ValueError` y no
    toca la base. No hace commit; lo hace quien llama.
    """
    ids_pedidos = {c.empresa_id for c in credenciales}
    ids_existentes = set(sesion.scalars(select(Empresa.empresa_id).where(Empresa.empresa_id.in_(ids_pedidos))))
    faltantes = sorted(ids_pedidos - ids_existentes)
    if faltantes:
        raise ValueError(f"Empresas inexistentes en dim_empresas: {faltantes}")

    creados = actualizados = 0
    for credencial in credenciales:
        hash_contrasena = cifrar_contrasena(credencial.contrasena)
        usuario = sesion.scalar(select(Usuario).where(Usuario.usuario == credencial.usuario))
        if usuario is None:
            sesion.add(
                Usuario(
                    usuario=credencial.usuario,
                    hash_contrasena=hash_contrasena,
                    empresa_id=credencial.empresa_id,
                )
            )
            creados += 1
        else:
            usuario.hash_contrasena = hash_contrasena
            usuario.empresa_id = credencial.empresa_id
            actualizados += 1
    sesion.flush()
    return ResumenUsuarios(creados=creados, actualizados=actualizados)
