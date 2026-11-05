# ENTREGA-UX — manifiesto para revisión en Drive

> Carpeta: `opendesign/` · repo `scan` · HEAD `02978a1` · 29-oct-2026. Rutas relativas a `opendesign/`. Índice del paquete; no añade criterio de diseño.

## 1. Qué es esta entrega

Se entrega la documentación de diseño y UX del sitio marketing de Scan-Say-Done: 1 revisión de criterio, 5 documentos de reglas/copy, 16 planos métricos SVG (+16 PNG), 16 mockups, 19 capturas reales del sitio servido y 9 actas de verificación de fase.
El sitio servido está **funcional y corregido hasta F9** (`796c10f`): landing de 9 bandas con eyebrows y ritmo de fondos, 8 rutas internas con `page-hero`, accesibilidad táctil 44 px, FAQ en banda blanca.
**No está terminado:** los precios (sección construida pero oculta por flag `showPricing=false`), las fotos reales de las 3 aplicaciones (hay placeholders con badge `DEMO`) y el correo de contacto (`SITE.contact.email` vacío → sin canal ni CTA real). El panel del dueño **sí está construido** desde el 30-oct: `/entrar` (login) y `/panel` (bandeja), ambos frontend sin backend.

## 2. Orden de lectura recomendado

| # | archivo | por qué | min |
|---|---|---|---|
| 1 | `REVISION-UX.md` | lectura única: qué se ve hoy, qué corregir, en qué orden (§6 y §6b estado de aplicación) | 12 |
| 2 | `capturas/2026-10-29/README.md` + las 19 PNG | **verdad visual**: el sitio servido tras `796c10f`, banda a banda y móvil | 8 |
| 3 | `UX-LANDING.md` §3 | plano conceptual por sección (layout; las cotas mandan en los SVG) | 10 |
| 4 | `DESIGN-CONTRACT.md` | reglas duras: contraste, ritmo de 3 bandas ciruela, estados, prohibiciones | 8 |
| 5 | `wireframes/INDEX.md` → 3-4 SVG | retícula y medidas 1440; la tabla de estado dice qué plano ya no vale | 10 |
| 6 | `COPY-LANDING.md` §13 | los 11 textos que el operador debe aprobar antes de publicar (6 fundacionales + 5 eyebrows) | 5 |
| 7 | `ANALISIS-QR.md` §3 + `IMAGENES-REQUERIDAS.md` | decisión cerrada del QR (el hero no lleva QR) y las fotos que faltan | 6 |

Total ≈ 60 min. Si hay 15: ítems 1, 2 y la tabla §4 de este archivo.

## 3. Inventario por carpeta

