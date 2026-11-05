---
tipo: analisis-tecnico
proyecto: scan (landing base Coral)
fecha: 2026-10-27
autor: build-orchestrator + explore-alibaba
alcance: PROYECTO EXTERNO al ecosistema opencode-v2 (PROJECT-SCOPE-GUARD)
---

# Analisis de la landing `E:\Trabajos\scan`

> **DOCUMENTO HISTORICO (27-oct-2026).** Registra el estado del template antes del proyecto Scan-Say-Done.
> Varias de sus recomendaciones **ya no estan vigentes**: §10 proponia retematizar editando `_variables.scss` y dejaba compilar Bootstrap como opcional; el plan vigente (`docs/PLAN-SCAN-SAY-DONE.md`, D3) **exige** compilar Bootstrap desde `bootstrap/scss` con `$theme-colors`. Tambien su §7 cita `data.js` con ~900 lineas; hoy tiene 204.
> Fuente de verdad actual: `docs/PLAN-SCAN-SAY-DONE.md` + `docs/ARQUITECTURA-SCAN-SAY-DONE.md` + `opendesign/DESIGN-CONTRACT.md`.

## 0. Veredicto en 5 lineas

Template comercial "Coral" (Shreethemes) montado sobre Next.js 15 App Router en **JS puro** (sin TS).
`src/app/page.js` es la landing canonica (agencia) y esta compuesta por 12 componentes mas copy inline.
El sistema visual ya esta tokenizado en Sass (`_variables.scss`), asi que **retematizar = editar un archivo**.
La deuda real no es visual: es SEO vendor, JS legado muerto (10 archivos), 63 rutas de nicho sobrantes y `assets/js` sin usar.
Reutilizable como base si se recorta el template a la landing + las vistas que el proyecto nuevo necesite.

## 1. Stack

| Capa | Detalle |
|---|---|
| Framework | next 15.4.1 (App Router), react 19.1.0, JavaScript/JSX |
| Estilos | Bootstrap 5.3.7 (CSS precompilado) + Sass (15 partials) + `@mdi/font` |
| UI libs | swiper 11, tiny-slider-react, react-countup, react-type-animation, yet-another-react-lightbox, react-icons |
| Config | `next.config.mjs:3` `reactStrictMode:false`; `jsconfig.json` con alias `@/*` (usado en 7 imports) |
| Ausencias | sin TS, sin linter configurado (`next lint` deprecado), sin tests, sin CI, sin `not-found.js`/`loading.js`/`error.js` |

## 2. Rutas (76 `page.jsx`)

| Familia | n | Nota |
|---|---|---|
| Home variants | 13 | `/` = canonica. Nichos: nft, yoga, hospital, cryptocurrency, saas, consulting, digital-marketing, finance, it-solution, minimal-portfolio, web-hosting, charity |
| Portfolio | 22 | 20 grids (`{modern,classic,creative,masonry}-{two..six}`) + 2 detail |
| Blog | 15 | listados + 12 formatos de post + `blog-standard-post/[id]` |
| NFT/creators | 9 | vertical completo (explore, detail, collection, wallet, upload-item, creators, creator-profile, profile-setting) |
| Auth | 4 | login, signup, reset-password, lock-screen (formularios sin submit real) |
| Legal/utility | 3 | terms, privacy, faqs |
| Special | 3 | comingsoon, maintenance, `error/page.jsx` (es ruta `/error`, NO boundary Next) |
| Inner | 7 | aboutus, services, service-detail, pricing, team, testimonial, contactus |

## 3. Landing canonica (`src/app/page.js`, 198 lineas)

Orden: `Navlight` -> hero (`:21-60`, bg `/images/hero/bg.jpg`, H1 `:28`) -> shape SVG (`:54-60`) -> `ServicesOne` (`:64`) -> bloque **about inline** (`:67-121`) -> `CounterOne` (`:120`) -> `CtaOne` (`:123`) -> `PortfolioOne` (`:140`) -> `TeamOne` (`:152`) -> `ClientOne` (`:170`) -> `BlogOne` (`:187`) -> `Footer` -> `ScrollToTop`.

Copy hardcodeado inline (no viene de `data.js`): `:28-29`, `:42`, `:101-113`, `:130-136`, `:147-148`, `:166-167`, `:182-183`.
Frase de relleno repetida 9 veces: *"Design better and spend less time without restricting creative freedom."* (`page.js:29,104,136,148,167,183`, `footer.jsx:15`, `counter-one.jsx:14`, `data.js:7,12,17,22,27,32`).

