# NAVBAR-Y-FOOTER — plano del chrome de navegación (banda de barra + banda 10)

> **Fecha:** 2026-11-06 · **Autor:** designer-alibaba · **Ruta canónica:** `docs/frontend/planos/NAVBAR-Y-FOOTER-2026-11-06.md` · **Precedente de formato:** `L5-APLICACIONES-2026-11-06.md`, `L6-FAQ-2026-11-06.md` (§12/§13 como modelo de acta) · **Compañero de numeración:** conflictos `C-1…C-54` servidos por L1–L6; **este plano abre C-55**.
> **Qué es:** plano implementable de las dos piezas de chrome que faltan: la barra fija (nav) y el pie (banda 10). Canon: `PLANOS §2.5` (lockup), `§2.1` (fila 10 y fila Navbar), `§2.3`, `§2.4`; `UX-SPEC §2.1` nota Navbar y fila Footer; `CANON §4/§5/§7`.
> **Qué NO es:** no toca las bandas servidas salvo una clase por banda (desplazamiento de anclas, §A.5/C-59); no decide precios (B-7); no inventa datos de empresa (B-5/G-28); no reabre lo firmado hoy (anillo 3 px / offset −3 px; copy L6; `/contactus` con canal pendiente; banda 6 con marco vacío declarado; ejes intactos).

---

## 0. Estado y clave de lectura

**Estado: BORRADOR PARA FIRMA.** Ningún valor de este archivo es decisión pública hasta el acta del orquestador y la firma del operador. **Cero PASS: no corrí build, lint, typecheck, tests, axe ni Playwright** (regla del rol). `sin dato` = no documentado ni medido.

| Etiqueta | Significado |
|---|---|
| `[P]` | cota / regla del plano o spec vigente (`PLANOS`, `UX-SPEC`, `CANON`, actas citadas) |
| `[D]` | derivado aritmético sobre una cota `[P]` (fórmula de retícula `GRID-SPEC §1` vía `PLANOS §1.2`) |
| `[M legacy]` | medido en el sitio anterior (Bootstrap); referencia histórica, **no meta** — re-medir en el stack nuevo (`B-10`/`G-24`) |
| `[as-built]` | verificado por lectura estática del código actual en esta sesión (solo lectura) |
| `[propuesta]` | decisión de este plano sujeta a firma del operador |
| `sin dato` | falta; se nombra el archivo que debió contenerlo |

Hoy, verificado por lectura: **no existe `header`, ni `nav`, ni `footer` en el build**; `(marketing)/layout.tsx` es `<main className="flex-1">{children}</main>` de 7 líneas `[as-built]`. La página arranca en el hero y termina en la banda 8 (`page.tsx:10-20 [as-built]`). Este lote introduce **los primeros enlaces de navegación reales del producto**.

---

## A. PIEZA A — NAVBAR (banda de chrome; no es banda de contenido)

### A.1 Firma de la pieza (antes de los números)

- **Memorabilidad [propuesta]:** la barra es la pieza que **ordena el sitio sin gritar**: crema permanente, un hilo marrón de 1 px como único ornamento, y un solo botón con borde que siempre promete lo mismo que el hero promete. En un sitio de seis bandas alternadas, el lomo fijo es la única cosa que no cambia cuando todo lo demás cambia — esa estabilidad es la firma.
- **Anti-convergencia:** el sitio ya tiene un botón coral (hero, cerrado) y un ghost bordado (banda 3, servido `[as-built] how-it-works.tsx:48`). La barra **no introduce un tercer estilo**: reutiliza el ghost bordado como CTA de la barra (mismo vocabulario de estados que la banda 3, mismo radio 8 servido) y ningún coral. Registro de desvío: "el hero agotó el coral; la barra se presenta bordada y en silencio".
- **Prohibido en la pieza (lista cerrada):** sombra (`CANON §4`), `backdrop-blur` (N-14), gradiente, coral en cualquier clase del header (presupuesto 1 coral visible/pantalla `[P] UX-SPEC §2.1` + "nunca dos CTAs coral visibles a la vez" `[P] wireframes/INDEX.md` fila 9), estados por scroll (`[P] UX-SPEC §2.1` navbar: "sin estados por scroll ni JS"), emoji como ícono (`CANON`, B-4), hex fuera de los 16 tokens servidos, librerías nuevas, enlaces a `/panel`, `/e/…`, `/pricing`, `/faqs` mientras sus destinos sean placeholder (`L1 §11 D10` — precedente leído `[as-built]`), iconos de librería (set sin decidir, B-4).

### A.2 Geometría

| Cota | Valor | Fuente / estado |
|---|---|---|
| Alto de barra | **76 px** = 20 + 36 (logo) + 20 | `[P]` solo fija `main { padding-top: 76px }` (`UX-SPEC §2.1`, `PLANOS §2.1` fila Navbar); la cota propia del alto es `sin dato` (`SD-2 [P] PLANOS §7`) → derivación `[propuesta]` C-65 |
| Posición | `fixed inset-x-0 top-0` | `[P]` "NAV fijo" `PLANOS §2.3` |
| Fondo | `background-page` #F7E5C8, **permanente** | `[P]` "superficie crema permanente"; el sucesor canónico del crema `#FFF8F2` (muerto, N-15b) es `background-page` de la paleta firmada |
| Borde inferior | 1 px `border-mid` #8A6F55 | `[P]` "borde inferior 1 px `--border`"; sucesor funcional servido: `border-mid`. Ratio de la línea: **3.79** sobre crema por ambas caras (calculado esta sesión; `[V]` no cubre este par) ≥ 3.0 ✓. `border-subtle` vetado como límite funcional (1.42 sobre crema = decorativo) |
| Container / eje | escalera de banda: `px-4` exterior + `max-w-mkt-sm / md / lg / xl` interior → a 1440 el borde izquierdo del contenido queda en **x = 150**, eje compartido con bandas 3/4/5 y con la banda 10 (pie) | `[P]` `PLANOS §2.1` (aire 150); patrón `[as-built]` idéntico al de `channels.tsx:111-113`, `applications.tsx:41-43` |
| Separadores | logo ↔ cluster derecho: `justify-between` dentro de 1140; ítems del cluster: `gap-6` (24 px = 1 gutter exacto `[P] UX-SPEC §3.4`) | `[propuesta]` |

**Eje de la barra — decisión del brief, desfase declarado:** el operador firmó **mantener los ejes**. La barra se alinea al eje **mkt-xl 1140 (x 150–1290 a 1440)**, el mismo del pie y de las bandas 3/4/5. Consecuencias declaradas, sin corregir el hero:

| par | a 1440 (lg+) | a 375 |
|---|---|---|
| barra x 150 ↔ **hero** x 182 (su `px-8` interno, `hero.tsx:6 [as-built]`) | **desfase 32 px** — el logo cae 32 px a la izquierda del texto del hero; aceptado por decisión de ejes | 0 (ambos `px-4`) |
| barra ↔ bandas 3/4/5 | 0 | 0 |
| barra ↔ **banda 6** (x 60, mkt-2xl) | 90 px | n/a (la 6 usa la misma escalera hasta 2xl) |
| barra ↔ **banda 8** (x 240, mkt-lg) | 90 px | n/a |

Los desfases 6 y 8 son estructurales (contenedores distintos por diseño `[P]`); el 1↔barra es el único desfase "nuevo" y es consecuencia directa de la decisión de ejes. Queda registrado, no se corrige.

**Altura de la barra como cota propia:** `sin dato` (`SD-2`); este plano la fija **derivándola de 76** (20+36+20) `[propuesta]` C-65. La cota 76 es doblemente obligatoria: alto del header == `padding-top` del `main` (criterio A2).

### A.3 Anatomía del lockup (logo)

`[P] PLANOS §2.5`: logo **108×36 (3:1)** en el extremo izquierdo del container; `[P] UX-SPEC §2.1`: "Logo 108×36 (3:1 real), no los 93×22 del template (4.2:1 deforma)".

- Caja: `w-[108px] h-9` (36) dentro de un enlace con hit de 44 de alto.
- **Contenido:** el vector de marca **no está en el build** (`B-8` `[O verificado]` por `UX-SPEC §6.3`: `logo-symbol.svg` vive en el snapshot congelado y la orden de rescate es del operador; "no copies ni movas nada de marca ahora"). Lockup hoy = **texto vivo** `[propuesta]`: `ScanSayDone` (11 car.) Montserrat 600 16 px, que es la única receta que cabe en 108 px: Bebas a 32 (mínimo del rulejón `CANON §5`) mide ≈ 158 px de avance → imposible en 3:1. El isotipo entra al resolver B-8 sin re-cotar la caja (108×36 intacta).
- Enlace: `href="/"` `[P] PLANOS §2.3` "logo→/". Nombre accesible: `aria-label="ScanSayDone — ir al inicio"` (29 car.) `[propuesta]`.
- Extremo izquierdo exacto: el borde del lockup coincide con x 150 a 1440 (criterio A3).

### A.4 Ítems, decisiones de enlace y CTA

`[P] PLANOS §2.3`: `NAV fijo (logo→/ · Precios · FAQ · CTA)`.

