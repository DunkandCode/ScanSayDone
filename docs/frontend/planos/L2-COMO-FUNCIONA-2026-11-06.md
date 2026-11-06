# L2 — Landing "Cómo funciona": plano de banda 3

**Fecha:** 2026-11-06 · **Autor:** designer-alibaba (subagent) · **Estado:** **PROPOSED** — requiere aprobación del operador antes de implementar. Ninguna línea de este archivo es una decisión firmada.
**Ruta canónica:** `docs/frontend/planos/L2-COMO-FUNCIONA-2026-11-06.md` · **Precedente de formato:** `L1-HERO-2026-11-05.md`.
**Alcance:** solo frontend, banda 3 del landing (`/`). Cero llamadas a API, cero fetch, cero datos de red. No se toca `scansaydone-back/`. No se edita `scansaydone-front/ENTREGA-UX-2026-10-30/` (snapshot congelado, `CANON §8`).

**Qué es la fuente de cada número (clave de lectura, obligatoria al leer las tablas):**

| Marca | Significado |
|---|---|
| `[P]` | **cotado en el plano/documento**: valor impreso en `GRID-SPEC §1–§3`, `UX-LANDING §2/§4/§5`, `UX-SPEC §2.1 #3` o `PLANOS §2`. |
| `[D]` | **derivado por fórmula** sobre un container documentado (`col = (C−264)/12`, `span(n) = n×col + (n−1)×24`). Aritmética, no medición nueva. |
| `[M legacy]` | **medido en el stack anterior** (Bootstrap/Sass, `REVISION-UX §3`). Evidencia histórica: **no es cota del stack nuevo**. El nuevo stack no tiene ninguna medida de L2. |
| `[propuesta]` | propuesta de esta sesión, **sin efecto normativo**, espera firma del operador. |
| `sin dato` | no está documentado y no es derivable. Se nombra el archivo que debió contenerlo. |

**Skills cargadas (gate de diseño):** design-system-mastery, awesome-claude-design-mastery, frontend-design, landing-page-design, session-anchor-system, caveman-core.
**Regla de honestidad de este archivo:** no ejecuté build, lint, typecheck, tests, axe ni Playwright. **No hay ningún PASS aquí.** Las afirmaciones `[as-built]` provienen de lectura estática de archivos (se cita `archivo:línea`) o de reportes del orquestador — registrar no es aprobar.

---

## 0. Lock estético de la banda (antes de cualquier número)

- **Familia:** editorial cálido, dominante claro (heredada del lock de L1, `L1-HERO §0`) — no se redefine la identidad en L2.
- **Memorabilidad de la banda [propuesta]:** el número suelto en Bebas 40 dentro de un disco coral, con el conector de 2 px que **corta el aire entre tarjetas** en vez de rodearlas. Es el único gesto de "secuencia" de la página; no hay sombras, no hay gradientes, no hay íconos decorativos.
- **Elevación:** por **borde y color**, nunca por sombra difusa (`CANON §4`). En esta banda el fondo ya es blanco, así que la separación tarjeta↔banda la hace un borde 1 px.
- **Anti-convergencia:** L1 usó el offset sólido tipo letterpress (NO IMPLEMENTADO) y la tarjeta de encuesta como evidencia a la derecha. L2 no repite neither: aquí el dispositivo es una **fila de tres celdas iguales con un hilo que las une** — composición simétrica y horizontal, lo contrario del 7/5 asimétrico del hero. La trampa a evitar (la que delata un diseño genérico) es el trío de "feature cards" con ícono en círculo, título, dos líneas y sombra: aquí no hay ícono, hay número, y el número **no** va centrado sobre el título.
- **Prohibido en esta banda:** emoji como ícono, QR dibujado (aunque sea decorativo), capturas falsas del panel, cifras, tiempos, testimonios, logos, `box-shadow`, `filter: blur()`, gradientes, radio único global, Bebas en cuerpo o en botones (`CANON §4/§5/§6`, `UX-SPEC §9` N-5/N-7/N-8/N-14).

---

## 1. Grid: contenedor, spans, posiciones x por breakpoint

### 1.1 Contenedor y columna `[P]` (`GRID-SPEC §1`, `PLANOS §1.1`, portados en `globals.css:24-36`)

| bp | `min-width` | container L2 | `col = (C−264)/12` | gutter |
|---|---|---|---|---|
| xs | 0 | 100 % − 2·padding | (contenido−264)/12 — no aplica: apila a 12 | 24 |
| sm | 576 | `mkt-sm` 540 | **23** `[P]` | 24 `[P]` |
| md | 768 | `mkt-md` 720 | **38** `[P]` | 24 `[P]` |
| lg | 992 | `mkt-lg` 960 | **58** `[P]` | 24 `[P]` |
| xl | 1200 | `mkt-xl` **1140** (bp rector de la banda `[P]` `PLANOS §2.1 #3`) | **73** `[P]` | 24 `[P]` |
| 2xl | 1400 | sigue **1140** — L2 **no** usa el container de 1320 (lo usa solo la banda 6, `[P] PLANOS §2.1 #6`) | 73 `[D]` | 24 `[P]` |

### 1.2 Spans de la banda y cierre de fila

| pieza | span | xl 1140 | lg 960 | md 720 | sm 540 |
|---|---|---|---|---|---|
| tarjeta de paso (×3) | 4 col | **364** `[P]` | 304 `[P]` | 224 `[P]` | 164 `[P]` |
| H2 | 8 col | **752** `[P]` | 632 `[P]` | 472 `[P]` | 352 `[P]` |
| fantasma (CTA ghost) | 4 col | 364 `[P]` | 304 `[P]` | 224 `[P]` | 164 `[P]` |
| banda completa | 12 col | 1140 | 960 | 720 | 540 |

**Cierre de la fila de tarjetas** `[P]` `PLANOS §2.1 #3`: `364 + 24 + 364 + 24 + 364 = 1140` ✓ (verificado: 3·364 + 2·24 = 1092 + 48 = 1140).
**Cierre de la fila del encabezado** `[D]`: `752 + 24 + 364 = 1140` ✓ — coincide con el plano, que dibuja H2 en x 150–902 y ghost en x 926–1290 (`02-como-funciona.svg:40-43` `[P]`).

### 1.3 Posiciones x `[D]` sobre el plano de referencia (aire = `(viewport − C)/2`; el aire 150 del plano `[P]` sale de `C=1140`, viewport 1440)

| viewport | offset container | H2 (span-8) | tarjetas (span-4 ×3) | ghost (span-4) |
|---|---|---|---|---|
| 375 (xs, 1 columna) | 16 `[propuesta]` (ver §1.4) | contenido 343, full-width | 16–359, apiladas ×3 | full-width, intrinsic |
| 576 | 18 `[D]` | 18–370 (352) | 18–182 / 206–370 / 394–558 | no aplica (<xl, apilado) |
| 768 | 24 `[D]` | 24–496 (472) | 24–248 / 272–496 / 520–744 | apilado |
| 992 | 16 `[D]` | 16–648 (632) | 16–320 / 344–648 / 672–976 | apilado |
| 1200 | 30 `[D]` | **30–782 (752)** | **30–394 / 418–782 / 806–1170** | **806–1170 (364)** |
| 1400 | 130 `[D]` | 130–882 | 130–494 / 518–882 / 906–1270 | 906–1270 |
| 1440 (referencia del plano) | **150 `[P]`** | **150–902** | **150–514 / 538–902 / 926–1290** `[D]` `PLANOS §2.1 #3` | **926–1290** |

