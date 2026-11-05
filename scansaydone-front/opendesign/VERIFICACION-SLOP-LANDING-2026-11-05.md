# VERIFICACIÓN — AI slop de la landing: auditoría y correcciones (05-nov-2026)

> Encargo: "revisar con impecable los AI slop de la landing y mejorar la presentación tomando lo del login".
> Dos auditorías cruzadas + verificación en navegador. Los dos auditores **se corrigieron mutuamente**: eso está en §2 y es la parte más útil del documento.
> Capturas: `capturas/2026-11-05/land-full-*` (antes) y `land3-full-*` (después), 1440 y 375.

## 1. Cómo se auditó

| Fuente | Qué aportó | Resultado |
|---|---|---|
| `designer` (GLM, tras fallar `designer-alibaba` por error del proveedor) | inventario por sección + 6 slop + propuesta N1/N2/N3 | `AUDITORIA-SLOP-LANDING.md`, commit `13e3f41` |
| `code-support` (advisory) | SCSS huérfano, bypasses de token, opacidades, selectores reales de las cabeceras | 4 correcciones al auditor de diseño (§2) |
| Detector `impeccable@4.8.0 detect` | 62 reglas automáticas sobre `page.js` y `_home.scss` | **`[]`, exit 0** — el slop que quedaba no lo ve un linter: es de composición |
| Navegador (Playwright + píxeles) | alturas por sección, alineaciones computadas, marcos, badges | tabla de §4 |

**`code-support` no pudo ejecutar la segunda opinión de Go**: agotó su límite de pasos antes de escribir el archivo temporal. Dejó el comando preparado y verificado (`GO_SUPPORT_ENABLED=1`, `--context-scope local` obligatorio porque `is_ecosystem=false`). Se reporta como **no ejecutado**, no como ejecutado sin resultado.

## 2. Donde los auditores se corrigieron

| Punto | Dijo el diseñador | Dijo el código | Se aplicó |
|---|---|---|---|
| Cabeceras centradas | "son **4**" | el plano `UX-LANDING §3.7` pide el FAQ **centrado**; `.faq__title` ya lo centra por su cuenta → son **3** | **3** (`how`, `canales`, `apps`). FAQ queda explícitamente centrada |
| Las `opacity` .7/.75/.85 | "sin medición, degradan contraste" | "4 degradan texto real (430, 447, 1512, 1539)" | medida la composición: **7.82 / 8.78 / 10.83 / 10.83** → **cumplen AA**. El defecto era *no estar medidas*, no ser ilegibles. Se convierten a `color-mix` **sin cambiar el valor** y con el ratio anotado |
| Bypass de token | no lo detectó | `_home.scss:376` = `rgba(255,248,242,.45)`, RGB literal de `--brand-cream` | corregido a `color-mix` |
| `.how__lead` | no lo detectó | con el H2 a la izquierda, el lead centrado queda asimétrico | alineado a la izquierda |

## 3. Los 6 slop y qué se hizo

| # | Slop | Gravedad | Acción |
|---|---|---|---|
| 1 | `trust-strip`: 4 claims, 3 ya dichos 90 px arriba, iconos que repiten el título | P1 | **franja eliminada** (−193 px de banda); el único claim propio (`EL QR NO SE REIMPRE`) se rescató en el paso 1 |
| 2 | 4 marcos color melocotón con el isotipo repetido + 3 badges `DEMO` | P1 | **marcos vacíos con borde discontinuo** (mismo recurso que el QR del login), sin isotipo, sin badges, una nota común |
| 3 | 4 cabeceras centradas idénticas | P1 | **3 a la izquierda** (how, canales, apps) |
| 4 | 5 pastillas mostaza `DEMO` | P2 | **0** en pantalla; queda el aviso accesible `(demostracion, todavia no disponible)` y la nota "Panel en construcción" |
| 5 | CTA `Ver ejemplo` que ancla a pasos | P2 | **`Ver los pasos`** |
| 6 | SCSS muerto del template | P2 | borradas **170 líneas** (franja eliminada + reglas de marcos/badges/placeholders ya sin JSX) |

