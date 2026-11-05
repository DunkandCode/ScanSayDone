# EFECTOS-Y-MOTION — gradientes, efectos y movimiento (landing Scan-Say-Done)

> Política de efectos para el sitio de marketing · 2026-10-27 · cero código de producción.
> Tokens mandantes: `DESIGN-CONTRACT.md` §2–§6 · cotas: `UX-LANDING.md` + `wireframes/GRID-SPEC.md`.
> Fuentes: `context7:/twbs/bootstrap` (`.bg-gradient` nativo = blanco semitransparente hacia abajo; `$enable-reduced-motion` soportado desde v5.0; utilidades `position-sticky` / `overflow-*` sin variantes responsive) · `mdn: css.types.gradient.linear-gradient` (Chrome 26/FF 16/Safari 7 — coste ~0) · `mdn: css.properties.backdrop-filter` (Chrome 76/FF 103/Safari 18 → **fallback obligatorio**, iOS 17 cae al fallback) · `mdn: css.properties.will-change` (Chrome 36/FF 36/Safari 9.1) · `mdn: css.at-rules.media.prefers-reduced-motion` (Chrome 74/FF 63/Safari 10.1) · `mdn: css.properties.content-visibility` (Chrome 85/FF 125/Safari 18) · `rag: chk:c30bd1ee`+`chk:0e47cb72` (refactoring-ui: la sombra comunica elevación y debe acercarse al borde del elemento) · `rag: c:dac9d7d5` (Frain 2025: notación `linear-gradient`) · `rag: c:0c220e91` (Frain: sombra/filtro = herramienta, no decoración gratuita) · skills: `awesome-claude-design-mastery` (slop audit 20 ptos), `frontend-design` (stagger 50–100 ms; entrada 400–600 ms; hover sin layout shift), `premium-web-design`. Query RAG `microinteraction` = 0 chunks útiles → lo que sigue sin cita es `criterio propio`.

## 1. Lo prohibido (P0 — reveta en revisión)

| Prohibido | Motivo | Detección |
|---|---|---|
| Gradientes púrpura→cian / índigo `#6366f1`→`#3b82f6` / cualquier 2 stops fuera de `--grad-*` | marca-firma es coral+ciruela+crema; es el slop nº1 (`awesome-claude-design`) | `grep -E "#6366f1|#8b5cf6|#06b6d4|#3b82f6"` = 0 |
| `.bg-gradient` nativo de Bootstrap sobre `.bg-primary/.btn` | capa de blanco semitransparente lava el coral y rompe los ratios publicados 5.08/14.53 (`context7:`) | `grep "bg-gradient" src/` = 0 |
| Glassmorphism generalizado (vidrio en tarjetas, bandas, modales del landing) | el landing vive de plano sólido + borde 1px; hoy no hay ninguna superficie tolerada (§2.3 desusada) | conteo `backdrop-filter` = 0 (§3) |
| Blobs decorativos (orbes difuminados sueltos, manchas `radial-gradient` fuera de token, grain) | sin fuente en la lámina de marca; coste de repintado; cero intención | cualquier `radial-gradient` fuera de token = 0. Única excepción admitida (F8.5, registrada 2026-10-28): el glow tokenizado `--glow-hero` — estático, con techo y ratios de §2.1; sigue prohibido el orbe sin token y el grain |
| Sombras de 5 capas / sombras apiladas / sombra bajo texto | elevación = una capa (`rag: chk:c30bd1ee`); sombra sobre texto ya vetada en `DESIGN-CONTRACT` §6 | `box-shadow` con >2 comas = 0 |
| Parallax (scroll multiplicado, fondo desplazado a velocidad ≠1) | mareo, CLS, exige JS → prohibido por contrato del plan (0 JS extra) | sin listener de `scroll` en marketing |
| Autoplay de vídeo con sonido; carruseles con autoplay (swiper / tiny-slider) | WCAG 2.2.2; el template ya carga esas deps — **no se montan en marketing** | `grep -E "autoplay" src/app/(marketing)/` = 0 |
| Animación que bloquea la lectura (texto que se escribe solo — `react-type-animation`; contadores `react-countup` sobre datos no pilotados) | el texto debe ser contenido, no espectáculo; el 4.º claim sin dato real está prohibido (BUILD-ORDER r2) | deps de animación = 0 montadas en landing |
| Efecto con transición de propiedades de layout (width/height/top/left/margin/padding/box-shadow) | reflow por frame → CLS y jank (§3) | §5 check 3 |
| Cualquier animación/transition sin rama `prefers-reduced-motion` | contrato §5 ya fija 0.01 ms; sin excepciones | §5 check 2 |