`[M legacy]` altura de banda medida en el stack anterior: **568 px desktop / 872 px móvil** (`UX-SPEC §2.1` fila 3, `PLANOS §2.2` fila 3, origen `REVISION-UX §3`). **No es cota nueva:** el stack nuevo no ha medido L2. El plano SVG dibujaba banda de 490 px y tarjetas de 300 (`02-como-funciona.svg:8,44`) — cifras del plano **DESACTUALIZADO**, que según `PLANOS §6` sirve "para la retícula (3×364), no para la forma". En consecuencia: **ninguna altura fija de tarjeta ni de banda se implementa** (§4.6).

### 1.4 Padding horizontal del container — elección `[propuesta]`, cota documentada **abierta**

`D-1` de `PLANOS §8` sigue abierto: `UX-LANDING §7` dice **12 px/lado**, `GRID-SPEC §1` dice `$container-padding-x = gutter (24)`. Aritmética decisiva `[D]`: para que el container documentado se **realice** al menos en el viewport de su breakpoint, el padding por lado debe ser ≤ `(bp − C)/2`:

| bp | `(bp − C)/2` | 12 ✓ | 16 ✓ | 24 ✓ | 32 ✓ |
|---|---|---|---|---|---|
| sm 576 / 540 | 18 | ✓ | ✓ | ✗ (528) | ✗ (512) |
| md 768 / 720 | 24 | ✓ | ✓ | ✓ (exacto) | ✗ (672) |
| lg 992 / 960 | **16** | ✓ | ✓ (exacto) | ✗ (912) | ✗ (896) |
| xl 1200 / 1140 | 30 | ✓ | ✓ | ✓ | ✗ (1136) |

**Propuesta: 16 px/lado (`px-4`) constante en la banda.** Razón: es el valor máximo que **no rompe ninguna cota** en ninguno de los cinco breakpoints (lg es el cuello de botella: 16 exacto), y es el que ya usa el hero servido en móvil (`hero.tsx:6`). Con `px-4` el contenido en 375 es **343** `[D]` — que además es el ancho de contenido móvil documentado en login y panel (`UX-SPEC §2.3`, `§2.4`).
**Conflicto registrado (C-2, owner Operador + `frontend-alibaba`):** ni 12 ni 24 son realizables en todos los bp con las cotas de `GRID-SPEC` intactas; 16 es derivación, no documento.

---

## 2. Reflujo por breakpoint y orden de colapso

| viewport | qué pasa | fuente / marca |
|---|---|---|
| **375** | banda `py-15` (60 px) `[P]`; **una columna**: H2 → ghost → lead → 3 tarjetas apiladas; todo `col-span-12`; contenido 343 `[D]` de `px-4` `[propuesta]`; gutter 24 se conserva entre tarjetas apiladas `[P]` (`UX-LANDING §4`) — ver **C-11**; sin scroll horizontal; fantasma de ancho intrínseco, no estirado. | `[P]` + `[propuesta]` |
| **576** | banda sube a **100 px solo desde 768** (no desde 576) — ver la nota de frontera §2.1; sigue 1 columna; container 540 `[P]`. | `[P] PLANOS §2.4` |
| **768 (md)** | **las 3 tarjetas pasan a lado a lado** (`col-span-4` = 224) `[P]` `UX-LANDING §7`; **el conector pasa a horizontal** (§5.4); la banda adopta `py-25` (100 px) `[P]`; el H2 **no** se pone lado-a-lado con el ghost todavía (§2.2). | `[P]` |
| **992 (lg)** | nada estructural para L2 (nav horizontal / canales 2×2 afectan a otras bandas); container 960 `[P]`. | `[P] PLANOS §2.4` |
| **1200 (xl)** | **referencia rectora**: container 1140, tarjetas 364 `[P]`, aire 150 al 1440 `[P]`; H2 8 col + ghost 4 col en la misma fila `[propuesta]` (ver §2.2). | `[P]` + `[propuesta]` |
| **1400 (2xl)** | el container **no crece** (L2 nunca usa el de 1320) `[P]`; el aire pasa a 130 y sigue 1140 de contenido; a 1920 el aire es 390 `[D]`. | `[P]` + `[D]` |

**Orden de colapso de la banda (al achicar)** `[P]` `PLANOS §2.4` fila "orden de colapso" #4 ("pasos 3→1 (md)"): 1) H2/ghost dejan de compartir fila (xl→lg) `[propuesta]` · 2) **tarjetas 3→1 en md** `[P]` · 3) **conector horizontal→borde izquierdo vertical <768** `[P]` (`UX-SPEC §2.1 #3`) · 4) lead y H2 a 12 col · 5) tipografía baja de escala (H2 64→44, número 40→32, título 20→18) `[P]` `UX-LANDING §5`. Nada se **oculta** en L2: no hay elemento que desaparezca, solo se re-fluye.

### 2.1 Desvío de frontera en 768 — se implementa con `md:` y se registra
`[P]` `PLANOS §2.6`: el `.mt-60` legacy vive en `media (max-width: 768px)` → da **60 px hasta 768 inclusive**; un `md:` de Tailwind es `min-width: 768px` → en **exactamente 768** el plano viejo da 60 y el nuevo da 100. **Decisión de implementación: usar `md:` y anotar el desvío en el gate.** No inventar un `768.02px` sin acta. Mismo corte se aplica a `py`, a la escala tipográfica y a la aparición del conector horizontal: **un solo corte, 768, cinco efectos**.

### 2.2 Fila del encabezado: por qué la lado-a-lado se fija en xl y no en md `[propuesta]`
El plano dibuja H2 (span-8) y ghost (span-4) en la misma fila a 1440 (`02-como-funciona.svg:40-43` `[P]`). El ghost propuesto mide **27 caracteres**; con Montserrat 600 a 16 px y `px-6` (24+24) el ancho intrínseco cae en torno a **290–310 px** — `sin dato` exacto, no puedo medir texto sin navegador. El span-4 **solo alcanza 304 px desde lg** y 364 desde xl. Riesgo real: título del botón partido en dos líneas a 992–1199.
**Propuesta: lado-a-lado desde `xl` (1200)**, apilado por debajo. Alternativa: desde `lg` si el operador elige una etiqueta corta (`Ver ejemplo`, 11 caracteres). Ninguna de las dos es cota documentada: **C-9 abierto, owner Operador.**

---

## 3. Ritmo vertical

| par / bloque | valor | marca | origen |
|---|---|---|---|
| padding vertical de banda (desktop) | **100 px** (`--band-y-d`) | `[P]` | `GRID-SPEC §3`, `UX-LANDING §4`, `PLANOS §1.3` |
| padding vertical de banda (móvil) | **60 px** (`--band-y-m`) | `[P]` | idem |
| eyebrow → H2 | **12 px** | `[propuesta]` (derivado por analogía con `kicker→H1 = 12` `[P]` `PLANOS §5` de internas; L2 no lo cotiza) |
| H2 → lead | **16 px** (`sp-3`) | `[P]` | `UX-LANDING §4`, `PLANOS §2.2` fila 3 |
| lead → tarjetas | **48 px** (`sp-6`) | `[P]` | idem |
| tarjeta ↔ tarjeta (horizontal y apilado) | **24 px** (`sp-4` = 1 gutter exacto) | `[P]` | idem — ver **C-11** |
| interior de tarjeta (padding) | **16 px** (`sp-3`) | `[P]` | idem |
| badge → título (dentro de la fila del badge) | **16 px** | `[propuesta]` (no cotizado; piso de escala 4/8 más cercano al `sp-3` documentado) |
| título → cuerpo | **8 px** (`sp-2`) | `[propuesta]` (no cotizado; 8 es el paso inferior de la escala `[P]` `UX-LANDING §4`) |
| banda → banda siguiente | **0** (el `py` de cada banda manda: 100 + 100 = 200 px de aire entre contenidos) | `[D]` de `GRID-SPEC §3` |

**Nota de reflujo sobre el par H2→lead:** a `<xl` el ghost ocupa la fila propia del grid entre ambos, así que ese par se materializa como dos separaciones de 24 px `[D]`; la cifra documentada de 16 px rige de xl hacia arriba. Ver criterio §9.5.

