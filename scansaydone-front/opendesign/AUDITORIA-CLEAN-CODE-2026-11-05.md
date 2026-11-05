# AUDITORÍA — Clean code y estándar de código (05-nov-2026)

> Encargo: "revisar también el clean-code, que hay RAG de ello, y el estándar de código".
> Alcance: 31 archivos JS/JSX (2389 líneas) + 5 hojas SCSS (~3800 líneas) de `E:\Trabajos\scan\src`.
> Rúbrica: `clean-code-mastery` → `references/code-smells-checklist.md` (Cap. 17: G1-G36 · C1-C5 · F1-F4 · T1-T9 · N1-N7) con el contrapeso anti-dogma de `references/pragmatic-checks.md` (PCC-4/PCC-22: la duplicación textual de reglas distintas **no** es violación de DRY).

## 1. Veredicto

**El código es mayormente legible; el estándar de verificación era inexistente.** El defecto más grave no estaba en el código: estaba en que *el proyecto declaraba un lint que nunca validó una línea*. Corregido. Quedan 5 defectos funcionales de severidad media, también corregidos, y 3 warnings de accesibilidad que probablemente son falsos positivos.

Diez hallazgos, ninguno de severidad alta en el código. No hay god objects, ni funciones de 100 líneas, ni nombres de una letra, ni `any` disfrazado.

## 2. El hallazgo que importa: `npm run lint` no lintaba

| | |
|---|---|
| Declarado | `"lint": "next lint"` en `package.json` |
| Real | Abre el asistente interactivo de ESLint y sale con **código 1** |
| Configuración | No existía `.eslintrc*`, ni `eslint.config.*`, ni `.editorconfig` |
| Consecuencia | **0 líneas validadas desde que existe el proyecto** |

Arreglado: `eslint@9.39.5` + `eslint-config-next@15.4.1`, `eslint.config.mjs` (flat config) y script → `eslint .` (`next lint` está deprecado en 15 y desaparece en 16).

### El segundo defecto, escondido en el arreglo
La configuración base del template linteaba **solo `.js`, `.mjs` y `.cjs`**: los **21 archivos `.jsx`** de `src` quedaban fuera **en silencio**. Es exactamente el mismo tipo de avería que el bug original —una herramienta que dice que revisa y no revisa—, un piso más abajo. Corregido con `files: ["**/*.{js,mjs,cjs,jsx}"]` y verificado por el conteo de archivos analizados.

### Estado del lint tras el arreglo
```
✖ 3 problems (0 errors, 3 warnings)
exit: 0
```

| Regla | Errores | Warnings |
|---|---|---|
| `no-unused-vars` | 1 → **arreglado** (`footer.jsx:8`, import muerto `contactHref`) | 0 |
| `jsx-a11y/control-has-associated-label` | 0 | **3** |
| `react-hooks/*`, `jsx-a11y/anchor-is-valid`, `no-constant-condition`, `@next/next/no-img-element` | 0 | 0 |

## 3. Los 3 warnings: antes de silenciarlos, hay que leerlos

`entrar/page.jsx:118` y `panel/respuestas/page.jsx:65,69` — los tres controles **sí tienen etiqueta**: el email con `label htmlFor="email"` y los dos `input[type=date]` **envueltos** en su `<label>`.

La regla `control-has-associated-label` es conocida por no detectar la asociación por anidamiento en todos los casos. **No se silenció nada.** Propuesta: evaluar `jsx-a11y/label-has-associated-control` como reemplazo y, si tampoco detecta el anidamiento, documentar la excepción con un `eslint-disable-next-line` **comentado con el motivo** — nunca un `off` global.

## 4. Los 6 defectos de código corregidos

