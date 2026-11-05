# GRID-SPEC — planos medibles del landing Scan-Say-Done

> Fuente de verdad métrica: los SVG de esta carpeta. 2026-10-27 · decision del operador: el landing ES el sitio de Scan-Say-Done.
> Fuentes: `node_modules/bootstrap/scss/_variables.scss:484-490, 503-508, 519-525` (repo real) · `context7:/twbs/bootstrap` (grid.mdx + gutters.mdx) · `mdn: css.properties.gap` (Chrome 57/FF 52/Safari 10.1), `grid-template-columns` (57/52/10.1), `aspect-ratio` (88/89/15) · `rag: chk:abe50e300900050359785fd653fc` (grid = alineación consistente), `chk:69178275ba00e78988f9a7cfad66` (Grid 2D), `chk:9b39c422d6c2bb07792f94cb6f19` (ritmo por proporciones) · "vertical rhythm" exacto no devolvió chunks útiles → `criterio propio`.

## 1. Aritmética del grid (Bootstrap 5.3.7 real del repo)

| Variable | Valor | Prueba |
|---|---|---|
| `$grid-columns` | 12 | `_variables.scss:519` · context7 grid.mdx |
| `$grid-gutter-width` | 1.5rem = **24px** (12px de padding por lado/columna) | `_variables.scss:520` · context7 gutters.mdx: "gutters start at 1.5rem (24px)… match our grid to the spacers" |
| `$grid-row-columns` | 6 | `_variables.scss:521` |
| `$container-padding-x` | = gutter (24px) | `_variables.scss:525` |
| breakpoints | 0 / 576 / 768 / 992 / 1200 / 1400 | `_variables.scss:484-490` |
| containers | 100% / 540 / 720 / 960 / 1140 / 1320 | `_variables.scss:503-508` |

**Fórmulas del plano** (convención fijada por el operador):

```
col      = (C − 11×24) / 12 = (C − 264) / 12      C = max-width del container
span(n)  = n×col + (n−1)×24
cierre   = 12×col + 11×24 = C   (verificado en cada fila de §2)
```

**Convención y desviación contra el navegador** (`criterio propio`, documentado para QA): el plano mide el row a TODO el max-width con 11 gutters interiores. El modelo real de BS5 (padding 12/lado + margen negativo del row) reparte medio gutter extra en los extremos → la columna de texto renderizada es **fórmula − 2 px** (lg: 56 real vs 58 en plano; Δ ≤ 24px por fila en los bordes). Las cotas SVG usan la fórmula del plano; QA mide contra esta nota, no contra ojo.

## 2. Tabla de medidas por breakpoint

| bp | min | container | col = (C−264)/12 | 6 col (mitad) | 4 col (tercio) | 8 col (⅔) |
|---|---|---|---|---|---|---|
| xs | 0 | 100% | apila a `col-12` · a 575px: (575−264)/12 ≈ 26 | — | — | — |
| sm | 576 | 540 | (540−264)/12 = **23** | 6×23+120 = **258** | 4×23+72 = **164** | 8×23+168 = **352** |
| md | 768 | 720 | (720−264)/12 = **38** | **348** | **224** | **472** |
| lg | 992 | 960 | (960−264)/12 = **58** | **468** | **304** | **632** |
| xl | 1200 | 1140 | (1140−264)/12 = **73** | **558** | **364** | **752** |
| xxl | 1400 | 1320 | (1320−264)/12 = **88** | **648** | **424** | **872** |

Spans compuestos que usan los planos: 7col xl = **655**, 5col xl = **461**, 3col xl = **267** (hero, precios, footer, canales); 7col lg = **550**, 5col lg = **386** (FAQ+CTA); 8col xxl = **872** (captura, frame 16/10 → 872×545, `mdn: aspect-ratio`). Comprobación de cierre: 655+24+461 = 1140 ✓ · 4×267+3×24 = 1140 ✓ · 224×2+348−24 = 720 (md 3×4col) ✓.

## 3. Regla de bandas

| Token | Valor | Herencia | Relación con el gutter (24) |
|---|---|---|---|
| `--band-y-d` | 100px | `.mt-100` (`_helper.scss:104`) | 4 gutters + 4 (sp-1) → no múltiplo exacto: excepción aceptada |
| `--band-y-m` | 60px | `.mt-60` (`_helper.scss:150`, media `max-width:768px` = bp md) | 2.5 gutters → excepción declarada (continuidad del template, UX-LANDING §4) |
| `--sp-4` | 24px | escala 4/8 propia | **= 1 gutter exacto** (context7: BS casa gutters con la escala de spacers) |