## 4. Componentes (56)

- **Core de la landing:** `navbar/navlight` (306L, `'use client'`, mega-menu 76 rutas), `video/video-one` + `ModalPortal`, `services/services-one`, `counter/counter-one`, `cta/cta-one`, `portfolio/portfolio-one`, `team/team-one`, `client/client-one`, `blog/blog-one`, `footer` (server), `scroll-to-top`.
- **Genericos reutilizables:** `services-two/three`, `counter-about`, `digital-counter`, `it-counter`, `cta-two/three`, `client-two`, `project-two`, `faq-one`, `pricing`, `partner-one`, `video-two`, `blog/{sidebar-blog,blog-desc,blog-comment}`.
- **Nicho (podables):** `yoga/*` (5), `crypto/*` (3), `nft/*`, `banner/{nft,it,hospital,finance,crypto}`, `services/{hosting,hospital,charity}`, `cta/{nft-cta,charity-banner}`, `navbar/{nft-nav,nft-nav-light}`, `dr-team`, `dr-table`.
- Duplicidad: **6 navbars** son copias de ~300 lineas con diferencias cosmeticas.

## 5. Sistema de estilos — punto fuerte

`assets/scss/style.scss` (43L, `@use`): `variables` -> `masonary` -> `general` -> `helper` -> `bootstrap-custom` -> `components` -> `menu` -> `home` -> `blog` -> `countdown` -> `features` -> `testi` -> `team` -> `contact` -> `footer`.

`_variables.scss` (89L) es **el unico archivo con hex del proyecto** (0 hex fuera de el):

| Token | Hex |
|---|---|
| primary | `#1ab394` |
| secondary | `#5a6d90` |
| blue | `#0774ff` |
| success / warning / info / danger | `#84cc16` / `#f59e0b` / `#38bdf8` / `#ef4444` |
| dark / black / muted / light | `#1e293b` / `#161c2d` / `#94a3b8` / `#f8f9fc` |

Mas `$colors` map, `$heading-font-sizes` (h1 42px..h6 15px), `$display-font-sizes`. Fuente **Kumbh Sans via `@import url()`** en `_variables.scss:6` (no `next/font`; el README miente).

**Como se aplica el tema:** `layout.js:1` importa Bootstrap **precompilado** (azul default) y el tema se impone encima con CSS plano + `!important` (`_components.scss:34-80` `@each $colors` -> `.btn-*`, `.btn-soft-*`; `_bootstrap-custom.scss:67-87` `.bg-*`/`.text-*`). Consecuencia: cambiar `$primary` **si retematiza** todo (por los `@each`), sin tocar 76 rutas. Coste: cadena de `!important` y pelea con utilidades Bootstrap. Opcional a futuro: compilar Bootstrap por Sass con `@use "bootstrap/scss" with ($theme-colors)`.

## 6. JS legado — 100% muerto

`assets/js/` tiene 10 archivos (`plugins.init.js` 455L, `app.js`, tiny-slider, swiper, shuffle, tobii, feather, gumshoe, easy_background, bootstrap.bundle).
- **Cero imports/`<Script>`** en `layout.js` ni en las 76 rutas. Arbol muerto.
- **Sin jQuery** (todo UMD vanilla).
- Reemplazos React ya en uso: `tiny-slider-react` (7 comps, `ssr:false`), `swiper`, `react-countup`, `react-type-animation`, lightbox propio, modal propio.
- `plugins.init.js:452` typewriter roto (`toRotate` usado antes de declararse), silenciado por `try/catch` vacios.

Lo unico JS vivo: **CDN de Bootstrap en `<script>` crudo en `<head>`** (`layout.js:21-25`) -> render-blocking, sin `strategy`, y de el depende `nft-explore/page.jsx:19` + `components/nft/explore-product.jsx:13` (`new window.bootstrap.Tooltip`, **sin guard**). Los `data-bs-toggle` del navbar tambien dependen del CDN. Existe copia local sin usar en `assets/js/bootstrap.bundle.min.js`.

## 7. Datos

`src/app/data/data.js` (~900L) — unica capa, sin CMS ni API. 19 colecciones `export const`.
Consumo **mixto**: los componentes core leen de `data.js`; la landing raiz tiene su copy inline.
Los iconos son **componentes React** dentro de `data.js` (`icon: FiAperture`) -> no serializable a RSC puro, refs nuevos por render, sin memo (`services-one.jsx:9`, `counter-one.jsx:21`).

