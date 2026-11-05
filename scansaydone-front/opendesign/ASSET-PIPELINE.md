# Scan-Say-Done — Pipeline de assets de marca

**Decisión vigente (27-oct-2026, Plan B simplificado v2 — reemplaza "4 variantes SVG con wordmark outlined"): el lockup NO se vectoriza como pieza única. Se compone en HTML: `logo-symbol.svg` (isotipo, `currentColor`) + wordmark como texto vivo** en Bebas Neue/Montserrat, que el sitio ya carga. Razón: un SVG servido como `<img>` no carga fuentes — el lockup de una sola pieza con `<text>` caería a fuente del sistema en OG/mail; outlined costaba 4–5 h extra. Texto vivo da además nombre legible por lectores de pantalla (accesibilidad real, no solo `alt`) y texto indexable (SEO). Coste real del Plan B: **≈1,5 h** (presupuesto original 4–7 h, tope ≤6 h).

La **bajada** `"ESCANEA. OPINA. LISTO."` y el descriptor van también como texto vivo (Montserrat, tracking amplio). **Única entrega pendiente del diseñador humano:** la versión oficial vectorial del lockup (AI/FIG), si algún día aparece — al aparecer, pedir re-export y contrastarla contra `logo-symbol.svg` (retícula 128, tolerancia ±0,5 u); hasta entonces la composición HTML es el estándar y los PNG de `brand-src/` son la fuente de verdad de las piezas estáticas.

Estado medido: PNGs archivados en `opendesign/brand-src/` **sin commit al repo** (paso 0 §2): `logoScanCoral.png` 2172×724 = 3:1 (contenido medido 1899×446; sobre la altura del isotipo: wordmark ≈0,57× · gap ≈0,19× · bajada ≈0,13×), `faviconScan.png` 1254×1254 (contenido del isotipo 779×716 px → 1,088:1; márgenes del lienzo L237/R238/T254/B284), `referencias.png` 1536×1024. Navbar (`components/navbar/navlight.jsx:37`) usa 93×22 del template (4,2:1) → deforma. Coral canónico `#FF5F44`, veto del operador hasta 29-oct (`DESIGN-CONTRACT.md` §1).

## 1. Matriz de variantes — se obtienen en HTML, sin archivos SVG adicionales

| Variante | Para qué | Cómo se compone en HTML (2 órdenes del mismo lockup) | Estado |
|---|---|---|---|
| Horizontal | navbar, footer crema, tarjetas | **Orden 1:** fila `inline-flex` `align-items:center` — isotipo (`currentColor` a ciruela/tinta) + `SCAN-<span>SAY</span>-DONE` (Bebas; SAY coral) + bajada Montserrat debajo | Piezas listas · ver `lockup-preview.html` |
| Vertical | sticker, splash, señalética | **Orden 2:** `flex-direction:column`, mismo par de piezas, isotipo centrado sobre wordmark; bajada opcional | Definido (regla de la lámina "VARIACIONES") |
| Isotipo solo | favicon, avatar, spinner, email | `logo-symbol.svg` solo; **a 16 px, versión sin los 3 puntos** (inline en `lockup-preview.html`, no es archivo aparte) | Listo |
| Una tinta | impresión 1 color, vinilo, sello, bordado | El mismo SVG con un solo `color` (coral o tinta); sobre ciruela → crema entero. Regla lámina: tinta única sobre fondo claro, nunca invertido | Listo |
| OG image 1200×630 | previews WhatsApp/IG/TikTok | Aquí el texto vivo no existe: se hornea en PNG desde `logoScanCoral.png` (export, no HTML) | **Falta** P0 |
| PNGs fuente en git | pipeline reproducible | Commit a `assets/brand/src/` | **Falta** P0 (bloquea §2) |

**Clear space:** 0,5 × altura del isotipo por los 4 lados (acta §5), todas las variantes. **Anatomía** (lámina → `referencias/ANALISIS-REFERENCIAS.md` §1): isotipo → wordmark con "SAY" coral → bajada → descriptor anclado "Mejores experiencias para cada negocio." (copy fijo, no se reescribe). El isotipo solo, nunca con texto < 24 px; wordmark nunca < 24 px; isotipo nunca < 16 px.

