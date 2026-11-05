# DASHBOARD-AUDITORIA — reconciliación de conceptos (30-oct-2026)

> auditor: architect-alibaba · zero src/ changes · fuentes: `DASHBOARD-UX.md` (27-oct), `PANEL-UX.md` (30-oct), `VERIFICACION-PANEL.md`, `DESIGN-CONTRACT.md`, `GRID-SPEC.md`, `_tokens.scss`, `package.json`, `src/app/panel/page.jsx`, `src/app/data/panel-demo.js`, planos `d01-d04.svg`
> búsquedas: **RAG: 8 queries × 0 resultados** (corpus sano, 248K chunks, gap=0; términos "sidebar", "dashboard density", "empty state", "responsive table" sin hits en FTS ni semántico) → afirmaciones sin cita RAG marcadas **[criterio propio]** · **[context7: /twbs/bootstrap v5.3.3]** (offcanvas responsive) · **[mdn: css.properties.position.sticky]** (Chrome 56+, Safari 13+, Edge 16+) · **[mdn: html.elements.nav]** (soporte universal)

---

## 1 · Tabla de contradicciones

| tema | DASHBOARD-UX 27-oct | PANEL-UX 30-oct / código real | veredicto |
|---|---|---|---|
| **sidebar vs sin sidebar** | shell 264 px fijo, 3 destinos (overview/opiniones/respuestas) | cabecera 64 px, pantalla única, cero navegación lateral | **sin sidebar** · PANEL-UX gana: no hay backend que sostenga 3 rutas; sidebar exige auth + routing + permisos que no existen; 264 px roban ancho al contenido en 1024 (C=712 vs 1140) [context7: .offcanvas-lg arriba de lg = static, abajo drawer; pero sin contenido que navegar, el drawer es teatro] [criterio propio: MVP = 1 pantalla] |
| **4 KPIs vs 3 tarjetas de distribución** | 4 tarjetas 264×112: OPINIONES / CON COMENTARIO / DIAS CON RESPUESTA / SIN RESPONDER | 3 tarjetas 364×256: una por pregunta (Q1/Q2/Q3) con barras 1–5 + total | **3 tarjetas por pregunta** · PANEL-UX gana: el producto ES 3 preguntas cerradas (no "opiniones" genéricas); 4 KPIs exigen backend que agregue por periodo; barras 1–5 se derivan de `PANEL_TOTALS` (ya implementado, zero backend) [criterio propio: fidelidad al modelo de datos real] |
| **gráfico Recharts vs barras div** | Recharts `BarChart` en `ResponsiveContainer`, span-8 = 744 px, cifras sobre barra | barras `<div>` + tokens (`--surface-2` track, `--action-bg` relleno), zero librería | **barras div** · PANEL-UX gana: **Recharts NO está en `package.json`** (verificado: 0 dependencias de gráficos); añadir Recharts = +~180 KB gzip sin backend que lo justifique; `<div>` + `width: ${n/total*100}%` basta para n≤5 filas [criterio propio: peso vs valor] |
| **paginación vs lista sin paginar** | 10 por página (Miller), ghost Anterior/Siguiente ≥44 px | lista plana de 8 filas demo, cero paginación | **sin paginación** · PANEL-UX gana: n=8 demo; sin backend no hay cursor ni offset; VERIFICACION-PANEL §7 #4 anota "paginación cuando haya >50 respuestas" como pendiente backend [criterio propio: prohibido inventar pagination UI sin datos] |
| **cola de alertas con estados + "Responder" vs solo lectura** | filtro Todas/Sin responder/En revisión/Resueltas; badge estado; botón "Responder" abre borrador; `aria-live` "Respuesta marcada" | solo lectura: filas con 3 dígitos, cero acciones, cero estados | **solo lectura** · PANEL-UX gana: "prohibido inventar acciones (no hay botón que responda porque no hay backend que envíe)" (regla dura); estados de alerta exigen modelo `alert.response_id` (DASHBOARD-UX §2.3) que no existe [criterio propio: honestidad > features ficticias] |
| **"opiniones con comentario" vs 3 preguntas cerradas** | lista cruda con extracto ≤90 car. de texto literal, filtros por puntuación y canal | tabla con fecha + canal + 3 chips (Q1/Q2/Q3 dígitos 1–5), cero texto libre | **3 preguntas cerradas** · PANEL-UX gana: `PANEL_DEMO_ROWS` solo tiene `answers: [5,4,4]` (3 dígitos); DASHBOARD-UX asume comentario libre que la encuesta no pide (COPY-INTERNAS §2 #7: Q2/Q3 no redactadas aún); texto literal exigiría PII review (DASHBOARD-DECISIONES §2) [criterio propio: alineado con `panel-demo.js`] |
| **4 métricas con n≥20 vs absolutos sin umbral** | tabla de umbrales: n=0 → "—"; n=1–9 → absolutos + aviso; n=10–19 → absolutos + etiqueta verbal; n≥20 → % y tendencia | totales absolutos (Q1: 1→0, 2→1, 3→1, 4→2, 5→4); cero %, cero avisos "pocos clientes" | **absolutos sin umbral** · PANEL-UX gana: n=8 demo (<20) → regla DASHBOARD-UX §3 prohíbe %; PANEL-UX no muestra avisos "aun son pocos clientes" porque el dataset es fijo, no real; when backend: aplicar tabla de umbrales [criterio propio: consistencia con `PANEL_TOTALS` derivados] |
| **vocabulario vetado** | usa "KPI", "OPINIONES", "ALERTAS ABIERTAS" (rótulos de tarjeta) | "RESPUESTAS RECIBIDAS", "AÚN NADA QUE LEER", cero "KPI/CSAT/NPS/score/dashboard/insights/tiempo real" | **PANEL-UX gana** · COPY-INTERNAS §2 y DASHBOARD-UX §3 prohíben vocabulario jerga; d01 usa "ALERTAS ABIERTAS" (vetado); PANEL-UX usa español de mostrador [criterio propio: regla dura COPY-INTERNAS] |
| **mostaza ≤5 %** | d01: alerta warning `#F5F0E8` + barra lateral `#986A1E` (mostaza familia) = ~2 % de 900 px alto | PANEL-UX: badge demo mostaza `#F4B63B` = 0.4 % (PANEL-UX §3) | **ambos cumplen** · d01 ≤5 % ✓; PANEL-UX ≤5 % ✓; regla dura DESIGN-CONTRACT §6 [criterio propio: medición visual] |
| **coral nunca como texto sobre claro** | d01: barra coral `#FF5F44` sobre blanco (3.01 ≥3.0 no-texto ✓) | PANEL-UX: relleno de barra coral/blanco 3.01 ✓; cero texto coral | **ambos cumplen** · DESIGN-CONTRACT §1 P0 [criterio propio: ratio medido] |

---

## 2 · Veredicto por plano

| plano | ¿sirve como está? | qué sobra | qué falta | decisión |
|---|---|---|---|---|
| **d01-overview.svg** | **no** | sidebar 264 (inexistente en código); 4 KPIs (código tiene 3 tarjetas); gráfico Recharts (no instalado); tarjeta de alerta (sin modelo); "ALERTAS ABIERTAS" (vocabulario vetado) | título "LO QUE DICEN TUS CLIENTES" (PANEL-UX §2); 3 tarjetas por pregunta; switch demo | **rehacer** · el plano dibuja un dashboard que el producto no es; si se reemite, debe ser 11-panel.svg (PANEL-UX) con sidebar añadido post-backend |
| **d02-opiniones.svg** | **no** | sidebar; lista cruda con extractos de texto (no hay comentario en encuesta); paginación Miller (sin backend); filtros con lógica (inertes en código); "URGENTE" badge (sin modelo de alerta) | tabla con 3 columnas de respuesta (Q1/Q2/Q3); chips de canal inertes; estado vacío "AÚN NADA QUE LEER" | **rehacer** · el plano asume texto literal y paginación que PANEL-UX §7 explícitamente prohíbe; la bandeja de `panel/page.jsx` es la fuente de verdad |
| **d03-respuestas.svg** | **no** | sidebar; cola de alertas con estados (sin modelo); botón "RESPONDER" (sin backend que envíe); botón "MARCAR ATENDIDA" (sin modelo de datos); bloque "TEXTO LITERAL DEL CLIENTE" (encuesta no pide comentario) | nada aprovechable: el concepto de "detalle con causa + acción" exige backend completo | **archivar** · DASHBOARD-DECISIONES §2 documenta el riesgo de "respuestas crudas"; hasta que exista `alert.response_id` y endpoint `POST /api/respond`, este plano es ficción |
| **d04-mobile.svg** | **no** | sidebar drawer (sin contenido); 4 KPIs 2×2 (código tiene 3 tarjetas); gráfico 180 px (sin Recharts); lista de opiniones con texto (sin comentario) | layout de 11-panel.svg a 375 px: tarjetas 343 px apiladas; tabla → filas-tarjeta; switch demo + badge | **rehacer** · PANEL-UX §5 ya define responsive (1024/768/375); el plano móvil debe reflejar `panel/page.jsx` (3 tarjetas + tabla → filas-tarjeta), no d01 comprimido |

**veredicto agregado**: los 4 planos d01–d04 son **obsoletos** porque dibujan el concepto 27-oct (sidebar + 3 destinos + alertas) que PANEL-UX 30-oct y `/panel` ya reemplazaron. **No se pueden reemitir tal cual** — exigen redibujo completo desde `11-panel.svg` + código real. Los planos originales quedan como registro histórico en `opendesign/wireframes/` (no borrar: documentan la evolución).

---

## 3 · Propuesta de DASHBOARD v2 (alcance que sí se puede construir hoy)

### 3.a ¿sidebar sí o pantalla única?

**recomendación: pantalla única (PANEL-UX = el dashboard)**

argumento a favor de sidebar:
- DASHBOARD-UX §1 define shell profesional (264 px = 11 gutters); premium-web-design admite 7 ítems máx.
- 3 destinos + ajustes = navegación clara cuando haya backend

argumento a favor de pantalla única:
- **no hay backend** → sidebar sin contenido que navegar es teatro
- `/panel` ya implementado (VERIFICACION-PANEL.md) con 1 pantalla, zero routing
- PANEL-UX §7: "sidebar, menú, rutas hijas, 3 destinos — el brief lo fija: una pantalla"
- 1024 px: sidebar 264 roba 23 % del ancho (C=712 vs 1140); en móvil el drawer overlay bloquea el contenido

**veredicto: pantalla única hasta que exista backend** · cuando haya `GET /api/respuestas` + auth, evaluar sidebar con 3 destinos (overview/opiniones/respuestas) + ajustes; hasta entonces, `/panel` ES el dashboard.

### 3.b si recomiendas sidebar (futuro post-backend)

ítems exactos (máximo 4, español de mostrador):
| # | nombre | ruta | icono (react-icons set `md`) |
|---|---|---|---|
| 1 | resumen | `/panel` | `FiHome` |
| 2 | respuestas | `/panel/respuestas` | `FiMessageSquare` |
| 3 | mi qr | `/panel/qr` | `FiSmartphone` |
| 4 | ajustes | `/panel/ajustes` | `FiSettings` |

**prohibido**: "opiniones" (separado de "respuestas"), "alertas" (es filtro, no destino), "dashboard" (vocabulario vetado).

móvil: drawer overlay con `.offcanvas-lg` (context7: arriba de lg = static, abajo = drawer); hamburguesa 44×44 en topbar; foco atrapado + Esc cierra + devuelve foco al hamburguesa (DASHBOARD-UX §8).

### 3.c inventario de secciones (pantalla única actual)

| sección | alto | retícula | tokens |
|---|---|---|---|
| cabecera de app | 64 px | full-bleed blanco `--surface` + borde inferior 1 px `--border` | logo 108×36 + separador 1×24 `--border-strong` + overline "PANEL" 13/600 MAYÚS `--text-2` |
| título + subtítulo | py-top 32 + H1 42 + subtítulo 24 + ancla 16 + py-bot 28 = 142 px | container-xl 1140 | H1 Bebas 44 `--text-1` · subtítulo M 16/400 `--text-2` · ancla M 13/500 `--text-2` |
| resumen (3 tarjetas) | 256 px | 3 × span-4 = 364 px · gap 24 (3×364 + 2×24 = 1140 ✓) | tarjeta: bg `--surface` · borde 1 px `--border` · radio `--radius-card` 12 · pregunta h3 M 16/600 · barras: track `--surface-2` h 10 rx 5 · relleno `--action-bg` · cifra Bebas 28 · overline "RESPUESTAS" M 12 |
| modo demo | fila 44 + línea 20 = 64 px | container 1140 | switch 48×28 en objetivo 44 · label M 15/500 · badge M 11/600 MAYÚS .1em mostaza/ciruela 8.45 ✓ |
| filtros (inertes) | 44 px | container 1140 | 5 chips h 44 rx 8 · activo: borde 2 px ciruela + check; inerte: `--surface-2` + `--text-2` + `cursor: not-allowed` · rango fechas: 2 inputs h 44 × 150 |
| bandeja | overline 16 + 12 + th 74 + filas 56 × n | container 1140 · th: pad 20 + 2 líneas 13/600 · filas: pad 20 + 1 línea 14 | celdas: fecha 144 · canal 156 · 3 respuestas 232 c/u · 4 gutters 24 → 144+156+3×232+96=1092 ✓ |
| estado vacío | bloque centrado máx 420 | container 1140 | overline "AÚN NADA QUE LEER" M 13/600 MAYÚS `--text-2` · título M 18/600 `--text-1` · texto M 16/400 `--text-2` · CTA ghost "Ver con datos de ejemplo" |

**retícula**: PANEL-UX §2 usa `container-xl` 1140 (GRID-SPEC §2 xl); GRID-SPEC no se rompe porque 1140 es breakpoint oficial Bootstrap; col 73 = (1140−264)/12; span-4 = 4×73 + 3×24 = 364 ✓.

### 3.d qué NO entra hasta backend

| feature | por qué no entra | requisito backend |
|---|---|---|
| gráficos Recharts | `package.json` no tiene Recharts; barras `<div>` bastan para n≤5 | `GET /api/respuestas?agrupar=dia` + serie temporal |
| paginación | sin datos reales, paginar es teatro | `GET /api/respuestas?limit=10&offset=0` + cursor |
| cola de alertas con estados | modelo `alert.response_id` no existe | tabla `alerts` + `POST /api/alertas/:id/marcar-atendida` |
| botón "Responder" | sin endpoint que envíe respuesta al cliente | `POST /api/respuestas/:id/responder` + plantilla de correo |
| filtros con lógica | chips e inputs inertes (`disabled`) | querystring parser + `GET /api/respuestas?canal=mostrador&desde=...` |
| texto literal del cliente | encuesta no pide comentario libre (solo 3 dígitos 1–5) | Q2/Q3 aprobadas (COPY-INTERNAS §2 #7) + campo comentario opcional |
| umbrales n≥20 (%, tendencia) | n=8 demo (<20) → regla DASHBOARD-UX §3 prohíbe % | dataset real >20 respuestas + agregación por periodo |

### 3.e migración de `/panel`

**estado actual**: `/panel` es pantalla única (PANEL-UX) con estado vacío + demo + sin conexión.

**ruta final**: `/panel` se queda como está (no se renombra, no se convierte en sección).

**cuando haya backend**:
- opción A (recomendada): `/panel` sigue siendo pantalla única; cuando se apruebe sidebar, `/panel` = `/panel/resumen` (redirect) + layout con sidebar que envuelve las 3 rutas hijas (`/panel/respuestas`, `/panel/qr`, `/panel/ajustes`).
- opción B (descartada): envolver `/panel` en sidebar ahora → sidebar vacío sin contenido que navegar; viola "prohibido inventar acciones".

**no se renombra**: `/panel` ya está documentado en VERIFICACION-PANEL.md, `layout.js` tiene `metadata: Panel`, `robots: noindex` heredado; cambiar ruta = romper bookmarks y docs.

---

## 4 · Riesgos (máximo 5, ordenados)

| # | riesgo | impacto | mitigación |
|---|---|---|---|
| 1 | **planos obsoletos confunden al operador** · d01–d04 dibujan dashboard con sidebar + alertas que no existen en código | operador pide features que no se pueden construir (botón "Responder", cola de alertas) | archivar d01–d04 en `opendesign/wireframes/obsoletos/` + nota "reemplazados por 11-panel.svg (PANEL-UX 30-oct)" |
| 2 | **Q2/Q3 no aprobadas** · COPY-INTERNAS §2 #7: "redacción exacta de las 3 preguntas" pendiente | `panel-demo.js` usa candidatas "[confirmar]"; publicar con texto provisional = retractación | decidir Q2/Q3 antes de piloto; hasta entonces, modo demo con candidatas marcadas "[propuesta]" |
| 3 | **Recharts tentación** · DASHBOARD-UX §2.1 menciona `BarChart`; operador puede exigir gráfico | añadir Recharts = +180 KB sin backend; barras `<div>` ya funcionan | regla dura: zero librerías de gráficos hasta que `GET /api/respuestas` exista; si se aprueba gráfico, evaluar `<svg>` nativo antes que Recharts |
| 4 | **vocabulario vetado en docs** · DASHBOARD-UX usa "KPI", "ALERTAS ABIERTAS"; si se implementa literal, viola COPY-INTERNAS | panel con jerga ("KPI", "CSAT") = ruptura de voz | grep pre-commit: `grep -E "KPI|CSAT|NPS|score|dashboard|insights|tiempo real" src/app/panel/` = 0; si hit, bloquear commit |
| 5 | **mostaza >5 % en futuros planos** · d01 alerta warning = ~2 %; si se añaden más alertas, se supera umbral | violating DESIGN-CONTRACT §6 = slop | regla: máx 1 alerta visible por pantalla (DASHBOARD-UX §2.1); si hay 2+, mostrar solo la más urgente + enlace "Ver todas" |

---

## 5 · Decisiones que NO puedes tomar tú (requieren operador)

| # | decisión | opción recomendada | por qué no la tomo yo |
|---|---|---|---|
| 1 | **¿sidebar ahora o post-backend?** | pantalla única ahora (PANEL-UX); sidebar post-backend (3 destinos + ajustes) | decisión de producto: sidebar exige backend + auth + routing; si operador quiere sidebar ahora, debe aprobar backend primero |
| 2 | **¿redibujo d01–d04 o archivo?** | archivar en `obsoletos/` + nota de reemplazo | decisión de documentación: si operador quiere planos actualizados, requiere redibujo completo desde 11-panel.svg (costo: 2–4 h de designer) |
| 3 | **¿Q2/Q3 definitivas?** | aprobar candidatas de PANEL-UX §2 o redactar nuevas | decisión de copy: Q2 "¿Volverías?" y Q3 "¿Qué mejorarías?" están marcadas "[confirmar]" en COPY-INTERNAS §2 #7; solo operador aprueba texto final |
| 4 | **¿publicar `/panel` con modo demo o esperar backend?** | publicar con demo ahora (VERIFICACION-PANEL.md ya verificado); backend después | decisión de lanzamiento: demo es honesto (badge "DATOS DE EJEMPLO"); si operador prefiere esperar, requiere backend en 2–4 semanas |
| 5 | **¿permitir texto literal del cliente (comentario libre)?** | no hasta que encuesta tenga campo comentario opcional + PII review (DASHBOARD-DECISIONES §2) | decisión legal: texto libre exige política de retención + aviso "no escribas datos personales" + revisión legal (COPY-INTERNAS §2 #5); hasta entonces, solo 3 dígitos 1–5 |

---

## cierre

**recomendación**: pantalla única (PANEL-UX = el dashboard) hasta backend; archivar d01–d04; aprobar Q2/Q3; publicar `/panel` con demo.

**contradicciones graves**: (1) sidebar vs sin sidebar · (2) 4 KPIs vs 3 tarjetas · (3) cola de alertas con "Responder" vs solo lectura.

**veredicto planos**: d01 rehacer · d02 rehacer · d03 archivar · d04 rehacer.

**decisiones operador**: 5 ítems en §5 (sidebar, planos, Q2/Q3, publicar demo, texto literal).
