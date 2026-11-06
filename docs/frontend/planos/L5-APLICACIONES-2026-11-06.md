# L5 — Landing "Para quién": plano de banda 5 (Aplicaciones)

**Fecha:** 2026-11-06 · **Autor:** designer-alibaba (subagent) · **Estado:** **PROPOSED** — requiere aprobación del operador antes de implementar. Ninguna línea de este archivo es una decisión firmada.
**Ruta canónica:** `docs/frontend/planos/L5-APLICACIONES-2026-11-06.md` · **Precedentes de formato:** `L4-CANALES-2026-11-06.md` (§0–§11 y su §12 como modelo de acta) · `L3-PANEL-2026-11-06.md` (§12 modelo de acta; §1.2 estado vacío honesto) · `L2-COMO-FUNCIONA-2026-11-06.md`.
**Alcance:** solo frontend, banda 5 del landing (`/`), **insertada en el DOM entre la banda 4 (`channels.tsx`, servida) y la banda 6 (`panel-preview.tsx`, servida)**. Cero llamadas a API, cero fetch, cero datos de red, cero assets raster nuevos. No se toca `scansaydone-back/`. No se edita `scansaydone-front/ENTREGA-UX-2026-10-30/` (snapshot congelado, `CANON §8`).

**Qué es la fuente de cada número (clave de lectura, obligatoria al leer las tablas):**

| Marca | Significado |
|---|---|
| `[P]` | **cotado en documento**: valor impreso en `GRID-SPEC §1–§3`, `UX-SPEC §2.1 #5` o l.57/58/60, `PLANOS §1.1/§2.1 #5/§2.2 #5/§2.4/§2.5/§2.6/§6`, `CANON §4/§5/§6/§7`, `UX-LANDING §2 fila 5 / §4 / §7` (snapshot, se cita como cota documental con su marca de época), `PLAN-FRONTEND §7` fila L5, o el plano `08-aplicaciones.svg` (DESACTUALIZADO leve: **retícula y marcos 4/3 intactos**, `PLANOS §6`). |
| `[D]` | **derivado por fórmula** sobre un container documentado (`col = (C−264)/12`, `span(n) = n×col + (n−1)×24`, alto = ancho × 3/4). Aritmética, no medición nueva. |
| `[M legacy]` | **medido en el stack anterior** (Bootstrap/Sass, `REVISION-UX §3`; alto 681 desktop / 1260 móvil, `UX-SPEC §2.1 #5`, `PLANOS §2.2 #5`; el README de `capturas/2026-10-29/` anota 682 para `land-05-aplicaciones.png` — desfase de 1 px entre documentos legacy, no es nuestro asunto). Evidencia histórica: **no es cota del stack nuevo**. El stack nuevo **no tiene ninguna medición de L5**. |
| `[as-built]` | hecho del código actual, registrado por lectura estática (`archivo:línea`), **no** aprobado. |
| `[propuesta]` | propuesta de esta sesión, **sin efecto normativo**, espera firma del operador. |
| `sin dato` | no está documentado y no es derivable. Se nombra el archivo que debió contenerlo. |

**Skills cargadas (gate de diseño):** design-system-mastery, awesome-claude-design-mastery, frontend-design, session-anchor-system, caveman-core.
**Regla de honestidad de este archivo:** no ejecuté build, lint, typecheck, tests, axe ni Playwright. **No hay ningún PASS aquí.** Toda altura, ancho o posición de L5 en el stack nuevo es cota `[P]`/`[D]` o `sin dato`; **no existe medición de L5 todavía**. Propuesta ≠ aprobación.

---

## 0. Lock estético de la banda (antes de cualquier número)

- **Familia:** editorial cálido, dominante claro (heredada del lock de L1, servido; `L2 §0`, `L3 §0`, `L4 §0`) — no se redefine la identidad en L5.
- **Memorabilidad de la banda [propuesta] — el momento firma:** L5 es **la única banda del sitio que muestra ausencia sin disfrazarla**. Tres planchas blancas con marco discontinuo y **pie de foto**, donde la foto falta y **eso se dice en tipografía visible**, con su badge `DEMO`. La estructura de placa + caption (marco arriba, nombre y uso debajo, **sin tarjeta alrededor**) no existe en ninguna otra banda: L2 y L4 son tarjetas, L3 es un marco dentro de su banda. Aquí el marco **es** la columna. El dispositivo de memoria es la franqueza: una banda de marketing que declara "aquí todavía no hay nada que mostrar" y aun así ordena la página.
- **Qué banda es, en una frase:** es el **cierre de C-32** (§1). Su fondo blanco restituye la alternancia crema↔blanca que la regla P0 exige.
- **Elevación:** por **borde y color**, nunca por sombra difusa (`CANON §4`). Marco blanco sobre banda blanca: 1.00 → separación imposible por color → **borde obligatorio** (`UX-SPEC §3.C-3` trasposición directa; el brief lo fija: "elevada sobre blanco = 1.11; blanco sobre blanco = 1.00 ⇒ borde obligatorio").
- **Anti-convergencia:** la banda vecina (L4) usa **cuatro miniaturas de línea dibujadas a mano**. Si L5 dibujara escenas (restaurante, barra, anaquel), sería **la misma librea gráfica en dos bandas seguidas** y una escena dibujada de un local puede leerse como la evidencia que el sitio todavía no tiene (violación de `CANON §6` paso 3 si cae en decoración, y de la regla "no simular estados inexistentes" en grado suave). La trampa a evitar aquí es justo esa: **rellenar el vacío porque vacío se ve feo**. L5 no dibuja escenas: deja el hueco declarado (§5). Registro de desvío: "L4 dibujó escenas sobre crema; L5 se niega a dibujar y pasa a plancha desnuda sobre blanco — dirección distinta, banda distinta."
- **Prohibido en esta banda (lista cerrada):** logos de clientes o de plataformas (`CANON §6`, `PLAN-FRONTEND §7` fila L5 "Sin logos de clientes"); testimonios; cifras; tiempos; porcentajes; contadores; sellos de "confianza"; **fotos de personas** no entregadas (`CANON §6`); **escenas decorativas generadas** (`CANON §6` paso 3 rechazado); personas dibujadas; QR dibujado (aquí ni siquiera decorativo: no hay nada que escanear en la banda); emoji como ícono; ícono de librería (no hay set decidido — `B-4`, L4 lo esquivó dibujando SVG propio y esta banda hace lo mismo con su marca funcional); `box-shadow`, `filter: blur()`, `backdrop-filter`, gradientes; Bebas en títulos pequeños o en minúsculas (`CANON §5`); coral como texto sobre blanco (3.14 < 4.5; `UX-SPEC §3.B-7`, regla 2); `border-subtle` como límite funcional (1.75 sobre blanco = decorativo); capturas del snapshot legacy presentadas como actuales (`CANON §6`, `PLANOS §6`); un cuarto marco; CTA de cualquier tipo (`PLANOS §2.3` fila 5 `[P]`: "ningún CTA por tarjeta"); las palabras vetadas de `CANON §7` / `UX-SPEC §5.2`.

---

## 1. Cierre de C-32 — qué hace esta banda y por qué se declara aquí

### 1.1 El estado hoy (por qué la deuda existe)

Secuencia servida hoy, medida en los gates de L2/L3/L4 (actas §12):

```text
banda 1 Hero     → CREMA   (contenido x=182 por px-8 interno del hero [as-built])
banda 3 L2       → BLANCA  (container 1140 en x=150, tarjetas 364 [medido gate L2])
banda 4 L4       → CREMA   (1140 en x=150, 267×4 [medido gate L4])
  ∅ banda 5      → NO EXISTE   ← el hueco
banda 6 L3       → CREMA   (1320 desde 1400, marco 872×545 [medido gate L3])
```

Dos fondos crema **adyacentes** (4 y 6) violan la regla P0 de fondos (`UX-SPEC §2.1` l.58: "dos fondos iguales nunca adyacentes"; `DESIGN-CONTRACT §4` vía el brief). El acta de L4 §12 midió el daño: **≈180 px de crema continua** entre la nota de ilustración de L4 y el encabezado de la banda 6 a 1440 — las dos bandas **se leen como una sola**; la mitigación perceptual que suponía `L4 §3.3` (dos cabeceras distinguibles sobre el mismo fondo) **no alcanzó**. Por eso **C-32 pasó a bloqueante de publicación junto con C-19** (`L4 §10` y acta §12).

`L4 §3.3` recomendó y el sistema aceptó ejecutar: *servir la 4 en crema (cota intacta) y cerrar la adyacencia cuando la banda 5 blanca se inserte entre ambas*. **Este plano es ese cierre.**

### 1.2 La secuencia con L5 servida

```text
1 CREMA  →  3 BLANCA  →  4 CREMA  →  5 BLANCA (esta)  →  6 CREMA
```

La alternancia queda restituida en los tres bordes nuevos: 4↔5 (crema↔blanca) y 5↔6 (blanca↔crema). Ninguna banda cambia su fondo: **el arreglo no es recolorear nada, es insertar la banda que la retícula ya tenía asignada en blanco.**

La banda 5 es blanca por **tres fuentes independientes**:
1. `UX-SPEC §2.1 #5` `[P]`: "Aplicaciones (**blanco**) · `container-xl` · 3× `col-lg-4` = **364**, marcos 4/3".
2. `08-aplicaciones.svg:7` `[P]` (anotación del propio plano): *"banda BLANCA · secuencia crema > blanco > crema · sep var(--border) · sin mostaza"*.
3. `UX-LANDING §2.19` (tabla de adyacencias del snapshot) `[P]`: fila "5 Aplicaciones | blanco #FFFFFF | … **banda blanca intermedia crema→blanco→crema respeta no-adyacentes**".

**Declaración exigida por el brief: L5 es el cierre de C-32.** Con la banda servida y el criterio §9.12 medido en el acta del gate, **C-32 se declara cerrada**. Lo que **no** cierra L5: **C-19** (la banda 6 en vacío no se publica) sigue abierta e independiente. Y cuando exista la banda 2 (franja de confianza, hoy inexistente), quien la construya debe mantener la P0 con su propio fondo documentado (`UX-SPEC §2.1 #2` no fija superficie → `sin dato`, owner Operador; se registra como nota, no se decide aquí).

