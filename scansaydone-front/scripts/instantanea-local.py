# -*- coding: utf-8 -*-
"""Instantánea local para el frontend: vuelca `dev-local.db` a JSON.

Abre la base de datos SQLite en modo SOLO LECTURA (URI `?mode=ro`) y genera
`src/data/local-snapshot.json` para que el panel se construya sobre datos reales
de desarrollo sin depender del backend levantado.

Uso:
    python scripts/instantanea-local.py [--db RUTA] [--out RUTA]

Por defecto:
    --db  ../scansaydone-back/dev-local.db   (relativo a este archivo)
    --out src/data/local-snapshot.json       (raíz del frontend)
"""
from __future__ import annotations

import argparse
import json
import sqlite3
import sys
from datetime import date, datetime, time
from pathlib import Path

CARPETA_SCRIPT = Path(__file__).resolve().parent
RAIZ_FRONT = CARPETA_SCRIPT.parent
DB_POR_DEFECTO = RAIZ_FRONT.parent / "scansaydone-back" / "dev-local.db"
SALIDA_POR_DEFECTO = RAIZ_FRONT / "src" / "data" / "local-snapshot.json"

SQL_EMPRESAS = """
SELECT
    e.empresa_id,
    e.nombre_negocio,
    e.rubro_id,
    r.nombre   AS rubro,
    r.p3_label,
    r.p4_label
FROM dim_empresas AS e
JOIN dim_rubros   AS r ON r.rubro_id = e.rubro_id
ORDER BY e.empresa_id;
"""

SQL_RESPUESTAS = """
SELECT
    empresa_id,
    p1_nps,
    p2_csat,
    p3_atributo,
    p4_atributo,
    p5_comentario,
    fecha,
    hora,
    categoria_nps,
    alerta,
    tipo_comentario,
    bloque_horario,
    dia_semana,
    semana_anio,
    anio,
    mes_nombre
FROM fact_encuestas
ORDER BY empresa_id, encuesta_id;
"""


def serializar(valor: object) -> object:
    """Convierte date/time de SQLite a texto ISO para JSON."""
    if isinstance(valor, (date, datetime, time)):
        return valor.isoformat()
    return valor


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Genera src/data/local-snapshot.json desde la SQLite local (solo lectura)."
    )
    parser.add_argument(
        "--db",
        default=str(DB_POR_DEFECTO),
        help=f"Ruta de la SQLite (por defecto: {DB_POR_DEFECTO})",
    )
    parser.add_argument(
        "--out",
        default=str(SALIDA_POR_DEFECTO),
        help=f"Ruta del JSON de salida (por defecto: {SALIDA_POR_DEFECTO})",
    )
    args = parser.parse_args()

    db = Path(args.db)
    if not db.is_file():
        print(f"ERROR: no existe la base de datos {db}", file=sys.stderr)
        return 1

    # Solo lectura: si el archivo no existiera o perdiera permisos, la conexión falla.
    conexion = sqlite3.connect(f"file:{db.as_posix()}?mode=ro", uri=True)
    conexion.row_factory = sqlite3.Row
    try:
        empresas = [
            {clave: serializar(fila[clave]) for clave in fila.keys()}
            for fila in conexion.execute(SQL_EMPRESAS)
        ]
        respuestas = [
            {clave: serializar(fila[clave]) for clave in fila.keys()}
            for fila in conexion.execute(SQL_RESPUESTAS)
        ]
    finally:
        conexion.close()

    salida = Path(args.out)
    salida.parent.mkdir(parents=True, exist_ok=True)
    instantanea = {
        "generado_en": datetime.now().isoformat(timespec="seconds"),
        "fuente": "dev-local.db (SQLite local)",
        "empresas": empresas,
        "respuestas": respuestas,
    }
    with open(salida, "w", encoding="utf-8", newline="\n") as destino:
        json.dump(instantanea, destino, ensure_ascii=False, indent=2)
        destino.write("\n")

    tamano = salida.stat().st_size
    print(f"OK {salida}")
    print(f"empresas={len(empresas)} respuestas={len(respuestas)} bytes={tamano}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