Colecciones que usa la landing raiz (8): `servicesData:3`, `counterData:36`, `portfolioOne:64`, `teamData:107`, `clientData:158`, `blogData:233`, `footerSocial:299`, `footerLink1:321`, `footerLink2:347`.
Colecciones solo-nicho (borrables si se recorta): `cryptoData`, `nftData`, `masonaryData`, `causeData`, `faqData`, `wallet`, `creator`, `portfolioData`, `recentPost`, `blogTag`.

## 8. Assets

`public/images/` = 186 archivos en 14 carpetas. La landing raiz usa ~40.
Peso muerto en el bundle publico: `logo*.psd` (2), `video.mp4`, `audio.mp3`, 5 svgs de `create-next-app`, y carpetas de nicho (`wallet/` 17 svg DeFi, `nft/`, `coin/`, `asana/`, `cause/`, `service/`, `hosting/`).

## 9. Deuda tecnica priorizada

| # | Severidad | Hallazgo | Archivo:linea |
|---|---|---|---|
| 1 | Alta | SEO inexistente: un solo `metadata` generico heredado por 76 rutas; sin OG, sin `metadataBase`, sin canonical, sin sitemap/robots | `layout.js:6-9` |
| 2 | Alta | Vendor hardcodeado: author/website/email de Shreethemes, keywords y description de otra marca, footer enlaza al vendor | `layout.js:15-20`, `footer.jsx:104`, `comingsoon/page.jsx:53` |
| 3 | Alta | `<script>` CDN crudo en `<head>` (render-blocking) + acoplamiento fragil a `window.bootstrap` sin guard | `layout.js:21-25`, `nft-explore/page.jsx:19`, `components/nft/explore-product.jsx:13` |
| 4 | Media | `alt=""` sistematico en imagenes de contenido; `alt="..."` literal; `Icon title=` en vez de aria-label | `page.js:27,36-39,73,77,83,87,159`, `portfolio-one.jsx:13`, `footer.jsx:80`, `navlight.jsx:37-40,249-250`, `blog-slider-post/page.jsx:73-79`, `footer.jsx:20` |
| 5 | Media | `sizes="100vh"` (unidad de alto) en `next/image` -> srcset mal resuelto | `page.js:73,77,83,87` |
| 6 | Media | `<img>` crudo convive con `next/image` (sin lazy/optimizacion uniforme) | `navlight.jsx:257`, `navlight-two.jsx:257`, `navdark.jsx:253`, `nft-nav.jsx:286`, `nft-nav-light.jsx:290`, `blog-slider-post/page.jsx:73-79`, `portfolio-masonry-two/page.jsx:72` |
| 7 | Media | CSS/JS huerfano: `#preloader`, `.tobii__counter`, Shuffle+`.picture-item` (filtrado inalcanzable), `.lightbox` sin CSS, `globals.css` y `page.module.css` vacios | `_components.scss:732`, `_helper.scss:185,196`, `app.js:31-36` |
| 8 | Media | Formularios falsos: newsletter y sign-in sin handler, **ID duplicado** `submitsubscribe`, `action="index.html"` heredado de HTML estatico | `footer.jsx:47-63`, `navlight.jsx:258-288`, `index-saas/page.jsx:27`, `maintenance/page.jsx:60` |
| 9 | Baja | `href="service-detail"` sin barra (rompe en variantes con prefijo) y `href="#"`/`#!` | `services-one.jsx:21`, `navlight.jsx:45,77,83,90`, `crypto-table.jsx:38,46` |
| 10 | Baja | A11y estructural: modal sin `role="dialog"`/`aria-modal`/Escape, offcanvas sin focus trap, sin skip-link, iframe YouTube con titulo generico y video ajeno | `video-one.jsx:18,26`, `navlight.jsx:45` |
| 11 | Baja | `reactStrictMode:false` esconde doble-invocacion de efectos | `next.config.mjs:3` |

## 10. Plan de reutilizacion (orden recomendado, 8 pasos)