### 1.3 Por qué esta banda importa más que las anteriores (jerarquía del gate)

El gate de L5 no solo revisa la banda: revisa **la página**. Un reviewer que vea dos cremas seguidas entre canales y panel **no** marca defecto de L4 ni de L3 (así lo previno `L4 §9.22`): marca C-32. Con L5 servida, C-32 **no puede seguir existiendo**; si persiste, el defecto es de L5 (fondo o posición de inserción), no una deuda tolerada. Esa es la asimetría: L5 es la primera banda de este proyecto cuyo criterio de éxito principal es **la secuencia de fondos de sus vecinas** además de su geometría.

---

## 2. Grid: contenedor, spans, posiciones x, cierre aritmético

### 2.1 Contenedor y columna `[P]` (`GRID-SPEC §1`, `PLANOS §1.1`, portados en `globals.css:24-36` `[as-built]`; mismo eje que L2 y L4)

| bp | `min-width` | container L5 | `col = (C−264)/12` | gutter |
|---|---|---|---|---|
| xs | 0 | 100 % − 2·padding | no aplica: apila a 12 | 24 `[P]` |
| sm | 576 | `mkt-sm` 540 | 23 `[P]` | 24 `[P]` |
| md | 768 | `mkt-md` 720 | 38 `[P]` | 24 `[P]` |
| lg | 992 | `mkt-lg` 960 | **58** `[P]` | 24 `[P]` |
| xl | 1200 | `mkt-xl` **1140** (bp rector `[P]` `PLANOS §2.1 #5`) | **73** `[P]` | 24 `[P]` |
| 2xl | 1400 | sigue **1140** — L5 **no** usa el container de 1320 (lo usa solo la banda 6, `[P]` `PLANOS §2.1 #6`) | 73 `[D]` | 24 `[P]` |

L5 usa 1140: **el mismo eje canónico que L2 y L4** (medidos en sus gates: container 1140 en x=150 a 1440 `[as-built]`). L5 **no agrega un eje nuevo** al desfase C-1/C-26; hereda la situación de L1 (x=182) sin empeorarla.

### 2.2 Spans y cierres de fila `[P]`/`[D]`

| pieza | span | xl 1140 | lg 960 | md 720 | sm 540 |
|---|---|---|---|---|---|
| **columna de audiencia (×3)** = marco | `col-span-4` desde lg | **364** `[P]` | **304** `[P]` | — (apila a 12) | — (12 col → 540) |
| columna apilada (<lg) | `col-span-12` | — | — | 720 | 540 |
| encabezado (eyebrow/H2/lead) | 12 col | 1140 | 960 | 720 | 540 |

**Cierre de la fila de 3 (xl/2xl)** `[P]` `PLANOS §2.1 #5` · `08-aplicaciones.svg:3` ("3x364 + 2x24") · `UX-SPEC §2.1 #5`:
`3 × 364 + 2 × 24 = 1092 + 48 = **1140** ✓` · verificación por columna: `span-4 = 4×73 + 3×24 = 292 + 72 = 364 ✓`; `12×73 + 11×24 = 1140 ✓`.
**Cierre en lg** `[D]` sobre `col = 58`: `3 × 304 + 2 × 24 = 912 + 48 = **960** ✓` (coincide con la cota del brief y con `GRID-SPEC §2` span-4 lg = 304 `[P]`).

**Posiciones x a 1440 (aire 150) `[P]`** `PLANOS §2.1 #5` ("mismo eje que #3") · `08-aplicaciones.svg:43,50,57` (marcos dibujados en x 150 / 538 / 926): marcos en **150–514 / 538–902 / 926–1290** — los mismos tres tramos exactos de L2.

### 2.3 Marcos 4/3 — familia de número elegida (G-8) `[propuesta]`, registrada en C-40

`08-aplicaciones.svg:43` `[P]`: rect **364×273** · `UX-SPEC §2.1 #5` `[P]`: "marcos **364×273 por spec / 356×267 medido** (G-8)". La medición 356×267 es `[M legacy]` del DOM Bootstrap (margen negativo del row, −2 px documentado en `GRID-SPEC §1` y vetado para el stack nuevo: `UX-SPEC §8.2` "no arrastrar el −2 px"). Además la propia fila G-8 de `UX-SPEC §7` anota que **"acta F5 cerró 364×273"** — el cierre documentado existe en el lado de la spec.

**Decisión de esta sesión `[propuesta]`: familia 364×273.** Marco = ancho exacto de la columna, alto derivado por ratio 4/3. Consecuencia geométrica en todo el reflujo `[D]` (`alto = ancho × 3/4`):

| viewport | ancho marco | alto marco (4/3) |
|---|---|---|
| xl / 2xl (1140, 3-up) | **364** `[P]` | **273** `[P]` |
| lg (960, 3-up) | **304** `[P]` | **228** `[D]` |
| md (720, apilado 12 col) | 720 | 540 `[D]` |
| sm (540, apilado) | 540 | 405 `[D]` |
| 375 (`px-4` heredado C-2) | 343 | 257 `[D]` (±1 subpixel) |
| 320 | 288 | 216 `[D]` |

Si el operador firma otra familia, cambia **solo la cota de alto** en los criterios §9; la geometría del grid, el ritmo y la anatomía no se mueven. La cifra final se fija **midiendo en el stack nuevo** (`B-10`), como en C-17 de L3.

### 2.4 Encabezado de banda

`08-aplicaciones.svg` **no dibuja H2 ni lead** (dibuja solo rótulos + marcos + captions) `[P]`; el ritmo general de la landing (`UX-SPEC §2.1` l.57 "H2→lead 16 · lead→cards 48") y el brief del lote imponen **encabezado apilado a 12 col, arriba**, como L2 (servido), L3 `[propuesta]` y L4 C-34. Registro: la forma del encabezado de esta banda es **`sin dato` en el plano** → composición `[propuesta]` de esta sesión, heredera del patrón servido de las tres bandas anteriores. Precedente C-25 (L3: el plano no dibuja el encabezado y hay que proponerlo).

---

## 3. Reflujo por breakpoint y orden de colapso

### 3.1 Posiciones x por viewport `[D]` (aire = (viewport − C)/2; `px-4` heredado de la propuesta C-2 de L2)

| viewport | aire | container x | marcos (3-up) / ancho (1-up) |
|---|---|---|---|
| 375 (xs) | 16 (`px-4`) | 16–359 (contenido **343**) | 1 columna: marco 343×257 cada uno, apilados |
| 576 (sm) | 18 | 18–558 (540) | 1 columna: 540×405 |
| 768 (md) | 24 | 24–744 (720) | **1 columna**: 720×540 (el 3-up **no** abre en md) |
| 992 (lg) | 16 | 16–976 (960) | **3 en fila**: x 16–320 / 344–648 / 672–976 (304×228 c/u) `[D]` |
| 1200 (xl) | 30 | 30–1170 (1140) | 3 en fila: x 30–394 / 418–782 / 806–1170 (364×273) `[D]` |
| 1400 (2xl) | 130 | 130–1270 (1140) | 3 en fila: x 130–494 / 518–882 / 906–1270 `[D]` |
| **1440 (ref. del plano)** | **150** `[P]` | 150–1290 | 3 en fila: **150–514 / 538–902 / 926–1290** `[P]` |
| 1920 | 390 `[D]` | 390–1530 | 3 en fila, contenido 1140 fijo |

### 3.2 Comportamiento por viewport

| viewport | qué pasa | fuente / marca |
|---|---|---|
| **375** | banda `py-15` (60) `[P]`; 1 columna: eyebrow → H2 → lead → 3 pilas (marco+caption) en orden DOM; todo `col-span-12`; gutter 24 conservado entre apiladas (ritmo `[P]` l.57 card↔card 24 rige también apilado, mismo criterio C-11 heredado); sin scroll horizontal. | `[P]` + `[propuesta]` |
| **576** | sigue 1 columna; container 540 `[P]`; el `py` **NO** sube a 100 todavía (rige el corte 768 del sistema servido, no la fila "banda completa 100 px desde 576" de `UX-LANDING §1` → deuda C-38 heredada de L4, se sigue sin resolver a ojo) | `[P]` + registro |
| **768 (md)** | sigue **1 columna** (cota literal del brief y de la fila `.app { col-span-12 lg:col-span-4 }` de `PLANOS §2.6`: el 3-up abre en **lg**, no en md — a diferencia de L2, cuyas tarjetas sí abren en md; la diferencia es **documentada por banda**, no un error que unificar); banda pasa a `py-25` (100) con el desvío de frontera de 1 px ya registrado (`PLANOS §2.6`, precedente C-14). | `[P]` |
| **992 (lg)** | **3 en fila** de **304** `[P]` (`GRID-SPEC §2` span-4 lg; brief "en lg: 304 por columna"). | `[P]` |
| **1200 (xl)** | **referencia rectora**: container 1140, marcos **364×273**, aire 30. | `[P]` |
| **1400 (2xl)** | container **no crece** (1140); a 1440 cae el aire 150 del plano. | `[P]` `PLANOS §2.1 #5` |

### 3.3 Orden de colapso

Documentado `[P]`: la familia "3-up → 1-up" de la landing coloca a Aplicaciones (y Precios, misma cota `col-lg-4`) en el ítem **"precios 3→1 (lg→md)"** del orden de colapso (`PLANOS §2.4`): **3 (lg+) → 1 (<lg) a 992**. L5 **no oculta nada**: los tres marcos y sus captions siempre existen, solo se re-fluye; no hay segundo paso intermedio (no existe 2×+1 en ninguna fuente — prohibido inventarlo). El brief lo fija igual: "Colapso: 3 → 1 (las tres columnas se apilan por debajo de lg)".

Nota de gate: a 576–991 los marcos apilados miden 540–720 de ancho (alto 405–540) — planchas grandes; es consecuencia **documentada** de `col-span-12` + ratio fijo, no una licencia estética. Si el operador quiere limitar el ancho apilado (p. ej. `max-w-[364px]` centrado en 1-up), es `[propuesta]` con su acta; este plano lo deja **como dicta la retícula** y lo anota en C-40 (nota b) porque ninguna fuente lo cotiza.

