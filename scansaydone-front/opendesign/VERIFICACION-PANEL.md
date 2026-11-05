# VERIFICACION-PANEL — prototipo `/panel` (30-oct-2026)

> Alcance: **solo frontend**. Sin backend, sin `fetch`, sin almacenamiento, sin lógica de filtros.
> Spec: `PANEL-UX.md` · Plano: `wireframes/11-panel.svg` (v1) · Capturas: `capturas/2026-10-30/panel-*.png`

## 1. Qué se construyó

| Archivo | Rol |
|---|---|
| `src/app/panel/page.jsx` | Pantalla, componente cliente: vacío, demo, sin conexión; carga/error declarados sin disparador |
| `src/app/panel/layout.js` | `metadata` propia (`Panel`), hereda `robots: noindex` |
| `src/app/data/panel-demo.js` | Dataset fijo de 8 respuestas + totales derivados + canales + etiquetas de escala |
| `src/app/assets/scss/_panel.scss` | Cabecera, retícula, tarjetas, barras, switch, chips, tabla y responsive |
| `src/app/assets/scss/_tokens.scss` | `--surface-2` (superficie pasiva: tracks, esqueletos, disabled) |

## 2. Decisiones de honestidad

- **El estado por defecto es el vacío.** Un local que entra por primera vez no tiene respuestas, y la pantalla no finge lo contrario: `—`, `Sin respuestas` y `Aún no hay respuestas`, **sin un solo cero**.
- **Modo demo explícito**: switch `Ver con datos de ejemplo` → badge `DATOS DE EJEMPLO` + línea "Estas respuestas son un ejemplo para ver la pantalla llena. No vienen de clientes reales." + anuncio por `aria-live`. Apagarlo devuelve al vacío.
- **El dataset no tiene identidades**: solo canal, fecha y tres dígitos. Cero nombres, correos, teléfonos o comentarios.
- **Nada de cifras fuera del demo**: ni porcentajes, ni tendencias, ni promedios. n=8 < 20 → solo absolutos.
- **Carga y error existen como código pero no son alcanzables** (`LOADING = false`, `FAILED = false`) porque no hay petición que los dispare. Inventar un botón para provocarlos sería simular un fallo.

## 3. Defectos encontrados al medir (no leyendo)

Todos se detectaron con la pantalla abierta; ninguna revisión de código los habría visto.

| # | Defecto | Causa raíz | Corrección | Prueba |
|---|---|---|---|---|
| 1 | Banda blanca de 76 px sobre la cabecera | `globals.css` compensa una navbar fija que el panel no tiene | `main:has(> .panel-app) { padding-top: 0 }` | `header.top = 0` |
| 2 | `h1` a **42 px** en vez de 44 | `_bootstrap-custom.scss` emite `h1…h6 { font-size: … !important }` | `font-size: 44px !important` (28 en móvil) | `44px` / `28px` |
| 3 | La pregunta de cada tarjeta a ~28 px desbordaba la tarjeta y su pie caía **fuera** del borde | mismo `!important` global, esta vez sobre `h3` | `16px !important` + `line-height: 1.3` | pie dentro del borde, tarjeta 256 |
| 4 | `RESPUESTAS RECIBIDAS` se renderizaba como titular gigante | mismo `!important` global sobre `h2` | `13px !important` | overline a 13 |
| 5 | Tarjetas de **353** en vez de 364 | `padding: 0 16px` del contenedor restaba 32 a los 1140 | `padding: 0` en ≥1200 | tarjeta 364, contenedor 1140 en x 150 |
| 6 | Desborde horizontal de **153 px** a 375 | los chips estiraban el documento en vez de desplazarse en su caja | `overflow-x: auto` + `flex: 0 0 auto` + `min-width: 0` | `scrollX = 0`; chips 343 con `scrollWidth 548` |
| 7 | Los filtros deshabilitados parecían activos | `disabled` sin estilo propio | `--surface-2` + `--text-2` + `cursor: not-allowed` | `chipBg` gris, `not-allowed` |
| 8 | El pie de tarjeta duplicaba "Sin respuestas" en el estado vacío | se renderizaba en ambos estados | pie solo con `isDemo` | `foot = false` en vacío |

## 4. Medidas finales (navegador, build verificado)

| Medida | Valor |
|---|---|
| Cabecera de app | 1440 × 64, desde y 0 |
| Contenedor | 1140 en x 150 |
| Tarjetas | 364 × 256, gap 24 (3×364 + 2×24 = 1140) |
| `h1` | 44 px (28 a 375) |
| Pregunta en tarjeta | 16 px |
| Chip de filtro / input de fecha | 44 px de alto |
| Tabla | 1140 de ancho, `th` 74, filas 56 |
| Scroll horizontal | 0 a 375 y 1440 |

## 5. Accesibilidad implementada

- Skip-link `Saltar a las respuestas` como primer elemento del DOM.
- `<table>` real con `<caption>` oculto y `th scope="col"`; en móvil pasa a filas-tarjeta con `data-label`.
- Switch `role="switch"` + `aria-checked`; el cambio se anuncia por `aria-live`.
- Chips `role="radiogroup"` / `role="radio"`, roving tabindex, flechas ←→.
- Precaución: `aria-disabled` y `disabled` conviven en los chips cuando no hay datos.
- Foco visible 3 px con offset 2; objetivos ≥44 px.

## 6. Documentación y planos

- `PANEL-UX.md` §2–§8 con cotas, ratios medidos y tabla de estados.
- `wireframes/11-panel.svg` + PNG 1440×900, con mini-vista del estado vacío.
- Índices actualizados: `wireframes/INDEX.md`, `wireframes/png/INDEX.md`, `ENTREGA-UX.md`.

## 7. Pendientes que bloquean publicar

| # | Pendiente | Dónde |
|---|---|---|
| 1 | **Q2 y Q3 no son texto aprobado**: `¿Volverías?` y `¿Qué mejorarías?` están marcadas `[confirmar]` en `PANEL-UX.md` §2 | decisión de producto |
| 2 | Los 5 canales están cerrados por acta del 27-oct; añadir uno nuevo requiere otra acta | `DASHBOARD-UX.md` |
| 3 | Filtros con lógica real (canal y fechas) | backend |
| 4 | Paginación o límite de filas cuando haya más de ~50 respuestas | backend |
| 5 | El panel no está protegido: se entra por URL directa | autenticación |

## 8. Para conectar el backend

| Necesidad | Dónde entra |
|---|---|
| Listado de respuestas por local | reemplaza `PANEL_DEMO_ROWS`; el estado vacío ya es el default |
| Totales por pregunta | reemplaza `PANEL_TOTALS` (hoy derivados del dataset) |
| Filtros por canal y rango | hoy `disabled` sin lógica; conectan a querystring |
| Guardia de sesión | si no hay sesión → redirigir a `/entrar` |
| Estados de carga y error | activar `LOADING` / `FAILED` sobre la petición real |
