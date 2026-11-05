# UX-LANDING — Scan-Say-Done · sitio de marketing

> Solo especificación, cero código de producción · 2026-10-27 · scope: landing de marketing (NO encuesta/panel).
> En tokens/contrastes manda `DESIGN-CONTRACT.md`; este documento manda en grid, retícula, espaciado, color aplicado y wireframes (ver `INDEX.md`).
> Fuentes: `context7:/twbs/bootstrap` (grid + containers, Bootstrap 5.3.7 real del repo) · `mdn: css.properties.gap` (Chrome 57/FF 52/Safari 10.1) · `mdn: css.properties.aspect-ratio` (Chrome 88/FF 89/Safari 15) · `mdn: css.at-rules.container` (Chrome 105/FF 110/Safari 16) · `mdn: css.selectors.focus-visible` (Chrome 86/FF 85/Safari 15.4) · RAG: `chk:69178275ba00e78988f9a7cfad66` (CSS Grid 2D), `chk:0f8c2c7e6c9f69be43ad8f7aa610` (jerarquía visual ≠ jerarquía de documento), `chk:2fcb0bbe06ba3b4c13bb31229ccd` (def. jerarquía visual), `c:c642bee6e4477129178a896762d45990` (baja fidelidad antes de polir) · skills: wireframe, ux-usability-mastery, design-system-mastery, frontend-design. Queries RAG "vertical rhythm" y "responsive breakpoint" no devolvieron chunks útiles → lo de ahí se marca `criterio propio`. · 27-oct adenda aplicaciones: `referencias/ANALISIS-REFERENCIAS.md` · `context7:/twbs/bootstrap` (revalidado esta sesión) · `mdn: css.properties.object-fit` (Chrome 32/FF 36/Safari 10) · `mdn: css.properties.letter-spacing` (universal) · RAG `chk:b0283e475d10c07e592926b84d96` (identidad en todas las superficies) · `chk:04ae3ca4a7105803f1829da42de3` (comps como defensa de marca).

## 1. Grid: Bootstrap 5.3.7 como columna vertebral

12 columnas; `$grid-columns:12 · $grid-gutter-width:1.5rem · $grid-row-columns:6` (context7). Gutters por CSS: `.row` setea `--bs-gutter-x:1.5rem` (24px = 12px de padding por lado por columna, margen negativo del row). Contenedores fijos por breakpoint (context7). La estructura macro de cada sección es Bootstrap grid; la banda de color a lo ancho usa `container-fluid` con su `.container` dentro (nunca contenido suelto sobre el fluid):

| bp | min | `.container` | columnas | gutter-x | uso en la landing |
|---|---|---|---|---|---|
| xs | 0 | 100% | apilan → `col-12` | 24px | 1 columna, CTA a lo ancho |
| sm | 576 | 540px | `col-sm-*` | 24 | empiezan filas de 2 · banda completa 100px desde aquí |
| md | 768 | 720px | `col-md-*` | 24 | pasos 3-al-lado · hero partido 7+5 |
| lg | 992 | 960px | `col-lg-*` | 24 | canales 2×2 (`col-lg-6`) · precios ×3 · nav horizontal (bajo lg: burger) |
| xl | 1200 | 1140px | — | 24 | banda default (hero, pasos, precios, FAQ) |
| xxl | 1400 | 1320px | — | 24 | solo banda de captura (`container-xxl`) |

CSS Grid propio (fluido, sin clases de breakpoint) SOLO en 3 patrones:
- **Strip de confianza**: `repeat(auto-fit, minmax(220px,1fr))` con `gap: var(--sp-4)` (24px) — reflowa sin media-queries (`mdn: gap`, soporte universal).
- **Mini-galería dentro de tarjeta de canal**: mismo auto-fit, `gap: var(--sp-2)` (8px).
- **Marco de captura del panel**: `aspect-ratio: 16/10` (frame estable → CLS) + rejilla propia para los callouts (`mdn: aspect-ratio`).

Regla P0 — no mezclar los dos sistemas en la misma sección: las columnas BS son % con 12px de padding interno y margen negativo del row; un CSS Grid propio usa tracks explícitos con `gap` y cero padding. Mezcladas, la misma columna no cuadra 1:1 (drift ≈12px) y se duplican breakpoints. Si la sección necesita auto-fit, su fila contenedora va a lo ancho y TODO lo interno es CSS Grid. `@container` (`mdn: container`) queda P2: solo si el marco de captura necesita recomponerse dentro de su columna; nunca compite con el flujo BS.