## 2. Lo permitido — 4 familias, con token y límite

### 2.1 Familia GRADIENTE (4 tokens, solo en `:root` de `_tokens.scss`)

| familia | donde se usa | token / valores exactos | coste | límite |
|---|---|---|---|---|
| gradiente de marca | **solo gráficos decorativos sin texto encima**: regla de 3–4 px enmarcando la tarjeta QR **cuando el QR real entre en F5** (`ANALISIS-QR.md §3`; el hero va sin QR desde F2); banda-cierre decorativa del CTA final (F8). Nunca bajo texto, nunca en botón | `--grad-brand: linear-gradient(135deg, #FF5F44 0%, #2E1E3F 100%)` | ~0: rasterizado una vez (`mdn:`) | máx. 1 elemento/sección, 2 por página |
| overlay de foto | **reservado**: hoy las fotos van con caption debajo, sin texto sobre imagen (`UX-LANDING` §3.4b). Si F5 exige rótulo sobre la foto: solo crema sobre la zona ≥0.55 y re-medir AA contra la imagen real | `--grad-overlay: linear-gradient(180deg, rgba(46,30,63,0) 40%, rgba(46,30,63,0.55) 75%, rgba(46,30,63,0.80) 100%)` | ~0 estático | solo fotos, nunca bandas planas |
| degradado de superficie | transición interna crema→blanco de 120 px al inicio de una sección blanca sobre banda crema (F3/F5/F7), **sin texto en la zona de mezcla**; la alternancia de bandas §4 se respeta | `--grad-surface: linear-gradient(180deg, #FFF8F2 0%, #FFFFFF 100%)` | ~0 estático | 1 por sección, 3 por página |
| glow radial de banda **(F8.5 — registrado 2026-10-28; colocaciones ampliadas en F9, 2026-10-28)** | **2 colocaciones de banda ciruela: el hero de la landing (`_home.scss:352`) y el `page-hero` de las 8 rutas internas (`_page-hero.scss:11`)**, centro en 18% 6% (esquina superior izquierda); es `background-image` **sobre** el `background-color` ciruela, nunca lo reemplaza; estático — no se anima (§4 "NO se anima" aplica); mismo token en ambas colocaciones | `--glow-hero: radial-gradient(70% 70% at 18% 6%, color-mix(in srgb, #FF5F44 28%, transparent) 0%, transparent 72%)` (`_tokens.scss`, valor implementado en `e1b2d1b`; el plan `UPGRADE §4` proponía melocotón 12 % — rige el valor en código) | ~0: estático, rasterizado una vez | **1 por página** (2 colocaciones en el sitio — hoy: hero de la landing + `page-hero` en cada interna; la banda CTA final sigue libre); jamás bajo texto con contraste sin recalcular: **medido sobre la captura** `qa-f85-verif.png` — coral `CLIENTES?` vs fondo en su zona **4.8 ✓** (piso display 3.0; teórico en el centro del glow, mezcla coral 28 % sobre ciruela: 3.33, también ≥3.0); mostaza del kicker sobre el fondo del glow **6.1 ✓** (5.9 en el píxel más claro); en el `page-hero` no hay texto coral ni mostaza sobre el glow — kicker, breadcrumb y lead van en crema (kicker 75 %, `_home.scss:926-928`) y el H1 en crema liso; el par crema-vs-fondo-del-glow no se re-midió en esta banda: **a medir** si el gate lo exige (referencia: crema sobre ciruela lisa 14.53) |

### 2.2 Familia ELEVACIÓN (una sola sombra + borde)

