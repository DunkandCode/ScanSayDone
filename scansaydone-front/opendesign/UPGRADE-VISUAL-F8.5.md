# UPGRADE-VISUAL-F8.5 — qué aprovechar de `featuresMD/redesign.png` sin romper el contrato

> 2026-10-28 · designer-alibaba · scope: solo **dirección visual** del landing ya construido (F0–F8). Cero cambios en encuesta/panel/backend.
> Mandantes: `DESIGN-CONTRACT.md` §1/§3/§4/§6 · `UX-LANDING.md` §2/§3/§5/§6 · `COPY-LANDING.md` §0/§8/§9/§12 · `EFECTOS-Y-MOTION.md` §1–§3 · `DECISIONES-2026-10-27.md` §1/§2 · `wireframes/GRID-SPEC.md` · `VERIFICACION-F2/F6/F8.md`. Análisis de visión: `referencias/ANALISIS-REDESIGN-wan.md`.
> Estado real verificado en código (read-only): `src/app/page.js` y `src/app/assets/scss/_home.scss:345-474, 700-750, 901-910`.

## 0. Corrección al briefing: 5 cosas que la lámina "aporta" y ya están construidas

| Lo que la lámina muestra | Estado real (evidencia) |
|---|---|
| Beneficios en 2 líneas con icono (strip) | **Hecho** — `page.js:79-112`: icono `react-icons` + título 20/600 + body 14 `--text-2` |
| Pasos con línea conectora + badge numerado | **Hecho** — `_home.scss:706-750`: badge coral 40 px Bebas + conector `::before` 2px coral, vertical `border-left` en móvil |
| Badge "3 preguntas" mostaza sobre la tarjeta | **Hecho** — `_home.scss:453-466` |
| Escala con caras 1-5 | **No existe y no debe existir**: lo construido son 5 casillas número + etiqueta verbal (`page.js:38-59`), regla cerrada en `VERIFICACION-F2` |
| Navbar crema con CTA coral | **Hecho** — navbar crema permanente (`fb7d600`, `UX-LANDING §3.1`) |

También falso en el briefing: **el CTA final de la lámina tiene UNA acción** (`CREAR MI ENCUESTA GRATIS`), no dos; dos acciones ya viven en el hero. Y la banda del hero de la lámina **sí lleva foto con un QR impreso** (no solo "un pie de QR") — eso choca con una decisión cerrada (ver fila 4 de §1).

## 1. Veredicto por elemento

