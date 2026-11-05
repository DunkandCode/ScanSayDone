# Scan-Say-Done — Contrato de Diseño

Stack: Next.js 15 + **Bootstrap 5.3.7 COMPILADO desde `bootstrap/scss`** (decisión de plan; `layout.js` deja de importar `bootstrap/dist/css/bootstrap.min.css`) + Sass propio en `src/app/assets/scss/`. v1.1 · 2026-10-27 (alineado con `docs/PLAN-SCAN-SAY-DONE.md`).
Alcance de componentes: botones, enlaces, formulario/encuesta, tarjetas del panel, ítems/badges de alertas, sidebar. Nada más.

## 1. Coral canónico — adoptado con veto abierto

| Candidato | Fuente | vs blanco | vs ciruela | vs crema | Coste de adoptarlo |
|---|---|---|---|---|---|
| **#FF5F44** | PNG real medido (logo en producción) | 3.01 | **5.08 ✓** | 2.86 ✗ | Editar guía + re-exportar favicon |
| #FF6B5B | guía declarada | 2.80 | 5.46 ✓ | 2.66 ✗ | Re-exportar logo: exige fuente vectorial (no existe en el repo; solo hay PNG) |
| #FF5040 | favicon medido | — | — | — | Tercer valor → error; se re-exporta desde el canónico |

**Estado F6: adoptado `#FF5F44` salvo veto del operador antes del 29-oct-2026** (relinear la guía al PNG). No es decisión cerrada: si llega el veto, se **detiene el token set de §2** y la línea de export de assets hasta elegir candidato. Argumento (se mantiene): el logo PNG ya ES la marca en el mundo real; la guía es un documento sin superficies. Cambiar el PNG exigiría al diseñador la fuente vectorial original (no está en `E:\Trabajos\scan`), re-verificar todos los assets y re-imprimir lo ya entregado. La realineación cuesta una línea en el documento de guía. La diferencia #FF5F44↔#FF6B5B es imperceptible en pantalla y ningún par crítico de contraste se rompe (5.08 ≥ 4.5). El favicon `#FF5040` se re-exporta desde `#FF5F44` (ver `ASSET-PIPELINE.md`).

