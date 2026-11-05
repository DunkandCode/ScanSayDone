# Índice de wireframes — landing Scan-Say-Done

> Los planos ASCII low-fi viven en `../UX-LANDING.md` §3 (única fuente de layout). Este archivo es registro y nomenclatura; no duplica trazos. Estado del pipeline: plano conceptual → aprobación → PNG/mockup → implementación.

| # | sección | plano | estado | notas |
|---|---|---|---|---|
| 1 | Hero | UX-LANDING §3.1 | conceptual | breakpoint del burger fijado <lg (criterio propio); logo claro depende del asset P0 |
| 2 | Prueba de confianza | §3.2 | conceptual | 4.º claim (conteo de QR) solo con dato real del piloto — PLAN §6 |
| 3 | Cómo funciona 3 pasos | §3.3 | conceptual | números = badges CSS/SVG, prohibido emoji (contrato §6) |
| 4 | Canales | §3.4 | conceptual | sin CTA por tarjeta (informativos); mini-visual es CSS Grid auto-fit |
| 5 | Aplicaciones "Así se ve en tu local" | §3.4b | conceptual + plano métrico (27-oct) | `08-aplicaciones.svg` añadido; PNG pendiente (rasteriza el orquestador con sharp); renders de la pipeline mockups |
| 6 | Panel (captura) | §3.5 | conceptual | bloqueado por captura real del panel (S2); mientras: skeleton "demo" |
| 7 | Precios | §3.6 | conceptual | planes definitivos no cerrados en PLAN §10 → estructura aprobada, copy pendiente |
| 8 | FAQ | §3.7 | conceptual | acordeón Bootstrap; chevron SVG inline (deuda F2) |
| 9 | CTA final | §3.8 | conceptual | segunda banda ciruela; nunca dos CTAs coral visibles a la vez |
| 10 | Footer | §3.9 | **aprobado (27-oct)** | H-1 resuelto por el operador: banda **crema `#FFF8F2`** (acta `../DECISIONES-2026-10-27.md` §4); enlaces `--link #B23A2A` (5.65), secundario `#65586E` (6.29); PNG pendiente de re-rasterizado |

## Planos metricos SVG (fuente de verdad de medidas) — 2026-10-27, revisado 2026-11-05

`00-grid-system.svg` + `01-hero.svg` · `02-como-funciona.svg` · `03-canales.svg` · `04-panel-preview.svg` · `05-precios.svg` · `06-faq-cta.svg` · `07-footer.svg` · `08-aplicaciones.svg` · `09-page-hero.svg` — viewBox 1440, capas `band/grid-12/container/content/measure` (+ `labels` en `09`), cotas en px. Reglas y tabla de medidas: `GRID-SPEC.md` (esta carpeta). Los ASCII de UX-LANDING §3 siguen siendo el plan conceptual; el SVG manda en numeros. **`09-page-hero.svg` es el único dibujado con medidas de navegador (29-oct, Playwright 1440 y 375); el resto en su mayoría era planificación del 27-oct. Tras la revisión del 05-nov, siete planos (01 · 03 · 04 · 08 · 10 · 11 · 12) se redibujaron contra el código implementado y hoy la verdad visual son las capturas de `../capturas/2026-11-05/`.**

