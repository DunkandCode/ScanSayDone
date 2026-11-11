# Tech Landing — Decisiones técnicas para implementación

> **Fecha:** 2026-11-05 · **Autor:** architect-alibaba · **Estado:** PROPUESTO (nada aprobado)
> **Stack base:** Next.js 16.4.3, React 19.3, TypeScript 5, Tailwind CSS 4 (CSS-first `@theme`)
> **Audiencia:** operador (aprobación) + frontend agent (implementación)
> **Fuentes:** `package.json`, `UX-SPEC-2026-11-05.md`, `EFECTOS-Y-MOTION.md`, `DESIGN-CONTRACT.md`, context7 (Motion `/websites/motion_dev`, Tailwind CSS `/tailwindlabs/tailwindcss.com`, Lucide `/lucide-icons/lucide`, Next.js `/vercel/next.js`, AOS `/michalsnik/aos` — consultados 2026-11-05)

**Regla de lectura:** cada decisión lleva etiqueta `propuesto`. Nada entra en código sin aprobación del operador. Las cifras de bundle son **estimaciones** (etiquetadas como tal); verificar con `next build --analyze` tras implementar.

---

## 1. Animación

### Opciones comparadas

| Opción | Bundle estimado | React 19 | `prefers-reduced-motion` | CLS/LCP risk |
|---|---|---|---|---|
| **CSS transitions/keyframes** (compositor-only: `transform`, `opacity`) | 0 KB (nativo) | ✓ (no JS) | Bloque global `@media (prefers-reduced-motion: reduce)` con `--dur-*: 0.01ms` (`EFECTOS-Y-MOTION §4`) | Mínimo: hero **sin animación de entrada** (protege LCP=texto Bebas 88, `UX-SPEC §2.1`); scroll reveal solo con `@supports (animation-timeline: view())` |
| **Motion** (ex Framer Motion) | ~33 KB gz full; ~10 KB motion-one (API limitada) — **estimación bundlephobia, no medida en este repo** | ✓ (v13.2+, verificada en context7 `/websites/motion_dev`) | Requiere `useReducedMotion()` hook + branching manual por componente | Medio: `initial`/`animate` en hero puede causar CLS si `initial` cambia layout |
| **AOS** (Animate On Scroll) | ~6 KB gz — **estimación, no medida** | ✓ (vanilla JS) | Requiere disable flag manual | Medio: JS IntersectionObserver + clase `aos-animate`; último release estable 2022 (context7 `/michalsnik/aos`) |

### Recomendación: **CSS transitions/keyframes** (propuesto)

**Justificación:**
- `EFECTOS-Y-MOTION §3` fija **0 líneas JS para efectos**, `will-change: 0 elementos`, solo `transform`/`opacity`. Motion y AOS violan esta política.
- Hero LCP = texto Bebas 88 px (`UX-SPEC §2.1`). Animar `opacity`/`translate` con JS añade hidratación y riesgo de CLS antes de paint. CSS `@keyframes` con `animation-fill-mode: backwards` + `prefers-reduced-motion` = 0 riesgo.
- Scroll reveal: `animation-timeline: view()` (Chrome 115+, Firefox 125+, Safari 18) es progressive enhancement; sin soporte = contenido estático. 0 JS.
- Motion (~33 KB) no se justifica para 4 elementos en hero + hover de tarjetas. AOS (~6 KB) tiene mantenimiento incierto.

**`prefers-reduced-motion` obligatorio** (`EFECTOS-Y-MOTION §4`):

