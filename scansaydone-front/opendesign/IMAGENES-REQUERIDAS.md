# IMAGENES-REQUERIDAS — slots, densidad, formato y presupuesto · landing Scan-Say-Done

> 2026-10-28 · designer-alibaba · define EXACTAMENTE qué imágenes necesita el landing, su tamaño por breakpoint/densidad, peso y origen. Base para generar o fotografiar. No introduce tokens nuevos.
> Fuentes: `UX-LANDING.md` §2/§3/§8 · `wireframes/GRID-SPEC.md` §1–§2 (containers 540/720/960/1140/1320; col 23/38/58/73/88) · `ASSET-PIPELINE.md` §2–§3 · `EFECTOS-Y-MOTION.md` §1/§3 · `mdn: html.elements.img.srcset` (Chrome 34/FF 38/Safari 8), `img.sizes` (Chrome 38/FF 38/Safari 9.1), `img.loading` (Chrome 77/FF 75/Safari 15.4), `img.fetchpriority` (Chrome 101/FF 132/Safari 17.2) · `context7:/websites/nextjs` (image: sizes→srcset completo; sin sizes→1x/2x; `width/height` = aspecto, no tamaño render) · `AUDITORIA-IMAGENES.md` regla 4 (cero personas). Lo no citado es `criterio propio`.

## 1. Tabla maestra de slots

| Slot | Sección | Rol | Aspecto | Render 375 / 768 / 1440 (px) | Anchos `srcset` (px físicos) | Formato | Peso obj. (AVIF) | Alt |
|---|---|---|---|---|---|---|---|---|
| `hero` | 1 Hero | **sin imagen raster** — LCP es el H1 de texto | — | — | — | CSS puro | 0 KB | n/a |
| `app-cartel` | 5 Aplicaciones | contenido (vende el producto físico) | 4/3 | 351 / 696 / 364 | 364 / 728 / 1092 | AVIF→WebP→JPG | ≤12 / 20 / 30 KB | «Cartel de mesa con código QR junto a una taza de café» |
| `app-pantalla` | 5 Aplicaciones | contenido | 4/3 | 351 / 696 / 364 | 364 / 728 / 1092 | AVIF→WebP→JPG | ≤12 / 20 / 30 KB | «Encuesta de tres preguntas en la pantalla de un celular» |
| `app-vinilo` | 5 Aplicaciones | contenido | 4/3 | 351 / 696 / 364 | 364 / 728 / 1092 | AVIF→WebP→JPG | ≤12 / 20 / 30 KB | «Vinilo con código QR en la puerta de cristal del local» |
| `panel-captura` | 6 Panel | contenido (prueba del producto) | 16/10 | 351 / 696 / **872×545** (xxl) | 872 / 1100 / 1744 | AVIF→WebP→PNG | ≤45 / 55 / 90 KB | «Panel con métricas, lista de opiniones y una alerta» |
| `og-cover` | metadatos | social (no se carga en la página) | 1200×630 | — | único 1200×630 | PNG o JPG q82 | ≤150 KB | «Scan-Say-Done — escanea, opina, listo» (ya en `metadata.openGraph`) |
| `logo-nav` / `logo-footer` | 1 / 10 | identidad | 3:1 (108×36) | escala | **SVG inline** — sin raster | SVG `logo-symbol.svg` (1,2 KB medidos) + wordmark texto vivo | ≈2 KB | `alt=""` + `aria-hidden` (el texto vivo ya dice el nombre) |
| `favicons` | global | UX de pestaña | 1:1 | 16 / 32 / 180 / 512 fijos | fijos, sin srcset | `.ico`+PNG | set ≤35 KB | n/a |
| *(opcional)* `textura-fondo` | — | **RECHAZADA** | — | — | — | — | — | Ver §1.1 |

