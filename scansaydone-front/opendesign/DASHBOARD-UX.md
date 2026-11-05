# DASHBOARD-UX v2 — shell del panel del dueño · Scan-Say-Done

> **v2 · 30-oct-2026. Sustituye por completo el concepto del 27-oct** (sidebar de 3 destinos + 4 KPIs + gráfico Recharts + cola de alertas con botón `Responder` + paginación + `ajustes`). Ese concepto **no se borra del repo**: vive en el historial de `git` de este archivo. Motivo del reemplazo: `DASHBOARD-AUDITORIA.md` §1 y §3.d.
> Solo diseño · **cero código de producto** · `src/` intacto · plano métrico: `wireframes/12-dashboard.svg` (PNG 1440×900 en `wireframes/png/`).
> Decisiones del operador (no se reabren): **shell con sidebar 264** · **3 secciones**, todas con contenido real hoy · **`/panel` sigue siendo la raíz** y lo que ya existe pasa a ser su sección `Resumen` · **`ajustes` queda fuera** (no hay nada que ajustar todavía).
> Se heredan sin cambio: `PANEL-UX.md` §2–§8 (tarjetas, barras, bandeja, dataset, estados) · `DESIGN-CONTRACT.md` §1/§2/§5/§6 · `GRID-SPEC.md`. Contrastes medidos en esta sesión con la fórmula WCAG canónica (regla `INDEX.md` #6).

## 1. Shell

| pieza | medida | qué token usa |
|---|---|---|
| sidebar | **264 px fija, full-height**, a la izquierda; `position: fixed` (mdn: `css.properties.position.fixed`); 264 = 11 × `--sp-4` | `--sidebar` #2E1E3F |
| topbar | **h 64** (`--sp-7`), de x 264 a 1440 (1176 px); fondo plano, sin sombra ni gradiente | `--surface` blanco + borde inferior 1 px `--border` |
| área de contenido | x 264–1440 (1176) · **padding 24 en los 4 lados** (`--sp-4`) → contenido **1128** (x 288–1416) | fondo `--bg` crema #FFF8F2 |
| bloques | radio 12 (`--radius-card`), borde 1 px `--border`, blanco, **sin sombra** (contrato §4: la jerarquía es tipográfica) | `--surface` |

**Fondo: crema, no el wash ciruela 4 % de `DESIGN-CONTRACT §4`.** `_tokens.scss:44` emite `--bg: cream` y `/panel` ya está construido y medido sobre crema (`VERIFICACION-PANEL §4`, `11-panel.svg`); el plano copia la superficie real, no la que el contrato pretendía.

## 2. Sidebar (264)

| pieza | cotas | color y ratio medido |
|---|---|---|
| franja de marca | h **64** (alineada con la topbar) · logo **108×36** en x 24, y 14 · separador 1×24 en x 156 · `PANEL` overline 13/600 .14em en x 172 | logo y texto `--brand-cream`/ciruela **14.53 ✓** |
| lista | py-top 24 → ítems desde y 88 · **3 ítems · h 48 · gap 4** (`--sp-6`, `--sp-1`) → bloque 88–240 · full-bleed 264, pad-x 24 | — |
| interior del ítem | icono `react-icons/fi` **20×20** en x 24 · gap 12 (`--sp-3`) · texto desde x 56 (hasta 240: caben `Respuestas`, 10 car. ≈ 84 px) | — |
| ítem **activo** | barra **3 px `--action-bg` en x 0**, alto 48 + texto **crema 15/600** + `aria-current="page"` | crema/ciruela **14.53 ✓** · barra/ciruela **5.08 ✓** (no-texto ≥3) |
| ítem inactivo | texto `--text-2` variante oscura = mix(crema 75 %, ciruela) #CBC2C5 · 15/500 | #CBC2C5/ciruela **8.78 ✓** |
| hover | fondo `--edge-lit` (22 % crema sobre ciruela = #5C4E66) **y el texto sube a crema completo** | crema/#5C4E66 **7.29 ✓** · mix75/#5C4E66 **4.41 ✗** → por eso el hover **nunca** deja el texto inactivo encima |
| `Salir` | h 48 anclado al pie: separador 1 px `--edge-lit` en y 804 (x 24–240) · ítem **y 828–876**, 24 al pie · icono `FiLogOut` 20 | texto mix75 **8.78 ✓** · separador/ciruela 1.99 = **decorativo** |

**El estado activo no depende solo del color:** barra de 3 px (posición) + peso 600 vs 500 (forma) + `aria-current="page"` (semántica). Retirando el color siguen siendo tres señales distinguibles.
**Ninguna superficie de relleno en el ítem activo:** el contrato solo gobierna `--sidebar` liso; inventar una superficie #3F2F4D para el activo sería un token sin dueño. La barra y el peso hacen el trabajo.
**`Salir` → `/entrar`** y el **logo es enlace a `/`** con `aria-label="Volver al sitio"` (convención universal: la marca lleva a casa). Así `Volver al sitio` no se duplica en la topbar y el pie del sidebar queda exacto como pidió el operador: marca arriba, 3 ítems, `Salir` al pie.
**Desvío registrado:** el brief fija el set **`react-icons/fi`** (Feather) con `FiHome`, `FiMessageSquare`, `FiSmartphone`; `DESIGN-CONTRACT §6` pide set `md`. Gana la orden del operador porque los tres nombres son Feather; la regla del contrato (cero emoji, icono vectorial de `react-icons`) se cumple igual. `react-icons ^5.5.0` ya está en `package.json`.

## 3. Retícula del contenido (1128, no 1140)

Al meter el sidebar, el ancho útil **deja de ser 1140** (`container-xl`) y pasa a **1128** = 1440 − 264 − 2×24. Misma fórmula de siempre: `col = (1128 − 11×24) / 12 = 864/12 =` **72**; `span(n) = n×72 + (n−1)×24`.

| spans usados | px | cierre |
|---|---|---|
| 3 columnas (tarjetas, tarjetas QR) | **360** | 3×360 + 2×24 = **1128** ✓ |
| 4 + 8 (fila `Mi QR`) | **360 / 744** | 360 + 24 + 744 = **1128** ✓ |
| 12 (bandeja, bloque de respuestas) | **1128** | 12×72 + 11×24 = **1128** ✓ |

Ejes de columna: 288 · 384 · 480 · 576 · 672 · 768 · 864 · 960 · 1056 · 1152 · 1248 · 1344 → la 12 cierra en **1416 = 1440 − 24** ✓.
Las cotas del plano solo valen a 1440 (arriba es fluido y `col` deja de ser entero), igual que la nota de desvío de `GRID-SPEC §1`. **No se reusa ningún `container-*` de la landing:** el panel tiene su propio ancho, gobernado por el sidebar.

## 4. Sección `Resumen` → `/panel` (raíz del shell)

Alturas de pantalla (x 64 del topbar): título **160** (py 32 + H1 Bebas 44 → h 42 + 8 + subtítulo 16/400 → 24 + 10 + ancla de escala 13/500 → 16 + py-bot 28) → tarjetas en y **224**.

| bloque | cotas | detalle |
|---|---|---|
| **3 tarjetas de distribución** | **3 × 360 × 256**, gap 24 · y 224–480 | hereda `PANEL-UX §2` salvo el ancho: **364 → 360**. Interior: pad 24 → contenido **312** = dígito **24** + track **260** + count **28** (antes 24+264+28 = 316). Altura intacta: 24 + 24 + 8 + 132 (5 filas h 20, gap 8) + 16 + 28 + 24 = **256** ✓ |
| barras | track `--surface-2` **h 10 rx 5**, ancho 260 · relleno `--action-bg` = n/total | coral/blanco **3.01 ✓** (no-texto); coral/crema 2.86 ✗ → las barras **viven solo en tarjetas blancas**. El count va además como número: lectura sin color |
| fila demo (ON) | badge `DATOS DE EJEMPLO` **140×24** en y 504–528 · +8 · línea aclaratoria h 20 → 536–556 | el **switch se va a la topbar** (§7); el badge y la línea se quedan dentro de la sección afectada |
| **últimas respuestas** | overline `ÚLTIMAS RESPUESTAS` 13/600 h 16 en y 580–596 · +12 · tarjeta **1128** · `th` **74** · **5 filas h 56** → 682–962 · pie **48** con enlace `Ver todas las respuestas` → `/panel/respuestas` | reutiliza la bandeja de `PANEL-UX §2` sin recorte de columnas ni componente nuevo; solo límite de 5 filas |

Vertical de la sección: 64 + 160 + 256 + 24 + 24 + 8 + 20 + 24 + 16 + 12 + 74 + 280 = **962**. El pliegue corta en 900 → **3 filas completas**, la 4.ª nace en 850 y muere en el pliegue, la 5.ª y el pie quedan **bajo scroll**. Se anota en el plano en vez de disfrazarse.

## 5. Sección `Respuestas` → `/panel/respuestas`

La bandeja completa, **movida** desde el resumen (no duplicada: `Resumen` muestra 5 filas y enlaza aquí). Título 160 con la misma escala; `th` 74; filas 56; dataset 8.

| pieza | cotas en 1128 |
|---|---|
| filtros (gap 24 + fila h **44** → y 248–292) | izq: **5 chips exactos** `Todos · Mostrador · Instagram · WhatsApp · TikTok LIVE` (acta 27-oct; prohibido añadir canales), h 44 rx 8 · der: rango `Desde` / `Hasta`, 2 inputs **h 44 × 150** |
| chip activo | borde 2 px ciruela + check `FiCheck` visible + `--action-selected`; **no solo color** (contrato §5) |
| banda de columnas | contenido **1080** = pad 24 + fecha **144** + canal **156** + **3 × 228** + 4 gutters 24 + pad 24 → 144+156+684+96 = **984 + 96 = 1080** ✓ |
| recotización | las columnas de respuesta pasan de **232 → 228** (−4 c/u, −12 total) para cerrar en 1128 en vez de 1140; fecha y canal **no se tocan** (son las que tienen el texto más largo) |
| celda de respuesta | 3 chips **32×28 rx 6**, borde `--border`, dígito 14/600 tabular ciruela (15.29 ✓), gap 8 → 112 dentro de 228 |
| th | 2 líneas 13/600 .14em `--text-2` (6.62 ✓) = el enunciado real de cada pregunta; `th scope="col"` |

Vertical: 64 + 160 + 24 + 44 + 24 + 16 + 12 + 74 + 8×56 = **866 ≤ 900** ✓ → **las 8 filas caben por encima del pliegue**, sin scroll y sin paginación (vetada: `DASHBOARD-AUDITORIA §3.d`). Orden físico: **filtros sobre la bandeja** — mismo desvío al brief que documentó `PANEL-UX §2` (filtrar sin ver la lista viola la 1.ª ley de Krug).

## 6. Sección `Mi QR` → `/panel/qr`

Título: py 32 + H1 `ASÍ CONTESTAN TUS CLIENTES` `[propuesta]` (Bebas 44, h 42) + 8 + subtítulo 16/400 (h 24) + py-bot 28 = **134** → **sin ancla de escala**: aquí no hay ninguna escala 1–5 que anclar. Sección entera = 134 + 388 = **522** → y 64–586: **cabe sin scroll**.

Fila: **span-4 (360) + gap 24 + span-8 (744)**, las dos tarjetas a **h 388**.

| pieza | cotas | contenido |
|---|---|---|
| tarjeta del QR (360×388) | pad 24 · fila h **24** (overline `TU QR` 13/600 + badge **`DEMO` 60×24 rx 4**, fondo `--brand-mustard`, texto ciruela 11/600 .1em → **8.45 ✓**) · +16 · **marco 264×264** · +16 · nota 1 línea h 20 · pad 24 = **388** ✓ | marco: radio **8**, borde **1 px `--border` discontinuo (4/4)**, fondo `--surface-2`. El borde discontinuo **es** la señal de "aquí falta algo"; no se dibuja ningún módulo de QR |
| hueco del símbolo | **216×216** centrado (264−216)/2 = **24** de zona de descanso por lado | 216 = 9 × 24 (`--sp-4`). Centro: `FiQrScan` **48×48** ciruela/`--surface-2` **13.93 ✓** + +8 + `Aquí va tu QR` 14/500 ciruela |
| nota bajo el marco | h 20 · 13/400 `--text-2` sobre `--surface-2` **6.03 ✓** | `Todavía no hay QR.` `[propuesta]` |
| derecha (744×388) | pad 24 · overline `ASÍ LLEGA A TUS CLIENTES` 16 · +12 · **3 pasos: 3 filas h 44 + 2 gaps 16 = 164** · +24 · overline `ENLACE DE TU ENCUESTA` 16 · +12 · **campo 696×44** · +12 · nota **2 líneas = 40** · pad 24 = **388** ✓ | campo: fondo `--surface-2`, borde 1 px `--border` discontinuo, radio 8, `readonly`, texto monoespaciada 14 ciruela **13.93 ✓** |
| los 3 pasos | número **Bebas 28** (h 28) en slot 24 + gap 16 + bloque texto; título `ESCANEA` / `CONTESTA` / `LEES` 13/600 .14em ciruela; glose 14/400 `--text-2` en la misma línea | 1 `Con la cámara del móvil, sin app.` · 2 `Tres preguntas del 1 al 5. Sin nombre.` · 3 `Lo lees acá, en Respuestas.` — todo `[propuesta]` |
| enlace de ejemplo | `https://tu-dominio/e/XXXXXXXX` + sufijo `· ejemplo` 12/600 `--text-2` | la forma es real: `ANALISIS-QR §4.10` fija `/e/<nanoid 8–10>`; el host sale de `NEXT_PUBLIC_SITE_URL`, hoy vacío (`site.js:19`). **No hay URL verdadera que copiar** |
| línea de honestidad | 2 líneas 14/400 `--text-2` (6.03 ✓ sobre `--surface-2`) | `El QR y el enlace reales llegan con el backend. Hoy el marcador está vacío y el enlace no abre nada.` `[propuesta]` |
| **cero cifras** | — | **sin "escaneos", sin "comparte y gana", sin contador, sin tasa, sin mini-gráfico**: no hay backend que los produzca. El marco **no** muestra un QR falso (regla `ANALISIS-QR §4.10`: si la ruta no existe, no existe el QR) |

Cuando el backend exista: el símbolo real entra en el hueco de 216 → V3-M 29 módulos + descanso 4 = 37 módulos → **5.84 px/módulo** y 216 ≥ 120 px de lado (`ANALISIS-QR §2`, valor mínimo para pantalla). Módulos **ciruela sobre blanco**, nunca coral (2.86 ✗, no escanea).

## 7. Estados por sección

`Ver con datos de ejemplo` sube a la **topbar derecha** (switch 48×28 dentro de un objetivo de 44, label 14/500 a la izquierda): el estado demo ahora afecta a **dos** secciones, así que un interruptor por sección lo duplicaría. El badge y la línea aclaratoria siguen **dentro** de cada sección afectada.

| sección | vacío (default) | demo (ON) | sin conexión | carga | error |
|---|---|---|---|---|---|
| `Resumen` | `PANEL-UX §4` íntegro: ancla de escala retirada; las 3 tarjetas **conservan 256** con `—` Bebas 40 + `Sin respuestas`; bloque central máx 420 `AÚN NADA QUE LEER`; chips `aria-disabled`; **cero cifras** | dataset de 8; badge `DATOS DE EJEMPLO` + línea aclaratoria + `aria-live` `Mostrando datos de ejemplo. No vienen de clientes reales.` | banner full-bleed bajo la topbar (h 48, blanco, borde `--border`): `FiWifiOff` + `Vas sin conexión. Conéctate para ver las respuestas nuevas.` + botón ghost `Reintentar` | declarado **sin disparador**: esqueletos `--surface-2` en las 3 tarjetas y 3 filas esqueleto; `aria-busy` en la región. Hoy no hay petición que lo provoque | declarado **sin disparador**: tarjeta con `FiAlertCircle` `--state-err`/blanco **6.74 ✓** + `No pudimos cargar tus respuestas.` + `Reintentar` |
| `Respuestas` | bandeja = el mismo bloque central máx 420; `th` visible (estructura real), **cero filas inventadas**; filtros `aria-disabled` | 8 filas reales del dataset | mismo banner; la tabla queda inerte pero legible | idem: 4 filas esqueleto (bloques 100×12 / 110×12 / 3×32×28), borde `--border` | idem |
| `Mi QR` | **el vacío es el estado por defecto**: marco con borde discontinuo + badge `DEMO` + `Todavía no hay QR` + campo con el enlace de ejemplo | **no cambia nada**: el interruptor demo puebla respuestas, y aquí no hay respuestas. Se declara explícito para que nadie lo espere | el contenido es estático: no se inerta nada, solo se ve el banner | n/a (sin petición) | n/a (sin petición) |

**Cero cifras inventadas en los tres estados.** Los valores y etiquetas de `PANEL-UX §4` se reusan literalmente; lo único nuevo son las cotas de ancho (§4–§5) y el sitio del switch.

## 8. Responsive

| bp | qué pasa |
|---|---|
| **≥1200** | referencia del plano: sidebar **264 fija**, contenido **1128**, col **72**. Nada se re-fluye |
| **<1200** | sidebar oculta → **drawer**. Ancho del drawer **264** (no se re-fluye el contenido del nav dos veces). Overlay `color-mix(in srgb, var(--brand-plum) 55 %, transparent)` sobre la página. **Esc lo cierra**, el foco queda **atrapado dentro** (1.º el cierre), al cerrar el foco **vuelve al botón hamburguesa** (`aria-controls`, `aria-expanded="true|false"`). Patrón documentado en `DASHBOARD-AUDITORIA §3.b` (`context7: /twbs/bootstrap` `.offcanvas-lg`). Topbar pasa a 0–1440; **hamburguesa `FiMenu` 44×44** en x 16; contenido = viewport − 2×24 (1199 → 1151, `col` deja de ser entero: fluido) |
| **<768** | contenido **1 columna**: las 3 tarjetas se apilan (3 × 256) y la fila de `Mi QR` se apila (marco 360 arriba, enlace y pasos debajo); la tabla pasa a **filas-tarjeta** (línea 1 = canal + fecha a la derecha; línea 2 = los 3 dígitos en orden Q1→Q3, `data-label`); chips con `overflow-x: auto`, sin wrap; los 2 inputs de fecha bajan a segunda línea |
| **375** | pad **16** → contenido **343**. Tarjetas **343×256**; track de barra **243** = 343 − 48 − 24 − 28 (mismos slots 24/28, el track absorbe la resta). Marco QR **295×295** (343 − 48) y hueco del símbolo **247** (295 − 2×24). Topbar 64: hamburguesa 44 a la izquierda + switch a la derecha; el label del switch se retira (solo el `aria-label`). H1 Bebas **28** en 2 líneas. `Salir` **nunca se esconde** |

Orden de colapso: 1) drawer (el nav deja de ser permanente) · 2) tarjetas 3-up→1-up · 3) fila `Mi QR` 2-col→apilada · 4) tabla→filas-tarjeta · 5) rango de fechas baja de línea · 6) label del switch se retira. `Volver al sitio` no se renombra: **es el logo**, siempre disponible.

