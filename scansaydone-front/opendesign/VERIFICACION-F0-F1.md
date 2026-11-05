# Verificación F0 + F1 (28-oct-2026)

> Revisado por: `reviewer-alibaba` (estándares y código), `designer-alibaba` (congruencia doc ↔ implementación), `wan-image` qwen3.7-plus (auditoría visual de la captura real) y revisión propia sobre `http://localhost:3042`.
> La segunda opinión Go (`code-support`) **no llegó a responder**: agotó pasos. Se reintenta al cerrar el bloque de correcciones.

## Veredictos

| Fase | Veredicto | Razón |
|---|---|---|
| **F0 (infra de estilos)** | **NO CUMPLE** | 5 de sus propios criterios de salida están sin cumplir: focus ring sigue en teal `#0e6e5c`, `--band-y-*` y `--sp-*` no existen, ~51 hex fuera de `_tokens.scss`, capa semántica de tokens declarada pero **0 consumos**, y `package-lock.json` desincronizado |
| **F1 (navbar + footer)** | **CUMPLE CON RESERVAS** | Estructura, landmarks y `aria-*` correctos; pero el lockup es **ilegible** sobre el hero, el isotipo pierde `currentColor`, "SAY" no llega a 3:1, falta `<nav>` y el wordmark está bajo el mínimo de 24 px |

## Bloqueantes (P0) — antes de F2

| # | Hallazgo | Evidencia | Fix |
|---|---|---|---|
| 1 | **Wordmark ciruela sobre hero oscuro = ilegible** (la marca desaparece en el primer viewport) | `_menu.scss:17,422` · `page.js:22` · previsto en `lockup-preview.html:128` | variante clara del lockup en estado transparente, o `--nav-fg` por zona |
| 2 | **Isotipo como `<img>`**: `stroke="currentColor"` cae al negro del navegador, no hereda ciruela/coral | `navlight.jsx:33-40` · `footer.jsx:38-45` · `logo-symbol.svg:1` | SVG **inline** (componente React) para que herede `currentColor` |
| 3 | **Focus ring en teal legacy** `#0e6e5c` | `globals.css:2` · `--focus-ring` declarado y sin usar | `outline: 3px solid var(--focus-ring)` |
| 4 | **`SITE.name` = "Agencia"** → 9 sitios renderizados (title, OG, twitter, copyright, alt del hero) | `site.js:11,13` → `layout.js:26-37` · `footer.jsx:112` | `SITE.name='Scan-Say-Done'` + `description` real + `legalName` |
| 5 | **6 tarjetas de "Proyectos" vacías**: `.content{opacity:0}` solo se revela en hover → invisible en estático, táctil y teclado | `_helper.scss:275-287` · `portfolio-one.jsx:16` | contenido visible por defecto; hover solo para el overlay |
| 6 | **`width={0} height={0}`** en `next/image` → altura 0 hasta decodificar (CLS) | `portfolio-one.jsx:12` · `team-one.jsx:12` | dimensiones reales o `fill` + `aspect-ratio` |
| 7 | **3 de 6 links del menú no navegan**: `#como-funciona`, `#canales`, `#panel` no existen como `id` | `navlight.jsx:76-106` · `page.js` (0 `id=`) | crear los `id` en F2 y hasta entonces apuntar a rutas reales |
| 8 | **`package-lock.json` desincronizado** (`@mdi/font` fantasma, nombre `coral`) → `npm ci` rompe | `package-lock.json:2,11` vs `package.json` | `npm install` para regenerar y commitear con el manifest |

## Altas (P1) — antes de publicar