**Hero sin imagen — verificación:** `UX-LANDING` fila 1 confirma banda ciruela sólida (CSS) + tarjeta blanca con QR (SVG generado) y preview 1–5 en HTML, `aria-hidden`. No hay foto de producto ni debe haberla: «sin foto de producto → solo mock de encuesta». Consecuencia LCP: el mayor contenido visual del above-fold es texto Bebas 88 → **LCP = nodo de texto**, sin imagen que lo dispute; `fetchpriority` (Chrome 101/FF 132/Safari 17.2, `mdn:`) queda **N/A en esta página** — solo se reactivaría si una futura variante añade raster al hero (entonces: `priority`/`fetchpriority=high` + `loading=eager`, y sería el único raster crítico).

**§1.1 Textura de fondo — por qué NO:** EFECTOS-Y-MOTION §1 prohíbe grain/blobs/manchas fuera de token (P0, detección por grep); los 3 gradientes §2.1 cubren la atmósfera con coste ~0. No se propone ninguna imagen decorativa de fondo: cualquier propuesta violaría el reveto.

**Aplicaciones — origen de las cotas:** tarjetas en `col-lg-4` dentro de `container-xl`: xl = 364 (§2 GRID-SPEC, «3×364+2×24=1140 ✓»; plano `08-aplicaciones.svg` confirma 364×273); lg = 304; <992 apilan a `col-12` → 768: 720−24 = 696; 375: 375−24 = 351. Render real −2 px por la desviación BS documentada en GRID-SPEC §1 — irrelevante para exportar (728 ≥ 696 cubre el 1x de md).

**Captura — origen:** `container-xxl` 1320, frame `aspect-ratio:16/10` → 872×545 a ≥1400 (única banda xxl); lg ≈550–676 según viewport (fluido bajo 1400); <992 apila (696/351).

## 2. Regla de densidad y `srcset`

**Cálculo:** ancho a exportar = ancho renderizado (CSS px) × DPR, redondeado a la siguiente entrada de la escala. Escala del documento: 1x / 2x / 3x con tope: **3x solo hasta 1100 px físicos** (a 375 el 3x real es 1053; 1092 lo cubre).

**Tope anti-derroche (P0, criterio propio):** nunca exportar por encima de `ancho máximo del contenedor × DPR objetivo`. Un slot que jamás se muestra a más de 696 CSS px (tarjeta apilada) no necesita un archivo de 1400 px: 728 ya sirve a ese escenario a DPR1. Por eso la tarjeta no escala con el viewport: sus anchors nacen del 364 de xl.

**Asignación por escenario (tarjeta 4/3):** 364 = lg/xl/xxl a DPR1 (304–364 px). 728 = 375@2x (702) y 768@1x (696) y xl@2x (728 exacto). 1092 = 375@3x (1053) y xl@3x (1092 exacto). Captura: 872 = xxl@1x / apilado@2x; 1100 = apilado@3x (351×3 = 1053 → sube a 1100 en vez de saltar a 1744); 1744 = xxl@2x; **sin 3x de 872**: 2616 px para una UI de texto plano que AVIF ya nitifica a 2x — el tope anti-derroche lo corta.

`sizes` (el navegador elige UNA sola de la tabla):
- Tarjetas: `(min-width:1200px) 364px, (min-width:992px) 304px, (min-width:768px) 696px, (min-width:576px) 516px, calc(100vw - 24px)`
- Captura: `(min-width:1400px) 872px, (min-width:1200px) 676px, (min-width:992px) 550px, (min-width:768px) 696px, calc(100vw - 24px)`
- OG/favicons/hero: sin `srcset` (fijos o inexistentes).

**Con `next/image` (Next 15, ASSET-PIPELINE §3):** no se exportan archivos por ancho a mano — `width`/`height` dan el aspecto (no limitan el render, `context7:`), y con `sizes` Next genera el `srcset` completo desde la ladder de `deviceSizes`/`imageSizes`; **sin `sizes`** solo emite 1x/2x (y en `fill` asume 100vw: descarga de más, `context7:`). Regla: todo raster responsive del landing lleva `sizes` con las cadenas de arriba; la ladder puede ajustarse en `next.config` a los anchors de §1. Lo que sí se exporta a mano son los **masters**: mínimo el mayor ancho de cada slot — tarjeta ≥1092×819, captura ≥1744×1090, OG 1200×630. `loading="lazy"` en todo lo bajo el fold (EFECTOS §3); el único raster crítico potencial (hero) no existe → sin excepciones eager.