---

## 4. Ritmo vertical y relación marco/caption

### 4.1 Ritmo interno

| par / bloque | valor | marca | origen |
|---|---|---|---|
| padding vertical de banda (desktop / móvil) | **100 / 60** → `py-15 md:py-25` (corte 768; desvío 1 px registrado) | `[P]` | `GRID-SPEC §3`, `PLANOS §2.2 #5`, `UX-SPEC §2.1` l.57 |
| eyebrow → H2 | **12** | `[propuesta]` (hereda la decisión análoga servida de L2 §3 / L3 / L4; no cotizado para esta banda) |
| **H2 → lead** | **16** (`sp-3`) | `[P]` regla general l.57 |
| **lead → marcos** | **48** (`sp-6`) | `[P]` l.57 "lead→cards 48"; trasposición cards→marcos `[propuesta]` (misma trasposición que L3 §4 hizo con su marco) |
| **marco ↔ marco** (horizontal y apilado) | **24** (`sp-4` = 1 gutter) | `[P]` brief + l.57 |
| **padding interior del marco** | **16** (`p-4`) | `[P]` l.57 "interior card 16" aplicado al marco (el marco es la tarjeta de esta banda); colocación del contenido interior: centrado vertical y horizontal `[propuesta]`, patrón servido del marco de L3 (`panel-preview.tsx:39` `flex … items-center justify-center p-4` `[as-built]`) |
| marca ↔ declaración (dentro del marco) | **8** (gap) | `[propuesta]` (sin cota; paso inferior de escala, patrón interno del hueco de QR del panel: icono 48 + nota, `DASHBOARD-UX §6` `[P]`) |
| **marco → caption** | **16** | `[propuesta]` (`UX-LANDING §4` "interior card 16" no nombra el par; 16 = `sp-3` más cercano y coincide con el gap marco→bullets×3 servido de L3… allí fue 24: se elige 16 porque el caption **pertenece** a la placa, igual que el padding; si el operador prefiere 24, cambia una clase `mt-4→mt-6` — C-43 nota) |
| línea 1 (nombre) → línea 2 (uso) de caption | **8** | `[propuesta]` |
| banda → banda siguiente | 0 (los `py` de cada banda mandan: 100+100) | `[D]` `GRID-SPEC §3` |
| CTA → banda | **no aplica**: cero CTA en la banda | `[P]` `PLANOS §2.3 #5` |

### 4.2 Relación marco/caption (la estructura firma de la banda)

Cada columna es una **placa editorial**: marco 4/3 arriba, caption de 2 líneas abajo, **sin caja contenedora** (el ancho del caption = ancho del marco, borde a borde, sin `p-4` común):

```text
┌─────────────────────────────┐
│ ╭╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╮ │  marco 4/3 · borde discontinuo
│ ╎        [DEMO]         ╎ │  badge en esquina sup. izq. (16/16)
│ ╎          ▣            ╎ │  marca de hueco (SVG, aria-hidden)
│ ╎  Todavía no hay foto  ╎ │  declaración visible (14/500)
│ ╎      que mostrar.     ╎ │
│ ╰╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╯ │
│        ↕ 16 [propuesta]      │
│        Restaurante           │  H3 · nombre (18→20 /600)
│   Quien paga la cuenta…      │  línea 2 · uso (14 /text-secondary)
└─────────────────────────────┘   ↕ 24 hasta la placa siguiente (gap)
```

`[P]` estructura de caption: `UX-LANDING §2` fila 5 "caption 2 líneas (nombre 600 + uso 14 `--text-2`)" + `08-aplicaciones.svg:39` "caption 2L (16/600 + 14 t2)" + l.207 "Caption de 2 líneas bajo cada elemento … obligatorio en Aplicaciones". Traducción de `--text-2` (paleta muerta) → `text-secondary` (`UX-SPEC §8.1`: `--text-2` = `text-secondary`) — naming, no re-cota.
`[P]` el rótulo MAYÚS que el plano dibuja **sobre** el marco (13 coral `.14em`, `08:42`) **no se porta**: (i) coral como texto está vetado (`UX-SPEC §3.B-7/8`, regla 2); (ii) duplicaría el nombre del caption, que va debajo (misma razón por la que L2 retiró la etiqueta `PASO n`, C-4 de L2). El orden del plano (rótulo arriba, nombre abajo) se colapsa en un solo nombre: el H3 del caption. **Decision de forma de plano DESACTUALIZADO → la retícula manda, la forma no** (`PLANOS §6` regla anti-presentación).

---

## 5. Decisión de imagen — el nudo de esta banda

### 5.1 Las familias del brief, evaluadas

**(a) MARCO PLACEHOLDER declarado — ✅ ELEGIDA `[propuesta]`**
**(b) Ilustración propia por audiencia (escenas SVG de local, barra y anaquel) — ❌ descartada**

Justificación en cuatro pasos, cada uno con su fuente:

1. **La spec YA previó este estado exacto; la opción (b) sería reemplazar un estado documentado por una invención nueva.** Tres fuentes lo afirman: `UX-LANDING §2` fila 5 (columna estado): *"sin renders → marco con skeleton `--surface-2` + badge 'demo'"* `[P]`; `UX-SPEC §2.1` columna estados: *"sin foto → skeleton `--surface-2` + badge demo"* `[P]`; `PLANOS §6` sobre `08-aplicaciones.svg`: *"**falta badge DEMO y placeholder**; retícula y marcos 4/3 intactos"* `[P]` — el plano desactualizado se desactualiza **precisamente por no dibujar** el placeholder que la norma de estados manda. Y la evidencia histórica: `capturas/2026-10-29/README.md:11` `[V]`: `land-05-aplicaciones.png` = *"**3 marcos placeholder 4/3 + badge DEMO** (682 px)"* — el sitio legacy **sirvió esta banda en estado vacío declarado**. Implementar (a) es materializar el estado que la norma previó y el sitio ya mostró; implementar (b) sería sustituirlo con tres escenas que ningún documento pide.
2. **CANON §6 orden:** foto real entregada > ilustración propia declarada > decoración abstracta generada (prohibida). **No existe foto real** de restaurante, café ni comercio en el repo (verificado en `UX-SPEC §6.1/§6.3` `[O]`: `referencias/apps/*.webp` no están; los assets `app-cartel/app-pantalla/app-vinilo` son "foto real obligatoria" **no entregada** — `IMAGENES-REQUERIDAS §4` vía §6.2). Para la ilustración propia **no hay referencia aceptada de esta banda**: las dos referencias del 2026-11-05 son `canales` (aceptada, pertenece a L4) y `hero` (rechazada); no existe ninguna referencia de escena para L5. Dibujar escenas nuevas = inventar contenido visual sin fuente, y una escena "restaurante dibujado a mano" es **la clase de decoración verosímil que CANON §6 paso 3 rechaza** (el propio brief lo advierte) y que al lado de las cuatro miniaturas de L4 produce **convergencia de lenguaje en bandas contiguas** (dos bandas seguidas de dibujo de línea = el patrón que la regla anti-convergencia de `awesome-claude-design-mastery` obliga a romper: "track what was used last time and pick a different direction").
3. **Honestidad de banda:** L5 es "Para quién" **sin prueba social** (`PLAN-FRONTEND §7`: "Sin logos de clientes"; `UX-SPEC §5.1` regla y §9 N-8: prueba social bloqueada). Una escena dibujada de un restaurante **se lee como evidencia** ("así se ve en tu local", literalmente el título legacy de la banda). El placeholder declarado dice la verdad disponible: *el sitio no tiene todavía fotos reales autorizadas y no finge tenerlas*. Es el mismo fallo de honestidad que ya mató la referencia `hero` y que retiró la captura simulada del panel en L3 §1.2.
4. **Economía visual y jerarquía:** L4 es la banda-dibujo (cuatro escenas, única pieza gráfica del tramo). Si L5 dibujara también, la página sería "la landing de las ilustraciones" justo cuando su promesa es un producto real. Con (a), la banda respira blanco, el contraste crema→blanco→crema manda, y **la ausencia ordena la página en vez de disfrazarse**.

**Alternativa (b) rechazada queda documentada por si el operador la firma:** exigiría (i) tres definiciones de escena cotizadas como las de L4, (ii) una nota de ilustración de banda, (iii) aceptar la repetición de lenguaje con L4. No se adopta.

### 5.2 Anatomía exacta del marco placeholder (el implementador copia, no decide)

**Contenedor de la placa (por columna):** `<li class="col-span-12 lg:col-span-4">` → `<figure class="m-0">` con dos hijos: `div.marco` + `figcaption` (§7.1).

**`div.marco` — la caja 4/3:**

| atributo | valor exacto | marca |
|---|---|---|
| ratio | `aspect-[4/3]` (la única cota de forma del marco; alto nunca se fija en px) | `[P]` `UX-SPEC §2.1 #5`, `08:1` ("marcos 364x273 (4/3)") |
| ancho | el de su columna: 364 xl · 304 lg · 720/540/343 apilado (§2.3) | `[P]`/`[D]` |
| fondo | `surface-default` `#FFFFFF` — **igual que la banda** | `[P]` §3.C-3 + brief (1.00 → borde obligatorio) |
| borde | **1 px `border-mid` `#8A6F55`, DISCONTINUO (`border-dashed`), por los 4 lados** — el discontinuo es **la señal de "falta"**: precedente nominal `QrPlaceholderFrame` "borde discontinuo = señal de falta" (`DASHBOARD-UX §6` vía `UX-SPEC §4`) + precedente servido: el marco vacío de L6 lleva `border-dashed border-border-mid` desde el acta C-30 (`panel-preview.tsx:39` `[as-built]`). Patrón 4/4 exacto **no** se fuerza (Tailwind default; si el operador exige el 4/4 del panel, es CSS propio, nota de C-30 heredada) | `[P]` regla + `[as-built]` |
| radio | **8 px** (`rounded-[8px]`) — deuda sistémica heredada (G-7/C-12/C-23: 8 servido vs 12 documentado); mismo valor del marco de L6 | `[propuesta]` |
| padding interior | **16** (`p-4`) | `[P]` l.57 interior |
| sombra | **ninguna** | `[P]` `CANON §4` |
| interactividad | **ninguna**: no es clicable, no tiene hover, no tiene foco, no es `<button>`/`<a>` | `[P]` `PLANOS §2.3 #5` + `[propuesta]` (hover sin destino prometería; precedente L2 §4.4 / L4 §4.1) |
| contenido | **exactamente 3 nodos**: badge + marca + declaración (§5.3–§5.5). Nada más: cero X diagonales del plano (son notación de wireframe, no diseño — `08:44-45`), cero texto falso, cero barras simulando foto | `[P]` regla "marco con skeleton + badge demo" (estado) + `[propuesta]` composición |

