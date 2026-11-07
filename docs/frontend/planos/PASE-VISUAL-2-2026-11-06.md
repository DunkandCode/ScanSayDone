---
fecha: 2026-11-06
autor: designer-alibaba
tipo: plano de salto visual (decisión antes de código)
ruta canónica: docs/frontend/planos/PASE-VISUAL-2-2026-11-06.md
compañero de numeración: C-1…C-66 (`NAVBAR-Y-FOOTER`), C-68…C-75 (`MEJORA-VISUAL`), C-76…C-86 (`BANDAS-2-Y-9-Y-EXTRAS`). **Este plano abre C-87…C-94.**
material nuevo evaluado: `docs/frontend/features/SCAN_SAY_DONE_REDISENO_UX_UI_OPENCODE.md` (467 l., leído completo esta sesión)
---

# PASE-VISUAL-2 — del plano al sitio con peso, sin romper ninguna firma

> **Qué es:** el plano que ordena el salto visual pedido por el operador (gradientes, efectos, fondos con imagen, pie mejorado, barra completa con mapa de secciones, transiciones entre secciones, evaluación de librerías) en fases con números. **Qué NO es:** no es código. No corrí build, lint, tsc, tests, axe ni Playwright: **cero PASS en este archivo**. No edito ningún otro plano ni el snapshot `ENTREGA-UX-2026-10-30/`. **El logo queda explícitamente fuera y se hace al final (F6), después de todo lo demás.**

## 0. Cobertura, fases y exclusiones

| Fase | Qué | Pregunta del encargo que cubre | Firma necesaria |
|---|---|---|---|
| F1 | Sistema de profundidad: halos, lavados, gradiente de franja, filetes nuevos | 3, 7 | C-87 (excepción de sombra, 1 línea) + C-88 (acta de aceptación, sin datos nuevos) |
| F2 | Movimiento: revelado CSS por scroll en bandas 3/4/5/6 | 6 | C-89 (= resolución de C-73 heredado con el camino A) |
| F3 | Imagen de fondo banda 9 con scrim y declaración | 1, 7 | **C-80 heredado** (prompt y copy ya escritos en `BANDAS §4.5/§2.2`; este plano los ratifica sin reescribir) |
| F4 | Barra completa con mapa de secciones + drawer con mapa + fix O2 ya firmado | 5 | acta normal (3 ítems con cadenas ya servidas; el fix O2 es *aplicar* `MEJORA §7`, no decidir) |
| F5 | Pie renovado: lavado, filetes, enlace Panel, «Volver arriba» | 2 | C-91 (2 cadenas visibles nuevas: `Panel`, `Volver arriba`) |
| F6 | **Logo / lockup con isotipo — ORDEN EXPLÍCITO DEL OPERADOR: se hace al final, después de F1–F5** | 8 (exclusión) | C-76/C-77/C-81 heredados (este plano **no** los toca) |
| F0 | Higiene: i1..i3 de PNG a WebP con peso medido | — (soporte de 7) | ninguna |

**Clave de lectura** (la del proyecto): `[P]` cota/regla firmada · `[as-built]` verificado por lectura estática esta sesión · `[D]` derivación aritmética o cálculo WCAG de esta sesión con la fórmula de luminancia relativa · `[V]` valor citado de `UX-SPEC §3.B` sin recalcular · `[propuesta]` decisión nueva sujeta a acta · `sin dato` no documentado.

**Fuente de los contrastes:** todos los `[D]` de este archivo están calculados esta sesión con la fórmula WCAG sobre los hexes servidos en `scansaydone-front/src/app/globals.css:5-21 [as-built]`. Base (luminancia relativa):

| token | hex | L | pares de referencia |
|---|---|---|---|
| `background-page` | #F7E5C8 | 0,7998 | ink 14,28 · secondary 5,93 |
| `surface-elevated` | #F0D8BD | 0,7131 | ink 12,82 · secondary 5,33 |
| `surface-default` | #FFFFFF | 1,0000 | ink 17,64 · secondary 7,33 `[D]` · border-mid 4,68 |
| `text-primary`/`surface-dark` | #1A181B | 0,00952 | — |
| `text-secondary` | #5A5555 | 0,0933 | — |
| `on-dark-secondary` | #C9B6A6 | 0,4863 | 9,01 sobre dark `[D]` |
| `border-mid` | #8A6F55 | 0,1743 | 3,79 crema · 3,40 elevada · 4,68 blanco · 3,77 dark |
| `interactive-primary` | #FC5A41 | 0,2839 | ink/coral 5,61 · coral/crema 2,55 ✗ · blanco/coral 3,14 ✗ `[V]` |
| hover/pressed | #FD6E57 / #E84A33 | 0,3272 / 0,2230 | ink 6,34 / 4,59 `[D]` |

Los pares de servicio previos (14,28 / 12,82 / 5,93 / 5,33 / 3,79 / 3,40 / 9,01 / 5,61 / 2,55 / 3,14 / 3,77) reproducen exactamente las tablas `[V]`/`[D]` de `UX-SPEC §3.B`, `NAVBAR §A11Y.9` y `BANDAS §4.4`: la fórmula de esta sesión coincide con la del proyecto.

**Propiedad de monotonicidad (la usamos para los degradados):** en todo degradado lineal a 2 paradas propuestas los tres canales se mueven **en el mismo sentido** (son neutros de la misma familia cálida), así que la luminancia es monótona entre paradas y **el peor punto del degradado es una de sus paradas**. Cualquier degradado futuro con canales en sentidos mixtos debe recalcularse píxel a píxel: queda escrito como regla de gate.

## 1. Del documento nuevo: qué se adopta y qué se rechaza, punto por punto

Los 7 conflictos de la tabla del encargo, resueltos + los rechazos adicionales que el documento trae y no estaban en la tabla:

| # | El documento propone | Resolución | Argumento |
|---|---|---|---|
| 1 | Paleta `#FAF6F0 #F6E4C9 #FF5944 #242123 #665F59 #E7D9CA #247C56` (`§3`) | **RECHAZADA.** Se traducen los roles, no los hexes: «marfil»→`background-page`, «arena»→`surface-elevated`, «carbón»→`text-primary`/`surface-dark`, «coral»→`interactive-primary`, «muted»→`text-secondary`, «border»→`border-subtle`/`border-mid`, «success»→`success-text` servido | El operador cerró la paleta y `MEJORA §1.1-2` ya la rechazó con la misma lista de siete hexes. **Cero hex nuevo** es límite duro de este encargo |
| 2 | Inter para párrafos y botones (`§3`) | **RECHAZADO.** Montserrat servida | Tipografía cerrada por el operador (`CANON §5`, `MEJORA §1.1-1`) |
| 3 | H1 `clamp(3rem,5vw,5.25rem)`, H2 `clamp(2.2rem,3.4vw,3.7rem)`, Bebas «con tamaño apropiado» (`§3`) | **RECHAZADO.** Escala servida fija por breakpoint (H1 44/88, H2 44/64; Bebas ≥32 en mayúsculas). El `clamp()` choca con G-15 (`UX-SPEC §3.3`: retícula con valores fijos por breakpoint, sin clamp) | La escala no es el problema medido del sitio; el problema es la planitud (se resuelve en §2). Reabrir la escala reabre L1/L2 sin pedido del operador |
| 4 | Radio 14–20, «sombra muy suave», hover con elevación 2–4 px (`§3`) | **Radio: RECHAZADO** (8 servido, G-7/C-12). **Hover-lift: RECHAZADO** — el sustituto es el vocabulario ya servido: chip `surface-elevated`, engrose de decoración, borde; cero translate en hover. **Sombra: única excepción argumentada** en §2.3, dos usos exactos, con firma (C-87); fuera de esos dos usos la regla «elevación por borde y color, no por sombra» queda intacta | Ver §2.3: la lección de la referencia es *capa bajo el artefacto de producto*, no sombra universal. Una excepción acotada y medida vale más que una regla rota |
| 5 | Contenedor 1160–1240 (`§3`) | **RECHAZADO.** `mkt-xl` 1140 y el eje x=150 de las bandas 2–6, unificado ayer por acta (`BANDAS §11`: franja a 1140 con tracks 364; figura del panel en x=150/872/545) | Romper el eje recién unificado necesita justificación medida; el documento no trae ninguna |
| 6 | Iconos «preferencia Lucide» (`§3/§8`) | **RECHAZADO.** Set propio cerrado: viewBox 24×24, trazo 1,5, `stroke="currentColor"`, redondeados, `aria-hidden` + `data-decorativo`; 6 iconos + burger/chevron/flecha servidos (`MEJORA §4`, acta T1/T1.5; B-4 cerrado) | Instalar Lucide reabriría B-4 con una dependencia por dos glifos; el set ya cubre lo pedido |
| 7 | Bootstrap (`§8`) | **RECHAZADO.** `CANON §2` lo prohíbe explícitamente; el proyecto es Next 16.4.3 + Tailwind 4 `@theme` con sistema propio | Meter Bootstrap es un segundo sistema de estilos: dos retículas, dos escalas, dos fuentes de verdad |
| 7b | Recharts o Chart.js para el panel (`§4.7/§8`) | **RECHAZADO.** `CANON §2` prohíbe librerías de gráficos; el panel **ya está servido** en HTML/CSS con SVG inline y dataset autoconsistente (acta §13: 8,5 · 486 · 377) | El documento pide lo que ya se hizo, con otra herramienta vetada |
| 8 | Inventario de 11 imágenes (`§5`): hero-foto con smartphone usado por cliente, «mano acercando celular», tres ilustraciones paso, cuatro microescenas canal, tres fotos rubro | **RECHAZADO EN BLOQUE como inventario nuevo.** Estado servido: banda 5 con i1..i3 declaradas (acta §12), banda 4 con mini-escenas SVG propias aceptadas, banda 6 en HTML. **Manos y personas: vetadas** por el propio encargo (1) y por `MEJORA §5` (prohibido personas/manos/rostros) | El documento fue escrito contra una maqueta vieja; no sabe que las bandas 4/5/6 ya cerraron su pista visual. Generar 11 piezas donde 8 no tienen dónde caer es slop por inventario |
| 9 | «Evitar fotos a pantalla completa como fondo de texto» (`§3`, Fondos) | **ADOPTADO como restricción rectora** de §4 | Es la premisa con la que se calcula qué banda recibe imagen y cuál no |
| 10 | Dashboard con «lista de 3 respuestas ficticias etiquetadas DEMO» (`§4.7`) | **RECHAZADO** ya en `MEJORA §6` (sería prueba social inventada, `CANON §6`) | Sin cambio: el acta §13 lo ejecutó así |
| 11 | Microescena «tablet mostrando interfaz de valoración» con preguntas de ejemplo por rubro (`§4.5–4.6`) | **Pospuesto:** las preguntas de ejemplo por rubro son copy nuevo con respaldo funcional sin firmar (G-0/B-1 abierto); no entran en este pase | C-69/G-0 heredados |

**Premisa del encargo que gobierna todo el archivo (se usa como premisa, no como opinión):** la referencia del operador (captura 1920×11429, extraída en tres tramos por visión; **las librerías del sitio no se leyeron porque Cloudflare bloqueó el acceso automatizado — no afirmamos cuáles usa**) consigue peso con **fondos con degradado en la sección + producto real visible + alternancia tonal**, y con sombras suaves solo bajo los artefactos de producto. El movimiento no es la fuente de su solidez (captura estática: cero evidencia de animación). En consecuencia: el presupuesto de este pase se va en **superficie y producto**, no en librerías; la evaluación de librerías de §3 sale casi decidida por esa premisa.