| # | seccion | plano SVG | contenedor · col |
|---|---|---|---|
| 1 | Hero | `01-hero.svg` | xl 1140 · 73 · row 655+24+461 |
| 3 | Como funciona | `02-como-funciona.svg` | xl 1140 · 73 · 3x364 |
| 4 | Canales | `03-canales.svg` | xl 1140 · 73 · 4x267 (4 tarjetas, R1 resuelto 27-oct: MOSTRADOR · INSTAGRAM · WHATSAPP · TIKTOK LIVE) |
| 5 | Panel | `04-panel-preview.svg` | xxl 1320 · 88 · frame 872x545 (16/10) |
| 6 | Precios | `05-precios.svg` | xl 1140 · 73 · 3x364 |
| 7+8 | FAQ + CTA | `06-faq-cta.svg` — **SUPERSEDED (27→28-oct)**: se implementaron **dos bandas separadas** (FAQ crema + CTA ciruela) según `VERIFICACION-F8.md` ("el plano queda superado; debe marcarse como *superseded*") y `UX-LANDING §2` filas 8-9; se conserva solo como referencia del row 550+24+386 (R2) | lg 960 · 58 · row 550+24+386 (ver R2) — valor no vigente |
| 9 | Footer | `07-footer.svg` | xl 1140 · 73 · 4x267 (banda crema #FFF8F2 · H-1 resuelto 27-oct; 4x267+3x24=1140 intacto) |
| 5 | Aplicaciones | `08-aplicaciones.svg` | xl 1140 · 73 · 3x364 · marcos 4/3 364x273 (banda blanca) |
| — | **page-hero (8 rutas internas)** | `09-page-hero.svg` | xl 1140 · 73 · columna de contenido **1116** (x 162) · banda **A 430** (kicker+lead) · banda **B 321** (sin lead) · móvil 375: py 60/60 · banda 337 — **medido en navegador 29-oct** |

## Planos metricos SVG del panel (d01–d04) — 2026-10-27

`d01-overview.svg` · `d02-opiniones.svg` · `d03-respuestas.svg` · `d04-mobile.svg` — mismas capas `shell/grid-12/container/content/measure` y cotas en px. Desktop: viewBox 1440 · sidebar 264 · C = 1440 − 264 − 2x24 = **1128** · col 72 (gutter 24). Movil: viewBox 390x844 · drawer cerrado (la sidebar no se dibuja) · contenido **358** (16 + 358 + 16) · col 15.17 (gutter 16) · span-6 = **171** exacto. Dataset demo unico d01-d04 · n&lt;10: solo absolutos, cero porcentajes.

| plano | seccion / vista | viewport · contenedor · col | PNG |
|---|---|---|---|
| `d01-overview.svg` | Panel · Resumen (4 KPI + grafico + lista + 1 alerta) | 1440 · sidebar 264 · C 1128 · col 72 · KPI 4x264 · barras 7x64 gap 31 | PNG: pendiente |
| `d02-opiniones.svg` | Panel · Opiniones (filtros chip + lista cruda + paginacion) | 1440 · sidebar 264 · C 1128 · col 72 · fila 16+96+24+668+24+140+24+120+16 | PNG: pendiente |
| `d03-respuestas.svg` | Panel · Respuestas (lista span-4 con **filtro de cola**: Todas · Sin responder · En revision · Resueltas + detalle span-8 con literal del cliente y accion Responder) | 1440 · sidebar 264 · C 1128 · col 72 · 360 + 24 + 744 = 1128 | PNG: pendiente de re-rasterizado (renombrado desde `d03-alertas`) |
| `d04-mobile.svg` | Panel · Movil (KPI 2x2 + grafico + 2 filas, drawer cerrado) | 390x844 · contenido 358 · col 15.17 · span-6 = 171 (171+16+171) · alerta 148 · boton 326x48 | PNG: pendiente |

> Nomenclatura: d04 usa **390** de ancho (viewport del dispositivo de referencia), no los 375 de la regla de nombres de abajo. Si el orquestador rasteriza como `…-movil.png`, fijar uno y alinear aqui.

## Resueltos por el operador — 2026-10-27 (acta `../DECISIONES-2026-10-27.md` aprobada)

- **R1 (canales):** 4 tarjetas, no 3 → orden fijado `MOSTRADOR · INSTAGRAM · WHATSAPP · TIKTOK LIVE` (acta §3).
- **H-1 (banda del footer):** crema `#FFF8F2`, no ciruela (acta §4; la orden de rasterizado la llamó **R4**). Enlaces `--link #B23A2A` (5.65 vs crema) · secundario `#65586E` (6.29).
- **Alertas → Respuestas:** `d03-alertas.svg` renombrado a `d03-respuestas.svg` con `git mv` (historial conservado; también su PNG). La cola de alertas pasa a ser **filtro** dentro de la lista (acta §1).
- **Pendiente de re-rasterizado:** `03-canales.png`, `07-footer.png`, `d03-respuestas.png` — los PNG actuales muestran el plano anterior (obsoletos).

## Deuda documental F8.5 (2026-10-28) — planos NO actualizados

Los planos SVG son la fuente de verdad métrica y **no se reescriben** en esta pasada; se anota la brecha:

| plano | qué falta | por qué no se toca |
|---|---|---|
| `01-hero.svg` | glow `--glow-hero` en la banda, acento coral en `CLIENTES?` (2.ª línea del H1) y solape de la tarjeta (~45 px, solo ≥1200 px) | **CERRADO 29-oct (parcial):** glow y acento coral ya están anotados en el plano. El **solape queda descartado** (`UX-LANDING §3.1` · `ANALISIS-QR §3`: la tarjeta no solapa la banda) y el bloque de escaneo se sustituyó por la **tarjeta de encuesta** con escala 1-5. La retícula que el plano manda no cambió (655+24+461=1140 intacto); la fila **R7** de `GRID-SPEC §3/§6` ya no hace falta para el hero |
| `02` · `03` · `04` · `08` | línea de eyebrow (`.section-kicker`) sobre el H2 | cota ya gobernada por `DESIGN-CONTRACT §3` (overline 13/12 · .14em): dibujar el eyebrow no añade medición; gate de copy pendiente en `COPY-LANDING §13` (ítems 7–11) |
| `05-precios.svg` · `07-footer.svg` | — | intocados: precios no publicado (C3, flag `showPricing`) y footer sin cambio F8.5 |
| **8 rutas internas** (aboutus · services · service-detail · contactus · terms · privacy · faqs · pricing) — F9, 2026-10-28 | **no existe plano para ninguna**: la medida del `page-hero` vive solo en el código (`_page-hero.scss`, componente `page-hero.jsx`) — banda ciruela + `--glow-hero` con container-xl 1140 | Si se hace el plano, medir: **alto total de banda** (padding `--band-y-d` 100 px / `--band-y-m` 60 px en código; el total con contenido queda **a medir**), **escala del H1** (44 · 64 ≥992 · 88 ≥1200 px Bebas en código; el plano debe cotear bloque y línea base), **ancho del lead** (max 60ch en código; equivalencia en px a 1140 **a medir**), **separación del breadcrumb** (16 px al kicker y 12 px del kicker al H1 en código; el plano mide altos de bloque). Motivo del registro: F9 implementó la banda sin plano — la fuente de verdad métrica de las internas es hoy el `.scss`, excepción a la regla de arriba |

## Estado consolidado de los planos (29-oct-2026, HEAD `02978a1`)

> Reemplaza como estado vigente a la "Deuda documental F8.5" de arriba (que se conserva como historial). **Los planos de landing son planificación del 27-oct; la verdad visual son las capturas de `../capturas/2026-10-29/` y la verdad métrica es el CSS compilado.** Excepción: `09-page-hero.svg` (29-oct, medido en navegador) y `01-hero.svg` (diagrama corregido 29-oct, sin escaneo en la tarjeta). Diagnóstico completo y desfase por desfase: `../ENTREGA-UX.md` §4.

| plano | sección | estado | motivo |
|---|---|---|---|
| `00-grid-system.svg` | retícula | **VIGENTE** | 12 col · container 1140 intactos; no cubre `page-hero` |
| `01-hero.svg` | Hero | **VIGENTE v3 · 05-nov** | se corrigió el único error factual: **ya no dibuja escaneo** (era un bloque 200x200 etiquetado como código de escaneo; la decisión está cerrada en `../ANALISIS-QR.md` §3) → hoy **tarjeta de teléfono** con cabecera de marca, «¿Cómo fue tu atención?», escala 1-5 (el 5 activo en coral), botón coral «Enviar» y badge mostaza «3 preguntas». Añadidos: `--glow-hero` (radial coral 28 %, decorativo) y el acento coral de `CLIENTES?` (2.ª línea del H1, 5.08:1). **Sin solape de tarjeta** (descartado en `UX-LANDING §3.1`). Sigue sin cotizar F8.5/F9: no lleva `hero-kicker` cotizado y la retícula 655+24+461 no cambia |
| `02-como-funciona.svg` | Cómo funciona | **VIGENTE v2 · 05-nov** | + eyebrow `SIMPLE Y RÁPIDO` y el claim recuperado **`El mismo QR sirve para siempre`** en el paso 1 (venía de la franja de confianza eliminada). **Enmienda:** la nota anterior de este índice decía "head hoy centrado" y era **falsa en el otro sentido** — el código la tiene **a la izquierda** con ghost a la derecha (`.how__headline{text-align:left}`, fix anti-slop); el plano se dibujó izquierda. La centrada es la del FAQ |
| `03-canales.svg` | Canales | **VIGENTE v3 · 05-nov** | banda `--grad-warm` (`#FBDFAC`→`#F9D48F`) con las tarjetas de **vidrio** (`#FEF2E0`→`#FDEDD3` sobre banda `#FBDDA7`), índice mono `01–04`, hover coral y entrada escalonada `--in` 0/8/16/24 %. Se dibuja el `:hover` en la tarjeta 02. Spec `../CANALES-UX.md`; acta `../VERIFICACION-CANALES-2026-11-05.md` |
| `04-panel-preview.svg` | Panel preview | **VIGENTE v3 · 05-nov** | marco 872×545 **vacío con borde discontinuo** (no hay captura real: mismo recurso que el QR del panel) y se oculta en móvil. Se eliminaron los KPIs, el gráfico y los círculos que el plano inventaba dentro de la "captura" |
| `05-precios.svg` | Precios | **NO PUBLICADA · v2 05-nov** | sellada `NO PUBLICADA — estructura aprobada, copy pendiente` (`hasPricing()=false`, `site.js:46`). Se retiraron los textos inventados (`EMPEZAR` → `[CTA pendiente]`) y el badge del recomendado pasó de coral a **mostaza** (`_home.scss:878`) |
| `06-faq-cta.svg` | FAQ + CTA | **VIGENTE v2 · 05-nov** | **redibujado como DOS bandas** a 1:1 (1440×1640): FAQ **≈831 px** sobre **blanco** (`col-lg-8 offset-lg-2 = 632`) + CTA **≈498 px** ciruela. Se eliminó la banda única del v1 (row 7+5) y la micro "sin tarjeta" (vetada). **Enmienda:** el CTA **no** lleva `--glow-hero` — el glow solo existe en `.hero-band` y `.page-hero` |
| `07-footer.svg` | Footer | **VIGENTE v2 · 05-nov** | retícula real **marca span-4 364 + producto span-2 170 + recursos span-3 267 + legal span-3 267** (+3×24 = 1140); el v1 dibujaba 4×267, que **nunca existió**. Banda crema `#FFF8F2`, títulos overline 13, `--link` 5.65:1 y secundario 6.29:1 |
| `08-aplicaciones.svg` | Aplicaciones | **VIGENTE v3 · 05-nov** | los 3 marcos son **vacíos con borde discontinuo** y se ocultan <992 px: el bloque móvil baja a **537 px** (antes 1327). Retícula y marcos 4/3 intactos |
| `d01…d04` | Panel (4 vistas) | **HISTÓRICO (30-oct)** | reemplazado por `12-dashboard.svg`: dibujaban KPIs, gráfico, alertas y paginación, vetados el 30-oct. El concepto del 27-oct queda en el historial de git |
| `12-dashboard.svg` | **Dashboard v3 · shell + 3 secciones** | **VIGENTE v3 · 05-nov** | sidebar **264** + topbar **64** + contenido **1128** (col 72) · Resumen (3 tarjetas de vidrio), Respuestas (tabla **opaca** 1128) y Mi QR (marco 264 sin QR inventado) · vacío por defecto y demo explícito con 8 respuestas · solo absolutos · rail con mini-vistas y móvil con drawer cerrado · spec `../DASHBOARD-UX.md` v2; acta `../VERIFICACION-PANEL-VIDRIO-2026-11-05.md` |
| `10-login.svg` | **Pantalla de acceso (implementada en `/entrar`)** | **VIGENTE v3 · 05-nov** | split 50/50 · izquierda `--grad-warm` con **tarjeta de vidrio al 72 %** (filo `inset 0 1px 0`, `--shadow-glass`, backdrop 14) y tarjeta 400×745 · derecha **arena/arcilla** `--grad-warm-2` con el deck `VISTA DEL PANEL` al **14 %** · empalme por **matiz** (1.03/1.07), no por luz · ritmo cotado **8/10/50/42/54** · texto legal centrado y enlaces `nowrap` · **sin divisor "o"** (un solo método de acceso). Titular `LEE LO QUE TE DICEN`. Nota de craft: el vidrio no se percibe sobre degradado liso; el deck sí, por su relleno mínimo. Actas `../VERIFICACION-LOGIN-VIDRIO-2026-11-05.md` y `../VERIFICACION-LOGIN-DERECHA-2026-11-05.md` |
| `09-page-hero.svg` | **page-hero · 8 rutas internas (F9)** | **VIGENTE (dibujado 29-oct)** | el único plano con **medidas de navegador** (Playwright 1440 y 375): banda A 430 con kicker y lead (`/contactus`) · banda B 321 sin lead (`/faqs`) · móvil 375 py 60/60 banda 337 · fondo `--brand-plum #2E1E3F` · `--glow-hero` anotado como decorativo (no aporta cotas). Sustituye la deuda abierta de F9 |
| `11-panel.svg` | **Panel · dashboard con shell (implementado en `/panel`) — v2** | **VIGENTE v2 · 05-nov** | medidas clave: cabecera app **h64** · container-xl **1140** (col 73 · gut 24) desplazado +90 en el plano (x 240–1380) para liberar el rail — producción centrado x 150–1290, **ancho intacto** · 3 tarjetas span-4 **364×256** con barras div · fila demo con badge DATOS DE EJEMPLO · bandeja **th 74 + filas 56** (pliegue corta en y 900) · rail izquierdo: **mini-vista estado vacío móvil 375 a 1:2** (marco 188×422, cotas reales) · 1 token nuevo `--surface-2`. Cabecera del plano con anotaciones en dos columnas (izq capas · der tokens/medidas). **Implementado** (`/panel`, `/panel/respuestas`, `/panel/qr`): contenido `--grad-warm` ámbar, 3 tarjetas de resumen y 2 del QR de **vidrio**, **tabla blanca OPACA** (sobre vidrio el texto de 13-14 px pierde margen: 4.68 sin margen), sidebar ciruela y topbar blanca como anclas. Spec `../PANEL-UX.md` §2–§8; acta `../VERIFICACION-PANEL-VIDRIO-2026-11-05.md` |

**Decisión ejecutada (29-oct):** no se reescribieron los 9 planos de landing. Su valor está en la retícula, que no cambió; redibujar glow, eyebrows y dos bandas produce una imagen peor que las capturas reales.

**REVISIÓN 05-nov-2026 — esa decisión se revirtió donde dejó de ser cierta.** Se redibujaron **11 planos** (los 9 de landing salvo `09-page-hero`, que ya estaba medido, más `11-panel` y `12-dashboard`) porque el código cambió de lenguaje visual y los SVG afirmaban cosas falsas (divisor "o" en el login, franjas que ya no existen, tarjetas blancas donde ahora hay vidrio, un panel "no implementado" que sí lo está):

| plano | versión | por qué |
|---|---|---|
| `01-hero` · `03-canales` · `04-panel-preview` · `08-aplicaciones` | v3 | landing tras la purga de slop: franja de confianza eliminada, banda cálida y vidrio en canales, marcos vacíos con borde discontinuo |
| `10-login` | v3 | dos lotes atrás: sin gradientes, sin vidrio y con un divisor "o" que no existe |
| `11-panel` · `12-dashboard` | v2 · v3 | el panel pasó de pantalla única a **dashboard con shell** y estrenó vidrio + tabla opaca |
| `02` · `05` · `06` · `07` | v2 | segunda vuelta del mismo día: eyebrow + claim recuperado · precios **sellada como no publicada** · FAQ y CTA como **dos bandas** · footer con marca + 3 columnas (el v1 dibujaba 4×267, que nunca existió) |

Ya no queda ningún plano de landing ni de panel desactualizado. **`d01`–`d04` se conservan como histórico** (los reemplazó `12-dashboard`). **Los PNG no se generaron**: no hay ninguno en la carpeta y la rasterización está **bloqueada por herramienta** — no hay `sharp` instalado, Playwright rechaza `file:` y no alcanza un segundo origen local, y `next start` da 404 para los SVG añadidos después del build (§ `AUDITORIA-CLEAN-CODE-2026-11-05.md` §10). Salida: instalar `sharp` y un script `npm run wireframes:png`, o renderizar desde el editor. **Mientras tanto el SVG es la fuente de verdad y se abre en el navegador sin más.**

## REVISIÓN 2026-11-05 (tarde) — material real y `/contactus` reescrito

> **Reemplaza como estado vigente a la tabla de arriba**, igual que aquella reemplazó a la deuda
> F8.5. Motivo: entre la revisión de la mañana y esta, se implementó **material real** (captura
> del panel, fotos de ambiente, fondo fotográfico en dos bandas) y se **reescribió `/contactus`**
> como página normal del sitio. Cuatro planos afirman hoy cosas que ya no son ciertas.

| plano | estado | qué cambió en el código |
|---|---|---|
| `04-panel-preview.svg` | **DESACTUALIZADO** | El marco **ya no está vacío**: contiene la **captura real** del panel (`public/images/apps/panel-captura.png`, 1160×806, badge `DATOS DE EJEMPLO` visible) y un CTA `VER EL PANEL` → `/panel`. El plano dibuja marco vacío con borde discontinuo |
| `08-aplicaciones.svg` | **DESACTUALIZADO** | Los 3 marcos **ya no están vacíos**: llevan fotos (`cartel-mesa.jpg`, `pantalla-encuesta.jpg`, `vinilo-vitrina.jpg`) con QR impreso en la toma. Se mantiene: son **ilustraciones** y los QR son decorativos (no escanean), y la sección lo declara en pantalla |
| `01-hero.svg` | **DESACTUALIZADO (fondo)** | El hero de la landing lleva **foto de fondo** (luz de ventanal sobre pared crema, oscurecida ×0.74) bajo velo `linear-gradient(90deg, .87 → .84 → .78)` y `--glow-hero` encima. La **retícula 655+24+461 = 1140 no cambió** |
| `06-faq-cta.svg` | **DESACTUALIZADO (fondo y alto)** | El CTA final **dejó de ser ciruela plano**: foto de cafetería desenfocada bajo velo `linear-gradient(180deg, .72 → .80 → .90)`, con `background-color` ciruela como fallback. El alto de la banda ya no es el del plano |
| `09-page-hero.svg` | **DESACTUALIZADO** | Nueva variante **`page-hero--with-image`**: grid `minmax(0, 1fr) 420px` con `gap: 48` (1 columna < 992) y `figure` 420×315 (4:3, radio 16, filo crema 22 %). Además la **separación breadcrumb → título pasó de 0 a 12 px** en las 8 rutas internas (antes se tocaban: `line-height: .92` en 88 px desborda la caja de línea) |
| `13-contacto.svg` | **NUEVO** | `/contactus` reescrito: hero de dos columnas + panel de formulario en `col-lg-8` (736 px). Ver el propio plano |

**Verdad visual de este lote:** capturas en `opendesign/capturas/`. Los PNG de wireframe siguen
**sin generarse** (rasterización bloqueada por herramienta, ver arriba): el SVG es la fuente de
verdad y se abre en el navegador.

**Assets nuevos de este lote:** `public/images/apps/` (3 fotos + captura del panel) y
`public/images/hero-fondo.jpg`, `public/images/cta-fondo.jpg`, `public/images/contacto-hero.jpg`.
Los fondos fotográficos van como `background-image` de CSS: **no pasan por el optimizador de
Next**, así que su peso es el del archivo (56, 106 y 88 KB).

## Nomenclatura reservada para PNGs

`NN-seccion-{desktop|tablet|movil}.png` en esta carpeta:
- `NN` = orden de la retícula (01–10; `aplicaciones` entró como 05 el 27-oct). `seccion` = minúsculas sin acentos: `hero`, `confianza`, `pasos`, `canales`, `aplicaciones`, `panel`, `precios`, `faq`, `cta-final`, `footer`.
- `desktop` = 1440 · `tablet` = 768 (solo si el plano difiere) · `movil` = 375.
- Ejemplos reservados: `01-hero-desktop.png`, `01-hero-movil.png`, `06-precios-desktop.png`.
- Un PNG reemplaza al ASCII solo si añade información (medidas anotadas, color real de banda); el estado "aprobado" se marca aquí, no en el archivo.

## Mockups en generación (paralelo — `../mockups/`)

| archivo esperado | sección | estado |
|---|---|---|
| `../mockups/01-hero-desktop.png` | 1 Hero | pendiente (no existe aún) |
| `../mockups/05-panel-desktop.png` | 6 Panel | pendiente (no existe aún) |
| `../mockups/06-precios-desktop.png` | 7 Precios | pendiente (no existe aún) |
| `../mockups/08-cta-final-desktop.png` | 9 CTA final | pendiente (no existe aún) |

> Al aterrizar cada mockup, actualizar esta tabla a `existente` y enlazar desde la fila de su sección arriba. `opendesign/` al 2026-10-27: `mockups/` y `wireframes/` aún sin PNGs (verificado listado de directorio).