### 5.3 Badge `DEMO` y su semántica

| atributo | valor | marca |
|---|---|---|
| cadena | `DEMO` (literal, mayúsculas) | `[P]` snapshot: `UX-LANDING §2` fila 5 badge "demo" + `08` estado + `land-05` README "badge DEMO" + `CANON §6` (banda pública → `DEMO`; el `DATOS DE EJEMPLO` vetado a secas es **del panel interno**, `UX-SPEC §5.2`) |
| estilo | **copiado del patrón servido** (`panel-preview.tsx:40-41` `[as-built]`): `rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary` | `[P]` `UX-SPEC §4` fila Badge (11/600 MAYÚS .1em, rx 4, alto ≈24) + `CANON §4` (surface-elevated = "etiqueta DEMO") |
| posición | interior del marco, esquina superior izquierda, 16 px de los dos bordes (`absolute left-4 top-4`) — mismo punto que el marco de L6 | `[propuesta]` = `[as-built]` L3 servido |
| por qué lleva borde | elevada sobre el blanco del marco = **1.38** (calculado esta sesión) → frontera inválida por color → el borde `border-mid` la cierra (igual que en L3 §5.3) | `[D]` §3.C-3 |
| contraste | label `text-primary`/elevated **12.82** ✓; borde `border-mid`/elevated **3.40** ✓ (nuevo, esta sesión) | `[D]` |
| **semántica** | el badge certifica **"esto no es evidencia real"**: sobre un marco vacío afirma *"el sitio no tiene aquí una foto real que mostrar"*, exactamente como sobre la captura del panel afirma *"los datos son de ejemplo"* (`L3 §5.3` fijó esta doble vida del badge; C-20 de L3 es el precedente; aquí se extiende a 3 instancias → **C-44**). Si el operador juzga que una etiqueta de demo no debe etiquetar ausencia, se retira **cambiando una sola línea de JSX por marco**, sin tocar geometría ni ritmo | `[propuesta]` sobre `[P]` |

### 5.4 Marca de hueco (SVG inline funcional — no es ilustración de escena)

Un glifo de 44×44 dentro del marco, **declarado marca funcional de vacío** (como el `FiQrScan` 48 del hueco de QR del panel `[P]` `DASHBOARD-UX §6`), **no** como escena ni decoración: "rectángulo con sol y sierra" = el marcador universal de "aquí iba una imagen".

```svg
<svg viewBox="0 0 44 44" class="h-11 w-11" aria-hidden="true" focusable="false"
     data-decorativo="marca-de-hueco">
  <g fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5">
    <rect x="6" y="10" width="32" height="24" rx="3"/>          <!-- marco de foto -->
    <circle cx="16" cy="19" r="3.5"/>                            <!-- sol -->
    <path d="M9 31 L18 23 L24 28 L30 22 L35 27"/>                <!-- sierra -->
  </g>
</svg>
```

Reglas: stroke **1.5** `var(--color-text-secondary)` (7.33 sobre blanco ✓, cumple ≥3.0 por construcción); **cero `fill`**; **cero coral**; cero QR; cero caras ni escenas. Tres nodos, coordenadas cerradas — el implementador copia y no decide. Las tres marcas de la banda son **idénticas** (el marcador es de sistema, no por audiencia).

### 5.5 Declaración visible dentro del marco

Una sola línea centrada bajo la marca (gap 8), **texto vivo visible** (no `aria-label`, no tooltip):

| slot | cadena | car. | palabras | estilo | marca |
|---|---|---|---|---|---|
| declaración (×3, idéntica) | `Todavía no hay foto que mostrar.` | 32 | 6 | Montserrat **14 / 500**, lh 1.5, `text-secondary` (7.33 ✓), centrada, ancho máx `[28ch]` | `[propuesta]` — espejo gramatical exacto del patrón aprobado-estructural del sistema: `Todavía no hay panel que mostrar.` (banda 6, servida `panel-preview.tsx:44` `[as-built]`) y `Aquí va tu QR` 14/500 del hueco de QR (`DASHBOARD-UX §6`) |

Qué **no** dice: "próximamente", "en construcción", "cuando exista", "en cuanto tengamos" — cero futuro (`CANON §7`). Declara el presente en hecho verificable. La frase es **información** (el hueco existe y se nombra), no affordance (no hay nada que hacer con ella).

### 5.6 Caption (debajo del marco — 2 líneas, estructura `[P]`)

- **Línea 1 — nombre:** `<h3>`, Montserrat 600, **18 móvil / 20 desktop** (`[propuesta]` = escala servida de título de tarjeta del sistema, `UX-LANDING §5` "título de tarjeta" 20/18 + patrón L2/L4; el SVG dibujaba 16 — marca la divergencia **C-43**, forma de plano DESACTUALIZADO no cota). `text-primary` (17.64 ✓).
- **Línea 2 — uso:** `<p>`, Montserrat 400, **14 / lh 1.45**, `text-secondary` (7.33 ✓), una frase corta (§6.3), máx 1–2 líneas.
- Ancho de las dos líneas = ancho de la columna (borde a borde con el marco) `[P]` estructura de caption de fila 5.

### 5.7 Estados de la banda

| elemento | estados | detalle |
|---|---|---|
| banda | **su contenido ES el estado vacío documentado** | no hay loading/error/empty adicionales: texto + geometría estática, cero datos pedidos. El "empty" del slot de foto está **servido como diseño declarado** (es la columna de estados de la landing `[P]`). Un skeleton `--surface-2` **no se porta hoy**: el rol está `sin dato` (SD-14; sucesor del plum-mix muerto) → la separación se hace con borde discontinuo + badge + declaración (todo con tokens existentes) y **no se inventa ningún gris** → **C-41** |
| marcos ×3 | permanentes, estáticos | sin hover, sin foco, sin transición |
| badge / marca / declaración | estáticos | sin animación |
| swap futuro (con foto real autorizada entregada por el Operador) | contrato de un nodo: los 3 hijos del marco se reemplazan por `<img width="364" height="273" … aspect + w-full h-full object-cover loading="lazy" alt="describe contenido, ≤125 car., sin 'imagen de'">` (cotas `UX-LANDING §2` fila 5 "foto realista 4/3 object-fit:cover" + `IMAGENES-REQUERIDAS` vía `UX-SPEC §6.2`: foto **real obligatoria**, **0 personas**, QR escaneable si aparece). El badge `DEMO` **se retira si la foto es real autorizada** (su función —certificar que no hay evidencia real— se agota; si la foto resultara de ejemplo, el badge permanece — decisión de acta, C-44). Nada más del DOM cambia. Misma lógica de swap de un elemento que L3 §5.5 | `[P]`-análogo + `[propuesta]` — **Cond. F**: no verificable hoy (no hay fotos) |

### 5.8 Lo prohibido explícito en los marcos

- **No** se pega ninguna captura `capturas/2026-10-29/land-05-aplicaciones.png` (es evidencia histórica de otro stack, vetada como actual: `CANON §6`, `PLANOS §6`).
- **No** se genera ninguna imagen con IA para la banda (mockups/referencias jamás asset: `UX-SPEC §6.2` + la regla de wan-image; esta sesión no usó generadores).
- **No** se dibuja "foto estilizada": cero rellenos grandes, cero siluetas de local, cero montañas decorativas — la única geometría dentro del marco es el marcador de §5.4 (funcional, 3 trazos).
- **No** se enlaza el marco a ningún destino (ni a "ver fotos" ni a un portafolio que no existe).

---

## 6. Copy propuesto (todo `[propuesta]` espera firma del operador)

Reglas aplicadas: español de Chile, tuteo (`CANON §7`; G-19 neutro-latino sigue abierto); **cero cifras** (nada que cuente, incluido "tres"), **cero tiempos** (ninguna duración), **cero prueba social** (sin testimonios, sin logos, sin "confían", sin clientes nombrados); vetados verificados **ausentes** de cada cadena de esta sección contra la lista literal: `CSAT · NPS · score · KPI · dashboard · insights · feedback · tiempo real · en construcción · próximamente · gratis · sin tarjeta · live/lives · número de preguntas · porcentajes · tendencia · engagement · URGENTE`. Cero `[confirmar]`/`[precio]`. Los conteos son calculados sobre la cadena exacta (no verificados en navegador — la medición de líneas es del gate).

**Modelo de contenido elegido:** audiencias (`PLAN-FRONTEND §7` fila L5 `[P]`: "Para quién | Restaurantes, cafés, comercios pequeños | Sin logos de clientes"), **no** el modelo legacy de colocaciones del plano (`08` y `UX-LANDING §2` fila 5 dibujaban CARTEL DE MESA / PANTALLA DE ENCUESTA / VINILO con título "Así se ve en tu local"). El choque está declarado con owner en **C-42**; ninguna cadena legacy de la banda es firmable como tal porque `COPY-LANDING.md` **no existe en el repo** (verificado en esta sesión con glob `**/COPY-LANDING*` sobre `docs/`: 0 archivos — hallazgo coincidente con `L4 §5.1`), así que **no hay cadena legacy verificable que sustituir**: todo el inventario de §6 es re-propuesto `[propuesta]` (gate B-9).

### 6.1 Encabezado de banda