**Qué es cota y qué es derivado:** 100/60/16/48/24/16 son **cotas documentadas `[P]`**. 12 / 16 / 8 de la anatomía interna son **`[propuesta]`**: nadie los cotizó para esta banda; `sin dato` en `UX-LANDING §4` que solo nombra cuatro relaciones.
**Derivados aritméticos `[D]`** (no son mediciones). **Marco de referencia: el borde EXTERIOR de la tarjeta (border box; Tailwind aplica `box-sizing: border-box`, así que los 364 px de la cota incluyen el borde de 1 px).** Centro vertical del badge = `1 (borde) + 16 (padding) + 20 (radio del disco de 40)` = **37 px** desde el borde exterior superior. El conector es un pseudo-elemento cuyo contenedor de referencia es el **padding box** del `<li>` (1 px más adentro que el borde exterior): con `top: 35px` su centro cae en `1 + 35 + 1 = 37` ✓ — el valor se elige para que ambos marcos coincidan. Horizontal: el pseudo debe cubrir el gutter **entre bordes exteriores** (24 px) y nace 1 px adentro → `right: -25px`, `width: 24px`. Alto de línea del lead = `18 × 1.55 ≈ 28 px`; alto de línea del cuerpo = `16 × 1.60 ≈ 25.6 px`.
**Altura de banda en el stack nuevo: `sin dato`.** Los 568/872 son `[M legacy]` y el plano viejo no cierra con ellos (ver §1.3), así que **no** se implementa altura fija.

---

## 4. Anatomía de la tarjeta de paso

Estructura DOM (por tarjeta, dentro de `<li>`): **fila 1** = badge de número + título · **bloque 2** = cuerpo. El conector **no es un hijo de la tarjeta**: es un pseudo-elemento decorativo que vive en el aire entre tarjetas (§5.4).

### 4.1 Badge de número
| atributo | valor | marca |
|---|---|---|
| forma | disco (círculo completo), 40 × 40 px | `[P]` `02-como-funciona.svg:47` (`rx="20"`, caja 40×40); nota: la `rx=20` del SVG es geometría, no "píldora" vetada (`LOGIN-UX §8` veda la píldora en CTAs) |
| relleno | `interactive-primary` `#FC5A41` | `[P]` (`UX-LANDING §2` fila 3: "número Bebas 40 en badge coral") — **no firmado** para esta banda: `PLANOS §2.5` cita la colocación, `UX-SPEC` no la aprueba |
| número | **Bebas Neue 400, 40 px desktop / 32 px móvil**, `line-height 0.90` | `[P]` `UX-LANDING §5` fila "números métricos (trust, pasos)" |
| color del número | `text-primary` `#1A181B` sobre coral | `[P]` en la lógica legacy (ciruela/badge 5.08, `UX-LANDING §6` fila 3); en la paleta canónica = **5.61**, regla dura `UX-SPEC §3.C-1` y `CANON §4` — el número es texto y **jamás blanco** (blanco sobre coral 3.14) |
| ajuste geométrico | caja de línea 36 px dentro del disco de 40 | `[D]` de `40 × 0.90` |
| riesgo declarado | Bebas 40 en un disco de 40 px queda ceñido; las métricas exactimas de Bebas (altura de mayúscula ≈ 0.72 em) **no están medidas** → `sin dato`; verificar en el gate que el dígito no toque el borde | `[propuesta]` |
| colocación | **ángulo superior izquierdo de la tarjeta, en la misma línea que el título** | `[propuesta]` según el ASCII `UX-LANDING §3.3` ("│❶ 40 Bebas│ ESCANEA") |
| semántica | decorativo → `aria-hidden="true"` | `[propuesta]` (§8.3) |

**Conflicto C-4:** el ASCII pone el badge arriba-izquierda con el título al lado; el SVG lo dibuja **centrado en la tarjeta** (`x=312..352` sobre la tarjeta 150–514, centro exacto 332) y encima del badge escribe una etiqueta `PASO 1`. Propuesta: **ASCII** (badge a la izquierda, sin etiqueta `PASO n`) porque la etiqueta duplica la información que ya da el número y obliga a una tarjeta más alta. **El plano 02 está marcado DESACTUALIZADO por `PLANOS §6` → su forma no manda; la retícula sí.** Owner: Operador.

### 4.2 Título del paso
Montserrat **600**, **20 px desktop / 18 px móvil**, `line-height 1.30`, color `text-primary` (17.64 sobre blanco). `[P]` `UX-LANDING §5` fila "título de tarjeta". **Nunca Bebas** (título < 32 px y `CANON §5`: Bebas solo ≥32 en mayúsculas). Máximo 5 palabras (slot del brief). Alineado a la izquierda, una línea si cabe; `sin dato` de cuántas líneas cabe a 224 px (§9.25).

### 4.3 Cuerpo del paso
Montserrat **400**, **16 px**, `line-height 1.60`, color `text-primary` `[propuesta]` (el legado usa ciruela = texto primario, `UX-LANDING §6` fila 3). Ancho interior: `364 − 32 = 332` px a xl `[D]`; `224 − 32 = 192` px a md `[D]`; `12 col − 32` a móvil. 1–2 frases, sin tiempos, sin cifras, sin jerga (§7).

### 4.4 Tarjeta como superficie
| atributo | valor | marca |
|---|---|---|
| fondo | `surface-default` `#FFFFFF` — **igual que la banda** | `[P]` `UX-SPEC §2.1 #3` (banda blanca) + `CANON §4` |
| borde | **1 px `border-mid` `#8A6F55` por los cuatro lados** (en móvil el lado izquierdo pasa a 2 px, §8.2) | `[P]` regla: la separación no puede ser por color (`UX-SPEC §3.C-3`) y en la banda blanca tampoco por tono (1.00) → **borde obligatorio**; el límite funcional usa `border-mid`, **nunca `border-subtle`** (1.75 vs blanco → decorativo) `[P]` `DECISIONES D-2` + as-built L1 `L1-HERO §11` D1 |
| radio | **8 px** | `[propuesta]` — no hay token en `globals.css` (leído: 0 tokens de radio, `globals.css:3-41`) y L1 servido usa `rounded-lg` = 8 px (`hero.tsx:33`); el token documentado `--radius-card: 12` (`UX-SPEC §3.4`) **no existe en el CSS** y trae su conflicto `G-7` (12 vs 14). `sin dato` de cota para esta banda |
| altura | **content-driven** (`h-auto`); las tres tarjetas de la fila se igualan por `align-items: stretch` del grid (default), **no** por altura fija | `[propuesta]` — el 300 px del SVG es forma DESACTUALIZADA |
| sombra | **ninguna** | `[P]` `CANON §4`: "elevación por color y borde, no por sombra" |
| estados | **ninguno interactivo**: la tarjeta no es clickeable, no tiene hover, no tiene foco | `[propuesta]` — no hay acción que anunciar; un hover en una tarjeta sin destino prometería algo (§6) |

### 4.5 Conector
Ver §8.2 (reglas de comportamiento y geometría) y criterios §9.8–§9.10.

---

## 5. Copy propuesto (todo espera aprobación del operador)

Reglas aplicadas: tuteo, español de Chile, cero jerga, cero tiempos, cero cifras, cero prueba social, cero `[confirmar]`/`[precio]` (`CANON §7`, `UX-SPEC §5.1–5.2`). Los conteos de caracteres son calculados sobre la cadena exacta de este archivo.

