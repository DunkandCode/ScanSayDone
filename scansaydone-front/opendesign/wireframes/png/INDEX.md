# Planos de grid — PNG renderizados

Los planos viven como **SVG** (fuente de verdad metrica, editable) y como **PNG** (para revisar rapido y compartir).

**Render vigente (29-oct-2026):** Chrome headless a escala 1:1, una captura por plano con `--window-size` igual al `viewBox` — resultado exacto, sin escalado.
`& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=W,H --screenshot=out.png "file:///.../<plano>.svg"`

> **Los 14 PNG se regeneraron el 29-oct** tras corregir `01-hero.svg` (sin QR) y anadir `09-page-hero.svg`. Antes habia 3 pendientes de re-rasterizado (`03-canales`, `07-footer`, `d03-respuestas`): **deuda cerrada**. El PNG de esta carpeta corresponde siempre al SVG de la misma fecha; si un SVG cambia, su PNG se regenera con el comando de arriba.
>
> El render anterior con `sharp` a densidad 144 queda como historico: el texto de cotas se veia mas grande de lo que mide el plano real.

| PNG | Origen | Peso | Que muestra |
|---|---|---|---|
| `00-grid-system.png` | `../00-grid-system.svg` | 204 KB | sistema completo: container 1320 (xxl), 12 columnas de 88 px, gutter 24, spans 4/8/3/6/7/5 con cotas y tabla de breakpoints |
| `01-hero.png` | `../01-hero.svg` | 114 KB | banda ciruela + row 7+5 → 655 / 461 px en container-xl 1140, col 73, logo 108x36, `--band-y-d` 100, aire 150 |
| `02-como-funciona.png` | `../02-como-funciona.svg` | 85 KB | 3 pasos: 3 columnas de 364 px con conectores |
| `03-canales.png` | `../03-canales.svg` | 111 KB · **re-rasterizar pendiente** | 4 tarjetas de 267 px · MOSTRADOR, INSTAGRAM, WHATSAPP, TIKTOK LIVE (R1 resuelto 27-oct) |
| `04-panel-preview.png` | `../04-panel-preview.svg` | 127 KB | captura del panel span-8 = 872 x 545 (16/10) |
| `05-precios.png` | `../05-precios.svg` | 118 KB | 3 planes de 364 px, destacado con borde coral |
| `06-faq-cta.png` | `../06-faq-cta.svg` | 96 KB | FAQ 7 col + CTA 5 col en container-lg 960 (550 / 386) |
| `07-footer.png` | `../07-footer.svg` | 96 KB · **re-rasterizar pendiente** | 4 columnas de 267 px sobre banda **crema #FFF8F2** (H-1→crema resuelto 27-oct · acta §4; enlaces `--link #B23A2A` 5.65) |
| `08-aplicaciones.png` | `../08-aplicaciones.svg` | pendiente | banda blanca · container-xl: 3 marcos foto 4/3 de 364x273 (col-lg-4 x3, 3x364+2x24=1140), rótulos coral MAYÚS .14em + caption 2 líneas |
| `d01-overview.png` | `../d01-overview.svg` | pendiente | panel 1440 · sidebar 264 · C 1128 · col 72 · 4 KPI 264x112 + alerta mostaza + barras 7x64 gap 31 |
| `d02-opiniones.png` | `../d02-opiniones.svg` | pendiente | panel 1440 · sidebar 264 · C 1128 · col 72 · 5 chips h44 + fila 96(valor)+668(opinion)+140(canal)+120(fecha) |
| `d03-respuestas.png` | `../d03-respuestas.svg` | 278 KB · renombrado · **re-rasterizar pendiente** | panel 1440 · sidebar 264 · C 1128 · col 72 · lista span-4 (360) con filtros Todas · Sin responder · En revision · Resueltas + 24 + detalle span-8 (744) = 1128 · literal del cliente + accion Responder |
| `d04-mobile.png` | `../d04-mobile.svg` | pendiente | movil 390x844 · contenido 358 (16+358+16) · col 15.17 · span-6 = 171 (171+16+171) · alerta 148 + boton 326x48 + grafico 180 |
| `12-dashboard.png` | `../12-dashboard.svg` | 239 KB | **dashboard v2 (30-oct)**: shell sidebar 264 + topbar 64 + contenido 1128 (col 72) con Resumen (3 tarjetas 360×256 + últimas respuestas), rail con mini-vistas de Respuestas y Mi QR, y móvil 375 con drawer cerrado |
| `09-page-hero.png` | `../09-page-hero.svg` | 79 KB | **cabecera de las 8 rutas internas (30-oct)**: dos bandas apiladas — 430 con kicker+lead, 321 sin lead — cotas 100/20/12/16/100 y variante móvil 375 (py 60, banda 337, H1 44) |
| `10-login.png` | `../10-login.svg` | 347 KB | **login v2 (implementado en `/entrar`, 30-oct)**: split 50/50, eje x 720, tarjeta 400 (pad 40, alto 706), mock de encuesta 360 con badge DEMO, **deck `VISTA DEL PANEL` 328x200 con solape 36**, línea de recorrido y frase canónica; colapso a franja ciruela <992 |
| `11-panel.png` | `../11-panel.svg` | 142 KB | **panel de pantalla única — diseño (30-oct, re-rasterizado con la cabecera corregida)**: cab 64 · container 1140 desplazado +90 · 3 tarjetas 364×256 con barras div · badge DATOS DE EJEMPLO · bandeja th 74 + filas 56 · mini-vista estado vacío 1:2 en el rail; anotaciones de cabecera en dos columnas legibles (capas | tokens/medidas) |

