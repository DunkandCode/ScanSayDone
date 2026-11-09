# Guía de contribución — frontend ScanSayDone

> actualizado: 2026-11-09 · tipo: guía de incorporación (mapa operativo, no norma)
> Precedencia si algo choca: `CANON.md` manda sobre esta guía; los planos de página mandan sobre geometría y copy de su página; `ESTADO-2026-11-06.md` manda sobre el estado real de la superficie. Esta guía es el mapa para que no te pierdas entre esos tres.

Convención de rutas en este documento: `src/…`, `tests/…`, `public/…`, `assets/…`, `package.json`, `playwright.config.ts`, `vitest.config.ts` viven bajo `scansaydone-front/`. Las rutas `docs/…` viven en la raíz del repo. Las referencias `archivo:línea` las puedes abrir tal cual.

---

## 0. Arranca aquí (5 minutos)

1. Lee `docs/frontend/CANON.md` — stack cerrado, paleta aprobada, reglas de contenido, gates. Es corto y manda.
2. Lee esta guía completa. Es el mapa.
3. Abre el plano de la ruta que vas a tocar:
   - Landing banda por banda → `docs/frontend/planos/L1-HERO-2026-11-05.md` … `L6-FAQ-2026-11-06.md`, `BANDAS-2-Y-9-Y-EXTRAS-2026-11-06.md`, `MEJORA-VISUAL-2026-11-06.md`, `PASE-VISUAL-2-2026-11-06.md`, `NAVBAR-Y-FOOTER-2026-11-06.md`
   - Login → `docs/frontend/planos/LOGIN-2026-11-06.md`
   - Panel → `docs/frontend/planos/PANEL-2026-11-06.md`
4. Mira el estado real: `docs/frontend/ESTADO-2026-11-06.md` (qué existe, qué está vacío, qué espera confirmación).
5. Entra al código: `src/app/` (rutas y layouts) y `src/components/` (todo lo demás).
6. Corre los comandos de la §10 antes de tocar nada, para salir de una base verde.

Si un hecho de esta guía no coincide con el código, gana el código: corrige la guía y anota la fecha arriba.

---

## 1. Qué es esto y dónde está el límite

Frontend de ScanSayDone: encuestas de satisfacción por QR para restaurantes, cafés y comercios (`CANON §1`).

- `scansaydone-front/` — esta app. Tu dominio.
- `scansaydone-back/` — FastAPI, otro equipo. **No se toca** (`CANON §1`).
- `docs/` — documentación del equipo; la zona viva del frontend es `docs/frontend/` (`CANON §8`).

Stack cerrado: Next.js 16.4.3 · React 19.3 · TypeScript 5 · Tailwind 4 CSS-first (`package.json:17-19,35-36`, `CANON §2`). Prohibido: Bootstrap, Sass, JS sin tipos, librerías de gráficos, jQuery. **No hay gráficos de librería: los dos gráficos del panel y del preview son SVG hechos a mano — así se quedan.**

Etapa actual: **solo frontend, cero API** (`CANON §3`). Nada de fetch, nada de sesión, nada de redirecciones de login. Los datos de demo viven aislados (§6).

---

## 2. Panorama de rutas

| Ruta | Qué es | Estado |
|---|---|---|
| `/` | Landing de marketing (8 bandas) | Real, implementada banda a banda |
| `/entrar` | Pantalla de acceso (demo) | Real, sin autenticación |
| `/panel` | Panel de ejemplo con datos inventados | Real, datos estáticos |
| `/contactus` | Contacto | Real pero **incompleta**: canal pendiente, sin correo inventado (`src/app/(marketing)/contactus/page.tsx:7-9`; `ESTADO-2026-11-06.md:21`, regla C-51) |
| `/aboutus` `/faqs` `/pricing` `/privacy` `/terms` `/services` | Marcadores vacíos | 3 líneas con un `<h1>`: `aboutus/page.tsx:2`, `faqs/page.tsx:2`, `pricing/page.tsx:2`, `privacy/page.tsx:2`, `services/page.tsx:2`, `terms/page.tsx:2` |
| `/e/[code]` | Encuesta por código (grupo `(survey)`) | Marcador vacío: `<h1>Encuesta</h1>` (`src/app/(survey)/e/[code]/page.tsx:2`) |

**Regla de oro:** a las rutas marcador **no se les echa links** desde chrome, landing ni panel. Que existan como archivo no las hace navegables. El censo de links vigente está en `docs/frontend/planos/NAVBAR-Y-FOOTER-2026-11-06.md` y `docs/frontend/ESTADO-2026-11-06.md §1`.

Robots global: `index: false, follow: false` en el layout raíz (`src/app/layout.tsx:21-24`) y también en el layout del panel (`src/app/(panel)/layout.tsx:7-10`). Es decisión registrada; **no la voltees** sin decisión nueva con fecha.

---

## 3. Mapa de `/` — landing

### 3.1 Jerarquía de layouts

```
src/app/layout.tsx                 raíz: lang="es-CL" (:30), fuentes next/font (:5-15), robots (:21-24)
└─ src/app/(marketing)/layout.tsx  chrome: SiteHeader → <main id="contenido" pt-[76px]> → SiteFooter (:10-22)
   └─ src/app/(marketing)/page.tsx composición de las 8 bandas (:10-23)
```