## 2. Exportación → `public/images/brand/` y `src/app/`

**Paso 0:** los 3 PNG ya viven en `opendesign/brand-src/` (medidos 27-oct: 333 KB / 228 KB / 1,55 MB); falta el commit a `assets/brand/src/` — sin fuente en git ningún re-export es verificable.

| Archivo destino | Formato | Medida | Peso objetivo (estimación, no medida) |
|---|---|---|---|
| `logo-symbol.svg` (copia) + componente inline | SVG | viewBox `0 0 128 128`, contenido 118×108,5 centrado, margen uniforme | **Creado 27-oct: ≤4 KB ✔** |
| `logo-horizontal-dark@2x.png` / `-light@2x.png` | PNG-24 α | 1086×362 (3:1) | ≤45 KB |
| `logo-symbol.png` | PNG-24 α | 512×512 (re-export de `faviconScan.png`) | ≤15 KB |
| `og-cover.png` | PNG o JPG q82 | 1200×630 | ≤150 KB |

**Archivos derogados (v2):** `logo-horizontal-dark/light.svg`, `logo-vertical-dark/light.svg`, `logo-mono.svg` — un solo `logo-symbol.svg` con `currentColor` cubre tintas y fondos; el wordmark no se vectoriza.

**Por qué el lockup vive en HTML y el isotipo en SVG:** (1) `currentColor` hereda el color del contenedor → una fuente para claro/oscuro/mono; (2) nitidez en DPR 1–3 (navbar 36 px → 108 reales) donde el PNG 1x pixela; (3) peso: SVG del isotipo **1,2 KB medidos (1207 B)** frente a 333 KB del PNG; (4) texto real = SR/SEO/zoom sin re-exportar nada. Si un día se sirve el isotipo como `<img>`/`icon.svg` estático, `currentColor` cae al color UA (negro): fijar entonces `stroke="#FF5F44"` en la copia exportada. **Uso inline:** dentro del lockup el SVG va `aria-hidden` (el texto vivo ya dice el nombre); suelto (avatar, OG) → `role="img"` + `<title>`. Next/Image solo para PNG: `<Image width={108} height={36}>` (3:1 real; reemplazar el 93×22 del template en `navlight.jsx`). **Coherencia B2:** la cifra ≈741 KB del retiro de `@mdi/font` se cita únicamente en `DESIGN-CONTRACT.md` §6.

## 3. Favicons / app icons — Next 15 App Router

| Archivo | Especificación |
|---|---|
| `src/app/icon.png` | 512×512, isotipo coral `#FF5F44` + fondo transparente (re-export de `faviconScan.png`; el PNG del template no es token). Sustituye al del template. |
| `src/app/icon.svg` | opcional: copia de `logo-symbol.svg` con `stroke="#FF5F44"` fijado (standalone, `currentColor` caería a negro) |
| `src/app/apple-icon.png` | 180×180 **OPACO** (transparencia → negro en iOS): fondo ciruela `#2E1E3F`, isotipo coral, margen de seguridad ≥12 % por lado |
| `src/app/favicon.ico` | frames 16×16 y 32×32; en 16 px, isotipo **simplificado sin los 3 puntos**; eliminar el `.ico` del template |

`metadata.icons` solo si el archivo NO vive en `app/` (no declarar ambas cosas: duplica `<link rel="icon">`). OG: `metadata.openGraph.images = [{ url: '/images/brand/og-cover.png', width: 1200, height: 630, alt: 'Scan-Say-Done — escanea, opina, listo' }]` (alimenta también `twitter.image`).

## 4. QR impreso (pie de mesa, mostrador, sticker)

