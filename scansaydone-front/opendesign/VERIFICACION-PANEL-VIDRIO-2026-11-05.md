# VERIFICACIÓN — Vidrio en el panel + revisión de código (05-nov-2026)

> Encargo: "replicar lo del login en el dashboard, con glassmorphism leve y sutil dentro de los parámetros, y revisar cada aspecto del código".
> Método: **revisión de código primero** (veredicto "aplicar con cambios"), **medición de contraste después**, y solo entonces la implementación. Capturas: `capturas/2026-11-05/panel-vidrio-{resumen,respuestas,qr}-1440.png`.

## 1. La revisión de código fijó las condiciones

Veredicto del revisor: **aplicar con cambios**, no tal cual. Cinco defectos de código, todos verificados y corregidos:

| # | Defecto | Evidencia | Corrección |
|---|---|---|---|
| 1 | `.panel-container` declarado **dos veces** (1140 y 1128) con `@media` de 960 y 720 muertos | ganaba el segundo por orden | se borró el de 1140 y sus media |
| 2 | `.panel-title` con `font-size: 36px` **muerto por cascada** (el base lleva `44px !important`) | salto real 44 → 28, nunca 36 | regla borrada |
| 3 | El interruptor de datos de ejemplo **no tenía nombre accesible** | `role="switch"` sin `aria-label`/`aria-labelledby` | `aria-labelledby` al texto visible |
| 4 | La región `aria-live` **se montaba al cambiar** | una región que no existe al producirse el cambio no anuncia | la región vive siempre; se condiciona el contenido |
| 5 | El drawer móvil **no gestionaba foco** ni bloqueaba el fondo | se podía tabular por detrás del overlay | foco al primer ítem al abrir, al burger al cerrar, `inert` en el contenido |

Además: botón "Reintentar" sin manejador (ahora recarga) y **129 líneas de SCSS muerto** (`.panel-header*`, `.panel-nav*`, `.panel-main`, `.panel-card-foot-empty`, `.panel-chip-active`, `.panel-placeholder`, `.panel-section-sub`, el `@media` de 960/720, el `padding` de 575).

## 2. La condición que cambió el diseño: la tabla NO va en vidrio

El revisor lo argumentó y la medición lo confirmó. Cuatro razones:

1. La tabla tiene **8 filas × 56 px + `th` 74** ≈ 522 px **apilando dos degradados** (el del fondo y el del vidrio): cada fila sienta sobre un compuesto distinto.
2. El margen del peor texto es **0.18** (`--text-2` 4.68 sobre la parada profunda, menos el mínimo AA de 4.5). Cero presupuesto para la varianza por fila.
3. Con datos reales las filas crecen → el gradiente se estira → las filas nuevas empeoran.
4. En el login ya se midió que el vidrio **no se percibe** sobre degradado liso: en la tabla costaría contraste y no devolvería efecto.

**Resultado:** tabla `--surface` blanca y opaca (texto 6.62 / 15.29, ya medidos); vidrio solo en las 3 tarjetas de resumen y en las 2 del QR, donde el texto es Bebas 28 y Montserrat 16-20 px.

## 3. Lo que se aplicó

| Pieza | Antes | Ahora |
|---|---|---|
| Fondo del contenido | `--bg` crema plano | `--grad-warm` (ámbar) |
| Tarjetas de resumen | blancas opacas | `--grad-glass` + borde blanco 70 % + `--shadow-glass` + filo `inset 0 1px 0` |
| Tarjetas del QR | blancas opacas | ídem |
| Tabla | suelta sobre el fondo | `--surface` + radio 12 + `overflow: hidden` |
| Enlace "Ver todas" | `--link` | **`--link-on-warm`** |
| Chips y fechas | `--border-strong` | **`--border-on-warm`** |
| Pastilla `DEMO` | mostaza sin borde | mostaza **+ borde** `--border-on-warm` |
| Barra lateral / topbar | ciruela / blanca | **sin cambios** (son las anclas) |

**2 tokens nuevos**, ambos derivados: `--link-on-warm` (`--link` 75 % + ciruela) y `--border-on-warm` (ciruela 60 % + crema). Cero hex nuevos. **Sin `backdrop-filter`**: no aporta sobre degradado liso y suma costo.

## 4. Los tres fallos de contraste que la revisión anticipó

