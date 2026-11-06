import os
import subprocess
import sys
from pathlib import Path

RAIZ_BACKEND = Path(__file__).resolve().parent.parent


def test_main_importa_sin_variables_de_entorno():
    """El CI ejecuta `import main` sin base de datos: no debe conectarse ni exigir variables."""
    entorno = {
        k: v
        for k, v in os.environ.items()
        if k not in ("DATABASE_URL", "POSTGRES_URL", "POSTGRES_URL_NON_POOLING")
    }
    codigo = (
        "import main; from scansaydone import db; "
        "assert db.obtener_engine.cache_info().currsize == 0"
    )
    resultado = subprocess.run(
        [sys.executable, "-c", codigo],
        cwd=RAIZ_BACKEND,
        env=entorno,
        capture_output=True,
        text=True,
    )
    assert resultado.returncode == 0, resultado.stderr