| Elemento de la propuesta | Veredicto | Por qué (doc que manda) |
|---|---|---|
| Eyebrow sobre cada sección (7) | **Adoptar con cambios** | Patrón ya existe y cumple: `.apps__kicker` = Montserrat 600 · 12/13 · .14em · MAYÚS · `--text-2` (`_home.scss:901-910`, contrato §3). Pero **no en coral**: coral como texto sobre claro = 2.86/3.01 ✗ (§1 P0). El texto lo fija `COPY-LANDING`, no la imagen |
| "CLIENTES?" del H1 en coral | **Adoptar con cambios** | Coral sobre ciruela = **5.08 ✓** (contrato §1) y a 88 px es texto grande (piso 3.0). Exige enmendar §1 y §6 del contrato y `UX-LANDING §6`, que hoy restringen el coral a "superficie de acción" |
| Kicker con "SUS OPINIONES" en itálica | **Rechazar** | 3.ª familia tipográfica: contrato §3 fija Bebas + Montserrat y nada más; y el kicker aprobado es `3 PREGUNTAS. UN QR. LISTO.` (COPY §1, revisión C4) |
| Foto de un pie de QR + fondo de local | **Rechazar** | Decisión cerrada: "el hero NO lleva QR" (`UX-LANDING §3.1`, `ANALISIS-QR §3` op. A; el QR real entra en F5 con código vivo). Un QR de foto no escanea → rompe la promesa en la zona de mayor exposición. Sin foto real del producto en `ASSET-PIPELINE` |
| Tarjeta de encuesta **solapada** a la banda | **Adoptar con cambios** | El gesto es CSS puro sobre la tarjeta que ya existe (`page.js:30-59`); se toma la **composición**, no la foto que la sostiene |
| Anotación manuscrita + flecha | **Rechazar** | 3.ª voz visual fuera de la lámina de marca (contrato §6, `ANALISIS-REFERENCIAS`); compite con el H1 y pide un SVG nuevo de decoración gratuita (`EFECTOS §1`) |
| Logos de marca (IG/WA/TikTok) recoloreados en coral | **Rechazar** | Contrato §6 fija `react-icons` set `md` como icono; hoy se usan glifos monocromáticos de Feather sobre squircle coral (`page.js:154-191`). La marca oficial en coral = logotipo alterado **y** sugiere profundidad de integración que COPY §12.3 niega (API de TikTok, envío automático) |
| Enlace "Ver cómo funciona" por tarjeta de canal | **Rechazar** | `UX-LANDING §2` fila 4 y §3.4: "ninguno por tarjeta (informativos, no 4 CTAs rivales)". Y el color de la lámina es coral sobre blanco = 2.98 ✗ (§1 P0) |
| 3 fotos de aplicaciones | **Adoptar como está hoy** | F5 construido con `referencias/apps/*.webp` y `apps__kicker`. Rechazar la sustitución "Pantalla de encuesta → Boleta o ticket": exige render nuevo (no existe) y contradice COPY §5 |
| Panel: sidebar de 5 ítems | **Rechazar** | `DECISIONES §1` (acta aprobada): 3 destinos — overview / opiniones / respuestas. Cinco ítems = IA que el proyecto ya enterró |
| Panel: 4 KPI `452 / 4,6 / 12 / 3` | **Rechazar** | `DECISIONES §2` fija OPINIONES · CON COMENTARIO · DÍAS CON RESPUESTA · SIN RESPONDER. Cifras sin rótulo `DEMO` = gate D2 y `npm run check:placeholders` |
| "Satisfacción (NPS)" y "Evolución de satisfacción (NPS)" | **Rechazar** | Métrica equivocada: el producto mide 1-5 y **no calcula NPS**; la jerga está prohibida (COPY §12.2) y "satisfacción %" fue descartado por fallar con n<10 (`DECISIONES §2`) |
| FAQ de 4 con "+" | **Rechazar el recorte** | COPY §8 = 6 respuestas (5 + 1 condicional a `showPricing`), implementado y verificado en F8 con módulo único `data/faq-product.js`. Bajar a 4 borra respuestas aprobadas. El `+` vs chevron es deuda F2 (`_components.scss:480`), no mejora |
| "GRATIS" en el botón + "Sin tarjeta · en minutos · siempre gratis" | **Rechazar** | COPY §9 condiciona "Sin tarjeta" al operador y §12.5 prohíbe "gratis para siempre"; "en minutos" es absoluto cronometrado sin piloto (C2). F8 ya lo retiró (`VERIFICACION-F8`: "Sin 'Sin tarjeta' (no confirmado)") |
| Glow radial decorativo en la banda ciruela | **Adoptar con cambios** | La lámina lo usa "porque sí" (`ANALISIS-REDESIGN-wan` lo señala como tell genérico). Solo es admisible tokenizado y con límite → exige enmendar `EFECTOS §1` (hoy: "cualquier `radial-gradient` fuera de token = 0", y la prohibición de blobs es absoluta) |
| Footer con CTA coral + iconos sociales | **Rechazar** | `UX-LANDING §2` fila 10: footer sin CTA; §6: "como mucho 1 CTA coral primario visible por pantalla" y la banda de cierre ya lo ocupa. Las cuentas sociales no están en el set de enlaces de COPY §10 |
| Ritmo crema↔blanco y banda CTA ciruela | **Coincide** | La lámina respeta la secuencia y pone el footer claro: es exactamente `DECISIONES §4` / acta H-1 |

## 2. Lo que sí da "potencia" sin romper reglas (priorizado)

