# CANALES-UX — «TUS CUATRO CANALES»: vidrio cálido, futurismo de precisión

> 05-nov-2026 · designer · propuesta + acta de enmienda (§10), pendiente de veto/aprobación del operador.
> Fuentes: `_home.scss` §canales (L389-500) · `_tokens.scss` L84-124 · `DESIGN-CONTRACT.md` §1/§2/§5/§6 · `EFECTOS-Y-MOTION.md` §1-§4 · `VERIFICACION-LOGIN-VIDRIO-2026-11-05.md` §2-§3 · `VERIFICACION-LOGIN-DERECHA-2026-11-05.md` §2 · captura `land3-full-1440.png` (analizada con zai-vision).

## 1. Estado actual
- 4 tarjetas blancas **opacas** (`--brand-white`, borde `--border-strong`, radius .75rem, padding 32px) sobre banda crema, **sin sombra** (`_home.scss` L446). Medida real: ~267px ancho ((1140 − 3·24)/4) × ~180px alto (visión: 270-280 × 175-185). Interior: icono 48×48 coral, título Montserrat 600/20, desc 14 `--text-2`, label 12/600.
- **Craft correcto que NO se toca:** label anclado con `margin-top:auto` + `min-height:2.4em` + `flex-grow` en la desc → bordes superiores de los 4 labels alineados (confirmado en captura: baselines idénticas).
- Funciona: retícula limpia, ritmo blanco→crema→blanco, iconografía uniforme (react-icons md).
- No funciona: plano sólido sin respuesta — el modelo de visión lo describe «clean but could be perceived as flat»; cero hover; el coral solo es relleno del icono.

## 2. Tesis del cambio
Futurismo aquí = precisión de instrumento, no adorno: la paleta es de mostrador y el glass púrpura-cian de plantilla es el slop ya enterrado. Se gana: de «4 cajas blancas» a un **panel numerado de vidrio cálido** que hereda el lenguaje medido del login (banda ámbar + 4 signos de vidrio). Se arriesga: (1) una banda cálida nueva en la landing — se registra como colocación del token ya medido; (2) vidrio sin masa de color detrás se lee sólido (lección login §2) — resuelto en §4. El stagger NO exige GSAP: 16 líneas de CSS (§6).

## 3. Los 4 recursos
| # | recurso | qué hace | por qué encaja | costo |
|---|---------|----------|----------------|-------|
| 1 | Índice mono `01`–`04` | 13px mono del sistema, esquina sup-der, decorativo | lectura de panel de control; el orden ya está en el copy, el número lo hace visible | 0 KB · ~8 líneas + 1 span |
| 2 | Vidrio cálido | banda `--grad-warm` + tarjeta `--grad-glass` (token nuevo) + filo `inset 0 1px 0 --edge-lit` + `--shadow-glass` | la receta ya medida del login: crema translúcida que recoge el ámbar de atrás | 1 token · ~10 líneas |
| 3 | Hairline que se enciende | borde blanco-70% → coral `#FF5F44` en hover; índice → `--link` | el coral pasa de relleno a **señal**; 150ms de color, sin layout | ~4 líneas |
| 4 | Entrada escalonada | 4 tarjetas suben `opacity+translateY` al entrar en viewport, stagger 8% | «vivo» sin JS; mecanismo ya sancionado por `EFECTOS-Y-MOTION` §4 | ~16 líneas · 0 KB |

Fuera: rejilla de puntos, scanlines, glow cian, neón, texto que se teclea, contadores.