## 2. Sistema de profundidad y transiciones (números)

### 2.1 Cuatro niveles de profundidad, un recurso por nivel

| Nivel | Recurso | Dónde vive | Estado |
|---|---|---|---|
| **N0 superficie de sección** | token plano **o degradado entre dos tokens servidos** (§2.3) | fondo de cada banda | nuevo uso acotado: 4 degradados de superficie |
| **N1 superficie cálida hundida / filete** | `surface-elevated` + `border-mid` 1 px (borde y color, regla `[P]`) | franja (banda 2), chips hover, tagline badge | ya servido |
| **N2 tarjeta con borde** | `surface-default` + borde 1–2 px `border-mid`; **cero sombra, cero lift** | tarjetas de bandas 3/4/5, acordeón FAQ | ya servido; queda ratificado |
| **N3 artefacto de producto flotante** | borde **+ halo radial (G2/G3) + LA única sombra del sistema (§2.3)** | exactamente 2 piezas: tarjeta demo del hero (`survey-card.tsx:61`) y figura del panel (banda 6, 872×545) | **nuevo — requiere firma C-87** |
| (N-inverso) | banda oscura `surface-dark` | banda 9 | ya servido; no es profundidad, es contrapeso tonal |

**Doctrina anti-maqueta (de la premisa):** el nivel N3 es la lección importada de la referencia: *el producto visible se lee como capa porque flota sobre un fondo con gradiente, no porque tenga efectos*. Los dos artefactos del sitio (la encuesta y el panel) son exactamente sus «monitores con panel de trading». Todo lo demás se queda en N0–N2.

### 2.2 Sombra: la excepción, con valores, y su sustituto

Regla vigente `[P CANON §4]`: «elevación por borde y color, no por sombra». Este plano **admite una excepción acotada** con firma del operador (C-87):

```css
/* ÚNICO valor de sombra del sistema — color = token de tinta + alfa, cero hex nuevo */
--elev-float: 0 10px 24px -12px rgba(26, 24, 27, 0.22);
/* x=0 · y=10 · blur=24 · spread=−12 · rgba(26,24,27,.22) */
```