| # | Archivo | Defecto | Regla | Corrección | Verificado |
|---|---|---|---|---|---|
| 1 | `data/panel-demo.js:9-25` | Los totales por pregunta eran **el mismo dato escrito dos veces** que las filas: divergen en silencio | G5, PCC-22 | `PANEL_TOTALS` derivado por `map`+`filter` sobre las filas; nuevo `PANEL_TOTAL_RESPONSES` | totales **8/8/8** |
| 2 | `panel/page.jsx:15,44,50` | El denominador `8` escrito a mano | G25, G33 | `totalResponses` derivado; porcentajes intactos | mismos valores |
| 3 | `panel-demo.js:10-14` | Fechas fijas rotuladas **"hoy" / "ayer"**: al día siguiente la etiqueta miente | G26 | Etiquetas absolutas coherentes con su `iso` | `30-oct 09:12`, `29-oct 17:05` … |
| 4 | `contactus/page.jsx:62-69` | "Qué pasa después" **prometía un correo** sin canal configurado: prometer algo que no ocurre es el mismo defecto que inventar un testimonio | G2 | Bloque condicionado a `channelReady` (`lib/contact.js`, sin duplicar la condición) | `prometeCorreo: false` |
| 5 | `navbar/navlight.jsx:37` | `aria-label` fijo en "Abrir menú" con `aria-expanded=true`: lectores de pantalla anuncia "Abrir menú, expandido" | N7 | `aria-label={toggle ? "Cerrar menú" : "Abrir menú"}` | `Abrir menú` → **`Cerrar menú`** |
| 6 | `_login.scss:59` | Comentario decía "sin sombra" y la tarjeta tiene `box-shadow` | C2 | El comentario ahora cita `--shadow-glass` y el filo interior | — |

**Los números que pinta la pantalla no cambiaron.** La derivación se verificó a mano: Q1=[0,1,1,2,4], Q2=[0,0,2,4,2], Q3=[1,1,1,3,2], total 8.

## 5. Lo que la auditoría recomienda y NO se hizo

| # | Recomendación | Por qué queda pendiente |
|---|---|---|
| 1 | **Borrar 102 líneas de SCSS sin uso**: 9 variantes `.avatar-*` (`_components.scss:429-465`) y 6 variantes de logo + reglas `.has-submenu`/`.submenu-arrow` (`_menu.scss:23-36, 64-114`) | Son restos del template, sin consumidor en `src`. Se verificó también que **no son utilidades de Bootstrap**. Requiere la autorización del operador que se pidió para la purga anterior — **no se borró nada sin ella** |
| 2 | **Retirar `components/pricing.jsx`**: sin importación localizada | Es un **archivo**: la regla del operador es no borrar archivos sin confirmación explícita. Se reporta, no se toca |
| 3 | **Partir `page.js`** (389 líneas, 8 secciones) | El costo supera el beneficio: precios y FAQ ya leen datos compartidos; el resto es copy estático. Extraer a `data/` agregaría archivos y mapeos sin ganancia demostrada. **No se dividió** |
| 4 | **Tests**: existen **0** archivos `*.test.*` / `*.spec.*` | Para una landing + panel, el mínimo útil son 3 pruebas: `hasPricing()`, los totales del demo y el recorrido login→demo. No se escribieron en este lote |

### Sobre las 186 clases SCSS "sin uso"
El análisis automático marcó 186 de 492 selectores sin coincidencia textual en JSX. **La lista es candidata, no prueba**, y el auditor se negó a inventar el desglose. Lo que sí verificó:

- **`apps__kicker` no es CSS huérfano**: solo aparece en un comentario que documenta su sustitución por `.section-kicker` (`_home.scss:572-582`). Ahorro por borrarla: **0 líneas de reglas activas**.
- **Las `.avatar-*` no son utilidades Bootstrap**: son bloques propios del template.
- Las utilidades que sí emite el framework (`.bg-*`, `.border-*`) **no se borran selector a selector**: se recortan por la API `$utilities` **antes** de `utilities/api`. El entry actual importa Bootstrap completo (`bootstrap.scss:11`), así que el recorte es una decisión de configuración, no de limpieza.

## 6. Estándar de código: lo que falta acordar

| Tema | Estado | Propuesta |
|---|---|---|
| **Extensiones** | `page.js` (landing) convive con `entrar/page.jsx`; `navbar/navlight.jsx` con `components/footer.jsx` | Acordar **`.jsx` para todo lo que devuelve JSX** y `.js` para datos/lógica. Sin renombrado masivo: se aplica hacia adelante y se normaliza el archivo que se toque |
| **Ubicación** | `components/navbar/navlight.jsx` (subcarpeta) vs `components/footer.jsx` (plano) | Una sola convención: componentes en `components/`, subcarpetas solo cuando el componente tenga 3+ piezas |
| **Lint** | **Arreglado** (`eslint .`, flat config, exit 0) | Mantener `error` en `no-unused-vars`, `rules-of-hooks`, `anchor-is-valid`; `warn` en `exhaustive-deps`, `jsx-a11y/*` |
| **Formato** | Sin `.editorconfig` ni Prettier | No se añadió: el código es consistente hoy. Si entra un segundo contribuidor, es la primera herramienta a instalar |
| **Tests** | 0 archivos | Ver §5.4 |