| # | Intervención | Coste | Riesgo | Cómo se verifica |
|---|---|---|---|---|
| 1 | **Coral en "CLIENTES?" del H1** — un `<span class="hero-title__accent">` + 1 regla con `color: var(--brand-coral)` (sin token nuevo) | ~2 JSX + 4 SCSS | Media-alta por gobernanza, no por código: toca 2 cláusulas P0. Si además hay glow detrás, el par se mide sobre el punto más claro del glow | Ratio escrito en el acta: coral vs ciruela 5.08 ✓ y coral vs peor píxel del glow ≥ 4.5 (piso holgado para 88 px); `grep -iE "#ff5f44" src/app/**/*.scss` sigue = 0 fuera de `_brand-vars.scss` |
| 2 | **Eyebrows por sección** reutilizando el patrón `.apps__kicker` → clase compartida `.section-kicker` (hero ya tiene la suya) | ~6 JSX (1 por sección) + ~10 SCSS (unificar 3 reglas) | Bajo. Riesgo real: **duplicar el subtítulo** (redundancia) y que el texto sea promesa nueva | Color `--text-2` con override de zona oscura; 13/12 px + .14em MAYÚS; cada cadena nace de una enmienda en `COPY-LANDING`, no de la imagen; en móvil el bloque eyebrow+H2 no empuja el CTA fuera del pliegue |
| 3 | **Glow radial tokenizado** en hero y banda de cierre (`--glow-hero`, 1 token, 2 colocaciones, reutilizado con `scaleX(-1)`) | ~2 token + 4 SCSS | Medio: es una **ampliación del presupuesto de efectos**, y el orbe difuminado es un slop-tell (la lámina puntuó 60/100 en el anti-slop check de `ANALISIS-REDESIGN-wan`) | `grep -nE "radial-gradient" src/app/assets/` → 1 hit, la definición en `_tokens.scss`; **ningún número de contraste se declara sin medir**: los ratios se calculan sobre `color-mix(in srgb, $peach 12%, $plum)` y se escriben en el acta; 1 glow por banda, 2 por página, alfa del token = 12 % (techo propio, no promesa) |
| 4 | **Tarjeta del hero solapada al borde de banda** (cruza ciruela→crema; ≥1200 px solo, sin foto) | ~8-10 SCSS (`padding-bottom` de banda −80 px y `margin-bottom:-80px` compensados, `z-index:2`) | Medio: choque con el strip de confianza y overflow vertical en móvil; el `--shadow-card` ya cuenta en el presupuesto de 3 sombras/viewport | ≥1200 px: borde inferior de la tarjeta a ≥ `--sp-4` (24 px) del primer claim; a 375/768 el CSS no aplica (captura idéntica a la de hoy, `git diff --stat` de la fase lo confirma); CLS ≤ 0.02 en el check 3 de `EFECTOS §5` |
| 5 | **Tarjetas de canal con más contraste**: borde `--border-strong` (28 %) en reposo en lugar de `--border` (14 %) | ~2 SCSS + 1 token | Bajo: si se propaga a todas las tarjetas, todo es "caja" | La sombra en reposo sigue siendo 0 (`EFECTOS §2.2`: tarjeta estática = marco sin sombra); solo cambia un `color-mix` ya gobernado por token |

Fuera de F8.5 por coste/beneficio: mini-galería dentro de la tarjeta de canal (piden assets que no existen), segundo gradiente de superficie, cualquier cosa del panel (es captura estática hasta S2). Y el **footer con CTA** que el briefing apuntaba como posible potencia va a §3, no a §2: `UX-LANDING §2` fila 10 fija "ninguno" y §6 permite **1 solo CTA coral visible por pantalla** — ya lo gasta la banda de cierre. Si el operador lo quiere, la forma reglamentaria es un enlace de texto con `--link` (5.65 ✓) en la barra legal o un ghost crema→ciruela sin relleno coral; nunca un segundo botón coral.

## 3. Rechazos con argumento de una línea

| Rechazo | Razón |
|---|---|
| Caras/emoji en la escala del hero | La escala 1-5 con etiqueta verbal y **sin caras** está cerrada y verificada (`VERIFICACION-F2`); encima `COPY §0` prohíbe emoji |
| "NPS" sobre 4,6 | NPS no es una media de 1-5: es una métrica de intención de recompra que el producto **no calcula**; además es jerga prohibida (`COPY §12.2`) |
| `452 / 12 / 3` sin rótulo DEMO | Cifras fabricadas → gate D2 + `check:placeholders`; las KPI reales son las 4 de `DECISIONES §2` |
| "siempre gratis" / "sin tarjeta" | Afirmaciones de precio no confirmadas; `COPY §9` condiciona la línea al operador y §12.5 prohíbe "gratis para siempre" |
| Logos de marca recoloreados | contrato §6 manda `react-icons`; y una marca oficial en coral implica integraciones que `COPY §12.3` niega |
| FAQ a 4 preguntas | `COPY §8` aprueba 6 (5 + 1 condicional) y F8 ya las implementó desde un único módulo; recortar es borrar contenido aprobado |
| Foto + QR en el hero | "El hero NO lleva QR" es decisión cerrada (`ANALISIS-QR §3` A); el QR entra en F5 con código vivo |