| Elemento | Antes | Ratio | Después | Ratio |
|---|---|---|---|---|
| Enlace "Ver todas las respuestas" sobre la parada profunda | `--link` | **4.20 → falla AA** | `--link-on-warm` | **5.46** ✓ |
| Límite de chips/fechas sobre ámbar (1.4.11 pide 3) | `--border-strong` | **2.52 → falla** | `--border-on-warm` | **3.27** ✓ |
| Límite de la pastilla `DEMO` sobre ámbar | sin borde | **1.37 → invisible** | borde `--border-on-warm` | **3.27** ✓ |

El tercero no estaba en la revisión: apareció al mirar la captura. La pastilla mostaza sobre banda ámbar desaparecía como forma (1.37). Se le puso borde en vez de cambiarle el relleno: la mostaza es la firma de las etiquetas del producto y no se toca por un problema de límite.

Contrastes del texto sobre vidrio, calculados sobre el compuesto: ciruela **13.85**, texto-2 **5.99** (arriba) y **5.65** (abajo).

## 5. Comprobado en el navegador

| Qué | Resultado |
|---|---|
| Fondo del contenido | `linear-gradient(168deg, …)` con las paradas de `--grad-warm` |
| Tarjetas | `--grad-glass` + sombra cálida + filo |
| Tabla | `rgb(255,255,255)` y radio 12 px |
| Enlace | `#91332F` (`--link-on-warm`) |
| Pastilla | borde `#827587`, 152 × 24 — el borde no altera el tamaño |
| Región viva sin demo | presente en el DOM, **altura 0** (`:empty` colapsa; no reserva hueco) |
| `aria-labelledby` del switch | `panel-demo-label` |
| Drawer abierto (375 px) | `inert` presente en `<main>` · foco en `panel-nav-item` |
| 10 tabs con el drawer abierto | **0 dentro del `<main>`** · 6 en el sidebar · 1 en el cuerpo (chrome del navegador) |
| Drawer cerrado | `inert` retirado · foco devuelto al burger |
| Scroll horizontal | **0** en las 3 rutas |
| `check:tokens` / `check:placeholders` | OK / 0 |
| Build | `✓ Compiled successfully` |

## 6. Lo que la revisión recomienda y **no** se hizo

| Sugerencia | Por qué no |
|---|---|
| Extraer `DemoNotice` y `AnswersTable` (markup repetido en `page.jsx` y `respuestas/page.jsx`) | Es la recomendación con más ROI del revisor, pero toca JSX de dos secciones y merece su propio lote con verificación visual. Queda anotado |
| Extraer `EmptyState` | 4 líneas compartidas y un botón de diferencia: la abstracción cuesta más que la duplicación |
| Extraer el título + subtítulo | 3 líneas × 3 usos, sin comportamiento: no compensa |

## 6.5 · Un defecto que solo apareció al probarlo

El primer arreglo del drawer usaba el patrón de React 18: `inert={open ? '' : undefined}`. Al medir, el atributo **no existía en el DOM** con el drawer abierto: React 19 (19.1.0 aquí) trata `inert` como prop **booleana real**, así que una cadena vacía es falsy y no pinta nada. Corregido a `inert={open}` y verificado: con el drawer abierto, 10 tabulaciones dan **0 paradas dentro del `<main>`**.

LECCIÓN: la revisión de código leyó el `inert` y lo dio por bueno; la prueba en el navegador lo desmintió. Los atributos booleanos de React 19 (`inert`, `popover`) no se comportan como en 18, y el código compila igual en ambos casos. Sin prueba de navegador esto se commitea roto.

## 7. Pendiente
1. **`_panel.scss` sigue con ~1062 líneas** para 3 pantallas. Tras la purga no hay muerto conocido, pero el archivo pide una división por secciones cuando haya tiempo.
2. **Planos desfasados**: `11-panel.svg` y `12-dashboard.svg` dibujan tarjetas blancas sobre crema, sin ámbar ni vidrio. Ya son tres frentes de desfase (login, landing, canales) más este.
3. La barra lateral ciruela sobre contenido ámbar reconstruye el contraste cálido/frío que el login abandonó. El revisor lo considera **legítimo** con una condición: la topbar blanca actúa como plano frío y no se toca. Se cumplió.
