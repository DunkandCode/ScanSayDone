# PLAN-EJECUCION-LANDING — arranque de construcción del landing Scan-Say-Done

> Plan, no ejecución · 2026-10-27 · scope: solo sitio de marketing. Mapea `BUILD-ORDER.md` (filas 0.1–9) a fases F0–F8 con la numeración del operador.
> Compañero obligatorio: `EFECTOS-Y-MOTION.md` (checks §5 entran en el gate de F0, F2, F8). Cotas: `wireframes/GRID-SPEC.md` ±2 px (convención §1 del plano).

## 1. Precondiciones (bloqueantes) — estado real verificado hoy

| # | Precondición | Estado real (evidencia) | Veredicto |
|---|---|---|---|
| P1 | 4 variantes SVG del logo (`logo-horizontal-dark/light`, `vertical-dark/light`, `symbol`, `mono` — acta §5) | **isotipo SVG hecho**: `components/brand/logo-symbol.jsx` (`currentColor`, 36 px en nav/footer) + `brand-src/logo-symbol.svg` y `lockup-preview.html`; el wordmark se compone como **texto vivo** (Bebas) en HTML. Variantes de wordmark vectorizadas: pendientes | **cerrada parcial** — no bloquea F1/F2 (nav usa isotipo + texto); solo falta el wordmark outlined si algún día se necesita en OG/correo |
| P2 | F6 coral definitivo `#FF5F44` | **cerrado**: adoptado como token `--brand-coral`; `DECISIONES-2026-10-27.md` §6 | **cerrada** |
| P3 | Tokens en `_tokens.scss` (primitivos + semánticos + banda + `--grad-*`/`--shadow-*`/`--dur-*`) | **existe** `_tokens.scss` (80 L) + `_brand-vars.scss` como fuente única de color; guarda `npm run check:tokens` | **cerrada** |
| P4 | Bootstrap compilado desde `bootstrap/scss` | **cerrado**: `layout.js` importa `assets/scss/bootstrap.scss`; `bootstrap.min.css` fuera del source; azul de fábrica = 0 en el CSS | **cerrada** |
| P5 | Copy Scan-Say-Done para las 9 rutas (regla BUILD-ORDER: "copy primero, píxel después") | **cerrado**: `COPY-LANDING.md` rev C1–C4 aprobado y aplicado en hero, franja, cómo funciona, canales, aplicaciones, panel y footer | **cerrada** — `/pricing` y `/faqs` conservan copy de agencia: es F8 |

Nada está verde del todo: F0 (P3+P4) puede abrir ya; P1/P2/P5 corren en paralelo como requisitos de publicación.

## 2. Fases — salida, riesgo y recorte