**Decisión (a) — "FAQ": enlaza al ancla `#faq` de la home, no a `/faqs`.**
- Hecho verificado: `src/app/(marketing)/faqs/page.tsx` son 3 líneas renderizando `<h1>Preguntas frecuentes</h1>` `[as-built]` = placeholder vacío. `D10` (`L1 §11`: "un enlace a una página vacía es la equivalencia navegable del estado de éxito falso") prohíbe enlazar destinos vacíos.
- La banda 8 **sí existe** con `id="faq"` `[as-built] faqs.tsx:78]` y su contenido es real (copy firmado hoy por el operador).
- Ruta de destino: **home**. Ya estando en la home: salto a ancla en la misma página (sin recarga). Desde cualquier otra ruta del grupo marketing: `/faq` → se escribe **`/#faq`** (ruta + hash): el navegador carga la home y desplaza a la banda.
- Estado activo: **nunca** — `[P] UX-SPEC §2.1` "los ítems de ancla nunca se marcan activos". Sin `aria-current` en FAQ.

**Decisión (b) — "Precios": el ítem NO se publica en esta primera barra (sin nodo en el DOM).**
- `léelo y decide`: `/pricing` son 3 líneas con `<h1>Precios</h1>` `[as-built]` = placeholder. La banda 7 de precios no está publicada (`showPricing=false`, `[P] PLANOS §6` fila `05-precios.svg` y §2.3 "fuera del DOM con flag false") y no existe ancla `#precios`.
- Conflicto directo con `[P]` ítem "Precios" del canon: **D10 gana**. Precios es el único ítem canónico con **las dos puertas vacías a la vez** (banda fuera del DOM y página placeholder) y su contenido depende de decisiones sin firmante de diseño (B-7: montos, `[precio]`; el propio `PLANOS §5` anexo no lo toca).
- Registro de conflicto con owner: **C-55** (§6). Reentrada: cuando `/pricing` tenga contenido firmado (o la banda 7 se publique), el ítem entra como **una línea de JSX** en el orden `[P]`: logo → Precios → FAQ → CTA; `active` solo por coincidencia exacta de ruta (`[P] UX-SPEC §2.1`).

**Decisión (c) — CTA: dos fases. Fase 1 (esta barra): destino `#encuesta-demo`, label firmado del hero. Fase 2 (lote A): `Entrar → /entrar`, decisión del operador.**
- `Candidato /entrar`: verificado — la ruta existe pero son 3 líneas con `<h1>Ingresar</h1>` `[as-built]` = placeholder. Publicar hoy la barra con CTA→`/entrar` **viola D10** (destino vacío).
- Además `[P] UX-SPEC §9` N-18: "La ruta `/entrar` enlazada desde el navbar antes de que exista el panel" está en la lista **NO PORTAR** (`LOGIN-UX §10`: no se agrega Entrar al navbar hasta que exista el panel — y el panel es etapa P bloqueada por `B-6`/`G-3`).
- Por eso: **Fase 1** — el CTA de la barra enlaza a **`#encuesta-demo`** (existe `[as-built] survey-card.tsx:61`, con `tabIndex={-1}`; el único destino firmado y con contenido de este lote) y **reutiliza exactamente la label del hero: `Ver una encuesta de ejemplo` (27 car.)** `[P]` copy L1 cerrado hoy. Cero copy nuevo; consistencia CTA repetido (`[P] PLAN-FRONTEND §7` "CTA repetido y consistente; mismo destino que el hero" fila L7). Coherencia con la restricción coral: a 0 px de scroll la página muestra **un** coral (hero) y la barra un bordado — nunca dos corales.
- **Fase 2** — cuando el lote A entregue `/entrar` con contenido, el operador decide el cambio a `Entrar → /entrar` (label 6 car. `[propuesta]`). La contradicción N-18 vs. coherencia de lote queda registrada: **C-56** (owner operador; patrón U9 de L1: reentrada decidida, no automática).

**Carácter del CTA (restricción de coral) — recomendación + los tres pares de contraste.**
El canon ata "máximo 1 CTA coral primario visible por pantalla" y "nunca dos CTAs coral visibles a la vez" `[P]`; el hero tiene el suyo cerrado. Las tres opciones del brief, medidas (fórmula WCAG, cálculo propio de esta sesión; los pares que existen coinciden con `UX-SPEC §3.B [V]`):

| opción | receta | contrastes del par | veredicto |
|---|---|---|---|
| **O1 — bordado secundario (RECOMENDADA)** | borde 2 px `text-primary`, label `text-primary`, fondo transparente sobre la barra crema; hover `bg-surface-elevated`; pressed `bg-surface-dark` + label `on-dark` | label ink/crema **14.28** ✓; borde ink/crema **14.28** ✓ (≥3 componente); hover ink/elevada **12.82** ✓; pressed on-dark/dark **14.28** ✓ | cumple hoy y siempre: **cero coral en la barra, cero lógica nueva**. Es el vocabulario de estados **ya servido** (`how-it-works.tsx:48 [as-built]`: mismo ghost, mismos estados) → consistencia sin inventar |
| O2 — solo texto | label `text-primary` 15/600, subrayado solo en hover | label/crema **14.28** ✓; subrayado no es señal de botón (riesgo 1ª ley Krug: "no parece accionable") | válida como respaldo si el operador odia el doble marco en la barra; inferior en affordance |
| O3 — coral tras cierto scroll | relleno `interactive-primary` solo cuando el coral del hero sale del viewport | label ink/coral **5.61** ✓ texto; **pero** coral/crema **2.55** ✗ < 3.0 para el borde del componente; y exige JS de scroll | **RECHAZADA por tres vías independientes**: (1) la frontera del botón sobre crema falla el 3.0 de no-texto; (2) `[P] UX-SPEC §2.1`: navbar "**sin estados por scroll ni JS**"; (3) presupuesto de movimiento: "0 JS de efectos nuevos" `[P] EFECTOS §4` |

O1 no toca el coral del hero ni lo justifica retirarlo: el hero está cerrado y se respeta.

### A.5 Comportamiento fijo, `main pt 76` y desplazamiento de anclas

- Header `fixed` + `main { padding-top: 76px }` `[P]`. El `main` del grupo marketing pasa a `<main id="contenido" tabIndex={-1} className="flex-1 pt-[76px]">` (§7).
- **Consecuencia obligatoria que este plano declara (C-59):** hoy las secciones con `id` usan `scroll-mt-4` (16 px) `[as-built]`: `how-it-works.tsx:29`, `channels.tsx:111`, `applications.tsx:41`, `panel-preview.tsx:15`, `faqs.tsx:80`; y `#encuesta-demo` (`survey-card.tsx:61`) **no tiene ninguna**. Con una barra fija de 76 px, todo salto a ancla entierra la cabecera de la banda bajo la barra. Con la barra, las anclas del brief (`#canales`, `#aplicaciones`, `#faq`, `#encuesta-demo`) necesitan **`scroll-mt-[92px]`** (76 de barra + 16 del respiro documentado, `[propuesta]`). El cambio es **una clase por componente; cero cambio visual de las bandas** (sus alturas, ritmos y ejes intactos). Sin esto, la decisión (a) FAQ→ancla es geometría muerta.
- La barra **no cambia nunca**: fondo, borde y altura idénticos a 0 px y a 5000 px de scroll `[P] sin estados`.
- CLS: header fijo + `pt` estático → cero desplazamiento en carga; LCP sigue siendo el texto Bebas del hero `[P] IMAGENES §1`.

### A.6 Colapso por debajo de `lg` (992) — burger + offcanvas

`[P] UX-SPEC §2.1`/`PLANOS §2.4`: "nav horizontal (bajo lg: burger)"; "nav → burger + offcanvas" a 375. Corte exacto en `lg = 992` (breakpoint ya overrideado en `globals.css:27 [as-built]`).

**Barra móvil (375):** `[logo 108×36 en x 16] ……. [burger 44×44 en el extremo derecho]`. El orden burger-izquierda del panel (`DASHBOARD-UX §8`) no aplica: el canon del lockup es "extremo izquierdo del container" `[P]` a todo bp.

**Burger:** `button` 44×44, borde 2 px `text-primary` (14.28 ✓), icono **SVG inline propio** de 3 trazos de 2 px, 20×20, `aria-hidden="true" focusable="false"` — misma solución con la que L4/L5 esquivaron **B-4** (set de iconos sin decidir); si el operador fija el set, el path se sustituye sin re-cotar. `aria-expanded`, `aria-controls="nav-movil"`, `aria-label="Abrir menú"` (10 car.).