Ritmo vertical: card↔card y banda↔contenido = sp-4 (1 gutter); lead→cards y CTA→banda = sp-6 (48 = 2 gutters); interior de card = sp-3 (16). Nunca crear más clases `!important` de margen: las bandas son tokens.

## 4. Convención de nombres

**Archivos SVG**: `NN-slug.svg` — `00` = sistema; `01`–`07` = secciones del scroll. Todos: `viewBox="0 0 1440 H"`, fondo blanco, sin fuentes externas (`monospace` cotas + `sans-serif` etiquetas), sin imágenes embebidas, colores de marca solo en acentos (coral `#FF5F44`, ciruela `#2E1E3F`, crema `#FFF8F2`, mostaza `#F4B63B`), retícula ciruela al 10% (columnas blancas al 10% sobre bandas ciruela).

**Capas dentro de cada SVG** (`<g id>` en este orden de pintado):

| id | contenido |
|---|---|
| `band` | fondo de banda a lo ancho (crema/ciruela/blanco) + etiqueta de `--band-y-*` |
| `grid-12` | 12 rectángulos de columna al 10% + eje de los 11 gutters (guía coral discontinua) |
| `container` | contorno discontinuo ciruela con etiqueta `container-{bp} {C}` |
| `content` | cajas de bloque con nombre y clase BS (`col-md-7 = 655px`, etc.) |
| `measure` | cotas: línea + marcas + texto 12px `monospace` gris `#65586E` |

**Anotación de breakpoint** (esquina superior derecha, formato fijo): `xl 1200+ · container 1140 · col 73` — ejemplo breve original `lg 960 · col 58` conservado como formato.

## 5. Qué NO se puede medir en una imagen generada

Los mockups de `../mockups/` son referencia visual (jerarquía, densidad, ritmo) — un modelo generativo **inventa proporciones**: sus píxeles no corresponden a ningún gutter, container o span; la fuente de verdad métrica es exclusivamente el SVG de esta carpeta (`rag: chk:abe50e30…` — el grid sirve precisamente para alinear de forma consistente; una imagen no la garantiza).

## 6. Reconciliaciones y huecos

| # | Choque | Plano | Resolución |
|---|---|---|---|
| R1 | Canales 3 vs 4 tarjetas | `03-canales.svg` dibuja **4** (3+3+3+3) — brief operador 27-oct y mockup 02; UX-LANDING §2 tenía 3 (IG+WA unidas) | **RESUELTA (acta §3, aprobada): 4 tarjetas** `MOSTRADOR`·`INSTAGRAM`·`WHATSAPP`·`TIKTOK LIVE` — cierre `4×267 + 3×24 = 1140 ✓`; responsive `col-lg-6` (2×2 de 468px) abajo de xl; **no** `col-lg-3`: a 992–1199 px da 222px ≈ 25 car/línea (bullets rotos); UX-LANDING §2/§3.4 ya alineados |
| R2 | FAQ y CTA final | `06-faq-cta.svg` los junta en un row 7+5 del `container-lg` (brief); UX-LANDING los trata como bandas separadas | **nota vigente**: la fila 550/386 es válida; las alturas de banda siguen siendo propias |
| R3 | Panel | `04` usa `container-xxl 1320` (única sección xxl, UX-LANDING §1) | — |
| R4 | Footer H-1 | `07` dibujado en banda ciruela (antes ganaba DESIGN-CONTRACT §4) | **RESUELTA (acta §4, aprobada): banda crema** `#FFF8F2`; el plano `07-footer.svg` se actualiza (banda a `#FFF8F2`, etiquetas a `#2E1E3F`); DESIGN-CONTRACT §4 y UX-LANDING §2/§6 ya alineados |
| R5 | xs | sin cota de columna fija: 100% con `col-12` apilado | medir a 375px en navegador, no en plano |
| R6 | Escala de la encuesta (la página no la dibuja; solo el mock decorativo del hero) | preview 1–5 en la tarjeta del hero, `aria-hidden` | **RESUELTA (acta §3/§5, aprobada): 3 preguntas escala 1–5 con etiqueta verbal; sin estrellas ni emoji** — ningún plano necesita acotar glifos de estrella |