## 2. Retícula de la landing (orden de scroll)

| # | sección | columnas BS | contenido | CTA | estado vacío / variante |
|---|---|---|---|---|---|
| 1 | Hero (banda ciruela) | `container-xl` · row · `col-md-7`+`col-md-5` | H1 Bebas ≤2 líneas (F8.5: `CLIENTES?` en `--brand-coral` sobre ciruela — contrato §1) · lead 18px · mock de teléfono con preview encuesta decorativa · **≥1200px la tarjeta cruza el borde inferior de la banda ~45 px (F8.5)** · **sin QR: decisión** — un QR falso rompe la promesa; el QR real entra en F5 con código vivo (`ANALISIS-QR.md §3`, opción A) | `CREAR MI ENCUESTA` (coral) + `VER EJEMPLO` (ghost crema) | sin foto de producto → solo mock de encuesta (nunca vacío) |
| 2 | Prueba de confianza | `container-lg` + CSS Grid strip | 4 claims implementados: `3 PREGUNTAS` · `SIN INSTALAR NADA` · `SIN CUENTA PARA TUS CLIENTES` · `EL QR NO SE REIMPRE` (copy real: `COPY-LANDING §2`) | ninguno (rol de apoyo) | claims de producto, no conteos: nada inventado (gates PLAN §6); el claim de conteo quedó descartado |
| 3 | Cómo funciona (blanco) | `container-xl` · `col-md-4`×3 + conector | ESCANEA / OPINA / LISTO · número Bebas 40 en badge coral | ghost `VER EJEMPLO DE ENCUESTA` | <768: conector pasa a `border-left` vertical |
| 4 | Canales (crema) | `container-xl` · `col-12 col-lg-6 col-xl-3` ×4 | **4 tarjetas** (acta §3, aprobada): `MOSTRADOR` (QR) · `INSTAGRAM` (link en bio) · `WHATSAPP` · `TIKTOK LIVE` — IG y WA son cosas distintas en la cabeza del dueño, no se agrupan · icono `react-icons` en superficie coral | ninguno por tarjeta (`criterio propio`: son informativos, no 4 CTAs rivales) | canal aún no soportado → misma tarjeta con icono en variante deshabilitada |
| 5 | Aplicaciones "Así se ve en tu local" (blanco) | `container-xl` · `col-lg-4`×3 | rótulo MAYÚS + foto realista 4/3 `object-fit:cover` + caption 2 líneas (nombre 600 + uso 14 `--text-2`) · CARTEL DE MESA · PANTALLA DE ENCUESTA · VINILO | ninguno por tarjeta (`criterio propio`, como canales: la foto vende) | sin renders → marco con skeleton `--surface-2` + badge "demo" |
| 6 | Panel (captura, crema) | `container-xxl` · `col-lg-7`+`col-lg-5` | captura 16/10 + 2 callouts (❶ Avisos primero · ❷ Todo en el celular) + 3 bullets (copy real: `COPY-LANDING §6`) | ghost `VER MI PANEL (demo)` | sin captura real → marco de referencia + badge "demo" |
| 7 | Precios (blanco) | `container-xl` · `col-lg-4`×3 | 3 planes del borrador (`COPY-LANDING §7`: BÁSICO · PROFESIONAL★ · NEGOCIO) · precio Bebas 48 · lista Montserrat 16 · recomendado con borde 2px coral + badge | `EMPEZAR` primario (recomendado) / ghost (otros) | **existe en código pero solo se renderiza con `hasPricing()`** = flag `showPricing` **y** 3 planes con precio no vacío (`src/app/data/site.js:39`, `ec896c1`); flag `false` → no se renderiza ni se enlaza (nav/footer) |
| 8 | FAQ (crema) | `container-lg` · `col-lg-8 offset-lg-2` | 5–7 preguntas en acordeón Bootstrap (chevron SVG inline — deuda F2) | pie: `¿Otra duda? → /contactus` (`--link` 5.65 ✓) | <3 preguntas → se oculta la sección entera |
| 9 | CTA final (banda ciruela) | `container-lg` centrado | H2 64 crema + 1 línea de lead | `CREAR MI PRIMERA ENCUESTA` (coral) + micro "sin tarjeta" | si el usuario ya vio precios: H2 corto, mismo CTA |
| 10 | Footer (banda **crema**, acta §4) | `container-xl` · `col-md-3`×4 | logo OSCURO 108×36 · producto/soporte/legal/contacto (`--link` sobre crema 5.65 ✓) · barra legal 14px `--text-2` | ninguno | reusa rutas existentes `/terms` `/privacy` |

