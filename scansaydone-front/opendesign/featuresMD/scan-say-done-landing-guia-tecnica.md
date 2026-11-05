# Scan-Say-Done — Landing 2026

**Guía de diseño UX/UI e implementación con Next.js + Bootstrap**  
**Versión:** 2.0 · **Fecha:** 28 de octubre de 2026  
**Referencia:** captura actual de la landing aportada por el equipo + nueva propuesta visual conceptual.  
**Objetivo:** mejorar la comprensión del producto y la conversión **sin cambiar el orden ni eliminar secciones**.

> **Alcance:** diseño e implementación de la landing pública, no rediseño del panel privado ni del backend. Los indicadores del mockup son ficticios y se deben rotular como DEMO. La ilustración generada es una referencia; no debe utilizarse como reemplazo de componentes HTML accesibles ni como fuente definitiva del logo.

---

## 1. Qué se mantiene

Orden original, de arriba abajo:

1. **Navbar:** logo, Cómo funciona, Canales, Panel, Preguntas, Contacto y CTA Crear mi encuesta.
2. **Hero:** mensaje principal, dos acciones, encuesta de demostración y apoyo visual del QR.
3. **Franja de cuatro beneficios:** rapidez, sin instalar, sin cuenta para clientes, QR reutilizable.
4. **Así funciona:** Escanea → Opina → Listo.
5. **Tus cuatro canales:** En el mostrador, Instagram, WhatsApp, TikTok Live.
6. **Así se ve en tu local:** cartel de mesa, vinilo de vitrina, boleta/ticket.
7. **Todo en una pantalla:** explicación + demostración del panel.
8. **Preguntas frecuentes:** acordeón de preguntas y respuestas.
9. **CTA final:** Crea tu primera encuesta.
10. **Footer:** marca, producto, recursos, legal y derechos.

**No agregar** una sección de precios, testimonios, blog o nuevas funciones sin decisión del equipo. Las nuevas imágenes enriquecen las secciones existentes, no crean secciones nuevas.

## 2. Diagnóstico UX de la captura actual

| Área | Estado visible | Mejorar sin romper la estructura | Prioridad |
|---|---|---|---|
| Hero | Fondo oscuro y demo de encuesta pequeña | H1 más visible; explicar valor en 2 líneas; demo legible y QR reconocible | P0 |
| CTA | Variantes de «Crear mi encuesta» | Utilizar una misma etiqueta y destino en toda la página | P0 |
| Beneficios | Texto extremadamente pequeño | Iconos consistentes y 1 título + 1 frase por beneficio | P1 |
| Tres pasos | Secuencia entendible | Trazado visual consistente, numeración accesible y mejor espacio en móvil | P1 |
| Canales | Cuatro tarjetas similares | Casos de uso diferenciados, enlaces internos y mayor contraste | P1 |
| Aplicaciones | Tres placeholders grandes | Fotos del cartel/vidrio/ticket y alternativas textuales claras | P0 |
| Panel | Placeholder sin datos observables | Mockup realista, legible, indicando que es una demostración | P0 |
| FAQ | Acordeón presente | Interacción con teclado, estado expandido y respuestas concretas | P1 |
| CTA final | Buen cierre en morado | Una sola acción principal, frase breve y enlace a inicio de creación | P1 |
| Footer | Estructura correcta | Mejorar legibilidad, enlaces reales, privacidad y contacto | P2 |

### Problemas prioritarios

- **Exceso de letra pequeña:** el sitio se ve ordenado, pero muchas descripciones pierden legibilidad en pantallas reales.
- **Insuficiente demostración:** carteles y panel todavía aparecen como placeholders en la captura original.
- **Falta de diferenciación por canal:** explicar cómo se comparte la misma encuesta en cada contexto, especialmente **TikTok Live**.
- **Contraste de marca:** el coral `#FF5F44` sobre blanco alcanza aprox. **3,01:1**, insuficiente para texto normal según WCAG AA. Se conserva como color corporativo, pero se usa coral oscuro en texto pequeño/botones con tipografía blanca.
- **Microcopy inconsistente:** mantener 3 preguntas, 30 segundos, sin registro del cliente, solo si esas promesas coinciden con el producto.

## 3. Jerarquía de información y copy propuesto

### Hero