## 4. Medido en navegador, antes y después

| Métrica | Antes | Después |
|---|---|---|
| Altura total escritorio | 5374 px | **5251 px** |
| Altura total móvil | 7742 px | **6623 px** (−1119) |
| `apps` en móvil | 1327 px (3 marcos vacíos = 789 px) | **537 px** (0 marcos, 3 leyendas) |
| Marcos con isotipo | 3 | **0** |
| Badges `DEMO` visibles | 5 | **0** |
| Cabeceras alineadas | 0 a la izquierda | **3** (how, canales, apps) + FAQ centrada |
| Hueco CTA → línea de transparencia | 24 px | **40 px** |
| Scroll horizontal | 0 | **0** en 1440 y 375 |

Detalle de la decisión en móvil: los marcos son `col-12 col-lg-4`, así que **apilan por debajo de 992 px**. Tres cajas vacías seguidas se leen como imagen rota, no como "foto pendiente" (que es lo que son). Por debajo de 992 se ocultan y quedan las leyendas —que es la información real—. Escritorio conserva los 3 marcos.

## 5. Contraste (calculado sobre el color compuesto, no estimado)

| Texto | Valor aplicado | Sobre | Ratio |
|---|---|---|---|
| `.hero-subtitle` | crema 85 % | ciruela | **10.83** |
| `.hero-transparency` | crema 70 % | ciruela | **7.82** |
| `.cta-final__subtitle` | crema 85 % | ciruela | **10.83** |
| `.cta-final__honesty` | crema 75 % | ciruela | **8.78** |
| borde ghost del hero (línea 376) | crema 45 % | ciruela | tokenizado |

## 6. Lecciones del login aplicadas

| Lección | Dónde se aplicó |
|---|---|
| (a) el contraste se mide | las 4 opacidades, con el ratio escrito en el comentario del SCSS |
| (b) un contenedor solo comunica lo que tiene detrás | los marcos de fotos inexistentes dejan de ser cajas rellenas: borde discontinuo y vacío, como el QR del panel |
| (c) el filo de luz define el canto | `inset 0 1px 0` añadido a `.hero-phone-card` |
| (d) agrupar lo junto, separar lo suelto | CTA → transparencia de 24 a 40 px |
| (e) contenedor sin relleno + borde fino | regla de los marcos (§3 #2) |

## 7. Lo que **no** se tocó, y por qué

`CLIENTES?` en coral (4.8:1 medido sobre el glow), kicker mostaza, botón ciruela sobre coral (5.08:1) y su inversión al hover, el mock 1–5 del hero (F2 cerrada), `--glow-hero` y sus 2 colocaciones (F9), `min-height: 80vh`, footer crema, navbar crema, y `pricing` oculta tras `hasPricing()`. Sin precios reales, mostrarla sería el peor slop posible: cifras inventadas.

## 8. Pendiente

| # | Pendiente | Tamaño |
|---|---|---|
| 1 | **Bloque legacy del template** en `_home.scss:23-342`: ~320 líneas (`.bg-*`, `.tilt-3d`, `.swiper-*`, `.text-slider`, `#boxed-layput`) con **0 usos** en `src/` | borrado aparte, con su propio commit |
| 2 | **`apps`: 3 marcos → 1** (el de la pantalla de encuesta) + 2 leyendas. Ahorra ~340 px más en escritorio | espera a las fotos reales (F5) |
| 3 | **`.canales__lead`**: el plano lo dibuja a la derecha (`span-4`) y el código lo pone debajo a la izquierda. Drift **preexistente**, no lo introdujo este lote | replano o corrección de código |
| 4 | **`UX-LANDING §2/§6`** dice "FAQ en crema"; el código la tiene en blanco, y el blanco es lo correcto (rompe la adyacencia crema-crema). Es drift de **documento** | una línea |
| 5 | Segunda opinión de Go sobre el recorte | no ejecutada (límite de pasos) |
| 6 | `wireframes/01-hero`, `04-panel-preview`, `08-aplicaciones` describen la landing de antes (con franja de claims y marcos rellenos) | replano |