- **Dónde (2 usos, lista cerrada):** (a) tarjeta demo del hero; (b) figura del panel de la banda 6. Ningún otro nodo del sitio recibe sombra, jamás.
- **Por qué ahí y solo ahí:** son las dos representaciones del producto sobre halo (§2.4); el halo da la capa *de fondo* y la sombra da el contacto *del artefacto*; sin la sombra, los 872×545 sobre el halo se leen pegados (1,56 de diferencia tonal entre la sombra compuesta #C2AE99 y la elevada — decorativa, no semántica `[D]`). Con los valores propuestos la sombra es un **contacto**, no un glow: −12 de spread la mete bajo la caja, 0,22 de alfa la deja por debajo del contraste decorativo que incomoda.
- **Sustituto si el operador la rechaza:** subir el borde de la figura del panel de 1→2 px `border-mid` y conservar halos; cero `box-shadow` en el repo (grep de criterio binario). El plano funciona igual; pierde el 20 % del efecto de capa de los artefactos.
- **Lo que NO entra aunque la referencia lo tenga:** sombras bajo tarjetas comunes, sombras en botones, hover-lift con sombra, `drop-shadow` en iconos. Rechazado con la regla original intacta.

### 2.3 Gradientes: cinco, con origen, destino, dirección y el peor punto calculado

Regla de composición: todo degradado va **entre dos tokens servidos** (o el mismo token con alfa 0 para halos/scrim — precedente servido: scrim del drawer `bg-surface-dark/55` `[as-built site-header.tsx:180]`). Interpolación **en sRGB** (`color-mix(in srgb, …)` / stops hexes de tokens) para que los cálculos de este plano sean los que ve el navegador. Todos cumplen la condición de canales en el mismo sentido (§0) → el peor punto es una parada.

| # | Dónde | Receta exacta | Paradas | Texto encima y su peor punto | Veredicto |
|---|---|---|---|---|---|
| **G1** | Banda 2 (franja): fondo de la sección | `linear-gradient(180deg, color-mix(in srgb, #F7E5C8 75%, #F0D8BD) 0%, #F0D8BD 100%)` | arriba ≈#F5E2C5 (L 0,778 `[D]`) → abajo elevada | títulos ink: **13,92→12,82** · cuerpos secondary: **5,42→5,33** · filetes `border-mid`: **3,69→3,40** | ✓ todos ≥4,5 texto y ≥3 línea en todo el rango |
| **G2** | Banda 6: halo bajo la figura | `radial-gradient(640px 430px at 58% 46%, #F0D8BD, rgba(240,216,189,0))` sobre el crema plano | centro elevada (0,713) → borde crema (0,7998), alfa constante del mismo hex | Ningún texto cruza el halo (centro x≈835, radio x 195; el texto de la banda termina antes de la figura y la figura es opaca) | decorativo; si un nodo futuro lo cruzara, el peor ink sería 12,82 ✓ |
| **G3** | Banda 1: halo bajo la tarjeta demo | `radial-gradient(560px 440px at 84% 26%, #F0D8BD, rgba(240,216,189,0))` sobre crema | idem | Columna de texto (x 182–805 `[P L1]`) no cruza el halo (borde izquierdo ≈x 965) | decorativo ✓; LCP sigue siendo texto (ningún raster, ningún cambio de tipografía) |
| **G4** | Banda 10 (pie): lavado de suelo | `linear-gradient(180deg, #F0D8BD 0%, #F7E5C8 45%)` (abajo crema plano hasta el canto) | arriba elevada → 45 % crema | headings ink **12,82→14,28** · links ink **12,82→14,28** · descripción/legal secondary **5,33→5,93** · filetes y borde superior `border-mid` **3,40→3,79** (y sobre la banda 9 oscura: 3,77 ✓) | ✓ todo el rango |
| **G5** | Banda 9: **solo con la imagen de F3** — hundido del canto inferior hacia el pie | `linear-gradient(180deg, rgba(26,24,27,0) 0%, rgba(26,24,27,0.94) 22%)` sobre el borde inferior de la imagen, dentro de la misma sección bajo el scrim plano 0,88 firmado | superior transparente → inferior casi dark puro | Zona de texto (centro, 30–75 % de la banda): rige el scrim 0,88 → peor píxel crema #F7E5C8 compuesto **#353130** `[P BANDAS §4.4]`: on-dark **10,41**, on-dark-secondary **6,57**, label ink/coral **5,61** ✓. En los últimos 8 % del degradado no hay nodos de texto ni focables | ✓ decorativo; el peor punto real de texto sigue siendo el del scrim firmado |

**Qué NO es degradado aquí y por qué:** los titulares (el documento sugería titulares con relleno; no lo pide explícitamente, se registra igual): texto en degradado queda **vetado** — la marca del sitio es tinta plana sobre superficie. Nada de coral en degradados (2,55 sobre crema lo prohíbe).

### 2.4 Juntas entre secciones: recurso por junta y lo que no lleva nada

Estado servido `[as-built]` + propuesta:

| Junta | Vecinos hoy | Receta | Recurso |
|---|---|---|---|
| J1 hero→franja | crema → elevada, `border-t` franja | **G1 arriba** deja la junta en un casi-igual (mix≈crema) sostenido **por el filete `border-mid`** de 1 px que ya tiene | filete + medio-blend |
| J2 franja→3 | elevada → blanco, `border-b` | igual que hoy: borde + salto tonal 1,38 reforzado por línea | filete |
| J3 3→4 | blanco → crema | **nada**: salto tonal 1,24 sin borde | cambio tonal puro |
| J4 4→5 | crema → blanco | **nada**: cambio tonal puro | idem |
| J5 5→6 | blanco → crema | **nada**: cambio tonal puro | idem |
| J6 6→8 | crema → blanco | **nada**: cambio tonal puro | idem |
| J7 8→9 | blanco → oscura | **nada nuevo**: la frontera 17,64 es la más fuerte del sitio (firma `BANDAS §2.1`, sin borde) | contraste tonal |
| J8 9→pie | oscura → (G4 elevada arriba) | `border-t` del pie servido (3,77 sobre dark ✓) + **G4**: el pie abre en arena y cierra en crema — el suelo «recibe» la página | filete + lavado |

**Rechazos explícitos (para no volver todo elástico):** curvas SVG entre bandas (ola, diago), solape de una banda sobre otra, cross-fade por scroll, `background-attachment: fixed`, separadores con degradado animado. Cada uno añadiría una cota nueva no firmada por ganancia decorativa.

### 2.5 Movimiento: qué se mueve, cuánto, cuándo

Presupuesto `[P MEJORA §8]`: «0 JS de efectos nuevos». Se mantiene: **todo el movimiento nuevo es CSS puro**.

**Nuevo (F2) — revelado por scroll, CSS scroll-driven:**

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal-soft linear both;
      animation-timeline: view();
      animation-range: entry 12% 40%;
    }
    .reveal-2 { animation-range: entry 20% 48%; }
    .reveal-3 { animation-range: entry 28% 56%; }
    .reveal-4 { animation-range: entry 36% 64%; }
  }
}
@keyframes reveal-soft {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}
```

- **Qué se mueve:** los hijos de las retículas de bandas **3 (3 tarjetas), 4 (4 tarjetas), 5 (3 marcos) y la figura de 6**. Nada más.
- **Cuánto:** 10 px de translate + opacidad; rango de entrada por índice (escalón geométrico de 8 pp de progreso de entrada entre hermanos; al scrollear normal ≈ 90–140 ms de retardo efectivo).
- **Cuándo:** una sola vez por entrada en viewport (range `entry`; no vuelve al salir — `both` + entrada = no se dispara en reversa).
- **Contenido no dependiente de JS ni del efecto:** fuera del `@supports`/`@media`, los elementos se renderizan **visibles** (el servidor nunca pinta `opacity:0`): si el navegador no soporta, si el usuario reduce, o si el CSS falla, el contenido está. Cero riesgo de «página en blanco hasta hidratar» (la trampa que sí tienen las librerías JS — §3).
- **Soporte verificado esta sesión en MDN (MCP, trusted):** `animation-timeline` — Chrome/Edge **115+**, **Safari/iOS 26+**, Firefox **110 bajo flag** (sin soporte por defecto), Opera 101+ [fuente: mdn_compat `css.properties.animation-timeline`, consultado 2026-11-06]. Firefox y Safari<26 degradan a estático por diseño. **Condición de gate re-verificar la matriz BCD vigente en la fecha de implementación** (la compatibilidad cambia; el patrón degradativo hace que no importe, pero el acta lo anota).
- **CLS/LCP:** transform + opacidad no reflujo → CLS 0; la banda 1 queda **excluida** del revelado (LCP es texto Bebas `[P]`), banda 9 excluida (el cierre nunca se oculta), bandas 2/8/10 excluidas (contenido de apoyo y navegación no se animan).

**Servido que queda intacto (no se reabre):** drawer translate 200 ms (motion-safe), chevron acordeón, chips hover `transition-colors` 150 ms, anillo de foco sin transición, `prefers-reduced-motion` ya respetado por `motion-safe:`/`motion-reduce:` en lo existente `[as-built]`.

**Rechazado del movimiento:** hover-lift de tarjetas (2–4 px del documento → sustituto: nada; las tarjetas no son linkables y ya tienen su jerarquía por borde), parallax, marquee, contadores animados de las cifras DEMO (sería dramatizar un dato inventado), «efecto de aparición del CTA», transiciones de página.

## 3. Librerías: tres opciones evaluadas con números y la recomendación

Peso real: **no lo mido en esta sesión** (sin build); las cifras son la estimación documentada en `MEJORA §8` para motion y la del registro público de GSAP, marcadas **a medir con bundle analyzer en el gate** si alguna se aprueba. Lo estructural (fronteras de cliente, hidratación) sí está verificado: `[as-built package.json]` hoy = **solo next/react/react-dom** como dependencias de runtime; fronteras de cliente actuales = **4** (`site-header`, `nav-drawer`, `faqs`, `survey-card` — grep `"use client"` esta sesión).

| Opción | Peso JS extra | `"use client"` | Componentes que pasarían a cliente | Qué se gana | Qué se pierde |
|---|---|---|---|---|---|
| **0 — cero librerías (CSS)** | **0 KB** | **cero** | **0** | revelado (§2.5), halos/lavados (§2.3), scrim (§4), todos los hovers servidos; contenido visible sin JS; sin riesgo de parpadeo de hidratación | timing exacto en **Firefox (flag)** y **Safari <26**: ahí las secciones aparecen estáticas (degradación pasiva, no ausencia de contenido); sin stagger por tiempo (el stagger es por progreso de entrada) |
| **1 — `motion` (motion.dev, ex-framer-motion)** | ~35–50 KB gz (**estimación sin verificar; medida obligatoria si se aprueba**) | sí, cada contenedor animado | **+4** (bandas 3, 4, 5, 6) → 8 islas cliente; la mitad del landing cambia de régimen de render | revelado con easing temporal exacto en todos los navegadores; orquestación (timeline, stagger por ms, exit) | **trampa de contenido servido:** `initial={{opacity:0}}` se renderiza oculto en el HTML → sin JS o red lenta, el lector ve secciones vacías (regresión contra la garantía actual); hidratación extra; dos sistemas de timing (CSS/JS) que auditar por separado |
| **2 — GSAP + ScrollTrigger** | ~40–50 KB gz core+plugin (**estimación; hoy libre de licencia desde 2025 — verificar términos en el gate**) | sí (efectos imperativos en un cliente) | +1–2 envoltorios cliente para 4 bandas | control de timeline fino, scrub, batching interno | mismo riesgo de contenido oculto si se usa con estados iniciales; API imperativa fuera del modelo React; capacidad (scrub, pin) que **nadie pidió** |

**Recomendación: opción 0 — cero librerías.** Es respuesta válida y es la esperada bajo la premisa del encargo: la referencia no debe su solidez a la animación (captura estática: cero evidencia de movimiento; su peso viene de fondos con degradado + producto visible + alternancia tonal). Las tres palancas que importan de este plano —halos, lavados, scrim— son **superficie pura**; y el único movimiento pedido («transiciones entre secciones») se resuelve con 6 líneas de CSS que no añaden KB ni cambian una frontera de servidor. Lo que se pierde sin librería es exactamente: revelado escalonado en Firefox y Safari<26 (estático completo, sin pérdida de contenido) y control fino por milisegundos que nadie requiere. **Si el operador fuerza una:** motion, versión fija exacta en `package.json` con `MotionConfig reducedMotion="user"`, revelado solo vía `whileInView` + `viewport={{ once: true }}` y **con el patrón de fallback de contenido visible** (`initial={{opacity:1}}` + animación desde op 0 en cliente — nunca el inverso), previa medición de peso en el gate. GSAP: descartado para este uso (demasiada máquina para lo pedido).

## 4. Imágenes: tabla sección por sección, prompts, atenuación, total

### 4.1 Tabla por banda

| # | Banda | ¿Imagen de fondo / ilustración / ninguna? | Motivo |
|---|---|---|---|
| 1 | hero | **Ninguna raster**; halo G3 solo | `[P]` LCP es texto Bebas; la referencia hero generada el 05-11 fue **rechazada** (`CANON §6`); la demo es el artefacto N3 |
| 2 | franja | **Ninguna** | banda ligera; cuerpo de 14 px sobre raster = la peor relación texto/fondo del sitio (`BANDAS §4.2`, vigente) |
| 3 | cómo funciona | **Ninguna**; íconos 32 del set propio ya servidos | el documento quería 3 ilustraciones «paso»: el set cerrado + numeración cubre; manos vetadas |
| 4 | canales | **Ninguna** (mantiene sus 4 mini-escenas SVG declaradas y aceptadas) | fondo rivalizaría con las escenas propias; el descarte de `BANDAS §4.2` sigue en pie (C-92: solo con instrucción literal del operador entraría la variante «imagen solo bajo las 4 tarjetas») |
| 5 | aplicaciones | **Mantiene i1..i3** (`public/img/ilustraciones/i1..i3` `[as-built]`, PNG — F0 los pasa a WebP) | son las 3 escenas de restaurante/cafetería/comercio sin público que el encargo pide representar; ya generadas, declaradas y auditadas anti-QR (acta §12) |
| 6 | panel | **Ninguna raster**; halo G2 + sombra N3 | es la banda de datos de ejemplo: el artefacto es el panel mismo |
| 7 | — precios | N/A (no publicada, C-55) | — |
| 8 | FAQ | **Ninguna** | el propio documento §4.8 lo prohíbe y el encargo coincide: texto protagonista |
| 9 | cierre | **UNA imagen de fondo: la escena nocturna de negocios** (F3) | única banda donde texto escaso y grande + superficie oscura + scrim de token + zona central limpia por prompt; **única imagen nueva de este pase** |
| 10 | pie | **Ninguna raster**; lavado G4 | fondo de imagen bajo enlaces de 15 px: vetado por la misma regla de la banda 2 |

**Totales: 1 imagen nueva (banda 9). Reutilizadas: 3 (i1..i3, banda 5) + 4 escenas SVG (banda 4) + panel HTML (banda 6).** El inventario de 11 del documento (§5) queda rechazado (§1-8).

### 4.2 La pieza nueva (banda 9): proporción, zona tranquila, receta, contraste

**No reescribo la especificación vigente: la ratifico** (`BANDAS §4.3–4.6`, prompts y capas ya firmados como propuesta, pendiente C-80):

- **Proporción / encuadre:** 2:1 panorámica; escena de negocios en penumbra cálida (restaurante izquierda, barra de café centro-izquierda, mostrador derecha); **el centro geométrico debe ser sombra cálida sin objetos ni bordes** — ahí caen los 632 px del bloque de texto.
- **Receta de atenuación (capas, de abajo a arriba):** `bg-surface-dark` de la sección → `<Image>` absoluta `object-cover` (solo `md:`) → **scrim plano `bg-surface-dark/88`** (token + alfa, precedente servido) → **G5 hundido inferior** (nuevo de este plano, decorativo) → contenido `relative`. Cero `filter: blur` (0 `filter:` en el presupuesto), cero `mix-blend-mode`, cero gradiente direccional sobre el centro del texto (añadiría una segunda incógnita de luminancia donde está la regla de contraste).
- **Contraste del texto sobre el peor píxel:** píxel máximo permitido (#F7E5C8, límite fijado por prompt y auditado en gate) compuesto bajo α 0,88 = **#353130** `[D BANDAS §4.4]`: H2/lead on-dark **10,41** ✓ · kicker/declaración on-dark-secondary **6,57** ✓ · label botón ink/coral **5,61** ✓ (opaco, inmune). Rango operativo α 0,80–0,90 todo ≥4,5; valor fijado 0,88; regla de seguridad: si el píxel más claro medido supera la luminancia del crema, subir α de 0,02 en 0,02 y re-calcular en acta.
- **Resolución del conflicto §3 del documento («evitar fotos a pantalla completa como fondo de texto»):** entra como **restricción**, no como veto a la propuesta: (1) la imagen no es fondo de *texto de lectura* — la banda 9 no tiene párrafos: H2 64 + lead 18 + botón sobre zona central limpia por prompt y scrim calculado; (2) ninguna banda de texto denso (2, 8, pie, enlaces) recibe raster — tabla §4.1; (3) móvil no carga raster (`hidden md:block`, 0 KB); (4) si el gate ve la escena ilegible tras el scrim, la salida válida ya escrita es **banda sólida sin imagen** (`BANDAS §4.4`). Es «fondo con zona de texto limpia» en los términos exactos del encargo (7).
- **Declaración al lector:** la cadena firmada como propuesta: `La imagen de fondo es una ilustración generada. No muestra un local real.` (74 car., 12 px `on-dark-secondary`, sobre #353130 = 6,57 ✓ `[D]`); imagen decorativa: `alt=""` + contenedor `aria-hidden`; el patrón del badge `ILUSTRACIÓN` de banda 5 no aplica a fondos — la declaración es la línea visible (precedente servido en `applications.tsx`/`channels.tsx`).

### 4.3 Prompts literales reutilizables (molde `MEJORA §5`)

Molde (vigente, citada de `MEJORA §5`):

```text
Fotografía editorial realista horizontal proporción [R] de [DESCRIPCION]. Iluminación natural cálida lateral, paleta crema, madera y blanco hueso. Sin personas, sin manos, sin rostros. Sin texto, letras, números, logotipos ni marcas en ninguna superficie. El patrón del soporte es una retícula abstracta claramente no escaneable, deliberadamente ilegible. Estética de negocio auténtico de barrio, limpia y cálida; que no parezca banco de imágenes genérico.
```

- **Restaurante (i1, ya generada; el mismo molde sirve para regenerar):** `[DESCRIPCION] = una mesa ordenada en un restaurante pequeño acogedor, exhibidor triangular blanco con la retícula sobre la mesa, vajilla discreta y una flor pequeña, fondo gastronómico desenfocado` (4:3, fuente 1024×768)
- **Cafetería (i2):** `una taza de café sobre su platillo en mesa de madera clara junto a un pequeño soporte con la retícula, mostrador de cafetería de barrio suave al fondo, luz de ventana`
- **Comercio (i3):** `el mostrador de un comercio de barrio con una bolsa de papel kraft, dos productos sencillos y una tarjeta exhibidora sobre atril con la retícula, estanterías cálidas desenfocadas`
- **Banda 9 (NUEVA — el prompt literal completo es el firmado como propuesta en `BANDAS §4.5`, 2:1, penumbra, centro geométrico vacío, «ningún píxel más brillante que un crema cálido suave», cero colores fríos, cero QR). No lo duplico: se copia de esa sección en la tarea de generación.** Reglas de operación vigentes: 1 imagen = 1 tarea wan-image, ≤1 reintento, control anti-QR (tres esquinas = descartar), presupuesto ≤4 imágenes/tarea del MCP.

### 4.4 Entrega y carga

| Pieza | Formato | Peso objetivo | Carga |
|---|---|---|---|
| banda 9 fondo | WebP `public/img/fondos/banda-9-escena.webp`, 1456×728, `width/height` explícitos | ≤ **90 KB** (techo de captura grande, `[P] UX-SPEC §6.2`) | `priority={false}` `loading="lazy"` `sizes="100vw"` `alt=""` aria-hidden; **no se sirve en móvil** |
| i1..i3 (F0) | **PNG → WebP** con srcset 728×546 / 1456×1092 | ≤ **55 KB** c/u (banda media `[P]`); bytes medidos al manifiesto | `loading="lazy"` (bajo pliegue); `sizes` = 364 px en xl, 100vw−32 en móvil; marco 4/3 intacto |

F0 es higiene de entrega sin firma: el acta §12 descargó PNG; el pipeline del plano ya pedía WebP.

## 5. Barra completa y mapa de secciones

### 5.1 Mapa de secciones (estado as-built verificado con grep esta sesión: los 6 ids existen y ya llevan `scroll-mt-[92px]`)

| # | Sección | `id` | En barra | En pie | Destino de enlace |
|---|---|---|---|---|---|
| 1 | Hero | — (sin id, SD-13 sigue) | no (la marca → `/`) | no | — |
| 2 | Franja de confianza | — (canon: sin ancla `[P PLANOS §2.3]`) | no | no | — |
| 3 | Cómo funciona | `#como-funciona` | **SÍ (nuevo)** | sí (servido) | sí |
| 4 | Canales | `#canales` | **SÍ (nuevo, ≥1200)** | sí (servido) | sí |
| 5 | Aplicaciones | `#aplicaciones` | **SÍ (nuevo, ≥1200)** | sí (servido) | sí |
| 6 | Panel de ejemplo | `#panel` | **no (decisión, §5.2)** | **SÍ (nuevo)** | sí |
| 7 | Precios | — | no (C-55: puerta doble vacía; D10) | no | no |
| 8 | FAQ | `#faq` | sí (servido) | sí (servido) | sí |
| 9 | CTA final | `#cta-final` | no (es el destino del fondo, no un sitio) | no | sí (ancla técnica) |
| 10 | Pie | — | — | — | — |
| — | Demo | `#encuesta-demo` | sí (CTA servido) | no (el pie no repite acciones `[P NAVBAR §B.4]`) | sí |