| # | Hallazgo | Evidencia |
|---|---|---|
| 9 | Wordmark 22 px (< mínimo 24) e isotipo 28 (spec 36); clear space sin aplicar | `_menu.scss:419` · `_footer.scss:78` · `ASSET-PIPELINE:20` |
| 10 | `.say` en coral sobre crema = **2.86:1** (falla); el contrato veta coral como texto | `_footer.scss:83` · `DESIGN-CONTRACT:16` |
| 11 | Falta landmark `<nav>` (menú es un `<ul>` pelado) | HTML servido: `<nav>` = 0 |
| 12 | Banda CTA con `rgba($dark,.65)` sobre foto stock → violeta desaturado; `backgroundAttachment:fixed` rompe en iOS | `cta-one.jsx:5` · `_helper.scss:23` |
| 13 | **Sticky implementado contra la doc** (`EFECTOS-Y-MOTION` dice MVP sin sticky) y con tratamiento ajeno (blanco+sombra en vez de crema .82+blur+borde) + listener JS | `navlight.jsx:17-19` · `_menu.scss:352` |
| 14 | Dos verdades de color: `$secondary` `#5a6d90` vs `#6c757d`; Bootstrap conserva estados stock (`#198754`, `#ffc107`, `#dc3545`) | `_variables.scss:11` · `bootstrap.scss:12-16` |
| 15 | `bg-footer` / `.btn-soft-footer` (navy) siguen generándose para un footer que ya es crema → CSS muerto | `_variables.scss:34,67` |
| 16 | 27 `style={{` en `src/` (19 atributos renderizados en la home) | `cta-one.jsx:5` · `video-one.jsx:47` · `page.js:22,77-91` |
| 17 | Jerarquía de encabezados rota: `h2` = 0, `h4` = 3, `h6` = 4 | HTML servido |
| 18 | Footer con `pt` 48 vs 100 del plano; falta la columna **Contacto** del copy; falta "Ver ejemplo" | `_footer.scss:16` · `05-footer` del plan · `COPY-LANDING:114` |
| 19 | `--band-y-d/m` y `--sp-1..7` no existen (eran criterio de salida de F0); route groups `(marketing)/(panel)/(public)` tampoco | `PLAN-EJECUCION-LANDING:22` |
| 20 | `check:placeholders` pasa pero es ciego a "Agencia", `#0e6e5c`, `mdi-` y a `public/` | `scripts/check-placeholders.mjs:9-17` |

## Bajas (P2)

`reactStrictMode:false` · `layout.js:43` template literal vacío · `page.module.css` sin imports · favicon del template (sin `icon.png` 512 ni `apple-icon` 180) · `data.js:114` comentario con `mdi mdi-star` · sin `robots.txt`/`sitemap`.

## Auditoría visual (qwen3.7-plus sobre la captura)

Confirma e independiza tres hallazgos del código: **(a)** logotipo oscuro sobre fondo oscuro, casi ilegible; **(b)** "PANEL" aparece en blanco brillante mientras el resto del menú está en gris → estado activo incoherente; **(c)** 6 contenedores vacíos en "Proyectos que abordamos"; **(d)** banda CTA en gris/lavanda `≈#766B82` que no es ciruela ni coral; **(e)** textos de cuerpo en `≈#64748B`, fuera de paleta.
Nota: el color de los enlaces del footer (`#B23A2A`) es el token documentado, no un error — el auditor visual lo reportó como "rojo óxido" por desconocer el sistema.

## Lo que sí está bien (no se toca)

Bootstrap compilado desde Sass con `$theme-colors` · `next/font` self-hosted (7 woff2, 0 llamadas a Google) · `@mdi/font` fuera del source y del CSS (−52 %) · 10/10 variantes de botón en AA · un solo `<h1>` · landmarks `header`/`main`/`footer` · `aria-expanded`/`aria-controls` correctos · isotipo con `alt=""` + `aria-hidden` dentro de un `<Link aria-label>` · contrastes ciruela/crema 14.53 y `--link`/crema 5.65 · `showPricing:false` apagando Precios en navbar y footer.

## Orden de corrección