| familia | donde se usa | token / valores exactos | coste | límite |
|---|---|---|---|---|
| sombra de tarjeta | **solo** tarjeta clicable/hovered (panel-preview, canal si clica, plan recomendado). Tarjeta estática = marco sin sombra (`UX-LANDING` §5.1) | `--shadow-card: 0 8px 24px rgba(46,30,63,0.10)` · hover: `--shadow-card-hover: 0 12px 32px rgba(46,30,63,0.14)` (una capa; `rag: chk:0e47cb72`: sombra pegada al borde) | pintado 1×; **la sombra no se transiciona** (cambio instantáneo, solo `transform` se anima) | ≤3 elementos con sombra por viewport; 0 sobre texto |
| borde 1px como separador | default de todo marco: fotos 4/3, captura del panel, inputs, acordeón FAQ, tabla precios · **F8.5: tarjetas de canal y marcos de aplicaciones pasan el reposo a `--border-strong`** (borde sin sombra, §2.2 sigue intacto) | `1px solid var(--border)` = `color-mix(in srgb, #2E1E3F 14%, #FFF8F2)` (contrato §2) · input en reposo y marcos F8.5: `--border-strong` **50 %** (3.03 vs crema · 3.18 vs blanco ≥3.0 ✓; era 28 % en el contrato, subido en `b93943b`) | 0 | ninguno (es el sustituto de la sombra) |

### 2.3 Familia SUPERFICIE TRANSLÚCIDA (backdrop-filter)

| familia | donde se usa | token / valores exactos | coste | límite |
|---|---|---|---|---|
| blur de navegación | **DESUSADO (`fb7d600`)**: navbar fijo con superficie crema permanente, texto ciruela y borde inferior de 1 px; sin estados ni JS. Motivo: sobre bandas claras el texto crema se perdía, y el estado por scroll resultó frágil. El hero queda separado por `main { padding-top: 76px }` | el `color-mix` crema 92 % + `blur(8px)` del plan B no se aplica; sin fallback que dar (iOS ≤17 ya no participa) | 0: sin listener de scroll, sin repintado por frame | **0 elementos** con `backdrop-filter` en el landing; la familia queda reservada (uso futuro solo por acta) |

### 2.4 Familia ESTADOS (hover / focus / active)

| familia | donde se usa | token / valores exactos | coste | límite |
|---|---|---|---|---|
| hover/focus de elementos | tabla §5 de `DESIGN-CONTRACT` sin cambios: btn primario hover `--link`/crema (flip ciruela↔crema = firma §6); card clicable `translateY(-1px)`; enlace hover `--brand-coral-darker`; input `--border-strong`→`--focus-ring` | `--dur-micro: 150ms` · `--ease-ui: cubic-bezier(0.4,0,0.2,1)` · `transition: color 150ms, background-color 150ms, border-color 150ms, transform 200ms` (solo estas propiedades; nada de `all`) | bajo (compositor) | hover sin mover layout (`frontend-design`); foco = `outline:3px var(--focus-ring)`, **instantáneo**, sin transición |

## 3. Presupuesto de rendimiento

| Regla | Valor | Base |
|---|---|---|
| Elementos con `box-shadow` por viewport | ≤ 3 | §2.2 + `rag: c:0c220e91` |
| Elementos con `backdrop-filter` | **0** | §2.3 (desusada: navbar crema permanente `fb7d600`) |
| Elementos con `filter:`/blur sobre imágenes | 0 | skeleton va estático, sin shimmer (pinta todo el tile cada frame) |
| Animar propiedades de layout | prohibido: `width,height,top,left,right,bottom,margin*,padding*,box-shadow,font-size,background-position` | reflow; solo `transform`+`opacity` (composited, `criterio propio`) |
| `will-change` | **0 elementos** en el landing | coste de memoria por layer (`mdn:`); los ≤6 elementos animados no lo necesitan |
| Efecto destacado por pantalla | 1 regla: por sección, máximo 1 gradiente activo + 1 elemento elevado; el CTA coral primario visible sigue siendo 1 (`UX-LANDING` §6) | anti-ruido |
| Imágenes | `width`/`height` o `aspect-ratio` siempre; `loading="lazy"` bajo el fold | CLS 0 (BUILD-ORDER r5) |
| Secciones bajo el fold (F5,F6,F7,F8) | `content-visibility: auto; contain-intrinsic-size: auto 400px` en el `<section>` | skip de layout/paint; no-soportado = no-op (`mdn:` Chrome 85/FF 125/Safari 18) |
| JS de efectos | 0 líneas nuevas; nada de `react-countup`, `react-type-animation`, swiper/lightbox en marketing | mandato del plan; deps existentes no se montan |