### 5.1 Encabezado de banda
| slot | cadena | caracteres | palabras | marca |
|---|---|---|---|---|
| eyebrow | `DE LA MESA A TUS RESPUESTAS` | 27 | 6 | `[propuesta]` |
| H2 | `ASÍ FUNCIONA` | 12 | 2 | `[propuesta]` (cadena heredada de `COPY-LANDING §3` `[P legacy]`, re-proposta) |
| lead | `El cliente opina desde la mesa. Tú lo lees después.` | 51 | 10 | `[propuesta]` |
| ghost (a la derecha del H2) | `Ver una encuesta de ejemplo` | 27 | 5 | `[propuesta]` — **mismo label y mismo destino que el CTA primario ya servido en L1** (`hero.tsx:32-36`) |

### 5.2 Los tres pasos
| # | título (≤5 palabras) | caracteres título | cuerpo (1–2 frases) | caracteres cuerpo | frases | marca |
|---|---|---|---|---|---|---|
| 1 | `Escanea` | 7 | `El QR está en la mesa o en el mostrador. El cliente lo enfoca y la encuesta se abre en el navegador.` | 100 | 2 | `[propuesta]` |
| 2 | `Responde` | 8 | `Responde desde el navegador. No hay que instalar nada ni crear una cuenta.` | 74 | 2 | `[propuesta]` |
| 3 | `Tú las lees` | 11 | `Tú lees las opiniones de tus clientes en tu panel.` | 50 | 1 | `[propuesta]` |

### 5.3 Por qué este copy y no el legado — tres substituciones obligadas
| texto legado `[P legacy]` | problema | substitución |
|---|---|---|
| subtítulo `Tú lo armas en minutos. El cliente responde en segundos.` (`COPY-LANDING §3`) | viola la lista negra: `en minutos` y cifras cronometradas sin piloto están vetados (`UX-SPEC §5.2`, `COPY-LANDING §12.7`) | lead de §5.1, sin tiempos |
| eyebrow `SIMPLE Y RÁPIDO` (`COPY-LANDING §3`, ítem 7 del gate de aprobación `§13`) | revive el adjetivo de velocidad que la revisión C2a retiró; **además sigue pendiente de firma** | `DE LA MESA A TUS RESPUESTAS` |
| paso 3 `LISTO` + `…en tu panel, desde el celular` (`COPY-LANDING §3`) | `LISTO` trocea la bajada de marca `ESCANEA. OPINA. LISTO.`, que solo va donde la marca se presenta (`UX-SPEC §5.1` regla 10); "desde el celular" afirma un soporte no probado | `Tú las lees` + frase sin dispositivo |

### 5.4 Honestidad del paso 3 (el panel no está construido) — cómo se sostiene
**Estado verificado por lectura estática:** `src/app/(panel)/panel/page.tsx` es un placeholder (`<h1>Panel</h1>`, registrado en `L1-HERO §11` D10). El panel es la **etapa P** del orden de construcción (`CANON §3`) y su forma está abierta (`G-3`/`B-6`).
**Regla de esta banda:** describir el flujo del producto en texto **no** es afirmar que la pantalla exista hoy; **publicar un affordance interactivo hacia esa pantalla sí lo es.** Por eso L2:
1. **no enlaza a `/panel`** — ni el paso 3, ni el ghost, ni el título, ni el badge (precedente: L1 retiró `Conocer el panel` por exactamente este motivo, `L1-HERO §11` D10);
2. **no muestra ni simula una captura del panel** — eso es banda 6/L3 y exige screenshot real con banda `DEMO` (`CANON §6`, `PLAN-FRONTEND §7` fila L3);
3. **no afirma métricas, conteos, inmediatez ni disponibilidad** en el paso 3 ("al instante", "20 segundos", "sin límite", "gratis");
4. **el único estado interactivo de la página sigue siendo el de L1**, que ya declara `Demostración: todavía no guardamos respuestas.` — L2 no agrega ningún otro estado que pueda mentir;
5. **el destino del ghost de L2 es el ancla `#encuesta-demo`** que ya existe en el build (`hero.tsx:32` ↔ `survey-card.tsx:61`, corroborado en `L1-HERO §11` D9) → no hay enlace muerto en esta banda. Sube al lector hasta la demo real.
**Declaración explícita:** si el operador exige que el copy público solo describa lo ya implementado, **la frase a cambiar es el paso 3 y, junto con él, el subtítulo del hero** (`"Un panel con lo que necesitas saber"`, ya servido en `hero.tsx:25`) — no se puede resolver en una sola banda. **C-7, owner PM + Operador.**

### 5.5 Lo que este copy **no** dice a propósito
- **Número de preguntas** (ni "3 preguntas" ni "5"): está en conflicto abierto `G-0` (`UX-SPEC §7`) y `D-1` (`DECISIONES`, estado `propuesta`). Ninguna cifra entra en L2 hasta que PM cierre el modelo.
- **Escala de la encuesta** (1–5 vs 0–10): mismo `G-0`; además el demo servido usa 0–10 (`L1-HERO §4.8`), el snapshot 1–5.
- Palabras vetadas: `feedback`, `insights`, `score`, `CSAT`, `NPS`, `KPI`, `dashboard`, `tendencia`, `engagement`, `tiempo real`, `en construcción`, `próximamente`, `gratis`, `sin tarjeta`, any tiempo cifrado. (Verificado por búsqueda sobre las cadenas de §5.1–5.2.)
- Ningún `20 segundos`, `<30 s`, `en minutos`, `menos de 24 horas hábiles`, `10 000 empresas`, `100 % anónimo`.
- Ningún `[confirmar]` ni `[precio]` publicado (`UX-SPEC §5.1` regla 7).

---

## 6. Estados de la banda

| elemento | estados requeridos | detalle |
|---|---|---|
| ghost `Ver una encuesta de ejemplo` | default · hover · focus-visible · active/pressed · (visited: n/a, es ancla de página) | default: transparente, borde 2 px `text-primary`, label `text-primary` (17.64) — estilo del CTA secundario conservado como activo de diseño (`L1-HERO §11` D10). hover: `bg-surface-elevated` + borde ink (ink sobre elevada **12.82** ✓). pressed: `bg-surface-dark` + label `on-dark` (14.28 ✓). focus-visible: `outline` ink, offset 2 (ver §7.4). Transiciones **solo color**, 120–150 ms, igual que L1 `[propuesta]`. Alto ≥44 (objetivo 48) |
| tarjeta de paso | **ninguno** | sin acción, sin hover, sin foco (§4.4) |
| badge, número, conector | **ninguno** | decorativos permanentes |
| banda | **sin loading / sin empty / sin error** | banda estática de contenido: no pide datos, no puede venir vacía. La regla general de cuatro estados aplica a vistas con datos; aquí no hay dato que cargar, así que un skeleton sería un estado falso `[propuesta]` — precedente documentado en `L1-HERO §11.1`: menos estados que la checklist estándar es excepción **declarada**, no olvido |

**Regla que gobierna:** ningún estado se señala **solo por color** (`CANON §4`). En L2 esto solo tiene un punto de contacto: el pressed del ghost cambia fondo **y** color de texto a la vez ✓.

---

## 7. Accesibilidad

