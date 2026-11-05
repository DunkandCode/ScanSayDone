# AUDITORÍA — AI slop de la landing (05-nov-2026)

> Auditor: designer (GLM-5.3). Método: capturas completas 1440/375 recortadas en bandas y leídas por visión (inventario factual, cotas NO del modelo) + `page.js` (424 L) + `_home.scss` + `DESIGN-CONTRACT.md` · `UX-LANDING.md` · `COPY-LANDING.md` + 4 actas del login de hoy. Detector `impeccable@4.8.0 detect` sobre `page.js` y `_home.scss`: **`[]`, exit 0** — cero hallazgos de sus 62 reglas en código. El slop que queda no lo ve un linter: es de composición.

## 1 · Inventario sección por sección

| Sección | Alto | Copy que dice | Elementos sin aporte | Veredicto |
|---|---|---|---|---|
| `hero-band` | 720 | `3 PREGUNTAS. UN QR. LISTO.` → `¿QUÉ DICEN TUS CLIENTES?` → sub 16 pal. → 2 CTA → línea transparencia. Mock: pregunta real + escala 1–5 + badge mostaza `3 preguntas` | 0 — el mock enseña el producto; badge repite el kicker (leve) | **se queda** |
| `trust-strip` | 193 | `3 PREGUNTAS` / `SIN INSTALAR NADA` / `SIN CUENTA…` / `EL QR NO SE REIMPRE` + 4 iconos | 3 de 4 claims ya dichos arriba (kicker, subtítulo, `hero-transparency`); iconos espejo del título (`FiSmartphone`=SIN INSTALAR) | **se recorta** |
| `como-funciona` | 568 | `ASÍ FUNCIONA` + lead + ESCANEA/OPINA/LISTO + conector coral | 0 — secuencia real con conector; es proceso, no rejilla de features | **se queda** |
| `canales` | 747 | `TUS CUATRO CANALES` + 4 tarjetas (mostrador/IG/WA/TikTok) con label "cómo se usa" anclado abajo | 0 por tarjeta; estructura icono-arriba+título+2 líneas es el patrón, pero cada canal es distinto y acta §3 lo aprobó | **se queda** |
| `aplicaciones` | 681 | `ASÍ SE VE EN TU LOCAL` + 3 marcos peach `imagen de referencia` + logo repetido ×3 + badge `DEMO` ×3 + caption | los 3 marcos idénticos con el mismo isotipo = marcadores, no contenido | **se recorta** (hasta F5) |
| `panel-preview` | 735 | `TODO EN UNA PANTALLA` + marco peach `CAPTURA DE REFERENCIA` + callouts `❶❷` + 3 bullets + `VER MI PANEL` + badge DEMO ×2 | badge DEMO duplicado (marco **y** botón) + nota "Panel en construcción" = el aviso vive ×3 | **se recorta** |
| `faq` | 761 | 5 preguntas reales + pie `¿Otra duda?` | 0 — acordeón honesto, 1ª abierta | **se queda** |
| `cta-final` | 497 | `CREA TU PRIMERA ENCUESTA` + sub + CTA + descalificación honesta | 0 | **se queda** |

`pricing` oculta por flag: no auditada como visible (correcto).

## 2 · Los slop reales (6; lo demás está limpio)