1. **Identidad** — `package.json:2` nombre nuevo; `layout.js:6-9` metadata real + `title.template`; borrar `layout.js:15-20`; reescribir `README.md`.
2. **Tema** — editar `_variables.scss:12-22` (paleta) y `:6` (fuente). El resto se retematiza solo. Mover fuente a `next/font` (elimina `@import` blocking).
3. **Bootstrap JS** — reemplazar `layout.js:21-25` por `next/script strategy="afterInteractive"` o import del npm `bootstrap` en cliente; añadir guard en los 2 usos de `window.bootstrap`.
4. **Contenido de la landing** — reescribir el copy inline de `page.js` (hero, about, encabezados), decidir si quedan `VideoOne` (usado 2x), `TeamOne`, `ClientOne`, `BlogOne`; corregir `sizes`.
5. **Datos** — reemplazar las 8-9 colecciones que usa la landing en `data.js`.
6. **Navegacion** — `navlight.jsx:89-241` mega-menu de 76 rutas -> menu real; elegir **un** navbar y borrar los otros 5; corregir `href`.
7. **Recorte de nichos** — borrar rutas no usadas + componentes de nicho + `@use` de partials muertos en `style.scss:30-43` + `public/images/{wallet,coin,asana,cause,service,hosting,nft}` + `.psd`/`video.mp4`/`audio.mp3` + `src/app/assets/{js,css}` y `Documentation/` (doc del vendor).
8. **Cierre** — quitar linea Shreethemes/Coral del footer, `reactStrictMode:true`, `app/not-found.js`, pase de `alt`/`aria`, SEO por pagina.

**No** se justifica migrar a TS / Tailwind / shadcn: ningun riesgo de la tabla §9 lo exige. Opcional futuro: compilar Bootstrap por Sass para matar los `!important`.

## 11. Notas de metodo

- Analisis read-only; sin `ecosystem-context`/`graphify`/`rag-search` (proyecto externo, `docs/operations/PROJECT-SCOPE-GUARD.md` en el ecosistema).
- Evidencia: lectura directa del arbol (76 `page.jsx`, 56 componentes, 15 partials SCSS, 10 archivos JS, 186 assets, `package.json`, `next.config.mjs`, `jsconfig.json`, `layout.js`, `page.js`, `data.js`).
- Verificacion en runtime ejecutada — ver §12.

## 12. Linea base verificada en runtime (2026-10-27)

| Check | Comando | Resultado |
|---|---|---|
| Node / npm | `node -v` / `npm -v` | `v24.16.0` / `11.18.0` |
| Git | `git status` | **NO es repo git** (`fatal: not a git repository`) |
| Install | `npm install` | exit 0 — 57 paquetes, 1m; **8 vulnerabilidades (6 high, 2 critical)** |
| Build | `npm run build` | exit 0 — `Compiled successfully in 11.0s`, **78/78 rutas estaticas**, 0 warnings de compilacion/ESLint/Sass |
| Servidor | `next start -p 3010` | 200 en `/` (128.905 B) y `/aboutus` (88.960 B) |
| Smoke Playwright | `http://localhost:3010/` | H1 "Making Your Business" visible ✓ · seccion "Showcase your Stunning Projects" visible ✓ |
| Consola | — | **0 errores**, 2 warnings de preload CSS no usado |
| Red | — | todas las respuestas 200 |

Notas de la linea base:
- First Load JS compartido: **99.7 kB**. Ruta mas pesada: `/index-hospital` (27.5 kB / 146 kB First Load).
- **`npm audit`: 8 vulnerabilidades** (6 high, 2 critical). No aplicar `npm audit fix` sin revision (riesgo de breaking changes).
- Installs scripts bloqueados por npm 11: `@parcel/watcher`, `sharp`. Si la optimizacion de imagenes falla en runtime: `npm install-scripts approve sharp @parcel/watcher`.
- **Hallazgo de rendimiento nuevo:** el mega-menu de `navlight.jsx` renderiza ~76 `<Link>` y en la landing dispara **prefetch de las 78 rutas** al cargar (medido: ~76 requests `?_rsc=` + 84 estaticas). Recortar el menu (§10 paso 6) elimina casi todo ese trafico.
- Sin repo git = sin rollback real. Inicializar git antes de editar es requisito operativo.

## 13. Bitacora de ejecucion (2026-10-27)

### Decisiones del operador
| Decision | Valor |
|---|---|
| Naturaleza | Landing de agencia/servicios, misma composicion de secciones |
| Alcance de rutas | Landing + internas basicas (9 rutas + `_not-found`) |
| Idioma | Espanol CL/LatAm |
| Marca | Provisional "Agencia" + placeholders `[TODO: ...]` |
| Paleta | Se conserva la familia teal (oscurecida a `#0e6e5c` por WCAG AA) |
| Control de versiones | Repo git inicializado con commit base |