## 7. Lo que está bien y no hay que tocar

1. **FAQ con fuente compartida** y filtro de precios (`page.js:9, 324-327`): el dato vive en un sitio.
2. **Contacto centralizado** en `lib/contact.js:5-27`: una sola puerta, y ahora el copy depende de ella.
3. **Manejo de foco del drawer** (`panel-shell.jsx:47-57`): guarda contra robar el foco en el montaje, devuelve el foco al cerrar.
4. **Sin `eslint-disable` en todo el proyecto.** Cero deuda silenciada.

## 8. Fuentes

| Fuente | Uso |
|---|---|
| `clean-code-mastery/references/code-smells-checklist.md` | **La checklist operativa** (Cap. 17). De aquí salen los códigos G5, G9, G24, G25, G26, G33, C2, F4, N7 |
| `clean-code-mastery/references/pragmatic-checks.md` | Contrapeso anti-dogma: PCC-4/PCC-22 evitó marcar DRY donde solo había texto parecido |
| RAG `book-pragmatic-clean-code` | `chk:2537cb76a85072d708b467026c54` (ordenar miembros, estructurar archivos, **consistencia**, refactor) · `chk:df84ed1bbd31e816d61fe37adbd5` (documentar *workarounds* y usar los TO-DO con cuidado) · `chk:e68c871d2f012c7e34401a032a47` (conceptos generales) |
| RAG `book-philosophy-of-software-design` | `chk:3dfd727b3f63d5fcf2c5011bc077` — §17.2 *Ensuring consistency*: la consistencia se degrada sola en proyectos largos; hay que **decidirla**, no esperarla |

**Honestidad sobre el RAG:** los 8 fragmentos que devolvió `rag_hybrid_search` eran en su mayoría **índices de capítulo**, no el texto de las reglas. El mapa conceptual sirvió (consistencia, estructura de archivos, documentación de *workarounds*); **la checklist operativa salió de los `references/` de la skill**, que están completos. Cuando el corpus devuelve un índice, no se puede citar como si fuera la regla.

## 9. Evidencia de cierre

```
npm run lint   → ✖ 3 problems (0 errors, 3 warnings)   exit: 0
npm run build  → ✓ Compiled successfully
check:tokens   → OK: tokens emitidos correctamente
check:placeholders → OK: 0 placeholders
rutas          → 8/8 con 200
```

En navegador (Playwright): tabla del panel con 5 filas de preview y fechas absolutas · totales 8/8/8 · `prometeCorreo: false` en `/contactus` · botón del menú `Abrir menú` → `Cerrar menú`.

## 10. Pendiente, con su autorización

| # | Pendiente | Necesita |
|---|---|---|
| 1 | ~~Borrar **102 líneas** de SCSS sin uso (`.avatar-*`, logo, submenu)~~ | **HECHO**: **137 líneas** fuera (41 de `.avatar-*` + 96 de logo/submenu y sus `@media`). Llaves `_components` 225→215 · `_menu` 254→223, ambas balanceadas. Se conservaron las clases vivas del navbar |
| 2 | ~~Retirar `components/pricing.jsx` (sin import)~~ | **HECHO** con `git rm` (recuperable). 3 comprobaciones de importación a 0. `pricing/page.jsx` **intacto**: es una ruta viva |
| 3 | ~~Evaluar `jsx-a11y/label-has-associated-control` para los 3 warnings~~ | **PENDIENTE**: se mantiene la regla actual con 3 warnings documentados como probables falsos positivos; no se silenció nada |
| 4 | Recortar utilidades de Bootstrap por `$utilities` | Medir el CSS compilado antes/después para saber si compensa |
| 5 | ~~3 tests mínimos~~ | **HECHO**: `node --test` nativo, **0 paquetes instalados**, `tests/panel-data.test.mjs`, 3/3 verdes. Queda fuera el recorrido login→demo: es UI y exigiría Playwright |
| 6 | PNG de wireframes (no existe **ninguno**) | **BLOQUEADO por herramienta**, no por decisión: sin `sharp`, Playwright rechaza `file:` y no alcanza un segundo origen local, `next start` da 404 para SVG añadidos tras el build. Salida: `sharp` + script `wireframes:png` |