- **Eyebrow:** `TU NEGOCIO, SUS OPINIONES, TU CRECIMIENTO`.
- **H1:** `¿QUÉ DICEN TUS CLIENTES?`.
- **Descripción:** `Descúbrelo con 3 preguntas y un código QR. Recibe opiniones y detecta a tiempo lo que puedes mejorar.`
- **CTA primario:** `CREAR MI ENCUESTA` → ruta real del flujo de creación.
- **CTA secundario:** `VER EJEMPLO` → demo operativa de encuesta; no un botón vacío.
- **Pruebas de fricción (solo si son verdaderas):** `Sin registro para tus clientes`, `Listo en minutos`, `Resultados en tu panel`.

### Beneficios

1. `Rápido de preparar` — `Crea una encuesta breve en minutos.`
2. `Sin instalar nada` — `Tus clientes responden desde el navegador.`
3. `Sin cuenta para clientes` — `Opinan sin crear usuarios ni contraseñas.`
4. `Un QR que reutilizas` — `Compártelo en tu local, redes o transmisiones.`

### Así funciona

- `1. Escanea` — `El cliente abre el QR o enlace desde su celular.`
- `2. Opina` — `Responde tres preguntas sin registrarse.`
- `3. Listo` — `Revisa las respuestas y avisos en tu panel.`

### Cuatro canales

- **Mostrador:** QR físico en mesa o mesón; ideal al terminar la compra.
- **Instagram:** enlace en la biografía o historias, según las posibilidades de la cuenta.
- **WhatsApp:** enlace directo al terminar una conversación, venta o entrega.
- **TikTok Live:** QR sobreimpreso en pantalla o enlace compartido donde la plataforma lo permita; evitar prometer enlace clicable dentro del video si no está disponible.

### FAQ sugerido

1. ¿Cuánto demora mi cliente en responder? — `La encuesta está diseñada para completarse en aproximadamente 30 segundos.`
2. ¿Los clientes necesitan registrarse? — `No. Pueden responder desde el navegador sin crear una cuenta.`
3. ¿Puedo compartirla en Instagram, WhatsApp o TikTok Live? — `Sí, mediante un enlace o QR, según el formato disponible en cada canal.`
4. ¿Puedo cambiar las preguntas después? — `Responder de acuerdo con la funcionalidad real del producto; verificar si el QR permanece vigente.`
5. ¿Qué pasa si pierdo el QR? — `Indicar cómo volver a descargarlo desde el panel, solo si dicha función existe.`
6. ¿Quién ve las opiniones? — `Explicar alcance y privacidad reales; no prometer anonimato absoluto sin validarlo.`

**Nota:** las preguntas que dependan de funciones pendientes se deben resolver con el equipo antes de publicar la respuesta.

## 4. Sistema visual

### Paleta

| Token | HEX | Uso |
|---|---|---|
| `--brand-purple` | `#2E1E3F` | Hero, CTA final, encabezados, footer |
| `--brand-coral` | `#FF5F44` | Recursos decorativos, iconos, detalles amplios |
| `--brand-coral-dark` | `#D83B28` | Texto pequeño coral y botones con texto blanco (≈ 4,59:1) |
| `--brand-cream` | `#FFF8F2` | Alternancia de fondo entre secciones |
| `--brand-peach` | `#FBE6DB` | Superficies suaves, tarjetas QR, tags |
| `--brand-yellow` | `#F4B63B` | Etiqueta de demo, solo con texto oscuro |
| `--ink` | `#2E1E3F` | Texto principal |
| `--muted` | `#665B70` | Texto secundario (verificar contraste final) |
| `--white` | `#FFFFFF` | Tarjetas y fondos |

No usar amarillo ni coral claro para párrafos pequeños sobre blanco. Revisar contraste **real después de implementar**, incluidos estados hover/focus.

### Tipografía

- **Bebas Neue:** titulares grandes y títulos de sección; evitar usarla en párrafos.
- **Inter:** textos de cuerpo, formularios, preguntas frecuentes, cifras de panel y botones pequeños.
- **Montserrat:** opcional para subtítulos o labels de marca. **No cargar tres familias por defecto** si la tercera apenas se utiliza; preferencia inicial: Bebas Neue + Inter.
- Tamaños orientativos: H1 `clamp(3rem, 6vw, 5.6rem)`, H2 `clamp(2.25rem, 4vw, 3.5rem)`, cuerpo 16–18 px, microcopy mínimo 14 px si se puede.
- Párrafos de ancho limitado (`max-width: 62ch`), line-height 1.5–1.65.

### Espaciado y componentes

