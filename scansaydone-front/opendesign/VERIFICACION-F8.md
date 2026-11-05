# Verificación F8 — FAQ + CTA final + rutas faqs/pricing (28-oct-2026)

> Revisado con `reviewer-alibaba`, `designer-alibaba` y `code-support` (Go, sin truncar) + capturas Playwright.
> Normas: `COPY-LANDING.md` §8-§9, `UX-LANDING.md` §2 filas 8-9 y §3.7-3.8, plano `wireframes/06-faq-cta.svg`, `DESIGN-CONTRACT.md`.

## Veredicto

| Momento | Resultado |
|---|---|
| Primera versión (`b119c49`) | **NO CUMPLE** — 3 P0 de accesibilidad |
| Tras correcciones (`6376ca3` + `b9a3873`) | **CUMPLE** |

## Qué se construyó

| Pieza | Contenido |
|---|---|
| **FAQ** (`#faq`, banda crema) | `PREGUNTAS FRECUENTES` + acordeón con **5 preguntas visibles** y la 6.ª (`¿Puedo probarlo antes de pagar?`) **condicionada** a `showPricing`; pie `¿Otra duda? Escríbenos` → `/contactus` |
| **CTA final** (`#cta-final`, banda ciruela) | `CREA TU PRIMERA ENCUESTA` + subtítulo + botón 56 px + línea de honestidad. **Sin** "Sin tarjeta" (no confirmado) |
| **`/faqs`** | reescrita con las mismas preguntas desde un único módulo (`data/faq-product.js`) |
| **`/pricing`** | sin cifras ni copy de agencia: bloque neutro *"Estamos cerrando los planes…"* + CTA a contacto |

## Los 3 P0 que aparecieron (y su causa raíz)

| # | Defecto | Causa | Fix |
|---|---|---|---|
| 1 | El ítem abierto del acordeón pintaba la pregunta en **coral sobre crema = 2.86:1** | `_components.scss:498-500` (`.accordion-button:not(.collapsed){color:$primary}`, especificidad 0,4,0) vencía al override de F8 (0,3,0) | corregido **en la raíz** a `var(--brand-plum)` → **14.53** ✓, beneficia a `/` y `/faqs` |
| 2 | **Foco invisible** en los botones del acordeón | el template anula `outline` y `box-shadow` de foco; no existía ninguna regla `:focus-visible` para el acordeón | regla `:focus-visible` con `outline: 3px solid var(--brand-plum)` |
| 3 | Anillo de foco del CTA final **no se aplicaba** (quedaba 1.97:1) | la variable se definía en `.cta-final` (ancestro) y `.btn-primary` la redefine en el propio elemento | `.cta-final__btn:focus-visible` con `outline` peach (**12.88** ✓) |

Corregido también: chevron con **stroke coral hardcodeado** y dirección invertida · código muerto en `_home.scss` · enlaces del pie en coral (ahora `--link`, 5.65 ✓) · jerarquía `h4→h2→h3` en `/faqs` · `style={{}}` inline · cuerpo del acordeón sobre crema (ahora blanco) · metadata de precios con promesas no confirmadas.

## Limpieza aplicada

- Borrados **`cta-one.jsx`** y **`faq-one.jsx`** (0 importadores) y la colección `faqData` de `data.js` (sin consumidores). −251 líneas.
- Anclas del menú verificadas: las 5 internas (`#como-funciona`, `#canales`, `#panel`, `#faq`, `#cta-final`) y las 7 rutas resuelven.

## Desvío documental aceptado

El plano `06-faq-cta.svg` unía FAQ y CTA en un **row 7+5** dentro de 960 px. Se implementaron **dos bandas separadas** (crema y ciruela), que es lo que fijan `UX-LANDING §2` (filas 8-9) y §3.7-3.8, y lo que exige el ritmo de bandas (§4: el CTA final es uno de los dos anclajes ciruela). **El plano queda superado**: debe marcarse como *superseded* en `wireframes/INDEX.md` en la próxima pasada documental.

## Lo que sigue abierto

| # | Tema | Impacto |
|---|---|---|
| 1 | **Las páginas internas siguen con copy de agencia**: `/aboutus`, `/services`, `/service-detail`, `/contactus`, `/terms`, `/privacy` | alto — el menú las enlaza; un visitante sale del producto y cae en "agencia de marketing digital" |
| 2 | Los guards son ciegos a "agencia" (case-sensitive) y a hex fuera de tokens | medio — dejan pasar justo lo que deberían cazar |
| 3 | `content-visibility: auto` en secciones bajo el pliegue | bajo (rendimiento) |
| 4 | 3 componentes huérfanos más (`portfolio-one`, `team-one`, `client-one`) y ~27 imágenes del template | bajo (limpieza) |
| 5 | `package.json` sigue `agencia-landing`; `robots: noindex` activo | bajo (publicación) |

## Estado

| Check | Resultado |
|---|---|
| Build / rutas / consola | exit 0 · 9/9 → 200 · 0 errores |
| `check:tokens` · `check:placeholders` | OK · OK |
| Contraste en F8 | pregunta 14.53 · subtítulo CTA 10.84 · honestidad 8.75 · botón 5.08 · foco peach 12.88 |
| Servidor | `http://localhost:3075` |
| Commits | `b119c49` (F8) → `6376ca3` (a11y) → `b9a3873` (pulido) |
