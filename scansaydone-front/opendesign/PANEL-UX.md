# PANEL-UX — destino del login: el panel del dueño (diseño, no implementado)

> 30-oct-2026 · designer-alibaba · cero código de producto · plano métrico: `wireframes/11-panel.svg` (PNG en `wireframes/png/`).
> Normas: `DESIGN-CONTRACT.md` §1/§3/§4/§5/§6 · retícula `wireframes/GRID-SPEC.md` · voz `COPY-INTERNAS.md` · sucesor de la pantalla única de `DASHBOARD-UX.md` (aquel concepto tenía sidebar y 3 destinos; este MVP es **una pantalla, sin sidebar**; las reglas de datos de §3 de aquel doc siguen vigentes aquí).
> Preguntas: **Q1 `¿Cómo fue tu atención?` es texto real del repo** (`src/app/page.js:38` y `src/app/entrar/page.jsx:199`). Q2/Q3 **no están redactados en `src/app/data/` ni en `COPY-LANDING.md`** (open item 7 de `COPY-INTERNAS.md §2`): se usan las candidatas del brief marcadas `[confirmar]`. Escala real cerrada: 1–5 con etiqueta verbal `Muy mala · Mala · Regular · Buena · Muy buena` (`UX-LANDING.md:69-70`, `VERIFICACION-F2` #12).
> Todo texto `[propuesta]` espera aprobación del operador. Contrastes medidos con fórmula WCAG en esta sesión.

## 1. Objetivo y público

- El dueño del local que ya entró por `/entrar`: **viene a leer**, no a operar. Tarea única: ver qué contestaron sus clientes por pregunta y poder revisar las respuestas una a una.
- **Qué NO es:** no es el login (ya pasó), no es la encuesta del cliente (esa no pide identidad y no tiene panel), no es un dashboard de métricas: no hay backend — todo conteo, porcentaje o tendencia que el producto no pueda respaldar está prohibido en esta pantalla.

## 2. Anatomía (1440×900 · contenedor `container-xl` 1140, col 73, gutters 24, aires 150)

**Título de la pantalla — 2 opciones y veredicto:**

| Opción | texto | veredicto |
|---|---|---|
| A | `LO QUE DICEN TUS CLIENTES` | ✅ **elegida** `[propuesta]` — cierra la pregunta del hero de la landing (`¿QUÉ DICEN TUS CLIENTES?`) en forma de respuesta; presente habitual: funciona con 0 datos y con 8; ninguna cifra ni evento inventado (precedente: `LOGIN-UX §4.a`) |
| B | `TUS CLIENTES YA CONTESTARON` | ❌ descarta — el estado por defecto es vacío; pretérito que afirma un evento que puede no existir (misma razón por la que LOGIN-UX descartó su variante) |

| # | bloque | geometría (px) | contenido y estilo |
|---|---|---|---|
| 0 | cabecera de app | **h 64** · full-bleed blanco `--surface` · borde inferior 1 px `--border` · contenido alineado al container | izq: logo 108×36 (`brand-src/logo-symbol.svg`, variante oscura) + separador 1×24 `--border-strong` + `PANEL` overline; der: enlaces `Volver al sitio` → `/` y `Salir` → `/entrar`, `--link` subrayado, objetivo táctil 44 (pad y 10) |
| 1 | título | py-top 32 · H1 Bebas 44 lh .95 (h 42) · +8 · subtítulo M 16/400 `--text-2` (h 24) · +10 · ancla de escala M 13/500 `--text-2` (h 16) · py-bot 28 | sub: `Las respuestas de tus clientes, ordenadas por pregunta.` `[propuesta]` · ancla: `Cada pregunta se califica del 1 (muy mala) al 5 (muy buena).` `[propuesta]` |
| 2 | resumen | **3 tarjetas span-4 = 364** · gap 24 (3×364+2×24=1140 ✓) · **h 256** · radio `--radius-card` 12 · borde 1 px `--border` · blanco · **sin sombra** | interno: pad 24 · pregunta h3 M 16/600 ciruela (h 24) · +8 · **5 filas de barras h 20 gap 8** (132) · +16 · pie: cifra Bebas 28 + `RESPUESTAS` overline 12 (h 28) = 24+24+8+132+16+28+24 = 256 ✓. Fila de barra: dígito escala 16 · track `--surface-2` h 10 rx 5 de 264 · relleno coral ancho = n/total · count M 13/600 tabular. Sin librería de gráficos: `div` + tokens |
| 3 | modo demo | fila h 44 · +10 · línea aclaratoria h 20 | switch 48×28 en objetivo 44 (OFF: track `--border-strong` + knob ciruela; ON: track ciruela + knob crema + check `FiCheck` — posición + icono, nunca solo color) · label `Ver con datos de ejemplo` M 15/500 `[propuesta]` · ON añade badge `DATOS DE EJEMPLO` (M 11/600 MAYÚS .1em · mostaza fondo / ciruela 8.45 ✓ · h 24 rx 4) y línea: `Estas respuestas son un ejemplo para ver la pantalla llena. No vienen de clientes reales.` `[propuesta]` 14/400 `--text-2` |
| 4 | filtros (estructura, sin lógica) | fila h 44 · py 28 arriba | izq: 5 chips exactos `Todos · Mostrador · Instagram · WhatsApp · TikTok LIVE` (cierre acta 27-oct; prohibido añadir canales) h 44 rx 8 · activo = borde 2 px ciruela + check; con 0 datos: `aria-disabled`, texto `--text-2` · der: rango de fechas 2 inputs h 44 × 150 (`Desde` / `Hasta`, M 13/500 label) inertes en MVP |
| 5 | bandeja | overline h 16 + 12 · tarjeta 1140 · **th h 74** (pad 20 + hasta 2 líneas 13/600 + 20) · **filas h 56** · separadores 1 px `--border` | celdas (content 1092, pad 24): fecha 144 · canal 156 · 3 respuestas 232 c/u · 4 gutters 24 → 144+156+3×232+96=1092 ✓ · fecha M 14/400 tabular `--text-2` relativa (`hoy 09:12`, ISO en `title`) · canal M 14/500 ciruela · respuesta = chip 32×28 rx 6 borde `--border` + dígito M 14/600 tabular ciruela. **Orden físico: filtros sobre la bandeja** (el brief los lista después; filtrar sin ver la lista viola la 1.ª ley de Krug — se anota el desvío) |

## 3. Jerarquía tipográfica (ratios medidos sobre las superficies reales)

| rol | familia/peso | px | color → fondo → ratio |
|---|---|---|---|
| título pantalla | Bebas 400 (MAYÚS) | 44 | ciruela/blanco 15.29 ✓ (tarjeta header es blanca; sobre crema 14.53 ✓ — la pantalla es crema) |
| subtítulo / ancla escala | Montserrat 400/500 | 16 / 13 | `--text-2` #65586E/crema 6.29 ✓ |
| overlines (`PANEL`, secciones, th) | M 600 MAYÚS .14em | 13 | `--text-2`/crema 6.29 · /blanco 6.62 ✓ |
| pregunta en tarjeta (h3) | M 600 | 16 | ciruela/blanco 15.29 ✓ |
| cifra de total | Bebas 400 | 28 | ciruela/blanco 15.29 ✓ (Bebas solo en números ≤4 dígitos — contrato §3) |
| filas de tabla y chips | M 400/500/600 tabular-nums | 14–15 | ciruela 15.29 ✓ · `--text-2` 6.62 ✓ |
| enlaces cabecera | M 500 subrayado | 14 | `--link` #B23A2A/blanco 5.95 ✓ · hover 7.55 ✓ |
| badge demo / DISEÑO | M 600 MAYÚS | 11 | ciruela/mostaza 8.45 ✓ |
| barras | — | track h 10 | relleno coral/blanco **3.01 ✓ (no-texto)** — por eso las barras viven solo en tarjetas blancas: sobre crema sería 2.86 ✗ |

**Blanco como texto: no se usa** — el panel no tiene superficie oscura (cabecera y tarjetas claras); crema/ciruela 14.53 ✓ queda registrado por si el gate lo pide. Coral nunca como texto sobre fondo claro (contrato §1). Mostaza: badge demo + badge DISEÑO ≈ 0.4 % de pantalla ✓. Sin tercera familia, sin emoji como icono (`react-icons` set `md`), sin glassmorphism, sin gradientes multicolor en la pantalla (la cabecera es plana).

## 4. Estados (el default es VACÍO) y modo demo

| estado | qué cambia | copy `[propuesta]` | datos |
|---|---|---|---|
| **vacío (default)** | ancla de escala se retira; tarjetas 364×256 **conservan la altura** (sin salto): `—` Bebas 40 + `Sin respuestas` 14 `--text-2` centrados; switch disponible; chips y fechas `aria-disabled`; bandeja = bloque centrado máx 420: overline `AÚN NADA QUE LEER` + `Aún no hay respuestas` M 18/600 + 2 líneas 16 `--text-2` + CTA ghost `Ver con datos de ejemplo` (lleva al switch, misma acción) | `Cuando alguien escanee tu QR y conteste, lo verás acá.` | **cero cifras**: ningún gráfico fantasma, ningún 0 disfrazado |
| **carga** | tarjetas → esqueletos `--surface-2` (misma retícula); bandeja → 4 filas esqueleto (bloques 100×12 / 110×12 / 3×32×28) con borde `--border`; switch y filtros deshabilitados; `aria-busy="true"` en la región | sr-only: `Cargando respuestas…` | sin spinner central (skeleton rows, regla DASHBOARD-UX) |
| **error** | una tarjeta de alerta reemplaza resumen+bandeja: icono `FiAlertCircle` `--state-err` #A82E39/blanco 6.74 ✓ (no-texto ≥3 ✓) + `No pudimos cargar tus respuestas.` M 16/600 ciruela + `Revisa tu conexión e inténtalo otra vez.` 14 `--text-2` + botón `Reintentar` primario (coral/ciruela 5.08 ✓) | `role="alert"` | el título y la cabecera siguen legibles; nada finge datos |
| **sin conexión** | banner full-bleed bajo la cabecera (h 48, blanco, borde `--border`): `FiWifiOff` + `Vas sin conexión. Conéctate para ver las respuestas nuevas.` + botón ghost `Reintentar`; el resto queda inerte pero visible; `aria-live="polite"` al entrar/salir del estado | estado real del navegador (`navigator.onLine`) | sin cifras propias |
| **demo (ON)** | se pueblan tarjetas y bandeja con el dataset de abajo; aparece badge `DATOS DE EJEMPLO` + línea aclaratoria; filtros habilitados **visualmente** (sin lógica); OFF devuelve al estado vacío real | anuncio `aria-live="polite"`: `Mostrando datos de ejemplo. No vienen de clientes reales.` | **8 respuestas, solo canal + fecha + 3 dígitos** — cero nombres, correos, teléfonos o comentarios |

**Dataset demo (fijo, el único en todo el producto hasta el piloto):**

| fecha | canal | Q1 | Q2 | Q3 |
|---|---|---|---|---|
| hoy 09:12 | Mostrador | 5 | 4 | 4 |
| hoy 08:47 | WhatsApp | 4 | 4 | 3 |
| ayer 19:20 | Instagram | 5 | 5 | 5 |
| ayer 17:05 | Mostrador | 2 | 3 | 1 |
| ayer 12:33 | TikTok LIVE | 5 | 5 | 4 |
| 28-oct 18:10 | Instagram | 4 | 3 | 2 |
| 28-oct 15:52 | Mostrador | 5 | 4 | 4 |
| 27-oct 11:24 | WhatsApp | 3 | 4 | 5 |

Totales por tarjeta (derivados, no inventados): Q1 `1·0 2·1 3·1 4·2 5·4` · Q2 `3·2 4·4 5·2` · Q3 `1·1 2·1 3·1 4·3 5·2` — n=8 < 20: **solo absolutos, cero porcentajes** (umbral `DASHBOARD-UX §3`).

## 5. Responsive (qué se apila, en qué orden)

| bp | cambios |
|---|---|
| **1440** | referencia del plano |
| **1024** | container lg 960 (col 58): tarjetas 3×304 ✓ (3×304+48=960); tabla con 3×172 de respuesta (912 content ✓); H1 Bebas 36 |
| **768** | container md 720: tarjetas **se apilan en 1 columna de 672** (3 filas de h 256); la tabla pasa a **filas-tarjeta**: línea 1 = canal + fecha (derecha), línea 2 = 3 chips de respuesta en orden Q1→Q3; filtros: chips en scroll horizontal sin wrap; fechas en segunda línea (fila 2×44+8=96) |
| **375** | pad 16 · content 343 · H1 Bebas 28 en 2 líneas · switch y label en línea + badge debajo (bloque 76) · tarjetas 343 · filas-tarjeta h 96 · enlaces cabecera: `Salir` queda, `Volver al sitio` pasa a `Volver` (108 px no caben con wordmark) — verificación con captura en la implementación |

Orden de colapso: 1) tarjetas 3-up→1-up · 2) tabla→filas-tarjeta · 3) rango de fechas baja de línea · 4) `Volver al sitio`→`Volver`. Nunca se esconde `Salir`.