> ✅ H-1 **resuelto** (acta §4, aprobada 27-oct): footer en banda **crema `#FFF8F2`**, no ciruela. Motivos: (1) el CTA final ya es ciruela → dos bandas oscuras adyacentes violarían la regla de ritmo de §4 y fundirían CTA+footer en un bloque de ~400 px; (2) sobre ciruela no queda ningún token de enlace legal (coral-oscuro `#B23A2A` = **2.57** ✗; el coral daría 5.08 sobre ciruela pero está vetado como texto y además rinde 2.86 ✗ sobre crema; mostaza 8.45 sobre ciruela pero prohibida como texto), mientras sobre crema `--link` rinde **5.65 ✓**. `DESIGN-CONTRACT §4` y `ASSET-PIPELINE §1` alineados en la misma pasada.

> **Eyebrows F8.5 (registrado 2026-10-28):** las secciones 3·4·5·6·7·8·9 llevan overline `.section-kicker` sobre el H2 (clase compartida nacida de unificar `.apps__kicker`/`.pricing__kicker`: Montserrat 600 · 12px, 13px ≥992 · .14em MAYÚS · `--text-2`, variante `--on-dark` = crema 75 %/ciruela = el `--text-2` de zona oscura del contrato §2). Medidas = contrato §3 (overline) — **las cadenas viven en `COPY-LANDING` §3–§9 y están en el gate de aprobación §13 (ítems 7–11)**; `APLICACIONES` y `Sin permanencia` son textos ya registrados, solo migraron de clase. El hero conserva su `.hero-kicker` mostaza (no se unifica).

## 3. Wireframes (ASCII · D=1440, M=375)

### 3.1 Hero
```text
D┌ container-xl 1140 · banda ciruela · py 100 ────────────────────────────┐
│ nav: logo-oscuro 3:1 (108×36) ··········· [Precios][FAQ] [CREAR ▸ coral]│
│ ┌ col-md-7 ──────────────────┐ ┌ col-md-5 ────────────────┐             │
│ │ kicker 13 MAY .14em        │ │ tarjeta de teléfono 1–5  │             │
│ │ H1 Bebas 88 · lh .92 · ≤2L │ │  sin QR (ANALISIS-QR §3) │             │
│ │ lead 18 crema 75%          │ │  preview escala 1–5      │             │
│ │ [CREAR h≥48] [ghost crema] │ │  aria-hidden (decorativo)│             │
│ └────────────────────────────┘ └──────────────────────────┘             │
M│ burger+logo ▸ kicker ▸ H1 60 ▸ lead 17 ▸ CTA 100% h48 ▸ ghost ▸ card 72%│
└ el dueño entiende QUÉ hace antes de ver el mock: copy primero ─────────┘
```

**F8.5 — lo que queda en el hero (estado vigente desde `32b4a86`, 28-oct-2026):** la banda recibe `--glow-hero` estático arriba-izquierda (EFECTOS §2.1) y la línea 2 del H1 lleva `CLIENTES?` en `--brand-coral` (contrato §1/§6). La tarjeta del mock (`.hero-phone-wrap`, col 461) **vive íntegra dentro de la banda**: el solape de 45 px que se probó en F8.5 **se descartó por evidencia visual** — con `translateY(112px)` la tarjeta invadía la franja de confianza y su contenido quedaba descolgado respecto del texto (medido: `overlap +48` con la tarjeta 213 px por debajo del bloque de texto). Estado actual: `overlap = 0` y la tarjeta centrada con el texto (delta 0.01 px a 1440 y 1366). **No re-implementar el solape sin una captura que lo justifique.** La retícula de columnas no se toca (655+24+461=1140 sigue cerrando); el plano `01-hero.svg` no está actualizado — deuda anotada en `wireframes/INDEX.md`.