- Contenedor Bootstrap `.container`, ancho máximo consistente; secciones con `padding-block` 64–96 px desktop / 44–64 px móvil.
- Tarjetas: `border-radius: 12–16px`, borde `1px` tenue, sombra muy ligera y hover opcional.
- Botón principal: alto mínimo 44–48 px, radio 8–10 px, foco visible, misma etiqueta.
- Iconografía: grosor de línea consistente (`strokeWidth={1.8}` o `2`), no mezclar familias diferentes sin motivo.
- Fotografía real para aplicaciones físicas; **no estirar ni rasterizar el logo**.

## 5. Stack mínimo: conservar Next.js + Bootstrap

| Herramienta | Motivo | Decisión |
|---|---|---|
| **Next.js + React + TypeScript** | SSR/SSG, rutas, metadata, componentes | **Mantener** |
| **Bootstrap 5.3** | Grid, responsive, espaciado | **Mantener** |
| **SCSS (`sass`) o CSS Modules** | Estilos y tokens personalizados | **Elegir uno; Sass recomendado si ya lo usan** |
| **`next/font`** | Fuentes autoalojadas y optimizadas | **Incluido en Next.js** |
| **`next/image`** | Imágenes responsive y optimizadas | **Incluido en Next.js** |
| **`lucide-react`** | Iconos SVG de interfaz | **Agregar** |
| **`qrcode.react`** | QR verdadero con salida SVG | **Agregar si QR se renderiza en React** |
| **`motion`** | Animaciones de entrada o interacción no triviales | **Opcional / fase 2** |
| **`recharts`** | Gráficos dinámicos del dashboard demo | **Opcional; no para mockup estático** |
| **`react-bootstrap`** | Componentes Bootstrap interactivos en React | **Opcional; no instalar por el FAQ solamente** |
| **`@svgr/webpack`** | Usar SVG externos como componentes React | **Opcional; evitar salvo necesidad real** |

**No añadir inicialmente:** Tailwind, GSAP, AOS, Swiper, Font Awesome, una biblioteca de UI completa ni un paquete adicional de iconos genéricos. Mejor CSS que Motion para hover simple; mejor `<details>` nativo que React Bootstrap si el FAQ es sencillo.

### Comandos

```bash
# Si Next.js y Bootstrap ya están instalados:
npm install lucide-react qrcode.react

# Solo si se usarán archivos .scss y aún no está instalado:
npm install -D sass

# Según funcionalidad real, instalar después:
npm install motion
npm install recharts
```

Revisar el `package.json` antes de instalar para no duplicar dependencias. No importar **a la vez** `bootstrap/dist/css/bootstrap.min.css` y la compilación completa de Bootstrap SCSS.

## 6. Estructura de carpetas propuesta (App Router)

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.scss
├── components/
│   ├── landing/
│   │   ├── LandingNavbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── SurveyDemo.tsx        # client component; demo local
│   │   ├── BenefitsStrip.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ChannelsSection.tsx
│   │   ├── LocalExamples.tsx
│   │   ├── DashboardPreview.tsx
│   │   ├── FAQSection.tsx
│   │   ├── FinalCTA.tsx
│   │   └── LandingFooter.tsx
│   └── ui/
│       ├── PrimaryButton.tsx
│       ├── SectionHeading.tsx
│       └── BrandLogo.tsx
├── data/
│   ├── channels.ts
│   └── faq.ts
└── styles/
    ├── _tokens.scss
    └── _landing.scss

public/
├── brand/
│   ├── logo-color.svg
│   ├── logo-light.svg
│   └── isotipo.svg
└── landing/
    ├── hero-qr-display.webp
    ├── cartel-mesa.webp
    ├── vinilo-vitrina.webp
    └── ticket-qr.webp