### Commits
| Hash | Contenido |
|---|---|
| `5a7c2e3` | baseline del template (397 archivos) — punto de rollback |
| `a293439` | recorte: 69 rutas y 41 componentes huerfanos eliminados |
| `8a4fde6` | navbar reducido a 6 rutas supervivientes |
| `ef8931b` | purga de assets y JS sin referencias (87 archivos) |
| `d89dd38` | copy espanol de la landing + a11y de imagenes/forms |
| `89b3cc8` | copy espanol de las 8 internas |
| `6d6d10d` | menu movil (aria), validacion de contacto, dimensiones de imagen |
| `904dbbc` | `<h1>` unico + landmark `<main>` |
| `b57f436` | contraste de pricing, foco del modal, enlaces muertos |
| `647577a` | metadata por pagina (2 rutas via `layout.js` por ser client components) |
| `e522b94` | cierre de bloqueantes del reviewer: menu movil funcional, foco sin robo en mount, paleta AA, video con `preload="none"` |

### Estado final verificado
- Rutas: **9 + `_not-found`** (antes 78). Build exit 0.
- Funcional (Playwright sobre `:3017`): menu movil abre/cierra (`open` + `display:block`, `aria-expanded=true`), sin robo de foco ni scroll al cargar (`activeElement=BODY`, `scrollY=0`), formulario de contacto con validacion nativa y mensaje de exito, 0 errores de consola en `/`.
- Contraste: `$primary #0e6e5c` = **6.17:1** con blanco (antes 2.65:1). `:focus-visible` restaurado.
- Video: `muted playsInline preload="none" poster` (ya no autodescarga 8.58 MB).
- Reviewer: ver §14 (veredicto final).

### Deuda abierta (backlog, no bloqueante de estructura)
- `@mdi/font` completo (338 KB CSS + 403 KB woff2) para ~10 iconos.
- Kumbh Sans via `@import` de Google Fonts (bloqueante de render); migrar a `next/font`.
- Dependencias sin uso: `swiper`, `react-type-animation`, `yet-another-react-lightbox`.
- ~101 de 130 imagenes de `public/images` sin referencia; `Documentation/` del vendor.
- Estados loading/empty/error no implementados (solo success) — no hay backend aun.
- `npm audit`: 6 high + 2 critical en dependencias del template.
- Sin `robots.txt` ni `sitemap.xml`.
- `package.json` aun `"name": "coral"`; README es el boilerplate de create-next-app.

### Pendiente del operador (placeholders `[TODO]`)
Marca y dominio | contacto (email, telefono, direccion, mapa) | endpoints de formulario y newsletter | URLs de redes sociales | cifras reales de los contadores | nombres de clientes/equipo/testimonios | video propio | datos legales (razon social, RUT, domicilio) + revision legal.

## 14. Gate de calidad final

### Veredicto: PASS CON OBSERVACIONES

Tres pasadas de reviewer (`FAIL` → `FAIL estrecho` → condicion de `PASS`), cada bloqueante cerrado con evidencia servida (HTML/CSS de produccion), no con lectura de source.

| Bloqueante | Cierre | Evidencia |
|---|---|---|
| Menu movil muerto | `navlight.jsx:84` produce la clase `.open` que exige `_menu.scss:765-781` | Playwright 390x844: cerrado `display:none` → click → `.open` + `display:block` + `aria-expanded=true` + link visible → click → cerrado |
| Robo de foco al cargar | `video-one.jsx:18-28` con `wasOpenRef` | Playwright: `activeElement=BODY`, `scrollY=0` en load |
| Contraste WCAG AA | `$primary #0e6e5c` (6.17:1 con blanco vs 2.65:1 anterior) | CSS compilado sirve `#0e6e5c`, cero `#1ab394` |
| Regresion de contraste en footer | `footer.jsx:70` `btn-soft-primary` → `btn-primary` (1.95:1 → 6.17:1) | reviewer recalculo sobre CSS servido |
| Foco visible (botones, logo, buscador, video) | `:focus:not(:focus-visible)` + regla `:focus-visible` global importada | Playwright: buscador abierto → foco → outline solido 3px `#0e6e5c` |
| Video 8.58 MB autodescargado | `autoPlay`/`loop` fuera; `preload="none" controls poster` | HTML servido sin `autoplay` en `/aboutus` y `/services` |