**El hero NO lleva QR — decisión cerrada (`ANALISIS-QR.md §3`, opción A):** un QR falso o sin destino rompe la promesa central (escanea → opina → listo) en la zona de mayor exposición. El QR real entra en **F5** ("Así se ve en tu local") cuando exista un código vivo, con las medidas de `ANALISIS-QR.md §2`. El hero cerrado en F2 no se reabre.

**Componente escala 1–5 (hero)** — reglas cerradas en F2 (`9ae71b9`→`05610ea`, acta `VERIFICACION-F2.md`):

- 5 botones de **igual ancho y alto** (`flex:1`, `min-width:52px`, gap 6 px); etiqueta 11 px, `line-height:1.2`, altura reservada para 2 líneas (`min-height:2.4em`) → la fila no baila entre estados.
- **Prohibido `<br/>` hardcodeado** en las etiquetas y **prohibido cortar palabras**: `overflow-wrap:normal` + `word-break:normal` (con `break-word` se cortaba "Excelente").
- Etiquetas: **Muy mala · Mala · Regular · Buena · Muy buena** — la 5 lleva "Muy buena" (espacio para envolver en 2 líneas), no "Excelente".
- Seleccionado: **fondo coral + texto ciruela + borde 2 px ciruela** → 5.08 ✓ (blanco/coral 2.98 ✗ vetado por contrato §1).
- El bloque es **decorativo**: `aria-hidden="true"` y **sin controles focalizables** (`<span>`, nunca `<button>`/`<input>`) — un subtree oculto no puede recibir foco.

**Navbar (F2, cerrado en `fb7d600`):** `active` **solo por coincidencia exacta de ruta**; los ítems de ancla (`#como-funciona`, `#canales`, `#panel`) nunca se marcan activos (regla y motivo: `VERIFICACION-F2.md` §4, commit `23d7a04`). Navbar fijo con superficie crema permanente, texto ciruela y borde inferior de 1 px; sin estados ni JS. Motivo: sobre bandas claras el texto crema se perdía, y el estado por scroll resultó frágil. El hero queda separado por `main { padding-top: 76px }`.

### 3.2 Prueba de confianza
```text
D┌ container-lg 960 · crema · py 60 (banda ligera) ──────────────────────┐
│ ┌ CSS Grid auto-fit minmax(220px,1fr) · gap sp-4 ────────────────────┐ │
│ │ [3 PREGUNTAS] [SIN INSTALAR NADA] [SIN CUENTA] [QR NO SE REIMPRE]  │ │
│ │  icono coral (gráfico ≥24px) + título 20/600 + body 14 text-2     │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ mostaza: solo viñetas decorativas (≤5% de la pantalla)                 │
M│ auto-fit → 1–2 columnas según ancho · gap sp-3 ───────────────────────┘
└ † claims = COPY §2 (datos de producto verificables hoy; PLAN §6: no inventar conteos)
```

### 3.3 Cómo funciona en 3 pasos
```text
D┌ container-xl · blanco · py 100 ───────────────────────────────────────┐
│ H2 Bebas 64 izq. ─────────────────────────── [ghost VER EJEMPLO]       │
│ ┌col-md-4┐─conector coral 2px─┌col-md-4┐─········─┌col-md-4┐          │
│ │❶ 40 Bebas│ ESCANEA          │❷│ OPINA           │❸│ LISTO          │
│ │ badge coral·texto ciruela    │  body 16          │  body 16          │
│ └─────────┘ título Montserrat 600 20 ──────────────────────────────────┘
M│ apila 3 · conector = border-left 2px coral · gap sp-5 ────────────────┘
```

### 3.4 Canales
```text
D┌ container-xl · crema · py 100 ────────────────────────────────────────┐
│ H2 64 + lead "donde viven tus clientes" (1 línea)                      │
│ xl → ┌col-xl-3┐┌col-xl-3┐┌col-xl-3┐┌col-xl-3┐  cierre 4×267+3×24=1140✓│
│ │MOSTRADOR│ │INSTAGRAM│ │WHATSAPP│ │TIKTOK   │ tít 20/600             │
│ │QR+icono │ │icono    │ │icono   │ │LIVE     │ bullets 14 text-2      │
│ │ coral   │ │ coral   │ │ coral  │ │ coral   │ · icono react-icons    │
│ mini-visual CSS Grid auto-fit gap sp-2 dentro de cada tarjeta         │
│ lg (992–1199): col-lg-6 → 2×2 de 468px. NO col-lg-3: 3col lg = 222px  │
│ ≈ 25 car/línea y los bullets se parten; 267px (xl) ≈ 30 car sí admite │
M│ col-12 · las 4 apiladas · gap sp-3 ───────────────────────────────────┘
```

