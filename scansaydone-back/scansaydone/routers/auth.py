from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from scansaydone.db import get_session
from scansaydone.models import Usuario
from scansaydone.schemas import LoginEntrada, SesionDemo
from scansaydone.seguridad import verificar_contrasena

router = APIRouter()


@router.post("/api/v1/auth/login", response_model=SesionDemo, tags=["Auth"])
def login(datos: LoginEntrada, sesion: Session = Depends(get_session)):
    """
    Login de demostración: valida usuario y contraseña y devuelve la empresa del usuario.

    No abre sesión ni entrega token: el frontend usa el `empresa_id` para pedir el panel.
    En el Sprint 4 se reemplaza por Supabase Auth.
    """
    usuario = sesion.scalar(select(Usuario).where(Usuario.usuario == datos.usuario))
    if usuario is None or not verificar_contrasena(datos.contrasena, usuario.hash_contrasena):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos.")
    return SesionDemo(
        usuario=usuario.usuario,
        empresa_id=usuario.empresa_id,
        nombre_negocio=usuario.empresa.nombre_negocio,
    )