`MAIN_ID = "contenido"` sale de `src/components/chrome/chrome-ids.ts:1` (ahí también `SKIP_LINK_ID`). El `pt-[76px]` compensa la altura de la barra fija (`(marketing)/layout.tsx:16`).

### 3.2 Componentes, orden y quién es cliente

| Orden | Componente | Archivo | Server/Client |
|---|---|---|---|
| 1 | Hero (con SurveyCard adentro) | `src/components/marketing/hero.tsx` | server |
| — | SurveyCard (isla: escala 0–10) | `src/components/marketing/survey-card.tsx` | **client** (`:1`) |
| 2 | TrustStrip | `src/components/marketing/trust-strip.tsx` | server |
| 3 | HowItWorks | `src/components/marketing/how-it-works.tsx` | server |
| 4 | Channels | `src/components/marketing/channels.tsx` | server |
| 5 | Applications | `src/components/marketing/applications.tsx` | server |
| 6 | PanelPreview | `src/components/marketing/panel-preview.tsx` | server |
| 7 | Faqs (acordeón) | `src/components/marketing/faqs.tsx` | **client** (`:1`) |
| 8 | CtaFinal | `src/components/marketing/cta-final.tsx` | server |

Chrome: `site-header.tsx` y `nav-drawer.tsx` son client (`:1` en ambos, por la interacción del drawer); `site-footer.tsx` es server. Todo lo que no diga `"use client"` se renderiza en el servidor.

### 3.3 Anclas de la landing (destinos reales verificados)

| Ancla | Vive en |
|---|---|
| `#contenido` | `(marketing)/layout.tsx:14` — destino del skip-link, que es el primer focusable (`chrome/site-header.tsx:81-82`; test en `site-header.test.tsx:42-50`) |
| `#encuesta-demo` | `marketing/survey-card.tsx:61` — destino del CTA del hero (`hero.tsx:70`) |
| `#como-funciona` | `how-it-works.tsx:27` |
| `#canales` | `channels.tsx:109` |
| `#aplicaciones` | `applications.tsx:35` |
| `#panel` | `panel-preview.tsx:98` |
| `#faq` | `faqs.tsx:79` |

Las bandas con ancla llevan `scroll-mt-[92px]` para no quedar tapadas por la barra (`survey-card.tsx:61`, `panel-preview.tsx:101`).

**Patrón de link del chrome:** en `/` usa ancla relativa (`#faq`); en cualquier otra página usa ruta+ancla (`/#faq`) — ver `site-header.tsx:29-33` y `nav-drawer.tsx:16-20`. El footer apunta a `/#panel` (`site-footer.tsx:85`): es **la banda 6 de la landing**, no la ruta `/panel`. Si agregas una ancla nueva, replica el patrón condicional; si lo rompes, los tests de chrome te lo cobran (`site-header.test.tsx`, `site-footer.test.tsx`).

### 3.4 La integración PanelPreview ↔ panel-data

`panel-preview.tsx` (banda 6) **importa los canales del dataset canónico del panel**: `panel-preview.tsx:1` → `import { channels } from "@/components/panel/panel-data"`, y los pinta con `channels.slice(0, 3)` (`:329`). Así, si cambia un canal en `panel-data.ts`, la banda 6 se actualiza sola.

Ahora la parte honesta, verificada en el mismo archivo:

- La **distribución 0–10 de la banda 6 es una copia local** (`demoData`, `panel-preview.tsx:17-29`) con los mismos valores que `panel-data.ts:9-21`, pero sin importarlos. Cambiar `distribution` en `panel-data.ts` **no** cambia las barras de la banda 6.
- La **serie de 30 días de la banda 6 es propia** (`lineData`, `panel-preview.tsx:40-43`) y sus valores no coinciden con `dailySeries` del panel (`panel-data.ts:33-64`). Hoy conviven como dos series de demo distintas; ningún plano exige igualarlas.

Consecuencia práctica (§11 receta 5): tocar `channels` es de un solo punto; tocar la distribución obliga a sincronizar las dos copias y los KPIs derivados. La tercera copia no está permitida: **no crees otro dataset**.

### 3.5 Reglas del hero (contrato cerrado por implementación — no lo "mejores")

- **Imagen a sangre solo en escritorio**: `<picture>` con `media="(min-width: 992px)"` y WebP `/img/fondos/hero-escena.webp` (`hero.tsx:10-25`); decorativa (`alt=""`, `aria-hidden`, `:19-20`). En móvil no se pide la imagen (medido en la tanda: `ESTADO-2026-11-06.md:124`). Fuente original: `assets/fuentes-imagenes/fondos/hero-escena-v4.png`, 1536×1024 (medido sobre el PNG).
- **Halo radial local, no placa opaca**: el copy se sostiene con un degradado radial `closest-side`, `color-mix` de `var(--color-background-page)` al 92 % hasta el 85 % del radio y pluma a transparente, con `inset: -8rem` (`hero.tsx:38-46`). La placa opaca anterior se leía como caja separada y fue sustituida (acta: `ESTADO-2026-11-06.md:126`, plan: `PASE-VISUAL-2 §17`).
- **CTA cuadrado**: `rounded-none`, `bg-surface-dark` con `text-surface-default`, borde `border-text-primary`, hover/active por tokens y transición `motion-safe` (`hero.tsx:71`). No le devuelvas el radio ni el relleno coral.
- **Declaración visible**: la placa "La imagen de fondo es una ilustración generada. No muestra un local real." vive en `hero.tsx:27-31`. Si cambias la imagen, la declaración se queda.
- **Contraste**: la evidencia actual del texto secundario sobre el halo es un **cálculo conservador de peor caso (≈4,97:1), aritmética — no muestreo píxel a píxel**, con margen AA estrecho registrado como residual informativo por el reviewer (`ESTADO-2026-11-06.md:126`). Si aclaras el halo, mueves el copy fuera de la meseta o cambias el color del texto, **vuelves a medir**; no cites el 4,97 como si fuera lectura de píxel.

