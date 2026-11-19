# Pauta reunión miércoles — 18 de noviembre de 2026 (Dinámica 30-30-30)

> **Estado:** Propuesta de pauta para la reunión de hoy. Integra los acuerdos pendientes de
> [`pauta_reunion_2026-11-11_2100.md`](pauta_reunion_2026-11-11_2100.md) con el estado real
> de `main` (`aed058a`) y los avances recientes en GitHub Issues (`#3`, `#4`, `#7`).
> Formato basado en [`protocolo_reunion_miercoles.md`](../instrucciones/protocolo_reunion_miercoles.md).

---

## 1. Objetivo de la reunión

Salir con **6 decisiones técnicas cerradas y firmadas** para desbloquear la integración
Frontend ↔ Backend (`#14`, `#17`), la carga de datos demo (`#16`), el *rate limiting* (`#15`)
y definir un único camino oficial para el piloto con comercios reales.

**Regla de cierre:** ningún tema queda "en el aire"; cada punto termina con decisión
registrada en la sección 5 (*Registro de acuerdos*) u owner con fecha.

---

## 2. Bloque 1 — Revisión rápida y orden del repositorio (25 min)

### 2.1 Qué ya está en `main` (`aed058a`)
- **Backend (`#12` y `#13`):** API FastAPI en `scansaydone-back/` con modelos SQLAlchemy,
  migración Alembic con RLS (`0001_tablas_iniciales.py`), `seed_demo.py` para 4 negocios,
  `GET /api/v1/empresas/{empresa_id}/encuesta`, `POST /api/v1/respuestas`,
  `GET /api/v1/qr/generate`, cálculo NPS/alertas/NLP y tests (`pytest`).
- **Frontend (`1fafbff` + `aed058a`):** landing completa, `/entrar` (UI), `/panel` (demo con
  dataset estático), suite `vitest` + `a11y`, scripts operativos (`dev-saydone.bat`,
  `scripts/dev-servers.ps1`), planos y wireframes (en **borrador**) de `/e/[code]` y gestión
  de encuesta en el panel, además de los docs en `docs/integracion/`.
- **Marcador pendiente:** `/e/[code]` sigue en marcador `<h1>Encuesta</h1>`.

### 2.2 Revisión de avances de Datos y Validación (Bernarda — `2026-11-16`)
- **Issue `#7` (cerrado):** estudio de validación del problema (12 encuestas a PyMEs:
  91,7 % aceptaría QR si es breve, 50 % tuvo reclamos tardíos, 66,7 % pagaría si es barato)
  y auditoría de cifras a corregir antes de presentar a evaluadores.
- **Issue `#3` (abierto):** modelo de cálculo (NPS, CSAT, promedios P3/P4, alertas y fórmulas
  para Google Sheets).
- **Issue `#4` (abierto):** script de Google Apps Script que creó 4 Google Forms + 4 imágenes
  QR apuntando a esos formularios, más propuesta de sumar un 5.º rubro (*hotelería*).
- **Pendiente de orden documental:** bajar los archivos adjuntos/documentos de `#3` y `#4`
  a `docs/` mediante commit/PR para cumplir la *Definition of Done*.

### 2.3 Higiene de repositorio y seguridad (5 min)
1. Todo el equipo actualiza sus ramas locales desde `origin/main` (`git pull origin main`).
2. Confirmar eliminación/archivo de la rama obsoleta `dev/nicolaslopezv` (del 5 nov).
3. Aprobar actualización de `next@16.4.3` en `scansaydone-front/package.json` por aviso de
   vulnerabilidad detectado en `next build`.

---

## 3. Bloque 2 — 6 decisiones técnicas bloqueantes (35 min)

> Para agilizar esta sección, revisar previamente el borrador de respuestas propuesto en
> [`docs/integracion/BORRADOR-RESPUESTAS-INTEGRACION-2026-11-18.md`](../integracion/BORRADOR-RESPUESTAS-INTEGRACION-2026-11-18.md).

