# REVISION-UX — Scan-Say-Done · lectura única para el responsable de UX

> 2026-10-29 · designer-alibaba · documento de bienvenida: resume el sistema, el recorrido y las correcciones pendientes. No manda sobre nadie: cada afirmación cita el documento que la fija (`INDEX.md` §"Quién manda"). Medidas: Playwright 29-oct sobre `http://localhost:3120` (build de `68c8067`); el estado tras las correcciones aplicadas está en §6b (build de `796c10f`, que ya incluye el barrido de presente a futuro en las internas).

## 1. Qué es esto y dónde está

- **Producto:** encuesta de 3 preguntas (1–5 + comentario) que el cliente del negocio responde en el navegador sin instalar nada; el dueño lee opiniones y avisos en un panel. Sitio `E:\Trabajos\scan` · Next.js 15 + Bootstrap 5.3.7 compilado · 112 commits · 9 rutas (home + 8 internas) · `robots: noindex` global **activo** — el sitio no está publicado.
- **Público:** dueño de negocio chico de cara al público (almacén, peluquería, cafetería). Voz: tuteo neutro-latino, cero jerga (CSAT/NPS/KPI prohibidos, `COPY-LANDING §12.2`).
- **Estado real — funciona:** las 9 rutas sirven 200, `check:tokens` y `check:placeholders` OK, copy de agencia extinguido (0 hits, acta F9), jerarquía de headings sin saltos, `prefers-reduced-motion` compilado, 375 px sin scroll horizontal.
- **Estado real — no funciona / no existe:** no hay ruta de encuesta ni de panel (solo marketing); el canal de correo está vacío (`SITE.contact.email`, `site.js:16`) → 0 `mailto:` en el sitio y `/contactus` sin acción; no hay fotos reales (0 `<img>` en todo el sitio); precios gated por flag `showPricing=false`.
- **Regla de oro:** **no se inventan datos, cifras ni testimonios** (gates D1/D2 de `RIESGOS-USUARIO.md`, `COPY-LANDING §12`). Todo lo que simula producto lleva etiqueta `DEMO` o texto "imagen de referencia". Marketing pedirá logos, conteos y testimonios: la respuesta es "cuando el piloto entregue casos" (`ANALISIS-MARKETING §3.1`).

## 2. Sistema en una tabla

**Color** (tokens en `_tokens.scss`; ratios con fórmula WCAG, `DESIGN-CONTRACT §1/§2/§4`):

| token | hex | uso | ratio medido |
|---|---|---|---|
| `--brand-plum` | #2E1E3F | texto en claro; fondo bandas ciruela | 14.53 vs crema · 15.29 vs blanco |
| `--brand-cream` | #FFF8F2 | fondo marketing | — |
| `--brand-coral` | #FF5F44 | **solo superficie de acción** (CTA/badge/selección) + palabra display del H1 sobre ciruela | 5.08 vs ciruela · 2.86 vs crema ✗ (vetado como texto) |
| `--link` | #B23A2A | enlaces y acento sobre claro (hover #973124) | 5.65 · hover 7.18 vs crema |
| `--text-2` | #65586E | secundario, kickers, barra legal | 6.29 vs crema |
| `--brand-mustard` | #F4B63B | decorativo ≤5% + kicker del hero sobre ciruela + badge DEMO | 8.45 vs ciruela · 6.1 sobre el glow · 1.72 vs crema ✗ |
| `--brand-peach` | #FFE7D9 | anillo de foco en banda oscura | 12.87 vs ciruela |
| `--success` / `--warning` / `--error` | #1B7A4D / #986A1E / #A82E39 | estado en panel/encuesta (texto+icono, nunca solo color) | 5.33 / 4.76 / 6.74 vs blanco |
| `--border` / `--border-strong` | plum 14% / plum 50% sobre crema | separadores / marcos F8.5, input en reposo | strong 3.03 vs crema · 3.18 vs blanco |
| `--glow-hero` | coral 28% radial estático | 2 colocaciones: hero landing + `page-hero` | no toca ratios: H1 coral 4.8 sobre el glow ✓ |