| ruta | qué contiene | estado: vigente (describe el sitio de hoy) / desactualizado / histórico (evidencia, no especificación) |
|---|---|---|
| `REVISION-UX.md` | revisión de criterio + estado de aplicación por hallazgo | vigente |
| `UX-LANDING.md` | plano conceptual de la landing, sección a sección | vigente |
| `DESIGN-CONTRACT.md` | contrato de reglas (color, tipografía, ritmo de bandas, estados) | vigente |
| `COPY-LANDING.md` | copy de la landing + §13 pendientes de aprobación | vigente (11 textos sin aprobar) |
| `COPY-INTERNAS.md` | copy de las 8 rutas + §2 de datos que faltan | vigente (bloqueado por operador) |
| `INDEX.md` | orden documental y mapa físico de la carpeta | vigente |
| `REVISION-UX-2026-10-30.md` | **revisión de UX del producto completo** (landing + internas + login + dashboard): qué juzgar en cada pantalla, lo ya corregido, lo más débil y las decisiones abiertas | **vigente 30-oct**; reemplaza a la revisión del 29-oct, que cubría solo la landing |
| `COMO-VER-LA-ENTREGA.md` | **manual de 5 minutos**: cómo abrir capturas, planos SVG y el producto real | **vigente 30-oct** |
| `VERIFICACION-LOGIN.md` · `VERIFICACION-PANEL.md` · `VERIFICACION-DASHBOARD.md` | actas del login, del panel y del dashboard: defectos encontrados al medir y sus correcciones | vigente (evidencia del 30-oct) |
| `ANALISIS-QR.md` | decisión del QR por superficie (§3: hero sin QR) | vigente |
| `IMAGENES-REQUERIDAS.md` | fotos que hacen falta y su especificación | vigente |
| `ASSET-PIPELINE.md` + `EFECTOS-Y-MOTION.md` | exportación de marca y motion budget | vigente |
| `ANALISIS-MARKETING.md` + `RIESGOS-USUARIO.md` | auditoría de conversión y puertas D1-D4 | vigente |
| `DASHBOARD-UX.md` (v2 30-oct) + `DASHBOARD-AUDITORIA.md` + `DASHBOARD-DECISIONES.md` | diseño del dashboard del dueño: shell con sidebar y 3 secciones | **vigente v2**; el concepto del 27-oct (KPIs + alertas) queda en el historial de git, no se borra |
| `UPGRADE-VISUAL-F8.5.md` · `PLAN-EJECUCION-LANDING.md` · `DECISIONES-2026-10-27.md` | propuesta F8.5, plan F0-F9 y acta de resoluciones (R1, H-1) | histórico (la acta sigue citándose) |
| `BUILD-ORDER.md` · `AUDITORIA-IMAGENES.md` · `gallery.html` | orden de construcción, auditoría de imágenes, visor local | histórico (27-oct) |
| `VERIFICACION-F0-F1…F9.md` (9) + `VALIDACION-INTEGRIDAD-F0-F7.md` | actas de verificación por fase | histórico (evidencia, no especificación) |
| `wireframes/*.svg` (16) | planos métricos: cotas px, capas band/grid/container/measure | 6 vigentes (`00-grid-system`, `05-precios`, `09-page-hero`, `10-login`, `11-panel` — **nuevo 30-oct, diseño**, `d01-d04`… ver §4) · `01-hero` **corregido 29-oct** · 6 de landing planificación 27-oct |
| `wireframes/png/*.png` (16) | espejo rasterizado 1:1 de cada SVG (Chrome headless, 29-30 oct) | vigente: el PNG corresponde al SVG de la misma fecha |
| `LOGIN-UX.md` + `LOGIN-DECISIONES.md` | **pantalla de acceso: spec y decisiones** (30-oct) | vigente como diseño; **no implementada** |
| `PANEL-UX.md` | **panel de pantalla única: spec métrica y estados** (30-oct) — cab 64, container 1140, tarjetas 364×256, bandeja 74/56, vacío 1:2 | vigente como diseño; **no implementado** (planos `11-panel.svg` + PNG) |
| `referencias/login-referencia*.png` (2) + `ANALISIS-LOGIN-wan.md` | referencias IA del login y su análisis de visión | referencia visual, **nunca asset de producción** |
| `wireframes/GRID-SPEC.md` · `wireframes/INDEX.md` | retícula 12 col + índice y estado de planos | vigente (la retícula no cambió) |
| `mockups/*.png` (16) + `mockups/INDEX.md` | renders generados con IA 27-28 oct | histórico — **no** fuente de verdad (texto inventado) |
| `capturas/2026-10-29/*.png` (19) + README | sitio servido: 9 bandas desktop, 2 móvil, 8 internas | **vigente — verdad visual** |
| `referencias/ANALISIS-*.md` (3) | análisis de referencias y de la lámina de redesign | histórico (insumo de decisión) |
| `referencias/apps/*.webp` (6) | mercado: cartel / pantalla / vinilo | vigente como referencia |
| `brand-src/` (1 SVG + 4 PNG + `lockup-preview.html` + `MANIFEST.md`) | material de marca crudo | vigente solo `logo-symbol.svg` (lo que importa el código) |
| `featuresMD/` (guía técnica + `redesign.png`) | brief de origen del cliente | histórico |

## 4. Frescura de los planos (diagnóstico honesto)

Todos los SVG de landing son del **27-oct**: anteriores a F8.5 (glow, eyebrows, bandeo) y a F9 (bandas, internas, footer). Dos excepciones corregidas el **29-oct**: `01-hero.svg` (se le quitó el QR y se repuso la columna) y `09-page-hero.svg` (nuevo, con medidas de navegador).