## 4. Receta del vidrio
```scss
// _tokens.scss (junto a --grad-warm; cero hex, color-mix sobre existentes)
--grad-glass: linear-gradient(180deg,
  color-mix(in srgb, var(--brand-cream) 78%, transparent) 0%,
  color-mix(in srgb, var(--brand-cream) 64%, transparent) 100%);

// _home.scss
.canales       { background: var(--grad-warm); }  // antes: var(--bg) — la masa de color detrás
.canales__card {
  background: var(--grad-glass);                  // antes: --brand-white
  border: 1px solid color-mix(in srgb, var(--brand-white) 70%, transparent);
  box-shadow: var(--shadow-glass), inset 0 1px 0 var(--edge-lit); // 2 comas = límite P0 §1
}
```
**Qué hay detrás (lección del login):** vidrio sobre fondo plano se lee sólido; el `backdrop-filter` sobre degradado liso no tiene nada que desenfocar. Detrás va **la propia banda**: `--grad-warm` (mostaza 38/46/54% sobre crema, 168°) da masa `#FBDFAC→#F9D48F`; la tarjeta al 78/64% queda **más clara que la banda en toda su altura** y varía de tono hacia abajo → los 4 signos del vidrio (más clara que el fondo · filo de luz · sombra cálida · variación de tono). **Sin `backdrop-filter` (recomendado):** nada cruza por detrás (banda estática), el blur sería invisible; la α-composición hace el trabajo y el conteo de blur del landing sigue = 0 (§2.3 intacta). Variante B (`blur(14px) saturate(104%)`): solo a petición — exige acta §2.3 + `@supports` fallback (iOS ≤17) y no produce diferencia visible sobre degradado liso (medido en login: con blur el modelo siguió diciendo «sólida»).

**Contraste sobre el compuesto** (calculado WCAG; gate de píxeles al implementar, como en el login):
| texto | fondo | ratio |
|---|---|---|
| kicker `--text-2` 13px · lead 18px | banda arriba `#FBDFAC` | 5.12 ✓ |
| H2 ciruela Bebas 64 | banda arriba `#FBDFAC` | 11.83 ✓ |
| título tarjeta ciruela 20/600 | tarjeta arriba `#FEF2E3` | 13.85 ✓ |
| desc `--text-2` 14px | tarjeta `#FEF2E3→#FDEBCE` | 5.99–5.65 ✓ |
| label `--text-2` 12/600 · índice mono 13 | tarjeta abajo `#FDEBCE` | 5.65 ✓ (índice hover `--link` 5.08 ✓) |
| icono ciruela sobre cuadro coral | coral liso | 5.08 ✓ (sin cambio) |

Límite heredado del login: sin texto suelto sobre la mitad inferior de la banda (`--text-2` vs parada profunda `#F9D48F` = 4.68 — pasa, sin margen; kicker y lead viven arriba).

## 5. Movimiento
| elemento | disparador | propiedad | duración | easing | stagger | reduced-motion |
|---|---|---|---|---|---|---|
| 4 tarjetas | scroll entra viewport (`view()`) | `opacity`+`transform` (14px→0) | 400ms | `--ease-out` | 8% del rango entry (0/8/16/24%) | `@media (prefers-reduced-motion: no-preference)` + killer global 0.01ms (`_tokens.scss` L132-141) |
| hairline → coral | `:hover` | `border-color` | 150ms | `--ease-ui` | — | killer global (transiciones incluidas) |
| índice → `--link` | `:hover` | `color` | 150ms | `--ease-ui` | — | killer global |

Entrada: solo `transform`+`opacity` (composited). Estados: `border-color`/`color` son las únicas transiciones que §2.4 permite — sin `box-shadow`, sin props de layout, sin `all`. Sin `translateY(-1px)`: la tarjeta no es clicable y el lift es la señal de clicable del panel (`DESIGN-CONTRACT` §5) — fingirla miente; si se quiere igual: `transform 200ms` + `-1px` (permitido).

## 6. GSAP sí o no — **no**
| opción | peso | código | dependencia | contrato |
|---|---|---|---|---|
| **CSS scroll-driven (recomendado)** | **0 KB** | ~16 líneas SCSS | 0 | cumple §3 («JS de efectos: 0 líneas») y §4 (entrada «solo mejora CSS») |
| GSAP core | ≈70 KB gzip (cifra del paquete, no medida) | ~10 líneas JS + refs/efecto | npm + updates | rompe §3 y §4 del contrato de efectos |
| GSAP + ScrollTrigger | ≈82 KB gzip | ídem + config | ídem | ídem |

