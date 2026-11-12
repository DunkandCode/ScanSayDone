# Integración frontend ↔ backend — cuestionario y superficie consumible

> **Estado: BORRADOR 2026-11-12.** Documento de trabajo para firmar el contrato de
> integración. No implementa nada y no reemplaza la pauta de reunión.
> Fuente: análisis read-only del árbol `scansaydone-back/` + `docs/reuniones/pauta_reunion_2026-11-11_2100.md`.
> Toda afirmación lleva `archivo:línea`; `sin_evidencia` = el repo no responde.

## 0. Resumen

El backend expone 6 rutas (`scansaydone-back/main.py:52-56`); el par de encuesta son
`GET /api/v1/empresas/{empresa_id}/encuesta` (`routers/empresas.py:20`) y
`POST /api/v1/respuestas` (`routers/respuestas.py:21`). El frontend sigue en marcador
(`scansaydone-front/src/app/(survey)/e/[code]/page.tsx:1-3`) y el panel corre con dataset
estático (`pauta:39-40`).

Bloqueo principal: **no existe mecanismo `code → empresa_id`**. El modelo tiene tres tablas
y ninguna guarda códigos (`scansaydone/models.py:31,45,55`).

## 1. Cuestionario (18 preguntas)

Cada pregunta trae evidencia, default recomendado y qué se rompe si queda sin responder.

### (a) Contrato de rutas

| # | Pregunta | Evidencia | Default recomendado | Si no se responde |
|---|---|---|---|---|
| Q1 | ¿Cuál POST es el canónico? | Implementado: `POST /api/v1/respuestas` (`routers/respuestas.py:20-25`). `docs/roles/01_frontend.md:56` documenta `/api/v1/encuestas/responder`, que **no existe** (`main.py:52-56`) → stale | `/api/v1/respuestas`; corregir `01_frontend.md:56` | 404 en cada envío |
| Q2 | ¿Un POST por encuesta o por pregunta? | Persiste las 5 en una transacción, responde 201 con `encuesta_id` (`respuestas.py:41-63`, `schemas.py:40-41`). No hay endpoint por pregunta | POST único al final; sin autosave | Flujo incremental que el backend rechaza (422) |
| Q3 | ¿Base URL por entorno y quién la define? | CORS por defecto `localhost:3000` + `scansaydone.vercel.app` (`config.py:26`); backend serverless en Vercel (`db.py:22-23`). Variable del front: `sin_evidencia` | `NEXT_PUBLIC_API_URL` por entorno | URL hardcodeada rompe al pasar a prod |
| Q4 | ¿El panel consume endpoints en esta fase? | No hay endpoint de métricas por empresa; dashboard con auth es Sprint 4 (`docs/roles/02_backend.md:74`); falta contrato #17 (`pauta:152-154`) | Panel sigue demo (`panel-data.ts`) | El frontend inventa fetches inexistentes |

### (b) Identidad y QR

| # | Pregunta | Evidencia | Default recomendado | Si no se responde |
|---|---|---|---|---|
| Q5 | ¿Quién resuelve `code` → `empresa_id`? | Ruta string (`page.tsx:1`) vs API int (`empresas.py:25`, `schemas.py:21`). No hay tabla de códigos ni alias ni expiración (`models.py:44-51`); QR solo codifica `target_url` recibido (`routers/qr.py:12`) | En el piloto, `code` = `empresa_id` en string (`/e/1`..`/e/4`) | `/e/[code]` no puede cargar ni las preguntas |
| Q6 | ¿Comportamiento con código desconocido/vencido? | Desconocido → 404 `{"detail": "Empresa no encontrada."}` (`empresas.py:31-32`); «vencido» no existe en el schema (`models.py:44-51`) | Desconocido → pantalla genérica; vencido fuera de MVP | QR viejo = error crudo o spinner infinito |
| Q7 | ¿Qué URL se imprime en el QR? | `GET /api/v1/qr/generate?target_url=...` devuelve PNG (`qr.py:10-14,34`); convención final `sin_evidencia` | `{FRONT_BASE_URL}/e/{empresa_id}` en piloto | QR impresos apuntando a host equivocado |

### (c) Payload y validación