| fase | archivos que se tocan | criterio de aceptación medible | riesgo | qué se recorta si no alcanza |
|---|---|---|---|---|
| **F0** tokens+fuentes+iconos (0.1–0.4) | `_tokens.scss` (nuevo), `bootstrap.scss` (nuevo entry `@use "bootstrap/scss/bootstrap" with ($theme-colors…, $enable-reduced-motion: true)`), `_variables.scss`, `style.scss`, `layout.js` (next/font Bebas 400 + Montserrat 400/500/600; fuera import dist y `@import` Kumbh `_variables.scss:6`), `_components.scss:366,480` (`content:`→SVG), route groups `(marketing)`/`(panel)`/`(public)` | `npm run build` exit 0 · `grep 0e6e5c`=0 · `grep mdi-`=0 · un solo Bootstrap en el bundle · H1 = Bebas 88/60 · `--band-y-d/m` y `--sp-1..7` definidos | los 193 `!important` heredados pujan desde `_bootstrap-custom.scss:22–87` — se corrigen los **mapas**, nunca compitiendo con clases nuevas; deudas F2 (2 `content:`) frenan quitar `@mdi/font` | iconos: dejar provisionalmente `@mdi/font` montada (no se cobra el ahorro de ≈741 KB) y re-escribir los 2 `content:` en F1; route groups no se recortan nunca |
| **F1** shell: navbar + footer | `(marketing)/layout`, `navbar/navlight.jsx` (logo 108×36 SVG claro, burger + offcanvas <lg), `components/footer.jsx`, `_footer.scss:29`, 4 columnas `col-md-3` banda crema | nav y footer renderizan en las 9 rutas · foco `outline 3px` visible · `--link` 5.65 sobre crema · 0 enlaces de agencia · targets ≥44 px · burger opera con teclado (offcanvas BS, sin re-animar) | P1 sin resolver → placeholder: PNG del logo **sin estirar** (3:1, `alt=""`+`aria-hidden`) marcado `TODO-SVG` | footer a 2×2 bajo xl (variantes ya contempladas en `07-footer.svg` no hace falta: es recorte de columnas); si P1 sigue ausente en F2, el placeholder viaja y bloquea solo publicación |
| **F2** hero + strip de confianza (filas 1–2) | `(marketing)/page.jsx` raíz, componente hero nuevo, CSS Grid `repeat(auto-fit,minmax(220px,1fr))` | row 655+24+461=1140 (`01-hero.svg`) · crema/ciruela 14.53 · CTA ciruela-sobre-coral 5.08 · sin foto: solo mock QR aria-hidden · 375 sin scroll horizontal · banda ≥80vh desktop · entrada de carga ≤600 ms (EFECTOS §4) y pasa el check 2 reduced-motion | el 4.º claim del strip sin dato real → tentación de inventarlo; el mock del hero compite con H1 por altura en móvil | strip: 3 claims (el 4.º entra solo con conteo del piloto — gate ya fijado); tarjeta QR: a `display:none` <375 px manteniendo H1+CTA above the fold |
| **F3** cómo funciona | componente pasos nuevo (blanco, `col-md-4`×3 + conector 2px coral) | 3×364+2×24=1140 (`02`) · badges 1-2-3 Bebas 40 SVG/CSS, 0 emoji · <768: `border-left` vertical y orden 3→1 respetando DOM 1→3 · ghost `VER EJEMPLO DE ENCUESTA` funciona | apilado invertido con `order-*` rompería lectura de teclado | conector eliminado (pasos numerados bastan — el número ya carga la secuencia) |
| **F4** canales | componente canales (crema, `col-12 col-lg-6 col-xl-3` ×4) | 4×267+3×24=1140 (`03`) · MOSTRADOR/INSTAGRAM/WHATSAPP/TIKTOK LIVE (acta §3) · icono `react-icons` como superficie coral (nunca texto coral) · sin CTA por tarjeta · lg=2×2, nunca `col-lg-3` | los 4 canales con igual peso pueden leerse como tabla; el mini-visual dentro de tarjeta exige assets que no existen | mini-galeria `auto-fit gap sp-2` fuera (icono+bullets venden solos) |
| **F5** aplicaciones en contexto | componente `col-lg-4`×3, fotos 4/3 `object-fit:cover`, caption debajo (nombre 600 + uso 14 `--text-2`) | 3 marcos con `width/height` + lazy · borde 1px `--border`, **sin sombra** (§5.1 UX-LANDING) · sin render: skeleton `--surface-2` + badge "demo" · CLS 0 en check 3 | las fotos reales dependen de `ASSET-PIPELINE`/renders (no medibles hoy); temptation de `--grad-overlay` sobre foto | la sección queda en skeleton-demo (no se oculta: crema→blanco→crema de §4 se rompería al quitar la banda blanca) |
| **F6** captura del panel | componente captura (`container-xxl`, `col-lg-7`+`col-lg-5`) | frame 872×545 = 16/10 con `aspect-ratio` → CLS 0 · callouts solo desktop · borde 1px sin sombra · ghost `VER MI PANEL (demo)` | la captura real no existe hasta S2 (6–11 nov, PLAN §8) — el hueco ya está acotado por el plano `04` | skeleton `--surface-2` + badge "demo" (placeholder ya especificado; el resto de la fila no se toca) |
| **F7** precios | sección inline en `page.js` (`#precios`) + `SITE.plans` en `site.js` | **gated por `hasPricing()`**: flag `showPricing` **y** 3 planes con precio no vacío → sin ambas no se renderiza ni se enlaza (`F7` implementada, no publicada) · 3×364 · borde 2px coral + badge `RECOMENDADO` · orden DOM recomendado→básico→negocio · precio Bebas 48 | los "$8/$29" del mockup están inventados — `check:placeholders` debe cazar cualquier cifra suelta | **no se publica** mientras el flag esté en `false`; F7 no bloquea F8 |
| **F8** FAQ + CTA final | `components/faq/faq-one.jsx`, `components/cta/*`, `/faqs` | acordeón ≥48 px/ítem, transiciones BS 350 ms sin re-escribir · chevron SVG (F2 debt) · row 550+24+386=960 en lg (`06`) · 1 solo CTA coral visible · banda ciruela: foco `--brand-peach` 12.87 · CTA final 5.08 | el `<`3 preguntas oculta la sección y deja CTA final pegado a precios (blanco→ciruela: admitido por §4) | FAQ fuera (<3 preguntas, ya previsto); el CTA final no se recorta nunca: es el cierre de conversión |