| Parámetro | Especificación | Por qué |
|---|---|---|
| Contenido | URL real `https://scan.<dominio>/e/<nanoid-8_10>` = 8 + host + 3 + código; **el UUID interno nunca va en el QR**; placeholder de dominio mientras no se decida (presupuesto host ≤27 car) | Con host de ejemplo: 36–38 B; peor caso 48 B → V3-M hasta 42 B, V4-M hasta 62 B (ISO 18004, modo byte) |
| Corrección | **M (≈15 %)** mínimo; **H (≈30 %)** si algo tapa el centro (H sube la versión: 36–38 B → V5-H) | M tolera desgaste; H es el precio de cubrir el símbolo — revalidar tamaño en cada caso |
| Quiet zone | ≥4 módulos libres (recomendado 6); nada tocando el área de descanso | ISO/IEC 18004 |
| Tamaño mínimo | Estimación a 0,6 mm/módulo: V3 ≥18 mm · V4 ≥20 mm · V5 ≥23 mm · V6 ≥25 mm (+8 mm con quiet zone); pie de mesa **≥25×25 mm**, mural ≥100 mm | Nada medido hasta prueba de imprenta (3 dispositivos, 20 cm, luz de vitrina y sombra) |
| Contraste | Ciruela `#2E1E3F` sobre fondo claro (reflectancia ≥70 %); ≥300 ppp; **nunca** redibujar el QR como mapa de bits | exigencia ISO; la tinta ciruela además es marca |

**Prohibido en el QR:** logo/texto sobre el símbolo (el isotipo va JUNTO, nunca dentro); degradados/tramas; inversión de colores; módulos redondeados en versión ≥3 o <50 mm; coral como módulo (L≈0,30). Recalcular versión/ECC/tamaño si cambian dominio o código: el presupuesto no es reutilizable.

**Color de módulos (refuerzo, 28-oct):** los módulos van **siempre en ciruela `#2E1E3F`** (14,53:1 sobre crema; 15,29:1 sobre blanco, fórmula WCAG) **o negro** (21:1 sobre blanco), sobre crema/blanco con reflectancia ≥70 %. **Prohibido el coral `#FF5F44` como color de módulos: 2,86:1 sobre crema no escanea** — el mockup `13-app-tabletent` muestra exactamente ese caso de fallo y no es referencia imprimible.

**Proporción (28-oct):** el QR ocupa **50–65 % del ancho** de la pieza que lo contiene, con quiet zone ≥4 módulos respetada dentro del margen de la pieza. Por encima del 65 % el QR se come la jerarquía del cartel; por debajo del 50 % el módulo cae bajo el límite de escaneo a distancia. Direcciones medidas: mockup 01 → 60–65 % de la tarjeta; mockup 13 → 50–60 % del cartel. Detalle por soporte: `ANALISIS-QR.md` §2.

## 5. Checklist de accesibilidad de assets

- [ ] Logo-PNG que enlace a home: `alt = "Scan-Say-Done — Inicio"`; nunca "logo" ni "imagen de marca".
- [ ] Lockup HTML: wordmark es texto real → el isotipo va `aria-hidden` y NO se duplica en SR; `alt`/`aria-label` solo cuando el isotipo vaya solo como enlace.
- [ ] SVG inline suelto: `role="img"` + `<title>` traducible; nunca `<img>` de SVG sin título si es contenido.
- [ ] Sin texto en imágenes salvo wordmark del PNG de marca y la OG; el copy de la OG va también en `og:title`/`og:description`.
- [ ] Contraste: tinta `#000014`/crema sobre ciruela 14,53 ✔ · coral sobre crema 2,86 → solo decorativo con alto ≥24 px · tinta sobre ciruela ≈1,0 → NUNCA logo oscuro sobre fondo oscuro.
- [ ] PNG con transparencia real (sin caja blanca): verificar con tablero de ajedrez antes de commit.
- [ ] Favicon 16 px: sin texto, sin los 3 puntos; probar en pestaña Chrome real y home de iOS.
- [ ] Tras la derogación del outlined, nada que dependa de `logo-horizontal-*.svg` puede volver a schema: el contrato de composición es `lockup-preview.html`.