| # | Pregunta | Evidencia | Default recomendado | Si no se responde |
|---|---|---|---|---|
| Q8 | ¿Se adopta el contrato estricto? | `extra="forbid"` (`schemas.py:19`), enteros `strict=True` (`schemas.py:21-25`); tests rechazan `"9"`, `9.0`, `true` y campos extra (`tests/test_respuestas.py:87-98`) | Sí; convertir a `number` antes de enviar | 422 desde el primer submit |
| Q9 | ¿Semántica de P5? | Opcional, strip, máx 300, NUL rechazado, vacío→NULL (`schemas.py:26-37`); 301 chars → 422 (`tests/test_respuestas.py:75-77`); constante `MAX_CARACTERES_COMENTARIO = 300` (`schemas.py:7`) y `max_caracteres` en el GET (`empresas.py:44`) | `maxLength` leído del GET; omitir si vacío | Cortes silenciosos y 422 evitable |
| Q10 | ¿Idempotencia / doble tap? | Sin clave de idempotencia (`schemas.py:12-28`); cada POST inserta fila (`respuestas.py:59-62`); abierto en `pauta:98` | Deshabilitar botón al primer tap | Métricas infladas |

### (d) Datos y campos

| # | Pregunta | Evidencia | Default recomendado | Si no se responde |
|---|---|---|---|---|
| Q11 | ¿Qué campos son server-only? | Derivados calculados server-side (`respuestas.py:34-57`, `reglas.py:31-69`, `nlp.py:27-40`); 201 devuelve **solo** `encuesta_id` (`schemas.py:40-41`, `tests/test_respuestas.py:34-35`) | Enviar solo las 6 claves del payload | 422 o éxito esperando datos que no vienen |
| Q12 | ¿Qué versión del cuestionario se firma (gate #0)? | Tres versiones en `pauta:48-59`; el backend implementa y testea P1 0–10 + P2–P4 1–5 + P5 abierta (`schemas.py:22-28`, `catalogo.py:8-10,22-29`) | Firmar la versión implementada | Nada se construye (`pauta:220`) |

### (e) Errores y estados

| Código | Cuerpo | Fuente |
|---|---|---|
| 404 | `{"detail": "Empresa no encontrada."}` | `empresas.py:32`, `respuestas.py:38` |
| 422 | array FastAPI/Pydantic (`loc/msg/type`); shape no asertado en tests | `tests/test_respuestas.py:96-98` (solo status) |
| 503 | `{"detail": "Servicio no disponible, intenta nuevamente."}` | `main.py:43-46` |
| 400 | solo en `/api/v1/nps/calculate` | `analytics.py:30-31` |
| 500 | QR incluye `str(e)` — fuga de detalle interno | `routers/qr.py:36` |

| # | Pregunta | Default recomendado |
|---|---|---|
| Q13 | ¿Qué cuerpo de error consume la UI? | Manejar 404/422/503 con copia propia; leer `loc` del 422 para resaltar campo |
| Q14 | ¿Qué es "éxito"? | Solo HTTP 201 con `encuesta_id` (`respuestas.py:23`); sin éxito simulado (`pauta:102-103`) |

### (f) Seguridad y entorno

| # | Pregunta | Evidencia | Default recomendado |
|---|---|---|---|
| Q15 | ¿El frontend llama solo a FastAPI? | RLS habilitado **sin políticas** (`alembic/versions/0001_tablas_iniciales.py:83-87`); el backend conecta como dueño de tablas; regla en `docs/roles/02_backend.md:65`; arquitectura en `pauta:105-109` | Sí; cero `supabase-js` en cliente |
| Q16 | ¿Orígenes CORS por entorno? | Defaults + overrides `ALLOWED_ORIGINS` y `ALLOWED_ORIGIN_REGEX` (`config.py:70-80`, `.env.example:7-10`); test de rechazo (`tests/test_cors.py:35-37`) | Defaults + regex para previews `*.vercel.app` |
| Q17 | ¿Qué hace la UI con 429? | No hay rate limit implementado (`requirements.txt:1-9`, `main.py:27-34`); política propuesta con `Retry-After` (`pauta:160-172`, issue #15) | Reservar estado "reintenta más tarde" desde ya |

### (g) Pruebas y entornos

| # | Pregunta | Evidencia | Default recomendado |
|---|---|---|---|
| Q18 | ¿Contra qué datos prueba el frontend? | Tests backend en SQLite en memoria (`tests/conftest.py:16-22`); BD real solo 4 negocios (`demo.py:13-18`); las 80 encuestas **no** están cargadas (`pauta:115-119`) | Probar contra dev con `empresa_id` 1–4; asumir cero historial |

## 2. Archivos que el frontend debe consumir

| Archivo | Qué se consume | Para qué | Estado |
|---|---|---|---|
| `scansaydone-back/scansaydone/routers/empresas.py:20-46` | `GET /api/v1/empresas/{empresa_id}/encuesta` | Nombre, rubro, textos y escalas de las 5 preguntas | Vigente |
| `scansaydone-back/scansaydone/routers/respuestas.py:20-63` | `POST /api/v1/respuestas` → 201 `{encuesta_id}` | Enviar la encuesta completa | Vigente |
| `scansaydone-back/scansaydone/schemas.py:12-70` | `RespuestaEntrada`, `RespuestaCreada`, `EncuestaEmpresa`, `PreguntasEncuesta` | Generar tipos TS de request/response | Vigente |
| `scansaydone-back/scansaydone/routers/general.py:8-20` | `GET /`, `GET /health` | Chequeo de conectividad | Vigente |
| `scansaydone-back/scansaydone/routers/qr.py:10-36` | `GET /api/v1/qr/generate` | QR del local (panel) | Vigente (500 filtra `str(e)`) |
| `scansaydone-back/scansaydone/catalogo.py:8-48` | Textos P1–P5 por rubro | Referencia/fallback; canónico es el GET | Vigente (secundario) |
| `scansaydone-back/scansaydone/config.py:16,26,70-80` + `.env.example:3-10` | Nombres de env y CORS | Saber qué origen permite el navegador | Vigente |
| `scansaydone-back/tests/test_empresas.py:4-30` | JSON exacto del GET | Mocks/MSW con forma real | Vigente |
| `scansaydone-back/tests/test_respuestas.py:16-124` | Payload válido, 201, 404 y 503 | Contratos de mock | Vigente |

**No consumir:** `models.py` (ORM interno), `alembic/**` (provisionamiento), `scripts/seed_demo.py` y `demo.py` (setup del operador), `reglas.py`/`nlp.py`/`metricas.py` (lógica server-side; sus salidas no vuelven al cliente), `db.py` (infraestructura), `docs/roles/01_frontend.md:56` (stale).

## 3. Mapa de campos

| Campo frontend | Pydantic | Columna DB | Tipo / rango | Requerido |
|---|---|---|---|---|
| `empresa_id` | `schemas.py:21` | `dim_empresas.empresa_id` / FK `fact_encuestas.empresa_id` (`models.py:47,79`) | int estricto ≥1 | Sí |
| `p1_nps` | `schemas.py:22` | `fact_encuestas.p1_nps` + CHECK 0–10 (`models.py:57,85`) | int 0–10 | Sí |
| `p2_csat` | `schemas.py:23` | `p2_csat` + CHECK 1–5 (`models.py:58`) | int 1–5 | Sí |
| `p3_atributo` | `schemas.py:24` | `p3_atributo` + CHECK 1–5 (`models.py:59`) | int 1–5 | Sí |
| `p4_atributo` | `schemas.py:25` | `p4_atributo` + CHECK 1–5 (`models.py:60`) | int 1–5 | Sí |
| `p5_comentario` | `schemas.py:26-37` | `p5_comentario` String(300) NULL (`models.py:89`) | str ≤300, strip, sin NUL | No |

Derivados server-only: `encuesta_id`, `fecha`, `hora`, `creado_en`, `categoria_nps`, `alerta`, `tipo_comentario`, `anio`, `mes_nombre`, `semana_anio`, `dia_semana`, `bloque_horario` (`models.py:78-99`; `reglas.py:31-69`; `nlp.py:27-40`).

### Flags

- Sin `question_id`: la posición está implícita en `p1_…`–`p4_…` (`schemas.py:21-25`).
- Sin clave de idempotencia (`schemas.py:12-28`).
- Sin timestamp de cliente: hora 100% server-side (`respuestas.py:29`).
- `escala` llega como par `[min,max]`, no como lista de opciones (`empresas.py:40-44`).
- La URL usa `code: string`; la API exige `empresa_id: int` (`page.tsx:1` vs `empresas.py:25`).

## 4. Brechas bloqueantes, en orden

1. **Gate #0 sin firma** — tres versiones; regla: cero integración API/UI hasta firmar (`pauta:44-62,220`).
2. **No existe `code → empresa_id`** — sin tabla, sin alias, sin endpoint (`models.py:44-51`).
3. **Contrato #14 sin firmar** — resolución de código, POST único vs por pregunta, código inválido (`pauta:72,91-95,220`).
4. **Sin endpoints de métricas/auth para el panel** (`docs/roles/02_backend.md:74`; `pauta:143-144`).
5. **Rate limit ausente** en el POST de respuestas (`pauta:75,160-172`).
6. **Datos demo parciales**: 4 negocios sí, 80 encuestas no (`pauta:115-119`).
7. **Tests solo SQLite**: CHECKs de Postgres, RLS y zona horaria no ejercitados (`conftest.py:16-22`).

## 5. Correcciones detectadas durante el análisis

- `scripts/seed_demo.py` **sí existe** (`scansaydone-back/scripts/seed_demo.py:1-32`); el `[PENDIENTE]` de `pauta:118,243` está resuelto.
- La tercera variante POST `/api/v1/comercios/{id}/respuestas` citada en `pauta:72` ya no aparece en `docs/roles/02_backend.md`; el conflicto vigente es `docs/roles/01_frontend.md:56` (stale) contra el código.