**Offcanvas (drawer):**
| atributo | valor | fuente |
|---|---|---|
| superficie | `surface-default` blanco + borde izquierdo 1 px `border-mid` (4.68 sobre blanco ✓) | `[P]` patrón drawer `DASHBOARD-UX §8` portado |
| geometría | `fixed inset-y-0 right-0`, ancho `w-[343px]` capped `max-w-[calc(100vw-2rem)]` (a 375: 343 = 375−2·16, coincide con el content móvil documentado `[P]`), alto completo; encabeza con su propia fila de 76 px (label "Menú" + cerrar) para que el canto derecho del drawer reemplace visualmente el canto derecho de la barra | `[propuesta]`; el modelo completo (Esc, foco atrapado, retorno) es `[P] DASHBOARD-UX §8` para el drawer del panel |
| contenido | FAQ (`/#faq`… desde la propia home `#faq`), CTA a **ancho completo, h ≥ 48** `[P] PLANOS §2.4` "CTAs apilados 100 % ancho, h≥48" | el ítem Precios simplemente no existe (C-55) |
| overlay | `bg-surface-dark/55` (mismo hex de token + alfa; scrim **inline, un solo uso, no se nombra token** — patrón `[P] DASHBOARD-UX §11`; el scrim viejo de plum está muerto N-15b). Cierre por clic en overlay permitido **porque existe ruta completa de teclado** (Esc + botón cerrar), regla `[P] UX-SPEC §4 fila Drawer` | `[propuesta]` |
| z | header 40 · overlay 30 · drawer 50 · skip-link 60 | `[propuesta]` |
| estado cerrado | `inert` + fuera de secuencia de foco (React 19 soporta `inert`; cero librerías — `focus-trap-react` vetado `[P] LOGIN-DECISIONES §1`) | `[propuesta]` |
| animación | `motion-safe` translate X 200 ms solo `transform`; G-16 sigue abierto (la duración "350 ms" era default de Bootstrap y ya no existe): valor fijado `[propuesta]`, owner `frontend-alibaba` → C-62; con `prefers-reduced-motion` el drawer aparece **sin desplazamiento** (presupuesto `[P] EFECTOS §4`) | |

```
1440 (xl)                       375 (xs)                         drawer abierto (375)
┌─ crema ────────────── hilo 1px ─┐   ┌─ crema ────────────────┐   ┌───────────┐▓▓▓▓▓▓▓▓
│ [ScanSayDone]      FAQ [CTA-borde]│  │ [ScanSayDone]    [≡] │   │ Menú  [✕] │▓ overlay ▓
│  x=150            x≈1290        │   │  x=16           44×44 │   │ FAQ       │▓▓▓▓▓▓▓▓▓▓
└─────────────────────────────────┘   └───────────────────────┘   │ [CTA 100%]│  main inert
  main pt-[76px]                                                  └───────────┘
```

---

## A11Y. PIEZA A — accesibilidad (obligatorio, binario)

1. **Skip-link = primer nodo focable de la página** (antes del `header`): `href="#contenido"`, `sr-only` en reposo, al recibir foco: fijo arriba-izquierda, caja `bg-surface-elevated` + borde 2 px `text-primary` + label ink "Saltar al contenido" (19 car.), hit ≥44. Destino: `main id="contenido" tabIndex={-1}`. El foco real sobre `main` muestra el anillo firmado (marco interior de 3 px sobre todo el `main`): se acepta como indicador honesto de "el salto ocurrió"; **no se aplica `outline-none`** al `main` (a diferencia del precedente `#encuesta-demo [as-built]`, que sí lo usa y ya está registrado para re-verificación en gate).
2. **Landmarks exactos:** `header` (implícito) > `nav aria-label="Navegación principal"` (lista desktop) · `main` · `footer` (implícito, pieza B). Un solo `nav` en el árbol por viewport: la lista desktop es `display:none` bajo `lg`, el drawer (fuera del `nav`, dentro de `header`) lleva su propio `nav aria-label="Navegación del menú"` y existe solo cuando está abierto.
3. **Orden de tab = orden visual (lg+):** skip → logo → FAQ → CTA → contenido del `main`. Sin trampas, sin `tabindex` > 0.
4. **Teclado del offcanvas (patrón `[P]` heredado del drawer del panel, `DASHBOARD-UX §8/§9` portado):** `Esc` cierra · foco **atrapado** en el drawer (ciclo cerrar → ítems → cerrar; implementación propia con trampa manual sobre `inert`/foco, cero librería vetada) · al cerrar, el foco **vuelve al burger** · el contenido tras el overlay queda `inert`. Burger refleja estado: `aria-expanded="true|false"` y el ícono cambia de forma (≡ → ✕): el estado se comunica por **expansión + forma**, nunca solo por color `[P] CANON §4`.
5. **Estado activo:** regla canónica portada `[P] UX-SPEC §2.1`: `aria-current="page"` **solo por coincidencia exacta de ruta**; los ítems de ancla (FAQ) **nunca** se marcan activos. En la barra de hoy ningún ítem de ruta existe (FAQ es ancla; Precios no navega; CTA es acción) → la regla queda escrita para cuando Precios entre: estilo activo = peso 600 + subrayado 2 px de grosor (señal **de forma**, nunca solo color).
6. **Anillo firmado (no se reabre):** `outline: 3px solid #1A181B` con `outline-offset: -3px` (hacia dentro), decisión del operador de hoy.Visible sobre las tres superficies del chrome: crema **14.28**, blanca (drawer) **17.64**, elevada (skip) **12.82** ✓ ≥3. Sin transición del anillo (foco instantáneo `[P] EFECTOS §4`). El offset negativo era además la recomendación del acta de L6 (F-1): en controles con borde propio (CTA, burger, skip) el anillo hacia dentro **no choca con el marco** — la colisión que L6 reportó no se importa a esta pieza.
7. **Targets ≥ 44** en todo nodo de la pieza: skip 44 · logo-hit 44 (caja visible 36) · FAQ 44 · CTA de barra 44 · burger 44×44 · cerrar 44×44 · ítems drawer 44 · CTA drawer 48 `[P]`.
8. **`prefers-reduced-motion`:** el único movimiento de la pieza es el translate del drawer; con reduce → sin desplazamiento (0.01ms global del presupuesto `[P] EFECTOS §4`); el header y los estados no se animan nunca (el botón solo transiciona color 120–150 ms, patrón `[propuesta]` servido de L2/L3).
9. **Contraste de la pieza (tabla):**

| par | ratio | umbral | ✓/✗ |
|---|---|---|---|
| label FAQ ink / barra crema | 14.28 | 4.5 texto | ✓ |
| wordmark ink / crema | 14.28 | 4.5 (16 px semibold) | ✓ |
| borde 2 px CTA/burger / crema | 14.28 | 3.0 componente | ✓ |
| label sobre hover `surface-elevated` | 12.82 | 4.5 | ✓ |
| label pressed `on-dark` sobre `surface-dark` | 14.28 | 4.5 | ✓ |
| borde inferior `border-mid` / crema | 3.79 | 3.0 línea de separación | ✓ |
| anillo ink sobre crema | 14.28 | 3.0 foco | ✓ |
| drawer: label ink / blanco | 17.64 | 4.5 | ✓ |
| (descartado) label `interactive-hover` / crema | 2.25 | — | ✗ — por eso ningún hover coral entra en la barra |

---

## B. PIEZA B — FOOTER (banda 10)

### B.1 Estructura — decisión D-3 / G-10 (dueño: designer-alibaba; decido aquí, firma en acta)

El conflicto: el plano `[P] 07-footer.svg` dibuja **4 × `3 col` = 267** y lo servido `[M legacy]` es **marca + 3 columnas** (`PLANOS §2.1` fila 10, `§8 D-3`, `UX-SPEC §7 G-10`; el SVG marcado OBSOLETO en `wireframes/INDEX.md` l.52 no se abrió ni se usa como verdad visual).

**Decisión [propuesta]: el grid del plano SÍ, la semántica del servido SÍ — son la misma aritmética.** 4 celdas de `span-3` = 267 sobre el `mkt-xl` 1140, y **la primera celda es la marca**, no una cuarta columna de enlaces:

- `4×267 + 3×24 = 1140` ✓ cierre exacto `[D]` sobre la fórmula `[P] GRID-SPEC §1/§2` (col xl 73; el mismo cierre que `PLANOS §2.1` imprimió para la fila 10: x 150–417 / 441–708 / 732–999 / 1023–1290).
- Forma leída del sitio servido: marca + 3 columnas ✓.
- El "conflicto" era de **etiqueta, no de geometría**: "4 columnas de enlaces" es insostenible con el inventario honesto de destinos (§B.4); "marca + 3 columnas con anchos libres" no cierra ningún span `[P]`. Con marca-span-3 ambas lecturas cierran.
- Registra el desfase vs. `[M legacy]`: en el servido la columna de marca era más ancha; este plano la recota a 267 — **cambio de estructura del pie es lote nuevo por definición**; la comparación numérica contra 434 es `[M legacy]`, no meta (B-10). C-57.

Reflujo (orden de colapso `[P] PLANOS §2.4`: "footer columnas→apiladas", el penúltimo en plegar antes del nav): **xs–md 1 col → lg 2×2 → xl 4 en fila** — el mismo patrón documentado de la fila 4 (canales: 1→2×2→4 `[P]`). En 2×2 a lg las celdas quedan en 468 (= `col-lg-6` `[P]`), y en 1×1 las celdas a 375 miden 343 (content documentado).

### B.2 Superficie, separación y por qué NO oscuro

