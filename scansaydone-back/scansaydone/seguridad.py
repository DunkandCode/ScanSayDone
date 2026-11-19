"""Cifrado de contraseñas con PBKDF2-SHA256 (librería estándar, sin dependencias).

Formato guardado: `pbkdf2_sha256$<iteraciones>$<sal base64>$<hash base64>`.
Es para el login de demostración; en el Sprint 4 se reemplaza por Supabase Auth.
"""

import base64
import binascii
import hashlib
import hmac
import secrets

ALGORITMO = "pbkdf2_sha256"
ITERACIONES = 600_000  # recomendación OWASP para PBKDF2-SHA256
BYTES_SAL = 16


def _derivar(texto: str, sal: bytes, iteraciones: int) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", texto.encode("utf-8"), sal, iteraciones)


def cifrar_contrasena(texto: str) -> str:
    """Devuelve la contraseña cifrada con una sal aleatoria, lista para guardar."""
    sal = secrets.token_bytes(BYTES_SAL)
    hash_ = _derivar(texto, sal, ITERACIONES)
    return "$".join(
        (ALGORITMO, str(ITERACIONES), base64.b64encode(sal).decode(), base64.b64encode(hash_).decode())
    )


def verificar_contrasena(texto: str, cifrada: str) -> bool:
    """True si `texto` corresponde a `cifrada`. Un formato inválido devuelve False, nunca falla."""
    try:
        algoritmo, iteraciones, sal, esperado = cifrada.split("$")
        if algoritmo != ALGORITMO:
            return False
        calculado = _derivar(texto, base64.b64decode(sal, validate=True), int(iteraciones))
        return hmac.compare_digest(calculado, base64.b64decode(esperado, validate=True))
    except (ValueError, binascii.Error):
        return False