### Decisión 1 — Unificar el MVP del piloto: ¿App propia (`/e/[code]`) o Google Forms (`#4`)?
- **Conflicto actual:** los QR subidos en el Issue `#4` apuntan a Google Forms (sin control de
  duplicados ni alerta por correo activa), mientras nuestra app Next.js + FastAPI + Supabase
  ya tiene lista la BD y el `POST /api/v1/respuestas`.
- **Qué decidir:**
  1. ¿El piloto con comercios reales usará `/e/[code]` de ScanSayDone o Google Forms como respaldo?
     *(Si vamos con la app, **no imprimir** los QR de Google Forms).*
  2. ¿El 5.º rubro **hotelería** entra ahora o queda para después del piloto?

### Decisión 2 — Gate #0: Versión oficial del cuestionario
- **Hecho:** el backend (`catalogo.py`, `models.py`, `schemas.py`) y `simulacion_80_encuestas.xlsx`
  implementan **5 preguntas por rubro** (P1 `0–10`, P2 `1–5`, P3 y P4 `1–5` por rubro, P5 abierta ≤ 300).
- **Qué decidir:** ratificar y firmar esta versión de 5 preguntas para desbloquear la
  construcción de la Variante B en [`ENCUESTA-CLIENTE-2026-11-12.md`](../frontend/planos/ENCUESTA-CLIENTE-2026-11-12.md).

### Decisión 3 — Contrato `#14` para conectar `/e/[code]` (`Q1`–`Q18`)
- **Puntos críticos de [`PREGUNTAS-BACKEND-2026-11-12.md`](../integracion/PREGUNTAS-BACKEND-2026-11-12.md):**
  - **Q5 (`code → empresa_id`):** en el piloto, ¿`code` = `empresa_id` (`/e/1`..`/e/4`, sin migración)
    o agregamos columna `slug` / código único en `dim_empresas` (migración `0002`)?
  - **Q1–Q3:** confirmar `POST /api/v1/respuestas` único al final (corregir doc stale `01_frontend.md:56`)
    y ruta relativa `/api/v1/...` en prod vía `vercel.json` + `NEXT_PUBLIC_API_URL` en dev.
  - **Q6, Q10, Q13:** pantalla amigable en `404`, deshabilitar botón al primer submit y lectura
    de errores `422`/`503`.

### Decisión 4 — Contrato `#17` del Dashboard `/panel` (`D1`–`D6`)
- **Puntos críticos de [`REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md`](../integracion/REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md):**
  - **D1 (Promotores):** alinear el tercer KPI (`9–10` = Promotores en backend/datos vs `8–10`
    actual en la maqueta `/panel`).
  - **D2 (Canales):** `fact_encuestas` no tiene columna `canal`. ¿Se agrega `canal` al modelo
    o se oculta/pospone el bloque *Canales* en el MVP?
  - **D3/D4/D5:** confirmar media sobre `p1_nps`, `points` = suma de `p1_nps`, y cortes en
    `America/Santiago`.
  - **D6 (Auth por comercio):** definir flujo de sesión entre `/entrar` y `/panel` (Sprint 4).

### Decisión 5 — Datos demo (`#16`) y clasificación de comentarios (`#3` vs `nlp.py`)
- **Carga de 80 encuestas:** definir quién y cuándo ejecuta el script de importación desde
  `docs/datos/datasets/simulacion_80_encuestas.xlsx` hacia `fact_encuestas` en Supabase
  (los 4 nombres en `demo.py` ya coinciden 1:1 con el Excel).
- **NLP de P5:** confirmar si para el MVP se mantienen las 3 categorías ya implementadas en
  `nlp.py` (`Felicitación`, `Reclamo`, `Sugerencia / mixto`) y se deja para después la
  taxonomía de 6 temas + tono del Issue `#3`.

### Decisión 6 — Seguridad y alertas (`#15`)
- **Rate limit en `POST /api/v1/respuestas`:** definir límite por IP/ventana y dónde vive el
  estado (importante porque el backend corre *serverless* en Vercel).
- **Alertas inmediatas:** el backend ya marca `alerta = "ALERTA"` cuando `P1 ≤ 6` o `P2 ≤ 2`,
  pero aún no envía correo. Definir si el aviso por correo al dueño entra en este sprint.