```css
@media (prefers-reduced-motion: reduce) {
  :root { --dur-micro: 0.01ms; --dur-ui: 0.01ms; --dur-enter: 0.01ms; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 2. 3D y profundidad

### Opciones evaluadas

| Opción | Costo | Beneficio medido | Veredicto |
|---|---|---|---|
| **CSS-only depth** (gradientes layerados, bordes, elevación coloreada, `box-shadow` ≤3 capas/viewport) | 0 KB, 0 JS | Separa tarjetas del fondo sin `backdrop-filter` (prohibido, `EFECTOS-Y-MOTION §2.3`). Borde 1px `--border` + sombra `--shadow-card` (1 capa) en hover. Suficiente para el diseño. | **USE** |
| **CSS 3D transforms** (`preserve-3d`, `perspective`, `rotateX/Y`) | 0 KB, 0 JS | Ningún caso documentado en `UX-SPEC`. El mock del login usa `--shadow-lift` 2D (`UX-SPEC §2.3`). `rotateY` en tarjetas añade riesgo de CLS. | **DEFER** — solo si el operador aprueba un caso concreto (ej. flip QR) |
| **WebGL / three.js** | ~150 KB gz core — **estimación bundlephobia, no medida** | Ningún beneficio medido para landing de marketing con 10 bandas estáticas. `requestAnimationFrame` loop bloquea main thread, sube TBT, rompe LCP < 2.5 s en mobile throttled. | **REJECT** — sin justificación de producto |

### Justificación del rechazo WebGL

Producto = herramienta de encuestas B2B para comercios locales. No hay 3D en el flujo (escanear QR → responder → ver panel). three.js añadiría:
- ~150 KB al bundle inicial (estimación)
- 1 loop `requestAnimationFrame` que compite con hidratación de React
- Riesgo de LCP > 2.5 s en mobile 4G throttled
- Complejidad de mantenimiento (shaders, WebGL context loss, fallback GPU móvil)

**Ningún beneficio medido.** Si el operador quiere efecto 3D puntual (ej. rotación QR en `/panel/qr`), evaluar con CSS 3D transforms primero.

---

## 3. Iconos

### Recomendación: **Lucide React** (propuesto)

| Criterio | Lucide React | react-icons | Feather (archivado 2022) |
|---|---|---|---|
| React 19 | ✓ (context7 `/lucide-icons/lucide` v1.49.0 verificada) | ✓ | ✗ |
| Tree-shaking | ✓ (1 icono = ~2 KB importado; 1400+ disponibles) | ✓ (pero barrel export en algunas versiones) | N/A |
| Licencia | ISC (comercial sin atribución) | MIT | MIT |
| Estilo | Stroke-based, `strokeWidth` configurable (1.8–2 recomendado, `UX-SPEC §4`) | Mezcla MDI/FA/etc. | Stroke-based (base de Lucide) |
| Bundle con 20 iconos | ~40 KB sin minificar; **~12 KB gz estimado, no medido** | ~80 KB barrel; ~15 KB gz tree-shaken | N/A |

**Justificación:**
- `UX-SPEC §4` menciona `react-icons` set `md`, pero la guía técnica (`scan-say-done-landing-guia-tecnica.md §5`) ya recomienda `lucide-react`.
- Lucide = sucesor de Feather (archivado), mantenido activamente, tree-shakeable por diseño.
- `strokeWidth={1.8}` consistente es nativo.

**Versión:** fijar a `^1.49.0` (última estable verificada en context7 2026-11-05).

---

## 4. Fuentes

### Recomendación: `next/font/google` con subsetting + fallback métrico (propuesto)

**Families documentadas** (`UX-SPEC §3.3`, `DESIGN-CONTRACT §3`):
- **Bebas Neue** (display, 400, siempre mayúsculas)
- **Montserrat** (UI, 400/500/600)

> **⚠️ FLAG CRÍTICO:** ninguna de las dos familias ha sido aprobada como final por el operador. `UX-SPEC §3.3` las documenta como vigentes, pero la paleta canónica (`§3.A`) supercede la anterior **sin cerrar la aprobación tipográfica**. **Owner de la decisión final: operador.**

**Configuración propuesta:**

```ts
// src/app/layout.tsx
import { Bebas_Neue, Montserrat } from 'next/font/google';