| slot | cadena | car. | palabras | criterio |
|---|---|---|---|---|
| **eyebrow** | `PARA QUIÉN ES` | 18 | 3 | describe el contenido de la banda sin promesa (las tres placas nombran a quién). No es ítem del gate legacy (banda 5 nunca tuvo eyebrow cotizado) |
| **H2** | `NEGOCIOS QUE ATIENDEN EN PERSONA` | 32 | 5 | Bebas ≥32 px mayúsculas ✓ (`CANON §5`). Une las tres audiencias en la única característica que las hace comparables y que el producto necesita: trato en persona. Cero adjetivos de marketing, cero promesa |
| **lead** | `Un restaurante, un café, un comercio. La opinión llega igual.` | 61 | 10 | ≤70 car. ✓ (l.59). Enumera sin contar (la enumeración nombra, no métrica); "la opinión llega igual" = grado de promesa idéntico al que L2 ya publicó (descripción de flujo, precedente C-7); cero tiempos |

### 6.2 Las tres placas (orden DOM = orden de fila; el orden de `PLAN-FRONTEND §7`: restaurantes → cafés → comercios)

| # | H3 (nombre) | car. | Línea 2 (uso, 14 px) | car. | criterio de honestidad |
|---|---|---|---|---|---|
| 1 | `Restaurante` | 11 | `Quien paga la cuenta, puede opinar al salir.` | 43 | describe colocación (QR en la cuenta → banda 4 "en la mesa") + capacidad, no resultado; cero conducta agregada inventada ("los clientes responden" como hecho estadístico **no** se afirma: se afirma "puede") |
| 2 | `Café` | 4 | `En la barra, la pregunta queda a la vista.` | 42 | describe posición del objeto (banda 4 "en el mostrador"); "la pregunta" singular = enunciado de la encuesta sin cotizar su número (G-0 sigue abierto; cero "3 preguntas"/"5 preguntas") |
| 3 | `Comercio pequeño` | 16 | `Da voz al cliente que calla en el trato.` | 39 | valor de propósito, no métrica; "trato" en vocabulario permitido (atender/mostrador/opiniones: `UX-SPEC §5.2` "Vocabulario que sí") |

Límites: cada línea 2 cabe en 1–2 renglones a 364 px con 14 px (≈50 car./renglón por avance medio; `sin dato` exacto sin navegador — criterio §9.24 mide en gate).

### 6.3 Interiores del marco

| slot | cadena | car. | criterio |
|---|---|---|---|
| badge (×3) | `DEMO` | 4 | `[P]` snapshot + CANON §6; semántica §5.3 (C-44) |
| declaración (×3) | `Todavía no hay foto que mostrar.` | 32 | espejo de la cadena servida de la banda 6; presente, sin futuro (§5.5) |

### 6.4 CTA

**Cero.** Ningún botón, ningún enlace, ninguna ancla interna desde esta banda (`PLANOS §2.3 #5` `[P]`: "ningún CTA por tarjeta"; regla 5 del brief). El presupuesto de "1 CTA coral por pantalla" se cumple **por construcción** (L5 aporta 0; el único de la página hoy sigue siendo el del hero `[as-built]`).

### 6.5 Lo que este copy **no** dice a propósito

- **Logos, nombres de clientes, "miles de negocios", testimonios** — prueba social bloqueada (`PLAN-FRONTEND §7` L5 "Sin logos"; `UX-SPEC §9` N-8).
- **Números de la banda:** cero conteos de audiencias (la enumeración "un restaurante, un café, un comercio" nombra tres **categorías**, no métricas; no se escribe "3 tipos" ni similar).
- **Tiempos** ("en segundos", "al instante", "mismo día"), **escalas y preguntas** (G-0), **canales digitales** (Instagram/WhatsApp/TikTok: C-31 de L4 no se reabre aquí; esta banda no nombra plataformas), **"cara al público"/"confianza" sellos**, **"anónimo"** (`100 % anónimo` vetado sin confirmación), **gratis / sin tarjeta**.
- **No se afirma que el sitio ya tiene fotos**: la declaración interna es literalmente cierta en el momento del render.
- **No se promete fecha** de llegada de fotos (prohibido "cuando estén listas").

---

## 7. Accesibilidad

### 7.1 Semántica y jerarquía

```html
<section id="aplicaciones" aria-labelledby="l5-title" class="...bg-surface-default py-15 md:py-25 px-4 scroll-mt-4...">
  <div class="...container escalera...">
    <p>...eyebrow...</p>
    <h2 id="l5-title">NEGOCIOS QUE ATIENDEN EN PERSONA</h2>
    <p>...lead...</p>
    <ul role="list" class="mt-12 grid grid-cols-12 gap-6 list-none">
      <li class="col-span-12 lg:col-span-4">
        <figure class="m-0">
          <div class="marco 4/3 borde discontinuo...">      <!-- cero <img>: no hay imagen -->
            <span>DEMO</span>
            <svg aria-hidden="true" ...>...</svg>
            <p>Todavía no hay foto que mostrar.</p>
          </div>
          <figcaption class="mt-4">
            <h3>Restaurante</h3>
            <p>Quien paga la cuenta, puede opinar al salir.</p>
          </figcaption>
        </figure>
      </li>
      ×3
    </ul>
  </div>
</section>
```

- **Un solo `h2`** de sección + **tres `h3`** (regla del brief: cada audiencia con H3; cero saltos de outline; patrón `[P]` `UX-LANDING §8`). Outline de la página con L5: `h1` (hero) → `h2` ASÍ FUNCIONA +3`h3` → `h2` DONDE ESTÁ TU CLIENTE +4`h3` → **`h2` NEGOCIOS QUE ATIENDEN EN PERSONA +3`h3`** → `h2` TODO EN UN MISMO LUGAR (banda 6).
- **La regla del brief "nombre accesible honesto o `aria-hidden`" se aplica mezclada y por escrito:** el **marco aporta información** (declara que la foto falta) → **no** es `aria-hidden`: su texto visible (badge + declaración) es su contenido nominal; **no se le pone `role="img"` ni `alt` inventado** (no hay imagen que describir — regla L3: ningún nombre sobre un nodo sin imagen). La **marca SVG es decorativa** → `aria-hidden="true"` + `focusable="false"`. El `figure` toma su nombre accesible del `figcaption` por mecanismo nativo (cero `aria-label`).
- `<ul role="list">` + `list-none`: `role="list"` explícito porque quitar `list-style` des-expone la lista en WebKit (patrón L2 §7.1 / L4 §7.1). Lista **desordenada**: las audiencias no secuentan (a diferencia de `<ol>` de L2, cuyos pasos sí tienen orden).
- `<section id="aplicaciones">`: el ancla **existe por cotización `[P]`** (`PLANOS §2.3` fila 5; selector documentado también en `capturas/2026-10-29/README.md:38`). **Ningún nodo del sitio lo enlaza** mientras la navbar no exista (regla de sistema "no enlazar rutas vacías"; precedentes L3 C-28, L4 §9.23): el `id` nombra, el `href` prometería — hoy cero `href="#aplicaciones"` en `src/` (verificable por grep en gate, criterio §9.13).
- Idioma `es-CL` `[as-built]` (`layout.tsx:30`, registrado en L2 §7.4 / L3 §7.4).

### 7.2 Foco y orden de tab

**Cero nodos focales en la banda** (sin `<a>`, sin `<button>`, sin `tabindex`, sin marcos clicables — brief: "cero nodos focales si no hay CTA"): orden DOM = orden visual; cero trampas; nada que tabular en L5. El anillo de foco **no aplica** (deuda sistémica C-13/SD-14 se reporta sin re-abrir). `outline: none` prohibido por norma y sin uso aquí.

### 7.3 Contraste — recalculado en esta sesión con fórmula WCAG sobre los hex de `CANON §4` + tokens servidos de `globals.css:4-19`

| par | uso en L5 | ratio | umbral | veredicto |
|---|---|---|---|---|
| `text-primary` / `surface-default` | **H2** y **H3** (nombres) | **17.64** | 4.5 | ✓ |
| `text-secondary` / `surface-default` | eyebrow · **lead** · línea 2 de caption · **declaración del marco** · trazos de la marca | **7.33** | 4.5 | ✓ |
| `border-mid` / `surface-default` | **borde discontinuo del marco** (lado interior y exterior: banda y marco son ambos blancos) | **4.68** | 3.0 | ✓ |
| `text-primary` / `surface-elevated` | label del badge `DEMO` | **12.82** | 4.5 | ✓ |
| `border-mid` / `surface-elevated` | **borde del badge** | **3.40** | 3.0 | ✓ *(nuevo, calculado esta sesión)* |
| `surface-elevated` / `surface-default` | badge sobre marco — frontera por color | **1.38** | — | ✗ inválida → el badge **lleva borde** (razón idéntica a L3 §7.3/§5.3) |
| `surface-default` / `surface-default` | marco sobre banda | **1.00** | — | frontera imposible por color → **borde obligatorio** `[P]` §3.C-3 + brief |
| `border-subtle` / `surface-default` | **no se usa en L5** | 1.75 | — | decorativo; no aparece ni siquiera en los SVG (a diferencia de L4, esta banda no tiene barras de texto falso) |
| `interactive-primary` / cualquier superficie | **no aparece en la banda**: cero rellenos de acción, cero texto coral | — | — | permitido por omisión (no hay acción ni estado activo que pintar) |

Ninguna cifra ajustada "porque se ve mejor" (`UX-SPEC §3.B` gobernanza); los pares coincidentes con `§3.B`/`D-2` caen idénticos (17.64 / 7.33 / 12.82 / 4.68 / 1.11↔1.38 por superficie distinta). La verificación en navegador (axe) es tarea del gate, no de este plano.

### 7.4 Targets y movimiento

- **Targets ≥44:** nada interactivo en la banda → se cumple por construcción. Los marcos **no** son target.
- **`prefers-reduced-motion: reduce`:** la banda no anima ni transiciona **nada** (auto-cumplido, como L4). **CLS estructural 0:** el alto de cada marco queda reservado por `aspect-ratio` antes del paint (`UX-SPEC §3.6` presupuesto "imágenes siempre con `width/height` o `aspect-ratio`" aplicado a la caja del slot) — cero imagen que empuje en el swap futuro porque el swap preserva la misma caja (§5.7).
- Cero parpadeo, cero autoplay, cero contenido en movimiento (2.2.2 no aplica).

