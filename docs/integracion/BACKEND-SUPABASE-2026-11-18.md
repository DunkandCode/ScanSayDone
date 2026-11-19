# Backend — revisión y conexión a Supabase

> **Estado: BORRADOR 2026-11-18.** Revisión estática de los 33 archivos `.py` de
> `scansaydone-back/`. Nadie ejecutó migraciones, seed ni conexiones: es lectura de código.
> Cada afirmación cita `archivo:línea`.

## 1. Inventario (33 archivos)

| Archivo | Líneas | Rol | ¿Importa para Supabase? |
|---|---:|---|---|
| `main.py` | 56 | crea `app`, CORS, handlers 503, monta 5 routers | indirecto |
| `scansaydone/config.py` | 80 | lee env vars, normaliza URL, define prioridades | **sí** |
| `scansaydone/db.py` | 35 | engine diferido + sesión por petición | **sí** |
| `scansaydone/models.py` | 99 | 3 tablas ORM con CHECKs | **sí** |
| `scansaydone/schemas.py` | 70 | contratos Pydantic de entrada/salida | indirecto |
| `scansaydone/catalogo.py` | 49 | preguntas por rubro (4 rubros) | no |
| `scansaydone/reglas.py` | 74 | categoría, alerta, variables de fecha (Chile) | no |
| `scansaydone/nlp.py` | 40 | clasificador léxico de comentarios | no |
| `scansaydone/metricas.py` | 38 | cálculo NPS sin BD | no |
| `scansaydone/demo.py` | 35 | empresas demo idempotentes | indirecto |
| `scansaydone/routers/general.py` | 20 | `/` y `/health` | indirecto |
| `scansaydone/routers/empresas.py` | 46 | GET encuesta (usa sesión) | **sí** |
| `scansaydone/routers/respuestas.py` | 63 | POST respuesta (commit) | **sí** |
| `scansaydone/routers/qr.py` | 36 | PNG de QR | no |
| `scansaydone/routers/analytics.py` | 31 | NPS calculado sin BD | no |
| `alembic/env.py` | 39 | URL de migraciones desde env | **sí** |
| `alembic/versions/0001_tablas_iniciales.py` | 94 | DDL + rubros + RLS | **sí** |
| `scripts/seed_demo.py` | 32 | crea 4 negocios demo | **sí** |
| `tests/*.py` (13) | 673 | suite SQLite en memoria | indirecto |

Arranque: `import main` carga `load_dotenv` (`config.py:13-14`), crea la app (`main.py:19-23`),
CORS (`main.py:27-34`), handlers (`main.py:49-50`) y monta routers (`main.py:52-56`). No hay
lifespan; el engine se crea en la primera petición (`db.py:15-17`). Importar no toca la BD
(`tests/test_importacion.py:16-19`).

## 2. Cadena de conexión

| Propósito | Prioridad | Cita |
|---|---|---|
| URL de la app | `DATABASE_URL` → `POSTGRES_URL` → error si ninguna | `config.py:56-58` |
| URL de Alembic | `POSTGRES_URL_NON_POOLING` → si falta, la de la app | `config.py:62-67` |
| CORS | `ALLOWED_ORIGINS`, `ALLOWED_ORIGIN_REGEX` | `config.py:70-80` |

- El entorno real gana sobre `.env` (`config.py:13`).
- `postgres://` y `postgresql://` se reescriben a `postgresql+psycopg://` y el query se filtra
  a una allowlist; parámetros raros de Supabase se eliminan (`config.py:18-24,33-43`).
- Engine con `NullPool` y `connect_timeout=5`; en PostgreSQL añade
  `prepare_threshold=None` por el pooler (`db.py:20-29`).
- Sesión por petición con `with Session(...)` (`db.py:32-35`); el POST hace `flush` y `commit`
  (`respuestas.py:59-62`). No hay `rollback()` explícito en el repo.
- `OperationalError` y `ConfiguracionError` → 503 sin detalles al cliente (`main.py:37-50`).
  `IntegrityError` no tiene handler → 500 genérico.

## 3. Runbook para conectar (PowerShell, desde `scansaydone-back\`)

1. **Copiar las dos cadenas** del Dashboard (Project Settings → Database):
   - *Transaction pooler, puerto 6543* → `POSTGRES_URL` o `DATABASE_URL` (runtime).
   - *Session/direct, puerto 5432* → `POSTGRES_URL_NON_POOLING` (migraciones).