### 7.1 Semántica y jerarquía
```html
<section id="como-funciona" aria-labelledby="l2-title" class="...">
  <div class="...container...">
    <div class="grid grid-cols-12 gap-6">        <!-- fila encabezado -->
      <h2 id="l2-title" class="col-span-12 xl:col-span-8">ASÍ FUNCIONA</h2>
      <div class="col-span-12 xl:col-span-4 flex xl:justify-end">
        <a href="#encuesta-demo" ...>Ver una encuesta de ejemplo</a>
      </div>
    </div>
    <p class="...lead...">El cliente opina desde la mesa. Tú lo lees después.</p>
    <ol role="list" class="grid grid-cols-12 gap-6 mt-12">
      <li class="col-span-12 md:col-span-4 ..."><!-- badge aria-hidden + h3 + p --></li>
      ×3
    </ol>
  </div>
</section>
```
- **Un `h2` por sección**, cero saltos de outline: `h1` (hero) → `h2` (L2) → `h3` ×3 (tarjetas) `[P]` `UX-LANDING §8`.
- La secuencia vive en un **`<ol>`** (semántica de orden), no en el número pintado. `role="list"` explícito porque el `list-style` se quita y WebKit deja de exponer la lista como lista — patrón ya usado en el ecosistema (`skills/premium-web-design/references/complex-form-patterns.md:50`). `[propuesta]`, verificar con VoiceOver en el gate.
- `id="como-funciona"` es el ancla documentado de la banda `[P]` (`PLANOS §2.3` fila 3; `/service-detail` enlaza a `/#como-funciona`, `UX-SPEC §1`).
- **El badge + número: `aria-hidden="true"`** — el orden ya lo entrega el DOM y el `<ol>`; el disco es decoración `[propuesta]` (regla del brief: decorativos fuera del árbol de accesibilidad cuando no aporten información).
- **El conector: pseudo-elemento de CSS → no entra al árbol**; si se implementara como elemento real, `aria-hidden="true"` obligatorio `[P]` (regla general) + `alt=""` n/a.
- `aria-labelledby` de la sección apunta al `h2` (evita un nombre duplicado).

### 7.2 Orden de foco
`skip-link` (hoy **no existe en el build** — ver **C-16** en §10) → nav → **orden DOM = orden visual**: `h2` (no focusable) → ghost → nada más en L2. Un solo elemento focalizable en la banda → cero trampas de teclado, cero desorden posible. `[D]`
Al activar el ghost, el destino `#encuesta-demo` está **arriba** en el documento: el navegador hace scroll pero el foco sigue en el enlace; **comportamiento `sin dato` en este build** (abierto en `L1-HERO §11` U10 — "activación del ancla con teclado"). L2 no puede dar por buena una mecánica que L1 aún no midió.

### 7.3 Contraste — recalculado en esta sesión con la fórmula WCAG sobre los hex de `CANON §4` + `DECISIONES D-2`
| par | uso en L2 | ratio | umbral | veredicto |
|---|---|---|---|---|
| `text-primary` / `surface-default` | H2, títulos, cuerpos | **17.64** | 4.5 | ✓ AA+ |
| `text-secondary` / `surface-default` | eyebrow, lead | **7.33** | 4.5 | ✓ |
| `text-primary` / `interactive-primary` | número del badge | **5.61** | 4.5 (y 3.0 por ser ≥32 px) | ✓ |
| `interactive-primary` / `surface-default` | disco del badge como superficie | **3.14** | 3.0 (no-texto) | ✓ |
| `border-mid` / `surface-default` | borde de tarjeta, conector propuesto | **4.68** | 3.0 | ✓ |
| `border-subtle` / `surface-default` | **no se usa** como límite | 1.75 | — | ✗ decorativo |
| blanco / `interactive-primary` | **prohibido**: label | 3.14 | 4.5 | ✗ |
| `interactive-primary` / `background-page` | **prohibido como texto** (banda 2 contigua es crema) | 2.55 | 4.5 | ✗ |
| `text-primary` / `surface-elevated` | hover del ghost | **12.82** | 4.5 | ✓ |
| `on-dark` / `surface-dark` | pressed del ghost | **14.28** | 4.5 | ✓ |
| `surface-default` / `surface-default` | tarjeta sobre banda | **1.00** | — | la separación **no** puede ser por color → borde obligatorio |
**Coincidencia con lo documentado:** los valores recalculados caen idénticos a `UX-SPEC §3.B` (17.64 / 7.33 / 5.61 / 3.14 / 12.82 / 2.55) y a la tabla `D-2` (4.68 / 14.28 / 6.34 / 4.59). **Ninguna cifra se "ajustó porque se ve mejor"** (`UX-SPEC §3.B` gobernanza).
**Texto grande:** H2 64 px, número 40 px, título 20 px → umbral 3.0 solo aplica a los dos primeros; a 20 px 600 sigue siendo texto normal (17.64 holgado).

### 7.4 Targets, foco visible y movimiento reducido
- **Targets ≥44 px:** solo el ghost es interactivo → alto **48 px** (piso documentado 44 `[P]` `UX-LANDING §8` "targets ≥44×44 también en el landing"; 48 es el otro requerimiento → **G-20 abierto**, owner `reviewer-alibaba`/UX-UI, `UX-SPEC §7`). Ancho: intrínseco ≥ 290 px `[propuesta]`, `sin dato` medido.
- **Anillo de foco: `sin dato` en la paleta canónica** (`UX-SPEC §3.C-4`, `§3.E`, SD-14). Dos opciones documentadas: 3 px ink (`DECISIONES D-2`, `propuesta`, **sin firma**) vs 2 px ink **ya servido** en L1 (`hero.tsx:33`, registrado en `L1-HERO §11` D4). **Propuesta para L2: seguir a L1 (outline ink, `outline-2`, offset 2) por consistencia intra-página**, y cerrar el grosor una sola vez para todo el sistema. Nunca `outline: none` sin sustituto `[P]`.
- **`prefers-reduced-motion`:** la transición de color del ghost (120–150 ms) se apaga bajo `reduce` (0.01 ms, patrón documentado `UX-SPEC §3.6`); sin translate, sin stagger, sin reveal. **Requisito del brief "sin motion sobre el pliegue":** se cumple por construcción — **L2 no tiene animación de entrada**. El reveal por scroll (`@supports animation-timeline: view()`) queda **fuera** de esta banda `[propuesta]`: presupuesto de efectos en cero, CLS 0.
- Sin parpadeo, sin autoplay, sin contenido en movimiento: no aplica 2.2.2.
- Idioma: `lang="es-CL"` ya servido en `src/app/layout.tsx:30` `[as-built]`.

### 7.5 Nombres accesibles (lo que lee una tecnología de apoyo, cadena exacta)
| nodo | nombre accesible | mecanismo | marca |
|---|---|---|---|
| `<section>` | `ASÍ FUNCIONA` | `aria-labelledby="l2-title"` → el `h2` (nombre = texto visible, sin sufijo inventado) | `[cota]` |
| `h2` | `ASÍ FUNCIONA` | texto vivo | `[propuesta]` (cadena) |
| lista de pasos | sin nombre (el `<ol>` no lo pide) | `role="list"` + 3 ítems | `[propuesta]` |
| cada tarjeta | su `h3` (`Escanea` / `Responde` / `Tú las lees`) + el cuerpo, en ese orden | DOM | `[propuesta]` |
| badge con el número | **ninguno** | `aria-hidden="true"` — el orden lo da la lista, no el dígito pintado | `[propuesta]` |
| conector | **ninguno** | pseudo-elemento CSS: no existe en el árbol | `[propuesta]` |
| ghost | `Ver una encuesta de ejemplo` | texto del enlace (sin `aria-label`: el label visible **es** el nombre, regla "nombre = texto visible") | `[propuesta]` |
| destino del ghost | el bloque de la demo (`#encuesta-demo`), ya nombrado por L1 | ancla de página | `[as-built]` (`hero.tsx:32`, `survey-card.tsx:61`) |

**Comprobación que queda para el gate (no la hice):** que una lectura con lector de pantalla de la banda entregue, en orden, `ASÍ FUNCIONA` → 3 ítems de lista con su título y cuerpo → el enlace, **sin** announcement de "1, 2, 3" sueltos ni de líneas decorativas.

---

## 8. Mapping Tailwind 4 (clases concretas) y qué NO se toca