## 4. Tokens nuevos

| Token | Valor (Sass, derivado de `_brand-vars.scss`) | Dónde aterriza | Nota |
|---|---|---|---|
| `--glow-hero` | `radial-gradient(64% 52% at 10% 104%, color-mix(in srgb, #{bv.$peach} 12%, transparent) 0%, transparent 70%)` | `_tokens.scss` §4 GRADIENTES | Nuevo; requiere la enmienda de `EFECTOS §1/§2.1`. Sin alfa cruda ni hex suelto: `color-mix` sobre `$peach` |
| `--border-strong` | `color-mix(in srgb, #{bv.$plum} 28%, #{bv.$cream})` | `_tokens.scss` §1 | **No es invención**: `DESIGN-CONTRACT §2` lo define desde F0 y nunca llegó a `_tokens.scss` (hoy solo existe `--border`). Faltan igual `--surface-2` y `--action-selected`; solo se añade el que usa esta fase |
| ~~`--coral-text`~~ | — | — | **No crear.** Sobre ciruela el valor correcto es `--brand-coral` (5.08 ✓) |
| ~~reutilizar `--link`~~ | — | — | **No** para la banda oscura: `--link` #B23A2A sobre ciruela = **2.57 ✗**, no pasa ni el piso 3.0 de texto grande (contrato §4). `--link` sigue siendo el token del acento **sobre claro** (5.65 ✓) |

Sin token de solapado: se deriva de los existentes — `calc(var(--band-y-d) * -0.8)` = 80 px, coherente con la excepción de banda que ya acepta `GRID-SPEC §3`.

## 5. Documentos a enmendar (si se aprueba)

| Doc | Sección | Frase exacta que cambia |
|---|---|---|
| `DESIGN-CONTRACT.md` | §1 regla P0 | Donde dice "el coral **nunca** se usa como color de texto sobre fondo claro" → añadir: "sobre ciruela sí puede ser **texto display ≥44px** (5.08 ✓); sobre claro sigue vetado y se usa `--link`" |
| `DESIGN-CONTRACT.md` | §6 prohibiciones | "Prohibido: coral/mostaza como texto" → "coral como texto solo sobre ciruela y en display ≥44px"; y **reconciliar la mostaza**: el kicker del hero ya es mostaza sobre ciruela (`_home.scss:392`, 8.45 ✓) mientras `UX-LANDING §6` dice "nunca texto" → escribir "mostaza como texto solo sobre ciruela" o bajar el kicker a `--text-2` de zona oscura. Una de las dos, en la misma pasada |
| `UX-LANDING.md` | §6 regla 3 | "Coral solo en superficie de acción (CTA/badge/selección)" → añadir "y énfasis de H1 sobre banda ciruela" |
| `UX-LANDING.md` | §2 filas 1-9 y §3.1 | Columna "contenido" de cada sección: `+ eyebrow/--kicker`; el ASCII del hero: la tarjeta cruza el borde de banda en ≥1200px |
| `wireframes/GRID-SPEC.md` | §3 y §6 (fila nueva R7) | Registrar la excepción de solapado ("la tarjeta del hero puede cruzar el borde inferior de banda ≥1200px; la retícula de columnas no se toca") y marcar `06-faq-cta.svg` como *superseded* (pendiente abierto de `VERIFICACION-F8`) |
| Planos `wireframes/*.svg` | `01-hero.svg` | Glow, acento coral en la 2.ª línea del H1 y solapado: es **la fuente de verdad métrica**, no opcional. `02-como-funciona.svg`, `03-canales.svg`, `04-panel-preview.svg`, `08-aplicaciones.svg`: solo el eyebrow. `05-precios` (no publicado) y `07-footer` (no cambia): intocados |
| `EFECTOS-Y-MOTION.md` | §1 fila "Blobs decorativos" | "cualquier `radial-gradient` fuera de token = 0" → "0 fuera de token; 1 `--glow-*` por banda, 2 por página, nunca bajo texto de contraste < AA recalculado"; y una 4.ª fila en §2.1 con el valor de `--glow-hero` |
| `COPY-LANDING.md` | §2..§9 (una línea de `Kicker:` por sección) + §13 | Las cadenas de los eyebrows son **copy nuevo**: nacen aquí, se listan en §13 como texto a aprobar; no se copian de la imagen ("SIMPLE Y RÁPIDO", "SIEMPRE CERCA DE TUS CLIENTES" no están aprobados) |
| `PLAN-EJECUCION-LANDING.md` | §2 y §5 | Fila F8.5 + recordatorios del gate §3 (los 7 checks aplican igual) y 2 líneas de "definición de terminado" |

