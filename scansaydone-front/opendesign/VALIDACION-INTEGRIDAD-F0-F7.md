# Validación de integridad F0–F7 (28-oct-2026)

> Motivo: se trabajó en paralelo sobre el mismo repo y hubo señales de colisión. Esta acta documenta qué se encontró, qué se reparó y con qué evidencia se declara el estado sano (o no) antes de F8.

## 1. Qué se encontró

| # | Síntoma | Evidencia | Gravedad |
|---|---|---|---|
| 1 | **HEAD con orden ilógico**: `19bf5ec` "feat(f3)" quedó **después** de los commits de F6 | `git log --oneline` | alta (trazabilidad) |
| 2 | **Trabajo sin commitear de dos enfoques de navbar**: reapareció el estado `is-scrolled` con listener de scroll, que había sido reemplazado por la superficie crema permanente | `git status` + `navlight.jsx` con `window.scrollY` | alta (dos soluciones a la vez) |
| 3 | **`package-lock.json` con 720 líneas de churn** sin cambio de `package.json` | `git diff --stat` | media |
| 4 | **F7 se colgó de un commit etiquetado "feat(f3)"** | `git show --stat 19bf5ec` (incluye `site.js` + `page.js` de precios) | media |
| 5 | **Gate de precios incompleto**: la sección se gateaba con el flag solo, no con `hasPricing()` → `SITE.plans.map` habría reventado al activar el flag sin datos | `page.js:309` | alta |

**Lo que NO hubo:** marcadores de merge (`<<<<<<<` = 0), `[TODO` = 0, secciones duplicadas, ni `: bv.$` en el CSS compilado (0). El `bv.$` que aparece 48 veces está **dentro de `#{}`**, que es la forma correcta de interpolar en Sass.

## 2. Qué se reparó

| Acción | Detalle |
|---|---|
| `git stash` del trabajo paralelo | Guardado como `stash@{0}` — *"navbar scroll paralelo + lock churn (apartado 28-oct)"*, recuperable con `git stash pop`. No se descartó nada |
| Navbar | Vuelve al estado aprobado: **superficie crema permanente, texto ciruela, borde inferior, sin listener** |
| Gate de precios | `page.js` usa **`hasPricing()`** (`ec896c1`): flag + 3 planes + precio no vacío |
| Documentación | 8 drifts corregidos: navbar permanente (UX §3.1, EFECTOS), hero sin QR, franja con el copy real, panel 3 bullets/2 callouts/880×550, precios gated, precondiciones del PLAN al estado real, typo `REIMPIME`→`REIMPRE` |
| `package-lock.json` | El churn quedó en el stash: el repo no arrastra un lock cambiado sin motivo |

## 3. Checklist de integridad (adoptado de la segunda opinión Go)

| # | Verificación | Resultado |
|---|---|---|
| 1 | **Build** | exit 0 · 9 rutas (`BUILD_ID` 14:27) |
| 2 | **Rutas** | 9/9 → 200 |
| 3 | **Guarda de tokens** | `check:tokens` → OK (0 `: bv.$`, tokens en hex válidos) |
| 4 | **Guarda de placeholders** | `check:placeholders` → OK |
| 5 | **Matriz de flags** | `showCounters/showTestimonials/showTeam/showPricing` = false · `plans: []` · `hasPricing()` = false |
| 6 | **Contrato de render por sección** | hero · franja · cómo funciona · canales · aplicaciones · panel · (precios gated) · footer |
| 7 | **Sin marcadores de corrupción** | `<<<<<<<` 0 · `[TODO` 0 · `is-scrolled` 0 · "Proyectos que abordamos" 0 |
| 8 | **Contenido de agencia fuera del DOM** | "Hagamos realidad" sólo existe en `cta-one.jsx`, que **no tiene importadores** (código muerto) |
| 9 | **Consola** | 0 errores en la última captura |
| 10 | **Peso** | HTML 63 KB · CSS ~309 KB raw · JS ~907 KB en chunks (~121 KB First Load por ruta) · **0 imágenes raster** en la home |

## 4. Riesgo de repetir la colisión (recomendaciones)

1. **Un solo escritor por archivo compartido.** `_home.scss`, `page.js` y `site.js` son los puntos de colisión; cada fase debe tocar uno y declararlo.
2. **No trabajar dos sesiones sobre el mismo HEAD.** Congelar el árbol (o usar `worktree`) antes de una tanda larga.
3. **Gate por fase** = build + rutas + `check:tokens` + `check:placeholders` + captura + matriz de flags. Sin esos seis, la fase no se cierra.
4. **`git stash` antes de reconciliar**, nunca `checkout --` a ciegas: aquí se salvó un enfoque alternativo de navbar que podría recuperarse.

## 5. Veredicto

**Estado SANO para F8**, con dos condiciones:

- La sección de precios queda como deuda **controlada** (doble gate, no publicable por accidente).
- Antes de F8: nada pendiente de código; solo queda limpieza (componentes huérfanos `cta-one`, `portfolio-one`, `team-one`, `client-one`, `services-one`; ~27 imágenes del template en `public/`; 4 dependencias sin uso) y el `package.json` con nombre `agencia-landing`.