**Tipografía** (`DESIGN-CONTRACT §3`; medido en el navegador 29-oct): display **Bebas Neue** (400, siempre mayúsculas por diseño) / UI **Montserrat** (400/500/600), vía `next/font`. Escala real desktop/móvil: H1 88/44 (lh 0.92), H2 64/44, H3 48/34, KPI 40/32, h4 panel 20/18, body 16/16, lead 18/17 (hero servido: **17 a 1440**), kicker 13/12 + .14em + MAYÚS. Prohibido: Bebas en cuerpo/botones/datos, Montserrat <16 en encuesta, una tercera familia. En internas: el tamaño se logra con clase `.h4/.h5/.h6` sobre la etiqueta semántica (regla F9 — el outline del documento es lo que audita el gate).

**Espaciado y bandas:** escala `--sp-1..7` = 4/8/16/24/32/48/64 (sp-4 = 1 gutter exacto). Bandas: `--band-y-d` **100** / `--band-y-m` **60** — py medido: landing desktop 100 en las 9 bandas, móvil 60; `page-hero` 100/100. Ritmo interno: H2→lead 16 · lead→cards 48 · card↔card 24 · interior card 16.

**Grid:** Bootstrap 12 col, gutter 24. Containers: 540/720/960/1140/1320. Landing usa `container-lg` (franja, FAQ, CTA), `container-xl` (hero, pasos, canales, apps, footer), `container-xxl` (panel). Cotas: `GRID-SPEC §2` (col xl 73, span 7+5 = 655+461). CSS Grid propio solo en 3 patrones auto-fit. **Regla P0: no mezclar BS-grid y CSS-grid en la misma sección** (`UX-LANDING §1`).

**Radios/sombras:** radio de tarjeta = `var(--radius-card)`; elevación = `--shadow-card` solo en clicable/hover, **0 en reposo**, ≤3 sombras/viewport, una capa, no se transiciona (`EFECTOS §2.2`).

**Movimiento** (`EFECTOS-Y-MOTION §4`): entrada hero 500 ms `cubic-bezier(.16,1,.3,1)` stagger 60 · hover 150 ms color / 200 ms transform · acordeón y offcanvas 350 ms default BS · reveal por scroll solo bajo `@supports (animation-timeline: view())`, 0 JS. `prefers-reduced-motion: reduce` → bloque global 0.01 ms (compilado y verificado hoy). Prohibido: parallax, contadores, texto que se teclea, autoplay, glassmorphism, gradientes fuera de token.

## 3. Recorrido de la landing (banda a banda, medidas reales a 1440 / 375)

