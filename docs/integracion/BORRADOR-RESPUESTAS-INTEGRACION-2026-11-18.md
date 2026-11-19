# Borrador de respuestas — Integración Frontend ↔ Backend (para aprobar en reunión)

> **Estado: BORRADOR (2026-11-18) — SIN FIRMA TODAVÍA.**
> Este documento NO reemplaza [`PREGUNTAS-BACKEND-2026-11-12.md`](PREGUNTAS-BACKEND-2026-11-12.md)
> ni [`REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md`](REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md);
> propone respuestas técnicas verificadas contra el código vigente en `main` (`aed058a`) para
> acelerar la firma en la reunión de hoy.

---

## 1. Respuestas propuestas a `PREGUNTAS-BACKEND-2026-11-12.md` (`Q1`–`Q18`)

### (a) Contrato de rutas

| # | Pregunta | Evidencia verificada | Respuesta recomendada (borrador) | Requiere decisión en reu |
|---|---|---|---|---|
| **Q1** | ¿Cuál `POST` es el canónico? | `scansaydone-back/scansaydone/routers/respuestas.py:20-25` implementa `POST /api/v1/respuestas`. `docs/roles/01_frontend.md:56` cita `/api/v1/encuestas/responder` (inexistente en `main.py:52-56`). | **Canónico: `POST /api/v1/respuestas`.** Actualizar `docs/roles/01_frontend.md:56` para eliminar la ruta antigua. | Solo ratificar |
| **Q2** | ¿Un `POST` por encuesta o por pregunta? | `registrar_respuesta` (`respuestas.py:26-63`) exige las 4 escalas obligatorias + `p5_comentario` opcional en una sola transacción y responde `201` con `encuesta_id`. | **Un único `POST` al enviar la encuesta completa.** Sin *autosave* parcial por pantalla. | Solo ratificar |
| **Q3** | ¿Base URL por entorno y quién la define? | `vercel.json:15-21` ya enruta `/api/(.*)`, `/health`, `/docs` y `/openapi.json` al servicio `backend` bajo el mismo dominio (`main.py:24`). En local, `config.py:16` habilita CORS para `http://localhost:3000`. | **En producción (Vercel): usar rutas relativas (`/api/v1/...`) sobre el mismo origen.** En dev local: leer `NEXT_PUBLIC_API_URL` (p. ej. `http://localhost:8000`, default `""`). | Solo ratificar |
| **Q4** | ¿El panel consume endpoints en esta fase (`#14`)? | No existe endpoint `GET` de resumen por empresa (`analytics.py:22` solo expone `POST /api/v1/nps/calculate` sobre una lista suelta). Auth y dashboard están en Sprint 4 (`docs/roles/02_backend.md:74`). | **No en esta etapa (`#14`).** `/panel` sigue en modo **DEMO** con `panel-data.ts` hasta firmar e implementar el contrato `#17`. | Confirmar prioridad de Sprint 4 |

### (b) Identidad y QR

| # | Pregunta | Evidencia verificada | Respuesta recomendada (borrador) | Requiere decisión en reu |
|---|---|---|---|---|
| **Q5** | ¿Quién resuelve `code` → `empresa_id`? | `page.tsx:1` recibe `code: string`, mientras `empresas.py:25` y `schemas.py:21` exigen `empresa_id: int` (`ge=1`). `models.py:44-51` (`dim_empresas`) no tiene columna `code`/`slug`. | **Elegir entre:**<br>• **Opción A (piloto rápido, cero migración):** `code` = `empresa_id` numérico en string (`/e/1`..`/e/4`), validando entero `≥ 1` en front.<br>• **Opción B (recomendada antes de QR públicos):** agregar columna única `codigo_corto` (ej. `cafe-rincon-andino`) en `dim_empresas` (migración `0002`) y endpoint `GET /api/v1/encuestas/{code}` para evitar enumerar IDs. | **SÍ (decisión clave de `#14`)** |
| **Q6** | ¿Comportamiento con código desconocido/vencido? | `empresas.py:30-32` y `respuestas.py:37-38` retornan `404 {"detail": "Empresa no encontrada."}`. No existe concepto de código vencido en `models.py:44-51`. | **Si el código no es válido o el backend devuelve `404`:** mostrar pantalla amigable *"Esta encuesta no está disponible o el código no existe"* sin spinner infinito. Vencimiento queda fuera del MVP. | Confirmar copia |
| **Q7** | ¿Qué URL se imprime en el QR? | `routers/qr.py:10-36` genera PNG con el `target_url` recibido. En el Issue `#4`, los 4 QR creados el 16 nov apuntan a Google Forms. | **Si el piloto va con la app:** `{FRONT_BASE_URL}/e/{code}` generado vía `/api/v1/qr/generate`. **No imprimir QR** hasta definir Q5 y confirmar App vs Google Forms. | **SÍ (decisión App vs Forms)** |