```

Mantener la mayoría de las secciones como **Server Components**. Reservar `"use client"` para la encuesta demo, menú móvil interactivo o gráficos dinámicos. En una página de marketing no se justifica hidratar toda la landing.

## 7. Ejemplo de configuración de fuentes

`src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-bebas",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Scan-Say-Done | Escanea, opina, listo",
  description:
    "Conoce las opiniones de tus clientes con encuestas cortas y código QR.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" className={`${bebas.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

**Nota:** este ejemplo importa la distribución CSS precompilada de Bootstrap. Si se personalizan **variables Sass de Bootstrap** en origen, reemplazar ese import por **una única** entrada Sass que incluya Bootstrap con el orden exigido por su documentación.

## 8. Tokens CSS/SCSS de partida

`src/app/globals.scss` (fragmento):

```scss
:root {
  --brand-purple: #2e1e3f;
  --brand-coral: #ff5f44;
  --brand-coral-dark: #d83b28;
  --brand-cream: #fff8f2;
  --brand-peach: #fbe6db;
  --brand-yellow: #f4b63b;
  --ink: #2e1e3f;
  --muted: #665b70;
  --radius-card: 14px;
  --section-space: clamp(3rem, 6vw, 6rem);
}

html { scroll-behavior: smooth; scroll-padding-top: 5rem; }
body { font-family: var(--font-inter), sans-serif; color: var(--ink); }
h1, h2, .display-title { font-family: var(--font-bebas), Impact, sans-serif; }

.landing-section { padding-block: var(--section-space); }
.landing-section--cream { background: var(--brand-cream); }

.btn-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0.75rem 1.25rem;
  border: 0;
  border-radius: 9px;
  background: var(--brand-coral-dark);
  color: white;
  font-weight: 700;
  text-decoration: none;
  transition: transform 180ms ease, background-color 180ms ease;
}
.btn-brand:hover { background: #ba2f1d; color: white; transform: translateY(-1px); }
:where(a, button, input, summary):focus-visible {
  outline: 3px solid #f4b63b;
  outline-offset: 3px;
}

.hero {
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 85% 35%, #4d315e, transparent 40%), #2e1e3f;
  color: white;
}

.hero__title { font-size: clamp(3rem, 6vw, 5.6rem); line-height: 0.96; }
.hero__media { position: relative; min-height: 320px; }
.card-landing { border: 1px solid #eadfe4; border-radius: var(--radius-card); background: white; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

## 9. SVG, QR e imágenes: qué hacer con cada recurso

### Logo corporativo

- Utilizar **el SVG original de la marca**, no un recorte del mockup generado.
- Colocar en `public/brand/logo-color.svg` y, si existe, una versión clara para fondos oscuros.
- SVG como `<img src="/brand/logo-color.svg" alt="Scan-Say-Done" />` o `next/image`; evitar reinventar el isotipo con Lucide.

### Iconos

```tsx
import { QrCode, MessageSquareText, Smartphone, ChartNoAxesCombined, ShieldCheck } from "lucide-react";

export function BenefitIcon() {
  return <QrCode size={28} strokeWidth={1.8} aria-hidden="true" />;
}
```

- Lucide para beneficios, pasos, alertas, panel y navegación.
- **Marcas comerciales** Instagram, WhatsApp, TikTok: usar SVG de sus marcas aprobado por el equipo, **no** sustituirlos por iconos genéricos. Respetar guías de marca.
- Ondas de separación: SVG inline sencillo o `clip-path`; el SVG permite escalado limpio sin agregar una librería.

### QR funcional

```tsx
"use client";

import { QRCodeSVG } from "qrcode.react";

export function DemoQr({ url }: { url: string }) {
  return <QRCodeSVG value={url} size={176} marginSize={4} />;
}
```

Usar una **URL real** del entorno correspondiente, preferentemente HTTPS. Evitar QR ficticio dibujado en Canva como recurso final. Probar lectura desde un teléfono real, en tamaños pequeños y bajo iluminación desigual; prever margen libre y suficiente contraste. La generación de archivos de impresión puede requerir una función de exportación adicional.

### Fotos y dashboard

- El hero puede combinar una fotografía optimizada de un soporte QR **con la encuesta como HTML real**.
- En «Así se ve en tu local», tres fotografías con encuadre uniforme y `object-fit: cover`, no placeholders.
- Panel: si es una captura real, ocultar datos privados; si es un mockup, rotular «Vista de demostración» y usar cifras simuladas.
- Para un gráfico **solo decorativo**, SVG estático; para gráfico **interactivo**, `recharts` bajo carga diferida, si hay necesidad concreta.

## 10. Interacción real para la encuesta de muestra

La demo debe poder puntuar y enviar una respuesta **sin guardar información ni afectar el panel real**, salvo que exista un entorno explícito de prueba.

`src/components/landing/SurveyDemo.tsx`:

```tsx
"use client";

import { useState } from "react";

export function SurveyDemo() {
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating === null) return;
    setMessage("¡Gracias! Esta es una demostración: no se ha guardado tu respuesta.");
  }

  return (
    <form onSubmit={submit} className="card-landing p-4 text-start">
      <p className="small mb-3">Scan-Say-Done · Encuesta de ejemplo</p>
      <fieldset>
        <legend className="fs-6 fw-semibold">¿Cómo fue tu atención?</legend>
        <div className="d-flex gap-2 flex-wrap" role="group" aria-label="Califica del 1 al 5">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="rating-option position-relative">
              <input
                type="radio"
                name="rating"
                value={value}
                checked={rating === value}
                onChange={() => { setRating(value); setMessage(""); }}
                className="visually-hidden"
              />
              <span className="rating-option__label">{value}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button className="btn-brand w-100 mt-3" type="submit" disabled={rating === null}>
        Enviar respuesta de ejemplo
      </button>
      <p className="small mt-2 mb-0" role="status" aria-live="polite">{message}</p>
    </form>
  );
}
```

Estilos complementarios necesarios:

```scss
.rating-option__label {
  display: inline-grid;
  place-items: center;
  width: 38px;
  height: 42px;
  border: 1px solid #cbbdcf;
  border-radius: 8px;
  cursor: pointer;
}
.rating-option input:checked + .rating-option__label {
  background: var(--brand-purple);
  border-color: var(--brand-purple);
  color: white;
}
.rating-option input:focus-visible + .rating-option__label {
  outline: 3px solid var(--brand-yellow);
  outline-offset: 3px;
}
.btn-brand:disabled { opacity: .6; cursor: not-allowed; transform: none; }
```

Este ejemplo es deliberadamente simple: en el MVP se puede adaptar la demo a las tres preguntas reales. Si se visualiza una escala **1–5**, etiquetarla como satisfacción (CSAT); **no** llamarla NPS (tradicionalmente se basa en la pregunta de recomendación 0–10).

## 11. FAQ sin librería extra

Usar `details` + `summary`, con HTML semántico, estilos propios y respuestas de contenido breve:

```tsx
export function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="faq-item">
      <summary>{question}</summary>
      <div className="pt-2 pb-3">{answer}</div>
    </details>
  );
}
```

Comprobar la experiencia en VoiceOver/NVDA y navegación mediante Tab/Enter/Space. Si el equipo necesita **un solo elemento abierto a la vez**, control animado o analítica por pregunta, entonces evaluar React Bootstrap o un acordeón React propio.

## 12. Responsive: comportamiento por bloque

| Pantalla | Comportamiento |
|---|---|
| `≥ 1200 px` | Contenedor ancho; hero dos columnas; beneficios cuatro; pasos tres; canales cuatro; aplicaciones tres; panel en dos columnas |
| `768–1199 px` | Hero dos columnas ajustadas o 1 si se pierde lectura; beneficios 2×2; canales 2×2; aplicaciones 3 o 2+1 |
| `≤ 767 px` | Menú compacto; H1 sin desbordamiento; encuesta debajo del texto; beneficios 1 o 2 columnas; pasos verticales; canales 1 columna; fotos 1 columna; texto del panel antes de vista previa; FAQ full-width |

**Sobre la sección del panel:** la captura actual ubica el mockup a la **izquierda** y el texto a la **derecha** en escritorio. Mantener esa orientación si es una decisión del diseño actual; en móvil, permitir que el texto aparezca primero mediante `order-*` de Bootstrap. La nueva propuesta visual muestra la misma sección con columnas invertidas, una variante y no un cambio obligatorio.

- Revisar al menos 360, 390, 768, 1024 y 1440 px.
- Áreas táctiles ≥44 px cuando sea viable.
- Evitar una imagen de hero gigantesca que retrase la carga de H1/CTA.
- No usar efectos de scroll que dificulten leer o activar botones.

## 13. Accesibilidad, SEO, performance y confianza

### Accesibilidad

- H1 único, encabezados H2 por sección, `nav`, `main` y `footer` semánticos.
- Contraste de texto WCAG AA: 4.5:1 para texto normal y 3:1 para texto grande; revisar cada combinación real.
- CTA con texto significativo, foco visible, navegación por teclado, etiquetas de formulario y estado de envío anunciado.
- `alt` de fotos explica el contexto: `Cartel QR sobre una mesa de cafetería`; iconos ornamentales `aria-hidden="true"`.
- Respetar `prefers-reduced-motion` y no usar autoplay intrusivo.

### SEO

- `metadata` por ruta, `lang="es-CL"`, descripción clara, URL canónica cuando corresponda.
- Open Graph con imagen propia; la captura vertical de referencia no es un OG ideal.
- Un H1 centrado en la necesidad del negocio; encabezados H2 reales, no texto dibujado en imágenes.
- FAQ útil para personas primero, sin suponer que incluir datos estructurados garantiza resultados enriquecidos.

### Rendimiento

- Preferir Server Components y CSS; client components solo donde exista interacción.
- Imágenes WebP/AVIF vía `next/image`; `sizes` en imágenes responsive y prioridad solo para el recurso LCP del hero, si aplica.
- Gráficos pesados bajo demanda, sin librerías de scroll redundantes.
- Objetivos de referencia Core Web Vitals: **LCP ≤ 2,5 s**, **CLS ≤ 0,1**, **INP ≤ 200 ms** en el percentil apropiado; medir y no asumir cumplimiento.

### Confianza y privacidad

- No afirmar `100% anónimo`, `gratis para siempre`, `sin tarjeta` ni `avisos inmediatos` si no están validados.
- El consentimiento/aviso de privacidad debe reflejar qué datos recoge el formulario de feedback y para qué se usan.
- No insertar reseñas, contadores o métricas inventadas como datos reales. Rotular `DEMO` junto a cifras simuladas.
- El formulario de ejemplo nunca debe escribir accidentalmente en una cuenta real de un comercio.

## 14. Plan de implementación por prioridad

### P0 — Versión publicable

- [ ] Definir URL real de `Crear mi encuesta` y mantenerla consistente.
- [ ] Incorporar logo SVG original, paleta, tipografías y H1.
- [ ] Construir hero responsive con encuesta demo accesible.
- [ ] Sustituir placeholders de aplicaciones por 3 imágenes optimizadas.
- [ ] Construir mockup legible de dashboard con etiqueta DEMO.
- [ ] Corregir contraste, tamaños de letra y estados de foco.
- [ ] Verificar veracidad de textos de marketing y FAQ.

### P1 — Mejoras UX

- [ ] Refinar beneficios y pasos con iconos coherentes.
- [ ] Crear tarjetas para los cuatro canales y mostrar casos de uso concretos.
- [ ] Revisar detalle móvil (360/390/768 px) y menú de navegación.
- [ ] Hacer FAQ operativa mediante `details`.
- [ ] Integrar QR de demostración que apunte a URL válida.
- [ ] Añadir métricas de conversión de CTA si hay consentimiento e instrumentación aprobada.

### P2 — Refinamientos opcionales

- [ ] Animaciones de aparición sutiles con Motion, solo si aportan claridad.
- [ ] Gráfico interactivo con Recharts si el demo requiere filtros reales.
- [ ] Variantes visuales y prueba A/B del mensaje de apertura.
- [ ] Ajustes Lighthouse y Core Web Vitals posteriores a medición.

## 15. Criterios de aceptación

1. El orden de las 10 zonas de la página no cambia.
2. Las CTA visibles llevan a destinos funcionales y coherentes.
3. El logo proviene de archivo vectorial oficial, no de la imagen generada.
4. La encuesta de muestra puede ser operada con teclado y declara que es una demo.
5. Las 3 aplicaciones físicas se presentan con imágenes reales y texto alternativo.
6. Los 4 canales son reconocibles y sus ejemplos corresponden a la plataforma.
7. El panel de demostración es legible a tamaño real y sus métricas ficticias están rotuladas.
8. El FAQ funciona con teclado y muestra respuestas publicables verificadas.
9. En 360 px no existe scroll horizontal involuntario ni CTA cortada.
10. No se duplica la importación de Bootstrap ni se introducen librerías sin uso.
11. Se revisan contraste, carga móvil y navegación asistida antes de publicar.

---

## Referencias técnicas oficiales

- [Next.js — fuentes](https://nextjs.org/docs/app/getting-started/fonts)
- [Next.js — imágenes](https://nextjs.org/learn/dashboard-app/optimizing-fonts-images)
- [Bootstrap 5.3 — personalización](https://getbootstrap.com/docs/5.3/customize/overview/)
- [Bootstrap 5.3 — Sass](https://getbootstrap.com/docs/5.3/customize/sass/)
- [Bootstrap 5.3 — optimización](https://getbootstrap.com/docs/5.3/customize/optimize/)
- [Lucide React](https://lucide.dev/guide/react/)
- [Motion React](https://motion.dev/docs/react-installation)
- [qrcode.react](https://www.npmjs.com/package/qrcode.react)

**Decisión recomendada:** usar **Next.js + Bootstrap + CSS/SCSS + `next/font` + `next/image` + Lucide** como base. Agregar `qrcode.react` para mostrar QR reales; **reservar Motion y Recharts para necesidades comprobadas**. El valor principal está en la claridad del contenido, las demostraciones y la velocidad móvil, no en cargar más librerías.