**Recordatorio duro que gobierna la tabla: no se enlazan destinos vacíos (D10).** `/entrar`, `/pricing`, `/faqs`, `/privacy`, `/terms` siguen placeholders `[as-built verificado en NAVBAR/MEJORA]`; ningún ítem nuevo apunta a ellos. Los 6 ítems nuevos de barra/pie/drawer apuntan exclusivamente a anclas existentes.

### 5.2 Cuántos ítems caben: la cuenta, con estimación y regla de gate

Anatomía servida `[as-built site-header.tsx:87–135]`: wordmark 16 px (≈137 px) + `gap-6` + `FAQ` (px-3) + CTA texto (px-4, subrayado aún — el fix O2 pendiente). Anchos estimados en Montserrat 15 (≈0,55 em/carácter + `px-4` = 32 de pad; **la caja final la fija el gate midiendo, regla B-10**):

| nodo | car. | est. |
|---|---|---|
| Cómo funciona | 13 | ≈139 |
| Canales | 7 | ≈90 |
| Aplicaciones | 12 | ≈131 |
| FAQ (px-4) | 3 | ≈62 |
| CTA Ver una encuesta de ejemplo | 27 | ≈255 |
| cluster derecho completo + 4×`gap-6` (96) | — | ≈773 |
| + wordmark 16 servido | — | **≈910** |

- **≥1200 (`xl`, usable 1108):** 910 ≤ 1108 ✓ margen ≈198. Con lockup futuro 260: ≈1033 ✓ margen ≈75. **Van los 5 nodos.**
- **992–1199 (`lg`, usable 928):** 910 ≤ 928 ✓ **al filo (18 px) con el wordmark actual**; con lockup (983) ✗. Decisión: en `lg` se muestran **Cómo funciona · FAQ · CTA** (≈504+137=641 ✓); Canales y Aplicaciones entran desde `xl`. Es la misma regla de colapso en cascada que canales 2×2→4. Cuando caiga el lockup (F6), si el gate mide overflow, la cadena de contención de `BANDAS §5.5` manda: primero se retiran ítems al drawer; el wordmark y el isotipo nunca se encogen bajo sus pisos.
- **<992:** burger + drawer. El drawer (ya client, cero coste de frontera) recibe el **mapa completo**: Cómo funciona · Canales · Aplicaciones · FAQ (ítems h-11/44) + CTA ancho completo h≥48 (cotas `[P]` servidas del drawer). Cero cadenas nuevas: son los mismos labels.
- **FAQ nunca se marca activa** (ítems de ancla `[P]`); el estado activo por coincidencia de ruta sigue sin uso.

### 5.3 Qué se toca y qué no en la barra

1. **Aplicar el fix O2 ya firmado** (`MEJORA §7` / `BANDAS §3.2`): retirar `underline decoration-border-mid underline-offset-4` `[as-built site-header.tsx:126–127]`, añadir `hover:bg-surface-elevated` + `rounded-[8px]`; FAQ pasa de `px-3` a `px-4`. **No es decisión nueva** (aplicar una receta firmada); va en F4 con gate normal.
2. **3 ítems nuevos** (`lg` 1, `xl` 3) con las cadenas ya servidas del pie (Cómo funciona/Canales/Aplicaciones) — registro en acta C-90 (nodos nuevos con copy existente).
3. **No entra:** Precios (C-55), Panel (razón numérica y de presupuesto: el cluster derecho con lockup futuro no admite un 6.º nodo, y la venta de la demo ya la hace el CTA; el enlace a `#panel` vive en el pie §6 — C-91 lo registra), ningún ítem de ruta nueva (D10), ningún coral (presupuesto `[P]`: el único coral por pantalla sigue siendo el del hero/cierre según pliegue).
4. Barra 76 / `main pt-76` / eje 150 **intactos** (firma). Los ítems se suman al cluster `gap-6`, sin tocar el lockup (logo = F6).

## 6. Pie renovado, dentro de los parámetros

**Qué NO se añade nunca (límites del encargo):** datos de empresa inexistentes, logos de clientes, redes sociales, sellos, cifras, CTA (`[P]`: el pie termina con listas y barra legal), destinos vacíos. Con todo eso vetado, el pie mejora por **superficie, estructura y navegación**, no por contenido:

| Cambio | Receta con cotas | Contraste |
|---|---|---|
| **G4 lavado de suelo** (§2.3) | fondo pasa de crema plano a `linear-gradient(180deg, #F0D8BD 0%, #F7E5C8 45%)`; `border-t border-mid` servido queda | todo el rango cubierto: ink 12,82–14,28; secondary 5,33–5,93; líneas 3,40–3,79 ✓ (§2.3 tabla G4) |
| **3 filetes verticales entre columnas** | 1 px `border-mid`, absolute, `inset-y-0` del bloque de columnas, centros de gap: **x 429 / 720 / 1011 a 1440** `[D]` sobre las celdas 267 servidas (x 150–417 / 441–708 / 732–999 / 1023–1290); solo ≥1200 (fila de 4; en 2×2 y 1-col: cero filetes) — mismo mecanismo firmado para la franja (acta §11) | 3,40–3,79 ✓ (≥3 no-texto) |
| **Enlace 5 en «Producto»: `Panel`** | 5.º `<li>` con la receta servida (15 ink, subrayado `border-mid`, min-h-44, hover `decoration-2`) → `/#panel`; orden DOM = orden de bandas: … Aplicaciones, **Panel**, Preguntas frecuentes | ink sobre crema 14,28 ✓; decoración 3,79 ✓ |
| **«Volver arriba» en la barra legal** | fila `flex justify-between`: © izquierda (servido), derecha enlace 14 `text-primary` + **chevron 16 rotado 180°** (reuso de geometría servida: cero path nuevo, cero extensión del set); destino `#contenido` (existe `[as-built chrome-ids]`), hit ≥44, foco 3/−3 | 14,28 sobre la zona baja del lavado (crema) ✓ |
| Anatomía que **queda igual** | 4×267 gap-6 en `mkt-xl` 1140 x=150 (firma); pt 100 / pb 48 (60/40 móvil); tagline `ESCANEA. OPINA. LISTO.` Bebas 32; descripción 14 secondary; heading 13/600 .14em; barra legal `© {año} ScanSayDone`; cero coral, cero sombras, cero gradientes en texto | — |

**Alto de referencia `[D]`, no meta:** celda Producto pasa de 4×44 a 5×44 (+44) → fila ≈248 → banda ≈**489** desktop (vs ≈445 estimada en `NAVBAR §B.3`; el acta §11 mide la servida). El gate re-mide (B-10).

Cadenas nuevas visibles: **2** (`Panel` 5 car.; `Volver arriba` 13 car.) → C-91, firma de acta. Todo lo demás reutiliza strings servidos.

## 7. Fases, orden y lo que depende de firma del operador

| Fase | Entrega | Dependencias de firma | Orden |
|---|---|---|---|
| F0 | i1..i3 PNG→WebP + srcset + bytes al manifiesto | ninguna | primera (higiene barata, mide el peso real de lo ya servido) |
| F1 | G1 franja + G2/G3 halos + G4 lavado + filetes del pie (§6) + sombra `--elev-float` en los 2 artefactos | **C-87 sombra (1 línea de enmienda a `CANON §4`)** · C-88 acta de degradados sobre bandas servidas (cero cadenas nuevas) | 2.ª — es el grueso del «salto» sin riesgo |
| F2 | `.reveal` CSS (§2.5) en bandas 3/4/5 + figura 6 | **C-89 = resolver C-73 con camino A** (el plano recomienda A explícitamente) | 3.ª — 6 líneas de CSS |
| F3 | Imagen fondo banda 9 (prompt `BANDAS §4.5`, capas §4.2, G5, declaración) | **C-80 heredada** (ratificación: prompt + línea de 74 car.) + gate de píxel más claro | 4.ª — 1 generación wan-image (1 tarea, ≤1 reintento) |
| F4 | Barra: fix O2 (ya firmado) + ítems mapa (lg 1 / xl 3) + drawer con mapa | C-90 (acta, sin copy nuevo) | 5.ª |
| F5 | Pie: enlace `Panel` + `Volver arriba` | **C-91 (2 cadenas nuevas)** | 6.ª (los filetes/lavado ya entraron en F1) |
| **F6** | **LOGO / lockup con isotipo — el operador lo ordena al final: se planifica en su propio lote (C-76/C-77/C-81 heredados de `BANDAS §5`), después de F5 y con la barra ya estable** | C-76/C-81 (ya abiertos, no los toca este plano) | **última** |

Nota de dependencia: F4 dimensiona la barra con wordmark 16; cuando F6 ponga el lockup (≈260), el gate de F6 aplica la cadena de contención (`BANDAS §5.5`) y puede retirar «Canales/Aplicaciones» a `xl` puro — ya está escrito en §5.2, ninguna sorpresa encadenada.

## 8. Criterios binarios y verificables por fase (ninguno se afirma cumplido aquí)