---

## 4. Mapa de `/entrar` — login

```
src/app/(auth)/entrar/page.tsx     página sola, sin layout de grupo: (auth)/ NO tiene layout.tsx
├─ LoginCard    src/components/auth/login-card.tsx    client (:1)
└─ LoginVisual  src/components/auth/login-visual.tsx  server; decorativo
```

- La página trae su propio `<main>` con gradiente **vía variables** (`var(--color-background-page)` → `var(--color-surface-elevated)`, `entrar/page.tsx:9-10`) y grilla 2 columnas a partir de `lg` (`:13`).
- **Chrome-free por contrato**: `tests/a11y/entrar-verify.spec.ts:32-36` verifica que `header` y `footer` cuentan 0. No le agregues SiteHeader/SiteFooter ni al archivo ni vía layout.
- `LoginCard`: tarjeta de 430px (`login-card.tsx:44`), chip `DEMO` + confesión "Todavía no se abre ninguna sesión." (`:56-63`).
- `LoginVisual`: escena `/img/fondos/login-escena.webp` con velo de gradiente por `color-mix` de tokens (`login-visual.tsx:18-26`), oculta bajo `lg` (`:5`).

### Qué se puede modificar sin romper el contrato

Toda la validación es **local y de presencia**: usuario y contraseña solo se chequean vacíos (`login-card.tsx:23-28`); el submit termina en el mensaje `"Demostración: no se ha iniciado ninguna sesión."` (`login-card.tsx:40`). No hay sesión, no hay cookie, no hay redirect. Si alguien te pide "conectar el login", no es tarea de esta etapa (`CANON §3`, último puesto del orden: integración backend): se diseña con plano nuevo, no se agrega un fetch en el componente.

El toggle "Ver/Ocultar" contraseña usa `aria-pressed` (`:135-143`); los errores van con `aria-invalid` + `aria-describedby` + región `aria-live` (`:95-107`). Si tocas el formulario, conserva esos tres y el foco al primer campo con error (`:32-36`).

---

## 5. Mapa de `/panel` — panel de ejemplo

```
src/app/(panel)/layout.tsx        chrome del panel + metadata robots propia (:4-11)
└─ src/app/(panel)/panel/page.tsx  "use client" (:1) — toda la página es cliente
   ├─ EvolutionChart      components/panel/evolution-chart.tsx      (dailySeries, totalReviews — :9)
   ├─ DistributionChart   components/panel/distribution-chart.tsx   (distribution, maxCount — :12)
   ├─ ChannelTable        components/panel/channel-table.tsx        (channels, totalReviews — :6)
   └─ ResponseList        components/panel/response-list.tsx        (lastResponses — :6)
```

### 5.1 El shell (en `layout.tsx`)

| Región | Cuándo | Cotas |
|---|---|---|
| Topbar | ≤992 | 56px, sticky, logo (`:17-27`) |
| Nav horizontal | ≤992 | 44px, sticky bajo la topbar, `overflow-x-auto` con scrollbar oculta (`:30-40`) |
| Sidebar | ≥993 | 240px fija, gradiente de marca, logo, nav, pie de declaración (`:43-76`) |
| Main | siempre | `id="panel-main"`, columna `max-w-[1056px]` (`:79-92`) |

Ojo con el breakpoint: el panel corta en `min-[993px]` (arbitrario de Tailwind, `layout.tsx:15`), **no** en `lg:`. `lg` = 992px, así que 993 es el primer píxel sin topbar. Si tocas el shell, respeta el 993 o documenta el cambio en `PANEL-2026-11-06.md`.

- Ítems "Reseñas", "Códigos QR", "Ajustes": **disabled** con `role="link" aria-disabled="true"` y `title` explicativo (`:37-39`, `:65-67`). Son futuro, no navegación: no les pongas `href` inventado.
- Declaración en el pie de la barra: "Sesión de demostración. No hay cuenta real detrás." (`:72-74`).

### 5.2 La página (en `panel/page.tsx`)

- Estado local `showExample` (`:56`) movido por un `ToggleSwitch` real (`role="switch"`, `aria-checked`, `:22-53`) — "Ver con datos de ejemplo". Apagado = estado vacío honesto; **el estado vacío no es una bug, es la declaración de que no hay datos reales** (`:75-79` con las dos frases exactas de cada estado).
- Encabezado B1: `h1` "Panel de ejemplo" + chip `DEMO` (`:65-70`). Cero sombras en todo el panel (acta de origen del archivo `:4-9`; el spec lo verifica en `tests/a11y/panel-verify.spec.ts:41-52`).
- El coral `interactive-primary` aparece **una sola vez** (bloque B3, comentario de contrato `:5-8`).

### 5.3 Los handlers raros de la barra (no los toques sin leer §12.1)