## 9. Accesibilidad

- **Landmarks:** sidebar = `<nav aria-label="Secciones del panel">` (mdn: `html.elements.nav`, soporte universal); topbar = `<header>` (`banner`); contenido = `<main>`. **Skip-link** `Saltar al contenido` como primer nodo del DOM, delante del nav.
- **`aria-current="page"`** en el ítem activo — el estado se lee, no solo se ve. La barra de 3 px es **decorativa** (`aria-hidden`): quien navega no necesita saber que existe un pseudo-elemento.
- **Orden de tabulación por sección:** skip → nav (`Resumen` → `Respuestas` → `Mi QR` → `Salir`) → switch de la topbar → contenido en orden visual (tarjetas no son focusables: no son interactivas) → dentro de `Resumen`, el enlace `Ver todas las respuestas` es lo último. En `Respuestas`: chips (grupo `role="radiogroup"`, roving tabindex, flechas ←→) → `Desde` → `Hasta` → filas (no focusables, lectura pura). En `Mi QR`: campo `readonly` (seleccionable con foco) y nada más.
- **Foco visible:** `outline: 3px solid var(--focus-ring)` + offset 2 en todo lo interactivo; **dentro del sidebar el anillo es `--brand-peach`** (override `.zone-dark`, `DESIGN-CONTRACT §2/§5`): peach/ciruela **12.87 ✓** y peach/#5C4E66 del hover **6.46 ✓** — con el default ciruela el anillo rinde **1.97** y desaparece sobre el propio sidebar. Cero `outline: none`.
- **Objetivos ≥44:** ítems de nav **264×48**; switch 48×28 dentro de 44; hamburguesa 44×44; cierre del drawer 44×44; chips e inputs 44; enlace del pie 44. Sin excepciones (contrato §5).
- **Drawer:** foco atrapado + `Esc` + foco devuelto al disparador; el overlay **no** es clickable-cierre sin foco (regla del contrato: nunca cerrar por clic en el fondo sin ruta equivalente de teclado — el cierre visible existe).
- **Tabla real** en `Resumen` y `Respuestas`: `<table>` con `<caption>` sr-only (`Últimas 5 respuestas de tus clientes, más recientes primero` / `Respuestas de tus clientes, más recientes primero`), `th scope="col"` en las 5 columnas, fecha con `title` ISO. En móvil las filas-tarjeta conservan `data-label`.
- **Lectura sin color:** barra + count numérico; chip activo + check; switch posición + icono; badge como texto literal (`DEMO`, `DATOS DE EJEMPLO`); bordes discontinuos solo como señal de "falta", nunca como única señal.
- **Bebas** solo en H1 de pantalla y en cifras ≤4 dígitos (contrato §3); `--border`/`--surface-2` como separadores **decorativos** (1.39 y 1.05 vs blanco, 1.32 vs crema): donde un borde **codifica estado** se usa `--border-strong` **3.26 ✓**, nunca `--border`.
- `prefers-reduced-motion`: el drawer no desliza (0.01 ms, contrato §5) y el badge no hace fade; el estado se lee igual en reposo.

