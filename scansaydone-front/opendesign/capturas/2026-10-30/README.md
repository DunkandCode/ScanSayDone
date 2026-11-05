# Capturas — 30-oct-2026 · login + panel + dashboard

Build verificado: `next build` + `next start -p 3220`. Chrome headless vía Playwright, escala CSS 1:1.
Las capturas con prefijo `full-` son de **página completa** (todo el scroll), no solo la ventana.

## Página completa (para revisión de UX)

| Archivo | Tamaño | Qué muestra |
|---|---|---|
| `full-login-1440.png` | 1440×900 | `/entrar` completo en escritorio: split 50/50, titular `LEE LO QUE TE DICEN`, panel con deck + encuesta |
| `full-login-375.png` | 375×875 | `/entrar` completo en móvil: franja ciruela de 96 + tarjeta de 343 |
| `full-panel-resumen-1440.png` | 1440×1099 | `/panel` con **datos de ejemplo**: 3 tarjetas de distribución + últimas respuestas |
| `full-panel-resumen-vacio-1440.png` | 1440×900 | `/panel` **por defecto** (sin datos): las 3 tarjetas con `—` y el bloque `AÚN NADA QUE LEER` |
| `full-panel-resumen-375.png` | 375×2348 | `/panel` con datos en móvil (drawer cerrado) |
| `full-panel-respuestas-1440.png` | 1440×953 | `/panel/respuestas` con las 8 filas y los filtros |
| `full-panel-respuestas-375.png` | 375×2097 | la tabla convertida en tarjetas apiladas |
| `full-panel-qr-1440.png` | 1440×900 | `/panel/qr`: marco discontinuo 264×264 + 3 pasos + enlace de ejemplo |
| `full-panel-qr-375.png` | 375×1264 | la misma sección en una columna |

## Cortes de ventana (para ver un estado concreto)

| Archivo | Tamaño | Qué muestra |
|---|---|---|
| `entrar-1440-reposo.png` | 1440×900 | login en reposo, botón deshabilitado |
| `entrar-1440-error.png` | 1440×900 | correo inválido tras salir del campo: borde, icono y mensaje |
| `entrar-1440-enviado.png` | 1440×900 | estado enviado con la banda `DEMO · no se envía ningún correo` |
| `entrar-375-reposo.png` | 375×844 | login en móvil |
| `dash-1440-resumen.png` | 1440×900 | dashboard vacío con el shell (sidebar 264 + topbar 64) |
| `dash-1440-resumen-demo.png` | 1440×900 | dashboard con datos de ejemplo |
| `dash-1440-respuestas-vacio.png` | 1440×900 | sección Respuestas sin datos |
| `dash-1440-respuestas-demo.png` | 1440×900 | sección Respuestas con las 8 filas |
| `dash-1440-qr.png` | 1440×900 | sección Mi QR |
| `dash-375-resumen.png` | 375×844 | dashboard en móvil con el drawer cerrado |
| `dash-375-drawer.png` | 375×844 | el drawer abierto sobre el contenido |

## Contexto

Código: `src/app/entrar/`, `src/app/panel/` (shell + 3 secciones), `src/app/data/panel-demo.js`, `src/app/assets/scss/_login.scss` y `_panel.scss`. Sin backend, sin `fetch`, sin almacenamiento.
Defectos corregidos y medidas: `../VERIFICACION-LOGIN.md` (§3, §5b, §5c), `../VERIFICACION-PANEL.md`, `../VERIFICACION-DASHBOARD.md`.
Planos vigentes: `../wireframes/10-login.svg`, `11-panel.svg`, `12-dashboard.svg`.
