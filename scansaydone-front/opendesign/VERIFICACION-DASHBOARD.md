# VERIFICACION-DASHBOARD — shell + 3 secciones (30-oct-2026)

> Alcance: **solo frontend**. Sin backend, sin `fetch`, sin almacenamiento, sin lógica de filtros.
> Spec: `DASHBOARD-UX.md` v2 · Auditoría previa: `DASHBOARD-AUDITORIA.md` · Plano: `wireframes/12-dashboard.svg`
> Capturas: `capturas/2026-10-30/dash-*.png` (1440 resumen vacío y demo, respuestas vacío y demo, Mi QR; 375 con drawer)

## 1. Por qué existe este documento

Había **dos conceptos de panel** que se contradecían: el del 27-oct (`DASHBOARD-UX.md` original: sidebar de 3 destinos + 4 KPIs + gráfico Recharts + cola de alertas con botón "Responder" + paginación) y el del 30-oct (`PANEL-UX.md`: una pantalla, sin navegación). La auditoría (`DASHBOARD-AUDITORIA.md`, commit `7c2eadc`) concluyó que los planos `d01…d04` **no se podían reemitir**: dibujaban KPIs, alertas y acciones que las reglas vigentes prohíben y que ningún backend puede sostener.

Decisión del operador: **construir el dashboard** y que el panel existente sea su sección `Resumen`.

## 2. Shell construido

| Pieza | Medida verificada en navegador |
|---|---|
| Sidebar | **264 × 900**, fija, ciruela, full-height |
| Topbar | **1176 × 64** desde x 264, blanca, borde inferior 1 px |
| Contenido | **1128** en x 288 (24 de padding por lado) |
| Columna | 72 (`(1128 − 11×24) / 12`) |
| Tarjetas del resumen | **360 × 256**, gap 24 → 3×360 + 2×24 = 1128 ✓ |
| `h1` | 44 px |
| Scroll horizontal | 0 a 1440 y a 375 |

Sidebar: marca (logo + `SCAN SAY DONE` + separador + `PANEL`), 3 ítems (`Resumen` · `Respuestas` · `Mi QR`) y `Salir` al pie. El **ítem activo** se distingue por tres señales simultáneas: barra coral de 3 px, peso 600 vs 500 y `aria-current="page"`. Quitando el color, siguen quedando dos.

El **switch de datos de ejemplo vive en la topbar** porque afecta a dos secciones: un interruptor por sección los duplicaría.

## 3. Las 3 secciones

| Ruta | Sección | Contenido | Estado por defecto |
|---|---|---|---|
| `/panel` | Resumen | 3 tarjetas de distribución + **5 últimas respuestas** + enlace `Ver todas las respuestas` | vacío |
| `/panel/respuestas` | Respuestas | filtros (5 chips + 2 fechas) + tabla completa de 8 filas | vacío |
| `/panel/qr` | Mi QR | marco 264 × 264 discontinuo, 3 pasos (`ESCANEA · CONTESTA · LEES`), campo con enlace de ejemplo y línea de honestidad | vacío por definición |

**`Mi QR` no muestra ningún QR**: el marco con borde discontinuo *es* la señal de que falta, y el texto lo dice. Dibujar un QR falso sería la misma mentira que un botón muerto.

## 4. Defectos encontrados al medir

| # | Defecto | Causa | Corrección | Prueba |
|---|---|---|---|---|
| 1 | El build fallaba: `FiQrScan is not exported` | ese icono no existe en el set Feather | `FiGrid` (verificado con `node -e` sobre `react-icons/fi`) | build OK |
| 2 | La marca del sidebar se partía en dos líneas | sin `white-space: nowrap` el flex la comprimía | `nowrap` + `flex: 0 0 auto` + 18 px | alto del nombre 27 = una línea |
| 3 | El switch de demo quedaba a la izquierda de la topbar | `justify-content: space-between` sin hijo izquierdo en escritorio | `flex-end` en escritorio, `space-between` en móvil (para el hamburguesa) | switch alineado a la derecha |
| 4 | La línea de honestidad del QR caía **fuera** de la tarjeta | contenido real más alto que el `min-height: 388` de la spec | `height: auto; min-height: 400` | las dos tarjetas 443, texto dentro |
| 5 | El marco del QR medía 264 × **255** | alto dictado por el contenido | `height: 264px` + flex centrado | 264 × 264 |

## 5. Estados

- **Vacío es el default** en las tres secciones. Cero cifras cuando no hay datos.
- **Demo**: dataset de 8 respuestas, badge `DATOS DE EJEMPLO` + línea *"Estas respuestas son un ejemplo para ver la pantalla llena. No vienen de clientes reales."* y anuncio por `aria-live`. Resumen muestra 5 filas; Respuestas, las 8.
- **Sin conexión**: banner en el shell, alimentado por `navigator.onLine` y los eventos `online`/`offline`.
- **Carga y error**: declarados en el código, **sin disparador** porque no hay petición. No se inventó un botón para provocarlos.

## 6. Accesibilidad

- Skip-link `Saltar al contenido`.
- `<nav>` con `aria-label` y `aria-current="page"` en el ítem activo.
- Drawer móvil: hamburguesa con `aria-expanded` y `aria-controls`, cierre por `Esc` y al navegar, scrim clicable.
- Tablas reales con `<caption>` oculto y `th scope="col"`; en móvil pasan a filas-tarjeta con `data-label`.
- Chips `radiogroup` con roving tabindex y flechas.
- Foco visible de 3 px en todo lo interactivo; objetivos ≥44 px.

## 7. Pendientes

| # | Pendiente | Por qué importa |
|---|---|---|
| 1 | **Q2 y Q3 siguen `[confirmar]`** (`¿Volverías?`, `¿Qué mejorarías?`) | aparecen en la tabla y en las tarjetas: si cambian, se edita `panel-demo.js` y se recaptura |
| 2 | El panel no está protegido: se entra por URL | requiere sesión real |
| 3 | Filtros sin lógica y sin paginación | backend |
| 4 | `Ajustes` no existe como sección | no hay nada que ajustar todavía; cuando lo haya, es el 4.º ítem |
| 5 | El switch demo no persiste entre recargas | es estado de sesión por diseño; con backend no tendría sentido |

## 8. Para conectar el backend

| Necesidad | Dónde entra |
|---|---|
| `GET` de respuestas | reemplaza `PANEL_DEMO_ROWS` en las dos secciones (el vacío ya es el default) |
| Totales por pregunta | reemplaza `PANEL_TOTALS` |
| QR real | ocupa el hueco de 216 × 216 del marco; módulos ciruela sobre blanco, nunca coral (no escanea) |
| Enlace de la encuesta | el campo `readonly` pasa a leer `NEXT_PUBLIC_SITE_URL` |
| Guardia de sesión | en `layout.js`, redirigir a `/entrar` sin sesión |
| Filtros | hoy `disabled`; conectan a querystring |