### (c) Payload y validación

| # | Pregunta | Evidencia verificada | Respuesta recomendada (borrador) | Requiere decisión en reu |
|---|---|---|---|---|
| **Q8** | ¿Se adopta el contrato estricto? | `RespuestaEntrada` (`schemas.py:19-28`) usa `extra="forbid"` y `strict=True` en todos los enteros (`tests/test_respuestas.py:87-98`). | **Sí.** El frontend envía exactamente las 6 claves (o 5 si P5 va vacía/omitida) con tipos `number` puros. | Solo ratificar |
| **Q9** | ¿Semántica de P5? | `schemas.py:7,26-37`: `MAX_CARACTERES_COMENTARIO = 300`, `strip_whitespace=True`, rechaza `\x00`, vacío → `NULL`. El `GET` ya entrega `max_caracteres` (`empresas.py:44`). | **El frontend lee `preguntas.p5.max_caracteres` del `GET`** (`300`), muestra contador `0/300`, hace `trim()`, y si queda vacío envía `null` o omite la clave. | Solo ratificar |
| **Q10** | ¿Idempotencia / doble tap? | No existe token/clave de idempotencia en `schemas.py:12-28` ni `models.py:54-99`; cada `POST` válido inserta fila (`respuestas.py:59-62`). | **MVP:** deshabilitar el botón de envío apenas inicia la petición (`isSubmitting`) + guardar marca temporal en `sessionStorage` para evitar reenvío accidental al recargar; **post-MVP:** clave de idempotencia opcional o control en middleware. | Confirmar alcance MVP |

### (d) Datos y campos

