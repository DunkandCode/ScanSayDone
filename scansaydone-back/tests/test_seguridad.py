import pytest

from scansaydone.seguridad import cifrar_contrasena, verificar_contrasena


def test_cifrar_contrasena_usa_pbkdf2_sha256_con_600000_iteraciones():
    assert cifrar_contrasena("secreta123").startswith("pbkdf2_sha256$600000$")


def test_cifrar_contrasena_usa_una_sal_distinta_cada_vez():
    assert cifrar_contrasena("secreta123") != cifrar_contrasena("secreta123")


def test_verificar_contrasena_acepta_la_correcta():
    assert verificar_contrasena("secreta123", cifrar_contrasena("secreta123")) is True


def test_verificar_contrasena_rechaza_otra():
    assert verificar_contrasena("secreta124", cifrar_contrasena("secreta123")) is False


@pytest.mark.parametrize(
    "cifrada",
    ["basura", "", "pbkdf2_sha256$abc$$", "md5$1$c2Fs$aGFzaA==", "pbkdf2_sha256$600000$%%%$%%%"],
)
def test_verificar_contrasena_devuelve_false_si_el_formato_no_es_valido(cifrada):
    assert verificar_contrasena("x", cifrada) is False