## 3. Formatos y peso

Preferencia: **AVIF → WebP → JPG/PNG** (fallback por `<picture>` o `images.formats=['image/avif','image/webp']` en next.config, default del optimizer). PNG solo donde la transparencia manda: OG con α si el compositor lo pide, favicons, logo. JPG solo como fallback de foto; UI plana (captura) cierra con PNG.

| Slot | Máx. por archivo (AVIF) | Fallback WebP máx. | Nota |
|---|---|---|---|
| Tarjeta 4/3 (×3) | 12 / 20 / 30 KB | 15 / 25 / 38 KB | foto real = AVIF q≈55–65; el navegador baja 1 solo archivo |
| Captura | 45 (872) / 55 (1100) / 90 (1744) KB | 55 / 68 / 110 KB | texto plano de UI: AVIF comprime muy bien; medir, no estimar |
| OG | 150 KB | — | no se sirve en la página; la crawlerea WhatsApp/IG |
| Logo SVG | 1,2 KB (medido) | — | inline, sin `<img>` |
| Set favicons | ≤35 KB total | — | cacheado, fuera de la ruta crítica |

**Presupuesto total (con los slots obligatorios, suma de archivos REALMENTE descargados por escenario, no suma de todos los exportados):** ruta crítica de apertura (above-fold): **0 KB de raster** — hero es CSS+texto (LCP) y todo raster está bajo el fold con `loading=lazy` (`mdn: img.loading` Chrome 77/FF 75/Safari 15.4). Sesión completa: desktop DPR1 xl/xxl = 3×12 + 45 + 1,2 + ico ≈10 = **≈93 KB**; desktop DPR2 = 3×20 + 90 + 1,2 + 10 = **≈161 KB**; móvil DPR3 = 3×30 + 55 + 1,2 + favicon-dispositivo ≈25 = **≈171 KB** (iOS baja apple-icon, Android icon.png: nunca el set completo). Techo declarado de sesión: **180 KB**; si se rompe, re-comprimir (AVIF −5 q) o retirar el 1092 de tarjeta (el navegador degrada a 728). Con LCP de texto, el objetivo **LCP < 2,5 s en 4G** (≈1,6 Mbps / 150 ms RTT, perfil Lighthouse) se cumple sin competencia de imágenes: el payload crítico es HTML+CSS+fuentes y las imágenes llegan después del pliegue. Verificación: Lighthouse móvil + `performance.getEntriesByType('resource')` filtrado por `.avif|.webp|.jpg`.

## 4. Generable con IA vs foto real

**Regla P0 (criterio propio + ética del producto):** una foto generada no puede ir a producción mostrando el local o el producto con clientes reales sin declararse; el landing promete «así se VE en TU local» — sustituir eso por IA sin aviso es falso. Los estados vacíos ya cubren el hiato: skeleton `--surface-2` + badge «demo» (UX-LANDING filas 5–6).

| Slot | Veredicto | Dirección de arte / origen |
|---|---|---|
| `hero` | n/a | CSS + SVG generado por código (QR real del piloto) |
| `app-cartel` | **requiere foto real** | cartel impreso V3-M ciruela/sobre claro (ASSET-PIPELINE §4) sobre mesa de café, luz natural, 0 personas ni manos, marco 1px sin sombra |
| `app-pantalla` | **requiere foto real** (o screenshot real enmarcado) | teléfono mostrando la encuesta 1–5 con etiqueta verbal; el contenido debe ser la UI real del producto, no inventada (AUDITORIA reglas 2/3: cero estrellas, cero cifras) |
| `app-vinilo` | **requiere foto real** | vinilo en puerta de cristal de local, QR escaneable a la distancia de la foto, reflejos del vidrio permitidos, 0 personas |
| `panel-captura` | **requiere screenshot REAL de la app** — vetado generarlo | captura del panel del piloto (d01 como referencia de contenido: 4 métricas, barras coral, alerta causa+acción); nada de KPIs inventados |
| `og-cover` | generable/compuesto | horneado desde `brand-src/logoScanCoral.png` sobre ciruela (ASSET-PIPELINE §1) — artesanal de marca, no foto de producto: no engaña |
| `logo`/`favicons` | vectorial real | `logo-symbol.svg` (creado 27-oct) + re-export de `faviconScan.png`; nada de IA |
| placeholders IA | **solo** como dirección de arte interna en `mockups/`, jamás a `public/` | prompt con paleta exacta #FF5F44/#2E1E3F/#FFF8F2, cero personas, cero estrellas, cero texto de marca (reglas 1–7 de AUDITORIA-IMAGENES) |