## 4. Movimiento

| Qué se anima | Cómo | Duración / easing |
|---|---|---|
| Entrada del hero (carga, 1 vez): kicker→H1→lead→CTA en grupo ≤4 elementos | `@keyframes` opacity 0→1 + `translateY(12px)→0`; stagger 60 ms entre hermanos (`frontend-design`: 50–100 ms) | 500 ms · `--ease-out: cubic-bezier(0.16,1,0.3,1)` |
| Entradas de sección al hacer scroll | **permitido solo** como mejora CSS: bajo `@supports (animation-timeline: view())`, opacidad/translate en rango `entry 0%→60%`; navegador sin soporte = contenido estático. 0 JS | 400 ms · `--ease-out` |
| Hover de botón (flip), enlace, borde de input | `§2.4`: color/background 150 ms; card `transform` 200 ms | `--ease-ui` |
| Apertura de menú (offcanvas) y acordeón FAQ | dejar los 350 ms por defecto de Bootstrap — **no re-escribirlos** (`context7:`) | BS default |
| Scroll suave de anclas | BS ya lo activa bajo `prefers-reduced-motion: no-preference` (`context7:`) | navegador |

**NO se anima:** parallax, reveal con JS/IntersectionObserver propio, contadores, texto que se teclea, shimmer de skeleton, logo, imágenes, sombras, `border-radius`, nada que mueva contenido ya leído.

**`prefers-reduced-motion` (bloque exacto, valor del contrato §5):**

```css
@media (prefers-reduced-motion: reduce) {
  :root { --dur-micro: 0.01ms; --dur-ui: 0.01ms; --dur-enter: 0.01ms; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important; scroll-behavior: auto !important;
  }
}
```

`$enable-reduced-motion: true` en la cabecera de `bootstrap.scss` (default BS, `context7:`) — los componentes BS ya emiten su propia versión del media query. 0.01 ms, no `none`: mantiene vivos los eventos `transitionend` (excepción única de `!important`: esta capa de a11y, fuera de los bucles del template — lo aprueba el gate de revisión como bloque conocido).

**Criterio "el contenido se ve sin animación" (progressive enhancement):** ninguna regla de estilo pone `opacity:0` permanente sin par `reduce`/`@supports`; si se desactivan todas las animaciones del landing, el resultado es idéntico en texto y orden de lectura al activadas: la animación **añade**, nunca **comunica**. Los 4 gradientes §2 son estáticos → inmunes a este criterio.

## 5. Verificación (3 checks, fallan la fase)

1. **Gradientes/filtros fuera de token = 0:** `grep -nE "linear-gradient|radial-gradient|box-shadow|backdrop-filter" src/app/assets/` → todo hit es una definición `--grad-*|--glow-*|--shadow-*` en `_tokens.scss` o un `var(...)`; 0 hex sueltos fuera del token; tabla §1 detecciones = 0. *(F9, 2026-10-28: `radial-gradient` tiene exactamente 1 hit — la definición de `--glow-hero` (`_tokens.scss:88`) — y **2 colocaciones** `var(--glow-hero)`: `.hero-band` (`_home.scss:352`) y `.page-hero` (`_page-hero.scss:11`). El conteo corrigió el texto, no la regla: la nota anterior decía 1 colocación porque `page-hero` aún no existía; sigue prohibido cualquier glow fuera del token.)*
2. **Reduced-motion real (Playwright):** este MCP no expone `browser_emulate_media` (46 tools listados, verificado hoy) → usar `browser_run_code_unsafe` con `page.emulateMedia({ reducedMotion: 'reduce' })`, luego `browser_navigate` `/` + `browser_resize` 375 y 1440 + `browser_take_screenshot` + `browser_verify_text_visible` sobre H1/lead/CTA de F2–F8 → la lista de nodos/texto es idéntica a la modalidad sin emular; en DevTools, 0 transiciones >50 ms.
3. **Presupuesto por fase:** Lighthouse móvil throttled: **CLS ≤ 0.02** (objetivo 0; las fotos con `aspect-ratio` lo garantizan, `mdn: css.properties.aspect-ratio` ya citado en UX-LANDING) + `performance.getEntriesByType('layout-shift')` filtrado = 0 shifts atribuibles a elementos animados (nombre de nodo de la sección).

