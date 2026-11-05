# Verificación F6 — Panel (28-oct-2026)

> Revisado con `reviewer-alibaba`, `designer-alibaba` y `code-support` (Go, sin truncar) + capturas Playwright.
> Normas: `COPY-LANDING.md` §6, plano `wireframes/04-panel-preview.svg` (captura 872×545), `DASHBOARD-UX.md`, `EFECTOS-Y-MOTION.md`, `RIESGOS-USUARIO.md`.

## Veredicto

**CUMPLE CON RESERVAS**, y las reservas quedaron cerradas en `622aac4`.

## Hallazgos y estado

| # | Hallazgo | Severidad | Origen | Estado | Commit |
|---|---|---|---|---|---|
| 1 | **CTA `Ver mi panel` apuntaba a `#aplicaciones`** (sección anterior, con cartel/vinilo): promesa rota | alta | reviewer + designer | **cerrado** — destino `/contactus` + aviso accesible "(demostración, todavía no disponible)" + línea `Panel en construcción. Te avisamos cuando esté.` | `622aac4` |
| 2 | Badge `DEMO` con `aria-hidden` en un enlace: el aviso no llegaba a lectores de pantalla | media | reviewer | **cerrado** — el aviso vive en el nombre accesible del enlace | `622aac4` |
| 3 | Imports muertos (`Image`, `SITE`) tras retirar el portafolio | media | reviewer | **cerrado** | `622aac4` |
| 4 | Marco a ~736 px; el plano pide **872×545** | media | reviewer + designer | **cerrado** — contenedor a 1320 → marco **880×550** (8 px de diferencia por gutters) | `622aac4` |
| 5 | Orden visual invertido respecto al plano (allí: captura izquierda) | media | designer | **cerrado** — `order-lg-1/2` manteniendo el **texto primero en el DOM** (accesibilidad) | `622aac4` |
| 6 | El commit anunciaba "callouts" que no existían | media | designer | **cerrado** — 2 callouts `d-none d-lg-block`: `❶ Avisos primero`, `❷ Todo en el celular` | `622aac4` |
| 7 | Componentes huérfanos y ~27 imágenes del template siguen en `public/` | media | reviewer | **abierto** (limpieza) | — |
| 8 | 4 dependencias sin uso (`swiper`, `yet-another-react-lightbox`, `tiny-slider-react`, `react-type-animation`) | media | reviewer | **abierto** (limpieza) | — |
| 9 | Falta `public/images/landing/MANIFEST.md` | baja | reviewer | **abierto** | — |

## Lo que la revisión confirmó

- Copy exacto de §6: título, subtítulo y los 3 bullets, palabra por palabra.
- Marco de referencia **es la decisión correcta**: el mockup `03-panel-desktop.png` muestra `4.7 / 91 % / 2.4h / +0.3 pts / Meta: 75 pts / Versión 2.4` con nombres inventados; publicarlo como captura sería comprometerse con métricas que el propio `DASHBOARD-UX` prohíbe.
- A11y: `h1→h2→h3` sin saltos, bullets en `<ul>/<li>`, iconos decorativos, contraste de bullets 6.29, leyenda 5.57, badge 8.45, título 14.53.
- La retirada del portafolio **elimina las 6 fotos stock** de la home: la página queda con **0 imágenes raster** (presupuesto de imágenes libre).

## Requisitos para la captura real (cuando el panel exista, S2)

Queda escrito como checklist: sidebar con los **3 destinos** (`overview`, `opiniones`, `respuestas`) · aviso urgente **arriba** (no al pie) · 4 métricas **solo absolutas**, sin `%` ni "Calificación media" · filas con **canal explícito** y fecha · caras SVG + texto literal (extracto ≤90 caracteres) · con n<10 el aviso "aún son pocos clientes (N)" · captura del **overview con datos**, no del estado vacío · marco 16/10, borde 1 px, sin sombra.

## Estado

| Check | Resultado |
|---|---|
| Build / rutas / consola | exit 0 · 9/9 → 200 · 0 errores |
| `check:tokens` · `check:placeholders` | OK · OK |
| Imágenes raster en la home | **0** |
| Servidor de revisión | `http://localhost:3066` |
| Commits | `238dae2` (sección) → `622aac4` (correcciones) |