### 8.1 Banda
```tsx
// src/components/marketing/how-it-works.tsx  (componente NUEVO; ruta propuesta)
<section
  id="como-funciona"
  aria-labelledby="l2-title"
  className="w-full bg-surface-default px-4 py-15 md:py-25 scroll-mt-4"
>
  <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
    {/* 1) eyebrow: primer bloque de la banda; eyebrow→H2 = 12 px (§3) */}
    <p className="font-ui text-[12px] font-semibold uppercase tracking-[0.14em] text-text-secondary lg:text-[13px]">
      DE LA MESA A TUS RESPUESTAS
    </p>

    {/* 2) fila encabezado: H2 (span-8) + ghost (span-4) lado a lado solo desde xl (§2.2) */}
    <div className="mt-3 grid grid-cols-12 gap-6">
      <h2 id="l2-title"
          className="col-span-12 xl:col-span-8 font-display uppercase text-[44px] leading-[0.95] tracking-[0.01em] text-text-primary md:text-[64px]">
        ASÍ FUNCIONA
      </h2>
      <div className="col-span-12 xl:col-span-4 flex xl:justify-end">
        <a href="#encuesta-demo"
           className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-[8px] border-2 border-text-primary px-6 font-ui text-[16px] font-semibold text-text-primary transition-colors duration-150 hover:bg-surface-elevated active:bg-surface-dark active:text-on-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary">
          Ver una encuesta de ejemplo
        </a>
      </div>
    </div>

    {/* 3) lead — H2→lead = 16 px [P]; el 13 px del eyebrow corta en lg (992), no en md: `UX-LANDING §8` fija "12 px móvil · 13 px ≥992" [P] */}
    <p className="mt-4 max-w-[70ch] font-ui text-[17px] leading-[1.55] text-text-secondary md:text-[18px]">
      El cliente opina desde la mesa. Tú lo lees después.
    </p>

    {/* 4) los tres pasos — lead→cards = 48 px [P] */}
    <ol role="list" className="mt-12 grid grid-cols-12 gap-6 list-none">
      <li className="step-item relative col-span-12 md:col-span-4 rounded-[8px] border border-border-mid border-l-2 border-l-interactive-primary md:border-l md:border-l-border-mid bg-surface-default p-4">
        <div className="flex items-start gap-4">
          <span aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-interactive-primary font-display text-[32px] leading-[0.9] text-text-primary md:text-[40px]">
            1
          </span>
          <h3 className="font-ui text-[18px] leading-[1.3] font-semibold text-text-primary md:text-[20px]">Escanea</h3>
        </div>
        <p className="mt-2 font-ui text-[16px] leading-[1.6] text-text-primary">
          El QR está en la mesa o en el mostrador. El cliente lo enfoca y la encuesta se abre en el navegador.
        </p>
      </li>
      {/* li 2 y 3 idénticos en estructura; el conector se agrega por CSS, no por DOM */}
    </ol>
  </div>
</section>
```

### 8.2 Conector (CSS propio, no utilidad de Tailwind)
```css
/* donde corresponda el CSS de la banda (componente o utility) — sin tocar @theme */
@media (min-width: 768px) {
  .step-item:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 35px;          /* centro efectivo = 37 px desde el borde exterior: coincide con el centro del badge (§3) [D] */
    right: -25px;       /* gutter 24 + 1 px de borde: el trazo llena el hueco EXACTO entre bordes exteriores [D] */
    width: 24px;        /* = gutter [P] */
    height: 2px;        /* cota del conector [P] UX-LANDING §3.3 / §2.1 #3 */
    background-color: var(--color-border-mid); /* [propuesta] ver C-3; el plano lo dibujaba coral */
  }
}
```
En móvil (sin `md`) el pseudo-elemento **no existe**; el lado izquierdo de cada tarjeta lleva el trazo vertical de 2 px (`border-l-2 border-l-interactive-primary`, en el JSX). Dos elementos de conector como máximo por viewport (entre 1-2 y 2-3) `[D]` de 3 tarjetas.

### 8.3 Qué **NO** se toca
| no se toca | por qué |
|---|---|
| `@theme` de `src/app/globals.css` (líneas 3–41) | los 6 tokens de `CANON §4` y los derivados de `D-2` ya están; **ninguna cota de L2 pide un token nuevo** — ver §8.4 |
| `--breakpoint-*` | ya correctos: `xs 375 / sm 576 / md 768 / lg 992 / xl 1200 / 2xl 1400` (`globals.css:24-29`) `[as-built]` |
| `--container-mkt-*` | ya correctos: 540/720/960/**1140**/1320 (`globals.css:32-36`) `[as-built]` |
| tipografía | `font-display` / `font-ui` ya mapeados a `--font-bebas` / `--font-montserrat` (`globals.css:39-40`, `layout.tsx:5-15`) `[as-built]` |
| body/base | `background-page` + `text-primary` + Montserrat (`globals.css:43-47`) |
| `src/app/(marketing)/layout.tsx`, `layout.tsx` raíz, `page.tsx` de marketing | L2 se agrega como componente hijo en `page.tsx`; **no** se reestructuran layouts en este lote |
| snapshot `scansaydone-front/ENTREGA-UX-2026-10-30/**` | congelado (`CANON §8`) |
| `docs/frontend/INDEX.md` | **no lo edito** (fuera de mi ruta de escritura); la fila `planos/L2-…` queda pendiente → acción para el owner de INDEX |
| Bootstrap/Sass, librerías de íconos/gráficos/animación | `CANON §2`, `UX-SPEC §9` N-4/N-14 |
| cualquier `shadow-*`, `bg-gradient-*`, `backdrop-blur`, `filter` | prohibido por `CANON §4` y slop-lint S2/S5/S6 |

**Deuda de tokens que L2 no paga (no bloquea, se registra):** `--band-y-d`/`--band-y-m` (100/60) **no existen** en `globals.css` → van como `py-15 md:py-25` (= 60/100 px vía `--spacing` default 0.25rem); el radio de tarjeta **no existe** → `rounded-[8px]` literal; `--radius-card` (12, con `G-7` 12 vs 14) y el anillo de foco (`SD-14`) siguen siendo decisión del operador. Tokenizar = lote propio con firma, no este plano.
**Observación de nomenclatura (no afecta a L2):** el CSS servido define `--container-mkt-2xl` (`globals.css:36`) mientras `PLANOS §1.4` lo nombra `--container-mkt-xxl`. L2 se detiene en `mkt-xl`, así que no consume el nombre divergente; se registra para quien toque esa fila.

---

## 9. Criterios de aceptación (binarios; numerados; verificables sin reinterpretar)

**Convención:** `[cota]` = se verifica contra una cota documentada → fallar es defecto. `[propuesta]` = se verifica contra lo que este plano propone → fallar es defecto **de implementación**, pero la cifra aún puede cambiar si el operador la rechaza. `[as-built]` = hecho del código actual, registrado por lectura estática, **no** aprobado. Ningún criterio afirma PASS: aquí no corrrió nada.

**Geometría**
1. `[cota]` A 1440 px de viewport: el content box del container mide **1140 px** y las 3 tarjetas miden **364 px** de ancho cada una, con dos huecos de **24 px**; x izquierda de las tarjetas = **150 / 538 / 926** y x derecha = **514 / 902 / 1290**.
2. `[cota]` A 1200 px: tarjetas **364** px, offset del container **30 px** (x 30–394 / 418–782 / 806–1170).
3. `[cota]` A 992 px: **3 tarjetas en fila**, 304 px cada una. A 768 px: **3 en fila**, 224 px. A 767 px: **1 columna**, ancho de tarjeta = ancho de contenido.
4. `[cota]` Padding vertical de banda: **100 px** a 768 y arriba, **60 px** a 767 y abajo. En exactamente 768 aplica 100 (desvío de 1 px de viewport ya documentado en `PLANOS §2.6`, registrado en el gate, **no** "arreglado" con un breakpoint 768.02).
5. `[cota]` Separaciones verticales: eyebrow→H2 **12 px** `[propuesta]`, H2→lead **16 px**, lead→tarjetas **48 px**, tarjeta↔tarjeta **24 px**, padding interior de tarjeta **16 px**. **Condicional:** el par H2→lead 16 px solo se da **de xl (1200) hacia arriba**, donde el ghost está al lado del H2; por debajo de xl el ghost se apila **entre** ambos y las dos separaciones pasan a **24 px** (gap de fila del grid) `[D]`. No se reordena el DOM con `order-*` para fingir la cifra: el orden de lectura manda (§7.2).
6. `[cota]` El ancho de contenido en 375 px es **343 px** (padding 16 px/lado) `[propuesta]` — ver **C-2**: si el operador fija 12 o 24, este criterio cambia y el `px-4` se corrige.
7. `[cota]` Cero scroll horizontal a 375 px y a 320 px. Las 12 columnas se cierran sin margen negativo (no arrastrar el −2 px de `GRID-SPEC §1`).

