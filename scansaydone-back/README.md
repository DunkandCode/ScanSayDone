# ScanSayDone Backend

API REST en Python (FastAPI) que guarda las encuestas de satisfacción de 5 preguntas enviadas desde el código QR, calcula las variables derivadas (categoría NPS, alerta, tipo de comentario y variables temporales) y genera los códigos QR. Los datos viven en PostgreSQL (Supabase).

## Estructura

```text
scansaydone-back/
├── main.py                  # Crea `app`: CORS, manejadores 503 y routers
├── scansaydone/
│   ├── config.py            # Variables de entorno (no se conecta a la BD al importar)
│   ├── db.py                # Engine creado en el primer uso y dependencia `get_session`
│   ├── models.py            # Tablas del ERD: dim_rubros, dim_empresas, fact_encuestas
│   ├── catalogo.py          # Preguntas y etiquetas P3/P4/P5 de los 4 rubros
│   ├── schemas.py           # Modelos Pydantic de entrada y salida
│   ├── reglas.py            # Categoría NPS, alerta y variables temporales (hora de Chile)
│   ├── nlp.py               # Clasificador de comentarios (copia del pipeline de datos)
│   ├── metricas.py          # Cálculo del NPS
│   ├── demo.py              # Negocios de demostración
│   └── routers/             # general, qr, analytics, respuestas, empresas
├── alembic/                 # Migraciones (0001: tablas iniciales con RLS)
├── scripts/seed_demo.py     # Crea los negocios de demostración
└── tests/                   # pytest (SQLite en memoria; no necesita Supabase)
```

## Puesta en marcha

Desde `scansaydone-back/`:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1      # Mac/Linux: source venv/bin/activate
pip install -r requirements-dev.txt
uvicorn main:app --reload        # http://localhost:8000/docs (Swagger)
```

`requirements.txt` es lo que se despliega; `requirements-dev.txt` agrega `pytest`, `httpx` y `alembic`.

## Variables de entorno

Copia `.env.example` a `.env` (está ignorado por git; nunca lo subas). Las variables `POSTGRES_*` las crea la integración de Supabase en Vercel.

| Variable | Uso |
| :--- | :--- |
| `POSTGRES_URL` | Conexión de la aplicación (pooler de Supabase). |
| `POSTGRES_URL_NON_POOLING` | Conexión directa, usada por las migraciones. |
| `DATABASE_URL` | Opcional; si existe, tiene prioridad sobre `POSTGRES_URL`. |
| `ALLOWED_ORIGINS` | Opcional; orígenes CORS separados por comas (por defecto `http://localhost:3000` y `https://scansaydone.vercel.app`). |
| `ALLOWED_ORIGIN_REGEX` | Opcional; expresión regular de orígenes permitidos (vistas previas de Vercel). |

La aplicación acepta las URLs tal como las entrega Supabase (`postgres://...`) y elimina los parámetros que el driver no reconoce.

## Base de datos

```powershell
alembic upgrade head             # crea las tablas, los 4 rubros y activa RLS
python scripts/seed_demo.py      # crea los 4 negocios de demostración y muestra sus IDs
```

- **RLS:** las tres tablas tienen RLS activado y sin políticas, así que la API pública de Supabase no puede leer ni escribir. Solo este backend accede a los datos; el frontend debe enviar las respuestas con `POST /api/v1/respuestas`.
- **`seed_demo.py`** es idempotente. Los IDs que imprime sirven para cargar el dataset de 80 encuestas simuladas.
- Si cambias `models.py`, crea una migración nueva: una prueba falla si el esquema migrado y los modelos difieren.

## Pruebas

```powershell
python -m pytest
```

Usan SQLite en memoria, así que no necesitan Supabase ni variables de entorno. Lo específico de PostgreSQL (RLS, pooler) se verifica a mano contra Supabase.

## Endpoints

| Método | Ruta | Descripción |
| :---: | :--- | :--- |
| `GET` | `/health` | Chequeo de salud del servicio. |
| `GET` | `/api/v1/qr/generate?target_url=...` | Genera una imagen PNG del código QR. |
| `POST` | `/api/v1/nps/calculate` | Recibe una lista de notas `[10, 9, 8, 4]` y devuelve el NPS y su categoría. |
| `GET` | `/api/v1/empresas/{empresa_id}/encuesta` | Negocio y textos de las 5 preguntas de su rubro. |
| `POST` | `/api/v1/respuestas` | Registra una encuesta anónima. |

### `POST /api/v1/respuestas`

Público, sin login. Los enteros deben ser números JSON (`9`, no `"9"` ni `9.0`) y no se aceptan campos extra.

```json
{
  "empresa_id": 2,
  "p1_nps": 9,
  "p2_csat": 5,
  "p3_atributo": 4,
  "p4_atributo": 4,
  "p5_comentario": "Los mejores sándwiches de la zona."
}
```

| Campo | Regla |
| :--- | :--- |
| `empresa_id` | Entero entre 1 y 2147483647. |
| `p1_nps` | Entero de 0 a 10. |
| `p2_csat`, `p3_atributo`, `p4_atributo` | Entero de 1 a 5. |
| `p5_comentario` | Opcional. Se le quitan los espacios de los extremos; si queda vacío se guarda como `NULL`. Máximo 300 caracteres. |

El servidor calcula `categoria_nps`, `alerta` (P1 ≤ 6 o P2 ≤ 2), `tipo_comentario` y las variables temporales con la hora de Chile (`America/Santiago`).

Respuestas:

- `201` → `{"encuesta_id": 81}`
- `404` → `{"detail": "Empresa no encontrada."}`
- `422` → error de validación de FastAPI.
- `503` → `{"detail": "Servicio no disponible, intenta nuevamente."}` si la base de datos no responde o falta configuración. El motivo queda en los logs.

### `GET /api/v1/empresas/{empresa_id}/encuesta`

```json
{
  "empresa_id": 2,
  "nombre_negocio": "Café Rincón Andino",
  "rubro": "Cafetería / restaurante",
  "preguntas": {
    "p1": {"texto": "¿Qué tan probable es que recomiendes el negocio a un amigo o familiar?", "escala": [0, 10]},
    "p2": {"texto": "En general, ¿qué tan satisfecho/a quedaste?", "escala": [1, 5]},
    "p3": {"texto": "¿Cómo calificas el sabor y la calidad de lo que consumiste?", "etiqueta": "Calidad del producto", "escala": [1, 5]},
    "p4": {"texto": "¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?", "etiqueta": "Tiempo de servicio", "escala": [1, 5]},
    "p5": {"texto": "¿Qué podríamos hacer para que tu próxima visita sea mejor?", "max_caracteres": 300}
  }
}
```

Devuelve `404` si la empresa no existe.

## Despliegue

Está previsto desplegarlo en el mismo proyecto de Vercel que el frontend, mediante Vercel Services: `/api/...` llega a este backend y el resto al frontend. La configuración y su validación en una vista previa están descritas en `docs/superpowers/specs/2026-11-05-backend-respuestas-design.md` (sección «Despliegue en Vercel»).

## Pendiente

- Rate limiting por IP y sanitización de comentarios (#15).
- Carga del dataset de 80 encuestas y validación de fórmulas (#16).
- Endpoints de métricas del dashboard y autenticación con Supabase Auth (Sprint 4).
