# Verificación F2 — hero (28-oct-2026)

> Acta anterior: `VERIFICACION-F0-F1.md` — su cierre y su deuda no se repiten aquí (los ítems 11–20 de F1 siguen abiertos allí).
> Revisores de F2: `reviewer-alibaba` (estándares y código) · `designer-alibaba` (congruencia doc↔código) · `code-support` (segunda opinión Go) · `wan-image` qwen3.7-plus (visión sobre captura real) · Playwright.
> Commits de la fase: `9ae71b9` hero → `10629d8` tokens → `a527cdd` escala/contraste/foco → `23d7a04` etiquetas + menú → `05610ea` etiqueta 5.

## 1. Veredicto

| Momento | Veredicto | Razón |
|---|---|---|
| **Inicial** (`9ae71b9`) | **NO CUMPLE** | `reviewer-alibaba`: CTA2 1.00:1, foco 1.97:1, sin `min-height`. `designer-alibaba`: H1 a 42 px, seleccionado blanco/coral 2.98, `#f8f6f4` fuera de token, `transition: all .3s`. `code-support`: 2 `high` (ghost, `aria-hidden` con controles focalizables). La paleta estaba muerta en runtime (§3) |
| **Final** (`a527cdd`→`05610ea`) | **CUMPLE CON DEUDA** | Pares críticos en AA (crema/ciruela 14.53 · ciruela/coral 5.08 · peach/ciruela 12.87), escala display real, `check:tokens` verde, menú coherente. Queda deuda no bloqueante (§6) |

## 2. Hallazgos

