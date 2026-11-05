# Verificación F9 — Rutas internas con copy del producto (28-oct-2026)

> Revisado con `reviewer-alibaba`, `designer-alibaba` y `code-support` (Go, `second-opinion`, sin truncar).
> Copy fuente: `COPY-INTERNAS.md`. Normas: `COPY-LANDING.md`, `DESIGN-CONTRACT.md`, `EFECTOS-Y-MOTION.md`.
> **Limitación de esta pasada:** Playwright no estuvo disponible en el turno de verificación; todo se comprobó con `Invoke-WebRequest` sobre el HTML servido y lectura de fuente.

## Veredicto

| Momento | Resultado |
|---|---|
| Primera entrega (`8227771`…`7dff545`) | **no cumple** — 1 defecto crítico + 1 P0 legal + 5 altos |
| Tras correcciones (`0d8cd30`, `272f636`) | **cumple con reservas** — las reservas son datos del operador, no código |

## Qué se construyó

| Ruta | Antes | Ahora |
|---|---|---|
| `/aboutus` | "agencia de marketing digital", equipo y contadores inventados | `PREGUNTAS CORTAS, RESPUESTAS CLARAS` + 4 bloques de producto |
| `/services` | catálogo de SEO/diseño/branding | `CUATRO PIEZAS, UN SOLO QR` (encuesta, QR, canales, panel en preparación) |
| `/service-detail` | servicios de agencia | `DEL MOSTRADOR AL PANEL` — recorrido de una encuesta |
| `/contactus` | formulario **deshabilitado** que prometía respuesta en 24 h | `ESCRÍBENOS UN CORREO`, canal por correo y aviso honesto mientras no esté configurado |
| `/terms` | contrato de agencia (pagos, propiedad intelectual) | términos de uso del producto + aviso de revisión legal |
| `/privacy` | declaraba recolectar nombre, correo y teléfono (formulario que ya no existe) | qué datos se guardan de verdad + estado actual del producto |

Además: componente compartido `PageHero` (banda ciruela + `--glow-hero` + display Bebas) en las **8** rutas internas, `package.json` → `scan-say-done`, y **9 componentes huérfanos** del template borrados.

## Los defectos que aparecieron (y no eran cosméticos)

| # | Defecto | Sev | Causa | Fix |
|---|---|---|---|---|
| 1 | **El canal de contacto nunca habría funcionado.** `env()` usaba acceso computado (`process.env[key]`); Next solo sustituye `NEXT_PUBLIC_*` con acceso **estático**. Al fijar la variable: SSR `true` / cliente `false` → *hydration mismatch* y `mailto` inalcanzable | **Critical** | `data/site.js:6` | acceso estático; probado metiendo `hola@ejemplo.cl` en el bundle (**9 coincidencias**) y luego build limpio (**0**) |
| 2 | `/privacy` afirmaba una retención no confirmada ("mientras la encuesta esté activa") que se contradecía con su propia frase siguiente | **P0 legal** | `privacy/page.jsx:54` | línea eliminada |
| 3 | `/privacy` declaraba recolección en presente aunque el producto no está en línea | High | `privacy/page.jsx` | frase de estado antes de cualquier enumeración |
| 4 | Los derechos y las dudas se remitían a un correo inexistente | High | `privacy`, `terms` | aviso de canal + canal pendiente declarado |
| 5 | `metadata` de `/contactus` prometía asunto y mensaje prellenados sobre un canal vacío | High | `contactus/layout.js:3` | descripción neutra |
| 6 | Jerarquía de headings `h1 → h5` (salto de 3 niveles) en las 6 rutas | Med | páginas internas | `h2`/`h3` semánticos con clases `.h5`/`.h6` para el tamaño |
| 7 | Foco del `page-hero` cambiaba **solo color** (1.66:1) | Med | `_page-hero.scss:39-42` | `outline: 3px solid var(--brand-cream)` → ~12:1 |
| 8 | Separador del breadcrumb a 3.25:1 y `aria-label` en inglés | Med | `_page-hero.scss:28`, `page-hero.jsx:8` | crema plena (~12:1) y `Ruta de navegación` |
| 9 | Dos `title` pasaban de 60 por la plantilla `%s \| Scan-Say-Done` | Med | `aboutus`, `services` | recortados; **9/9 títulos ≤60** |

## Estado verificado

| Check | Resultado |
|---|---|
| Build | exit 0 |
| Rutas | **9/9 → 200** |
| `check:tokens` · `check:placeholders` | OK · 0 |
| `<img>` en el sitio | **0** — sin fotos de stock ni ilustraciones del template |
| `mailto:` en el sitio | **0** (correcto: no hay correo configurado) |
| Copy de agencia (`agencia\|marketing digital\|branding\|SEO`) | **0** en `src/` |
| Promesas prohibidas (`24 horas`, `sin tarjeta`, `gratis`, `NPS`, `CSAT`, `tiempo real`) | **0** |
| `[confirmar` renderizado | **0** |
| Títulos con plantilla | 9/9 ≤60 |
| `page-hero` | 8/8 rutas internas |

## Datos que bloquean la publicación (no los puede poner un agente)

| # | Dato | Dónde iría |
|---|---|---|
| 1 | **Correo de contacto** — bloqueo absoluto del canal | `NEXT_PUBLIC_CONTACT_EMAIL` (`.env.local`, no se commitea) |
| 2 | Razón social, RUT y domicilio | `NEXT_PUBLIC_LEGAL_NAME` + `/terms` |
| 3 | Jurisdicción y norma vigente | `/terms`, `/privacy` |
| 4 | Plazo de retención de respuestas y quién las borra | `/privacy` |
| 5 | Estado real del piloto (¿hay usuarios? ¿se cobra?) | `/aboutus`, `/services`, `/service-detail` |
| 6 | Qué convierte una opinión en aviso | `/service-detail` |
| 7 | `noindex` por ruta (hoy lo tapa el global) | `/services`, `/service-detail` |

## Decisión abierta que dejó la segunda opinión

El aviso **"Este texto está en revisión legal antes de la publicación"** es honesto, pero la revisión de Go advierte que un documento que se autodescalifica no obliga a nadie y, en un SaaS B2B, resta credibilidad. Se mantiene **a propósito**: sin razón social ni jurisdicción, un término que parezca definitivo sería peor. Se retira cuando existan los datos 2 y 3.

## Lo que sigue abierto (no bloquea, sí mejora)

1. `/pricing` y `/faqs` ya comparten `PageHero`, pero su contenido sigue siendo mínimo: les falta el copy completo de producto cuando existan precios.
2. `public/images/` conserva ~23 imágenes del template sin uso (10,7 MB). No se borraron para no romper referencias externas.
3. 5 dependencias sin uso (`swiper`, `yet-another-react-lightbox`, `tiny-slider-react`, `react-type-animation`) — retirarlas exige pasar build y probar.
4. `robots: noindex` global activo en `layout.js`: **quitarlo es el último paso antes de publicar**.
5. Sigue sin existir plano de las rutas internas (anotado en `wireframes/INDEX.md`).