**1 · Hero** (ciruela + glow) — 720 / 938 px · py 100/60 · H1 Bebas 88/44 "¿QUÉ DICEN / **TUS CLIENTES?**" (palabra coral), kicker mostaza 13, lead 17 crema, CTA coral 46 + ghost crema 46, teléfono decorativo `aria-hidden` con escala 1–5.
*Propósito:* valor en 5 s. *No lleva:* **QR** (decisión cerrada `ANALISIS-QR §3` op. A — un QR que no escanea rompe la promesa central), foto (no existe el asset; la alternativa generada está vetada, F5 crítica #1), contadores. *Ojo:* `UX-LANDING §3.1` dice que la tarjeta cruza la banda ~45 px — **eso ya no existe** (revertido en `32b4a86`; medido: la tarjeta termina 176 px antes del borde). Ver §6-P0-1.

**2 · Franja de confianza** (crema) — 193 / 412 px · 4 claims auto-fit: `3 PREGUNTAS · SIN INSTALAR NADA · SIN CUENTA PARA TUS CLIENTES · EL QR NO SE REIMPRE`.
*Propósito:* hechos verificables hoy. *No lleva:* CTA (rol de apoyo) ni conteos de clientes (gate D2; la opción "piloto con 5 negocios" solo si el operador la confirma — hoy NO publicada).

**3 · Cómo funciona** (blanco, `#como-funciona`) — 568 / 872 px · H2 64 + kicker, ESCANEA/OPINA/LISTO en `col-md-4` con conector coral 2 px (vertical <768), número 40 Bebas en badge coral.
*No lleva:* tiempos cronometrados — la cifra "20 s" se retiró del copy (C2a, `COPY-LANDING §15`) hasta tener mediana de piloto.

**4 · Canales** (crema, `#canales`) — 747 / 1463 px · 4 tarjetas MOSTRADOR/INSTAGRAM/WHATSAPP/TIKTOK LIVE (`col-xl-3` = 267 px; lg 2×2; **no** `col-lg-3`, daría 222 px y rompería bullets — `DECISIONES §3`).
*No lleva:* CTA por tarjeta (son informativos, no 4 CTAs rivales — `UX-LANDING §2` f4) ni logos de marca recoloreados (rechazo P0, `UPGRADE-VISUAL §3`).

**5 · Aplicaciones** (blanco, `#aplicaciones`) — 681 / 1260 px · 3 marcos 4/3 medidos 356×267 (`acta F5 cerró 364×273` — hoy −8 px por padding/borde, a reconciliar) con fondo peach + isotipo + "imagen de referencia" + badge DEMO.
*No lleva:* fotos — las generadas con personas y QR coral fueron retiradas de producción (F5 crítica). El vacío se corrige, no se disfraza: §6-P1-7.

**6 · Panel** (crema, `#panel`, única sección `container-xxl`) — 735 / 804 px · marco medido **856×535** (acta F6 dijo 880×550; plano 872×545 — tres cifras, §6-P2-13) + 2 callouts solo desktop + 3 bullets + ghost "Ver mi panel"+DEMO. Nota literal servida: `Panel en construcción. Te avisamos cuando esté.` (unificada con la interna en `6982ccc`; la tabla de `COPY-INTERNAS §1` quedó desactualizada).
*No lleva:* cifras (KPIs del panel no van en la landing; `452/4,6/12/3` rechazado, `UPGRADE §1`) — y no puede mostrar el panel porque no existe ruta. Es el fallback más pesado de la página: 856×535 de marco vacío. §6-P1-6.

**7 · FAQ** (crema, `#faq`) — 761 / 767 px · acordeón BS en `col-lg-8 offset-lg-2` (~640 px de línea), ítems plegados 59 px (≥48 ✓), 5 preguntas visibles + la 6ª ("¿Puedo probarlo antes de pagar?") oculta tras `showPricing`. Pie `¿Otra duda? Escríbenos` → `/contactus` (link 5.65 ✓).
*No lleva:* pregunta de precios visible mientras no haya montos (C3). *Problema:* queda pegada a Panel, ambas crema — ver §6-P0-2.

**8 · CTA final** (ciruela, `#cta-final`) — 497 / 466 px · H2 64 crema, botón 56, lead 10.84, descargo honesto 8.75 (`Si no recibes clientes en el local ni vendes por redes, hoy esto todavía no te sirve.`).
*No lleva:* "Sin tarjeta" (no confirmado, acta F8), segunda acción (rechazo `UPGRADE §0`). El ghost sobre ciruela usa la variante invertida crema↔ciruela (el desliz F2 a 1.00:1 ya no vuelve).

**9 · Footer** (crema — H-1 resuelto en `DECISIONES §4`: sobre ciruela ningún enlace pasa AA, `--link` daría 2.57) — 434 px · pt 100 / **pb 16 medido** (la spec dice 48; §6-P2-11) · 12 enlaces, títulos de columna Bebas **36 px = fuera de escala** (§6-P1-10). *No debería llevar* CTA (`UX-LANDING §2` f10) y **hoy lleva** un primario coral de 39 px: §6-P0-4.

## 4. Rutas internas (patrón `page-hero`)

Las 8 internas abren con **`page-hero`**: banda ciruela + `--glow-hero` (misma token, 2.ª colocación, 1 por página) + breadcrumb crema (foco = contorno `outline:3px` crema, ~12:1; el cambio de color solo daba 1.66 ✗) + H1 Bebas 88 + lead 18 crema 75%. Altos medidos: **407–430 px** con lead, **321 px** sin lead (`/faqs`, `/pricing`); py 100/100. Las internas **no llevan CTA final ciruela** (regla de ritmo, `DESIGN-CONTRACT §4` F9). Cuerpos: 1148–2344 px según ruta; headings con clase visual `.h5/.h6` sobre etiqueta semántica. Verbo de CTA interno: `ESCRIBINOS` / `VER PREGUNTAS FRECUENTES` (regla `COPY-INTERNAS` encabezado). `/terms` y `/privacy`: aviso legal único arriba, patrón "se publicará una vez completada la revisión legal" en vez de corchetes (0 `[confirmar` servidos ✓). `/faqs` reusa el módulo `data/faq-product.js` (fuente única con la home). `/pricing`: bloque neutro sin cifras. Pendiente de plano: `page-hero` no tiene SVG (deuda `wireframes/INDEX.md`).

## 5. Reglas que no se pueden romper

1. **Coral ≠ texto sobre claro** (2.86/3.01 < 4.5). Excepción única: una palabra display ≥44 px del H1 sobre ciruela (5.08 / 4.8 medidos) — 1 span por página.
2. **Mostaza ≤5% de pantalla, texto solo sobre ciruela** (kicker hero 6.1 sobre glow ✓; sobre crema 1.72 ✗).
3. **No se inventan datos** — claims de producto, badges DEMO, "—" si el dato no existe (`DASHBOARD-UX §3` n<10 sin % ni promedio).
4. **Objetivo táctil ≥44×44 sin excepción** (contrato §5 F3) — hoy se incumple en nav/footer/internas (39 px): §6-P0-3.
5. **Ningún estado solo por color** — badge = icono + texto; foco `outline:3px` + offset 2 (peach en oscuro); nunca `outline:none`.
6. **Reduced-motion obligatorio** en toda animación; solo `transform`/`opacity`; 0 JS de efectos nuevos; `will-change` 0; sombras ≤3/viewport.
7. **Dos fondos iguales nunca adyacentes**; ciruela solo en 3 colocaciones (hero, CTA final, page-hero) — hoy Panel+FAQ violan la primera: §6-P0-2.
8. **Los planos SVG mandan en medidas; los mockups nunca** (`GRID-SPEC §5`).
9. **Sin tercera familia, sin emoji-icono, sin logos de marca recoloreados**; wordmark #000014 jamá sobre ciruela (1.36).
10. **Contrastes solo con fórmula WCAG publicada** — prohibido "se ve bien" (`INDEX.md` regla 9).

## 6. Correcciones que haría (criterio de diseñador, priorizadas)

| # | Prioridad | Qué y por qué | Coste | Criterio de aceptación medible |
|---|---|---|---|---|
| 1 | **P0** | **Documentar la verdad del hero:** `UX-LANDING §2/§3.1` dice que la tarjeta cruza la banda 45 px; el bloque B4 fue revertido (`32b4a86`). Contradicción doc↔código. Recomiendo enmendar el doc, no re-implementar (B4 nunca llegó al criterio de 24 px). | 1 párrafo, 0 código | El ASCII §3.1 describe el DOM actual; la captura land-01 y el doc coinciden. |
| 2 | **P0** | **Ritmo roto en servido: Panel(crema)→FAQ(crema) adyacentes** (medido). La regla "no adyacentes" se escribió asumiendo Precios (blanco) en medio; con `showPricing=false` quedan 1476 px de crema continua. Fix: FAQ a blanco, o banda `--grad-surface` 120 px entre ambas (permitida, 3/página). | ~2 SCSS o 1 token | Secuencia medida en DOM sin dos fondos iguales seguidos; visible en captura nueva. |
| 3 | **P0** | **Táctiles de 39 px** en nav (desktop), footer y CTAs de internas vs regla §5-4. Un `min-height` en `.btn` lo cierra. | 1–2 SCSS + revisar alto nav 76 | Todo `a.btn`/`button.btn` visible ≥44 px a 1440 y 375 (Playwright). |
| 4 | **P0** | **CTA coral en el footer** contradice `UX-LANDING §2` f10 y el presupuesto de 1 coral visible por pantalla. Decisión del operador: quitarlo o enmendar con acta — no dejar el desvío vivo. | 1 JSX | 0 botones primarios coral en `<footer>`; o acta nueva que lo apruebe y renumere la regla. |
| 5 | **P1** | **El CTA primario se repite 4 veces** (nav, hero, footer, cierre) con etiqueta "Crear mi encuesta" que desemboca en `/contactus` — el verbo promete crear y la página pide escribir. Con #4 fuera: unificar criterio — primarios hero/cierre "ESCRIBINOS" o bajar el nav a ghost. Todo pasa por aprobación del operador (`COPY §13`). | 3–4 etiquetas, 0 CSS | Máx. 2 primarios visibles en la landing; el verbo de cada botón coincide con lo que hace su destino. |
| 6 | **P1** | **Peso del fallback del panel:** 856×535 de marco vacío con badge DEMO — la banda más cara de la página es la que menos muestra. Fix: wireframe estructural del panel en SVG inline (columnas, chips de filtro, fila con 1–5 y "—" — cero cifras), o reducir el marco a col-lg-5. | SVG 2–4 h o 2 SCSS | El marco del panel no es superficie monocolor; 0 datos inventados dentro. |
| 7 | **P1** | **Vacío de Aplicaciones:** los 3 marcos son peach+isotipo. "Pantalla de encuesta" se puede resolver **sin foto**: es el propio componente de encuesta renderizado como SVG a 4/3. Cartel y vinilo: foto real del piloto (dependencia del operador); hasta entonces, 2 de 3 marcos admiten esquema de line-art del objeto (sin personas). | 3–5 h SVG + foto operador | ≥1 de 3 marcos muestra el producto real; ningún asset generado con personas ni QR no escaneable (F5). |
| 8 | **P1** | **Prueba social sin mentir:** hoy el activo de credibilidad es la transparencia ("Panel en construcción…"). Compensar el hueco: visibilizar el proceso — una línea de estado honesta ("en preparación para su primer piloto, [mes]" solo si el operador fija el dato) + el FAQ de "¿y si nadie responde?" (propuesto en `ANALISIS-MARKETING §2.3`). Nunca conteos/logos/testimonios hasta que existan. | 2 líneas de copy | Cada afirmación de tracción tiene dueño y dato; 0 cifras nuevas sin acta. |
| 9 | **P1** | **Competencia coral–mostaza en el hero:** en la misma esquina hay 4 señales (kicker mostaza + H1 coral + CTA coral + glow coral 28%). Mi criterio: el glow se queda, el acento del H1 se queda (es la firma F8.5), y el kicker pasa de mostaza a crema 75 % (como el de las internas): el hero recupera un solo acento cálido — el botón. Deja la mostaza para la insignia DEMO. | 1 SCSS | Hero sin texto mostaza; la palabra mostaza restante por pantalla es el badge DEMO; ratio crema75/ciruela no baja de AA (ya sirve hoy en page-hero). |
| 10 | **P1** | **Títulos de columna del footer en Bebas 36** — valor fuera de la escala del contrato (88/64/48/40) y le otorga a "Producto/Recursos/Legal" el peso visual de secciones de contenido. Pasar a overline (Montserrat 600 13 .14em `--text-2`), como el kicker. | 3 tags + 1 SCSS | Ninguna fuente display fuera de la escala §3; footer jerárquicamente más bajo que cualquier banda. |
| 11 | **P2** | **Desvíos doc↔medida menores:** footer pb 16 vs spec 48; lead hero 17 vs tabla 18 desktop; la tabla de `COPY-INTERNAS §1` sigue describiendo como vivo el desvío de la cadena del panel (ya unificado en `6982ccc`). Enmendar en la pasada documental. | 3 líneas | doc == navegador para cada valor citado en §3. |
| 12 | **P2** | **Eyebrows sin cerrar:** las 5 cadenas F8.5 viven en la página y siguen pendientes de aprobación (`COPY §13` ítems 7–11, la nota 9 ya fue corregida). Gobernanza, no píxel: sesión de 15 min con el operador para aprobar/cambiar/borrar cada una. | 15 min + acta | Lista §13 cerrada: cada cadena publicada tiene visto bueno o no está. |
| 13 | **P2** | **Cifras de marco en tres versiones** (panel 856×535 medido / 880×550 F6 / 872×545 plano; apps 356×267 / 364×273 F5). Definir si la cota es del marco interior o de la tarjeta, medir una vez y registrar. | 1 acta | Un número canónico por marco en acta nueva; SVG del plano alineado. |

### 6b. Estado de aplicación (actualizado 29-oct, commit `796c10f`)

| # | Estado | Cómo quedó verificado |
|---|---|---|
| 1 | **Aplicada como enmienda de documento** | `UX-LANDING §3.1` ya no afirma el solape; describe el DOM real (tarjeta dentro de la banda, `overlap = 0`) y prohíbe re-implementarlo sin captura que lo justifique |
| 2 | **Aplicada** | el FAQ pasa a banda blanca; secuencia medida: ciruela → crema → blanco → crema → blanco → crema → **blanco** → ciruela, sin dos fondos iguales adyacentes |
| 3 | **Aplicada** | `min-height: 44px` en `a.btn`, `button.btn` y enlaces de nav: mínimo medido **44 px** a 1440 y a 375 |
| 4 | **Aplicada** | 0 botones `btn-primary` dentro de `<footer>`; "Escríbenos" queda como enlace de texto |
| 10 | **Aplicada** | títulos de columna del footer medidos en `13px / Montserrat / 1.82px` (overline del contrato §3) |
| 5, 6, 7, 8, 9, 11, 12, 13 | **Pendientes** | 5, 6, 7, 8 y 12 necesitan decisión del operador (verbo del CTA, contenido sin fotos, aprobación de eyebrows); 9 es criterio estético discutible (kicker mostaza del hero); 11 y 13 son pasada documental |

> El sistema quedó, tras esta pasada, sin violaciones de las reglas §5-4 (táctiles) y §5-7 (fondos adyacentes). Las capturas de `capturas/2026-10-29/` fueron regeneradas **después** de estos cambios.

## 7. Qué mirar primero si hay 30 minutos

1. `git status --short` y hora del build vs hora de los fuentes (el servidor sirve `68c8067`, no el árbol actual).
2. `npm run build` → exit 0 · `npm run check:tokens` · `npm run check:placeholders` → 0.
3. Secuencia de fondos de `main section` (snippet Playwright de §3): sin dos iguales adyacentes (hoy falla Panel→FAQ).
4. Altura de todo `.btn` visible: ≥44 (hoy 39 en nav/footer/internas).
5. `grep -E "#6366f1|#0e6e5c|text-coral"` sobre `src/` → 0; coral como texto solo en `CLIENTES?`.
6. Un `h1` por página y outline sin saltos (las internas usan `.h5/.h6` — el DOM manda, no el tamaño).
7. Foco: tabular hero→CTA→acordeón→footer; anillo visible sobre ciruela (peach); breadcrumb con contorno crema.
8. Playwright `emulateMedia({ reducedMotion: 'reduce' })`: mismo texto y orden que sin emular.
9. Badges: 5 DEMO servidos (3 apps + panel + nota); "imagen de referencia" presente en los 3 marcos.
10. Bandas ciruela: landing 2 (hero, cierre) sin adyacencia; cada interna abre con page-hero y **no** cierra con ciruela.
11. 375 px: sin scroll horizontal; H1+CTA del hero por encima del pliegue (medido: CTA termina en 436 de 812).
12. `robots: noindex` sigue activo en `layout.js` — quitarlo es el último paso antes de publicar y es decisión del operador con los datos §F9.

## 8. Guía para diseños futuros (qué hereda y qué decidir antes de dibujar)

- **Panel real** (`/panel/*`): hereda el shell de `DASHBOARD-UX §1` (sidebar 264 = 11 gutters · C 1128 · col 72 · zona oscura con peach de foco) y las reglas de datos `§3` (n<10: absolutos; "—" si no existe el dato; nunca NPS/jerga). Antes de dibujar: flujo real de acceso (magic link — no existe aún), vista del QR vivo (decisión `ANALISIS-QR §3`), qué convierte una opinión en aviso (`COPY-INTERNAS §2` item 6, dato del operador). La cuarta vista NO está abierta (`DECISIONES §1`): 3 destinos, el vacío es estado.
- **`/pricing` con precios**: hereda la retícula de `UX-LANDING §3.6` (3×`col-lg-4`, precio Bebas 48, recomendado bordado coral 2 px, DOM recomendado→A→C). Antes: montos y features reales fijados por el operador sobre el borrador `COPY-LANDING §7`, encender el flag `showPricing` (guard triple `hasPricing()`), y recién entonces copiar cadenas; la sección oculta hoy no se enlaza desde nav/footer.
- **Email de bienvenida**: hereda paleta y voz (ciruela dominante, coral solo en superficie con texto ciruela 5.08; nada de mostaza en body; `--link` para enlaces). Restricciones que deciden el diseño antes del CSS: los clientes de correo no cargan Bebas → wordmark como PNG/SVG outlined (regla del logo vectorizado, `DECISIONES §5`), ancho 600 px, nada de cifras de producto que aún no existen.
- **OG images** (1200×630): banda ciruela + glow estático es coherente; bajada de marca `ESCANEA. OPINA. LISTO.` va aquí y solo aquí (no en el hero, C4); logo CLARO sobre ciruela (el #000014 daría 1.36); 0 testimonios/estrellas/conteos; texto tipográfico outlined (el SVG como `<img>` no carga fuentes).