const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-display',
  fallback: ['Impact', 'sans-serif'],  // métrica similar: condensada, mayúsculas
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-ui',
  fallback: ['system-ui', 'sans-serif'],
});
```

**Política:**
- `display: 'swap'` obligatorio (evita FOIT; FOUT controlado con fallback métrico).
- `subsets: ['latin']` para excluir glifos cirílicos/griegos (ahorra **~30 KB/familia estimado, no medido**).
- Fallback métrico: `Impact` para Bebas Neue (condensada, mayúsculas, line-height similar); `system-ui` para Montserrat.
- `next/font` auto-hostea archivos: 0 requests a Google Fonts CDN, 0 render-blocking.

**Layout shift:** `next/font` + `display: 'swap'` + fallback métrico reduce CLS a **~0.005 (estimación; medir con `web-vitals` en producción)**.

---

## 5. Imágenes

### Política `next/image` (propuesto)

| Categoría | `priority` | `loading` | Dimensiones | Formato | Compresión target |
|---|---|---|---|---|---|
| **Hero** (LCP = texto, no imagen; mock encuesta si hay raster) | `priority` si hay raster | `eager` | `width`/`height` explícitos o `fill` + `aspect-ratio` | WebP/AVIF (auto) | Quality 75 default; bajar a 65 si LCP > 2.0 s |
| **Aplicaciones** (3 fotos: cartel, vitrina, ticket) | `false` | `lazy` | `width/height` explícitos (364×273, `UX-SPEC §2.1` banda 5) | WebP/AVIF | Quality 70 |
| **Panel preview** (captura mock) | `false` | `lazy` | `fill` + `aspect-ratio: 16/10` (`UX-SPEC §2.1` banda 6) | WebP/AVIF | Quality 75 |
| **Demo screenshots** (rotulados "DEMO") | `false` | `lazy` | `width/height` explícitos | WebP | Quality 70 + badge `DEMO` superpuesto |
| **Logo SVG** (navbar) | `priority` | `eager` | `width={108} height={36}` (`UX-SPEC §2.1`) | SVG nativo (`<img>`, NO `next/image`) | N/A |

**Reglas:**
- Toda imagen raster requiere `width`/`height` explícitos o `fill` + `aspect-ratio` (CLS ≤ 0.1; `UX-SPEC §3.6`).
- `sizes` obligatorio en responsive: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 364px"`.
- No usar `next/image` para SVG (logo). Usar `<img>` nativo con `width`/`height`.
- Demo screenshots: **nunca** sin badge `DEMO` (`UX-SPEC §4` componente `Badge`; `COPY-LANDING §7` prohíbe inventar datos).

---

## 6. Formularios

### Recomendación: **Nativo HTML + React `useActionState`** (propuesto)

**Formularios en scope:**
1. **Contacto** (`/contactus`): email + mensaje → `mailto:` o POST a FastAPI.
2. **Encuesta futura** (`/e/<nanoid>`): 3 preguntas + escala 1–5 → POST a FastAPI.

| Opción | Bundle | Complejidad | Justificación |
|---|---|---|---|
| **Nativo + `useActionState`** | 0 KB (React built-in) | Baja: `useActionState` (React 19) maneja `idle`/`submitting`/`success`/`error`. Validación con `required`, `type="email"`, `pattern`. | 2 formularios en todo el sitio. RHF (~12 KB gz) + Zod (~10 KB) no se justifica. |
| **React Hook Form + Zod** | **~22 KB gz estimado, no medido** | Alta: schema validation, registro, error handling programático. | Solo si hay >5 formularios o validación compleja. No es el caso. |

**Política:**
- `<form action={formAction}>` con Server Action o POST a FastAPI.
- `useActionState(formAction, initialState)` para estados.
- **Ningún estado de éxito puede ser fake** (`COPY-LANDING §13`): si el backend no responde, mostrar `error`, no `success`.
- Validación cliente: `type="email"` + `required` + `pattern` (HTML nativo). Custom validation con `onBlur` + estado React.

---

## 7. Charts

### Recomendación: **Confirmar prohibición de librerías; CSS-only bars** (propuesto)

**Evidencia de prohibición:**
- `DASHBOARD-UX §10` (vetos): "Recharts" listado explícitamente.
- `UX-SPEC §2.4` banda 6 (panel preview): captura mock, no gráfico interactivo.
- `UX-SPEC §2.4` banda `Respuestas`: tabla estática, no gráfico.

**CSS-only bar approach** (`UX-SPEC §4` componente `Bar`):

```css
.bar-track { height: 10px; background: var(--surface-2); border-radius: 5px; overflow: hidden; }
.bar-fill {
  height: 100%;
  background: var(--interactive-primary);
  width: calc(var(--value) / var(--total) * 100%);
  transition: width 200ms var(--ease-ui);
}
```

**Justificación:**
- Panel muestra distribución 1–5 (5 barras/pregunta). No hay ejes, tooltips, interacción.
- Recharts (~120 KB gz) o Chart.js (~60 KB gz) — **ambas estimaciones bundlephobia, no medidas** — añaden peso innecesario para 5 barras estáticas.
- CSS `width: calc(...)` con custom properties = 0 KB, 0 JS, respeta `prefers-reduced-motion`.