## 5. Convención de nombres y carpetas

```
public/images/landing/aplicaciones/cartel-364.avif  (+ -728 -1092; .webp y .jpg espejo)
public/images/landing/aplicaciones/pantalla-364.avif … · vinilo-364.avif …
public/images/landing/panel/captura-872.avif · -1100 · -1744 (espejos .webp)
public/images/brand/og-cover.png · logo-symbol.svg · logo-symbol.png            # ASSET-PIPELINE §2
src/app/icon.png · icon.svg · apple-icon.png · favicon.ico                        # ASSET-PIPELINE §3
```

Patrón: `landing/<seccion>/<slot>-<ancho-px-fisico>.<ext>`; en minúsculas, guion, sin `_` ni espacios; el ancho del nombre es el físico exportado (364, no «1x»). Con `next/image` los archivos `<ancho>` no se suben (el optimizer los deriva del master) — entonces se versiona solo `*-master.*` (`cartel-master.jpg` ≥1092 px) y la convención `<ancho>` aplica a la carpeta de masters exportados si el sitio sirve estáticos.

**Manifiesto obligatorio:** `public/images/landing/MANIFEST.md` — tabla `archivo | slot | ancho | bytes reales | target §3 | origen (foto/compuesto/vector) | fecha` que se actualiza en cada commit de asset; el peso se mide (`Get-Item`), no se declara «a ojo». Regla: un archivo sin fila en el manifiesto no se enlaza; una celda >target bloquea el merge hasta comprimir o justificar. Espejo humano en `opendesign/` si cambia el presupuesto.

## 6. Alt y a11y

- Descriptivo y concreto, **sin «imagen de» / «foto de»** (redundante: el SR ya lo anuncia). Longitud ≤125 caracteres: lo que la foto prueba (objeto + lugar + QR visible), no lo que el caption ya dice.
- **No duplicar el caption:** la tarjeta de Aplicaciones lleva rótulo MAYÚS + nombre 600 + uso (`UX-LANDING` fila 5). El alt aporta la escena (contexto físico, dónde está el QR); el texto aporta el nombre y el uso. Si el alt cabe empezar por «Cartel…/Encuesta…/Vinilo…» sin repetir la línea de uso, está bien; si copia el caption entero → `alt=""` no aplica (no es decorativa): se reescribe el alt.
- **Decorativas → `alt=""`** (y `aria-hidden` si es SVG/HTML, no `<img>`): tarjeta QR+preview del hero (UX-LANDING §8), lockup junto al texto vivo del nombre (ASSET-PIPELINE §5), cualquier viñeta mostaza futura. El favicon y el OG no tienen alt de página (el OG lleva su `alt` en `metadata`, ya fijado).
- Captura del panel: alt describe contenido («Panel con métricas, lista de opiniones y una alerta») — nunca «screenshot/captura de pantalla de…», `UX-LANDING` §8.
- Logo-PNG suelto que enlace (si algún día existe): `alt="Scan-Say-Done — Inicio"` (checklist ASSET-PIPELINE §5).
- Prueba de aceptación: pasar el landing con SR (NVDA/VoiceOver): cada `<img>` de contenido anuncia su alt y la tarjeta se entiende sin él; 0 hits de «imagen de»; 0 imágenes con alt == texto del caption.