## 10. Qué NO lleva y por qué (anti-slop)

| no lleva | por qué |
|---|---|
| sidebar de 7 ítems / `Ajustes` | 3 destinos con contenido real; `ajustes` no tiene nada que ajustar hoy (`DASHBOARD-AUDITORIA §3.d`); los ítems vacíos son teatro de navegación |
| 4 KPIs, `score`, CSAT/NPS, la palabra `dashboard` en pantalla | vetado por la voz y por `DASHBOARD-AUDITORIA §1`; en pantalla solo español de mostrador |
| gráfico de librería (Recharts) | no está en `package.json`; +~180 KB sin backend que lo justifique; barras `div` + tokens |
| cola de alertas, estados de gestión, botón `Responder`, `Exportar`, `Invitar`, `Compartir` | cero acciones que no existan; `alert.response_id` y el endpoint no existen |
| paginación, search box, orden por columna, "infinito" | n=8; sin backend no hay cursor ni offset (`DASHBOARD-AUDITORIA §3.d`) |
| avatares, nombres, correos, teléfonos, texto literal del cliente | la encuesta no pide identidad; cualquier nombre sería un invento y una mentira de privacidad |
| contadores de escaneos, "comparte y gana", mini-gráfico en `Mi QR` | §6: **cero cifras** — no hay nada medido que mostrar |
| breadcrumb bajo la topbar | 2 niveles (shell → sección) ya los dicen el nav activo y el nombre de sección; el breadcrumb no agrega información |
| avatar + menú de usuario arriba | no hay modelo de sesión; sería un control que no abre nada |
| sombras, glow, gradientes, glassmorphism en el shell | el panel es superficie de lectura larga: 3 planos (crema < blanco < borde); la firma visual vive en el login y la landing |
| mostaza como texto sobre superficie clara | 1.72 (crema) y 1.81 (blanco) ✗; solo sobre ciruela (8.45 ✓). Mostaza en pantalla: badge `DATOS DE EJEMPLO` (3 360 px²) + badge `DEMO` (1 440 px²) = **0.37 %** ✓ (techo 5 %) |
| coral como texto sobre claro | 2.86–3.01 ✗ (contrato §1 P0); el coral del shell es **superficie**: barra del ítem activo, relleno de barras |