`SidebarNavLink` y `PanelNavLink` definen ramas por defecto con `onMouseEnter`/`onMouseLeave` (`layout.tsx:148-155`, `:211-218`) dentro de un **server component sin `"use client"`**. Hoy esas ramas no se renderizan: todos los ítems navegables del nav son `active` o `disabled` (`:36-39`, `:64-67`). Son código latente: si agregas un ítem habilitado o tocas el archivo, el build es el que te avisa (§10 y §12.1).

---

## 6. Estado y datos — quién es dueño de qué

**No hay backend, no hay persistencia, no hay solicitudes de red en las tres rutas.** Todo el estado es local de isla cliente:

| Estado | Vive en | Naturaleza |
|---|---|---|
| Nota seleccionada + aviso demo | `survey-card.tsx:8-9` | useState local; sin API — el aviso dice "Demostración: todavía no guardamos respuestas." (`:123-131`) |
| Acordeón FAQ | `faqs.tsx` | estado local del acordeón |
| Usuario/contraseña/ver/errores/mensaje | `login-card.tsx:8-12` | useState local; validación de presencia (`:23-28`); sin sesión (`:40`) |
| `showExample` | `panel/page.tsx:56` | useState local; conmuta datos ↔ vacío |
| Drawer abierto + foco | `site-header.tsx` / `nav-drawer.tsx` | estado de UI móvil; `inert` sobre contenido/skip-link mientras abierto (`site-header.tsx:35-50`) |

**Dataset canónico: `src/components/panel/panel-data.ts`** — único para `/panel` y (vía canales) para la banda 6:

- `distribution` 0–10 (`:9-21`), `channels` (`:24-30`), `dailySeries` 30 días (`:33-64`), `lastResponses` (`:69-111`).
- Derivados ya calculados: `totalReviews` 486, `totalPoints` 4131, `meanRating` 8.5, `highRatings` 377, `maxCount` 150 (`:114-124`).
- Cifras: Σ486 respuestas · 4131 puntos · media 8,5 exacta · 377 en 8–10. Origen: conteos **ficticios autoconsistentes**, declarados en el header del archivo (`:1-6`); el contrato de copy es `PANEL-2026-11-06.md §3`.

Reglas de datos:

1. **Es demo. No lo presentes como dato real** de cliente o negocio, en copy, alt, aria-label o docs. Las declaraciones existentes (chip DEMO, figcaption `panel-preview.tsx:344-346`, pie del sidebar `:72-74`) se conservan.
2. Cambiar el dataset → cambiar `panel-data.ts`, no una copia (§3.4: la distribución de la banda 6 es copia local que hay que sincronizar a mano).
3. No introduces un segundo `panel-data`. Los consumidores del panel ya importan todas sus piezas (§5 diagrama).
4. `lastResponses` mantiene el contrato D4 (≤72 caracteres, ≤12 palabras, sin nombres/mesas/cifras, ≥2 críticas, 1 sin texto — comentado en `:66-68`) si editas las citas.

---

## 7. Sistema visual: tokens, tipos, foco, imágenes

### 7.1 Tokens de color (`src/app/globals.css`, bloque `@theme` `:5-21`)

| Token CSS | Clase Tailwind | HEX | Uso típico |
|---|---|---|---|
| `--color-background-page` | `bg-background-page` | `#F7E5C8` | fondo de página (body usa el token, `globals.css:86`) |
| `--color-surface-default` | `bg-surface-default` | `#FFFFFF` | tarjetas |
| `--color-surface-elevated` | `bg-surface-elevated` | `#F0D8BD` | chip DEMO, segunda superficie |
| `--color-interactive-primary` | `bg-interactive-primary` | `#FC5A41` | acción principal (submit del login `login-card.tsx:157`; nota seleccionada `survey-card.tsx:103`) |
| `--color-interactive-hover` / `--color-interactive-pressed` | `hover:bg-interactive-hover` / `active:bg-interactive-pressed` | `#FD6E57` / `#E84A33` | estados del botón coral |
| `--color-text-primary` | `text-text-primary` | `#1A181B` | texto, títulos, bordes duros |
| `--color-text-secondary` | `text-text-secondary` | `#5A5555` | texto secundario |
| `--color-surface-dark` | `bg-surface-dark` | `#1A181B` | CTA del hero (`hero.tsx:71`) |
| `--color-on-dark` / `--color-on-dark-secondary` | `text-on-dark` / … | `#F7E5C8` / `#C9B6A6` | texto sobre oscuro |
| `--color-border-mid` | `border-border-mid` | `#8A6F55` | bordes medios, acento del nav del panel |
| `--color-border-subtle` | `border-border-subtle` | `#D9C0A0` | filetes |
| `--color-success-text` / `--color-warning-text` / `--color-error-text` | `text-success-text` etc. | `#12603A` / `#6F4700` / `#A82E39` | mensajes (error en login: `login-card.tsx:98,104`) |
| `--color-disabled-fill` | `bg-disabled-fill` | `#E6D6C2` | botón deshabilitado (`survey-card.tsx:117`) |

Reglas medidas de la paleta (`CANON §4:44-49`): la etiqueta del botón coral es siempre `#1A181B` (blanco sobre coral mide 3,14 — falla); el coral nunca como texto sobre claro (2,55 — falla); las tarjetas se separan con borde y color, **no con sombra**; un estado nunca se marca solo por color (va con texto o icono).

**Hex nuevo: no.** Se nace de los tokens de arriba. Los roles ya definidos suman 17 tokens (`:5-21`: 6 base y 11 derivados); su firma opera en `docs/frontend/decisiones/DECISIONES-2026-11-05.md` (`CANON §11` pendiente 1). Si crees que necesitas un color más, es decisión de operador, no un hex suelto en un `style`.