| # | Pregunta | Evidencia verificada | Respuesta recomendada (borrador) | Requiere decisión en reu |
|---|---|---|---|---|
| **Q11** | ¿Qué campos son server-only? | `respuestas.py:40-58`, `reglas.py:31-69` y `nlp.py:27-40` calculan todo en Python. `RespuestaCreada` (`schemas.py:40-41`) solo devuelve `{ "encuesta_id": int }`. | **Confirmado:** cliente envía solo `empresa_id, p1_nps, p2_csat, p3_atributo, p4_atributo, p5_comentario` y no espera métricas ni timestamp de vuelta. | Solo ratificar |
| **Q12** | ¿Qué versión del cuestionario se firma (Gate #0)? | `catalogo.py:8-49`, `models.py:57-60`, `docs/datos/README.md:10-16` y `simulacion_80_encuestas.xlsx` coinciden en las **5 preguntas por rubro** (P1 `0–10`, P2 `1–5`, P3 y P4 `1–5` por rubro, P5 abierta). | **Firmar la versión de 5 preguntas implementada en el backend.** Desbloquea la Variante B de `ENCUESTA-CLIENTE-2026-11-12.md` sin rehacer BD ni API. *(Definir aparte si el rubro "hotelería" del Issue `#4` entra ahora o post-piloto).* | **SÍ (Gate #0 bloqueante)** |

### (e) Errores y estados

| # | Pregunta | Evidencia verificada | Respuesta recomendada (borrador) | Requiere decisión en reu |
|---|---|---|---|---|
| **Q13** | ¿Qué cuerpo de error consume la UI? | `404`: `{"detail": "Empresa no encontrada."}` (`empresas.py:32`, `respuestas.py:38`); `422`: array FastAPI/Pydantic (`loc/msg/type`); `503`: `{"detail": "Servicio no disponible, intenta nuevamente."}` (`main.py:45`). Nota: `routers/qr.py:36` filtra `str(e)` en `500`. | **UI mapea por código HTTP** (`404` código inválido, `422` revisar respuestas leyendo `loc`, `503`/`>=500` error temporal con reintento) sin mostrar `detail` crudo técnico. **Backend:** limpiar `str(e)` en `routers/qr.py:36`. | Confirmar tarea menor backend |
| **Q14** | ¿Qué es "éxito"? | `POST /api/v1/respuestas` retorna `201` con `encuesta_id` (`respuestas.py:23`). `CANON.md:82` prohíbe éxito simulado. | **Solo HTTP `201` con `encuesta_id` válido** muestra la pantalla de agradecimiento. | Solo ratificar |

### (f) Seguridad y entorno

| # | Pregunta | Evidencia verificada | Respuesta recomendada (borrador) | Requiere decisión en reu |
|---|---|---|---|---|
| **Q15** | ¿El frontend llama solo a FastAPI? | `alembic/versions/0001_tablas_iniciales.py:83-87` activa RLS sin políticas públicas; solo FastAPI escribe en BD (`docs/roles/02_backend.md:65`). | **Sí.** Cero `supabase-js` y cero credenciales de BD en `scansaydone-front`; todo pasa por FastAPI. | Solo ratificar |
| **Q16** | ¿Orígenes CORS por entorno? | `config.py:16,66-80` permite `http://localhost:3000`, `https://scansaydone.vercel.app` y soporta `ALLOWED_ORIGINS` + `ALLOWED_ORIGIN_REGEX`. | **Suficiente.** En producción comparten origen (`vercel.json`); para previews de Vercel configurar `ALLOWED_ORIGIN_REGEX` en entorno de Vercel. | Solo ratificar |
| **Q17** | ¿Qué hace la UI con `429`? | No hay *rate limit* implementado aún (`main.py`, `requirements.txt`). | **UI:** mostrar estado específico *"Enviaste varias respuestas seguidas; intenta nuevamente en unos minutos"* (leyendo `Retry-After` si viene). **Backend (`#15`):** definir en reunión almacenamiento del contador para entorno *serverless*. | **SÍ (definir política `#15`)** |

### (g) Pruebas y entornos

| # | Pregunta | Evidencia verificada | Respuesta recomendada (borrador) | Requiere decisión en reu |
|---|---|---|---|---|
| **Q18** | ¿Contra qué datos prueba el frontend? | `demo.py:13-18` ya tiene los 4 nombres exactos de `simulacion_80_encuestas.xlsx` (`Minimarket Don Lucho`, `Café Rincón Andino`, `Peluquería Estilo Sur`, `Cosmos Accesorios (Instagram)`), pero las 80 filas aún no están importadas. | **Para `/e/[code]`:** probar contra los `empresa_id` `1`–`4` en dev/staging + MSW/mocks basados en `test_empresas.py` y `test_respuestas.py`. **En paralelo (`#16`):** crear script para importar las 80 filas a Supabase. | Asignar fecha/owner `#16` |

---

## 2. Respuestas propuestas a `REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md` (`D1`–`D6`)

| # | Decisión abierta | Conflicto / evidencia verificada | Propuesta recomendada (borrador) |
|---|---|---|---|
| **D1** | ¿"Promotores" es `P1 ≥ 9` o `P1 ≥ 8`? | `reglas.py:31-37`, `analytics.py:25-26`, `pipeline_nlp_y_metricas.py:110-111` y Issue `#3` definen **Promotor = `9–10`**. En cambio, `panel-data.ts:120-122` y `panel/page.tsx:90-95` muestran `377` (`8–10`) bajo la etiqueta `"Notas 8-10"`. | **Separar los conceptos para no mentir en la etiqueta:**<br>1) Si el panel muestra `Notas 8-10`, mantener esa etiqueta y **no** llamarlo "Promotores".<br>2) Si se muestra el indicador NPS oficial, usar **`P1 ≥ 9`** (acorde con backend/datos).<br>El endpoint del panel puede devolver **ambos** (`promotores_9_10` y `altas_8_10`) para flexibilidad sin cálculos en cliente. |
| **D2** | ¿Existe `canal` / origen? | `fact_encuestas` (`models.py:54-99`, `alembic/versions/0001_tablas_iniciales.py:40-59`) **no tiene columna `canal`**, y el MVP actual solo captura desde `/e/[code]`. | **Elegir una de dos vías:**<br>• **Vía rápida MVP:** no inventar canales; en el panel real ocultar el bloque *Canales* (o mostrar origen único) hasta tener múltiples canales reales.<br>• **Vía completa:** agregar `canal: str = "qr"` (opcional, enum controlado) en `RespuestaEntrada` + migración `0002`, leyendo `?c=...` en el QR (ej. `qr_mesa`, `qr_caja`, `link`). |
| **D3** | ¿La media del panel es sobre `P1 (0–10)` o `P2 (1–5)`? | `panel-data.ts:115-119` y `panel/page.tsx:88` muestran `Media 8,5 / de 0 a 10` junto al histograma `0–10`. | **La media principal del bloque Resumen es sobre `P1` (`0–10`).** El promedio de `P2` (`1–5`) y atributos `P3`/`P4` (`1–5`) se muestran en una vista/bloque separado si se agregan en Sprint 4. |
| **D4** | ¿Qué significa `points` en serie y canales? | `panel-data.ts:4,34-63,115-118` usa `points` como la **suma de notas `p1_nps`** del día/canal (`4131 / 486 = 8.5`). | **Confirmado:** `points` = `suma_p1` (entero). Permite al panel saber el peso exacto de cada día sin promediar promedios. |
| **D5** | ¿Zona horaria de los cortes diarios? | `reglas.py:11,54-69` ya convierte y guarda `fecha` y `hora` en **`America/Santiago`**. | **Confirmado: `America/Santiago`** para agrupar series diarias y calcular ventanas de `7 / 30 / 90` días. |
| **D6** | ¿Alcance por negocio y autenticación? | `docs/roles/02_backend.md:74` asigna a Sprint 4 los endpoints de dashboard y auth con Supabase Auth. Hoy `panel/page.tsx` es público y estático. | **Conectar `/entrar` con Supabase Auth (JWT)** y vincular cada usuario a su `empresa_id` en backend (tabla puente o claim verificado en FastAPI), protegiendo el `GET /api/v1/empresas/{empresa_id}/resumen` con `Authorization: Bearer <token>`. |