| plano | sección | estado | qué le falta para reflejar el código de hoy |
|---|---|---|---|
| `00-grid-system.svg` | retícula base | VIGENTE | nada: 12 col / container 1140 intactos. No cubre el `page-hero` |
| `01-hero.svg` | Hero | **CORREGIDO 29-oct** | ya no dibuja QR (tarjeta de encuesta 1-5 + badge "3 preguntas"), repuesta la columna del H1/lead/CTA y anotados el glow y el acento coral. **No** cotiza F8.5/F9 como contrato nuevo: es diagrama actualizado |
| `09-page-hero.svg` | **Cabecera de las 8 rutas internas** | **NUEVO 29-oct · VIGENTE** | doble banda cotizada (430 con lead / 321 sin lead) + variante móvil 375 (py 60, banda 337, H1 44). Medidas tomadas del navegador, no estimadas |
| `10-login.svg` | **Pantalla de acceso** | **VIGENTE v2 · 30-oct · implementada en `/entrar`** | split 50/50 con eje en x 720, tarjeta 400 (pad 40, alto 706), mock 360 con badge DEMO, deck del panel 328x200 con solape 36 y línea de recorrido. 4 tokens nuevos (§11 `LOGIN-UX.md`): `--grad-plum-deep`, `--glow-corner`, `--edge-lit`, `--shadow-lift`. Medidas del plano **y** del navegador |
| `02-como-funciona.svg` | Cómo funciona | DESACTUALIZADO | sin eyebrow `SIMPLE Y RÁPIDO`; hoy head centrado (`.how__headline`) |
| `03-canales.svg` | Canales | DESACTUALIZADO | sin eyebrow `SIEMPRE CERCA DE TUS CLIENTES`; hoy `col-xl-3` y borde `--border-strong`; PNG obsoleto |
| `04-panel-preview.svg` | Panel (preview) | DESACTUALIZADO | sin eyebrow `TUS OPINIONES, EN UN PANEL`; hoy el panel se promete **en futuro** (F9) con badge `DEMO` |
| `05-precios.svg` | Precios | VIGENTE (planificación) | la sección **no se publica**: `SITE.features.showPricing=false` (`site.js:40`); falta el kicker `Sin permanencia` |
| `06-faq-cta.svg` | FAQ + CTA | **SUPERSEDIDO** | dibuja **una sola banda** (row FAQ 550 + 24 + CTA 386 sobre crema); el código son **dos bandas separadas**: `#faq` blanca + `#cta-final` ciruela. Vale solo como referencia del row |
| `07-footer.svg` | Footer | DESACTUALIZADO | dibuja **4 columnas de enlaces** (PRODUCTO/SOPORTE/LEGAL/CONTACTO, 4×267); hoy son marca + **3 columnas** (Producto/Recursos/Legal). Títulos hoy en overline (Montserrat 13px, .14em, `--text-2`). Nota honesta: el plano **nunca dibujó** el CTA primario que se eliminó en `796c10f`, así que en eso no hay desfase |
| `08-aplicaciones.svg` | Aplicaciones | DESACTUALIZADO (leve) | retícula y marcos 4/3 intactos; ya rotulaba "APLICACIONES" y el overline 13/.14em; faltan badge `DEMO` y placeholder |
| `d01-overview.svg` | Panel · Resumen | **HISTÓRICO (30-oct)** | reemplazado por `12-dashboard.svg`: dibujaba KPIs, gráfico Recharts y alertas, hoy vetados |
| `d02-opiniones.svg` | Panel · Opiniones | **HISTÓRICO (30-oct)** | idem: asumía paginación y texto literal sin backend |
| `d03-respuestas.svg` | Panel · Respuestas | **HISTÓRICO (30-oct)** | idem: requería un modelo de datos inexistente (cola de alertas con estados) |
| `d04-mobile.svg` | Panel · Móvil | **HISTÓRICO (30-oct)** | idem; el móvil vigente vive dentro de `12-dashboard.svg` |
| `11-panel.svg` | **Panel · pantalla única (sin sidebar)** | **VIGENTE (diseño) · 30-oct** | cabecera app **64** · container-xl **1140** (+90 en el plano; producción x 150–1290, ancho intacto) · 3 tarjetas **364×256** · bandeja **th 74 + filas 56** · mini-vista estado vacío móvil 375 **1:2** (marco 188×422) en el rail · token nuevo `--surface-2` · **no implementado**; spec `PANEL-UX.md`. PNG re-rasterizado 30-oct con la cabecera de anotaciones corregida (dos columnas sin solape) |
| `../brand-src/logo-symbol.svg` | Isotipo | VIGENTE | es el archivo que importa el código |
| `12-dashboard.svg` | **Dashboard v2 (shell + 3 secciones)** | **NUEVO 30-oct · VIGENTE** | sidebar **264** + topbar **64** + contenido **1128** (col 72) · secciones Resumen (3 tarjetas 360×256), Respuestas (tabla) y Mi QR (marco 264 sin QR inventado) · rail con mini-vistas y móvil con drawer cerrado · spec `DASHBOARD-UX.md` v2 |