---

## 6. Enmiendas 05-nov-2026 — desviaciones reales, registradas

> Este apartado existe porque el contrato y el código se separaron y **manda el código**: las tres primeras filas no son precisiones de redacción, son cosas que el documento daba por cero y ya no lo son. Mientras no se cerraran aquí, el §3 se leía como una promesa incumplida.

| § | Lo que decía | Lo que hace el código | Decisión |
|---|---|---|---|
| **§2.1 gradientes** | `--grad-warm` solo en el login | **2 colocaciones**: el login y la banda de canales | Aceptado: la banda cálida es la **masa de color** que hace legible el vidrio de las tarjetas. Sin ella el vidrio se lee sólido (medido en `VERIFICACION-LOGIN-VIDRIO-2026-11-05.md` §2) |
| **§2.3 y §3 superficie translúcida** | "**0 elementos** con `backdrop-filter`" | **1**: la tarjeta del login (14 px) | Aceptado con reserva. La familia sigue **cerrada por defecto**: el único uso está en el login, y la medición dice que **no produce efecto visible** sobre degradado liso. Canales y panel **no** lo usan, precisamente por eso. Cualquier uso nuevo vuelve a pedir acta |
| **§2.2 y §3 elevación** | "≤ 3 elementos con `box-shadow` por viewport" | **4** en la banda de canales (`--shadow-glass` × 4) | Aceptado con límite explícito: son 4 **en esa banda y en ninguna otra**; panel (3) y QR (2) están dentro del presupuesto. Si aparece un quinto, se recorta la sombra antes de añadir el elemento |
| **§4 movimiento** | entradas de sección solo por CSS | Confirmado: canales usa `animation-timeline: view()` con `--in` 0/8/16/24 % | **Se refuerza la regla.** Se evaluó instalar GSAP para ese stagger y se **rechazó con número**: ~70 KB gzip para lo que hacen 16 líneas de SCSS, y rompía §3 ("0 JS de efectos") y §4 ("entrada solo por CSS"). La decisión y el snippet están en `CANALES-UX.md` §6 |

### Familia nueva: VIDRIO (derivada, no un quinto gradiente)

| familia | dónde | tokens | coste |
|---|---|---|---|
| superficie de vidrio | canales (4 tarjetas) · panel (3 de resumen + 2 del QR) · tarjeta del login | `--grad-glass` (crema 78 %→64 %) · `--grad-warm` (la masa detrás) · `--edge-lit` (`inset 0 1px 0`) · `--shadow-glass` | pintado 1×; **no se anima** (ni la sombra ni el desenfoque) |

**Regla del vidrio, medida:** una superficie translúcida **sobre un fondo plano se lee sólida**. El vidrio necesita **masa de color detrás** o no existe. Por eso cada uso arrastra su banda: canales trae `--grad-warm`, el panel también, y el login trae su gradiente. **Ningún vidrio nuevo se aprueba sin nombrar la masa que tiene detrás.**

**La tabla no va en vidrio.** En el panel, la tabla de respuestas quedó **blanca y opaca**: 8 filas apilando dos degradados, con el peor texto en 4.68 (margen de 0.18 sobre AA). El vidrio cuesta contraste y no devuelve efecto. Acta: `VERIFICACION-PANEL-VIDRIO-2026-11-05.md` §2.