**Conector**
8. `[cota]` A ≥768 px hay **exactamente 2** conectores; cada uno mide **24 px de largo × 2 px de alto**, ocupa el gutter entre bordes exteriores de tarjetas consecutivas (**x 514→538** y **x 902→926** a 1440, sin dejar ni robar 1 px) y su **centro vertical está a 37 px** del borde exterior superior de la tarjeta, es decir **coincide con el centro del badge** (medido desde el borde exterior, no desde el padding). `[propuesta]` color `border-mid`; si el operador firma coral, cambiar solo el color, no la geometría.
9. `[cota]` A <768 px: **cero** conectores horizontales y cada tarjeta tiene un trazo vertical de **2 px** en el borde izquierdo, de alto completo.
10. `[cota]` El conector **no existe en el DOM** como nodo con contenido textual (es pseudo-elemento, o `aria-hidden="true"` si se materializa).

**Color y tipografía**
11. `[cota]` Cero `box-shadow`, `filter: blur`, `backdrop-filter` o gradiente en la banda. La separación tarjeta↔banda es un **borde 1 px `border-mid`**, no un tono (fondo de tarjeta == fondo de banda == `#FFFFFF`).
12. `[cota]` Ninguna declaración de color usa un hex fuera de `@theme`. En particular: ausentes `#FF5F44`, `#2E1E3F`, `#FFF8F2`, `#F4B63B`, `#FFE7D9`, `#6366f1`, `#0e6e5c` (paleta superseded / fuera de paleta, `UX-SPEC §9` N-15/N-15b).
13. `[cota]` Cero texto con color `interactive-primary` en la banda (2.55/2.29 vetados); el número del badge es `text-primary` sobre coral (5.61) y **nunca blanco**.
14. `[cota]` Bebas solo en H2 (≥32 px, mayúsculas) y en el número del badge. Títulos, cuerpos, eyebrow y label del ghost = Montserrat. `border-subtle` no aparece en ningún límite de tarjeta.
15. `[propuesta]` Escala servida: H2 44→64 en 768; número 32→40; título 18→20; cuerpo 16; lead 17→18; eyebrow 12→13 en 992 con `tracking-[0.14em]` en mayúsculas. Todo tamaño fijo por breakpoint, **sin `clamp()`** (`UX-SPEC §5.1` G-15).
16. `[propuesta]` Ghost de alto **48 px** (piso 44 documentado); borde 2 px ink; hover cambia fondo a `surface-elevated` **sin mover el layout**; pressed `surface-dark` + `on-dark`; transición solo de color, 120–150 ms.

**Accesibilidad**
17. `[cota]` Exactamente **un** `h1` en la página, **un** `h2` en L2 con texto = `ASÍ FUNCIONA` (o la cadena aprobada), **tres** `h3` en las tarjetas; cero saltos de outline.
18. `[cota]` `<section>` con `id="como-funciona"` + `aria-labelledby` hacia el `h2`; la lista es `<ol>` con `role="list"`; el badge con el número lleva `aria-hidden="true"`.
19. `[cota]` Orden de tab en la banda = orden visual: el único elemento focalizable es el ghost; no hay `tabindex` positivo en la banda; ningún `outline: none`.
20. `[cota]` Con `prefers-reduced-motion: reduce` la banda no anima nada (la transición del ghost desaparece o baja a 0.01 ms) y el CLS de la banda es **0** en la captura de gate (no hay reveal ni imagen).
21. `[propuesta]` El ghost no se estira al ancho de su celda (ancho intrínseco, `whitespace-nowrap`); su label cabe en una línea a 1200 px y arriba. Si a alguna anchura se parte, se reporta y se decide C-9, no se silencia.

**Contenido / honestidad (L2 es la banda donde más fácil se miente)**
22. `[cota]` Las cadenas visibles son **exactamente** las de §5.1–5.2. Cero variaciones: cualquier tiempo (`20 segundos`, `<30 s`, `en minutos`, `en segundos`, `al instante`), toda palabra vetada (`CSAT`, `NPS`, `score`, `KPI`, `dashboard`, `insights`, `feedback`, `tiempo real`, `gratis`, `sin tarjeta`, `en construcción`, `próximamente`), todo número de preguntas y todo porcentaje: **ausentes**. `[confirmar]` y `[precio]` no aparecen nunca.
23. `[cota]` Cero enlaces a `/panel` y cero a `/e/demo` en L2; el único `href` de la banda es `#encuesta-demo`. `[cota]` Cero `<img>`/captura/simulación del panel en L2 (eso pertenece a L3 con banda `DEMO`). Cero QR dibujado o generado en esta banda.
24. `[cota]` Cero peticiones de red de la banda: sin `fetch`, `axios`, `XMLHttpRequest`, `useMutation` ni `/api/` en el componente; la banda renderiza en el primer paint sin datos externos.
25. `[propuesta]` Medida de legibilidad en móvil a declarar en el gate, no aquí: cuántas líneas ocupa el cuerpo del paso 1 (100 caracteres) dentro de los **192 px** de interior a 768 px. Si el resultado rompe el ritmo de la fila, se abre decisión (ver **C-10**: 3-up desde `lg` en lugar de `md`).

**Fuera de este plano (para que el reviewer no lo busque aquí)**
26. `[as-built]` Los desvíos de L1 vs las cotas documentadas se listan en §10 (C-1) y **no** se corrigen en L2: este plano implementa las cotas canónicas porque el brief lo manda; reconciliar L1 es decisión de otra pasada.

---

## 10. Conflictos abiertos y pendientes (owner al lado; aquí no se resuelve nada a ojo)