Commits finales: `d2ea8c5` (video + footer + foco nav), `de979c0` (esta bitacora), `958d4fe` (foco del buscador + `globals.css` importado).

## 15. Endurecimiento de placeholders (2026-10-27, segunda tanda)

Objetivo: que la landing **no publique contenido inventado** y que el operador solo tenga que rellenar datos, no limpiarlos.

### Que se hizo
| Pieza | Commit | Resultado |
|---|---|---|
| `src/app/data/site.js` | `c54f7dc` | Fuente unica de config (marca, dominio, contacto, endpoints, social, counters, features) con override `NEXT_PUBLIC_*` + fallback local |
| Gating de secciones | `d39206f`, `1a1c6d0`, `61a0e75` | Contadores, equipo y testimonios fuera del DOM cuando el flag esta en `false` (contenedor completo, sin huecos) |
| Formularios honestos | `b639e02` | Estados idle/sending/success/error + `AbortController` 10 s; sin endpoint → boton `disabled` + helper. **Cero exito simulado** |
| Contenido legal y servicio | `ae00c0e` | `privacy`/`terms` con aviso de documento en preparacion; `service-detail` con servicio real (dejo de ser client component) |
| Guarda anti-placeholder | `9d830de`, `6a83344` | `npm run check:placeholders` falla con `[TODO`, `lorem ipsum`, slogan del vendor o `Shreethemes` en `.js/.jsx/.mjs/.scss/.css/.json` + configs raiz |
| Marca centralizada | `33d60ef` | 8 breadcrumbs leen `SITE.name`; vendor fuera de `style.scss`; paquete renombrado a `agencia-landing` |
| Datos de ejemplo | `5861e9c` | `teamData`/`clientData` vacios con forma documentada en comentario: activar un flag sin datos ya no publica nada |

### Evidencia (verificada, no declarada)
- `npm run check:placeholders` → `OK: 0 placeholders` (exit 0), tras prueba negativa con archivo temporal `.js` y `.scss`.
- `npm run build` → exit 0, 10 rutas, First Load JS 122 kB (`/`).
- Playwright sobre la build de produccion: 9 rutas 200, **0 errores de consola**, sin `[TODO` en HTML, sin `0+`/`0%`, sin "Nuestro equipo" ni testimonios en `/aboutus` y `/services` (verificado post-hidratacion), menu movil abre/cierra, formularios deshabilitados con helper.
- Reviewer: **PASS CON OBSERVACIONES** (3 pasadas sobre esta tanda). Context7 verificado para `next/dynamic ssr:false` (riesgo de hidratacion bajo: el gate vive en el server component padre).

### Lo que el operador debe hacer (3 pasos)
1. **Identidad**: `NEXT_PUBLIC_SITE_NAME`, `NEXT_PUBLIC_SITE_URL` (dominio real) y contacto (`EMAIL`/`PHONE`/`ADDRESS`/`MAP_URL`). Sin esto la marca publicada sera "Agencia" y `metadataBase` apunta a localhost.
2. **Formularios**: definir `NEXT_PUBLIC_CONTACT_ENDPOINT` / `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` (POST JSON, 2xx = exito). Hasta entonces quedan honestamente deshabilitados.
3. **Prueba social**: rellenar `counterData`/`teamData`/`clientData` con datos reales y **despues** activar `SITE.features.*`. Y reemplazar material de ejemplo (video de YouTube del template, fotos de stock, `video.mp4` de 8.58 MB).

### Backlog tecnico restante
`@mdi/font` completo (741 KB para ~10 iconos) · Kumbh Sans por `@import` → `next/font` · deps sin uso (`swiper`, `react-type-animation`, `yet-another-react-lightbox`) · ~101 imagenes sin referencia en `public/images` · sin `robots.txt`/`sitemap.xml` · `npm audit` 6 high + 2 critical · middleware en `contactus`/`footer` sin cleanup de unmount · `check-placeholders` no cubre `public/`.

### Observacion de proceso
En una tanda de verificacion, un agente devolvio un build con rutas `/blog` inexistentes en este proyecto (build ejecutado en otro directorio). El estado real se re-verifico manualmente: 10 rutas, `git status` limpio, video `/images/video.mp4`. Leccion para el proximo turno: **todo reporte de build debe incluir `Get-Location` + el bloque de rutas y contrastarse contra las 10 rutas esperadas**.