| # | Sección | Qué es slop | Por qué | Gravedad | Arreglo en una línea |
|---|---|---|---|---|---|
| 1 | trust-strip | Franja de 4 claims redundantes + iconos que repiten el título literal | Repite lo dicho 90 px arriba; existe para llenar el hueco hero→cómo-funciona | **P1** | Eliminar franja; mover `EL QR NO SE REIMPRE` al paso 1 o label de mostrador |
| 2 | apps + panel | 4 marcos peach con el mismo isotipo + `imagen de referencia`/`CAPTURA…` | Franja de marcadores: contenedores que prometen contenido que no existe | **P1** | Marco sin relleno (blanco + borde fino) y sin isotipo repetido; 1 solo badge global |
| 3 | how/canales/apps/faq | 4 cabeceras centradas idénticas (`.how__headline`, `.canales__head`, `.apps__head`, `.faq__head` → `text-align:center`, `_home.scss:932–941`) | Monotonía de plantilla; el wireframe §3.3/3.4 pide H2 **izq.** — drift plano↔código | **P1** | `text-align:left` en how/canales/apps; FAQ queda centrado (acordeón angosto) |
| 4 | apps/panel/hero | 5 pastillas mostaza `DEMO` idénticas (3 marcos + marco panel + dentro de `VER MI PANEL`) | Badge-spam: el aviso honesto repetido 5× lee plantilla, no honestidad; mostaza firma diluida | P2 | Dejar el del marco panel; fuera el del botón y el de apps (label ya avisa) |
| 5 | hero | `Ver ejemplo` ancla a `#como-funciona` (`page.js:26`) | Promete ejemplo, entrega pasos — misma promesa vacía que el "o" del login (A1) | P2 | `Ver los pasos`, o apuntar a `#panel` que sí muestra la encuesta |
| 6 | _home.scss | CSS muerto del template: `#boxed-layput` (typo) + `moveSlideshow` (`:320–342`), sin uso en `page.js` | Slop de código invisible: peso y confusión para el siguiente | P2 | Borrar el bloque (verificación: grep `boxed-layput|moveSlideshow` en src = 0 usos) |

Limpio de verdad: hero, cómo-funciona, FAQ, CTA final. Sin "trusted by", sin cifras inventadas, sin vidrio decorativo, sin emoji-icono, sin glow libre (el `--glow-hero` es token registrado con 2 colocaciones, F9).

## 3 · Lo que el login resolvió y la landing todavía no

| Lección del login | ¿Falta en la landing? | Dónde |
|---|---|---|
| (a) Contraste **medido**, no estimado | **Sí** | 4 textos llevan `opacity` sin medición por píxel: `.hero-subtitle` .85, `.hero-transparency` .7, `.cta-final__subtitle` .85, `.cta-final__honesty` .75. El contrato midió crema 100 % y el blend 75 % (`--text-2` oscuro); **.7 y .85 no están en ninguna acta** |
| (b) El vidrio/contenedor solo se lee si hay algo detrás | **Sí** | `apps__frame` y `panel-preview__frame`: cajas peach que promueven fotos/capturas inexistentes — equivalente exacto del divisor "o" que prometía un segundo método que no había |
| (c) El filo de luz define el canto | Parcial | Regla de marco 1 px ya cubre canales/apps (lámina §5.1). Única excepción: `.hero-phone-card` usa `--shadow-card` sin filo — el login ganó filo `inset 0 1px 0`; el mock podría heredarlo |
| (d) Ritmo: agrupar lo junto, separar lo suelto | **Sí** | Hero: `hero-cta-group` → `hero-transparency` a 24 px (mismo escalón que entre botones) — lo secundario debería ir a ~40. Dentro de tarjetas todo es `sp-3/sp-4`: un solo escalón |
| (e) Contenedor sin relleno + borde fino comunica más | **Sí** | Es el arreglo natural del slop #2: los marcos de referencia no necesitan llenarse de peach para existir — el deck del login se leyó "transparente con borde fino" con delta `[0,+4,+7]` |

## 4 · Ritmo y jerarquía

