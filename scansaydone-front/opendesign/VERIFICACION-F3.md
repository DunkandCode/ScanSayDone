# Verificación F3 — "Así funciona" + franja de confianza (28-oct-2026)

> Revisado con: `reviewer-alibaba` (estándares y código), `designer-alibaba` (congruencia con docs y plano), `code-support` (segunda opinión Go) y Playwright (capturas reales).
> Contraparte de diseño: `UX-LANDING.md` §3.3 + plano `wireframes/02-como-funciona.svg` · copy: `COPY-LANDING.md` §2 y §3.

## Veredictos

| Revisor | Veredicto | Aporte principal |
|---|---|---|
| `reviewer-alibaba` | **CUMPLE**, sin bloqueantes | semántica ok (1 `h1`, h1→h2→h3 sin saltos), badge 5.08 ✓, cuerpo 6.6 ✓, franja `<ul>`/`<li>`, iconos `aria-hidden`, 9 rutas 200 |
| `designer-alibaba` | **congruente con reservas** | 3 desvíos reales: conector entre pasos ausente, franja a una línea sin cuerpos e iconos 20 px, ghost de 39 px |
| `code-support` (Go) | **degradado** | salida truncada en 3 intentos (2 modelos): sólo hallazgos parciales. Útil: `<ol>/<li>` para los pasos, extraer componente `Step`, y el riesgo de que el `!important` no acompañe el breakpoint |
| Playwright | — | capturas de sección y franja; 0 errores de consola |

## Hallazgos y estado

| # | Hallazgo | Severidad | Origen | Estado | Commit |
|---|---|---|---|---|---|
| 1 | Conector coral entre pasos **no existía** (sólo un `border-top` por paso) | alta | designer | **cerrado** — `::before` de 2 px a la altura del badge, último paso sin conector; en móvil pasa a `border-left` | `c4b2ae1` |
| 2 | Franja a una línea: sin cuerpos, iconos de 20 px, y en tablet quedaba 3+1 | media-alta | designer | **cerrado** — titular 20/600 + cuerpo 14, iconos 24 px, 2×2 en tablet | `c4b2ae1` |
| 3 | CTA ghost de 39 px (mínimo táctil 44) y 14 px de fuente (doc: 15) | alta | designer | **cerrado** — `min-height:44px`, 15 px | `c4b2ae1` |
| 4 | Título a breakpoint 992; el doc fija 768; faltaba `letter-spacing .01em` | media | designer | **cerrado** | `c4b2ae1` |
| 5 | `services-one.jsx` quedó huérfano (cero imports; `/services` mapea `servicesData` directo) | media | reviewer | **abierto** (deuda) | — |
| 6 | Tres tarjetas de "Proyectos" sin imagen en captura full-page | media | propio | **abierto** — las imágenes 1-6 existen y responden 200; se revisa al reemplazar la sección en F5 | — |
| 7 | CSS muerto del hero/secciones del template (`_home.scss:18-337`) | baja | reviewer | **abierto** (limpieza posterior) | — |

## Lo que la revisión confirmó que está bien

- Copy exacto: `ASÍ FUNCIONA`, `ESCÚCHALO` no — los 3 pasos `ESCANEA / OPINA / LISTO` con sus tres descripciones palabra por palabra.
- Contraste: badge coral con número ciruela **5.08** ✓; cuerpo de pasos `#65586E` sobre blanco **6.6** ✓; franja ciruela sobre crema 14.5 ✓.
- Jerarquía: 1 `h1`, `h2` para secciones, `h3` para los pasos; sin saltos.
- Tokens: cero hex nuevos en F3; `check:tokens` y `check:placeholders` en verde; `!important` del título justificado por el bucle del template y documentado en el código.

## Riesgo de coherencia de la página (fuera de F3, pero visible)

Hoy conviven F3 nuevo con bloques heredados: la banda **"Hagamos realidad tu próximo proyecto"** (con botón de play) y **"Proyectos que abordamos"** con fotos stock. Además el CTA `Ver ejemplo de encuesta` apunta a `#panel`, que hoy cae en el portafolio de agencia.

- **No se corrige en F3**: cada bloque lo reemplaza su fase (F4 canales, F5 aplicaciones, F6 panel, F7 CTA final).
- **Sí queda registrado**: al cerrar F7 hay que verificar que ningún ancla del menú apunte a un bloque heredado, y que el orden final sea el de `UX-LANDING §2`.

## Nota de herramientas

`code-support` (Go) devolvió **salida truncada en los 3 intentos** (`gpt-6-luna` y `claude-haiku-5-5`): el wrapper fija `max_tokens=600`, insuficiente para la rúbrica de 6 checks. Sus aportes fueron parciales; los hallazgos accionables vinieron de los otros dos revisores. Recomendación de proceso: subir el tope o pedir 1 hallazgo por línea.

## Estado verificado

| Check | Resultado |
|---|---|
| Build | exit 0 · 9 rutas |
| Rutas | 9/9 → 200 |
| Consola | **0 errores** |
| `check:tokens` / `check:placeholders` | OK / OK |
| Encabezados en la home | `h1`=1 · `h2`=6 · `h3`=3 |
| Servidor de revisión | `http://localhost:3056` |