El efecto pedido (stagger + hover) está 100% cubierto por CSS; GSAP añadiría peso sin añadir efecto. Soporte: Chrome/Edge 115+, Safari/iOS 26+; Firefox detrás de flag (mdn `css.properties.animation-timeline`) → sin soporte, tarjetas estáticas (fallback = diseño actual).
```scss
// Entrada escalonada — 0 JS (_home.scss)
@keyframes canales-rise { from { opacity: 0; transform: translateY(14px); } }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .canales .col-12:nth-child(2) { --in: 8%;  }
    .canales .col-12:nth-child(3) { --in: 16%; }
    .canales .col-12:nth-child(4) { --in: 24%; }
    .canales__card {                              // --in default = 0%
      animation: canales-rise both 400ms var(--ease-out);
      animation-timeline: view(); // longhands SIEMPRE después del shorthand
      animation-range: entry var(--in) entry calc(var(--in) + 56%);
    }
  }
}
.canales__card       { transition: border-color var(--dur-micro) var(--ease-ui); }
.canales__card:hover { border-color: var(--brand-coral); }
.canales__card:hover .canales__card-index { color: var(--link); }
```

## 7. Antes / después
**Antes:** 4 cajas blancas opacas sobre crema, mudas al cursor. **Después:** panel numerado de vidrio cálido flotando sobre banda ámbar, sube escalonado al entrar y enciende su filo coral al pasar el cursor.

## 8. Accesibilidad
- **Tab:** 0 elementos enfocables dentro de la tarjeta hoy (h3/p/div) → orden de tabulación sin cambios, sin traps. Si se vuelve enlace: `outline: 3px solid var(--focus-ring)` offset 2px — ciruela sobre compuesto 13.85 ✓; la hairline coral acompaña, nunca sustituye.
- **Contraste:** tabla §4, todo texto ≥4.5:1 sobre el compuesto. La hairline coral en hover es decorativa (tarjeta no interactiva, no comunica estado → 1.4.11 no aplica); si se interactúa, la señal legible es el índice `--link` 5.08 ✓.
- **Reduced-motion:** doble rama (media query del snippet + killer global). Contenido íntegro sin animación — cumple el criterio «la animación añade, nunca comunica» (§4).
- **aria-hidden:** índice `01–04` decorativo (mismo patrón que el icon-wrap, `page.js` L126).

## 9. Lo que NO se toca
Copy de los 4 canales (acta 27-oct) · label anclado (`margin-top:auto` + `min-height`) · retícula `col-12 col-lg-6 col-xl-3` · iconos react-icons md · H2 Bebas 64/44 · container 1140.

## 10. Enmiendas al contrato (este documento es el acta)
1. `EFECTOS-Y-MOTION` §2.3: familia superficie translúcida — 4 tarjetas de canal por α-composición **sin** `backdrop-filter`; conteo de blur del landing sigue 0.
2. `EFECTOS-Y-MOTION` §2.1: `--grad-warm` gana su 2ª colocación (banda canales; la 1ª es el login) — 1 gradiente activo en la sección, dentro del límite por página.
3. `EFECTOS-Y-MOTION` §2.2: presupuesto de sombras ≤3/viewport → **4 solo en esta sección** (fila uniforme = una unidad visual; resto de la banda, 0 sombras).
4. `DESIGN-CONTRACT` §6 (mostaza >5% superficie): excepción para **fondos cálidos tokenizados y medidos** (precedente: login 05-nov). La regla vetaba la mostaza suelta como acento, no un fondo derivado con contrastes verificados.
5. `DESIGN-CONTRACT` §3: micro-uso de **mono del sistema** (`ui-monospace, "Cascadia Mono", Menlo, Consolas, monospace`) para índices decorativos — 0 KB, sin webfont nueva. Token nuevo `--grad-glass` (cero hex).

**Gate al implementar:** re-medir contrastes sobre píxeles del render (método login §3) + `next build` + `check:tokens` + reduced-motion en Playwright (método `EFECTOS-Y-MOTION` §5.2).