## 3. Orden de validación por fase (gate — las 7 aplican en cada fase, en este orden)

1. `npm run build` → exit 0.
2. `npm run check:placeholders` → exit 0 (caza "Agencia", precios inventados, `TODO` sueltos).
3. **Contraste de los pares nuevos** de la fase: fórmula WCAG sobre `DESIGN-CONTRACT`; suelo 4.5 texto / 3.0 UI/grande; el ratio queda escrito en la fase (como 14.53/5.08/5.65) — par sin número registrado = fase no aceptada.
4. **Responsive 375 / 768 / 1440**: sin scroll horizontal a 375; cotas GRID-SPEC ±2 px; orden de colapso de UX-LANDING §7.
5. **Teclado completo**: tabulación de la sección entera, foco visible, sin trampas (offcanvas/accordion), targets ≥44.
6. **Consola sin errores** (dev tools + build en modo producción).
7. **Playwright 1 recorrido crítico**: `/` → scroll a F2 → click `CREAR MI ENCUESTA` → destino renderiza; + checks 1–3 de `EFECTOS-Y-MOTION.md` §5 en F0, F2 y F8.

Si algo falla, la fase no avanza ni se "termina bonito" la siguiente encima (regla BUILD-ORDER: no romper el orden).

## 4. Qué NO se toca en esta etapa

| Fuera de scope | Motivo |
|---|---|
| Panel `(panel)` (sidebar, KPIs, alertas) | DASHBOARD-UX es otra etapa; F6 solo muestra una **captura** estática |
| Encuesta `/e/[code]` y su hoja mínima `.zone-survey` | intocable; lo único que se permite es que el mock decorativo del hero la imite (`aria-hidden`) |
| Backend, API, base de datos, piloto | cero cambios; no hay endpoint nuevo de marketing |
| Textos legales (`/terms`, `/privacy`) | las rutas se re-usan con estructura nueva; la reescritura legal corresponde al operador/asesor, no a esta etapa |
| `package.json`, `src/` fuera de `(marketing)` y sus SCSS, `next.config` | mandato del brief y del acta; ninguna dependencia nueva — la política de efectos (0 JS) lo refuerza |
| Wireframes, mockups y este plan durante la construcción | son el contrato; se corrigen por acta aparte, no "sobre la marcha" |

**Nota (2026-10-28):** los warnings de deprecación de Sass provienen de Bootstrap 5.3.7 y se silencian en `sassOptions` (`next.config.mjs`); al migrar a Bootstrap 5.4+ revisar si siguen siendo necesarios.

## 5. Definición de terminado del landing (verificable, corta)

1. Las 10 secciones de la retícula `UX-LANDING` §2 renderizadas en orden, con cotas GRID-SPEC ±2 px a 1440/768/375.
2. `grep 0e6e5c`=0 · `grep mdi-`=0 · `grep -E "Agencia|servicios|team"`=0 en rutas de marketing · un solo Bootstrap en el bundle.
3. Todo color/tipografía/espaciado/borde/sombra/gradiente sale de `_tokens.scss`: 0 hex sueltos en JSX/SCSS de marketing (check 1 EFECTOS).
4. Lighthouse a11y ≥95 · axe 0 critical/serious · CLS ≤0.02 (checks 2–3 EFECTOS incluidos, reduced-motion emulado).
5. Estados de `DESIGN-CONTRACT` §5 completos en nav, CTAs, acordeón y enlaces (default/hover/focus-visible/active; disabled donde exista).
6. Teclado: recorrido completo sin trampas, foco visible en todo momento, ≥44 px.
7. `npm run build` exit 0 + `npm run check:placeholders` exit 0 + consola limpia en el recorrido crítico Playwright.
8. Logo de producción en SVG vectorial (P1 cerrado): `grep -cE "<image|foreignObject|base64"` = 0 en los 4 archivos y el wordmark rinde nítido a 36 px.
9. F6 con captura real del panel o skeleton-demo etiquetado — nunca un vacío sin estado.
