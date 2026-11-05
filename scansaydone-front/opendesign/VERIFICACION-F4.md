# Verificación F4 — Canales (28-oct-2026)

> Revisado con: `reviewer-alibaba` (estándares), `designer-alibaba` (congruencia con docs y plano) y `code-support` (Go, `second-opinion --area frontend`). Capturas reales con Playwright.
> Normas: `UX-LANDING.md` §3.4 + plano `wireframes/03-canales.svg` · copy: `COPY-LANDING.md` §4 · tarjeta estática: `EFECTOS-Y-MOTION.md` (borde 1px, sin sombra).

## Veredictos

| Revisor | Veredicto | Aporte |
|---|---|---|
| `reviewer-alibaba` | **CUMPLE CON RESERVAS** | confirmó el desalineado por título a 2 líneas y las 4 etiquetas a distinta altura; a11y y semántica OK (contraste 15.3 / 6.6) |
| `designer-alibaba` | **congruente con reservas** | copy y retícula exactos; el **icono iba sin superficie coral** (la doc exige "icono como superficie coral"), ritmo `lead→cards` a 24 en vez de 48, etiqueta sin tratamiento de overline |
| `code-support` (Go) | ok, sin truncar | 5 hallazgos; aportó el patrón de fix (`h-100` + flex column + `mt-auto`) y advirtió que el título más largo del set puede romper en 3 líneas a 219 px útiles |

## Hallazgos y estado

| # | Hallazgo | Severidad | Origen | Estado | Commit |
|---|---|---|---|---|---|
| 1 | Título `EN EL MOSTRADOR` en 2 líneas desalineaba descripción y etiqueta de las otras 3 | alta | los tres | **cerrado** — `flex column` + `height:100%` + `desc flex-grow` + `label margin-top:auto` | `b03c487` |
| 2 | Etiquetas de 1 y 2 líneas dejaban el borde superior a distinta altura | media | reviewer | **cerrado** — `min-height:2.4em` (2 líneas a 12 px/1.2) | `e9820eb` |
| 3 | **Icono sin superficie coral**: la doc pide "icono como superficie coral, nunca coral como texto" | alta | designer | **cerrado** — tile 48×48 coral, glifo 24 px ciruela (5.08 ✓), `aria-hidden` | `b03c487` |
| 4 | Ritmo `lead → tarjetas` a 24 px (debía ser 48) | media | designer | **cerrado** — `mt-5` (48) | `b03c487` |
| 5 | Etiqueta de uso sin tratamiento de overline | media | designer | **cerrado** — 12 px / 600 / `.14em` / mayúsculas | `b03c487` |
| 6 | `max-width:1140px` con `!important` sobre `.container-xl` | baja | designer | **cerrado** — selector específico `.canales .container-xl` (y `.how` alineado igual) | `b03c487` + `e9820eb` |
| 7 | Radio de tarjeta hardcodeado | baja | designer | **cerrado** — token `--radius-card` en `_tokens.scss` | `b03c487` |
| 8 | `services-one.jsx` huérfano (0 imports) | media | F3 | **abierto** (deuda) | — |

## Lo que quedó conforme

- Copy exacto: `TUS CUATRO CANALES`, lead y las 4 tarjetas con sus descripciones y etiquetas de uso **palabra por palabra**; ninguna promesa de API de TikTok.
- Grid: `col-12 col-lg-6 col-xl-3` → 1 / 2×2 / 4; a 1140 de contenedor cada tarjeta mide **267 px** (`4×267 + 3×24 = 1140` ✓).
- Tarjeta: blanca, borde 1 px, **sin sombra**, radio tokenizado.
- A11y: iconos decorativos con `aria-hidden` en el envoltorio; cero interactivos dentro de las tarjetas (no hay CTA por tarjeta, como manda el copy); contraste de título 15.3 y de cuerpo/etiqueta 6.6.
- Semántica: `h2` de sección y `h3` por tarjeta; `id="canales"` conservado; una sola `h1` en la página.

## Efecto en la página

Se eliminó la banda heredada **"Hagamos realidad tu próximo proyecto"** (y su botón de play): ya no aparece en el HTML. El ancla `#canales` del menú ahora apunta a contenido real del producto, no a una CTA de agencia.

**Pendiente de las próximas fases**: el bloque `#panel` sigue siendo portafolio/equipo/clientes del template (F6 lo reemplaza) y falta F5 (aplicaciones en contexto) y F7 (precios, FAQ, CTA final).

## Estado verificado

| Check | Resultado |
|---|---|
| Build | exit 0 · 9 rutas |
| Rutas | 9/9 → 200 |
| Consola | 0 errores |
| `check:tokens` / `check:placeholders` | OK / OK |
| `data.js` en el diff | **no** (cero cambios de datos para pasar checks) |
| Servidor de revisión | `http://localhost:3060` |