Desviación conocida (para que no te asustes ni la amplíes): `src/app/(panel)/layout.tsx` usa **hex literales en estilos inline** en gradientes y bordes del sidebar (p. ej. `:48`, `:85`, `:119-120`, `:149-150`) con valores exactamente iguales a los tokens. Reutiliza los valores existentes si tocas esas líneas; no inventes hex nuevos encima de los que hay, y no afirmes en ningún sitio que "todo es `var()`" — en el panel, el inline todavía no.

### 7.2 Tipografía

- `--font-ui` = Montserrat (400/500/600) → clase `font-ui` para interfaz y cuerpo.
- `--font-display` = Bebas Neue (400) → clase `font-display` para títulos grandes.
- Ambas vía `next/font/google`, subset latino, con variables CSS en el `<html>` (`src/app/layout.tsx:5-15,31`; mapeo en `globals.css:45-46`).
- Regla `CANON §5`: **Bebas nunca en cuerpo, botones ni tablas.** Títulos del landing/login/panel usan la escala de cada plano (p. ej. hero `text-marketing-hero` = `clamp(2.5rem, 5vw, 4.5rem)` en `globals.css:40`).

### 7.3 Foco visible — 3px adentro

Presupuesto del sistema: outline **3px**, offset **−3px** (inset). Dos mecanismos conviven:

1. Utilidades en clases: `focus-visible:outline-[3px] focus-visible:outline-offset-[-3px] focus-visible:outline-text-primary` — el patrón default en islas y targets (`(marketing)/layout.tsx:16`, `survey-card.tsx:61`, `panel-preview.tsx:101`, panel `layout.tsx:33,82,111,174`).
2. Regla CSS para superficies oscuras: `--marketing-focus-outline: 3px solid var(--color-on-dark)` con offset −3 (`globals.css:52-53`), aplicado a `.marketing-hero-cta:focus-visible` (`:60-63`) y ajustado en `.survey-card-submit:focus-visible` (`:65-69`).

**Ningún elemento interactivo puede perder el anillo.** Si el fondo es oscuro, replica el mecanismo 2 (outline en `--color-on-dark`); en claro, el mecanismo 1.

### 7.4 Sombras — permiso cerrado a 2 nodos

`--elev-float: 0 10px 24px -12px rgb(26 24 27 / 0.22)` (`globals.css:51`, clase `:56-58`). Está autorizada en **exactamente dos nodos del landing**: la tarjeta de la encuesta (`survey-card.tsx:61`) y el marco del preview (`panel-preview.tsx:134` — grep `elev-float`: solo esos dos usos en `src/`). Todo lo demás: cero sombra. `/entrar` y `/panel` tienen presupuesto **cero** y los specs lo vigilan contando nodos con `box-shadow` distinto de `none` (`entrar-verify.spec.ts:46-57`; `panel-verify.spec.ts:41-52` en 1440, `:143-154` en 992, `:191-202` en 375). El acta de la norma está en `PASE-VISUAL-2 §2.2`.

### 7.5 Movimiento

Revelados por scroll = CSS puro, scroll-driven animations, gated doble: `@supports (animation-timeline: view())` **y** `@media (prefers-reduced-motion: no-preference)` (`globals.css:72-83`, clases `.reveal*`). Las transiciones de color del hero/CTA llevan prefijo `motion-safe:` (`hero.tsx:71`). **Nada de librerías de animación** (stack cerrado, `CANON §2`) y ningún movimiento nuevo sin su puerta de `prefers-reduced-motion`.

### 7.6 Imágenes y assets

- **Servido**: WebP en `public/img/` — `fondos/hero-escena.webp`, `fondos/login-escena.webp`, `fondos/banda-9-escena.webp`, `ilustraciones/i1-i3.webp`, `marca/lockup-nav.png`, `marca/logo-dunk.png` (inventario verificado en `public/img/`).
- **Preservado, no servido**: los PNG originales en `scansaydone-front/assets/fuentes-imagenes/` (incluye `hero-escena-v4.png` 1536×1024, variantes v2, fondo login, escena banda 9, ilustraciones i1–i3). Ahí vive la fuente reproducible; el repo sirve la conversión. Pipeline nuevo: original PNG → `assets/fuentes-imagenes/<categoría>/`; conversión WebP → `public/img/<categoría>/`; referenciar la WebP.
- **Toda imagen generada o decorativa lleva declaración o vaciamiento**: `alt=""` + `aria-hidden` si es decorativa (hero `hero.tsx:19-20`; login-visual `:11-12`); placa o figcaption de "ilustración generada / no es un local real" si simula fotografía (`hero.tsx:27-31`; `panel-preview.tsx:344-346`; franja DEMO en cualquier captura del panel — `CANON §6:70`).
- **Prohibido** (`CANON §6:67-69`): prueba social inventada (testimonios, logos de clientes, cifras, premios), QR legible si no funciona (si es decorativo, se declara — ver plano `L4-CANALES`), fotos de personas no autorizadas. Nada de marcas o logos de terceros.

### 7.7 Contenedores del marketing

`--container-mkt-sm` 540 · `md` 720 · `lg` 960 · `xl` 1140 · `2xl` 1320 (`globals.css:32-36`). Cada banda usa el suyo según su plano (banda 6 en `max-w-mkt-*` progresivo: `panel-preview.tsx:112`; FAQs 960 según `L6-FAQ`). No inventes un ancho suelto si uno de estos sirve.