| # | Hallazgo | Sev. | Origen (revisor) | Estado | Commit |
|---|---|---|---|---|---|
| 1 | 21 custom properties emitidas como literal `bv.$plum` → **paleta muerta** en runtime | P0 | verificación propia sobre el CSS compilado | CERRADO — interpolación `#{...}` + guarda | `10629d8` |
| 2 | CTA ghost sobre ciruela **1.00:1** (inexistente) | P0 | `reviewer-alibaba` | CERRADO — crema/ciruela 14.53 ✓ | `a527cdd` |
| 3 | Anillo de foco sobre banda oscura **1.97:1** | P0 | `reviewer-alibaba` | CERRADO — ring peach 255,231,217 | `a527cdd` |
| 4 | Banda del hero sin altura mínima | P1 | `reviewer-alibaba` | CERRADO — `min-height:80vh` en ≥992 px | `a527cdd` |
| 5 | H1 clavado en **42 px**: el bucle `h1{!important}` del template bloqueaba la escala display | P0 | `designer-alibaba` | CERRADO — 88/64/44 | `a527cdd` |
| 6 | Opción seleccionada blanco/coral **2.98** (el contrato veta coral como texto, §1) | P0 | `designer-alibaba` | CERRADO — ciruela sobre coral 5.08 ✓ | `a527cdd` |
| 7 | `#f8f6f4` fuera de token | P1 | `designer-alibaba` | CERRADO — 0 ocurrencias en `src/` | `10629d8` |
| 8 | `transition: all .3s` (fuera del presupuesto §5 del contrato) | P2 | `designer-alibaba` | CERRADO en el hero nuevo; el residual vive en el CSS muerto del template → D2 | — |
| 9 | Controles focalizables dentro de un bloque `aria-hidden` (foco invisible, tab roto) | P1 | `code-support` | CERRADO — maqueta en `<span>`, 0 focusables | `a527cdd` |
| 10 | Contraste del ghost sobre ciruela (doble confirmación del #2) | high | `code-support` | CERRADO | `a527cdd` |
| 11 | Los 3 ítems de ancla marcados `active` a la vez → opacidad .7 = menú apagado | P1 | `wan-image` + propio | CERRADO — regla §4 | `23d7a04` |
| 12 | Etiqueta 5 "Excelente" cortada (`overflow-wrap: break-word`) | P1 | `wan-image` | CERRADO → **"Muy buena"** + `overflow-wrap: normal` | `05610ea` |
| 13 | Etiquetas 1–5 desiguales (`<br/>` hardcodeado, alturas distintas) | P1 | propio + `wan-image` | CERRADO — 11 px, `line-height 1.2`, 2 líneas reservadas | `23d7a04` |
| 14 | **Doc ↔ código abierto:** contrato §3 fija H1 móvil 60 px; el código implementa 44 (<992) y 64 (≥992). Gana el documento → se enmienda §3, no el CSS | P2 | acta F2 | **ABIERTO** | — |

## 3. El bug crítico de tokens (#1) en 4 líneas

1. En Sass, **el valor de una custom property no se evalúa**: `--brand-plum: bv.$plum` se emite como texto literal, así que 21 propiedades salieron al navegador con el string `bv.$plum` dentro.
2. El navegador descarta el valor inválido → la paleta estaba **muerta**: todos los `var()` caían al `inherit`/unset y los elementos heredaban negro del navegador. Los 1.00:1, 2.98 y 1.97 de esta acta son **síntomas** del mismo bug, no tres fallos.
3. El build no lo detectó porque **compilar no es emitir**: Sass no valida el valor de una custom property y ningún paso posterior comprobaba que los tokens de marca fueran colores reales — CSS verde ≠ paleta viva.
4. Guarda nueva `npm run check:tokens` (`scripts/check-tokens.mjs`): sobre `.next/static/css` falla si aparece `: bv.$` sin interpolar o si `--brand-plum/coral/cream` no valen hex/rgb (SKIP si no hay build). Forma correcta: `#{bv.$plum}`.

## 4. Regla nueva del menú

`active` **solo con coincidencia exacta de ruta**. Los ítems de ancla (`#como-funciona`, `#canales`, `#panel`) **nunca** se marcan activos: una sola ruta no puede tener tres destinos a la vez. Antes de `23d7a04` los tres arrastraban `active` → opacidad .7 sobre los tres, y el menú se veía apagado salvo "PANEL" (lo confirmó la revisión visual).

## 5. Estado verificado (28-oct, Playwright + guards)

| Chequeo | Resultado |
|---|---|
| Rutas | 9 / HTTP 200 |
| Consola | 0 errores |
| `npm run check:tokens` | OK — 0 literales `bv.$`, tokens con valor hex |
| `npm run check:placeholders` | OK |
| CSS del bundle | ~300 KB |
| Raster en el hero | 0 imágenes (tarjeta de encuesta en HTML/CSS puro) |
| QR en el hero | 0 — **por decisión, no omisión**: la ruta demo `/e/<código>` no existe y un QR falso (404 al escanear) rompería la promesa central del landing. El mockup `01-hero-desktop` sí muestra tarjeta QR (referencia de layout, no contrato). |
| QR real | Entra en **F5** ("Así se ve en tu local") cuando exista un código vivo, con las proporciones y tamaños de `ANALISIS-QR.md` §2. F3 no cambia nada por este cierre. |

## 6. Deuda abierta de F2 (no bloquea F3)

| # | Deuda | Cierre previsto |
|---|---|---|
| D1 | **Strip de confianza** (fila 2 de la retícula `UX-LANDING §2`) sin construir | F3 |
| D2 | **CSS muerto del hero del template**: `_home.scss:18-337` (~320 líneas del `home-common()`/`tilt-3d` sin consumidor tras `9ae71b9`) | F5, con las secciones de agencia |
| D3 | Insignia "3 preguntas" (`hero-phone-badge`) como *sticker* y no como caption de 2 líneas (`UX-LANDING §5.1`) | F4, estético |
| D4 | `package.json` sigue con `"name": "agencia-landing"` | acción del operador, con el deploy |
| D5 | #14: enmendar la fila `h1` de `DESIGN-CONTRACT §3` (o el CSS) para una sola verdad de la escala móvil | antes de F3 |

## 7. Fuentes

- Commits: `9ae71b9` `10629d8` `a527cdd` `23d7a04` `05610ea` (`git log --oneline`, verificado 28-oct).
- Código leído para esta acta (solo lectura): `src/app/page.js:25-69` · `src/app/assets/scss/_home.scss:340-412,490-546` · `scripts/check-tokens.mjs:1-74` · `package.json:2,11-12`.
- Contrastes: los publicados en `DESIGN-CONTRACT.md §1/§4` y `UX-LANDING.md §6` (fórmula WCAG); la acta no recalcula cifras propias.

## Cierre de la contradiccion de escala (28-oct)

**H1 hero: el documento decia 88/60; el codigo implementa 88/64/44.**
Resuelto a favor del codigo probado, con la razon medida: a 375 px de ancho, "TUS CLIENTES?" en Bebas a 60 px ocupa ~338 px sobre 343 disponibles (sin margen para el padding) y arriesga desborde; a 44 px ocupa ~250 px y envuelve en dos lineas sin cortar. El tramo intermedio de 64 px cubre tablet (992-1199) donde 88 resultaba excesivo.

Actualizado en DESIGN-CONTRACT.md (fila h1 / display-1) y UX-LANDING.md (tabla de escala): 88 desktop / 64 tablet / 44 movil.

**Regla para el futuro:** cuando el documento y el codigo choquen en una medida, gana el documento **salvo** que exista evidencia medida de desborde o ilegibilidad; en ese caso se enmienda el documento en el mismo commit, dejando la razon escrita aqui. No se deja la contradiccion abierta.

**Otra contradiccion resuelta:** 	ransition: all .3s senalada por el disenador vive en _home.scss:176 (.tilt-3d-image), dentro del CSS muerto del hero del template (_home.scss:18-337). El hero nuevo no la usa: queda como deuda de limpieza, no como defecto activo.
