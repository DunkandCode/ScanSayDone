# Pendientes del backend — revisión del 2026-11-19

> **Audiencia:** Juan Pablo Ahumada (`@JuampaCL`, backend) y el operador.
> **Propósito:** handoff tras leer el backend sincronizado y probarlo en local. Qué está correcto, qué falta y qué riesgo tiene cada punto.
> **Jerarquía:** este documento no modifica el contrato. Ante cualquier diferencia, gana `docs/integracion/CONTRATO-API-BACKEND-2026-11-19-JPA.md` (su §0 fija la precedencia de fuentes).

## 1. Qué se revisó y cómo

| Campo | Valor |
|---|---|
| Fecha | 2026-11-19 |
| Rama | `dev/JuampaCL` |
| Commit | `9c320ec` (aportado por la sesión que encargó esta revisión; ver §6) |
| Código | `scansaydone-back/`, lectura de los módulos citados en §2 y §3 |
| Prueba local | servidor contra `dev-simulacion.db`: 80 respuestas, 4 empresas, 20 c/u |
| Tests | `python -m pytest` → **149 passed** (coincide con `CONTRATO-API-BACKEND-2026-11-19-JPA.md:293`) |

El sondeo local (marcado «sondeo» en §3) midió bloques horarios y el formato de `creado_en`. Los datos de ese sondeo son de la sesión del 2026-11-19; no se re-ejecutaron al redactar este documento.

## 2. Qué está correcto

| Aspecto | Verificado en | Detalle |
|---|---|---|
| Fórmulas del agregado | `scansaydone/panel.py:63` (NPS: resta y redondeo a 1 decimal en un solo paso), `panel.py:29-30` (porcentajes a 1 decimal), `panel.py:33-34` (medias a 2 decimales) | Idénticas a las del contrato §5 (`CONTRATO-API-BACKEND-2026-11-19-JPA.md:239-245`) y al pipeline del área de datos (`panel.py:3-9`). |
| Reglas de negocio | `scansaydone/reglas.py:31-37` (Promotor 9-10, Pasivo 7-8, Detractor 0-6), `reglas.py:40-42` (ALERTA si P1 ≤ 6 o P2 ≤ 2), `reglas.py:45-51` (Mañana 06-11, Tarde 12-19, Noche 20-05), `reglas.py:54-69` (derivados temporales en hora de Chile) | Funciones puras, replican el pipeline y el ERD (`reglas.py:1-5`). |
| Clasificación de comentarios | `scansaydone/nlp.py:27-40` | Prioridad Reclamo > Sugerencia > Felicitación; sin coincidencia → «Sugerencia / mixto». Copia fiel del pipeline (`nlp.py:3-6`): backend y área de datos clasifican igual. |
| Dominios protegidos por CHECK | `scansaydone/models.py:57-74` | Rangos de P1–P4 (`:57-60`), `categoria_nps` (`:61-64`), `alerta` (`:65`), `tipo_comentario` (`:66-69`), `semana_anio` (`:70`), `bloque_horario` (`:71-74`). Los invariantes del contrato §5 (`:249-252`), incluido `suma(comentarios) == respuestas`, no se rompen por datos raros. |
| Cifrado de contraseñas | `scansaydone/seguridad.py:14` (PBKDF2-SHA256, 600.000 iteraciones, recomendación OWASP), `seguridad.py:22-28` (sal aleatoria de 16 bytes por contraseña), `seguridad.py:31-40` (comparación en tiempo constante con `hmac.compare_digest`; formato inválido devuelve `False`, sin excepción) | Librería estándar, sin dependencias (`seguridad.py:1-5`). |
| Login | `scansaydone/routers/auth.py:21-23` | Mismo mensaje 401 para usuario inexistente y contraseña errada (no enumera usuarios). Latencia de ~0,3–1 s por el PBKDF2, documentada en `CONTRATO-API-BACKEND-2026-11-19-JPA.md:105`. |

## 3. Pendientes y riesgos