---

## 8. Responsive — tres shells, un set de breakpoints

Breakpoints: `xs` 375 · `sm` 576 · `md` 768 · `lg` 992 · `xl` 1200 · `2xl` 1400 (`globals.css:24-29`, override de los defaults de Tailwind según `PLANOS §1.1`).

| | Landing `/` | Login `/entrar` | Panel `/panel` |
|---|---|---|---|
| Móvil (<768/992) | 1 columna, sin escena del hero, escala `grid-cols-5` → `xs:grid-cols-6` (`survey-card.tsx:84`) | 1 columna con padding, sin visual (`entrar/page.tsx:7,13`) | topbar 56 + nav 44 scrollable (`(panel)/layout.tsx:17-40`) |
| `lg` ≥992 | escena a sangre del hero (`hero.tsx:10`), 2 columnas de login (`entrar/page.tsx:13`), banda 6 ensancha | columna derecha LoginVisual a sangre | **todavía** shell móvil |
| corte del panel: `min-[993px]` | — | — | sidebar 240 + topbar/nav ocultos (`(panel)/layout.tsx:15,45`) |
| `xl` ≥1200 | hero en fila: texto a la izquierda, SurveyCard a la derecha (`hero.tsx:35-36,94`) | — | banda 6 a su marco xxl según plano L3 |

Verificación visual mínima que corre el harness: axe en viewport 1440×900 y 375×812 (`playwright.config.ts:30-39`) + las capturas por ancho que reporta ESTADO. Las cotas por reflujo de cada banda están en su plano (`planos/PLANOS-2026-11-05.md §1` y planos de banda), no aquí.

---

## 9. Checklist de accesibilidad (por cada vista que toques)

1. **Encabezados**: un `h1` por página; las bandas usan `h2`, sub-secciones `h3`, sin saltos (`hero.tsx:52` h1 con `aria-labelledby` en la section `:7`; `panel-preview.tsx:119-124,193,264,327`; `panel/page.tsx:65`).
2. **Links semánticos**: navegación real solo con `<Link>`/`<a href>`; lo que no tiene destino es `role="link" aria-disabled="true"` con `title` (`(panel)/layout.tsx:130-139`), nunca un `href` inventado.
3. **Teclado**: la escala 0–10 es `radiogroup` con flechas/Home/End y roving tabindex (`survey-card.tsx:12-52`); los toggles son `role="switch" aria-checked` (`panel/page.tsx:31-33`); el "Ver" contraseña es `aria-pressed` (`login-card.tsx:138`). Conserva estos roles al editar; sus tests están en `survey-card.test.tsx`.
4. **Foco visible**: outline 3/−3 en todo lo interactivo (§7.3); skip-link primero (`site-header.tsx:81-82`, test `site-header.test.tsx:42-50`).
5. **Contraste**: AA 4.5:1 normal, 3:1 grande y UI; las reglas medidas de la paleta (§7.1) ya tumban los dos errores típicos (etiqueta blanca sobre coral, texto coral sobre claro). Hero: peor caso 4,97 calculado, no muestreado (§3.5).
6. **Estados**: doble canal (texto/icono además del color) — `CANON §4:49`; ejemplos: submit disabled con cursor+tono (`survey-card.tsx:117`), mensajes de error con `aria-invalid`/`aria-live` (`login-card.tsx:95-107,163-165`).
7. **Reduced motion**: todo movimiento nuevo, bajo `prefers-reduced-motion` / `motion-safe` (§7.5).
8. **Sin overflow horizontal** en 375/768/992/1280/1440 — la batería de ESTADO lo midió en la tanda del panel/hero; re-verifica si tocas anchos.
9. **Imágenes**: decorativas `alt=""`+`aria-hidden`; generadas con declaración visible (§7.6); gráficos SVG con `role="img"` + `aria-label` **y** tabla accesible de datos (línea `panel-preview.tsx:195-200`, barras `:265-318`; en el panel los charts llevan su propio aria-label).
10. **Tests**: cada isla tiene su `.test.tsx` junto al componente (12 archivos vitest en `src/`; patrón `vitest.config.ts:15`) y las vistas tienen su spec axe en `tests/a11y/`. Vista nueva sin test = revisión no aprueba (`CANON §9`).

---

## 10. Validación — comandos exactos

Desde `scansaydone-front/`, PowerShell (el token `&&` no existe aquí; usa `;` o líneas separadas). Gate del sistema: sin salida pegada no hay PASS (`CANON §9:105`).

```powershell
npm test              # vitest run — suites .test.tsx en jsdom (vitest.config.ts:12-17)
npm run build         # next build
npm run lint          # eslint
npx tsc --noEmit      # tipos
```

### A11y — la verdad actual (WIP, no lo finjas estable)

El harness está a medio reconciliar: **`playwright.config.ts` (cambio sin commitear) levantó su propio servidor en `127.0.0.1:3120` con `reuseExistingServer: false`** (`:24-29`), pero los specs commiteados mantienen fallbacks viejos por archivo: `tests/a11y/panel-verify.spec.ts:4` → `localhost:3170` y `tests/a11y/entrar-verify.spec.ts:4` → `localhost:3155`. Resultado: **`npm run test:a11y` pelado falla ~10 tests por conexión rechazada** (constancia en `ESTADO-2026-11-06.md:124`); no es un fallo de la vista.