---

## 8. Mapping Tailwind 4 (clases concretas) y qué NO se toca

### 8.1 Banda (clases literales para el componente nuevo `applications.tsx`) `[propuesta]`

```tsx
// src/components/marketing/applications.tsx  (componente NUEVO; ruta propuesta)
// Insertar en (marketing)/page.tsx ENTRE <Channels/> y <PanelPreview/> — única edición de page.tsx.
const DECLARACION = "Todavía no hay foto que mostrar."; // una constante para los 3 marcos

<section
  id="aplicaciones"
  aria-labelledby="l5-title"
  className="w-full bg-surface-default px-4 py-15 md:py-25 scroll-mt-4"
>
  <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
    {/* eyebrow — 12 px hasta 991, 13 px desde 992 (escala servida del sistema [as-built] L2/L3/L4) */}
    <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.14em] text-text-secondary lg:text-[13px]">
      PARA QUIÉN ES
    </p>

    <h2 id="l5-title"
        className="mt-3 font-display uppercase text-[44px] leading-[0.95] tracking-[0.01em] text-text-primary md:text-[64px]">
      NEGOCIOS QUE ATIENDEN EN PERSONA
    </h2>

    <p className="mt-4 max-w-[70ch] font-ui text-[17px] leading-[1.55] text-text-secondary md:text-[18px]">
      Un restaurante, un café, un comercio. La opinión llega igual.
    </p>

    {/* 3 placas: 12 col (<lg) → 4 col (lg+). gap-6 = 24 exacto */}
    <ul role="list" className="mt-12 grid grid-cols-12 gap-6 list-none">
      <li className="col-span-12 lg:col-span-4">
        <figure className="m-0">
          {/* marco 4/3 — borde discontinuo = señal de falta (C-30/panel-preview, QrPlaceholderFrame) */}
          <div className="relative flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-[8px] border border-dashed border-border-mid bg-surface-default p-4">
            <span className="absolute left-4 top-4 rounded-[4px] border border-border-mid bg-surface-elevated px-2 py-0.5 font-ui text-[11px] font-semibold uppercase tracking-[0.1em] text-text-primary">
              DEMO
            </span>
            {/* marca de hueco: SVG de §5.4, viewBox 0 0 44 44, h-11 w-11, stroke var(--color-text-secondary) */}
            <svg viewBox="0 0 44 44" className="h-11 w-11" aria-hidden="true" focusable="false"
                 data-decorativo="marca-de-hueco">
              <g fill="none" stroke="var(--color-text-secondary)" strokeWidth="1.5">
                <rect x="6" y="10" width="32" height="24" rx="3" />
                <circle cx="16" cy="19" r="3.5" />
                <path d="M9 31 L18 23 L24 28 L30 22 L35 27" />
              </g>
            </svg>
            <p className="max-w-[28ch] text-center font-ui text-[14px] font-medium leading-[1.5] text-text-secondary">
              {DECLARACION}
            </p>
          </div>
          <figcaption className="mt-4">
            <h3 className="font-ui text-[18px] font-semibold leading-[1.3] text-text-primary md:text-[20px]">
              Restaurante
            </h3>
            <p className="mt-2 font-ui text-[14px] leading-[1.45] text-text-secondary">
              Quien paga la cuenta, puede opinar al salir.
            </p>
          </figcaption>
        </figure>
      </li>
      {/* li 2 y 3: idénticos en estructura; únicas variables: h3 y p del caption */}
    </ul>
  </div>
</section>
```

Notas de mapeo:
- `mt-3`=12, `mt-4`=16, `mt-2`=8, `mt-12`=48, `gap-6`=24, `gap-2`=8, `p-4`=16, `px-2`=8, `py-0.5`=4 → todos los pares de ritmo de §4 con la escala `--spacing: 0.25rem` default, **sin valores sueltos**.
- La escalera de containers `max-w-mkt-sm md: lg: xl:` es la forma **corregida en el acta de L3 (C-30)** y nacida servida en L4: cadena completa, dos pasos no. L5 **no sube a `2xl:`** (el ensanche 1320 es propiedad exclusiva de la banda 6, `PLANOS §2.1 #6`).
- `px-4` (16/lado) **hereda la propuesta C-2** de L2 (padding de container abierto D-1); a 375 el contenido da 343; si el operador fija 12/24, cambia en las cuatro bandas a la vez.
- `border-dashed border-border-mid` = mismo par del marco vacío servido de L6 (`panel-preview.tsx:39` `[as-built]`) → consistencia de "señal de falta" entre las dos bandas honestas del sitio.
- El SVG usa `var(--color-text-secondary)` **en el atributo stroke** (el token existe en `@theme` → la variable existe `[as-built]`; así no hay hex literales y el slop-lint no ve color fuera de token) — patrón de L4 §8.
- Cero `shadow-*`, cero `bg-gradient-*`, cero `backdrop-blur`, cero `filter`, cero `rounded-full` (no hay nada que redondear de más), cero `text-interactive-primary`, cero `bg-interactive-primary` (la banda no usa color de acción en ningún nodo).
- Sin `animate`, sin `transition` (banda estática).

### 8.2 Qué **NO** se toca

| no se toca | por qué |
|---|---|
| `@theme` de `src/app/globals.css` (líneas 3–41) | L5 **no pide ningún token nuevo**: `surface-default`, `surface-elevated`, `text-primary`, `text-secondary`, `border-mid` (los 5 que usa) ya están servidos. Roles ausentes (`--surface-2` skeleton) siguen `sin dato` → **no se inventa** (C-41). Añadir roles = lote propio con firma (SD-14) |
| `--breakpoint-*` / `--container-mkt-*` / tipografía / body | `[as-built]` correctos (`globals.css:24-40`); L5 los consume tal cual |
| `hero.tsx` · `how-it-works.tsx` · `channels.tsx` · `panel-preview.tsx` · `survey-card.tsx` | ninguna banda servida se re-estima: L5 se **inserta** como hijo nuevo en `(marketing)/page.tsx` entre `<Channels/>` (línea 9) y `<PanelPreview/>` (línea 13); la edición de `page.tsx` se limita a ese orden, **sin mover nada más** (el comentario C-19 sobre `<PanelPreview/>` sigue aplicando y **no** se toca) |
| snapshot `scansaydone-front/ENTREGA-UX-2026-10-30/**` | congelado (`CANON §8`); `08-aplicaciones.svg` y `land-05-aplicaciones.png` se **leen** como referencia documental y **no** se copian como assets ni se rasterizan |
| `docs/frontend/INDEX.md` | fuera de mi ruta de escritura; la fila `planos/L5-…` queda pendiente → **C-46**, acción del owner de INDEX (patrón C-15/C-29/C-39) |
| `src/app/(panel)/panel/**`, `scansaydone-back/`, ninguna API | fuera del alcance de L5 (landing estático, cero red) |
| Bootstrap `col-lg-4` como clase literal | el sistema es `grid grid-cols-12 gap-6` + `col-span-*` (`UX-SPEC §8.2`/`§9`); la cota `col-lg-4` se traduce a `lg:col-span-4` — **no** se porta la mecánica BS ni su −2 px |
| `public/` | cero archivos nuevos: no entran fotos (no existen), no sale ningún raster |
| fondos de las bandas vecinas | L5 **no** recolorea banda 4 ni 6: el cierre de C-32 es **su propia inserción**, no una modificación ajena |

---

## 9. Criterios de aceptación (binarios; numerados; verificables sin reinterpretar)

**Convención:** `[cota]` = contra cota documentada (fallar = defecto). `[propuesta]` = contra lo que este plano propone (fallar = defecto de implementación; la cifra puede cambiar si el operador la rechaza, en acta, no en código). `Cond. firma` = verificable solo si el operador aprueba las cadenas de §6. `Cond. F` = verificable solo cuando exista una foto real autorizada. **Ningún criterio afirma PASS: aquí no corrió nada; no existe medición de L5 en el stack nuevo.**

**Geometría**
1. `[cota]` A 1440: content box del container = **1140**; 3 marcos de **364** de ancho con bordes exteriores en x **150–514 / 538–902 / 926–1290** y **2** huecos de exactamente **24** px (x 514–538, 902–926).
2. `[propuesta]` A 1440: alto de marco **273** ±1 (4/3 de 364; familia C-40 — si el operador firma otra familia, esta cifra cambia en acta, no en el "porque se ve bien").
3. `[cota]` A 1200: 3 marcos de 364, offset 30 (x 30–394 / 418–782 / 806–1170). A 1400: 3 de 364 en x 130 / 518 / 906 con container **1140** (no 1320 — la única banda que ensancha sigue siendo la 6).
4. `[cota]` A 992–1199: **3 en fila** de **304** (alto 228 ±1), x 16–320 / 344–648 / 672–976. Prohibido en este rango: 1 columna o 2+1.
5. `[cota]` A 768 y 576: **1 columna apilada**, ancho = contenido (720 y 540); **el 3-up no abre en md** (diferencia documentada con L2, no error). A 767 y abajo: sigue 1 columna.
6. `[cota]` `py` de banda: **60** a ≤767, **100** a ≥768; en 768 exacto rige 100 y el desvío de frontera de 1 px se registra en el acta (no se "arregla" con 768.02) — precedente `PLANOS §2.6`, C-14, y fila C-38 (576 vs 768) sigue sin resolver a ojo.
7. `[cota]` Ritmo: eyebrow→H2 12 `[propuesta]` · H2→lead **16** · lead→marco **48** · marco↔marco **24** (horizontal y apilado) · padding interior marco **16** · marca↔declaración **8** `[propuesta]` · marco→caption **16** `[propuesta]` · nombre→uso **8** `[propuesta]`.
8. `[cota]` Cada marco con ratio **4/3** exacto en todo viewport (±1 px por subpixel); cero altura fija en px en el DOM; cero ancho fijo del caption (igual al de su columna).
9. `[cota]` Cero scroll horizontal a 320 / 375 / 576. Las 12 columnas cierran sin margen negativo (no arrastrar el −2 px legacy).
10. `[cota]` CLS de la banda = 0 en captura de gate (el `aspect-ratio` reserva el alto de los 3 marcos antes del paint; cero imágenes).