## 6. Accesibilidad

- **Estructura:** skip-link `Saltar a las respuestas` lo primero del DOM → `<header>` con `banner` → `<main>` con `h1` = título de pantalla → `h2` sr-only `Resumen por pregunta` (tarjetas) → `h2` visible overline `RESPUESTAS RECIBIDAS` → `h3` por pregunta en cada tarjeta. Tabla = `<table>` real con `<caption>` sr-only `Respuestas de tus clientes, más recientes primero`, `<th scope="col">` en las 5 columnas, celdas de fecha con `title` ISO.
- **Orden de tabulación = visual:** skip → `Volver al sitio` → `Salir` → switch → chip activo (grupo con roving tabindex, flechas ←→, `role="radiogroup"`) → `Desde` → `Hasta`. Tarjetas, barras y filas **no son focusables** (no son interactivos). Sin traps; ningún modal.
- **Switch:** `role="switch"` `aria-checked`; el cambio se anuncia en región `aria-live="polite"` (texto de §4); nunca solo color: OFF track claro + knob ciruela a la izquierda; ON track ciruela + knob crema a la derecha + check.
- **Foco:** `outline: 3px solid var(--focus-ring)` offset 2 en todo lo interactivo (cabecera blanca → anillo estándar; nunca `outline:none`). Targets ≥44 sin excepción (enlaces con padding, switch 44, chips 44, inputs 44).
- **Barras:** el valor va **además** como dígito count (lectura sin color) y cada fila con `aria-label` `3 de 8 dijeron 4` `[propuesta]` en implementación; track `--surface-2` 1.12 vs blanco es decorativo (el señal lleva la lectura: relleno + número).
- **Sin conexión / carga:** `aria-live` polite y `aria-busy` según §4; `prefers-reduced-motion`: sin slide del switch ni fade del badge (bloque global del contrato §5 → 0.01 ms; el estado se lee igual en reposo).
- **Badges siempre texto + icono/dígito**; `DATOS DE EJEMPLO` es texto literal, no color.