## 11. Tokens y ratios

**Tokens nuevos: cero.** El brief concedía 1; no hay nada que lo justifique.

| pieza del shell | token vigente que la cubre |
|---|---|
| fondo del sidebar | `--sidebar` (= `--brand-plum`, `_tokens.scss:52`) |
| texto inactivo del nav | `--text-2` variante oscura del contrato §2 = mix(crema 75 %, ciruela) |
| hover del nav + separador del pie | `--edge-lit` (`_tokens.scss:95`, 22 % crema sobre transparente) |
| anillo de foco en el sidebar | `--focus-ring` + override `.zone-dark` → `--brand-peach` (contrato §2/§5) |
| barra del ítem activo | `--action-bg` (= coral) |
| tops y pads | `--sp-6` 48 · `--sp-4` 24 · `--sp-3` 12 · `--sp-1` 4 · `--sp-7` 64 |
| tracks, campo de enlace, esqueletos | `--surface-2` (ya existe desde `PANEL-UX §8` — no se re-crea) |
| scrim del drawer | `color-mix(in srgb, var(--brand-plum) 55 %, transparent)`, **inline y un solo uso**: no se nombra token por una línea de CSS |

Ratios medidos con la fórmula WCAG sobre **las superficies reales de este shell** (texto normal ≥4.5, no-texto ≥3.0):