- Saltos reales: 720 · **193** · 568 · 747 · 681 · 735 · 761 · 497. El de 193 (trust) es un suspiro entre dos bandas grandes — otra señal de que es relleno.
- **Sí hay bandas que se sienten iguales:** canales 747 / apps 681 / panel 735 / faq 761 — cuatro bandas consecutivas de ~700 px con la misma anatomía (kicker+H2 centrados → rejilla de 3–4 cajas → banda siguiente). La alternancia crema/blanco las separa en color, no en estructura.
- ¿Hero 720 demasiado para lo que dice? El copy cabe en ~560 px; los 160 restantes son aire del `min-height:80vh` (regla §7 de UX-LANDING). Con 80vh **no** se toca — pero conviene saber que el primer claim **nuevo** llega a los ~989 px de scroll porque trust repite al hero. Cortando trust (N2) el contenido nuevo baja a ~796 px.
- FAQ en blanco rompe la alternancia crema→crema que hubiese dejado panel+faq adyacentes: el código está bien, el §2/§6 de UX-LANDING (dice "FAQ crema") quedó viejo — drift de doc, no de página.

## 5 · Propuesta en 3 niveles

**N1 — cosmético (≤6, selector → valor):**
1. `.how__headline, .canales__head, .apps__head` → `text-align:left` (slop #3)
2. `.apps__frame, .panel-preview__frame` → `background: var(--brand-white)`, isotipo fuera, borde `--border-strong` (slop #2, lección e)
3. `.panel-preview__cta-badge` → fuera (slop #4; el marco y la nota ya avisan)
4. `.apps__frame-badge` → fuera (label `imagen de referencia` basta)
5. `page.js:26` `Ver ejemplo` → `Ver los pasos` (slop #5)
6. `.hero-transparency` → `margin-top: 28px` (lección d)

**N2 — recorte de contenido:**
- **Eliminar `trust-strip`** (−193 px). Ganas: el scroll deja de repetirse y llega antes a cómo-funciona; te pierdes: 4 anclas de "sin fricción" que el hero ya dice con better copy. El claim único nuevo (`EL QR NO SE REIMPRE`) sobrevive en el label del canal mostrador o en el paso 1.
- **Apps: 3 marcos → 1** (el que enseña la pantalla de encuesta) + los otros dos usos como lista de texto con sus captions. Ganas: −~340 px y fuera la franja de marcadores; te pierdes: anticipar los 3 soportes físicos hasta que existan fotos (F5 ya lo tiene planificado).

**N3 — estructural (costo alto, no hoy):**
- Fusionar `aplicaciones` dentro de `canales` (cada canal muestra su soporte físico) y quedar en 6 bandas: hero → cómo-funciona → canales+aplicaciones → panel → faq → cta. Costo: replan de `04`/`05`, recapturas, acta, re-verificación de ritmo ciruela (F9). Gana: −680 px y la página deja de tener DOS rejillas de tarjetas iguales seguidas (canales y apps).

## 6 · Lo que NO hay que tocar (un refactor ciego lo revierte)

1. `CLIENTES?` coral en el H1 (F8.5, 4.8 ✓ medido sobre el glow) y el kicker mostaza (6.1 ✓) — excepciones registradas, no slop.
2. Botón ciruela-sobre-coral (5.08 ✓) y su flip crema al hover — es la firma (§6).
3. El mock del hero: escala 1–5 con reglas F2 cerradas (`flex:1`, etiquetas 2 líneas, `aria-hidden`, spans no botones). No reabrir el solape: descartado por captura (§3.1).
4. `--glow-hero` estático y sus 2 colocaciones (F9); `min-height:80vh` del hero (§7).
5. Footer crema + `--link` 5.65 ✓ (acta §4) y navbar crema permanente (`fb7d600`).
6. `pricing` oculto tras `hasPricing()` — no "completarlo" para que la página pese más: sin precios reales, mostrarlo es el slop #4 de la lista (números inventados).
7. Tarjetas de canales sin sombra con label anclado (`margin-top:auto` + `min-height:2.4em`) — craft correcto, no aburrimiento.
8. FAQ en blanco (corrige adyacencia crema-crema); actualizar UX-LANDING §2/§6 en la misma pasada de docs, no el SCSS.

---
*Evidencia: bandas de captura en `%TEMP%\opencode\land-audit\` (d1–d6, m1–m3, recorte propio) · `impeccable` exit 0 · líneas citadas de `page.js` y `_home.scss` verificación directa.*