## 7. Qué NO lleva y por qué (anti-slop)

| no lleva | por qué |
|---|---|
| sidebar, menú, rutas hijas, 3 destinos | el brief lo fija: una pantalla; el concepto con sidebar (`DASHBOARD-UX`) queda como planificación histórica hasta que exista backend |
| gráficos de librería (Recharts et al.), animaciones de barras | barras con `div` + tokens bastan y el repo aún no necesita librería (peso + complejidad sin backend); nada se anima al cargar (EFECTOS §1: 1 momento por pantalla, aquí no hay) |
| contadores animados, `+12 %`, `1.240 respuestas`, tendencias, promedios | cero cifras fuera del dataset demo — umbral n<20 y regla de oro: sin piloto no hay estadística (gate D2 `RIESGOS-USUARIO`) |
| avatares, nombres de clientes, comentarios, correos | la encuesta no pide datos personales (COPY-LANDING FAQ 5); cualquier identidad en el panel sería invento y mentira de privacidad |
| KPIs, `score`, CSAT/NPS, `dashboard`, `tiempo real`, `insights` | vocabulario vetado por la voz (COPY-INTERNAS); en pantalla visible solo español de mostrador |
| search box, paginación "infinita", orden por columna, exportar CSV, filtros con lógica | no hay backend que los respalde; la estructura visual de filtros sí está (§2.4) pero inertes y declarados |
| alertas "sin responder", botón `Responder`, estados de gestión | viven en el concepto futuro de `DASHBOARD-UX §2.3`; en el MVP el dueño solo lee — inventar acciones sería inventar el modelo de datos |
| glow, gradiente, sombra en tarjetas | el panel es superficie de lectura larga: 3 planos por color (crema < blanco < borde), la jerarquía es tipográfica; la firma visual ya vive en el login y la landing |
| `DEMO` a secas en el badge | la palabra queda: se usa `DATOS DE EJEMPLO` — describe la naturaleza del contenido, no el estado del software |