| superficie | par | ratio |
|---|---|---|
| **sidebar ciruela** #2E1E3F | crema / ciruela | **14.53 ✓** |
| | mix75 #CBC2C5 / ciruela | **8.78 ✓** |
| | barra coral / ciruela (no-texto) | **5.08 ✓** |
| | hover crema / #5C4E66 | **7.29 ✓** (mix75 = 4.41 ✗ → el hover sube el texto a crema) |
| | foco peach / ciruela · peach / #5C4E66 | **12.87 ✓** · **6.46 ✓** |
| **topbar blanca** #FFFFFF | ciruela / blanco | **15.29 ✓** |
| | `--text-2` / blanco | **6.62 ✓** |
| | `--link` #B23A2A / blanco | **5.95 ✓** |
| | `--border-strong` / blanco (borde codifica estado) | **3.26 ✓** |
| **fondo crema** #FFF8F2 | ciruela / crema | **14.53 ✓** |
| | `--text-2` / crema | **6.29 ✓** |
| | `--link` / crema | **5.65 ✓** |
| **tarjeta blanca** #FFFFFF | ciruela / blanco · `--text-2` / blanco | **15.29 ✓** · **6.62 ✓** |
| | relleno de barra coral / blanco | **3.01 ✓** no-texto (sobre crema 2.86 ✗ → las barras solo van en tarjetas blancas) |
| | ciruela / `--surface-2` #F5F4F5 (enlace, icono QR) | **13.93 ✓** |
| | `--text-2` / `--surface-2` (notas) | **6.03 ✓** |
| | `--state-err` / blanco (estado error) | **6.74 ✓** no-texto |
| **badges** | ciruela / mostaza `#F4B63B` | **8.45 ✓** · mostaza como texto: 1.81 ✗ prohibido |

**Fuentes:** `DASHBOARD-AUDITORIA.md` §1/§3 (vetos y lista de ítems) · `PANEL-UX.md` §2–§8 (cotas heredadas, dataset, estados, `--surface-2`) · `DESIGN-CONTRACT.md` §1–§6 (coral, tokens, escala, superficies, estados, prohibiciones) · `ANALISIS-QR.md` §2/§4 (forma de la URL, tamaños, quiet zone) · `VERIFICACION-PANEL.md` §4 (medida real en navegador) · `_tokens.scss` + `_brand-vars.scss` (valores) · `src/app/data/panel-demo.js` (los 8 renglones) · `package.json` (`react-icons ^5.5.0`, cero librería de gráficos) · `src/app/data/site.js:19` (host sin definir) · mdn: `html.elements.nav`, `css.properties.position.fixed`, `aria-current` · contexto7: `.offcanvas-lg` de Bootstrap 5.3. RAG: sin hits normativos para "sidebar" / "dashboard density" (8 consultas, 0 resultados) → las afirmaciones sin cita son **criterio propio de diseño** y están acotadas a cotas y orden de colapso.