| # | conflicto / pendiente | valores en choque | owner |
|---|---|---|---|
| **C-1** | **La retícula servida de L1 no es la retícula documentada, y L2 debe elegir una.** `hero.tsx:5-7`: `py-16 lg:py-24` (64/96, corte en lg) vs `--band-y-m/d` **60/100, corte en 768** `[P]`; `px-4 sm:px-6 lg:px-8` (16/24/32) vs `px-3` (12) `[P]`; `gap-8 lg:gap-12` (32/48) vs **gutter 24** `[P]`. Con `gap-12` a 1440, el par 7/5 del hero cierra **645 + 48 + 447**, no los **655 + 24 + 461** `[P]` documentados. Consecuencia: si L2 aplica las cotas de `PLANOS`, el eje de las tarjetas de 364 y el aire de 24 **no van a caer sobre los ejes del hero servido**. | cotas `[P]` vs código `[as-built]` | **Operador + `frontend-alibaba`** (reconciliar L1 o re-cotar L2) |
| **C-2** | Padding horizontal del container abierto `D-1` (12 vs 24); aquí se propone **16** por aritmética de contenedores (§1.4). | 12 / 16 / 24 | `designer-alibaba` (dueño de D-1) |
| **C-3** | Color del conector: el plano lo dibuja **coral** (`02-como-funciona.svg:49,55`) pero `CANON §4` reserva `interactive-primary` para **acción y estado activo** — un hilo decorativo entre tarjetas no es acción. Se propone `border-mid`. | coral `[P legacy]` vs rol de token | Operador |
| **C-4** | Posición del badge: ASCII "ángulo sup. izq., en línea con el título" (`UX-LANDING §3.3`) vs SVG "centrado en la tarjeta, bajo una etiqueta `PASO n`" (`02:47-48`). Se propone ASCII y **eliminar** la etiqueta `PASO n` (duplica el número). | dos formas en el mismo snapshot | Operador |
| **C-5** | Geometría del badge: disco 40 `[P SVG]` + Bebas 40 `[P §5]` caben, pero ceñidos; métricas exactas de Bebas `sin dato`. Además la escala móvil pide 32 en el mismo disco de 40. | 40 vs 40 | `designer-alibaba` (medir en el gate) |
| **C-6** | Copy legado vs lista negra: `Tú lo armas en minutos…` y el eyebrow `SIMPLE Y RÁPIDO` (ítem 7 del gate de aprobación `COPY-LANDING §13`) no son publicables tal cual. Se proponen reemplazos; la firma es del operador. | `COPY-LANDING §3` vs `§12.7` | Operador |
| **C-7** | **Paso 3 describe un panel que no existe.** `panel/page.tsx` es placeholder; la banda puede describir el flujo en texto pero no enlazar ni simular. Si la política exige "solo lo implementado", el subtítulo del hero servido (`hero.tsx:25`) debe revisarse junto. | texto de producto vs estado del build | **PM + Operador** |
| **C-8** | Número de preguntas y escala sin cerrar (`G-0`, `D-1` de `DECISIONES` = `propuesta`); por eso L2 **no** menciona conteos. Si PM fija "3" o "5", el copy de §5.2 se reescribe. | 3 preguntas 1–5 vs 5 preguntas 0–10 | PM / equipo |
| **C-9** | Label del ghost: 27 caracteres > slot documentado de botones (≤25, `COPY-LANDING §0` regla 4), mismo problema ya abierto en L1 (U3). Y decide §2.2 (lado-a-lado desde `xl` o `lg`). | 27 vs ≤25 | Operador |
| **C-10** | El conector: `UX-SPEC §2.1 #3` y `UX-LANDING §7` lo hacen horizontal **desde 768**; `PLANOS §2.4` lo hace "volver a horizontal" en la fila de **992**. Adopto 768 (coherente con el `col-md-4` lado a lado) y registro el choque. | 768 vs 992 | `designer-alibaba` (dueño de PLANOS) |
| **C-11** | Separación de tarjetas apiladas: ritmo `[P]` dice **24** (`sp-4`); el ASCII móvil de la misma sección dice **`sp-5` = 32**. | 24 vs 32 | `designer-alibaba` |
| **C-12** | Radio de la tarjeta: sin token en `globals.css`; `--radius-card: 12` documentado con su propio choque **G-7** (12 vs 14); L1 servido usa 8. Propuesta: 8. | 8 / 12 / 14 | Operador |
| **C-13** | Anillo de foco: `DECISIONES D-2` propone 3 px ink (`propuesta`, sin firma); L1 servido usa 2 px ink. `UX-SPEC §3.E` lo declara `sin dato`. L2 sigue a L1 y se marca el pendiente **sistémico**. | 2 vs 3 px; color sin firma | Operador |
| **C-14** | `md:` a 768 vs `max-width:768` legacy (desvío de 1 px) — documentado en `PLANOS §2.6`, **no** resuelto; hay que registrarlo en el acta del gate. | 768 incluido vs excluido | `frontend-alibaba` (gate) |
| **C-15** | **Fila de `INDEX.md`**: este plano existe pero `docs/frontend/INDEX.md` no lo lista; no puedo editarlo (ruta fuera de mi alcance). Agregar la fila `planos/L2-COMO-FUNCIONA-2026-11-06.md` es acción del owner de INDEX. | — | Operador |
| **C-16** | Navbar/skip-link del marketing **no están servidos** (`(marketing)/layout.tsx:6` solo renderiza `<main className="flex-1">`), así que `main { padding-top: 76px }` `[P]` y el skip-link `[P UX-LANDING §8]` no existen aún. El `scroll-mt` de la banda se propone en 16 px y **queda condicionado** a la altura real de la navbar cuando llegue; hoy el ancla `#como-funciona` no tiene barra que despejar. | 76 documentado vs 0 servido | `frontend-alibaba` + Operador |

**Situación de las alturas `[M legacy]` (568 / 872):** ni este plano ni la fórmula las reproducen. Con las cotas de ritmo, el contenido de la banda a 1440 es `H2 (50 `[P SVG]` → `sin dato` real) + 12 + 44 (lead 2 líneas) + 48 + alto de tarjeta` y **el alto de tarjeta no está cotizado** → la suma **no cierra** contra 568. Se declara como evidencia histórica no reproducible (`G-24`/`B-10`), **no** como meta de implementación.

---

## 11. Lo que este archivo **NO** verificó (lista explícita)

1. **Nada ejecutado:** sin build, sin lint, sin `tsc --noEmit`, sin tests, sin axe, sin Lighthouse, sin Playwright, sin captura de viewport. **Cero PASS en este documento.**
2. **Ninguna medición nueva:** ningún ancho, alto, posición x, ni tamaño de texto del stack nuevo fue medido. Las medidas del snapshot (`[M legacy]`) pertenecen al proyecto anterior y no son reproducibles aquí (`G-24`).
3. **Ningún ancho de texto:** el tamaño renderizado de las cadenas (ghost de 27 caracteres, cuerpo del paso 1, título del paso 1) está estimado con avance medio tipográfico, no medido → `sin dato`; `px` exactos de Bebas/Montserrat sin navegador no existen.
4. **No abrí PNG alguno:** ni `capturas/2026-10-29/land-03-como-funciona.png` (verdad visual de la banda legada), ni mockups, ni `referencias/image.jpeg`. Leí planos SVG como texto y documentos; **no rastericé nada** y no usé zai-vision en esta sesión.
5. **Contraste:** recalculado con la fórmula WCAG sobre hex de `CANON §4`/`D-2` (coincide con `UX-SPEC §3.B`), pero **sin herramienta de auditoría** y sobre el par plano-vs-plano — no sobre pixels renderizados con hover/foco reales.
6. **No verifiqué runtime de anclas:** qué hace `#como-funciona` al activarse con teclado, ni adónde cae el foco al activar `#encuesta-demo` desde L2 (abierto en `L1-HERO §11` U10).
7. **No verifiqué el modelo de producto:** preguntas, escala, contenido real del panel, precios, correo, datos legales (`D-1`, `D-10`, `G-0`, `CANON §11`).
8. **No verifiqué compatibilidad de dispositivos** ("desde el celular", "cualquier teléfono") — por eso ese enunciado **no** entra en el copy (§5.3).
9. **No revisé `scansaydone-back/`** ni endpoints; **no** propuse ni nombré ninguna API.
10. **No toqué** `globals.css`, `layout.tsx`, `(marketing)/layout.tsx`, `page.tsx`, `hero.tsx`, `survey-card.tsx` ni el snapshot. El único archivo escrito por esta tarea es este plano.
11. **No verifiqué SEO/AEO, metadatos, OG ni favicon** de la banda: fuera de alcance de L2.
12. **No verifiqué que el reviewer haya aprobado nada:** la revisión de L1 es anterior a la última corrección de CTA y no cubre L2.

---

**Sin afirmaciones de PASS.** Este plano propone geometría, copy y criterios; **no** aprueba ni implementa. Toda cadena marcada `[propuesta]` espera firma del operador; todo `sin dato` sigue sin dato hasta que alguien lo mida con herramienta.