## 8. Tokens nuevos (2 slots máx · se usa 1)

| token | valor | dónde | por qué |
|---|---|---|---|
| `--surface-2` | `color-mix(in srgb, var(--brand-plum) 5%, var(--brand-white))` | track de barras, esqueletos, hover de chips, fondo `aria-disabled` de inputs | **no es un invento**: `DESIGN-CONTRACT §5` y `DASHBOARD-UX` ya lo gobiernan (skeletons, hover ghost, disabled) pero falta en `_tokens.scss` — se oficializa el token que las reglas ya usan. 1.12 vs blanco: superficie pasiva, nunca texto ni señal |
| — | — | — | slot libre; nada justifica un segundo (switch usa ciruela/crema, badge usa mostaza, todo lo demás tokens vigentes) |

**Fuentes:** `src/app/page.js:38` · `src/app/entrar/page.jsx:199` (Q1 real) · `UX-LANDING.md:69-70` + `VERIFICACION-F2` #12 (etiquetas verbales) · `DESIGN-CONTRACT.md` §3–§5 (escala, superficies, estados) · `DASHBOARD-UX.md` §2.2/§3 (5 chips exactos, umbrales n) · `_tokens.scss` + `_brand-vars.scss` (paleta vigente) · ratios WCAG medidos en esta sesión con la fórmula canónica (regla `INDEX.md` #6).
