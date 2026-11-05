# VERIFICACIÓN — Canales con vidrio y entrada escalonada + purga del SCSS legacy (05-nov-2026)

> Encargo: "los contenedores de TUS CUATRO CANALES con un toque más futurista, con efectos GSAP y glass; que sea analizado y con un leve toque futurista pero simple, dentro de la paleta".
> Spec: `CANALES-UX.md` (commit `2f021ba`). Capturas: `capturas/2026-11-05/canales-*.png`.

## 1. La decisión que no era obvia: GSAP, no

GSAP **no está instalado** (0 usos en el repo). Se evaluó antes de escribir código:

| Opción | Peso | Código | Contrato de movimiento |
|---|---|---|---|
| **CSS scroll-driven (elegida)** | **0 KB** | 16 líneas SCSS | cumple §3 ("JS de efectos: 0 líneas") y §4 ("entrada solo por CSS") |
| GSAP core | ≈70 KB gzip | ~10 líneas JS + refs + efecto | rompe esas dos reglas P0 |
| GSAP + ScrollTrigger | ≈82 KB gzip | ídem + configuración | ídem |

El efecto pedido —entrada escalonada de 4 tarjetas y un hover— está cubierto al 100 % por CSS. Instalar 70 KB para reproducir lo que hace una `animation-timeline` es coste sin efecto. **Queda disponible**: si el operador quiere GSAP por otras razones (una coreografía futura, por ejemplo), se instala en una línea y este escalonado se reescribe; no es una puerta cerrada, es una decisión con número.

## 2. Los 4 recursos aplicados

| # | Recurso | Cómo |
|---|---|---|
| 1 | Índice mono `01`–`04` | `ui-monospace` del sistema (0 KB de webfont), esquina superior derecha, `aria-hidden` |
| 2 | Vidrio cálido | banda `--grad-warm` + tarjeta `--grad-glass` (token nuevo, cero hex) + filo `inset 0 1px 0 --edge-lit` + `--shadow-glass` |
| 3 | Filo que se enciende | borde blanco 70 % → **coral** al hover; el índice pasa a `--link`; 150 ms, solo `border-color`/`color` |
| 4 | Entrada escalonada | `animation-timeline: view()` + `--in` 0/8/16/24 %, solo `opacity` + `transform` |

**Sin `backdrop-filter`**: se midió en el login que sobre un degradado liso el desenfoque no produce diferencia visible. El vidrio aquí lo hace la α-composición (78 % → 64 %) sobre la masa ámbar. El bundle del landing sigue con **0 `backdrop-filter` nuevos**.

## 3. Medido sobre píxeles del render

| Punto | Antes | Ahora |
|---|---|---|
| Fondo de la banda | crema plano | `#FBDDA7` arriba → `#FAD694` abajo (degradado) |
| Superficie de tarjeta | blanca opaca | `#FEF2E0` arriba → `#FDEDD3` abajo |
| Separación tarjeta/fondo | 0 (opaca) | **+57 en azul arriba, +76 abajo** |

La tarjeta es **más clara que la banda en toda su altura** y **varía de tono hacia abajo**: los dos signos que hacen que el vidrio se lea (lección del login). La variación dentro de la tarjeta (`#FEF2E0 → #FDEDD3`) es el fondo viéndose a través, no un degradado decorativo.

## 4. Contraste (sobre el compuesto medido)

| Texto | Superficie | Ratio |
|---|---|---|
| Kicker / lead `--text-2` | banda `#FBDDA7` | **5.12** |
| H2 ciruela | banda | **11.83** |
| Título ciruela 20/600 | tarjeta `#FEF2E0` | **13.85** |
| Descripción `--text-2` 14 | tarjeta media | **5.99** |
| Label `--text-2` 12/600 | tarjeta abajo | **5.65** |
| Índice en hover `--link` | tarjeta | **5.08** |

Todo AA. Límite heredado: **no poner texto suelto sobre la mitad inferior de la banda** (`--text-2` vs `#F9D48F` = 4.68, pasa sin margen).

## 5. Comprobado en navegador, no deducido del CSS

| Qué | Prueba | Resultado |
|---|---|---|
| Entrada | muestreo de opacidades cada 70 px de scroll | `[0,0,0,0]` → **`[85,58,0,0]`** → `[99,97,92,77]` → `[100,100,100,100]` |
| Escalonado | el mismo muestreo | las 4 tarjetas **entran desfasadas**, no en bloque |
| Hover | `:hover` real con Playwright | borde `rgb(255,95,68)` (coral) · índice `rgb(178,58,42)` (`--link`) |
| Reduced-motion | grep del CSS compilado | `@keyframes` fuera; reglas dentro de `@supports(animation-timeline:view())` **y** `@media(prefers-reduced-motion:no-preference)` |
| `--in` | `getComputedStyle` | `0%, 8%, 16%, 24%` |
| Móvil 375 | medición | 4 tarjetas de 351 px, `scrollX` 0, índices visibles |
| Token nuevo | `check:tokens` | OK |

**Un bug de la spec, corregido al implementar:** el snippet de `CANALES-UX` §6 no definía `--in` para la primera tarjeta. Sin `--in: 0%`, `animation-range` quedaba inválido y la tarjeta 1 **no animaba**. Se añadió `.canales__card { --in: 0%; }` explícito.

## 6. Purga del SCSS legacy (autorizada)

| Métrica | Valor |
|---|---|
| Líneas borradas | **328** (mixin `home-common` + `.bg-*` + `.tilt-3d` + `.swiper-*` + `.text-slider` + `#boxed-layput` + `@keyframes moveSlideshow`) |
| Usos en `src/` | **0** (grep con control positivo: `hero-band` sí aparece, la búsqueda funciona) |
| Llaves SCSS | 233/233 antes → **157/157** después |
| Reglas vivas tras el corte | `.hero-` ×23 · `.canales__` ×11 · `.faq__` ×10 · `.cta-final__` ×7 |
| Build | `✓ Compiled successfully` |

## 7. Pendiente

| # | Pendiente |
|---|---|
| 1 | **`EFECTOS-Y-MOTION.md`** debería enlazar las 5 enmiendas que `CANALES-UX` §10 declara (2.ª colocación de `--grad-warm`, 4 sombras en esta banda, mono del sistema, familia translúcida sin blur). Hoy viven solo en `CANALES-UX`, que es el acta, pero el contrato es el que se lee primero |
| 2 | **Planos**: `03-canales.svg` dibuja las tarjetas blancas opacas y sin índice. El desfase plano↔código ya afecta a login, landing y canales |
| 3 | El vidrio de canales hereda el mismo límite que el del login: sin algo con borde detrás, se lee como panel cálido traslúcido, no como vidrio esmerilado. Aquí **no hace falta más**: la tarjeta es contenido, no decoración |
| 4 | Si se quiere GSAP para una coreografía mayor (no este efecto), decidirlo con una prueba de 3 animaciones, no por la sensación de que "GSAP es más pro" |