| # | Hallazgo (evidencia) | Severidad | Consecuencia | Recomendación |
|---|---|---|---|---|
| 1 | **`creado_en` local no es UTC ni lleva `Z`.** El contrato §4.2 exige ISO 8601 UTC con `...Z` (`CONTRATO-API-BACKEND-2026-11-19-JPA.md:153`); el sondeo local devolvió `2026-10-31T18:19:00`, sin `Z` e igual a `fecha`+`hora`. Causa: `scansaydone/simulacion.py:143` construye el momento con `tzinfo=ZONA_HORARIA` (Chile, `reglas.py:11`) y `simulacion.py:94` lo asigna a `creado_en`; `scansaydone/models.py:82` declara `DateTime(timezone=True)`, pero el dialecto SQLite guarda la marca sin zona y la devuelve naive. | Media | Un cliente estricto que calcule «hace N días» con `creado_en` se equivoca por 3–4 horas en local. Además conviven dos relojes: las filas del simulador traen hora de Chile (`simulacion.py:94`) y las de `POST /api/v1/respuestas` dejan `creado_en` en el `server_default func.now()` (`models.py:82`; `registro.py:23-40` no lo fija), que en SQLite es UTC. En Supabase ambas rutas quedarían en UTC con `Z` — `sin_evidencia` (no verificado en vivo; el ejemplo del contrato `:193` muestra `2026-10-31T18:20:00Z`). | Normalizar a UTC con `Z` al serializar (p. ej. `field_serializer` en `RespuestaPanel.creado_en`, `schemas.py:164`) o aclarar el caso SQLite en el contrato §4.2. |
| 2 | **Dos implementaciones de NPS.** `scansaydone/panel.py:63` redondea a 1 decimal; `scansaydone/metricas.py:22,36` a 2 decimales y agrega categoría «Excelente/Bueno/Crítico» (`metricas.py:24-29`). El endpoint viejo `POST /api/v1/nps/calculate` usa la segunda (`scansaydone/routers/analytics.py:4,22`) y está fuera del contrato vigente (§4 documenta solo login, panel, encuesta y respuestas, `CONTRATO-API-BACKEND-2026-11-19-JPA.md:80-231`). | Media | Dos fuentes de verdad: el mismo dataset puede informar 25.0 y 25.00, con una categoría extra que el panel no define. | `panel.py` como única fuente; marcar `/nps/calculate` como obsoleto o alinearlo (1 decimal, categoría definida en un solo lugar). |
| 3 | **Redondeo bancario.** `panel.py:30,34,63` usan `round()` nativo de Python: half-even (8.125 → 8.12). Coherente con el pipeline (`panel.py:3-9`). | Baja | Puede diferir ±0.1 de Excel/JS (que redondean half away from zero). No es un bug; es la convención del pipeline. | Documentarlo en el contrato §5 para que nadie lo «corrija» en el cliente. |
| 4 | **Tipo menor.** `scansaydone/schemas.py:137` declara `DiaPanel.media_p1: float`, pero `panel.py:34` puede devolver `None`. Hoy no ocurre: `serie_diaria` solo incluye días con ≥1 respuesta (`panel.py:54-56,76-79`). | Baja | Deuda de tipos: un `None` futuro rompería el tipo sin que cambie la validación. | Declarar `float \| None` en `DiaPanel` o dejar explícito el contrato del campo. |
| 5 | **Sin paginación ni filtro de fechas.** `scansaydone/routers/empresas.py:72-78` carga todo el historial; el contrato lo declara (`CONTRATO-API-BACKEND-2026-11-19-JPA.md:112,263-264`). | Media | El payload del panel crece sin techo junto al historial. | Parámetros `desde`/`hasta` y paginación de `respuestas[]`. |
| 6 | **Sin agregación por bloque horario.** `bloque_horario` existe solo por respuesta (`empresas.py:99`); `AgregadoPanel` (`schemas.py:140-157`) no lo incluye. | Baja | El cliente cuenta. Con 20 filas es barato; con historial real se repite trabajo en cada sesión. | Counts por bloque en `agregado`, solo si se quiere evitar el cálculo en cliente. |
| 7 | **Sin autenticación ni rate limit.** `scansaydone/routers/auth.py:18-19` no emite token (Supabase Auth en el Sprint 4); `empresas.py:65-66` documenta que cualquier `empresa_id` es legible; rate limit pendiente en #15 (`CONTRATO-API-BACKEND-2026-11-19-JPA.md:266`). | Alta (bloqueante para producción; aceptado para la demo) | En producción: paneles de cualquier empresa expuestos y `POST /api/v1/respuestas` sin límite de abuso. | Supabase Auth + protección del panel y rate limit (#15) antes de salir de la demo. |
| 8 | **Bien: dominios protegidos por CHECK.** `categoria_nps`, `alerta` y `tipo_comentario` restringidos en `models.py:61-69`, además de rangos y bloques (`:57-60,70-74`). | — (correcto, sin pendiente) | Ninguna: `suma(comentarios) == respuestas` y los demás invariantes de §5 (`CONTRATO-API-BACKEND-2026-11-19-JPA.md:249-252`) no se rompen por datos raros. | Mantener la migración Alembic 0001 idéntica a los modelos (`models.py:3-4`). |
| 9 | **Dataset local acotado y con sesgo horario.** 80 respuestas, 20 por empresa, 19–31 oct 2026, desde `docs/datos/datasets/simulacion_80_encuestas.xlsx` vía `scripts/cargar_simulacion.py` (`simulacion.py:1-8`; `CONTRATO-API-BACKEND-2026-11-19-JPA.md:281,287`). Sondeo: bloques Mañana/Tarde/Noche por empresa (orden `empresa_id` 1–4) = 2/17/1, 3/17/0, 5/14/1, 5/15/0; sin respuestas entre 21:00 y 08:00. | Informativa | Bloque «Noche» casi vacío (2 de 80). Filtros relativos («últimos 7 días» desde hoy) devuelven vacío (`CONTRATO-API-BACKEND-2026-11-19-JPA.md:267`). | Al incorporar datos reales, revisar que Noche deje de ser marginal antes de mostrar comparativas por bloque. |