## 6. Plan F8.5 (una fase corta, antes de F9)

Bloques **dependientes en orden**; cada uno se acepta solo con los 7 checks de `PLAN-EJECUCION-LANDING §3` + lo suyo.

| Bloque | Contenido | Criterio de aceptación medible | Si no alcanza |
|---|---|---|---|
| **B1 · papeleo** | Enmiendas de §5 (contrato, UX-LANDING, EFECTOS, GRID-SPEC, COPY con los 5 eyebrows) **antes** de tocar píxel | Los 9 textos nuevos aprobados por el operador; 0 regla P0 vigente contradiga el código | Si el operador no aprueba los eyebrows → se cae B2 y la fase sigue con B3-B5 |
| **B2 · acento** | Coral en "CLIENTES?" + eyebrow compartido `.section-kicker` (5 secciones) | Ratio coral/ciruela y coral/peor-píxel-del-glow escritos en `VERIFICACION-F8.5.md`; overline 13/12 · .14em · `--text-2`; H1 sigue ≤2 líneas a 375 (10/13 car.) | Se queda el acento (2 líneas) y caen los eyebrows |
| **B3 · glow** | `--glow-hero` en hero y banda CTA (espejado) | `grep -nE "radial-gradient" src/` = 1 hit (la definición); el ratio crema vs `color-mix(in srgb, $peach 12%, $plum)` y el coral vs ese mismo píxel quedan **medidos con la fórmula WCAG y escritos** en `VERIFICACION-F8.5.md` (≥ 4.5; ≥ 3.0 el display grande) | Se revierte: es el de menor valor propio y el único que amplía el presupuesto de efectos |
| **B4 · solapado** | Tarjeta del hero cruzando la banda, ≥1200px | 0 scroll horizontal a 375/768/1440; borde inferior de la tarjeta ≥ 24px sobre el primer claim; sombras ≤3/viewport; CLS ≤ 0.02 | Se recorta a `-40px` (insuficiente → fuera). Nunca se abre en <1200px |
| **B5 · bordes** | `--border-strong` en tarjetas de canal + alta de `--border-strong` en `_tokens.scss` | Token añadido y consumido; sombra en reposo = 0; las 4 tarjetas siguen cerrando `4×267+3×24=1140` | 1 línea, no se recorta |

Recorte total declarado: **B3 y B4 caen antes que cualquier cambio de contenido**. Nada de F8.5 toca FAQ (6), CTA final (1 acción + honestidad), KPI/NPS, logos ni footer: los siete rechazos de §3 son P0 y no se reabren por lámina.

**Fuentes:** `DESIGN-CONTRACT.md` §1-§6 · `UX-LANDING.md` §2-§8 · `GRID-SPEC.md` §1-§6 · `EFECTOS-Y-MOTION.md` §1-§5 · `COPY-LANDING.md` §0-§15 · `DECISIONES-2026-10-27.md` §1-§4 · `PLAN-EJECUCION-LANDING.md` §2-§5 · `VERIFICACION-F2/F6/F8.md` · `referencias/ANALISIS-REDESIGN-wan.md` · código leído: `page.js:1-203`, `_home.scss:345-474,700-750,901-910`, `_tokens.scss`, `_brand-vars.scss`. RAG no consultado: los ratios y reglas ya están publicados en los contratos del proyecto (evitar 2 motores para la misma pregunta, AGENTS §6.8). Criterio propio: el ranking de coste/beneficio de §2, el orden de recorte de §6 y la lectura de que el kicker mostaza es una tensión preexistente, no un hallazgo de esta lámina.
