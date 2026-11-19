"""POST /api/v1/auth/login (login de demostración)."""

import pytest

from scansaydone.models import Usuario
from scansaydone.seguridad import cifrar_contrasena

URL = "/api/v1/auth/login"
NO_AUTORIZADO = {"detail": "Usuario o contraseña incorrectos."}


@pytest.fixture
def usuario_cafe(sesion, empresa_cafe):
    sesion.add(
        Usuario(
            usuario="cafe_rincon_andino",
            hash_contrasena=cifrar_contrasena("Clave123abc"),
            empresa_id=empresa_cafe.empresa_id,
        )
    )
    sesion.commit()
    return empresa_cafe


def test_login_correcto_devuelve_la_empresa(client, usuario_cafe):
    respuesta = client.post(URL, json={"usuario": "cafe_rincon_andino", "contrasena": "Clave123abc"})

    assert respuesta.status_code == 200
    assert respuesta.json() == {
        "usuario": "cafe_rincon_andino",
        "empresa_id": usuario_cafe.empresa_id,
        "nombre_negocio": "Café Rincón Andino",
    }


def test_login_ignora_mayusculas_y_espacios_en_el_usuario(client, usuario_cafe):
    respuesta = client.post(URL, json={"usuario": " Cafe_Rincon_Andino ", "contrasena": "Clave123abc"})

    assert respuesta.status_code == 200
    assert respuesta.json()["usuario"] == "cafe_rincon_andino"


@pytest.mark.parametrize(
    "cuerpo",
    [
        {"usuario": "cafe_rincon_andino", "contrasena": "otra"},
        {"usuario": "no_existe", "contrasena": "Clave123abc"},
        {"usuario": "cafe_rincon_andino", "contrasena": " Clave123abc"},
    ],
)
def test_login_incorrecto_responde_401_con_el_mismo_mensaje(client, usuario_cafe, cuerpo):
    respuesta = client.post(URL, json=cuerpo)

    assert respuesta.status_code == 401
    assert respuesta.json() == NO_AUTORIZADO


@pytest.mark.parametrize(
    "cuerpo",
    [
        {"usuario": "cafe_rincon_andino", "contrasena": "   "},
        {"usuario": "", "contrasena": "Clave123abc"},
        {"usuario": "cafe_rincon_andino"},
        {"usuario": "cafe_rincon_andino", "contrasena": "Clave123abc", "empresa_id": 1},
        {"usuario": "x" * 41, "contrasena": "Clave123abc"},
        {"usuario": "cafe_rincon_andino", "contrasena": "x" * 129},
    ],
)
def test_login_con_cuerpo_invalido_responde_422(client, usuario_cafe, cuerpo):
    assert client.post(URL, json=cuerpo).status_code == 422