**Excepción:** si el operador aprueba gráfico interactivo (ej. timeline de respuestas por día), evaluar Recharts en `dynamic import` lazy. **Hoy no hay caso documentado.**

---

## 8. Testing

### Conjunto mínimo viable (propuesto)

| Tipo | Herramienta | Qué cubre | Cuándo |
|---|---|---|---|
| **Unit** | **Vitest** (Vite-native, Next.js 16 via `@vitejs/plugin-react`) | Utils, hooks custom (`useReducedMotion`), lógica (ej. `bar-fill` width) | Pre-commit + CI |
| **Component** | **Vitest + `@testing-library/react`** | Componentes interactivos (SurveyOption, FilterChip, FAQ), estados, a11y (roles, labels) | Pre-commit + CI |
| **E2E** | **Playwright** (ya configurado en ecosistema) | Flujos críticos: hero → CTA → contacto; login `/entrar` → magic link → panel; encuesta demo | CI pre-deploy |
| **Accessibility** | **axe-core** (via `@axe-core/playwright`) | WCAG 2.2 AA: contraste, focus, roles, labels, heading order | E2E + Lighthouse CI |

**Justificación:**
- Vitest = ~5x más rápido que Jest (Vite-native), soporta React 19.
- `@testing-library/react` enforce buenas prácticas (query by role/label).
- Playwright ya está en el ecosistema (`AGENTS.md §3.1`); no añadir Cypress.
- axe-core en Playwright detecta violaciones WCAG en E2E.

**Cobertura target:** 70% componentes críticos (SurveyOption, FilterChip, LoginSplit), 50% utils, 100% flujos E2E críticos.

---

## 9. Lista explícita de rechazados

| Librería/técnica | Motivo de rechazo |
|---|---|
| **Bootstrap** | Tailwind CSS 4 es el stack (`package.json`). Bootstrap 5.3 (`DESIGN-CONTRACT`) fue reemplazado. |
| **Sass** | Tailwind CSS 4 usa CSS-first `@theme` (sin `.scss`). `UX-SPEC §3.A` define tokens en custom properties. |
| **jQuery** | React 19 no necesita jQuery. 0 dependencias en Next.js 16. |
| **Motion** (ex Framer Motion) | ~33 KB gz; viola "0 JS para efectos" (`EFECTOS-Y-MOTION §3`). CSS `@keyframes` + `animation-timeline: view()` basta. |
| **AOS** | ~6 KB gz; JS IntersectionObserver. CSS `animation-timeline: view()` es nativo + progressive enhancement. |
| **Recharts / Chart.js / D3** | Prohibidos por `DASHBOARD-UX §10`. CSS-only bars cubren distribución 1–5. |
| **GSAP** | ~25 KB gz; overkill para 4 elementos. CSS basta. |
| **Font Awesome** | Lucide tree-shakeable (~2 KB/icono); FA requiere font-face (~100 KB woff2). |
| **react-icons** | Barrel export puede impedir tree-shaking. Lucide es tree-shakeable por diseño. |
| **react-hook-form + Zod** | ~22 KB gz; no justificado para 2 formularios. `useActionState` basta. |
| **Three.js / WebGL** | ~150 KB gz; sin caso de uso. Rompe LCP < 2.5 s en mobile throttled. |
| **Swiper / Tiny-slider** | Autoplay viola WCAG 2.2.2 (`EFECTOS-Y-MOTION §1`). No hay carrusel. |
| **react-type-animation / react-countup** | JS de efectos prohibido. Contadores sin datos reales = inventar (`COPY-LANDING §13`). |
| **Glassmorphism (`backdrop-filter`)** | Prohibido (`EFECTOS-Y-MOTION §2.3`). 0 elementos. |
| **Parallax** | Prohibido (`EFECTOS-Y-MOTION §1`). JS de scroll, CLS. |

---

## 10. Tabla de decisiones