**Deuda:** no existe plano de las **8 rutas internas** (aboutus, services, service-detail, contactus, terms, privacy, faqs, pricing) ni del componente **`page-hero`**; sus medidas viven solo en `_page-hero.scss`.

## 5. Qué NO es fuente de verdad / qué sí

| NO usar | por qué |
|---|---|
| `mockups/*.png` | generados por IA el 27-oct con texto inventado; nunca fueron especificación (`mockups/INDEX.md` lo dice) |
| `brand-src/referencias.png` y la lámina de redesign | insumo de origen, no medida ni regla |
| `wireframes/*.svg` y `png/*` para color, fondo, eyebrow o estructura | son de 27-oct, anteriores a F8.5/F9 (ver §4) |
| `gallery.html` | visor viejo; no refleja el sitio |
| `VERIFICACION-*.md` / `PLAN-EJECUCION-LANDING.md` | actas y plan: evidencian, no especifican |

| SÍ usar | para qué |
|---|---|
| `REVISION-UX.md` | **leer**: estado real y correcciones priorizadas |
| `capturas/2026-10-29/` | **ver**: la única imagen del sitio de hoy |
| `src/` (CSS + `page.js` + `site.js`) | **medir**: la verdad métrica es el CSS compilado |
| `DESIGN-CONTRACT.md` | **reglas**: lo que no se puede romper |
| `GRID-SPEC.md` + SVG VIGENTES | **retícula**: cotas de columnas y contenedores |

## 6. Cómo se regenera cada cosa

- **Sitio + capturas:** `npm run build` ; `npx next start -p 3120` (otra ventana) → Playwright, viewport 1440, screenshot por selector: `.hero-band, .trust-strip, #como-funciona, #canales, #aplicaciones, #panel, #faq, #cta-final, footer`; móvil 375 en `.hero-band` y `#faq`; una captura por cada una de las 8 rutas internas. Salida a `capturas/<fecha>/` y actualizar su README.
- **SVG → PNG:** `sharp` desde `node_modules` (Next ya lo trae), densidad 144. Pendientes: `03-canales`, `07-footer`, `d03-respuestas`.
- **Guardas del repo:** `npm run lint` · `npm run check:placeholders` (corchetes `[confirmar: …]`, lorem, texto del template) · `npm run check:tokens` (los tokens de marca se emiten bien en el CSS compilado). No hay `npm test`.
- Los SVG **no se reescriben sin decisión del operador**: hoy son registro con cotas vigentes (ver §4).

## 7. Bloqueos del operador (sin esto no se publica)

1. **Correo de contacto** (`SITE.contact.email` vacío) → `/contactus` sin canal y todos los CTA vacíos.
2. **Razón social, RUT y domicilio** → `/terms` y `/privacy` no son opositables sin titular.
3. **Jurisdicción y referencia legal** (el código afirma Chile / Ley 19.628 sin acta).
4. **Retención**: plazo de guardado de respuestas y correos, quién borra y cómo.
5. **Estado real del piloto**: de él depende que el sitio diga "ya sirve" o "está en preparación".
6. **Aprobar los 5 eyebrows F8.5** (`COPY-LANDING.md` §13.7-13.11) + los 6 textos fundacionales §13.
7. **Menores:** plazo de respuesta humana, método de acceso del dueño, regla de aviso urgente, etiqueta `DEMO` vs `EJEMPLO`, `noindex` en `/services` y `/service-detail`, precios y planes, fotos reales de las 3 aplicaciones. Detalle con ruta afectada: `COPY-INTERNAS.md` §2 (13 filas).