### 3.4b Aplicaciones — "Así se ve en tu local" (patrón heredado de la lámina de marca)
```text
D┌ container-xl · blanco · py 100 ───────────────────────────────────────────┐
│ rótulo overline 13 MAY "ASI SE VE EN TU LOCAL" · H2 64 izq.                │
│ ┌col-lg-4┐   ┌col-lg-4┐   ┌col-lg-4┐                                       │
│ │foto 4/3│   │foto 4/3│   │foto 4/3│ object-fit:cover · CARTEL/ENCUESTA/  │
│ │nbre+uso│   │nbre+uso│   │nbre+uso│ VINILO · caption 2L (600 + 14 t2)    │
│ └────────┘   └────────┘   └────────┘ sin sombra · sin CTA · sin decoración │
M│ 1 col · foto 4/3 · caption debajo · apila con gap sp-3 ────────────────────┘
└ acep: 0 emoji (caras SVG 1–5, ANALISIS-REF §3) · ciruela-sobre-coral 5.08 ✓ (blanco 2.98 ✗) · 4/3 + lazy (CLS 0) · sin personas
```

### 3.5 Panel (captura)
```text
D┌ container-xxl 1320 · crema · py 100 ──────────────────────────────────┐
│ ┌ col-lg-7 ────────────────────────────┐ ┌ col-lg-5 ──────────────┐   │
│ │ captura aspect-ratio 16/10           │ │ H2 64                  │   │
│ │ borde 1px --border (sin sombra: el   │ │ 3 bullets ≤16 palabras │   │
│ │  wash del panel hace elevar)         │ │ [ghost VER DEMO]       │   │
│ │ callouts ❶❷ tl/br · coral 24px       │ └────────────────────────┘   │
│ │  en rejilla propia superpuesta       │                               │
│ └──────────────────────────────────────┘                               │
M│ captura 100% · callouts se ocultan (tooltip = solo desktop, criterio propio)│
└ sin captura real: marco de referencia + badge "demo" (ver §2 y F6)
```

**Medida real (F6, `622aac4`, `VERIFICACION-F6.md`):** contenedor 1320 → marco **880×550** (`aspect-ratio` 16/10). El plano pedía 872×545: +8 px por gutters, no desvío. Callouts ❶ (arriba-izq.) y ❷ (abajo-der.), solo desktop.

### 3.6 Precios (3 planes)
```text
D┌ container-xl · blanco · py 100 ───────────────────────────────────────┐
│ H2 64 · kicker "sin permanencia"                                       │
│ ┌col-lg-4┐   ┌col-lg-4 ★RECOMENDADO┐   ┌col-lg-4┐                     │
│ │plan A    │   │borde 2px coral     │   │plan C    │  precio Bebas 48  │
│ │lista 16  │   │lista 16 · [EMPEZAR]│   │lista 16  │  DOM: rec,A,C ·   │
│ │[ghost]   │   │badge coral arriba  │   │[ghost]   │  visual con .order-lg-* │
M│ apila en orden DOM → recomendado primero sin truco de reorder ────────┘
```

### 3.7 FAQ
```text
D┌ container-lg · crema · py 100 ────────────────────────────────────────┐
│ ┌ col-lg-8 offset-lg-2 (~640px de línea de lectura) ────────────────┐  │
│ │ H2 64 centrado                                                    │  │
│ │ ▸ ¿Necesito una app? · ▸ ¿Qué pasa con el QR si cambio menú? …    │  │
│ │ acordeón BS · alto plegado ≥48 · chevron SVG inline (deuda F2)    │  │
│ │ pie: ¿Otra duda? → /contactus (--link 5.65 sobre crema ✓)         │  │
M│ sin offset · pregunta ≥16px · reduced-motion: chevron sin rotate ──┘
```