| Ítem | Elección | Versión | Bundle/impacto estimado | Owner | Status |
|---|---|---|---|---|---|
| Framework | Next.js | 16.4.3 (package.json) | Base | — | ✅ Aprobado |
| React | React | 19.3 (package.json) | Base | — | ✅ Aprobado |
| CSS | Tailwind CSS | ^4 (CSS-first `@theme`) | 0 KB (utility-only) | — | ✅ Aprobado |
| Lenguaje | TypeScript | ^5 (package.json) | 0 KB (compile-time) | — | ✅ Aprobado |
| Animación | CSS transitions/keyframes | Nativo | 0 KB | frontend | **Propuesto** |
| 3D/profundidad | CSS-only depth (bordes, sombras ≤3 capas) | Nativo | 0 KB | frontend | **Propuesto** |
| Iconos | Lucide React | ^1.49.0 | **~12 KB gz estimado (20 iconos)** | frontend | **Propuesto** |
| Fuentes | `next/font/google` (Bebas Neue + Montserrat) | Nativo | **~50 KB gz estimado (2 familias con subset)** | frontend | **Propuesto** (families no aprobadas) |
| Imágenes | `next/image` + `<img>` para SVG | Nativo | 0 KB (auto-optimize) | frontend | **Propuesto** |
| Formularios | Nativo + `useActionState` | React 19 built-in | 0 KB | frontend | **Propuesto** |
| Charts | CSS-only bars | Nativo | 0 KB | frontend | **Propuesto** |
| Testing | Vitest + Playwright + axe-core | Latest stable | 0 KB (devDeps) | frontend + reviewer | **Propuesto** |
| Hosting | Vercel | — | — | gitops | ✅ Aprobado |
| Backend | FastAPI (separado) | — | — | backend | ✅ Aprobado |

---

## 11. Preguntas abiertas

| # | Pregunta | Owner | Bloquea |
|---|---|---|---|
| 1 | **¿Bebas Neue + Montserrat son las familias finales?** `UX-SPEC §3.3` las documenta vigentes, pero la paleta canónica (`§3.A`) supercede la anterior sin cerrar la aprobación tipográfica. | Operador | `layout.tsx` (fuentes) |
| 2 | **¿Cuál es el `mailto:` de contacto?** `UX-SPEC §2.1` `/contactus` indica `SITE.contact.email` vacío. | Operador + backend | Formulario de contacto |
| 3 | **¿Hay endpoint FastAPI para encuesta (`/e/<nanoid>` POST)?** `UX-SPEC §2.6` indica spec de página `sin dato`. | Backend | Encuesta pública |
| 4 | **¿Se aprueba el rechazo de WebGL/3D?** Si el operador quiere efecto 3D puntual, se evalúa por caso. | Operador | Sección 2 |
| 5 | **¿Hay casos de uso para gráficos interactivos?** Si sí, evaluar Recharts en `dynamic import`. | Operador | Sección 7 |
| 6 | **¿Cuál es el dataset demo del panel?** `UX-SPEC §2.4` lista 8 filas; confirmar definitivas. | Operador | `/panel/respuestas` |
| 7 | **¿Se aprueba la política de imágenes (priority/lazy/quality)?** Verificar que assets existen en `public/`. | Operador + frontend | Sección 5 |
| 8 | **¿Hay integración de analytics (Plausible/Umami)?** Si sí, añadir `next/script` con `strategy="lazyOnload"`. | Operador | `layout.tsx` |

---

## Resumen: 5 decisiones que más impactan la landing

1. **Animación: CSS-only (0 KB JS).** Protege LCP < 2.5 s y CLS ≤ 0.1 en mobile. Motion (~33 KB) y AOS (~6 KB) violan "0 JS para efectos" y no se justifican para 4 elementos.

2. **Fuentes: `next/font/google` con Bebas Neue + Montserrat (pending approval).** Auto-hosted, subset `latin`, `display: 'swap'` + fallback métrico. Reduce CLS a ~0.005 estimado. **Familias no aprobadas por el operador.**

3. **Iconos: Lucide React (tree-shakeable, ~12 KB gz estimado para 20 iconos).** Reemplaza `react-icons` (barrel risk) y Font Awesome (100 KB woff2). ISC license, React 19 compatible.

4. **Formularios: nativo + `useActionState` (0 KB extra).** RHF + Zod (~22 KB) no se justifica para 2 formularios. Validación HTML nativa + React state basta.

5. **Charts: CSS-only bars (0 KB).** Recharts (~120 KB) y Chart.js (~60 KB) prohibidos por `DASHBOARD-UX §10`. Panel solo muestra distribución 1–5 (5 barras estáticas); CSS `width: calc(...)` basta.

---

**Próximo paso:** operador aprueba/rechaza las decisiones marcadas `propuesto`. Frontend agent no implementa sin aprobación.