**Regla P0 (vigor de §1 y §2):** el coral **nunca** se usa como color de texto sobre fondo claro (2.86–3.01 < 4.5). Para enlaces y texto de acento existe `--link` (#B23A2A, 5.65 ✓). El coral solo vale como **relleno de superficie** (con texto ciruela/crema encima) o como **gráfico decorativo** (isotipo, barra de progreso, viñeta de icono). **Excepción F8.5 (registrada 2026-10-28):** sobre **ciruela**, el coral puede ser texto **solo para una palabra del H1 en display ≥44px** — hoy `CLIENTES?` (Bebas 88, línea 2). Ratios: 5.08 ✓ sobre ciruela lisa; 4.8 ✓ sobre el fondo medido en la zona del glow (captura `qa-f85-verif.png`, fórmula WCAG; texto grande ≥3.0 holgado). Un solo span por página; sobre fondo claro el veto sigue intacto y se usa `--link`.

## 2. Arquitectura de tokens (2 capas)

Capa 1 — primitivos (valor exacto, sin semántica). Capa 2 — semánticos (intención de uso; los componentes SOLO consumen semánticos).

**Primitivos** (`--brand-*`, en `_tokens.scss` nuevo):

| Token | Valor | RGB para puentes `--bs-*-rgb` | Origen |
|---|---|---|---|
| `--brand-coral` | #FF5F44 | 255, 95, 68 | PNG medido |
| `--brand-coral-dark` | #B23A2A | 178, 58, 42 | candidato enlace ya medido |
| `--brand-coral-darker` | #973124 | 151, 49, 36 | coral-dark mix black 15% |
| `--brand-plum` | #2E1E3F | 46, 30, 63 | guía |
| `--brand-ink` | #000014 | 0, 0, 20 | wordmark medido (uso: solo assets, no UI) |
| `--brand-mustard` | #F4B63B | 244, 182, 59 | guía — **decorativo solo** (1.72 vs crema) |
| `--brand-peach` | #FFE7D9 | 255, 231, 217 | guía |
| `--brand-cream` | #FFF8F2 | 255, 248, 242 | guía |
| `--brand-text-2` | #65586E | 101, 88, 110 | guía (6.29 vs crema ✓) |
| `--brand-success` / `--brand-warning` / `--brand-error` | #1B7A4D / #986A1E / #A82E39 | — | guía (5.33/4.76/6.74 vs blanco ✓) |
| `--brand-white` | #FFFFFF | 255, 255, 255 | encuesta |

**Semánticos** (en `_tokens.scss`; las variantes de zona se redefinen en `body.zone-marketing / .zone-survey / .zone-panel`):

| Token | Definición | Uso |
|---|---|---|
| `--bg` | marketing: crema · encuesta: blanco · panel: `color-mix(in srgb, var(--brand-plum) 4%, white)` | fondo de página por zona |
| `--surface` | blanco (las 3 zonas) | tarjetas, inputs, modales |
| `--surface-2` | `color-mix(in srgb, var(--brand-plum) 3%, white)` | filas, hover sutil, skeleton |
| `--text-1` | ciruela (claro) / crema (oscuras) | texto principal, títulos |
| `--text-2` | `--brand-text-2` / sobre oscuro: `color-mix(in srgb, var(--brand-cream) 75%, var(--brand-plum))` | secundario, meta |
| `--text-3` | `color-mix(in srgb, var(--text-2) 60%, var(--bg))` | placeholder, desactivado |
| `--border` | `color-mix(in srgb, var(--brand-plum) 14%, var(--brand-cream))` | separadores, inputs |
| `--border-strong` | `color-mix(in srgb, var(--brand-plum) 50%, var(--brand-cream))` *(28 % → **50 %** en F8.5, `b93943b`: al 28 % el borde no llegaba al 3:1 de UI no textual; **medido 3.03 vs crema · 3.18 vs blanco ✓**, comentario en `_tokens.scss`)* | input en reposo legible, hover borde, marco de tarjetas de canal y de aplicaciones (F8.5) |
| `--glow-hero` | `radial-gradient(70% 70% at 18% 6%, color-mix(in srgb, var(--brand-coral) 28%, transparent) 0%, transparent 72%)` *(F8.5; la versión de plan en `UPGRADE-VISUAL-F8.5 §4` era melocotón al 12 % — el implementado es coral al 28 % y es el que rige)* | glow radial **estático** de la banda ciruela: **2 colocaciones permitidas** (F9, registrada 2026-10-28) — hero de la landing (`_home.scss:352`) y `page-hero` de las 8 rutas internas (`_page-hero.scss:11`); mismo token, sin animación, 1 por página. Límites y ratios: `EFECTOS-Y-MOTION §2.1` |
| `--action-primary` | `--brand-coral` | relleno CTA, progreso encuesta, badge activo |
| `--action-primary-text` | `--brand-plum` | texto sobre `--action-primary` (5.08 ✓) |
| `--action-selected` | `color-mix(in srgb, var(--brand-coral) 8%, white)` | fondo de opción seleccionada en encuesta |
| `--link` | `--brand-coral-dark` | enlaces y texto de acento (5.65 ✓); hover: `--brand-coral-darker` (7.18 ✓) |
| `--focus-ring` | `--brand-plum` sobre zonas claras; override a `--brand-peach` en `.zone-dark` (sidebar, hero, banda CTA ciruela — el footer ya NO es zona oscura: crema, acta §4) | outline de foco (§5) |
| `--sidebar` | `--brand-plum` | sidebar del panel |
| `--success` / `--warning` / `--error` | primitivos homónimos | texto/borde/icono de estado (✓ AA sobre blanco) |
| `--success-surface` etc. | `color-mix(in srgb, var(--success) 10%, white)` (igual warning/error) | fondo suave de badge/alerta |
| `--success-fg` etc. | `color-mix(in srgb, var(--success) 80%, black)` (igual warning/error) | TEXTO dentro de `-*-surface`. Dato corregido (F5): los `--*-` crudos sobre su surface dan success 4.66 ✓ y error 5.74 ✓ — **solo warning falla (4.19 ✗)**. Derivar `--*-fg` para los tres es decisión conservadora (regla uniforme), no obligación por fallo general |

**Dónde aterriza cada capa:**

| Qué | Archivo | Nota |
|---|---|---|
| Primitivos + semánticos (`:root`, `body.zone-*`) | `src/app/assets/scss/_tokens.scss` (nuevo; `@use "tokens";` en `style.scss` tras `variables`) | Canal runtime de zonas y componentes propios; los componentes Bootstrap se tematizan por `$theme-colors` (fila siguiente) |
| `$primary`→ciruela · `$secondary`,`$muted`→#65586E · `$success/$warning/$danger`→guía (los actuales #84cc16/#f59e0b/#ef4444 fallan como texto) · `$light`→crema · `$body-color`→ciruela · `link` (#B23A2A) añadido al map | `_variables.scss` → entry nuevo `src/app/assets/scss/bootstrap.scss` (`@use "bootstrap/scss/bootstrap" with ($theme-colors…)`) | **El tema vive en `$theme-colors`/`$primary` compilados por Sass** (F1, decisión de plan): utilidades, botones y alerts nacen con la paleta de marca. `layout.js` quita el import del CSS npm; nunca coexisten ambos Bootstrap (peso de `!important` duplicado) |
| `$colors` map (template) | `_variables.scss` | Incluye `link` (#B23A2A) pero **NUNCA** entrada `coral`: ni en este map ni en `$theme-colors`; los bucles generarían `.text-coral` con `!important` (ver abajo) y violarían §1 |
| `$heading-font-sizes` / `$display-font-sizes` | `_variables.scss` | Deben igualar exactamente la tabla §3 |
| Fuentes: `next/font/google` → `Bebas_Neue` (subset 400) y `Montserrat` (400/500/600), variables `--font-display` / `--font-ui` | `src/app/layout.js` | Eliminar el `@import url(Kumbh Sans)` de `_variables.scss:6` (render-blocking + sin self-host) |
| Puente `--bs-*` (**opcional y temporal**, F1): `:root{--bs-body-bg:var(--bg);--bs-body-color:var(--text-1);--bs-link-color:var(--link);--bs-link-color-rgb:178,58,42;--bs-border-color:var(--border);--bs-primary-rgb:46,30,63}` y por selector donde haga falta token runtime por zona (`.btn-primary{--bs-btn-bg:var(--action-primary);--bs-btn-color:var(--action-primary-text);--bs-btn-hover-bg:var(--link);--bs-btn-hover-color:var(--brand-cream);--bs-btn-focus-shadow-rgb:46,30,63; --bs-btn-disabled-*}`, ídem ghost/forms/alerts) | `_bootstrap-custom.scss` | Con Bootstrap compilado el puente **ya no es la estrategia de tema**: el tema vive en `$theme-colors`. Queda solo como recurso transitorio para lo que de verdad necesite variables CSS por zona; se retira tramo a tramo |
| Estados específicos no cubiertos (opción de encuesta, tarjeta panel, ítem alerta) | `_components.scss` | Solo con tokens semánticos |

**⚠️ Campos de batalla `!important` (template):** `_bootstrap-custom.scss` líneas 22–27 y 29–35 (bucle `font-size: $size !important` sobre `h1–h6/.h*` y `.display-*`), 67–87 (bucles `.bg-*`, `.bg-soft-*`, `.text-*` con `!important` desde `$colors`), 38 (`.border-primary`); `_contact.scss:33–46` (alertas de estado con `!important`); `_footer.scss:29`. Regla: retocar **los mapas de `_variables.scss`** (origen de esos bucles; con Bootstrap compilado, se retoca también `$theme-colors` ahí), no competir desde clases de componente. Está prohibido añadir `!important` nuevos excepto dentro de esos bucles y de **la única excepción declarada (F4): sonner** — deuda del plan. Sonner se tematiza **por sus variables CSS** (`--normal-bg`, `--normal-text`, `--normal-border`, `--success-*`, `--error-*`); si no alcanza, override acotado al toaster en `_panel.scss`. Prohibido `!important` global.

## 3. Escala tipográfica

Familia display: **Bebas Neue** (1 solo weight, siempre mayúsculas). Familia UI: **Montserrat** (400/500/600). Bebas es condensada: a igual px pesa ~20–25% menos que Montserrat 600 → los tamaños display suben respecto al estado actual del landing (h1 42px … h6 15px). Nunca Bebas en cuerpo, preguntas, botones ni datos tabulares (sin `tabular-nums` reales). Nunca Montserrat < 16px en encuesta.

| Rol | Familia | Weight | Desktop px | Móvil px | LH | Uso permitido |
|---|---|---|---|---|---|---|
| `h1` / display-1 | Bebas | 400 | 88 | 44 (64 en tablet) | 0.92 | hero marketing únicamente, ≤2 líneas |
| `h2` / display-2 | Bebas | 400 | 64 | 44 | 0.95 | títulos de sección marketing; cabecera encuesta |
| `h3` / display-4 | Bebas | 400 | 48 | 34 | 1.0 | bloques y tarjetas grandes marketing |
| métrica KPI | Bebas | 400 | 40 | 32 | 0.90 | panel: tarjetas de métricas ≤4 dígitos |
| `h4` | Montserrat | 600 | 20 | 18 | 1.30 | panel: títulos de tarjeta/modal/drawer |
| `h5` / `h6` | Montserrat | 600 | 17 / 15 | 16 / 15 | 1.35 | grupos de formulario, encabezados de tabla |
| overline / kicker | Montserrat | 600 | 13 | 12 | 1.20 | MAYÚS + `letter-spacing:.14em`, color `--text-2` |
| pregunta encuesta | Montserrat | 500 | 20 | 18 | 1.40 | enunciado de las 3 preguntas y etiquetas de respuesta |
| body | Montserrat | 400 | 16 | 16 | 1.60 | todo texto legible; lead 18/17 |
| meta / tabla de datos | Montserrat | 400 | 14 | 14 | 1.45 | `font-variant-numeric: tabular-nums` |
| botón | Montserrat | 600 | 15 | 16 | 1.00 | `.btn`; alto ≥44px |

Reglas: `.ff-display{line-height:.95;letter-spacing:.01em}` (Bebas ya es mayúsculas; NO poner `text-transform` redundante salvo en overlines). El bucle `!important` de tamaños se re-escribe desde los mapas nuevos; para móvil duplicar en el media-query 768px YA EXISTENTE del bucle display (`_bootstrap-custom.scss:41–65`) con la misma `!important`. Panel: headings solo `h4–h6` (Montserrat); `h1–h3` liberan el bucle Bebas sin excepciones. **Regla de jerarquía en rutas internas (F9, 2026-10-28):** el tamaño visual se logra con las clases `.h4/.h5/.h6` de Bootstrap **sobre** el elemento semántico correcto (ej. `<h2 className="h5">`, `terms/page.jsx:44`), sin romper el orden `h1 → h2 → h3`. Motivo: se eligió la etiqueta por tamaño y produjo saltos en el outline del documento; el orden semántico es lo que audita el gate de accesibilidad — la clase solo manda px. Verificado: 0 saltos en las 8 internas.

## 4. Superficies por zona

| Zona | `--bg` | `--surface` | Bandas oscuras | Racional |
|---|---|---|---|---|
| Marketing | crema #FFF8F2 | blanco | **3 bandas ciruela** (F9: hero, banda CTA, `page-hero` de las 8 internas) — **footer en superficie crema** (acta §4, aprobada 27-oct) | cálido, distinto a "SaaS blanco"; ciruela ancla cierre (CTA), crema reabre al final |
| Encuesta | blanco puro | blanco + borde 1px, **sin sombra** | ninguna | foco total en la respuesta |
| Panel | wash ciruela 4% | blanco | `--sidebar` ciruela | 3 planos: bg < card < header |

**Pares de contraste sobre crema `#FFF8F2` (recalculados con la fórmula WCAG esta pasada — footer/FAQ):**

| Par | Ratio | Uso |
|---|---|---|
| texto `--text-1` ciruela #2E1E3F / crema | **14.53** ✓ | texto del footer, titulares FAQ |
| enlace `--link` #B23A2A / crema | **5.65** ✓ | enlaces del footer y del pie de FAQ (hover `--brand-coral-darker` 7.18 ✓) |
| `--text-2` #65586E / crema | **6.29** ✓ | barra legal 14px del footer |

Sobre ciruela no queda ningún token de enlace legal (`--link` = 2.57 ✗; coral vetado como texto por §1; mostaza prohibida como texto) — motivo técnico de que el footer sea crema (acta §4, aprobada). Coral `#FF5F44` sobre ciruela sigue siendo 5.08 ✓ y no se toca: sigue siendo la superficie del CTA.

**Ritmo de bandas ciruela (F9, 2026-10-28):** el sitio tiene **3 colocaciones** de banda ciruela — hero de la landing (`page.js:17`), CTA final (`page.js:420`) y `page-hero` de las 8 rutas internas. Regla que evita que dos queden adyacentes: **el `page-hero` solo abre ruta** (primer bloque bajo el navbar crema) y **las internas no llevan CTA final** — en la landing, hero y CTA quedan separados por las 8 bandas de contenido, y el cierre lo media el footer crema. Verificable: ninguna página sirve dos bandas ciruela seguidas. Si una interna llegara a montar CTA ciruela al cierre, exige banda crema intermedia antes de implementarse (motivo del registro: F9 añadió la tercera banda sin documentar el ritmo).

Por qué la encuesta va sobre blanco y el panel sobre wash: la encuesta dura 20–30 s, se responde de pie en el local, con pantalla barata y luz de vitrina → exige la máxima separación figura-fondo (blanco + texto ciruela 15.29) y solo dos planos; un fondo crema/melocoton bajaría el contraste del texto y confundiría tarjeta-página en pantallas malas, además de competir con el CTA coral. El panel es sesión analítica de 5–20 min con jerarquía de tarjetas: el wash 4% hace que el blanco "eleve" sin sombras (las sombras desaparecen con reflejos) y que las superficies `--*-surface` de alertas se lean como distintos.

**Hoja propia de la encuesta:** la zona `.zone-survey` (route group de encuesta) carga una hoja mínima propia —tokens + componentes de encuesta— y **no** importa `_panel.scss` ni `style.scss` completo. Coherente con la decisión de route groups: la encuesta nunca descarga estilos del panel ni del bundle del template.

## 5. Estados obligatorios (componentes de alcance)

| Componente | default | hover | focus-visible | active | disabled | loading |
|---|---|---|---|---|---|---|
| `.btn-primary` | bg `--action-primary` / texto `--action-primary-text` | bg `--link` / texto crema | `outline:3px solid var(--focus-ring); outline-offset:2px` (BS: `--bs-btn-focus-shadow-rgb`) | bg `--brand-coral-darker` / texto crema | bg `color-mix(in srgb, var(--action-primary) 25%, white)` / texto `--text-2`, `cursor:not-allowed` (sin opacity) | spinner `currentColor` + `aria-busy="true"`, `min-width` fijo (sin salto) |
| `.btn-ghost` | texto `--text-1`, borde `--border-strong` | bg `--surface-2` | mismo outline | bg `color-mix(plum 10%, white)` | texto `--text-3` | spinner |
| `.btn-ghost` **sobre banda oscura** (hero y CTA final ciruela) — variante que faltaba en F2 y produjo el ghost a **1.00:1** | texto `--brand-cream`, borde crema al 45 % | **invertido:** bg `--brand-cream` / texto `--brand-plum` (14.53 ✓) | outline peach + ring peach (regla de foco abajo) | — (el CTA del hero nunca se pulsa en estado activo visual) | — (no existe deshabilitado en banda oscura) | spinner `currentColor` |
| enlace | `--link` subrayado | `--brand-coral-darker` | outline sobre línea de base | — | `--text-3` | — |
| input / form-control | bg `--surface`, borde `--border` | borde `--border-strong` | borde `--focus-ring` + ring BS (triple 46,30,63) | — | bg `--surface-2`, texto `--text-3` | — |
| opción encuesta (radio como tarjeta) | borde `--border` | bg `--surface-2` | outline | **seleccionada:** borde 2px `--action-primary` + bg `--action-selected` (no solo color: check visible de `react-icons`, set `md`) | texto `--text-3` | — |
| tarjeta panel clicable | bg `--surface`, borde `--border` | `--shadow-md` + `translateY(-1px)` | outline | `translateY(0)` | — | skeleton shimmer sobre `--surface-2` |
| ítem alerta (aceptar/cerrar) | icono+texto `--warning`/`--success`/`--error` | bg `--*-surface`, texto `--*-fg` | outline | — | — | spinner en acción |

**Foco sobre banda oscura (regla F2, `a527cdd`):** en las bandas ciruela se fija `--bs-btn-focus-shadow-rgb: 255,231,217` (`--brand-peach`) sobre el contenedor de la banda, para que el anillo de Bootstrap sea visible sobre ciruela — con el default (ciruela `46,30,63`) el anillo rinde **1.97:1** y desaparece. El outline propio sigue siendo `3px solid var(--focus-ring)` con override a peach en `.zone-dark` (§2: sidebar, hero, banda CTA; el footer ya no es zona oscura).

**Foco en banda ciruela — criterio *contorno*, no cambio de color (F9, 2026-10-28):** en el `page-hero` de las internas, el estado de foco se define por el contorno: `outline: 3px solid var(--brand-cream)` con `outline-offset: 2px` sobre los enlaces del breadcrumb (`_page-hero.scss:43-47`) — ratio medido **~12:1 ✓**. Razón de la regla: el cambio de color solo (crema 75 % → 100 % sobre ciruela) rinde **1.66:1** y no se percibe como estado; el contorno es el criterio, el color es decoración del foco. El anillo de Bootstrap de la banda sigue en peach (`--bs-btn-focus-shadow-rgb: 255,231,217`), igual que hero y CTA final.

Reglas: objetivo táctil **≥44×44 px también en encuesta, sin excepción (F3)**: la encuesta se responde de pie en el mesón, con el dedo (no lapiciz), con pulso, reflejos y luz de vitrina → 44 px es el suelo precisamente bajo esas condiciones; la antigua concesión de 40 px en encuesta queda enterrada. Transiciones 150–200 ms solo de color/transform con `prefers-reduced-motion: reduce → 0.01ms`; jamás `outline:none` sin sustituto; ningún estado se comunica solo por color (badge de alerta = icono `react-icons` + texto); los campos de encuesta y botones implementan loading/empty/error/success aunque el diseño no los dibuje.

## 6. Anti-convergencia y prohibiciones

- Lo "anterior" a enterrar: teal #0e6e5c + Kumbh Sans del template de agencia. Prohibido dejar cualquier rastro teal tras la migración (grep `0e6e5c` = 0 hits).
- Prohibido: coral o mostaza como texto **sobre fondo claro** (§1). Sobre ciruela, dos excepciones registradas: la palabra display del H1 en coral (§1, F8.5) y el kicker `3 PREGUNTAS. UN QR. LISTO.` en mostaza del hero (8.45 ✓ sobre ciruela lisa, en vigor desde F2); el glow no las rompe: mostaza sobre el fondo del glow **6.1 ✓** (medido en la captura `qa-f85-verif.png`; 5.9 en el píxel más claro del fondo); ningún otro texto en estos colores; gradiente genérico índigo/púrpura; emoji como icono (usar `react-icons`, set `md`, que replica MDI; `@mdi/font` queda **fuera** por decisión de plan — F2; al quitarla el ahorro es **≈741 KB** = 338 KB CSS + 403 KB woff2, con 7.447 glifos en el paquete — **cifras del plan/dato del paquete, no medidas en el repo**; `ASSET-PIPELINE.md` no introduce ninguna otra cifra); mostaza > 5% de superficie (decorativo: subrayado de "SAY", viñetas, ilustración); sombra sobre texto; wordmark estirado (proporción real 3:1, ver `ASSET-PIPELINE.md`).
- Deuda F2 (bloquea quitar la fuente): quedan **2 reglas `content:` en Sass** que consumen la tipografía de `@mdi/font`: `_components.scss:366` (breadcrumb, `\F0142`) y `_components.scss:480` (acordeón, `\F0143`). Deben reescribirse como **SVG inline** antes de eliminar la fuente del bundle.
- Firma del producto (no genérica): coral solo como superficie viva + ciruela dominante + Bebas en mayúsculas condensadas; el flip ciruela↔crema del botón primario al hover es el gesto memorable.