### 3.8 CTA final
```text
D┌ banda ciruela · container-lg 960 centrado · py 100 ───────────────────┐
│ H2 Bebas 64 crema ···· lead crema 75% (1 línea)                        │
│ [CREAR MI PRIMERA ENCUESTA h56] · micro "sin tarjeta" 14               │
M│ H2 44 · CTA 100% h48 · py 60 ──────────────────────────────────────────┘
```

### 3.9 Footer
```text
D┌ banda CREMA #FFF8F2 (H-1 resuelto) · container-xl · pt 100 · pb 48 ───┐
│ logo-oscuro 108×36 + tagline │ col-md-3: producto · soporte · legal ·  │
│  (tinta >14 sobre crema ✓)   │ contacto · links --link 5.65 ✓          │
│                              │ texto ciruela 14.53 ✓ · meta 6.29 ✓     │
│ barra 14px text-2: © 2026 · /terms · /privacy                           │
M│ columnas apiladas sin acordeón · barra legal en 2 líneas · pb 40 ─────┘
```

## 4. Espaciado y ritmo vertical

- Escala base 4/8 (`criterio propio`, alineada al spacer Bootstrap): `--sp-1:4 · --sp-2:8 · --sp-3:16 · --sp-4:24 (=--bs-gutter-x) · --sp-5:32 · --sp-6:48 · --sp-7:64`.
- Bandas: **py 100px desktop / 60px móvil** — valores heredados del template (`_helper.scss:104` `.mt-100`, `_helper.scss:150` `.mt-60` en `max-width:768px`). Se conservan por continuidad de scroll; 100/60 no son múltiplos de 8 → excepción aceptada, migrar a tokens `--band-y-d / --band-y-m` en vez de criar más clases `!important`.
- Ritmo interno: H2→lead sp-3 · lead→cards sp-6 · card↔card sp-4 · interior de card sp-3 · CTA→siguiente banda sp-6.
- Dos fondos iguales nunca adyacentes: la secuencia queda crema → blanco → … → banda CTA ciruela → **footer crema**; anclajes ciruela: 2 (hero, CTA final) — contrato §4. El salto ciruela→crema del cierre es la frontera más fuerte disponible (14.53).

## 5. Escala tipográfica aplicada al landing

| elemento | familia | weight | desktop px | móvil px | LH | letter-spacing |
|---|---|---|---|---|---|---|
| H1 hero | Bebas Neue | 400 | 88 | 44 (tablet 64) | 0.92 | .01em |
| H2 sección | Bebas | 400 | 64 | 44 | 0.95 | .01em |
| números métricos (trust, pasos) | Bebas | 400 | 40 | 32 | 0.90 | — |
| precio de plan | Bebas | 400 | 48 | 34 | 1.00 | — (solo número ≤4 dígitos + sufijo) |
| título de tarjeta (canales, panel) | Montserrat | 600 | 20 | 18 | 1.30 | — |
| lead | Montserrat | 400 | 18 | 17 | 1.55 | — |
| body / listas | Montserrat | 400 | 16 | 16 | 1.60 | — |
| kicker / overline | Montserrat | 600 | 13 | 12 | 1.20 | .14em + MAYÚS |
| meta / barra legal | Montserrat | 400 | 14 | 14 | 1.45 | tabular-nums |
| botón | Montserrat | 600 | 15 | 16 | 1.00 | — · alto ≥44px |

Prohibido: Bebas en párrafos, botones, datos tabulares ni títulos de tarjeta de producto (contrato §3: condensada, 1 solo peso, sin `tabular-nums`). Nunca `text-transform` redundante sobre Bebas. Cifras de esta tabla = contrato §3 extendido al landing; tamaño fijo por breakpoint, sin `clamp()` (`criterio propio`: el contrato fija móviles exactos).