> **Última regeneración: 30-oct.** Los 16 PNG se rasterizaron con Chrome headless 1:1 (`--window-size` = `viewBox`); `09-page-hero`, `10-login` y `11-panel` nacieron ya en ese formato (`11-panel` re-rasterizado el 30-oct tras corregir el solape de anotaciones de la cabecera). Las marcas "re-rasterizar pendiente" de las filas antiguas quedaron **obsoletas**: todo PNG corresponde hoy a su SVG de la misma fecha.

> **d01–d04 (panel):** el SVG ya es el plano métrico; **PNG: pendiente** para los cuatro. Rasteriza el orquestador con el comando de abajo (density 144 → las cotas monospace de 8–9 px del plano móvil siguen siendo legibles; si no, subir density a 192 solo para `d04`).

## Medidas de referencia (formula `col = (container − 11 x 24) / 12`)

| breakpoint | container | columna | 4 col | 6 col | 8 col |
|---|---|---|---|---|---|
| sm (576) | 540 | 23 | 164 | 258 | 352 |
| md (768) | 720 | 38 | 224 | 348 | 472 |
| lg (992) | 960 | 58 | 304 | 468 | 632 |
| xl (1200) | 1140 | 73 | 364 | 558 | 752 |
| xxl (1400) | 1320 | 88 | 424 | 648 | 872 |

Verificacion de cierre de fila: `n x col + (n−1) x 24 = container` → xxl: `4x88 + 3x24 = 424` ✓ · xl: `7x73 + 6x24 = 655` ✓.

## Como regenerar

```powershell
node -e "const sharp=require('sharp');const fs=require('fs');const p='opendesign/wireframes/';fs.readdirSync(p).filter(f=>f.endsWith('.svg')).forEach(async f=>{await sharp(fs.readFileSync(p+f),{density:144}).png().toFile(p+'png/'+f.replace('.svg','.png'));});"
```

**Nota metrica:** un generador de imagenes (IA) no puede dibujar cotas exactas. Los mockups de `../mockups/` son direccion visual; **estos PNG son la referencia de medidas**.

## Discrepancias detectadas al renderizar

| # | Tema | Detalle |
|---|---|---|
| R1 | Canales: 3 vs 4 tarjetas | `UX-LANDING.md` §2 plantea 3 (Instagram+WhatsApp juntos); el plano y los mockups dibujan **4** (mostrador, Instagram, WhatsApp, TikTok LIVE). **RESUELTO 27-oct** (operador, acta §3): 4 tarjetas; el plano fija el orden MOSTRADOR · INSTAGRAM · WHATSAPP · TIKTOK LIVE. |
| R2 | FAQ y CTA | el plano los une en un row 7+5; `UX-LANDING` los trata como bandas separadas. Ambas validas: el plano define la **fila**, no la altura de banda. |
| R3 | Escala de la encuesta | el mockup `07-encuesta-flujo` muestra el paso 2 con chips (multi-opcion); la decision del plan es **3 preguntas 1-5**. Corregir el copy del paso 2 antes de construir. |
| R4 | Features de precios | el mockup `06-precios` lista "analisis de sentimientos", "API completa" y "SLA": **fuera del MVP**. Sustituir por features reales del plan acordado. |
| H-1 | Banda del footer | era ciruela vs "footer crema" sin decidir. **RESUELTO 27-oct** (operador, acta §4 — la orden de rasterizado la llamó "R4"): banda **crema #FFF8F2**; enlaces `--link #B23A2A` (5.65), secundario `#65586E` (6.29). |

> **R1 y el footer (H-1, llamado R4 en la orden del operador) quedaron resueltos el 27-oct** — acta `../../DECISIONES-2026-10-27.md` §3/§4. Los PNG de `03-canales`, `07-footer` y `d03-respuestas` estan **pendientes de re-rasterizado** (el plano SVG mando; el PNG muestra la version anterior). R2/R3/R4 (precios) siguen abiertas.