Invocación correcta hoy (fija la variable para los specs que la leen, `A11Y_BASE_URL`):

```powershell
$env:A11Y_BASE_URL="http://127.0.0.1:3120"; npm run test:a11y
```

`pretest:a11y` ya corre `next build` solo (`package.json:11`); Playwright enciende `next start -p 3120 -H 127.0.0.1`, espera y lo apaga al terminar (comentario y config en `playwright.config.ts:21-29`). La corrida documentada con esta forma: **12 passed · 0 violaciones axe · exit 0**, puerto cerrado después — registrada por el orquestador en la tanda del halo (`ESTADO-2026-11-06.md:126`); no te la atribuyas sin ejecutarla tú. `tests/a11y/landing.spec.ts` usa `page.goto('/')` (`:7`) y sí hereda el baseURL del config; los otros dos spec se pasan por su env.

Mientras no se reconcilen specs↔config, **no presentes la forma pelada como verde**, y **no "arregles" los puertos de los specs como parte de otra tarea**: el gestor de servidores (`servers:list` / `servers:stop` en `package.json:13-14`, `scripts/`, `README.md`, `playwright.config.ts`, `docs/operaciones/`) es **WIP sin commitear de otra tarea del operador** — confirmado en git status y acta (`ESTADO-2026-11-06.md:175`). `servers:list`/`servers:stop` **no son API estable de contribución todavía**: trátalos como borrador.

### Lighthouse

**No se ha ejecutado nunca en este proyecto** (`ESTADO-2026-11-06.md:124,126`: "Lighthouse sigue sin ejecutarse"). No escribas en ningún lado que pasó. El pass a11y que existe es axe.

---

## 11. Recetas — cómo modificar cada flujo sin romper nada

**Regla de camino de dueño:** un dominio por cambio — landing (`components/marketing/*`), chrome (`components/chrome/*`), auth (`components/auth/*`), panel (`components/panel/*` + `(panel)/*`). Los archivos no se solapan; si tu cambio toca dos dominios, son dos cambios. `CANON §10`. No toques `docs/frontend/features/` (material del operador, sin versionar — `INDEX.md §Carpetas`), ni los WIP de §10, ni `scansaydone-back/`.

1. **Banda del landing**: abre su plano → edita `src/components/marketing/<banda>.tsx` → pasa su `<banda>.test.tsx` (`npm test`) → build + axe si moviste geometría. Copy en español de Chile, tuteo, cero jerga (`CANON §7`): nada de KPI/CSAT/NPS/dashboard/"próximamente" visible.
2. **Hero / imagen del hero**: es el contrato más cerrado (§3.5). Cambiar raster = nuevo original en `assets/fuentes-imagenes/fondos/` (manteniendo el formato ~1536×1024) + conversión WebP en `public/img/fondos/` + conservar placa de declaración + re-verificar halo/contraste si el cambio mueve luminancia detrás del texto. No toques el CTA de propina.
3. **Login (`/entrar`)**: lógica solo en `login-card.tsx`. Prohibido: fetch, cookies, sesión, redirect a `/panel`. Los mensajes de demo exactos (`login-card.tsx:40` y `:61`) no se reescriben a "logueado". La página sigue sin chrome (el spec lo verifica). Valida campos solo por presencia, salvo decisión nueva en plano.
4. **Panel (`/panel`)**: los bloques (`evolution-chart`, `distribution-chart`, `channel-table`, `response-list`) son consumidores puros de `panel-data.ts`: cambias el dato → se propagan solos (sin estado interno que guardar). Agregar bloque = import del dataset, no constante local nueva. Cotas: cero sombra, un solo coral, chip DEMO + declaraciones intactos. El shell vive en `(panel)/layout.tsx` — si agregas ítem habilitado al nav, corre `npm run build` primero (§12.1).
5. **Cambiar el dataset compartido (distribución/canales)**:
   - `channels`: edita `panel-data.ts:24-30` → `/panel` (tabla) **y** banda 6 (lista top-3, import) se actualizan solos. Verifica que el total de `count` siga atado a la historia (los KPIs derivados `:114-124` salen de `distribution`, no de `channels`).
   - `distribution` (0–10): edita `panel-data.ts:9-21` **y además** la copia local `panel-preview.tsx:17-29` para que ambas vistas digan lo mismo; recalcula Σ/puntos/media (`:114-119`) y actualiza: comentario de origen `panel-data.ts:3-4`, labels numéricos de la banda 6 (aria-label "…486 respuestas…" `panel-preview.tsx:268`; escala `maxCount` `:37`), y el spec/test si verifican cifras. Si alguien toca `demoData` sin tocar `distribution`, se pierde la sincronía: déjalas iguales y dilo en el PR.
   - `dailySeries` (panel) ↔ `lineData` (landing): hoy son series distintas, conviven; si las unificas, es una decisión registrada en `PANEL-2026-11-06.md`, no un copy-paste.