### 5.1 Reglas de presentación heredadas de la lámina de marca
- Rótulos de sección: MAYÚSCULAS + tracking + gris pizarra = token `overline/kicker` del contrato (Montserrat 600, 13/12px, .14em, `--text-2`; tabla §5). Los 10–12px/.05em de la lámina son de sheet impreso — en pantalla el piso es 12px (`criterio propio`; `mdn: letter-spacing` universal).
- Caption de 2 líneas bajo cada elemento (nombre 600 + uso `--text-2`): obligatorio en Aplicaciones; replicable en los callouts de la captura del panel.
- Separadores 1px: `var(--border)` del contrato — nunca los grises `#E5E7EB`/`#F0F0F0` medidos de la lámina (son escena/foto, no marca).
- Decoración 0: fotos en marco 1px sin sombra (sombra solo hover, contrato §5); sin especímenes "Aa" de fuente (la tipografía se muestra en uso — H2 Bebas); prohibido blanco-sobre-coral (2.98 ✗ — el botón "Enviar" de la lámina falla AA; rige ciruela 5.08 ✓).

## 6. Uso del color por sección

| sección | fondo | color de texto | acento | contraste del par principal |
|---|---|---|---|---|
| 1 Hero | ciruela #2E1E3F | crema #FFF8F2 · palabra display `CLIENTES?` coral (F8.5, contrato §1) | coral como superficie + coral en el H1 + mostaza ≤5% (kicker); fondo con `--glow-hero` estático (EFECTOS §2.1) | crema/ciruela **14.53** ✓ · CTA texto ciruela sobre coral **5.08** ✓ · coral H1 sobre fondo del glow **4.8** ✓ (captura) |
| 2 Trust | crema #FFF8F2 | ciruela | mostaza decorativa | ciruela/crema **14.53** ✓ · text-2 #65586E/crema **6.29** ✓ |
| 3 Pasos | blanco #FFFFFF | ciruela | badges coral | ciruela/blanco **15.29** ✓ · número ciruela/badge coral **5.08** ✓ |
| 4 Canales | crema | ciruela | iconos en superficie coral | **14.53** ✓ |
| 5 Aplicaciones | blanco #FFFFFF | ciruela | coral solo dentro de los renders (foto) | **15.29** ✓ (blanco/ciruela; banda blanca intermedia crema→blanco→crema respeta no-adyacentes) |
| 6 Panel | crema (captura blanca bordeada) | ciruela | callouts coral | **14.53** ✓ |
| 7 Precios | blanco | ciruela | borde+badge coral (recomendado) | **15.29** ✓ · enlace `--link` **≥5.65** ✓ (peor caso crema) |
| 8 FAQ | crema | ciruela | `--link` #B23A2A | **5.65** ✓ · hover #973124 **7.18** ✓ |
| 9 CTA final | ciruela | crema | coral superficie | **14.53** ✓ · CTA **5.08** ✓ |
| 10 Footer | crema #FFF8F2 | ciruela | `--link` #B23A2A | texto **14.53** ✓ · text-2 #65586E **6.29** ✓ · enlace **5.65** ✓ (hover #973124 7.18 ✓) |

Reglas P0 (números recalculados con la fórmula WCAG de luminancia relativa esta sesión; el contrato ya publica los mismos valores):
- **Coral nunca es texto sobre fondo claro**: 2.86 vs crema y 3.01 vs blanco < 4.5 ✗. Coral solo como relleno de superficie con texto ciruela encima (5.08 ✓) o gráfico decorativo ≥24px. Sobre ciruela, única excepción texto: la palabra display del H1 `CLIENTES?` ≥44px (F8.5; contrato §1) — **4.8 ✓ medida sobre el fondo del glow** en la captura `qa-f85-verif.png`.
- Mostaza ≤5% de la pantalla y nunca texto **sobre fondo claro**: 1.72 vs crema ✗ · blanco sobre mostaza 1.81 ✗. Sobre ciruela puede portar énfasis gráfico (8.45) **y texto solo en el kicker del hero** (`3 PREGUNTAS. UN QR. LISTO.`, en vigor desde F2; 6.1 ✓ incluso sobre el fondo del glow F8.5). El subrayado de "SAY" en el H1 es su uso firma.
- Coral solo en superficie de acción (CTA/badge/selección) y — desde F8.5 — en la palabra display del H1 sobre banda ciruela (contrato §1); en la misma pantalla como mucho 1 CTA coral primario visible.
- Wordmark tinta `#000014` nunca sobre ciruela (1.36 → invisible): en bandas oscuras va el logo CLARO (crema). Nota: `ASSET-PIPELINE` estimaba ≈1.0; cálculo exacto 1.36 — misma conclusión.

## 7. Estados y responsive