## 4. Qué hace el frontend para evitarlos

Compromisos declarados por la sesión del frontend (2026-11-19); no se auditó su código en esta revisión.

1. **No usa `creado_en`** (punto 1): se apoya en `fecha` y `hora`, declaradas en hora de Chile (`CONTRATO-API-BACKEND-2026-11-19-JPA.md:151-152`).
2. **No llama a `POST /api/v1/nps/calculate`** (punto 2): usa `agregado.nps` del panel.
3. **Cuenta bloques en cliente** desde `respuestas[].bloque_horario` (punto 6).
4. **Asume 20 filas por empresa** (dataset de demo, punto 9): no espera historial creciente.
5. **Muestra el conteo de respuestas junto a cada cifra**: evita leer porcentajes sin base (el contrato exige mostrar `respuestas` junto al NPS, `CONTRATO-API-BACKEND-2026-11-19-JPA.md:254-255`).
6. **Muestra el NPS con menos de 30 respuestas como referencial** (metodología, `CONTRATO-API-BACKEND-2026-11-19-JPA.md:254-255`).

## 5. Qué necesitamos del backend

En orden de prioridad para la integración:

1. **Normalizar `creado_en`** (punto 1): UTC con `Z` al serializar, o aclarar el caso SQLite en el contrato §4.2.
2. **Un solo NPS** (punto 2): `panel.py` como fuente única; deprecar o alinear `/api/v1/nps/calculate`.
3. **`bloque_horario` en `agregado`** (punto 6): opcional, solo si se quiere evitar el conteo en cliente.
4. **Paginar y filtrar por rango de fechas** el panel (punto 5).
5. **Rate limit (#15) y autenticación** antes de producción (punto 7).

## 6. Convención de este documento

- Las citas de código son relativas a `scansaydone-back/` (p. ej. `scansaydone/panel.py:63` = `scansaydone-back/scansaydone/panel.py`, línea 63). Las citas de documentos son relativas a la raíz del repo.
- «Sondeo» = medición local del 2026-11-19 contra `dev-simulacion.db`, entregada por la sesión que revisó el backend (stdout citado; no re-ejecutada aquí).
- Marca `sin_evidencia` (afirmado por terceros, no verificado en esta revisión):
  - Comportamiento en vivo de Supabase (que `creado_en` regrese con `Z`); el ejemplo del contrato (`:193`) es evidencia documental, no verificación propia.
  - Rama `dev/JuampaCL` y commit `9c320ec`, aportados por la sesión orquestadora (sin `git log` en esta revisión).
  - Los compromisos del frontend (§4).