---

## 4. Bloque 3 — Sprint Planning y compromisos (30 min)

### Objetivo sugerido del Sprint
> *"Tener la encuesta móvil `/e/[code]` desplegada en Vercel recibiendo respuestas reales en
> Supabase con rate limiting, las 80 encuestas demo cargadas y el contrato del panel cerrado."*

### Propuesta de asignación (ajustar y confirmar en la reunión)

| Responsable | Tareas sugeridas | Issues |
|---|---|---|
| **Nicolás** (`@nicolaslopezv`) | Actualizar `next@16.4.3`; construir `/e/[code]` según plano firmado y conectarlo a `GET encuesta` y `POST /api/v1/respuestas` | `#14` |
| **Juampa** (`@JuampaCL`) | Definir `code → empresa_id` (si aplica migración); endpoint resumen para `/panel`; corregir fuga `str(e)` en `routers/qr.py:36`; apoyar carga `#16` | `#14`, `#16`, `#17` |
| **Bernarda** (`@bernarda2020163`) | Versionar entregables de `#3` y `#4` en `docs/`; validar/ejecutar carga de las 80 filas del Excel en Supabase; corregir resumen de validación `#7` | `#3`, `#4`, `#16` |
| **Daniel** (`@DGRcodex`) | Middleware/política de *rate limiting* en `POST /api/v1/respuestas`; pruebas contra Postgres/RLS y deploy en Vercel; actualizar `01_frontend.md:56` y acta | `#15`, `#19`, `#20`, `#23` |
| **Thomas** (`@thomasrain05-design`) | Revisión final de wireframes de encuesta/gestión en `docs/frontend/wireframes/`; coordinar QR finales (apuntando a la URL acordada) y pauta de piloto | `#4`, `#9`, `#21` |

---

## 5. Registro de acuerdos (llenar durante la reunión)

| # | Tema / Decisión | Acuerdo firmado | Owner | Fecha compromiso | Estado |
|---|---|---|---|---|---|
| 1 | Piloto: App vs Google Forms + rubro hotelería | | | | |
| 2 | Gate #0: cuestionario oficial de 5 preguntas | | | | |
| 3 | Contrato `#14`: `code → empresa_id` y endpoints | | | | |
| 4 | Contrato `#17`: D1 (8–10 vs 9–10), D2 (`canal`) y Auth | | | | |
| 5 | Datos `#16` y NLP (`nlp.py` vs `#3`) | | | | |
| 6 | Seguridad `#15`: rate limit + alertas + upgrade Next.js | | | | |

---

## 6. Mensaje corto para copiar en Discord

```text
Equipo, pauta para la reunión de hoy (miércoles, formato 30-30-30):

Ya quedó en `main` (aed058a) el merge con los planos/wireframes de encuesta, docs de integración y scripts de dev.
En la reu de hoy tenemos que cerrar 6 decisiones para destrabar el sprint:
1) Piloto: confirmar si los QR reales apuntan a nuestra app (/e/[code]) o a Google Forms, y si hotelería entra ahora o post-MVP.
2) Gate #0: ratificar el cuestionario de 5 preguntas que ya está en el backend.
3) Contrato #14: resolver `code -> empresa_id` y cerrar las 18 preguntas de `docs/integracion/PREGUNTAS-BACKEND-2026-11-12.md`.
4) Contrato #17: resolver D1–D6 de `docs/integracion/REQUISITOS-FRONTEND-DASHBOARD-2026-11-12.md` (sobre todo Promotores 9-10 vs 8-10 y columna `canal`).
5) Datos #16: cargar las 80 encuestas del Excel en Supabase y subir a `docs/` los avances de los issues #3 y #4.
6) Seguridad #15: definir rate limiting en POST /api/v1/respuestas y actualizar Next.js 16.4.3.

Dejé la pauta completa y un borrador de respuestas técnicas ya pre-llenado para revisar rápido en la reu:
- docs/reuniones/pauta_reunion_2026-11-18.md
- docs/integracion/BORRADOR-RESPUESTAS-INTEGRACION-2026-11-18.md
```