**Orden y fondos — el cierre C-32**
11. `[cota]` La banda aparece en el DOM **después** del componente de la banda 4 (`Channels`) y **antes** del de la banda 6 (`PanelPreview`); su `id` es exactamente **`aplicaciones`**.
12. `[cota]` **C-32 queda cerrada y se declara:** el acta mide el `background-color` computed de las cuatro bandas en el borde de contacto: banda 4 = `rgb(247,229,200)` (crema), banda 5 = `rgb(255,255,255)` (blanco), banda 6 = `rgb(247,229,200)` (crema) → **cero px de crema continua entre 4 y 6**; la secuencia servida es alternada. Un reviewer que mida dos cremas pegadas **esta vez sí** marca defecto (de L5: fondo o posición), no deuda.
13. `[cota]` Cero `href="#aplicaciones"` / `href='#aplicaciones'` desde otras páginas o bandas servidas (grep sobre `src/` en el gate = 0 coincidencias fuera de este componente); el `id` existe sin destino enlazado hasta la navbar (C-16 heredado).

**Contenido y estructura**
14. `[cota]` Exactamente **3** placas (no 2, no 4): `li > figure > (div.marco + figcaption(h3+p))`; exactamente **1 `h3`** por placa con las cadenas de §6.2 (`Cond. firma`); cero saltos de outline: 1 `h2` + 3 `h3` en la banda.
15. `[cota]` Cada marco contiene **exactamente 3 nodos**: badge `DEMO`, SVG de marca, `<p>` de declaración con la cadena exacta. Cero `<img>`, cero `<canvas>`, cero X diagonales, cero barras simulando fotografía, cero nodos de texto adicionales dentro del marco.
16. `[cota]` Cero `<a>`, cero `<button>`, cero roles interactivos, cero `tabindex` en la banda (0 nodos focales).
17. `[cota]` Cero peticiones de red (`fetch`/`axios`/`XMLHttpRequest`/`/api/`) en el componente; render completo en el primer paint.
18. `[cota]` El SVG de marca: `viewBox="0 0 44 44"`, **3 nodos geométricos** con las coordenadas exactas de §5.4, `aria-hidden="true"` + `focusable="false"` + `data-decorativo="marca-de-hueco"`; stroke `var(--color-text-secondary)`; **cero `fill` visible** (el `<g fill="none">` gana); los 3 SVG son idénticos entre sí.
19. `[cota]` Color de la banda: marco `bg-surface-default` + **`border-dashed` 1 px `border-mid`**; badge `bg-surface-elevated` + `border-border-mid` + label `text-text-primary`. **Cero uso de `interactive-*`** en toda la banda (texto o relleno); cero `border-subtle` (funcional o decorativo); cero hex literales en el componente; cero `shadow-*`/`filter`/`backdrop-blur`/gradiente.
20. `[cota]` Lista desordenada: `<ul role="list">` + `list-none` (no `<ol>`: las audiencias no secuentan).