| atributo | valor | razón |
|---|---|---|
| fondo | `background-page` #F7E5C8 (crema de la paleta firmada) | la línea de `UX-SPEC §3.2` (registro viejo) dice explícitamente **"el footer ya no es oscuro"**: H-1 decidió crema para el pie y esa decisión de estructura sobrevive a la supersesión de paleta — lo que cambia es el hex del crema: `#FFF8F2` murió (N-15b) y su sucesor canónico es `background-page` |
| borde superior | 1 px `border-mid` | la banda vecina es blanca y crema↔blanco mide **1.24** `[V] §3.B-13` = frontera inválida → la separación **necesita borde** (`[P] CANON §4` "las tarjetas se separan con borde"; regla P0 "dos fondos iguales nunca adyacentes" también se respeta: 8 blanca → 10 crema ✓). La línea mide 3.79/4.68 sobre sus dos caras ✓ ≥3 |
| alternativa oscura (superficie `surface-dark` + `on-dark`) | **RECHAZADA y documentada** | los textos pasarían (on-dark/crema-viejo→dark **14.28** ✓; `on-dark-secondary` **9.01** ✓; `border-mid` sobre dark **3.77** ✓; **pero** el anillo firmado **3 px `text-primary` sobre `#1A181B` mide 1.00 → foco invisible = violación bloqueante 2.4.7 con la decisión firmada hoy intacta** (no se reabre el anillo; es la superficie la que debe ceder). Además `text-secondary` sobre oscuro = **2.41 ✗** obligaría a retirar el rol secundario. C-60 deja la condición: si el operador quiere pie oscuro algún día, necesita antes un rol de anillo sobre superficie oscura (SD-14) |

**Contra la banda vecina:** la secuencia servida 6 crema → 8 blanco → 10 crema alterna sin repetir ✓ (patrón `[as-built]` verificado en las clases `bg-*` de los componentes banda a banda).

### B.3 Padding, ritmo y altura

| cota | desktop (≥768) | móvil (<768) | fuente |
|---|---|---|---|
| pt | **100** | **60** | `[P] UX-SPEC §2.1` fila 10 / `PLANOS §2.2` (ritmo de banda `--band-y-d/m`) |
| pb | **48** | **40** | `[P]` spec; el pb 16 `[M legacy]` es del DOM Bootstrap (B-10) → **D-4 no se "mide" aquí: se publica según spec y el gate re-mide**; C-58 |
| barra legal | a **14 px** de tipo (Montserrat 400/14 = rol meta `[P] UX-SPEC §3.3`) | ídem | `[P] PLANOS §2.2` "barra legal 14" |
| separador | fila de enlaces → barra legal: `mt-48 + borde 1 px + pt-24` | ídem | `[propuesta]` (48 = sp-6 documentado; 24 = 1 gutter) |

**Altura estimada `[D aritmética, sin medir]`** — referencia, no meta:
- desktop: 100 + fila (máx celda: Producto = heading 16 + 12 + 4×44 = **204**) + 48 + 24 + línea 21 + 48 = **≈ 445 px** (vs `[M legacy]` 434; Δ +11 por targets de 44 y pb 48 de spec).
- móvil: 60 + (186+40)+(204+40)+(72+40)+(89+40) + 93 + 40 ≈ **908 px** `sin medir`.

### B.4 Contenido por celda — inventario honesto (solo destinos con contenido real)

Regla matriz: **ningún href del pie apunta a placeholder** (D10 portado al footer; los 8 internos verificados `[as-built]`: `/aboutus` `/services` `/privacy` `/terms` `/faqs` `/pricing` son 3 líneas con solo su `h1`; `/contactus` es el único con contenido mínimo real — 12 líneas con la declaración de canal pendiente firmada hoy).

**Celda 1 — Marca (267):**
- Lockup 108×36 **como texto vivo, estático** (no es doble enlace: el enlace a `/` pertenece a la barra; en el pie el lockup es div, criterio `[P]` del panel "el logo es el enlace… no se duplica" portado por analogía) `[propuesta]`.
- Tagline: **`ESCANEA. OPINA. LISTO.`** (22 car.) Bebas 32 mayúsculas, 2 renglones — `[P] UX-SPEC §5.1 regla 10`: la bajada vive **solo donde la marca se presenta (footer, piezas, OG)**: el footer es su colocación canónica y no se inventa nada. ≥32 y mayúsculas → cumple `CANON §5`.
- Descripción: `Encuestas de satisfacción por QR para restaurantes y comercios.` (63 car.) Montserrat 400 14 `text-secondary` — **la cadena ya servida** en `layout.tsx:20 [as-built]` (metadata description): no se inventa, se reutiliza. `[propuesta]` reuso.
- **Cero redes sociales** (no existen → prohibido inventar), **cero domicilio/RUT/correo/teléfono** (no existen → §B.6).

**Celda 2 — "Producto" (heading 13/600 .14em MAYÚS + 4 enlaces, todos `/#ancla` con destino real):**
| label | car. | href | destino existe |
|---|---|---|---|
| `Cómo funciona` | 13 | `/#como-funciona` | ✓ `how-it-works.tsx:27 [as-built]` |
| `Canales` | 7 | `/#canales` | ✓ `channels.tsx:109 [as-built]` |
| `Aplicaciones` | 12 | `/#aplicaciones` | ✓ `applications.tsx:39 [as-built]` |
| `Preguntas frecuentes` | 20 | `/#faq` | ✓ `faqs.tsx:78 [as-built]` |
(Ningún enlace a `/faqs`, `/pricing`, `/panel`, `/e/…` — D10/G-1/B-6. La demo `#encuesta-demo` queda en barra y hero; el pie no repite acciones.)

**Celda 3 — "Contacto":** heading + enlace `Contáctanos` (11) → `/contactus` — label que coincide con el `h1` del destino `[P] UX-SPEC §5.1 regla 5: "el verbo coincide con el H1 de su destino"]`, destino único con contenido real (declara el canal pendiente, decisión firmada hoy; C-51/B-5 heredados: **el destino existe, el canal sigue bloqueado — no se redacta ningún correo**).

**Celda 4 — "Legal":** heading + **una frase, cero enlaces hoy**: `Las reglas de uso y la política de privacidad se publicarán una vez completada la revisión legal.` (97 car., 14 `text-secondary`) — patrón aprobado para lo legal `[P] UX-SPEC §5.1 regla 7` ("oración que declara la publicación futura", no corchetes, no `[confirmar]`). Los enlaces `/privacy` y `/terms` **entran cuando las páginas tengan cuerpo** (etapa I); hoy son placeholder → D10. La celda no queda vacía porque el texto declara, igual que la banda 6 declara su marco vacío. C-64.

### B.5 Recetas visuales del pie (todos los pares calculados esta sesión)

| elemento | receta | sobre crema | umbral |
|---|---|---|---|
| headings de columna | Montserrat 600 13 MAYÚS `tracking-[0.14em]` `text-primary` (rol overline `[P] UX-SPEC §3.3`) | 14.28 | 4.5 ✓ |
| enlaces | Montserrat 400/500 15 `text-primary`, subrayado siempre visible `decoration-border-mid` (receta de enlace `[propuesta]` de `UX-SPEC §3.E` "text-primary + subrayado, sin hex nuevo" — rol `--link` sigue `sin dato`, SD-14; es la misma receta que usó L6 bajo C-48) | texto 14.28; decoración 3.79 | 4.5 ✓ / 3.0 ✓ |
| hover de enlace | el subrayado **engrosa** (decoration 1→2 px): señal de forma, no de color `[P] CANON §4` | — | — |
| tagline | Bebas 400 32 lh 0.95 `text-primary` | 14.28 | 3.0 grande ✓ |
| descripción / barra legal | Montserrat 400 14 `text-secondary` | 5.93 | 4.5 ✓ |
| `©` línea | `© {año} ScanSayDone` (año dinámico; 14) `text-primary` | 14.28 | ✓ |
| separadores (borde superior del pie, regla de la barra legal) | `border-mid` 1 px | 3.79 | 3.0 ✓ |
| anillo de foco | firmado: 3 px `text-primary` offset −3 | 14.28 | 3.0 ✓ |
| **cero** | coral, `surface-elevated`, `border-subtle`, sombras, gradientes, `backdrop-blur`, bebas <32 o en minúsculas, **CTA** | — | — |

**CTA vetado del pie:** `[P] PLANOS §2.3` fila 10 "spec: ningún CTA (el servido llevaba uno → §6b #4 lo retiró)". **No se reintroduce**: el pie termina con enlaces de lista y la barra legal. (Criterio B5.)

### B.6 Barra legal sin datos de empresa — cómo se resuelve

**Los datos no existen** (`COPY-INTERNAS §2` los lista como faltantes; `CANON §11` pendiente #5; `B-5`/`G-28` owner operador). Resolución de este plano — **se resuelve vaciando la barra, no inventándola** `[propuesta]`:

```
© {año} ScanSayDone
```
solo eso: signo, año dinámico, nombre de **producto** (que sí existe: es el nombre del build, `layout.tsx:18 [as-built]`). **Sin razón social, sin RUT, sin domicilio, sin correo, sin teléfono.** La jurisdicción y la retención **no se mencionan** (el código legacy las afirmaba sin acta — `G-28`; no se porta). La declaración legal (celda 4) absorbe la expectativa de privacidad/términos. C-64 queda con owner **Operador**: cuando firme razón social + jurisdicción + revisión legal, la barra crece a `© {año} {razón social}. {declaración}` con texto que redacta el acta, no este plano.

---

## 5. Copy propuesto de ambas piezas (conteos y estado)

**Barra (7 cadenas nuevas/derivadas + 1 firmada reutilizada):**

| # | cadena | car. | estado |
|---|---|---|---|
| 1 | `ScanSayDone` (wordmark) | 11 | `[as-built]` nombre del producto ya publicado en metadata; texto vivo `[propuesta]` hasta B-8 |
| 2 | `FAQ` | 3 | `[P]` ítem canónico `PLANOS §2.3`; no es jerga vetada |
| 3 | `Ver una encuesta de ejemplo` (CTA barra, fase 1) | 27 | `[P]` **copy firmado de L1 reutilizado sin tocar** (excede 1 px el slot ≤25 y la overage ya está registrada como U3 de L1; no se crea overage nueva) |
| 4 | `Entrar` (CTA barra, fase 2 — solo si el operador activa C-56) | 6 | `[propuesta]` |
| 5 | `Saltar al contenido` (skip-link) | 19 | `[propuesta]` |
| 6 | `Navegación principal` (aria-label nav) | 20 | `[propuesta]` |
| 7 | `Abrir menú` / `Cerrar menú` (aria-labels) | 10 / 11 | `[propuesta]` |
| 8 | `ScanSayDone — ir al inicio` (aria-label logo) | 29 | `[propuesta]` |

**Pie (11 cadenas):**

| # | cadena | car. | estado |
|---|---|---|---|
| 1 | `ESCANEA. OPINA. LISTO.` | 22 | `[P]` §5.1 regla 10 — colocación canónica |
| 2 | `Encuestas de satisfacción por QR para restaurantes y comercios.` | 63 | `[as-built]` reuso de la description publicada `[propuesta]` |
| 3–5 | `Producto` / `Contacto` / `Legal` | 8 / 8 / 5 | `[propuesta]` |
| 6–9 | `Cómo funciona` / `Canales` / `Aplicaciones` / `Preguntas frecuentes` | 13 / 7 / 12 / 20 | labels de anclas existentes; sustantivos descriptivos, `[propuesta]` |
| 10 | `Contáctanos` | 11 | `[propuesta]`; calca el h1 del destino (regla 5) |
| 11 | `Las reglas de uso y la política de privacidad se publicarán una vez completada la revisión legal.` | 97 | `[P]` patrón F9 (declaración de publicación futura) |
| 12 | `© {año} ScanSayDone` | 18 fijo + año dinámico | `[propuesta]` |

Barrido de vocabulario vetado (`CANON §7`, `UX-SPEC §5.2`) sobre las 19 cadenas: **cero ocurrencias** de `gratis`/`sin tarjeta`/`tiempo real`/`próximamente`/`en construcción`/`CSAT`/`NPS`/`score`/`KPI`/`dashboard`/`insights`/`feedback`/porcentajes/cifras/tiempos. Cero correos, cero teléfonos, cero redes, cero métricas inventadas. Tuteo y español de Chile en todo (`G-19` sigue abierto como deuda sistémica, no se reabre aquí).

---

## 6. Decisiones abiertas que quedan registradas (resumen operativo)

| decisión | resolución de este plano | estado |
|---|---|---|
| FAQ → ancla o página | **ancla `#faq`** (página es placeholder; D10); nunca activa | decidido, firma |
| Precios | **no navega hoy** (banda fuera del DOM + placeholder + B-7); reentrada de 1 línea al firmar destino | **conflicto C-55** |
| CTA de la barra (carácter) | **bordado secundario** (O1); O2 respaldo; O3 rechazada (2.55 + "sin estados por scroll" + presupuesto JS) | decidido, firma |
| CTA de la barra (destino) | fase 1 `#encuesta-demo` (label firmada del hero) → fase 2 `Entrar`/`/entrar` solo con luz verde del operador a **N-18** | **conflicto C-56** |
| Eje de la barra | **mkt-xl 150** (con bandas 3/4/5 y pie); desfase **32 px vs hero** declarado; ejes intactos | decidido por orden del operador |
| Altura de barra | derivada 76 (20+36+20) `SD-2→` | **C-65** |
| Footer estructura | **marca + 3 columnas sobre el grid 4×267 del plano** (misma aritmética, dos lecturas reconciliadas) | **D-3/G-10 → C-57** |
| Footer pb | spec: 48/40; el 16 `[M legacy]` no es meta | **D-4 → C-58** |
| Footer superficie | crema `background-page` + borde superior `border-mid`; oscuro rechazado por anillo 1.00 | **C-60** |
| Datos de empresa | barra = `© {año} ScanSayDone` únicamente; nada inventado | **C-64** |
| Anclas (`scroll-mt`) | +92 px en 5 bandas y `#encuesta-demo` (1 clase por componente) | **C-59** |

---

## 7. Mapping Tailwind 4 (clases concretas) y qué NO se toca

**Sin tokens nuevos.** Los 16 colores, 6 breakpoints y 5 containers que necesitan estas dos piezas **ya están servidos** en `globals.css:3-41 [as-built]`. Las 76 px no son token: van literales (la retícula del sitio usa valores fijos por breakpoint documentados, `[P] UX-SPEC §3.3` sin `clamp()`, G-15).

### Barra (componente nuevo `components/chrome/site-header.tsx` + `nav-drawer.tsx`)

```tsx
// layout de grupo (marketing)/layout.tsx — reemplazo completo del return
<a href="#contenido" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]
  focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-[8px] focus:border-2 focus:border-text-primary
  focus:bg-surface-elevated focus:px-4 focus:font-ui focus:text-[15px] focus:font-semibold focus:text-text-primary">
  Saltar al contenido
</a>

<header className="fixed inset-x-0 top-0 z-40 h-[76px] w-full border-b border-border-mid bg-background-page px-4">
  <div className="mx-auto flex h-full w-full max-w-mkt-sm items-center justify-between
                  md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
    <a href="/" aria-label="ScanSayDone — ir al inicio"
       className="inline-flex h-11 w-[108px] items-center font-ui text-[16px] font-semibold text-text-primary
                  focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary">
      ScanSayDone
    </a>

    <nav aria-label="Navegación principal" className="flex items-center gap-6">
      <ul className="hidden list-none items-center gap-6 lg:flex">
        <li><a href="#faq" className="inline-flex h-11 items-center rounded-[8px] px-3 font-ui text-[15px]
          font-medium text-text-primary hover:bg-surface-elevated motion-safe:transition-colors motion-safe:duration-150
          focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary">FAQ</a></li>
        {/* Precios: sin nodo en el DOM hasta C-55 */}
        <li><a href="#encuesta-demo" className="inline-flex h-11 items-center justify-center rounded-[8px]
          border-2 border-text-primary px-4 font-ui text-[15px] font-semibold text-text-primary
          hover:bg-surface-elevated active:bg-surface-dark active:text-on-dark
          motion-safe:transition-colors motion-safe:duration-150
          focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary">
          Ver una encuesta de ejemplo</a></li>
      </ul>
      <button type="button" aria-expanded={abierto} aria-controls="nav-movil" aria-label="Abrir menú"
        className="inline-flex size-11 items-center justify-center rounded-[8px] border-2 border-text-primary
          text-text-primary hover:bg-surface-elevated lg:hidden
          focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary">
        <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true" focusable="false">…3 trazos 2px stroke=currentColor…</svg>
      </button>
    </nav>

    <div id="nav-movil" role="dialog" aria-modal="true" aria-label="Menú" inert={!abierto}
      className={"fixed inset-y-0 right-0 z-50 w-[343px] max-w-[calc(100vw-2rem)] border-l border-border-mid bg-surface-default" +
        (abierto ? " translate-x-0" : " invisible translate-x-full") +
        " motion-safe:transition-transform motion-safe:duration-200"}>
      <div className="flex h-[76px] items-center justify-between border-b border-border-mid px-4">
        <span className="font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-text-primary">Menú</span>
        <button aria-label="Cerrar menú" …/>
      </div>
      <nav aria-label="Navegación del menú"><ul>…FAQ h-11… CTA w-full h-12…</ul></nav>
    </div>
    {abierto && <div className="fixed inset-0 z-30 bg-surface-dark/55" onClick={cerrar} />}
  </div>
</header>

<main id="contenido" tabIndex={-1} className="flex-1 pt-[76px]">{children}</main>
```

*Nota del anillo:* `outline-offset-[-3px]` literal; si el implementador prefiere `-outline-offset-3` (Tailwind 4 genera negativo en el namespace), ambos compilan al mismo computed −3 px — el gate verifica el **computed**, no la clase. Las bandas servidas cambian **solo** su clase de scroll: `scroll-mt-4 → scroll-mt-[92px]` (5 archivos) y `survey-card.tsx:61` **gana** `scroll-mt-[92px]` (hoy no tiene).

### Pie (componente nuevo `components/chrome/site-footer.tsx`)

```tsx
<footer className="w-full border-t border-border-mid bg-background-page px-4 pb-10 pt-[60px] md:pb-12 md:pt-[100px]">
  <div className="mx-auto w-full max-w-mkt-sm md:max-w-mkt-md lg:max-w-mkt-lg xl:max-w-mkt-xl">
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 lg:grid-cols-2 xl:grid-cols-4">
      {/* celda marca 267 */}
      <div>
        <div className="flex h-9 w-[108px] items-center font-ui text-[16px] font-semibold text-text-primary">ScanSayDone</div>
        <p className="mt-4 font-display text-[32px] uppercase leading-[0.95] tracking-[0.01em] text-text-primary">ESCANEA. OPINA. LISTO.</p>
        <p className="mt-3 font-ui text-[14px] leading-[1.45] text-text-secondary">Encuestas de satisfacción por QR para restaurantes y comercios.</p>
      </div>
      {/* celdas de columnas */}
      <div>
        <h2 className="font-ui text-[13px] font-semibold uppercase tracking-[0.14em] text-text-primary">Producto</h2>
        <ul className="mt-3 list-none">
          <li><a href="/#como-funciona" className="inline-flex h-11 items-center font-ui text-[15px] text-text-primary
            underline decoration-border-mid hover:decoration-2
            focus-visible:outline-3 focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary">Cómo funciona</a></li>
          …Canales / Aplicaciones / Preguntas frecuentes (mismas clases)…
        </ul>
      </div>
      …Contacto (1 enlace Contáctanos→/contactus) … Legal (h2 + párrafo de declaración, cero enlaces hoy)…
    </div>
    <div className="mt-12 border-t border-border-mid pt-6 font-ui text-[14px] text-text-primary">© {año} ScanSayDone</div>
  </div>
</footer>
```

### Qué **NO** se toca

| no se toca | por qué |
|---|---|
| `@theme` de `globals.css` (l.3–41) | **cero tokens nuevos**: las dos piezas usan exclusivamente los 16 colores, 6 breakpoints y 5 containers servidos. `--band-y-*` fuera; nada de `--container-chrome` |
| `body` de `globals.css` | fondo/tipo correctos `[as-built]` |
| reglas de foco globales | no se añade CSS de anillo: las piezas usan utilidades con la receta firmada (3 px / −3 / ink) |
| `hero.tsx` | cerrado por decisión del operador; ni su coral ni sus 182 ni su `outline-2` actual se tocan desde este lote (la uniformización del anillo en bandas previas es decisión de acta ligada a C-48, no de aquí) |
| `page.tsx` | el chrome vive en `layout.tsx`, no en la página: las 6 bandas conservan su orden y alturas |
| alturas/ritmos/fondos de las bandas 1,3,4,5,6,8 | solo cambia `scroll-mt-*` (una clase por archivo, invisible en reposo) — C-59 |
| snapshot `ENTREGA-UX-2026-10-30/**` | congelado (`CANON §8`); `07-footer.svg` **OBSOLETO** (l.52): no se abrió como verdad visual |
| `(auth)`, `(panel)`, `(survey)` | este chrome es **del grupo marketing**: el login del lote A es split full-viewport y no lleva barra (su "Volver al sitio" propio `[P] LOGIN-UX §3`); el panel usa su sidebar/topbar `[P]`. Declarado como límite de alcance |
| `package.json` | cero dependencias nuevas (drawer/trampa de foco propios, React 19 `inert`) |
| `docs/frontend/INDEX.md` | fuera de mi ruta de escritura → C-66 (patrón C-15/…/C-54) |

---

## 8. Criterios de aceptación (binarios; numerados; verificables sin reinterpretar)

**Convención (heredada de L5/L6):** `[cota]` = contra cota documentada (fallar = defecto) · `[propuesta]` = contra lo que este plano propone (fallar = defecto de implementación; la cifra puede cambiar en acta, no en código) · `Cond. firma` = verificable solo si el operador aprueba §5 y las decisiones §6. **Ningún criterio afirma PASS: aquí no corrió nada.**

### Barra

1. `[P]` El DOM de una página marketing tiene, en orden: 1 enlace skip (primer focable), 1 `header`, 1 `main`, 1 `footer`. Cero duplicados de `nav` visible por viewport.
2. `[cota]` El alto computado del `header` = **76** y el `padding-top` computado del `main` = **76** (mismo número, criterio doble).
3. `[cota]` A 1440: el borde izquierdo del wordmark mide **x = 150 ±1** y el extremo derecho del CTA **x ≤ 1290**. A 375: x = 16 ±1.
4. `[cota]` La caja del lockup mide **108 × 36** (±1 alto); su hit de foco ≥ 44.
5. `[P]` La barra fija **no cambia** entre scroll 0 y scroll > 4000 px: `backgroundColor`, `borderBottomWidth`, alto y `y` del header idénticos (aserción Playwright de dos lecturas).
6. `[P]` Cero clases `bg-interactive-*`, `text-interactive-*`, `border-interactive-*` y cero nodos con relleno coral dentro del `header`: **el único coral de la página a 0 px de scroll sigue siendo el del hero** (presupuesto 1).
7. `[decidido]` Los ítems visibles en lg+ son exactamente **2 enlaces: FAQ y CTA** — grep: cero ocurrencias de la palabra `Precios` y cero `href="/pricing"` en el header (C-55).
8. `[cota]` El `href` de FAQ resuelve a la banda 8: en home es `#faq`; desde cualquier otra ruta marketing `/#faq`. Tras activarlo con teclado a 1440, el borde superior de la banda `faq` queda **≥ 76 px por debajo del header** (top banda − bottom header ≈ 16 ±8).
9. `[cota]` El CTA de la barra (fase 1): fondo transparente sobre crema, **borde 2 px**, label `text-primary`, label exactamente `Ver una encuesta de ejemplo`; hover = fondo `#F0D8BD`; pressed = fondo `#1A181B` + label `#F7E5C8`; el `href` es `#encuesta-demo`.
10. `[P]` Bajo 992 el cluster horizontal desaparece (`display:none`) y aparece el burger `44×44`; sobre 992 el burger desaparece. Un solo `aria-expanded` en el documento.
11. `[propuesta]` Burger alterna el drawer: clic/Enter abre con `aria-expanded="true"`, `inert` sale del drawer y entra en el resto; clic en overlay, clic en burger o **Esc** cierran; al cerrar, `document.activeElement` = burger (aserción). Con drawer abierto, `Tab` recorre solo {cerrar, FAQ, CTA} en ciclo (trampa medida, no declarada).
12. `[propuesta]` Cerrado el drawer, sus enlaces **no son focables** por Tab (assert del árbol: `inert`/`hidden`).
13. `[propuesta]` Skip-link: `Tab` #1 lo enfoca desde cualquier inicio de página; al foco se vuelve visible sobre la barra (alto ≥ 44, ancho ≥ 19 car. legibles); su activación mueve el foco real al `main#contenido`.
14. `[Cond. firma]` Anillo firmado en los 6 focables de la pieza (skip, logo, FAQ, CTA, burger, cerrar): computed `outline-width 3px`, `outline-offset −3px`, `outline-color rgb(26,24,27)`; el anillo no se transiciona.
15. `[P]` Todos los targets de la pieza ≥ **44** (medidos con `getBoundingClientRect`; drawer CTA ≥ 48 `[P] §2.4`).
16. `[propuesta]` Con `prefers-reduced-motion: reduce` (emulateMedia): el drawer no desplaza (computed `transition-duration` ~0) y sigue abriendo/cerrando.
17. `[cota]` Cero scroll horizontal a 320/375/576 con barra y drawer abierto o cerrado.
18. `[cota]` Cero `box-shadow`/`filter`/`backdrop-blur`/gradiente en cualquier nodo del header o drawer; cero `aria-current` en FAQ (ítem de ancla nunca activo `[P]`).
19. `[cota]` Cero enlaces desde el header a `/panel`, `/e/…`, `/pricing`, `/faqs` (grep = 0). El único destino de fase 1 es `#encuesta-demo`; cero URLs inventadas.
20. `[propuesta]` Contraste: axe color-contrast sin violaciones nuevas con la barra montada; los 9 pares de §A11Y.9 son la tabla de referencia del auditor.

### Pie

21. `[cota]` A 1440 el grid del pie cierra **4 celdas de 267 + 3 gutters de 24 = 1140** en x 150–1290 (aserción de anchos de las 4 celdas). Reflujo: 1 col < 992 · 2×2 en 992–1199 · 4 en fila ≥ 1200.
22. `[cota]` `padding-top` computado del `footer` = **100** (≥768) / **60** (<768); `padding-bottom` = **48** / **40** (D-4 resuelto por spec; C-58 re-mide en acta).
23. `[cota]` El pie lleva borde superior 1 px color `rgb(138,111,85)`; el color de fondo del pie = `rgb(247,229,200)`; la banda vecina (8) sigue `rgb(255,255,255)` → secuencia blanco→crema con línea de separación real.
24. `[decidido]` **Cero CTA en el pie**: ningún nodo `button`; ningún enlace con fondo propio (elevada, ink o coral); la única "caja" del pie es tipografía y reglas. grep: `bg-interactive|bg-surface-dark|rounded-*[ ]*(w-full|h-12)` sobre el componente = 0.
25. `[cota]` Los enlaces del pie son exactamente los **5** de §B.4 (`/#como-funciona`, `/#canales`, `/#aplicaciones`, `/#faq`, `/contactus`). Cero `href` a `/privacy`, `/terms`, `/pricing`, `/faqs`, `/entrar`, `/panel`, `/e/…` hoy (D10). Cada destino con ancla existe en el DOM de la home (gate con Playwright, aserción `querySelector`).
26. `[cota]` La barra legal contiene solo `© {año} ScanSayDone`: grep del componente = **cero** ocurrencias de `@` (correo), `RUT`, dígitos de teléfono, `razón social`, dirección; cero redes (grep `https?://` = 0 en el pie).
27. `[propuesta]` La celda Legal muestra la cadena de declaración de §B.4 íntegra (grep cadena exacta) y cero enlaces bajo su heading hasta la etapa I.
28. `[cota]` Tagline: única ocurrencia en el sitio fuera de metadata; `font-display`, mayúscula, 32 px exactos; cero Bebas en ningún otro nodo del pie con < 32 px (`CANON §5`).
29. `[Cond. firma]` Los 4 pares de contraste de §B.5 sostenidos en render (ink/crema 14.28; secundario/crema 5.93; ink/blanco para el anillo drawer no aplica aquí; decoración border-mid 3.79) — axe sin violaciones nuevas en la vista con pie.
30. `[cota]` Orden de foco en el pie = orden visual = orden DOM: marca → Producto → Contacto → Legal → barra; targets de enlaces h-11 (44); anillo firmado 3/−3 ink en los 5 enlaces.
31. `[propuesta]` Jerarquía de headings con el pie montado: 1 `h1` + 6 `h2` de bandas + **3 `h2` del pie** + sus listas; axe `headings-order` = 0 saltos; el `h2` "Legal" no introduce `h3` falsos.
32. `[cota]` Cero hex fuera de los 16 tokens, cero `shadow-*`, cero `animate`, cero `backdrop-blur`, cero `border-subtle` en ambas piezas (grep sobre los dos componentes nuevos).
33. `[cota]` La altura estimada de §B.3 (≈445 desktop) es **referencia, no meta**: la acta re-mide (B-10) y anota la desviación; el criterio binario es que el pie completo (barra legal incluida) sea alcanzable sin scroll trabe en 375 (es decir: cero `overflow` horizontal y vertical razonable — el número exacto vive en el acta).

### No-regresión (lote completo)

34. `[cota]` `git diff` del lote toca exactamente: `site-header.tsx`+`site-footer.tsx`+`nav-drawer.tsx` (nuevos) y sus tests (nuevos), `(marketing)/layout.tsx` (skip+header+main+footer), las 6 líneas `scroll-mt` (`how-it-works/channels/applications/panel-preview/faqs/survey-card`). **Cero cambios** en `globals.css`, `page.tsx`, `hero.tsx` (salvo lo que el propio implementador reporte), snapshot, `package.json`, `index.md`.
35. `[cota]` La batería actual (62 tests reportados por el orquestador `[as-built]`) sigue verde **con una excepción autorizada**: `faqs.test.tsx` criterio "cero `href="#faq"` en el resto de `src/`" (L6 §11.12) **debe** actualizarse porque este lote introduce el enlace desde la barra — el grep se reestrecha a "cero `href=#faq` fuera de componentes de banda y del chrome" (C-63: no es regresión, es el cambio de world-view que L6 previó al escribir "navbar inexistente" en su criterio).
36. `[cota]` axe sigue en 0 violaciones AA a 1440 y 375 **con chrome montado** (corrida del gate; aquí no se afirma, se exige salida pegada).

---

## 9. Conflictos abiertos con owner — y lo que este archivo NO verificó

### 9.1 Conflictos abiertos (L1–L6 dejaron C-1…C-54; este plano abre **C-55…C-66**)

| # | conflicto / decisión | valores | owner |
|---|---|---|---|
| **C-55** | **Precios en la barra.** `[P] PLANOS §2.3` pide el ítem; `D10` prohíbe enlazar destinos vacíos; `/pricing` es placeholder `[as-built]`, la banda 7 no se publica, B-7 (montos) sin firmante. Decidido: **el ítem no navega** hasta que el destino exista. | canon vs honestidad | **PM (B-7) + Operador** |
| **C-56** | **CTA de barra → `/entrar`.** El brief lo señala coherente con el lote A; `N-18 [P]` prohíbe enlazar `/entrar` desde la barra "hasta que exista el panel" (etapa P bloqueada por `B-6`/`G-3`); `/entrar` hoy es placeholder (`D10`). Decidido: fase 1 `#encuesta-demo` + label firmada del hero; fase 2 (luz verde del operador) `Entrar → /entrar`. ¿Se levanta N-18 cuando `/entrar` tenga contenido aunque el panel no exista? **No lo decide este plano.** | canon vs orden de lotes | **Operador** |
| **C-57** | **D-3/G-10 footer.** `[P] 4×267` vs `[M] marca+3`. Decidido (dueño del G-10 es designer-alibaba): **marca en la celda 1 del grid de 4×267** — reconciliación aritmética, no imposición. La recota de la columna de marca (servida era más ancha) es cambio de este lote. | resuelto por decisión, pendiente de firma | **Operador** (firma) |
| **C-58** | **D-4 pb del footer.** Spec 48/40 vs `[M legacy]` 16. Se publica la spec; el número medido es de otro DOM (B-10). | 48 vs 16 vs 40 | **Operador** (acta de gate re-mide) |
| **C-59** | **Scroll-mt.** La barra fija rompe el respiro de anclas: 5 bandas con `scroll-mt-4` y `#encuesta-demo` sin ninguno. Se proponen 92 px (barra 76 + respiro 16). Afecta componentes de lotes **cerrados** — pero solo una clase por archivo, invisible en reposo. | 16 → 92 | **Operador** (autoriza tocar bandas cerradas) |
| **C-60** | **Superficie del pie.** Decidido crema (heredero de H-1; anillo firmado funciona 14.28). Registro de la condición para un futuro pie oscuro: imposible con el anillo actual firmado (`text-primary` sobre `#1A181B` = **1.00** foco invisible; `text-secondary` = 2.41 ✗); requiere firmar el rol de anillo sobre superficie oscura (SD-14). | crema vs oscuro | **Operador** |
| **C-61** | **Íconos burger/cerrar.** SVG inline propio (3 trazos / cruz) porque **B-4** sigue abierto (set `md` vs `fi` vs ninguno instalado). Si se firma el set, los paths se sustituyen sin re-cotar. | B-4 heredado | **Operador + frontend-alibaba** |
| **C-62** | **Duración del offcanvas.** "350 ms" era default de Bootstrap y ya no existe (G-16). Se propone 200 ms transform. | sin token propio | **frontend-alibaba** |
| **C-63** | **Criterio 12 de L6** ("cero `#faq` fuera de la banda") queda obsoleto por construcción al existir la barra: actualizar el test es parte del lote, no una regresión. | test vs lote nuevo | **frontend-alibaba** (gate) |
| **C-64** | **Datos de empresa.** Razón social, RUT, domicilio, correo, jurisdicción, retención: **no existen** (`CANON §11 #5`, `B-5`, `G-28`). Barra legal resuelta como `© {año} ScanSayDone` + declaración de futuro para privacidad/términos (celda Legal). Nada inventado; la barra crecerá solo por acta. | datos faltantes | **Operador** |
| **C-65** | **SD-2 → cerrada por derivación:** alto de barra = 76 (20+36+20). Si el operador prefiere otra cota propia (p. ej. 80), cambia header, `pt` y `scroll-mt` a la vez — están casados por contrato A2. | sin dato → 76 `[prop]` | **Operador** (firma) |
| **C-66** | Fila de `docs/frontend/INDEX.md` para este plano, pendiente (fuera de mi ruta; patrón C-15/C-29/C-39/C-46/C-54). | — | **Operador** |

Deudas sistémicas que este plano **hereda sin reabrir**: SD-14/C-48 (roles de enlace/hover/anillo formal — la receta firmada hoy 3/−3/ink se porta tal cual) · B-4, B-5 (canal de contacto), B-7 (precios), B-10/G-24 (toda medida citada como `[M legacy]` es evidencia no reproducible) · G-7/C-12 (radio 8 servido portado) · G-15 (sin `clamp()`, cumplido) · G-19 (disputa español) · G-20 (44 vs 48: 44 barra/pie según canon; 48 CTAs del drawer según `[P] §2.4`; no se unifican aquí) · C-16 ("navbar/skip-link `scroll-mt` condicionado a la barra futura") → **este lote es la barra que C-16 anunciaba**: se cierra su motivo, no su número.

### 9.2 Lo que este archivo **NO** verificó (lista explícita)

1. **Nada ejecutado:** cero build, lint, `tsc`, tests, axe, Playwright, Lighthouse, capturas. **Cero PASS.** Los 62 tests, el axe en 0 violaciones y el hero x=182 son reportes del brief/orquestador `[as-built 2026-11-06]`, no mediciones de esta sesión.
2. **Mediciones propias de esta sesión:** solo lectura estática de `src/` (archivos nombrados con línea) y aritmética: contrastes recalculados con la fórmula WCAG **por mí, en esta sesión, sin instrumento externo** (coinciden con `UX-SPEC §3.B [V]` en los 9 pares que se solapan — verificación cruzada, no re-auditoría); conteos de caracteres por longitud exacta de cadena. Las alturas del pie (≈445/≈908) y el ancho del wordmark Bebas (~158 px) son **derivaciones por avance medio, `sin dato` sin navegador**: los renglones reales del tagline (22 car. en 267 px Bebas 32) y del texto legal (97 car.) se miden en gate.
3. **No abrí ningún raster/SVG-raster:** ni `07-footer.svg` (OBSOLETO — lo cito vía `PLANOS §6` fila 07 y `wireframes/INDEX.md` l.52 que el brief transcribe), ni capturas, ni mockups, ni `image.jpeg`. Cero zai-vision/wan-image en esta sesión.
4. **No re-leí el snapshot congelado** (`GRID-SPEC.md`, `UX-LANDING.md`, `DECISIONES-*.md`, `COPY-LANDING.md`, `COPY-INTERNAS.md`): sus valores llegan **citados por** `UX-SPEC` y `PLANOS` (ambos del 2026-11-05 y dentro del canon). Si el acta de D-3/D-4/G-10 quiere el texto primario, es lectura del operador/auditor.
5. **Contenido de las rutas internas:** verifiqué **placeholder vs con contenido** leyendo los `page.tsx` `[as-built]`; no revisé pantallas (etapa I) ni el estado legal de `/terms`/`/privacy` (B-5, G-28).
6. **Patrón de drawer/trampa de foco:** modelo del `DASHBOARD-UX §8` propio del proyecto; **no** se re-verificó APG/novedad de `inert` en MDN/Context7 esta sesión (el soporte en React 19 lo afirmo como `[propuesta]` de implementación, y el criterio 11 lo verifica en navegador — aserción, no declaración).
7. **El anillo −3 px del hero/servidas:** leí `hero.tsx` con `outline-2 offset-2` `[as-built]` y la acta de L6 con 3/+2; la unificación firmada hoy (3/−3) en bandas previas **no la verifiqué en el árbol actual** (cambios sin commitear del brief); este plano fija la receta solo para sus propias piezas.
8. **Lector de pantalla real:** no probado (NVDA/VoiceOver); el flujo anunciado de §A11Y es derivación del marcado; axe en gate lo cubre parcialmente.
9. **Decisiones de lotes futuros:** la pantalla `/entrar` real (A), el contenido de `/pricing` (PM), la banda 9 (CTA final) y su convivencia con la barra/CTA de barra **no se deciden ni se anticipan aquí**. Si la banda 9 entra, el presupuesto de un coral por pantalla sigue atando: barra bordada, cierre coral — consistente, no resuelto en este archivo.

---

**Sin afirmaciones de PASS.** Este plano propone geometría cerrada sobre cotas `[P]`, el chrome accesible con la receta de anillo firmada **sin tocarla**, copy con conteos y marcas, y criterios binarios; **no** aprueba ni implementa. Las decisiones que mandan: **FAQ→ancla, Precios fuera hasta tener destino, CTA bordado con destino en dos fases, barra en el eje 150 declarando el desfase 32 con el hero, pie crema con marca-span-3 dentro del grid 4×267 y barra legal que confiesa lo que no existe.** El acta del gate la escribe el orquestador siguiendo `L5 §12`/`L6 §13`; ella medirá las 76, el x 150, la trampa de foco, el axe con chrome y la altura real del pie contra sus ≈445.

---

## 10. Acta del gate de implementación — 2026-11-06 (orquestador; no es firma de diseño)

> Registro de lo medido, de los cuatro defectos que el review encontró y de lo que queda abierto.

**Veredicto del reviewer:** APRUEBA CON CONDICIONES — **4 BLOQUEANTE, 6 FAIL de criterio**. Los cuatro bloqueantes se corrigieron antes del commit `7f892e6`; los FAIL restantes son de medición o de política, y quedan abajo.

### 10.1 Lo que se midió (build de producción, Playwright)

| viewport | container barra | x barra | celdas del pie (x:ancho) | pie pt/pb |
|---|---|---|---|---|
| 1440 | 1140 | **150** | **267** en 150 / 441 / 732 / 1023 | 100 / 48 |
| 1400 | 1140 | 130 | 267 | 100 / 48 |
| 1200 | 1140 | 30 | 267 | 100 / 48 |
| 992 | 960 | 16 | **468** (2×2) | 100 / 48 |
| 768 | 720 | 24 | 720 (1 col) | 100 / 48 |
| 375 | 343 | 16 | 343 (1 col) | 60 / 40 |

Barra: alto **76**, fondo crema, wordmark **108×36** con hit de 44, sin coral. Cierre del pie verificado: 4×267 + 3×24 = 1140. Cero scroll horizontal en los seis anchos.

**Menú móvil (375), medido en navegador hidratado:** abre con `aria-expanded="true"` y drawer de 343; `main` pasa a `inert` **solo** mientras está abierto; cierra por el burger, por `Esc` y **al pulsar un enlace de navegación**; al cerrar devuelve el foco al burger. El overlay mide `z-30` (header 40, drawer 50), así que la barra queda iluminada y el burger sigue siendo clicable.

**Ancla:** con `scroll-mt-[92px]`, `#faq` aterriza con la barra despejada (sección a 110, barra termina en 76).

**Server HTML:** `<footer` y la frase legal presentes (el pie es server component).

**Batería:** 84 tests (22 nuevos), `build` 14/14, `lint` 0 errores, `tsc --noEmit` 0, **axe 0 violaciones** en 1440×900 y 375×812 con el chrome montado.

### 10.2 Los cuatro bloqueantes, y qué se hizo

| # | Defecto | Arreglo |
|---|---|---|
| **B1** | El menú no se cerraba al navegar: el usuario quedaba con el drawer abierto y el `main` `inert` **sobre su propio destino** | `onClick={onClose}` en los dos enlaces del drawer, y sin retorno de foco al burger en ese camino |
| **B2** | El burger estaba dentro del `inert` **y** tapado por el overlay: no se podía cerrar con él y su `aria-expanded` quedaba fuera del árbol | `inert` reducido a wordmark + nav de escritorio; burger fuera; overlay de vuelta a `z-30` como fija §A.6 |
| **B3** | Wordmark del pie en **Bebas a 16 px**: el canon solo permite Bebas en títulos ≥32 | receta de §A.3: `font-ui text-[16px] font-semibold`, caja 108×36, cadena `ScanSayDone` sin `uppercase` |
| **B4** | Wordmark de la barra en **Bebas a 24 px por `style` inline**, misma violación y con desborde de ~10 px sobre la caja | misma receta, sin inline style |

**B4 lo introduje yo** en una ronda anterior de esta misma sesión: subí el tamaño a 24 px para que pareciera logotipo sin comprobar la regla de Bebas. El review lo cazó; queda registrado aquí como error del orquestador, no del implementador.

### 10.3 Lo que el gate deja abierto

- **C-67 — la etiqueta del CTA se repite tres veces en la primera pantalla** (barra, hero y encabezado de la banda 3), con el mismo destino y casi la misma receta pero distinto tamaño y distinto anillo. El par barra/hero está justificado; el par barra/banda 3 no fue analizado por el plano. Owner: designer + operador. Respaldo pre-autorizado en §A.4: CTA de barra solo texto.
- **C-68 — el foco no viaja al destino del ancla.** Al pulsar FAQ o el CTA desde el menú, el drawer cierra y la página salta, pero el foco vuelve al burger: el usuario de teclado queda al principio mientras el viewport está en la banda. Arreglo de una clase por banda (`tabIndex={-1}` en las secciones con `id`), misma naturaleza que C-59, pero afecta a cinco lotes cerrados: **requiere autorización explícita**.
- **C-69 — `#encuesta-demo` recibe el foco sin indicador visible** (`focus:outline-none`, decidido en su lote). Este lote cuadruplicó sus puertas de entrada: hero, banda 3, barra y menú. Se resuelve junto con C-68: o los destinos de ancla reciben foco **con** el anillo firmado, o se declara la deuda con fecha.
- **M5 — la brecha del ancla (34 px) no coincide con la que el criterio pedía (16±8)**, y el valor 92 de C-59 se eligió sobre ese supuesto. Hace falta re-medir con `document.fonts.ready` antes de dar el criterio por cerrado.
- **Año del pie:** `new Date().getFullYear()` quedó a alcance de módulo (se evalúa al cargar el módulo, no por render) después de dos intentos. El efecto práctico es que la fecha se congela con el build, que es lo razonable para un sitio estático, pero el comentario y el criterio 26 piden otra cosa: se anota, no se reabre.
- **Desviaciones benignas registradas:** el drawer existe en el DOM estando cerrado (necesario para la transición de 200 ms y para que `aria-controls` siempre resuelva; se compensa con `inert` + `invisible`), el `nav` completo se oculta bajo `lg` en vez de solo su `<ul>`, y el grid del pie usa `gap-6` (24) en lugar del `gap-y-10` del mapping, lo que explica una altura menor que la estimada.