**F0** — 1. `git ls-files public/img` = 6 webp (i1..i3 + srcset 2×) y 0 png; bytes ≤55 KB c/u anotados; `width/height` en `<Image>` = intrínsecos; Lighthouse/`transfer` de la banda 5 en captura de gate.
**F1** — 2. grep `#[0-9A-Fa-f]{3,6}` en los difs de componentes = 0 fuera de tokens; los degradados referencian `var(--color-*)`/`color-mix` con tokens servidos. 3. computed `background-image` de banda 2 contiene `linear-gradient` con #F5E2C5-equivalente y #F0D8BD; banda 10 abre en `rgb(240,216,189)` y cierra en `rgb(247,229,200)` (lecturas top/bottom). 4. `box-shadow` computed **distinto de none en exactamente 2 nodos del landing** (aserción de recorrido completo) con `0 10px 24px -12px rgba(26,24,27,0.22)`; 0 en los demás. 5. axe 0 violaciones con G1–G4 montados (1440×900 + 375×812); los pares §2.3 son la tabla de referencia. 6. filetes pie: 3 a ≥1200 (computed 1 px `rgb(138,111,85)`, x 429/720/1011 ±1), 0 a 992–1199 y 0 a 375. 7. Cero `filter:`/`mix-blend-mode` nuevos (grep dif = 0).
**F2** — 8. `@supports (animation-timeline: view())` y `@media (prefers-reduced-motion: no-preference)` envuelven el bloque `.reveal` (lectura del CSS); con reduce activo: `opacity` computed 1 sin scrollear; en navegador sin soporte (o con el `@supports` anulado en test): contenido visible desde el primer paint. 9. LCP del hero sin cambio (capturas antes/después); CLS = 0 en traza de scroll (Playwright). 10. Cero `"use client"` nuevos en `git diff` (el grep sigue dando 4).
**F3** — 11. capas en orden y con los valores de `BANDAS` criterios 19–23 vigentes (scrim computed `rgba(26,24,27,0.88)`; píxel más claro de la imagen ≤ luminancia #F7E5C8 auditado; G5 en el canto inferior, sin nodos de texto en su último 8 %). 12. móvil: la petición de red del webp **no ocurre** a 375 (network log). 13. línea de declaración exacta en DOM; alt="" + aria-hidden; imagen jamás LCP. 14. revisión visual anti-QR/anti-personas/anti-texto (heredado `MEJORA §10.7`).
**F4** — 15. `grep underline site-header.tsx` = 0; CTA y FAQ con `hover:bg-surface-elevated` y `rounded-[8px]`; ítems servidos: 1 en 992–1199 (Cómo funciona), 3 en ≥1200 (+Canales+Aplicaciones) (aserción de visibilidad por viewport); drawer abierto a 375: 4 enlaces de mapa + CTA h≥48 ancho completo. 16. cero `href` nuevos a `/pricing|/faqs|/entrar|/panel|/e/`; todos los destinos son los 4 ids existentes + `#encuesta-demo`; `scroll-mt-[92px]` intacto. 17. x=150 del lockup y 76/pt-76 sin regresión; coral en viewport plegado del hero = 1.
**F5** — 18. celda Producto tiene **5** enlaces, el 5.º `/#panel`; enlace «Volver arriba» con `href="#contenido"` y chevron 16 aria-hidden (grep: cero `<svg>` nuevos con path propio — el uso es el servido rotado); computed contrastes sobre el lavado: tabla §6. 19. cero `button`, cero coral, cero `bg-interactive-*` en el pie; barra legal sigue `© {año} ScanSayDone` + el nuevo nodo derecho (grep de correo/RUT/dígitos-phone = 0).
**Global** — 20. `package.json` sigue con las 3 dependencias de runtime (cero librerías, gate de la recomendación §3); dif no toca `globals.css` salvo `--elev-float` y el bloque `.reveal`/degradados (todo en el scope de F1/F2), no toca snapshot ni hero.tsx más que su halo/shadow declarados; gates CANON §9 por fase con salida pegada.

## 9. Conflictos abiertos con owner y lo que no verifiqué

| # | Conflicto | Owner | Cierre |
|---|---|---|---|
| **C-87** | Excepción de sombra `0 10px 24px -12px rgba(26,24,27,0.22)` en exactamente 2 artefactos (enmienda de 1 línea a la regla `CANON §4`). Sin firma: sustituto border-2 + halo, plano intacto | Operador | acta F1 |
| **C-88** | G1 (banda 2) y G4 (pie) cambian superficies de bandas servidas por degradados entre tokens (cero hex nuevo); el role de `surface-elevated` como banda se expande (hijo de C-78) | Operador | acta F1 (sin copy) |
| **C-89** | Movimiento: este plano recomienda **camino A (CSS, cero librerías)** y resuelve C-73 en ese sentido; B (motion) queda documentado con su trampa de contenido oculto; GSAP descartado | Operador | una línea en el acta de F2 |
| **C-90** | Ítems de barra (1 en lg, 3 en xl) + drawer con mapa: nodos nuevos con cadenas ya servidas | Operador (forma) + frontend (gate mide cajas) | acta F4 |
| **C-91** | 2 cadenas visibles nuevas: `Panel` (pie), `Volver arriba` (barra legal) | Operador | acta F5 |
| **C-92** | Segunda imagen (banda 4 bajo las 4 tarjetas): **rechazada** en este pase por `BANDAS §4.2`; solo entra con instrucción literal | Operador | n/a salvo petición |
| **C-93** | i1..i3 servidas como PNG pese al pipeline WebP del acta §12 | frontend | F0 sin firma |
| **C-80 / C-73 / C-76 / C-77 / C-81 / C-83 / C-74 / C-69** | heredados: F3 ratifica C-80; F2 resuelve C-73; **el logo (C-76/81, con su lazo C-77) se pospone a F6 por orden del operador**; C-83 (dos «Escríbenos») sigue abierto — este plano no toca la banda 9 salvo su fondo; C-69/G-0 sigue sin cerrar y no se reabre nada con escala | Operador / PM | según lote |

**Lo que NO verifiqué (honestidad de alcance):** (1) cero ejecución de build/lint/tsc/tests/axe/Playwright — ningún criterio §8 se afirma cumplido; (2) los pesos de `motion` y GSAP son estimaciones (la de motion citada de `MEJORA §8`); se miden solo si C-89 se resuelve en B; los términos de licencia de GSAP tampoco verificados; (3) las cajas de los labels de la barra (§5.2) son estimaciones tipográficas (~0,55 em/car) — el gate las fija midiendo (B-10); (4) la matriz de compatibilidad de `animation-timeline` la consulté **esta sesión en MDN MCP** (Chrome/Edge 115, Safari/iOS 26, Firefox 110 bajo flag) y es la base del diseño degradativo, pero debe re-verse en el gate de F2 porque BCD avanza; (5) no abrí ninguna imagen ni PNG (i1..i3 verificadas solo por `glob`: existen como `i1.png`… en `public/img/ilustraciones/`); (6) no abrí `wealth.png` — su lectura me llegó como extracción del orquestador en el encargo, y las librerías del sitio de referencia **no se pudieron afirmar** (bloqueo automatizado), por eso §3 evalúa las opciones del proyecto, no las del sitio ajeno; (7) los pares `[D]` de §2.3/§6 están calculados con la fórmula WCAG sobre los hexes de `globals.css`, no medidos en navegador; (8) no usé apoyos Go: esta tarea es planificación de diseño sin triage de bug ni ADR que firmar; el classify/second-opinion no aplica y queda declarado.

---

**Cierre de formato:** el salto visual se compra con **superficie (5 degradados entre tokens, 2 halos, 1 sombra firmada), 1 imagen nueva (la escena de cierre con scrim calculado), una barra con mapa y un pie con suelo y navegación** — y cero librerías. La animación es el 10 % del efecto pedido y entra como CSS degradativo. El logo, última milla, en su lote F6.

## 14. Hero con escena y plan de imágenes

> **Qué es:** decisión de composición del hero con una escena generada — pedido literal del operador («en el hero tener una imagen así y poder acomodar el hero principal a la imagen creada», con el patrón «¿LISTO PARA EMPEZAR?» como referencia) — y plan de compresión de los cinco PNG servidos. No es código; cero build/axe/Playwright: **cero PASS aquí**. Reabre exactamente cuatro filas de este plano: §4.1 banda 1 (raster en hero), §4.3 (prompt), §4.4 (entrega), §8 F0/F3. El patrón importado es el servido en login: escena + velo crema + placa opaca (`login-visual.tsx:5-26,105` [as-built]).

| Decisión | Receta exacta | Contraste / peso calculado |
|---|---|---|
| Composición | **(b) ventana 1:1 en la columna derecha + tarjeta cruzada sobre el corte**; texto 100 % sobre crema | cero nodos de texto sobre raster → pares §0 intactos (ink/crema 14,28 · secondary 5,93) |
| Rechazo (a) sangre+velo | H1 ink bajo velo crema al 35 %: **2,85** sobre píxel casi-tinta, **3,53** sobre sombra #3A2C22, 5,25 solo si el peor píxel es madera [D] | < 4,5 no garantizable → veto: el velo que salva el texto (≥ 50 %) borra la escena; refuerza la restricción adoptada §1-9 |
| Rechazo (c) banda inferior | la tarjeta N3 perdería su halo (G3 vive en 84 % 26 %) y el hero se parte en dos bloques | n/a |
| Tarjeta | producto visible intacto; conserva su sombra (`--elev-float`, nodo #1 de 2) | separación: placa opaca + borde + solape; cero sombra nueva |
| H1 | tres líneas con cortes explícitos `lg:block` (14.3) | la línea en caja cabe hoy [as-built medido]; el resto, gate B-10 |
| Escena nueva | 1 generación wan-image 1:1 (14.4); ≥ 992 solo; `priority={false}` `fetchPriority="low"` | WebP ≈ 45–170 KB según variante (14.6) [medido/análogo] |
| Cap | **2 escenas raster en landing (hero + banda 9)** + i1..3 ilustraciones | 3.ª escena = firma nueva |
| Compresión | 5 PNG → WebP con ffmpeg; pesos medidos 2026-11-07 | **7,83 MB → ≈ 0,3–0,4 MB (−95 %)** [medido] |

### 14.1 Ventana derecha: cotas y velo

| BP | Ventana | Hero bloque [D] | Receta |
|---|---|---|---|
| 1440 | 518×518 (col 6/12 servida; `aspect-square`) | 76 + 96 + 518 + 96 ≈ **786** (dentro del pliegue de 900) | wrapper `relative hidden lg:block` → `<Image>` absoluto `inset-0 object-cover` 1:1→1:1 sin recorte; borde 1 px `border-mid` (3,79 sobre crema ✓); radio 8 servido; velo interno izquierdo `linear-gradient(90deg, color-mix(in srgb, #F7E5C8 55%, transparent) 0%, transparent 45%)` |
| 992 | 452×452 | 76 + 96 + 452 + 96 ≈ **720** | idem; la tarjeta (448×~500) desborda la ventana por arriba y por abajo: el artefacto tapa la escena, no al revés |
| 375 | **cero raster** (regla F3 móvil heredada: 0 KB) | sin cambio (no se reabre) | el wrapper `hidden` no genera petición de red |

- **Velo:** solo el izquierdo, con las paradas exactas de arriba (un hex sobre transparente = monotónico, §0). No hay velo de texto porque no hay texto sobre la foto: el peor píxel de la escena no entra en ningún cálculo de lectura. Fuente generada en **1:1** para que ventana y fuente no recorten: `object-position` no aplica (cero sorpresas de encuadre).
- **Declaración:** chip inferior-derecho sobre la ventana: `bg-surface-elevated` **opaco** + borde `border-mid` + la cadena firmada de banda 9 sin tocar («La imagen de fondo es una ilustración generada. No muestra un local real.» 74 car., 12 px `text-secondary`): secondary/elevated **5,33** [D]; opaco → inmune al píxel (precedente label ink/coral 5,61 «opaco, inmune»). `alt=""` + `aria-hidden`.
- **LCP:** el H1 Bebas pinta antes que cualquier raster (`priority false` + `fetchPriority low`). Criterio F7: captura del elemento LCP antes/después; si pasa a ser la imagen → la escena se retira y se levanta el fallo en el acta. CLS 0: ventana con alto fijo por `aspect-square`.

### 14.2 La tarjeta de encuesta

Sigue siendo el producto visible — no se mueve de concepto, cambia de capa. Receta: columna derecha relativa; tarjeta `lg:absolute` con solape **−96 px sobre el corte** (su borde izquierdo cae en crema), centrada en vertical, z-10; escala y contenido intactos (`DEMO`, 0–10, tile 9 coral, Enviar deshabilitado). Conserva la sombra firmada (nodo #1 de 2; el corte visual tarjeta/escena se resuelve por **opacidad + borde + capa**, no por más sombra). Cero translate/hover nuevos. El halo G3 sigue activo bajo la mitad izquierda de la ventana.

### 14.3 El H1: salto equilibrado

Hoy: «LO QUE TUS CLIENTES» / «PIENSAN,» (viuda) / caja sobre la 3.ª [as-built]. Se reacomoda sin cambiar ninguna cadena:

```text
L1  Lo que tus
L2  clientes piensan,
L3  [caja tinta] antes de que se vayan
```

Spans `lg:block` alrededor de L1/L2 (bajo 992 queda el flujo natural, sin cambio). Pirámide 10/17/21 glifos: L2 ≈ 490–515 px [D, Bebas 72, 0,40–0,42 em/glifo] ≤ columna 623 [P L1]; L3 cabe hoy con `w-fit` [as-built medido] → la caja cubre la frase completa de pago. Fallback si el gate (B-10) mide desborde de L3: permitir doble línea interior de la caja (el negro la cubre igual). La caja tinta pasa a ser el remate estable, no el parche.

### 14.4 Prompt de la escena del hero (literal, listo para pegar)

```text
Fotografía editorial realista cuadrada proporción 1:1 de una esquina de cafetería de barrio al amanecer, vacía de público: mesa redonda de madera con dos sillas vacías, taza de café sobre su platillo, y un pequeño soporte de mesa con una tarjeta que muestra solo una retícula abstracta claramente no escaneable, deliberadamente ilegible; ventana lateral con luz cálida suave; el tercio superior es una pared simple y tranquila; el borde izquierdo queda más suave y en sombra cálida. Paleta exclusivamente cálida: crema, madera, latón, blanco hueso, sombras miel. Sin personas, sin manos, sin rostros, sin siluetas humanas. Sin texto, letras, números, logotipos, carteles legibles ni marcas en ninguna superficie. Sin códigos QR ni patrones que parezcan códigos escaneables. Sin colores fríos: nada de azules, violetas, verdes fríos, blancos azulados, gris acero ni cian en sombras o reflejos. Sin zonas casi blancas: ningún píxel más brillante que un crema cálido suave. Estética de negocio auténtico de barrio, limpia y cálida; que no parezca banco de imágenes genérico. Sin grano, sin viñeta.
```

Fuente 1024×1024. Reglas de operación vigentes: 1 imagen = 1 tarea wan-image, ≤ 1 reintento, control anti-QR (tres esquinas = descartar), revisión visual anti-personas/anti-texto (heredado `MEJORA §10.7`).

### 14.5 Cuántas secciones merecen imagen: una más, ninguna extra

| Banda | ¿Imagen? | Por qué |
|---|---|---|
| 2 franja · 8 FAQ · 10 pie | **No** | cuerpo 14–15 px sobre raster = vetado por la restricción adoptada §1-9 (filas §4.1 intactas) |
| 3 cómo funciona | **No** | set propio de iconos + numeración cierra el beat; manos vetadas |
| 4 canales | **No** | C-92 sigue en pie: solo entraría con instrucción literal del operador |
| 6 panel | **No** | banda de datos: el artefacto es el panel mismo (G2 + sombra N3 bastan) |
| 1 hero · 9 cierre | **Sí — las únicas dos** | texto escaso y grande + placa/scrim calculados; una 3.ª escena requiere firma nueva |

### 14.6 Plan de compresión (pesos medidos con ffmpeg/libwebp el 2026-11-07, salida pegada en el acta)

| Archivo | Fuente medida | Destino | Peso medido | Qué se pierde |
|---|---|---|---|---|
| i1 · i2 · i3 | PNG 1024×768 · 1,38 / 1,32 / 1,30 MB | WebP **728w q80** | i1 **46,1 KB** (i2/i3 análogos [D]) | nada visible: plano q80 en ilustración sin detalle fino; **se corrige §4.4: variante 1456 = upscale de una fuente 1024 — no se sirve; 728 es 2× del display 364** |
| banda-9-escena | PNG 1536×768 · 1,40 MB | WebP **1456w q65** | **20,2 KB** (q72: 22,3) | nada: queda detrás del scrim 0,88 firmado |
| login-escena | PNG 1024×1280 · 2,06 MB | WebP **768w q75** | **42,5 KB** | nada visible: detrás del velo 30–60 % servido |
| hero-escena (nueva) | PNG 1024×1024 (~1,5–2 MB al generar) | WebP **512w q70 + 1024w q70** | q60@1024 medido en análogo: 200,3 KB → q70 ≈ **150–170 KB [D]**; 512w ≈ 40–55 KB [D]; techo declarado **≤ 220 KB** por variante | plateado suave en 2× retina — aceptable bajo placa/velo |

**Total servido: 7,83 MB → ≈ 0,3–0,4 MB (−95 %) [medido/análogo].** Qué hacer con las referencias: los cinco src son literales `.png` en `applications.tsx:15,21,27`, `cta-final.tsx:20`, `login-visual.tsx:8` (más el nuevo del hero) → cambiar a `.webp` con `width/height` reales de la variante máxima; `<Image>` servido se queda (next/image sigue re-codificando AVIF/WebP en runtime si sharp está en el tree — **a verificar en el acta; no lo afirmo**). Sufijos `@2x`: **ninguno** — el srcset de next/image cubre 2×; la conversión de origen vale igual por bytes en repo, dev y clientes sin optimizador.

### 14.7 Fases, firmas y totales

- **F7 (nueva, se ejecuta junto a F3 — misma receta de capas):** generar escena → webp → ventana + tarjeta sobre el corte + chip de declaración + criterio LCP. Depende de **C-95 (hero con escena — enmienda la fila «1 hero» de §4.1, que decía «ninguna raster»)**.
- **C-94 (reservado en la cabecera de este plano y nunca asignado en §9): se asigna aquí** a la enmienda de compresión — extensión de F0 a los 5 PNG + cancelación de la variante 1456 de i1..i3. Frontend, sin firma de operador.
- **C-96:** corte explícito del H1 (14.3) — cero cadenas nuevas, cambio estructural; firma de operador en el acta de F7.
- **Totales del §14: entran 1 imagen nueva (hero); se comprimen 5; el landing queda con 2 escenas raster + 3 ilustraciones WebP + 4 SVG de banda 4.** Reutilizar `login-escena` en el hero queda descartado: su encuadre es 4:5 vertical de medio cuerpo de mesa pensado para el panel de login, y la ventana del hero es 1:1 con requisitos de solape distintos — se pierde más en el recorte de lo que se gana evitando una tarea de generación.

**Cierre del §14:** el hero recibe su aire con **una ventana 1:1 que el texto no pisa y una tarjeta que la cruza** — la lección del login aplicada al hero, la escena del cierre sin competencia. Peso tras compresión: menos de medio megabyte en cinco archivos que hoy pesan ocho. **Este cierre queda enmendado por §15: la ventana 1:1 fue rechazada y el peso medido no fue el estimado.**

---

## 15. Hero a sangre: lo que se construyó

> **Qué es:** acta de lo ejecutado el 2026-11-07 en el hero y en el raster del sitio. No propone: describe lo servido. **Cero PASS afirmados** — son medidas de esta sesión: 145 tests · build 14/14 · lint 0 errores · tsc 0 · axe 12/12 sin violaciones a 1440, 992 y 375 · cero peticiones `/api/` · cero scroll horizontal. `ESTADO §8` registra 143 de una corrida anterior: son corridas distintas, no una corrección.

### 15.1 Se rechaza la ventana 1:1 de §14.1

El operador vetó la composición de §14.1: **«la imagen debe cubrir el hero completo y el demo experiencia está pegado en el texto»**. Entra la escena a sangre, es decir la opción (a) que §14 había rechazado con el argumento «el velo que salva el texto (≥ 50 %) borra la escena». Ese argumento queda refutado por medida en 15.3.

### 15.2 Receta servida [medido]

| Aspecto | Valor |
|---|---|
| Imagen y sección | miden lo mismo: **1440×618** a 1440 (`x=0..1440`, `y=76..694`, contando la barra fija de 76) |
| Velo capa 1 (vertical) | `linear-gradient(0deg, color-mix(in srgb, var(--color-background-page) 55%, transparent) 0%, transparent 18%)` |
| Velo capa 2 (horizontal) | `linear-gradient(90deg, var(--color-background-page) 0%, var(--color-background-page) 40%, color-mix(in srgb, var(--color-background-page) 88%, transparent) 52%, color-mix(in srgb, var(--color-background-page) 48%, transparent) 66%, transparent 84%)` |
| Encuadre | `object-cover` + `object-position: 62% 68%` + `scale 1.06` |
| Bajo 992 | la escena se oculta y **no se descarga**: 0 peticiones a 375 (la regla móvil de §14.1 sigue intacta) |

Las dos capas van sobre la imagen y **debajo del contenido**; cero hex nuevo, solo `color-mix` sobre el token de página. **Por qué el contraste es determinista:** el horizontal es opaco de 0 % a 40 % del ancho y el bloque de texto cierra en x=696 de 1440 (≈ 48 %), así que lo que hay bajo cada letra lo fija el velo, no lo que dibujó el generador — la desviación residual medida es de 2–5 unidades por canal sobre el crema. El CTA no depende de la escena: se muestrea sobre su propia superficie tinta. Contraste medido **sobre el píxel real a 1440**, no sobre el token: eyebrow **5,66** (`rgb(242,224,195)`) · lead **5,78** (`rgb(245,226,197)`) · CTA **14,28** (`rgb(26,24,27)`). Los tres sobre 4,5; el par del token (5,93) queda como referencia, no como lo servido.

### 15.3 Prueba de que la escena se lee [medido]

| Punto | Color servido | Δ vs crema `rgb(247,229,200)` (suma de canales; mayor Δ = más escena) |
|---|---|---|
| (1150,520) | `rgb(230,214,194)` | **38** |
| (1320,470) | `rgb(188,167,138)` | **183** |
| (1400,620) | `rgb(159,132,101)` | **284** |

Bajo y junto a la tarjeta el velo es casi total (Δ 38); hacia el borde derecho y el pie del hero la escena aparece franca (Δ 183 y 284). No hubo que elegir entre texto legible y escena visible.

### 15.4 H1, sombras y coral [medido]

Tres cortes explícitos: «Lo que tus» / «clientes piensan,» / caja tinta «antes de que se vayan». Antes la frase se cortaba y se leía «ANTES DE QUE SE VAYA»: **faltaba la N**. La caja termina en **x=696**, la tarjeta empieza en **x=875** → **179 px** de aire entre los dos; bloque texto–tarjeta **116 px**. Sombras: **2** nodos con `0 10px 24px -12px` — el presupuesto de dos sigue cerrado. Coral en el hero: **1** (el tile `9`). A 992 la tarjeta se apila bajo el texto con 32 px; a 375 una columna, sin escena.

### 15.5 La imagen y su peso [medido]

Dos intentos de generación: el primero trajo una retícula con **tres esquinas de QR** en el soporte de mesa → **descartado** por la regla anti-QR; el segundo salió con la tarjeta **en blanco**. Fuente **1024×1024**. Antes: 5 PNG servidos **7,83 MB** + la escena nueva **1,57 MB** = **9,40 MB**. Después, servido en WebP:

| Archivo | Ancho/calidad | Peso |
|---|---|---|
| `i1.webp` | 728 / 80 | 97,3 KB |
| `i2.webp` | 728 / 80 | 85,8 KB |
| `i3.webp` | 728 / 80 | 89,4 KB |
| `banda-9-escena.webp` | 1456 / 65 | 141,6 KB |
| `login-escena.webp` | 768 / 75 | 136,1 KB |
| `hero-escena.webp` | 1024 / 70 | 148,4 KB |

**Total servido: 0,67 MB** de raster; **226 KB** de peso transferido real en la home a 1440. El estimado de §14.6 (0,3–0,4 MB servidos) **no se cumplió**: lo que baja de verdad es lo transferido. Los PNG originales **no se borraron**: se movieron a `scansaydone-front/assets/fuentes-imagenes/`, fuera de `public`, y no se sirven.

### 15.6 Enmienda del criterio LCP de §14.1

Con la escena a sangre el LCP pasa a ser **la imagen** (~144 ms medidos), no el H1 (~124 ms). El criterio de §14.1 («el H1 debe ser LCP») asumía un hero sin raster y queda **enmendado**: lo que importa es que el LCP ocurra pronto, y ocurre. `priority` / `fetchPriority` de la escena se re-ven contra ese número.

### 15.7 Lo que NO verifiqué

Sin Lighthouse: ni score de performance, ni score de accesibilidad, ni presupuesto de red por esa vía. Sin estados de carga ni de error del hero: solo el render completo a tres anchos. Sin navegadores sin `color-mix` — las dos capas del velo lo usan y su degradación no fue probada. Cero medición de CLS. C-95 y C-96 siguen sin acta: esto es lo construido, no lo firmado.

---

## 16. Reencuadre final tras revisión del operador

> **Qué es:** acta del corte de 2026-11-07 después de §15. Cambia la imagen del hero, no el mecanismo. Enmienda tres cosas de §15: la fila «Encuadre» de §15.2 (`62% 68%` + `scale 1.06` → lo de 16.3), el alto de sección (1440×618 → 1440×616) y la fila `hero-escena.webp` de §15.5. El criterio de LCP de §15.6 sigue vigente. **Este archivo no ejecutó nada ni abrió ninguna captura:** cada cifra de abajo es salida reportada por el implementador. Cero PASS aquí.

### 16.1 Por qué se cambia la imagen

La primera escena a sangre se rechaza por encuadre, no por receta: con v1 la taza y la mesa caían demasiado abajo y quedaban apenas visibles. El operador pidió probar otra imagen más acorde al hero. El fullbleed, el velo de dos capas, la sombra de la tarjeta y el «no se descarga en móvil» de §15 **no se tocan**: solo cambia la fotografía que hay debajo.

### 16.2 Fuente v2, WebP activo y fuente preservada

| Pieza | Ruta | Dimensiones | Bytes |
|---|---|---|---|
| Fuente v2 (fuera de `public`, no se sirve) | `scansaydone-front/assets/fuentes-imagenes/fondos/hero-escena-v2.png` | 1536×1024 | **2 249 493** |
| WebP activo (único servido) | `public/img/fondos/hero-escena.webp` | 1536×1024, calidad 70 | **187 892** |
| Fuente v1 (preservada, no se borra) | `scansaydone-front/assets/fuentes-imagenes/fondos/hero-escena.png` | 1024×1024 (§15.5) | sin medir en esta edición |

v2 viene de una cafetería vacía: pared calma a la izquierda, mesa y taza visibles a la derecha, sin personas y sin QR. Compresión [D sobre bytes reportados]: 187 892 ÷ 2 249 493 = **8,35 %** del original, ratio **≈ 11,97:1**, recorte **≈ 91,65 %**; en KiB (÷1024) de 2 196,8 a **183,5**. El total de raster del sitio de §15.5 **no se recalculó aquí**: esa tabla no declara si sus «KB» son 2¹⁰ o 10³ bytes, así que la suma queda a cargo del gate.

### 16.3 Encuadre y medidas

`object-position: 50% 65%` con desplazamiento responsive: **27 % a 1280** y **23 % a 1440**, para que la pared quede en la izquierda bajo el velo y la taza/mesa salgan en la derecha. Regla acotada al hero: **no extender esa regla fuera de hero** y no tocar que la escena siga a sangre cubriendo la sección.

| Medida [reportada por Playwright del implementador] | Valor |
|---|---|
| Hero/escena | 1440×616 a 1440 · 1280×616 a 1280 · 992×919,8 apilado · 375 escena oculta, **0 requests** |
| H1 / gap texto–tarjeta / overflow | íntegro en los 4 viewports · 116 px desktop y 32 px apilado · sin overflow horizontal |
| Muestras RGB vs crema `rgb(247,229,200)` (Δ suma de canales, criterio §15.3) | a 1280 taza **225** mesa **246**; a 1440 taza **220** mesa **233** |

Las Δ de v2 caen en la franja donde §15.3 leía escena franca (183–284) y muy por encima del casi-velo (38): el reencuadre cumple lo pedido. Son datos reportados, **no evidencia independiente**: las capturas las tomó el implementador y quien documenta esto no las inspeccionó.

### 16.4 Ajustes de revisión y batería

Anillo de foco de **Enviar** corregido: tinta, 3 px, offset −3, contraste **12,82:1 reportado**. La caja del H1 permite wrap bajo `lg` tras un hallazgo LOW del reviewer. El CTA del cierre lleva `motion-safe`. Color, copy y dataset sin cambios; cero dependencias nuevas; cero sombras nuevas.

Batería de la tanda final **[salida reportada por el implementador]**: 145 tests en 12 archivos · build 14/14 · lint 0 errores con 4 avisos preexistentes · tsc 0 · axe 12/12 con cero violaciones · Playwright en 1440/1280/992/375 · LCP **144 ms sobre la imagen**, reportado. El reviewer **APROBÓ con 2 LOW** (nowrap del H1 y geometría arbitraria); el nowrap se corrigió después y la suite se repitió 145/12 con build/lint/tsc/axe verdes según el propio agente. **El revisor no ejecutó pruebas: no tiene shell.** Ninguna batería de esta sección es ejecución del reviewer ni de esta edición.

Estado git de la tanda: commit **`9f5278b`** (`fix(landing): reencuadrar la escena del hero y dejar foco visible`), rama `dev/nicolaslopezv-front`; incluye WebP activo, fuente v2, foco, wrap del H1 y motion-safe.

### 16.5 No verificado

Captura visual sin inspección independiente (ni reviewer ni esta edición) · Lighthouse en ninguna variante · degradación sin `color-mix` · navegadores reales · CLS · estados de carga y error del hero · recomposición del total de raster. C-95 y C-96 siguen sin acta.

---

## 17. Fullbleed, la costura del asset v2 y el fix final: la imagen

> **Qué es:** acta del cierre 2026-11-07 tras §16: geometría verificada, análisis de causa raíz de la costura percibida y **fix final ya aplicado**, en dos tandas. Enmienda §16.3 (translate removido; el encuadre `object-[68%_65%]` era de la era v2 y queda sin efecto al cambiar la imagen) y §15.2 (el velo de dos capas **desaparece del hero**: el texto pasa a una superficie propia — placa opaca en `b5653d2`, **halo radial local** en `35c91e7`; el estado servido de hoy es el halo, no la placa). **Supersede el §17.2 de la edición anterior**, que afirmaba que la asimetría de v2 quedaba como residual y que las candidatas v3/v4 «no fueron elegidas y fueron retiradas»: ya no es cierto — **v4 es hoy la imagen activa**. Commits: `1e15698` es la tanda intermedia fullbleed + velo; `b5653d2` es la que integró la panorámica v4 con superficie opaca — paso previo, conservado como historia; **el fix final es `35c91e7`** (HEAD, `git log` 2026-11-07, **empujado a `dev/nicolaslopezv-front`** — el ahead 1 medido con `git status -sb` por la edición anterior era el estado previo al push), que revierte la placa por un **halo radial local**. Cierre 2026-11-07: tras el halo final el **orquestador reejecutó el axe en HEAD** (`$env:A11Y_BASE_URL="http://127.0.0.1:3120"; npm run test:a11y` → 12 passed · 0 violaciones · exit 0, puerto cerrado después) y el **andamiaje temporal** de la verificación del hero (specs, config, `test-results/`) **fue retirado de la superficie**. **Cero PASS atribuido a esta edición** — es documental; el registro de push y limpieza proviene del cierre del lote, no de mediciones propias de este archivo.

### 17.1 Geometría: ya era fullbleed [Playwright **ejecutado por el orquestador** a 1440]

| Rect medido | Valor |
|---|---|
| Sección hero | `x=0` · `y=76` · `w=1440` · `right=1440` · `h=616` |
| Img | `x=0` · `y=76` · `w=1440` · `right=1440` · `h=616` — cubre toda la caja; `scrollWidth=1440` |

El gap que se veía era **falso**: lo causaban `xl:translate-x-[27%] 2xl:translate-x-[23%]`, ya **removidas** (`1e15698`). Al diagnosticar (`/` en localhost:3000, 1440), sección e imagen medían lo mismo: el CSS **no recorta media imagen** ni falta ancho. La costura a explicar no estaba en la geometría.

### 17.2 Causa raíz: la composición de la fuente, no la geometría [designer-alibaba y explore-alibaba, **independientes**, read-only]

Los dos análisis llegan al mismo veredicto: la causa raíz es **la composición del asset**, con el velo y la oclusión de la tarjeta como agravantes secundarios. **No** es falta de ancho en CSS — eso lo descarta la geometría medida de 17.1. Por peso:

| # | Causa | Peso | Lo verificado |
|---|---|---|---|
| 1 | **Asset v2:** pared pálida ocupa media izquierda; detalle de café, media derecha | **principal** | la costura vive en la fuente, cerca de su x≈50 % |
| 2 | **El encuadre no podía disimularla:** fuente 3:2 (1536×1024) vs hero 1440/616 ≈ **2,337** | soporte mecánico de 1 | en `object-cover` **el ancho vincula**: no hay holgura horizontal → la costura de la fuente mapea a x≈**720** del viewport; `object-position-x` **no puede crear contenido de fuente que no existe** |
| 3 | **Velo:** alfa máximo **86 %** en x 48–52 %, justo sobre la unión donde la pared terminaba | secundario | no tapaba la costura: **la amplificaba** |
| 4 | **Tarjeta:** la demo (x 875–1245 · y 260–610) tapaba la **taza y el platillo** de la fuente (x≈922–1123 · y≈466–563) | secundario | lo bueno de la foto quedaba bajo el artefacto |

**Lo que queda sin efecto de la §17.2 anterior:** aquella edición afirmaba que la asimetría de v2 quedaba como residual aceptado y que v3/v4 «no fueron elegidas y fueron retiradas». El fix final hace lo contrario de lo que ese párrafo descartaba: **adopta la panorámica v4 y retira el velo de lleno del hero** (17.3).

### 17.3 Fix final aplicado [HEAD `git log`: `35c91e7`, dos tandas cumulativas]

El fix final son dos commits apilados: `b5653d2` activó la **panorámica v4** y pasó el bloque textual a una **placa propia opaca**; `35c91e7` (`fix(landing): suavizar halo detrás del texto del hero`, que **solo** tocó `hero.tsx`, +13/−1) revierte la placa — garantizaba contraste pero **se leía como caja separada** contra la escena — y la sustituye por un **halo radial local** con caída elíptica. El estado servido es el de HEAD; la «superficie opaca» de la tanda anterior **no** describe el sitio de hoy.

| Pieza | Valor (HEAD `35c91e7`) |
|---|---|
| Imagen activa | **panorámica v4** (sin cambio desde `b5653d2`, generada e inspeccionada previamente): entorno de cafetería en todo el cuadro — cortina a la izquierda; estantes, barra y mesas a la derecha — con **mesa y taza visibles**. Sin personas, sin texto legible, sin QR |
| Fuente v4 (fuera de `public`, no se sirve) | `scansaydone-front/assets/fuentes-imagenes/fondos/hero-escena-v4.png` · 1536×1024 · **2 266 592 bytes** [medidos con `Get-Item` y **reeconfirmados en HEAD** por la sexta edición] |
| WebP activo (único servido) | `scansaydone-front/public/img/fondos/hero-escena.webp` · 1536×1024 · q70 · **241 538 bytes** [reeconfirmados en HEAD: `35c91e7` no toca raster] |
| Fuentes v2 y v1 | **preservadas** fuera de `public`; ninguna se sirve, ninguna se borra |
| Geometría de la imagen | **sigue fullbleed**: nada de 17.1 se toca; el encuadre de 16.3 gobernaba la v2 y queda sin efecto — cambió el asset. `35c91e7` no toca caja ni raster: el halo es capa `absolute -z-10`, **cero efecto de layout** |
| Bloque de texto | **halo radial local**, no caja: div `aria-hidden`, `pointer-events-none`, `inset: -8rem`, con `radial-gradient(ellipse closest-side at 50% 50%, color-mix(in srgb, var(--color-background-page) 92%, transparent) 85%, transparent 100%)`. **Meseta** del 92 % hasta el 85 % del radio y **pluma** (feather) a transparente en el 100 %. Se ensanchó de 7 a 8 rem para que el remate del eyebrow no caiga junto a la pluma. Sin velo de lleno, sin fondo opaco tras el copy, sin canto redondeado; el padding del contenido queda en un div interno `relative z-10` (idéntico al de la placa). La placa opaca anterior (`rounded-2xl bg-background-page`, `b5653d2`) — el criterio determinista que aún sirve `/entrar` (`ESTADO §4`) — **queda retirada en el hero**. Misma disciplina que los degradados: `color-mix` entre tokens, **cero hex nuevo** |
| Tarjeta demo | **alineada arriba** (sin cambio desde `b5653d2`): la mesa/taza se ven por debajo y fuera de ella. **Cero sombra nueva, cero dependencia, cero copy, cero dato** |

El contraste cambia de naturaleza dos veces. Con la placa opaca era determinista por token sobre superficie plana: secondary/`background-page` **5,93:1** · primary **13,77** · CTA **13,77** [reportado; **superseded** por la tanda del halo]. Con el halo la evidencia empeñada es **aritmética de peor caso**: **cálculo conservador sobre fondo negro — secondary 4,97:1** (sobre el umbral AA 4,5, con margen estrecho) y **cálculo geométrico reportado que deja todos los glifos dentro de la meseta del 92 %**. La garantía de alfa del halo es **analítica de peor caso, no un compuesto muestreado píxel a píxel**: el propio commit lo registra como límite (17.5) y el reviewer **cerró el P2 por esa aritmética** dejando el margen estrecho y el alfa no muestreado como **residual informativo** (17.4); el reviewer no ejecutó nada en runtime — el axe lo corrió el orquestador. Los valores de la era del velo (eyebrow **4,80→5,25** · lead **4,77→5,16**, última letra sin muestrear) siguen **superseded**: describían otra receta.

### 17.4 Verificación de la tanda [ejecutado vs reportado vs mediado por herramienta]

| Dato | Tanda | Quién | Estado |
|---|---|---|---|
| Batería de la tanda del halo: 145 tests en 12 archivos · build 14/14 · lint 0 errores y 4 avisos preexistentes · tsc 0 · Playwright en 1440/1280/992/375 | `35c91e7` | implementador | **reportada** en el mensaje del commit; no reejecutada por el reviewer (sin shell, inspección estática) ni por esta edición (documental). El axe de esta tanda **sí** fue reejecutado en HEAD: ver la fila siguiente |
| `$env:A11Y_BASE_URL="http://127.0.0.1:3120"; npm run test:a11y` → **12 passed · 0 violaciones de axe · exit 0**, tras el fix final del halo | `35c91e7` | **orquestador** | **ejecutado en HEAD post-halo** (salida real de esa corrida, no reporte de terceros); puerto 3120 cerrado después; verifica reglas de accesibilidad, **no** muestrea el alfa del halo píxel a píxel |
| Contraste del halo: secondary **4,97:1** por cálculo conservador sobre negro; cálculo geométrico que deja todos los glifos dentro de la meseta del 92 % | `35c91e7` | implementador / mensaje del commit | **aritmética de peor caso**, no lectura píxel a píxel ni compuesto muestreado; el commit lo empeña como límite por sí mismo |
| Veredicto del reviewer sobre el halo: P2 **cerrado por aritmética**, con **residual informativo** de margen AA delgado y alfa no muestreado por píxel | `35c91e7` | reviewer | inspección estática (sin shell): el reviewer **no** es verificador de runtime en esta tanda — la corrida axe de HEAD la ejecutó el orquestador (fila arriba) |
| Andamiaje temporal de la verificación del hero (`tests/temp-hero-verify/hero-contrast.spec.ts` y `hero-screenshots.spec.ts`, su config suelta y el `test-results/` de ese trabajo) | era `35c91e7` | — | **retirado de la superficie tras la tanda**: hoy ninguno queda en el árbol. Historia: la edición anterior midió los specs **vacíos** (0 líneas / 0 bytes, con `Read` y `Get-Item`) y `test-results/.last-run.json` (`status: passed · failedTests: []`) como residuo de la tanda anterior; en cualquier caso era andamiaje sin aserciones, **nunca evidencia del halo** |
| Batería de la tanda v4: 145 tests · build 14/14 · lint 0 errores y 4 avisos · tsc 0 · Playwright 1440/1280/992/375 sin overflow · **0 peticiones** de la imagen del hero en móvil | `b5653d2` | implementador | **reportado**, no reejecutado en aquella edición |
| Contraste por píxel sobre la placa opaca: **5,93 / 13,77 / 13,77** | `b5653d2` | implementador | **reportado**; cifra **superseded**: medía una superficie que ya no existe |
| `A11Y_BASE_URL=http://127.0.0.1:3120 npm run test:a11y` → **12 passed · 0 violaciones de axe · exit 0** | `b5653d2` | **orquestador** | **ejecutado**; puerto 3120 cerrado tras la corrida. Corrida de **paso previo**: tras el halo final del HEAD la misma verificación se repitió en `35c91e7` — ver fila de arriba |
| La corrida completa **sin env falló 10 tests**: los specs hardcodean fallbacks de `A11Y_BASE_URL` a puertos viejos (3155 · 3170) mientras el servidor gestionado por Playwright es 3120 | `b5653d2` | orquestador | **ejecutado y anotado candidamente**: inconsistencia **conocida del arnés de tests**, no un fallo del hero; con la invocación corregida pasa (queda también en `ESTADO §8`) |
| Rects de sección e imagen con v4 a 1440: idénticos — `x=0` · `y=76` · `w=1440` · `h=616` · `scrollWidth=1440` | `b5653d2` | **orquestador** | **ejecutado**; `35c91e7` no toca caja ni raster — el rect sigue vigente por construcción, aunque **no se remidió en HEAD** |
| Veredicto del reviewer sobre la tanda v4: **APROBADO, 6 observaciones P3 informativas, cero P0/P1** | `b5653d2` | reviewer | sin shell: inspección estática |
| Fuente y capturas 1440/1280/992/375: escena de cafetería cruzando todo el cuadro, mesa/taza visibles, bloque de texto separado, demo separada, sin personas/texto/QR | `b5653d2` | frontend y reviewer; el reviewer además con **ZAI Vision** | **mediado por herramienta**: no es auditoría humana de píxel |

### 17.5 Límites y deudas honestas

- Lo que midió y anotó la edición anterior: bytes de los archivos de imagen (`Get-Item`, reconfirmados en HEAD), el estado de la rama entonces (`git log` · `git status -sb` · `git rev-list --left-right --count`: `35c91e7` local, **sin push**, ahead 1) y el vacío de los specs temporales (0 bytes). Estado de cierre que supera esos dos detalles: `35c91e7` quedó **empujado a `dev/nicolaslopezv-front`** y el **andamiaje temporal** (specs, config y `test-results/` del trabajo del hero) fue **retirado de la superficie** — ninguno queda hoy. Este registro de cierre proviene del cierre del lote, no de una medición propia de esta edición, que sigue siendo documental. Lo que esta edición no ejecutó: build, tests, axe, Playwright, capturas — **cero PASS propio** en este archivo; la corrida axe del HEAD post-halo la ejecutó el **orquestador** (17.4).
- El contraste del halo **no es lectura píxel a píxel**: lo sostienen el cálculo conservador sobre negro (secondary **4,97:1**) y la afirmación geométrica de meseta [**reportada**] — garantía de alfa de **peor caso analítico, no un compuesto muestreado píxel a píxel**. El margen AA es **estrecho** (+0,47 sobre 4,5) y el reviewer lo dejó como **residual informativo** al cerrar el P2 por aritmética (el reviewer cerró por la aritmética empeñada, no por verificación de runtime: la corrida axe posterior al halo la ejecutó el orquestador — 12 passed · 0 violaciones · exit 0 — y verifica reglas de accesibilidad sobre el HEAD servido, no el muestreo del alfa). Si la afirmación de meseta fallara — un glifo cruzando la pluma sobre una zona oscura de la escena — el contraste local bajaría del cálculo; **ninguna captura en HEAD lo confirma**.
- El halo hace que el contraste del texto dependa de `color-mix` **dentro de un gradiente**: en un motor sin soporte la declaración de fondo cae y el copy queda montado directamente sobre la escena. Degradación **sin probar**; con la placa era deuda menor (el fondo plano no dependía de `color-mix`), con el halo pasa a sostén del contraste.
- El rect 1440 de la sección con halo **no se remidió**: `35c91e7` no toca caja ni raster (cero efecto de layout por construcción: capa absoluta `-z-10`), pero la vigencia del rect es inferencia, no medición nueva.
- El total de raster del sitio de §15.5 **no se recalcula**: el WebP activo subió de 187 892 a **241 538** bytes entre tandas; la suma queda a cargo del gate.
- Sin Lighthouse · sin CLS · sin navegadores reales · sin estados de carga/error del hero.
- C-95 y C-96 siguen sin acta.

### 17.6 Tanda intermedia anterior (historia, no estado actual)

Receta de `1e15698`: velo de stops continuos **sin tramo opaco**, v2 como fuente activa y contraste medido sobre píxel compuesto (los valores superseded están en 17.3), con axe **ejecutado por el orquestador** a 3203 (`A11Y_BASE_URL=http://localhost:3203 npm run test:a11y` → 12 passed · 0 violaciones · exit 0) y reviewer **APROBADO con residuales no bloqueantes**: R1 (mínimo 4,77, margen pequeño) y R4 (asimetría perceptual del source). Nada de eso describe el sitio servido hoy; R4 es exactamente lo que 17.2 diagnosticó y 17.3 arregló.