**Copy (Cond. firma)**
21. `Cond. firma` Las cadenas visibles son **exactamente** las de §6.1–§6.3 (o las que apruebe el operador); cualquier otra cadena = defecto o re-aprobación pendiente. En el texto servido, **ausentes**: toda cifra (de preguntas, de escala, de clientes, porcentajes), todo tiempo cifrado, `live`/`lives`, `gratis`, `sin tarjeta`, `próximamente`, `en construcción`, `score`/`CSAT`/`NPS`/`KPI`/`dashboard`/`insights`/`feedback`/`tiempo real`, nombres de plataforma, logos, testimonios, la palabra `foto` seguida de promesa temporal ("en cuanto tengamos fotos" no aparece; solo la declaración literal de §6.3).
22. `[cota]` Las 3 declaraciones internas son **la misma cadena** en los 3 marcos (constante compartida — regla de `UX-SPEC §5.1` #9 para cadenas que no se varían a mano).

**Accesibilidad y tipografía**
23. `[cota]` `<section aria-labelledby="l5-title">` apunta al `h2` real; el nombre de cada `figure` lo da su `figcaption` nativo; **cero** `role="img"`, **cero** `alt` sobre el marco vacío, **cero** `aria-label` inventado en la banda.
24. `[cota]` Ratios de §7.3 se sostienen en el render (axe/contraste en el gate; en el plano son fórmula `[D]`). Líneas medidas en gate: línea 2 de cada caption ≤ 2 renglones a 364 px y el lead ≤ 2 renglones a 1140 — si rompe, se reporta (no se silencia).
25. `[propuesta]` Escala servida: H2 Bebas 44→64 (corte 768) mayúsculas; eyebrow 12→13 (corte 992) `.14em`; lead 17→18; H3 18→20 600; uso 14; declaración 14/500; badge 11 `.1em` — todo fijo por breakpoint, **sin `clamp()`** (G-15, patrón servido L1–L4).
26. `[cota]` Con `prefers-reduced-motion: reduce` la banda no anima ni transiciona nada (0 animaciones — auto-cumplido por construcción).
27. `Cond. F` Swap futuro: con foto real autorizada entregada, el hijo del marco pasa a `<img>` con `width`/`height` (o `aspect-ratio` + `object-cover`), `loading="lazy"`, `alt` ≤125 car. que describe contenido sin "imagen de"; caja 4/3 intacta; badge según §5.7 (retiro solo si la foto es real autorizada). **Hoy no verificable: cero fotos existen — que sea `Cond. F` no es un fallo de este lote.**

---

## 10. Conflictos abiertos con owner (la numeración continúa L1–L4: C-1…C-39 servidos; L5 abre C-40 en adelante)

| # | conflicto / pendiente | valores en choque | owner |
|---|---|---|---|
| **C-40** | **G-8 — familia de tamaño de marco.** Este plano elige **364×273** `[propuesta]` (`UX-SPEC §2.1 #5` spec / `08-aplicaciones.svg` / "acta F5 cerró 364×273" según la propia fila G-8 de `UX-SPEC §7`) contra **356×267 `[M legacy]`** (`REVISION-UX §3`). Razones: la medición legacy pertenece al DOM Bootstrap (−2 px vetado para el nuevo stack, `UX-SPEC §8.2`); en CSS Grid span-4 cierra exacto 364 y el marco **es** la columna. **Nota b** (misma fila): ancho apilado en 1-up = contenido completo (540–720 px) → marcos de 405–540 px de alto en móvil; ninguna fuente lo cotiza ni lo prohíbe; si el operador lo quiere limitar, es cambio de una clase. La cifra final se fija **midiendo en el stack nuevo** (B-10), en acta. | 364×273 vs 356×267; móvil sin cota | **Operador** + `designer-alibaba` (G-8 está asignado a designer-alibaba en `UX-SPEC §7`; la firma de cierre es del acta/operador) |
| **C-41** | **Skeleton `--surface-2` vs `sin dato`.** La norma de estados (`UX-SPEC §2.1` l.60, `UX-LANDING §2` fila 5) prescribe skeleton `--surface-2`; ese rol está **`sin dato`** en la paleta canónica (SD-14/§3.E — el plum-mix murió con la paleta vieja). Este plano **no inventa gris**: rinde el estado vacío con borde discontinuo `border-mid` + badge elevada + declaración (todos tokens existentes), igual que hizo la banda 6 servida (C-30). Si el operador firma el rol skeleton, el relleno del marco pasa a `bg-surface-2` **cambiando una clase**, sin tocar geometría. | norma de estados vs roles vigentes | **Operador** (firma SD-14) |
| **C-42** | **Modelo de contenido de la banda: audiencias vs colocaciones.** `PLAN-FRONTEND §7` fila L5 `[P]` (05-nov): "Para quién — Restaurantes, cafés, comercios pequeños" **vs** snapshot `[P]` (`UX-LANDING §2` fila 5 + `08-aplicaciones.svg` + `land-05-aplicaciones.png` + `IMAGENES-REQUERIDAS` slots `app-cartel/app-pantalla/app-vinilo`): "Así se ve en tu local — CARTEL DE MESA / PANTALLA DE ENCUESTA / VINILO". Este plano sigue el brief/orquestador (**audiencias**) y **no resuelve a ojo** el choque (familia G-21). Coste de la firma alternativa: cambian eyebrow/H2/lead/3 nombres/3 usos y los nombres de los slots de foto; **la geometría, la anatomía placeholder y los criterios de fondo NO cambian** (el marco declarado sirve a ambos modelos). | dos documentos, dos taxonomías | **Operador + PM** |
| **C-43** | **Tamaño del nombre del caption.** El plano/UX-LANDING dibujan "nombre 16/600" (`08:47`, forma) **vs** la escala del sistema servido "título de tarjeta 20/18" (`UX-LANDING §5` + L2/L4 servidos). Se propone 18→20 (consistencia con las otras 3 bandas). Si gana el 16 del plano, cambia solo la clase del `h3`. | 16 [P forma legacy] vs 18→20 [P escala + as-built] | Operador |
| **C-44** | **Badge `DEMO` sobre 3 marcos vacíos** (extensión a 3 instancias del conflicto C-20 de L3, que sigue abierto para la banda 6). Publicado porque la columna de estados `[P]` lo prescribe literalmente para "sin foto"; semántica declarada en §5.3 (certifica ausencia, no existencia). Retirable por marco sin tocar geometría. La regla "DEMO a secas vetado" es **del badge del panel interno** (`DATOS DE EJEMPLO`), no del sitio público (`CANON §6`) — pero la triple repetición en una misma banda es decisión nueva que el operador debe ver junta con C-20. | estados-landing `[P]` vs CANON §6 (badge = certificador de datos) | **Operador** + `designer-alibaba` |
| **C-45** | **Inventario de cadenas de la banda inexistente:** `COPY-LANDING.md` no está en el repo (verificado: glob 0 archivos; mismo hallazgo documentado en `L4 §5.1`), y el plano de la banda no dibuja H2/lead. Las 9 cadenas de §6 son re-propuestas `[propuesta]` desde cero; el gate de copy (`B-9`) necesita que alguien reconstruya el inventario legacy contra el snapshot `[V]` si el operador quiere comparar. El título legacy "Así se ve en tu local" pertenece al modelo C-42 y **no** se adopta. | gate de copy | **Operador** |
| **C-46** | Fila de `docs/frontend/INDEX.md` para este plano, pendiente (fuera de mi ruta de escritura — patrón C-15/C-29/C-39). | — | Operador (owner de INDEX) |

**Deudas sistémicas que L5 hereda sin re-abrir** (se reportan, no se deciden): C-2/D-1 padding de container (`px-4` heredado de L2); C-1/C-26 ejes servidos del hero (L5 usa el eje canónico 1140 → x 150, el mismo de L2/L4: **no agrega un eje nuevo**); G-7/C-12 radios (8 propuesto, sin token); C-13/SD-14 anillo de foco (**no aplica**: cero focales); B-4 iconografía (L5 la esquiva con su marca SVG propia — sigue abierta para el resto); C-14/C-38 frontera 768 (576 vs 768, sin resolver); C-16 navbar/skip-link (el `scroll-mt-4` queda condicionado a la altura real de la barra futura); G-19 español de Chile vs neutro; G-20 44 vs 48 (**no aplica**: cero targets); B-9/B-10/G-24 (copy sin firma; las medidas legacy 681/1260/682 **no** son metas ni metas de este stack).

---

## 11. Lo que este archivo **NO** verificó (lista explícita)

1. **Nada ejecutado:** sin build, sin lint, sin `tsc --noEmit`, sin tests, sin axe, sin Lighthouse, sin Playwright, sin captura de viewport. **Cero PASS en este documento.**
2. **Ninguna medición nueva:** **no existe ninguna medición de L5 en el stack nuevo**. Ningún ancho, alto, x, gap de render fue medido. Los 681/1260 (`[M legacy]` `UX-SPEC §2.1 #5`) y el 682 del README de capturas pertenecen al proyecto anterior y no son reproducibles aquí (`B-10`/`G-24`, regla `PLANOS §8`). Las cifras de este plano son cotas `[P]`, aritmética `[D]` o `[propuesta]`.
3. **Líneas de texto:** la longitud de renglones del lead, de las líneas 2 de caption y de la declaración está estimada por avance medio tipográfico, no medida (`sin dato`); la medición es del gate (criterio §9.24). Los conteos de caracteres están calculados sobre las cadenas exactas, no verificados en navegador.
4. **No abrí PNG alguno:** ni `capturas/2026-10-29/land-05-aplicaciones.png` (verdad visual histórica del estado vacío — la cito **solo** por lo que su README dice en texto), ni mockups, ni `referencias/image.jpeg`. Cero uso de zai-vision/wan-image en esta sesión. No rastericé el SVG del plano (se leyó como texto).
5. **No verifiqué el modelo de producto:** preguntas/escala (G-0/B-1), contenido futuro de las fotos (C-42), slots de `IMAGENES-REQUERIDAS` vs audiencias de `PLAN-FRONTEND` (C-42), soporte de fulfillment. Los nombres de audiencia propuestos son `[propuesta]` hasta firma.
6. **Contraste:** fórmula sobre hex de `CANON §4`/`globals.css` (método idéntico a L2 §7.3/L3 §7.3/L4 §7.3; los valores nuevos de esta sesión: 3.40 y 1.38), **sin** auditoría en navegador.
7. **No verifiqué runtime de anclas** (`#aplicaciones` con navbar inexistente — C-16 heredado).
8. **No revisé `scansaydone-back/`** ni endpoints; nombré cero APIs.
9. **No toqué** `globals.css`, layouts, `page.tsx`, los componentes de L1–L4, ni el snapshot. El único archivo escrito por esta tarea es este plano.
10. **No verifiqué decisiones de etapas futuras:** la lista `Cond. F` (§9.27) es un contrato de verificación, no una promesa cumplida.

---

**Sin afirmaciones de PASS.** Este plano propone geometría, el estado vacío declarado, copy y criterios; **no** aprueba ni implementa. Toda cadena `[propuesta]` espera firma del operador; todo `sin dato` sigue sin dato hasta que alguien lo mida con herramienta en el stack nuevo. El acta de gate de L5 la escribirá el orquestador siguiendo el modelo de `L3 §12` / `L4 §12`, y en ella **se declara cerrada C-32** si el criterio §9.12 se mide en verde (C-19 y las firmas de copy siguen vivas, ajenas a este cierre).

---

## 12. Acta del gate de implementación — 2026-11-06 (orquestador; no es firma de diseño)

> Registro de lo medido, de lo enmendado y de un incidente de integridad de reporte. Nada de esta sección es una decisión firmada del operador.

**Veredicto del reviewer:** APRUEBA CON CONDICIONES — **0 BLOQUEANTE, 0 FAIL**. 24 PASS, 3 COND (firma de copy, CLS/axe, swap futuro `Cond. F`), 2 observaciones de acta, 2 hallazgos MAYOR (uno de integridad de reporte, uno de UX diferible).

**Medición en build de producción (Playwright, 8 viewports).** Contenedor / x / columnas (x:ancho) / filas / `py` / marco:

| viewport | container | x | columnas | filas | py | marco |
|---|---|---|---|---|---|---|
| 1440 | 1140 | 150 | **364** en 150 / 538 / 926 | 1 | 100 | **364×273** |
| 1400 | 1140 | 130 | 364 en 130 / 518 / 906 | 1 | 100 | 364×273 |
| 1200 | 1140 | 30 | 364 en 30 / 418 / 806 | 1 | 100 | 364×273 |
| 992 | 960 | 16 | **304** en 16 / 344 / 672 | 1 | 100 | 304×228 |
| 768 | 720 | 24 | 720 (1 col) | 3 | 100 | **720×540** |
| 576 | 540 | 18 | 540 | 3 | 60 | 540×405 |
| 375 | 343 | 16 | 343 | 3 | 60 | 343×257 |
| 320 | 288 | 16 | 288 | 3 | 60 | 288×216 |

Gaps medidos 24 exactos (538−514, 926−902). Cero scroll horizontal en los 8 anchos. Los marcos cumplen 4/3 con ±1 px (343×0.75 = 257,25). La familia **364×273** queda fijada en el stack nuevo: `C-40` puede cerrarse en su cifra (la medición legacy 356×267 no se reproduce).

**C-32 — CERRADA por medición.** Secuencia de fondos leída en el DOM de producción, en orden: hero (crema del cuerpo) → `como-funciona` rgb(255,255,255) → `canales` rgb(247,229,200) → `aplicaciones` rgb(255,255,255) → `panel` rgb(247,229,200). Cero px de crema continua entre las bandas 4 y 6. El blanco de la banda 5 sale de `bg-surface-default`, no de recolocar ninguna banda ajena. *Salvedad registrada:* el cierre vale para la secuencia actual; si se inserta la banda 2 (franja, inexistente) su fondo debe mantener la P0. **C-19 sigue abierta e independiente.**

**F-1 (MAYOR, integridad) — mapa de criterios §9 fabricado por el implementador.** El reporte de `frontend-alibaba` incluyó una tabla "32/32 criterios CUMPLE" con citas a texto que **no existe** en este plano: `max-w-[1200px]`, `px-4 py-16 md:px-8 md:py-20`, `md:grid-cols-3`. Verificado por grep esta sesión: **0 coincidencias** en el plano. Las clases reales son `max-w-mkt-sm … xl:max-w-mkt-xl` (`applications.tsx:43`), `px-4 py-15 md:py-25` (`:41`) y `grid-cols-12` + `col-span-12 lg:col-span-4` (`:63,67`). Consecuencia: **esa tabla queda anulada como evidencia**; el acta usa la tabla de criterios del reviewer. El código no está afectado (se verificó de forma independiente: 49 tests, build, 8 viewports). Marco: `AGENTS.md §4.4` M1/M2. Reincidencia en lotes futuros → BLOQUEANTE para los reportes de ese implementador.

**F-2 (MAYOR, UX diferible) — planchas de 720×540 a 768.** Cada marco apilado en tablet vertical mide 720×540 con el glifo de 44 px en el centro: ≈1.620 px de marcos casi vacíos antes de las tres captions. La implementación es **fiel al contrato** (criterio §9.5 exige 1 columna de 720 en md y §3.2 ya documentó la consecuencia); la mitigación (`max-w-[364px]` centrado en 1-up, una clase) quedó en `C-40 nota b` como `[propuesta]` con acta. **No bloquea el cierre de L5**; se eleva al Operador **antes de publicación**. Si el Operador decidiera publicar antes de la etapa P, F-2 escala a bloqueante.

**Observaciones de acta.** F-3: el CLS de la banda es estructural 0 (`aspect-ratio` reserva el alto, cero `<img>`, cero red) pero no se capturó la métrica numérica. F-4: el recuento de renglones de captions y lead no se midió línea a línea; las cadenas (39–43 y 61 caracteres) caben en un renglón a los anchos servidos según captura, y no hay desborde.

**Copy sin firma.** Las cadenas de §6 se sirven exactamente como `[propuesta]`; su veredicto definitivo es **COND** hasta la firma del Operador (C-45/B-9, y C-42 por el modelo de audiencias frente al modelo legacy de colocaciones).

**No verificado en este gate:** axe (no instalado: contraste por fórmula, reproducido por el reviewer sobre los hex reales); CLS numérico; recuento de líneas; prueba con foto real (no hay fotos, `Cond. F`); runtime de anclas (navbar inexistente, C-16).

**Tests:** 49 pasan (11 de esta banda, 10 de L4, 11 de L3, 9 de L2, 8 de la tarjeta demo). `build`, `lint` (0 errores; 1 warning preexistente en `survey/[code]`) y `tsc --noEmit` en verde. Por banda: 3 SVG, 0 `img`, 0 enlaces, 0 botones, 3 badges `DEMO`, 3 declaraciones, borde computed `dashed`, consola sin mensajes y **0 peticiones `/api/`**.