- **375px**: todo a `col-12`; nav → burger + offcanvas; bandas py 60; H1 60; CTAs apilados 100% ancho h≥48; gutter BS 24 se conserva (12px por lado, sin scroll horizontal); precios apilan en orden DOM (recomendado primero); captura 100% sin callouts.
- **768px (md)**: `.mt-60` deja de aplicar (media `max-width:768px` del template → al pasar de 768 vuelve 100); pasos en `col-md-4` lado a lado; hero se parte 7+5; canales aún apilados (en lg pasan a 2×2 con `col-lg-6`; 4 en fila recién en xl).
- **1440px (xl)**: `container-xl` 1140 → 150px de aire por lado; el copy no se estira más de ~70 caracteres; solo la banda de captura usa `container-xxl` (1320).
- Orden de colapso al achicar (1.º lo que más cede): 1) callouts de la captura se ocultan → 2) hero partido→apilado (visual baja) → 3) canales 4→2(lg)→1 y precios 3→1 (lg→md) → 4) pasos 3→1 (md) → 5) strip trust auto-fit → 6) footer columnas→apiladas → 7) nav→burger (<lg).
- Hero: la altura de banda nunca < 80vh vista en desktop; en móvil el H1+CTA deben caber sin scroll (above the fold funcional).

## 8. Accesibilidad (landing)

- Foco: `outline 3px var(--focus-ring)` + offset 2px (contrato §5); en bandas oscuras `--focus-ring` → `--brand-peach` (12.87 vs ciruela ✓). Basado en `:focus-visible` (`mdn:` Chrome 86/FF 85/Safari 15.4 — ok baseline; nunca `outline:none` sin sustituto).
- Targets ≥44×44 px también en el landing (misma regla F3 del contrato); acordeón FAQ ≥48px de alto por ítem.
- Tabulación hero: skip-link → nav (logo→Precios→FAQ→CREAR) → CTA primario → ghost; el mock del hero (tarjeta de teléfono, sin QR) es decorativo: `aria-hidden="true"`, fuera del orden de tab.
- Un solo H1 por página; cada sección un H2; tarjetas H3/H4 — la jerarquía visual no rompe la jerarquía de documento (`rag: chk:0f8c2c7e…` refactoring-ui).
- `prefers-reduced-motion: reduce` → reveals con stagger 50–100ms pasan a 0.01ms y el conector/chevron deja de animarse (contrato §5).
- Imágenes: logo junto a texto que ya dice el nombre → `alt=""` + `aria-hidden` (ASSET-PIPELINE §5); captura del panel con `alt` que describe el contenido, no "screenshot".

## 9. Qué se reusa del template y qué es nuevo

| elemento | estado | nota |
|---|---|---|
| `container`/`row`/`col`/gutters | **reusa** | Bootstrap 5.3.7 compilado desde `bootstrap/scss` (ya decidido en contrato §intro) |
| `.btn` `.badge` `.card` `.accordion` | **reusa** | tematizados vía `$theme-colors`; sin utilitarios nuevos con `!important` (PLAN §5) |
| estructura navbar (`navlight.jsx`) | **reusa** | cambiar logo 93×22 → 108×36; con el navbar crema permanente (`fb7d600`) va la variante OSCURA (ciruela), no la clara |
| estructura footer | **reusa** | recolorear a banda crema (H-1 resuelto, acta §4); quitar enlaces de agencia |
| `.mt-100`/`.mt-60` (`_helper.scss`) | **reusa** | son custom del template, NO utilidades Bootstrap → migrar a tokens de banda |
| rutas `/pricing` `/faqs` `/contactus` `/terms` `/privacy` | **reusa** | existen como páginas del template; re-temadas, copy nuevo |
| copy actual ("Agencia", vende desarrollo web) | **elimina** | PLAN §10 #7: el landing debe pasar a Scan-Say-Done — bloquea copy, no el código |
| hero de agencia, `services-one`, `team`, video-CTA | **elimina** | no aplican al producto |
| teal `#0e6e5c`, Kumbh Sans, `@mdi/font` | **elimina** | contrato §6: `grep 0e6e5c`=0 · `grep mdi-`=0 (deuda F2: 2 reglas `content:` → SVG) |
| hero ciruela, strip trust, canales, captura+callouts, CTA final | **construye nuevo** | no existe nada equivalente en el template |