| Bloque | Contenido | Criterio de cierre |
|---|---|---|
| **F1.1 (ahora)** | #1 a #8: marca legible, isotipo inline, focus ring, `SITE.name`, tarjetas visibles, dimensiones de imagen, anchors, lock | build verde · 0 "Agencia" en HTML · lockup visible sobre el hero · 0 tarjetas vacías |
| **F1.2** | #9 a #15: tamaño del lockup, `.say` AA, `<nav>`, banda CTA, sticky alineado a doc, una sola verdad de color, CSS muerto | contraste ≥3:1 en el lockup · sticky según `EFECTOS` · 0 hex fuera de tokens en los partials tocados |
| **F2 (después)** | hero nuevo con copy congelado + `id` de sección | hero con `¿QUÉ DICEN TUS CLIENTES?` y 2 CTAs |

## Riesgo abierto de mayor peso

Mientras el cuerpo siga siendo el template, la página muestra **dos marcas a la vez** (shell Scan-Say-Done + hero "Diseño y desarrollo web"). En `localhost` es aceptable; **en cualquier preview público es inaceptable**: se indexa una marca muerta. Antes de cualquier deploy de preview: `robots: 'noindex, nofollow'` en `layout.js`.

## Estado de cierre (28-oct, tras F1.1)

| Item | Estado | Commit |
|---|---|---|
| 1 wordmark ilegible | CERRADO — tokens --nav-fg / --nav-fg--sticky por zona | `8f90c03` |
| 2 isotipo pierde currentColor | CERRADO — componente `LogoSymbol` con SVG inline | `8f90c03` |
| 3 focus ring teal | CERRADO — `var(--focus-ring)` | `8f90c03` |
| 4 SITE.name "Agencia" | CERRADO — 0 ocurrencias en `src/`; title y copyright correctos; `robots: noindex` | `43b6698` |
| 5 tarjetas vacias | CERRADO — contenido visible sin hover + `:focus-within` | `43b6698` |
| 6 width/height 0 | CERRADO — 800x600 y 600x600 con `sizes` acotado | `43b6698` |
| 7 anchors del menu | CERRADO — 3 `id` creados en `page.js` | `43b6698` |
| 8 lock desincronizado | CERRADO — `npm install`, 0 rastros de `@mdi/font` | `43b6698` |
| 9 tamano del lockup | CERRADO — wordmark 26/22 px, isotipo 36 | `8f90c03` |
| 10 "SAY" 2.86:1 | CERRADO — ciruela + subrayado coral en fondos claros (14.53) y coral sobre ciruela en el hero (5.08) | `8f90c03` |
| 11 sin `<nav>` | **ABIERTO** | — |
| 12 banda CTA violeta | **ABIERTO** (`rgba(,.65)` sobre foto stock) | — |
| 13 sticky contra la doc | **ABIERTO** | — |
| 14 dos verdades de color | **ABIERTO** | — |
| 15 `bg-footer` muerto | **ABIERTO** | — |
| 16 27 `style={{` | **ABIERTO** | — |
| 17 jerarquia h2/h4/h6 | **ABIERTO** | — |
| 18 footer pt 48 y columna Contacto | **ABIERTO** | — |
| 19 `--band-y`/`--sp` y route groups | **ABIERTO** | — |
| 20 guard ciego a "Agencia" | **ABIERTO** | — |

**Hallazgo nuevo de la revision visual posterior:** las 6 tarjetas de "Proyectos" ya muestran su texto, pero **la imagen no pinta** (queda el bloque de fondo). Los JPG existen en `public/images/projects/` (16-38 KB). Se resolvera en F5, cuando esa seccion se sustituya por "Asi se ve en tu local"; si se mantiene antes, hay que revisar el contenedor de `next/image`.

**Sin regresiones:** `Precios` sigue oculto (0 ocurrencias en el HTML servido, flag `showPricing:false`), `title` = `Scan-Say-Done`, 0 errores de consola, 9 rutas 200.