### Notas rápidas sobre el contrato `GET` propuesto (§5 de `REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md`)
1. La estructura propuesta (`periodo`, `totales`, `distribucion`, `canales` según D2, `serie_diaria`, `ultimas`) es totalmente implementable sobre `fact_encuestas` + `dim_empresas`, excepto `canales` si no se agrega columna en D2.
2. **Coherencia con `CANON.md:79-80`:** el endpoint del panel debe devolver cifras crudas (`media_p1`, `promotores_9_10`, `altas_8_10`, `respuestas`, etc.) y fechas ISO 8601; el frontend se encarga de formatear decimales con coma (`8,5`), tiempos relativos y evitar jerga técnica en pantalla.
3. **Datos vacíos:** devolver `distribucion` con los 11 cubos `0..10` en `0` o lista vacía consistente (definir uno solo para que `DistributionChart` no falle al renderizar con `0` respuestas).

---

## 3. Lista de verificación para cerrar hoy en reunión

- [ ] **Decisión App vs Google Forms (`#4`) + rubro hotelería** aprobada.
- [ ] **Q12 / Gate #0** firmado (5 preguntas por rubro).
- [ ] **Q5 (`code → empresa_id`)** elegido (Opción A piloto vs Opción B `codigo_corto`).
- [ ] **Q17 (`#15` rate limit)** definido (umbral + almacenamiento *serverless*).
- [ ] **D1 (`Promotores 9–10` vs `8–10`) y D2 (`canal`)** decididos para Sprint 4 (`#17`).
- [ ] **Fecha y responsable de carga `#16`** (80 filas de `simulacion_80_encuestas.xlsx`).