6. **Link nuevo en el chrome**: usa el patrón condicional (`#x` on `/`, `/#x` off; `site-header.tsx:29-33`); destino debe ser ancla real de la §3.3 o ruta de la §2 que esté completa. **No** linkes rutas marcador ni `/panel` desde el footer como si fuera la banda. Los tests de chrome (`site-header.test.tsx`, `site-footer.test.tsx` — el de footer hasta vigila que no aparezca un link a `/e/…`) te avisan si el mapa cambia.
7. **Vista nueva (encuesta `/e/[code]`, interna)**: primero plano en `docs/frontend/planos/` con contrato de copy/estados/datos; hoy `/e/[code]` es marcador (§2) y **ningún link público debe apuntar ahí**. La encuesta real necesita: las 5 preguntas (pendiente `CANON §11` #3) y el endpoint (pendiente #6, backend). Sin backend no hay envío real: cualquier versión intermedia repite el patrón demo honesto (`CANON §7:82`: ningún estado de éxito sin acción real).
8. **Docs**: decides algo → fila en `docs/frontend/decisiones/DECISIONES-2026-11-05.md` o acta en el plano correspondiente; estado → `ESTADO` nueva jornada con fecha. Nomenclatura `AREA-AAAA-MM-DD.md` (`CANON §8:92`). No edites el snapshot `scansaydone-front/ENTREGA-UX-2026-10-30/` (congelado, `CANON §8`; solo sus cotas siguen siendo referencia).

---

## 12. Brechas y trampas conocidas — verifica antes de tocar

1. **Handlers en el layout del panel.** `(panel)/layout.tsx` es server component **sin `"use client"`** y las ramas por defecto de `SidebarNavLink`/`PanelNavLink` tienen `onMouseEnter`/`onMouseLeave` (`:148-155`, `:211-218`). Hoy no se renderizan (todos los ítems son active/disabled), pero son pólvora seca: **si activas un ítem o tocas el archivo, corre `npm run build` y confirma que la superficie sigue de acuerdo**. No conviertas el layout a cliente sin consultar el plano del panel (perderías metadata de la barra, `:4-11`).
2. **Hex literal en estilos del panel.** §7.1: valores iguales a tokens pero escritos crudos en inline. No asumas "todo es CSS var" en el panel; reutiliza los valores existentes y no multipliques hex nuevos.
3. **SEO**: noindex/nofollow global y del panel (`layout.tsx:21-24`; `(panel)/layout.tsx:7-10`) es decisión vigente. Favicon: no hay derivaciones de marca definitivas (pendiente operador — `ESTADO-2026-11-06.md:159`: `favicon`, `icon.png`, `apple-icon`, `og-image`); `app/favicon.ico` no es la respuesta. No inventes un icono de pestaña por tu cuenta.
4. **Arnés a11y desalineado.** §10: config WIP en 3120 vs specs commiteados 3170/3155; usa el override y no declares `npm run test:a11y` pelado como verde hasta que alguien reconcilie specs↔config.
5. **El gestor de servidores es WIP.** `servers:list` / `servers:stop` y `scripts/dev-servers.ps1` están sin commitear (`package.json:13-14` modificado, `scripts/` untracked, `docs/operaciones/` untracked; acta `ESTADO-2026-11-06.md:175`). No los documentes fuera de esta guía ni los uses como dependencia de tu PR.
6. **Banda 6 = "panel de ejemplo" del landing, no `/panel`.** El link `/#panel` del footer lleva a la ancla de la landing (`site-footer.tsx:85`). Si quieres que un día lleve a `/panel`, es cambio de censo: plano + tests, no un find&replace.
7. **Los valores 4,97:1 / margen estrecho del hero son peor-caso analítico, no medición de píxel** (§3.5; acta `ESTADO-2026-11-06.md:126`). Citalos así, no como muestra.
8. **Cifras del dataset requieren cuidado**: `486` aparece también en un `aria-label` (`panel-preview.tsx:268`); `8,5` y `377` se calculan, pero sus comentarios y ejemplos se mantienen a mano (`panel-preview.tsx:7,14,36`). Si cambias los datos, busca esas cifras con grep y actualiza comentarios/copy para que no queden desfasados.
9. **No hay sesión ni datos reales en ninguna ruta.** Si un reporte o demo sugiere que `/entrar` loguea o `/panel` muestra clientes reales, se corrige la copia (las frases autorizadas son las de §6), no el código hacia un backend.
10. **`docs/frontend/features/` no es documentación**: son referencias visuales del operador sin versionar (`INDEX.md` tabla de carpetas; `ESTADO §11.7`). Un PR que las modifique se sale de camino.

---

## 13. Dónde viven las decisiones (para no re-debater lo ya dicho)

| Quieres saber… | Lee |
|---|---|
| Reglas duras de stack, paleta, contenido, gates | `docs/frontend/CANON.md` |
| Estado real de cada banda/ruta, pendientes firmados | `docs/frontend/ESTADO-2026-11-06.md` |
| Geometría, copy y accesibilidad por página | `docs/frontend/planos/` (L1–L6, BANDAS 2-9, NAVBAR-Y-FOOTER, PASE-VISUAL-2, MEJORA-VISUAL, LOGIN, PANEL) |
| Tokens y componentes del sistema de diseño | `docs/frontend/UX-SPEC-2026-11-05.md` + §7 de esta guía |
| Decisiones con alternativa y owner | `docs/frontend/decisiones/DECISIONES-2026-11-05.md` |
| Convivencia con el snapshot histórico | `docs/frontend/README.md` + `CANON §8` |
| Marca y assets | `../../assets/marca/MANIFEST-ASSETS.md` (manifiesto de marca enlazado desde `docs/frontend/INDEX.md §Assets de marca`) |

---

*Fin. Si te faltó una receta que necesitas, agrégala con fecha y evidencia (archivo:línea), no con memoria.*