2. **Crear `.env`**
   ```powershell
   Copy-Item .env.example .env
   ```
   Obligatoria una de: `DATABASE_URL` o `POSTGRES_URL`. Recomendada: `POSTGRES_URL_NON_POOLING`.
3. **Dependencias**
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   pip install -r requirements-dev.txt
   ```
   Para solo servir la API: `pip install -r requirements.txt` (sin `alembic`).
4. **Migrar** (usa `POSTGRES_URL_NON_POOLING`, `env.py:24`)
   ```powershell
   alembic upgrade head
   ```
   Crea 3 tablas, índice, 4 rubros y activa RLS (`0001:21-87`). **Nunca** `downgrade base`: borra las tablas (`0001:90-94`).
5. **Seed demo**
   ```powershell
   python scripts/seed_demo.py
   ```
   Imprime los IDs 1–4 de los negocios (`seed_demo.py:26-28`).
6. **Arrancar y verificar**
   ```powershell
   uvicorn main:app --reload
   ```
   - `http://localhost:8000/health` → `{"status":"ok",...}`. **No toca la BD** (`general.py:18-20`).
   - `http://localhost:8000/api/v1/empresas/1/encuesta` → 200 con preguntas. **Esta sí conecta** (`empresas.py:20-25`).
7. **Probar el POST**
   ```powershell
   Invoke-RestMethod -Method Post -Uri "http://localhost:8000/api/v1/respuestas" `
     -ContentType "application/json" `
     -Body (@{ empresa_id = 1; p1_nps = 9; p2_csat = 5; p3_atributo = 4; p4_atributo = 4;
               p5_comentario = "Los mejores sándwiches de la zona." } | ConvertTo-Json)
   ```
   Esperado: `201` y `{"encuesta_id": N}` (`respuestas.py:20-24`). Enteros estrictos: `"9"`, `9.0`, `true` o campos extra → 422 (`schemas.py:15-25`).

## 4. Errores probables y su arreglo

| Síntoma | Causa | Fix |
|---|---|---|
| `28P01 password authentication failed` | contraseña mal copiada o caracteres especiales sin escape | regenerar password y pegar la URL completa |
| Rechazo por SSL | Supabase exige TLS | `?sslmode=require` (está en la allowlist, `config.py:22-24`) |
| `prepared statement ... does not exist` | migración o sesión larga por el pooler 6543 | migrar por 5432; el runtime ya lo mitiga (`db.py:24`) |
| `42501 permission denied` o 0 filas sin error | rol conectado no es dueño y RLS está sin políticas | usar el rol que corrió `alembic` o crear políticas (`0001:83-87`) |
| 503 en todo, con `/health` en 200 | falta `DATABASE_URL`/`POSTGRES_URL` o host inalcanzable | revisar `.env`; el motivo real va al log (`main.py:42`) |

## 5. Riesgos, por severidad

1. **RLS activo sin políticas** y dependencia del rol dueño (`0001:83-87`). Otra credencial = 42501 o cero filas.
2. **Dos URLs, dos bases posibles**: Alembic usa `POSTGRES_URL_NON_POOLING` y la app otra variable (`config.py:54-67`). Un valor viejo migra una base y sirve otra. El repo no valida que coincidan.
3. **`downgrade()` destruye datos** (`0001:90-94`). Sin backup en el repo.
4. **POST anónimo sin rate limit** (`respuestas.py:20-24`; pendiente #15).
5. **Tests 100% SQLite**: CHECKs, `timestamptz`, pooler y RLS nunca se ejercitan contra Postgres (`tests/conftest.py:16-19`; `tests/test_migracion.py:65-73`).
6. **Secretos**: `.env` está ignorado (`.gitignore:22,28`); riesgo residual de pegar la URL en la consola.

## 6. Decisiones que quedan en tus manos

| Decisión | Estado |
|---|---|
| Esquema destino | No se fija `schema=`; depende del `search_path` (Supabase: `public`) |
| Rol de la app | Asumido «dueño de las tablas»; no hay GRANTs ni usuario dedicado |
| ¿Service role? | No referenciado en el repo |
| Pooler de runtime | `NullPool` ya elegido; falta decidir 6543 vs 5432 en producción |
| Backup antes de migrar | No existe política ni script |
