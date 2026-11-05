# ANALISIS-REFERENCIAS — lámina `brand-src/referencias.png` (1536×1024)

> 2026-10-27 · designer-alibaba · complementa `ANALISIS-wan-designspec.md`, no lo repite. Método: lectura
> visual + muestreo sharp + contraste con fórmula WCAG exacta (regla `INDEX.md` #6: prohibido "se ve
> bien") + context7/mdn/RAG. **La lámina es un activo derivado de presentación** (PNG generado para
> mostrar la marca): documenta reglas, pero no es fuente de verdad de color.

## 1. Qué aporta la lámina (antes indocumentado)

- **Arquitectura de marca en 4 variantes**: horizontal (uso principal), vertical (espacios reducidos),
  isotipo (app, web, QR, impresión) y **una tinta** (todo coral / todo oscuro sobre fondo claro).
  `ASSET-PIPELINE §1` tenía horizontal oscuro/claro, isotipo y "monocromo P1": **faltaba la variante
  vertical como entregable** y el monocromo no era regla de primer nivel.
- **Regla de una tinta**: impresión barata, vinilo, sello; con el master `currentColor` (ya previsto)
  basta. La lámina fija que la tinta única va **sobre fondo claro**, nunca al revés.
- **Construcción del icono**: retícula + círculos guía + "proporciones claras y equilibradas, funciona
  en tamaños pequeños" → plantilla del calcado del Plan B (ASSET-PIPELINE §2); no existía referencia
  gráfica de la geometría.
- **Descriptor anclado**: bajada "ESCANEA. OPINA. LISTO." + "Mejores experiencias para cada negocio." —
  copy de marca reutilizable (footer, OG, cartel), no inventado en sesión.
- **Tipografía**: confirma Bebas Neue + Montserrat (contrato §3); no aporta tokens nuevos.
- **Estilo de presentación reutilizable** (hallazgo operativo): 3 bandas 30/30/40 · separadores 1px ·
  rótulos MAYÚS 10–12px tracking .05em · captions de 2 líneas (nombre negrita + uso gris) · especímenes
  "Aa" · aplicaciones en 3 columnas con foto realista. RAG: "la identidad de marca debe usarse
  apropiadamente en todas las superficies relevantes" (`chk:b0283e475d10c07e592926b84d96`) y comps como
  defensa de la marca (`chk:04ae3ca4a7105803f1829da42de3`, book-ux-skills-business).

## 2. Tabla de conflictos de color (decisión central)

| Rol | Guía | Logo PNG | Lámina (wan) | Lámina (sharp, medido) | Recomendación |
|---|---|---|---|---|---|
| Coral de marca | `#FF6B5B` | `#FF5F44` | `#FF6B55` | `#FF6050` | **`#FF5F44` — F6 se mantiene** |
| Oscuro UI | `#2E1E3F` | — | `#111827` | `#101010`/`#101020` | **`#2E1E3F`** |
| Oscuro assets (wordmark) | — | `#000014` | — | — | **`#000014`** |

Quinto coral en disputa: `#FF5040` (favicon medido, contrato §1). Contrastes calculados (fórmula WCAG):

| Coral | vs blanco | vs crema `#FFF8F2` | blanco encima | ciruela encima | veredicto |
|---|---|---|---|---|---|
| `#FF6B5B` guía | 2.80 ✗ | 2.66 ✗ | 2.80 ✗ | 5.46 ✓ | texto nunca; superficie sí |
| `#FF5F44` logo PNG | 3.01 ✗ | 2.86 ✗ | 3.01 ✗ | 5.08 ✓ | **token único** |
| `#FF6B55` lámina-wan | 2.81 ✗ | 2.67 ✗ | 2.81 ✗ | 5.45 ✓ | eco del eco → fuera |
| `#FF6050` lámina-sharp | 2.98 ✗ | 2.83 ✗ | 2.98 ✗ | 5.13 ✓ | ±4/255 de F6 → fuera |
| `#FF5040` favicon | 3.24 ✗ | 3.08 ✗ | 3.24 ✗ | 4.71 ✓ | error de re-export → fuera |

| Oscuro | vs blanco | vs crema | vs ciruela | veredicto |
|---|---|---|---|---|
| `#2E1E3F` | 15.29 ✓ | 14.53 ✓ | — | token UI vigente |
| `#000014` | 20.79 ✓ | 19.76 ✓ | 1.36 ✗ | solo assets; invisible sobre ciruela → en banda oscura va logo CLARO |
| `#101010`/`#101020` | 19.03/18.80 ✓ | 18.09/17.87 ✓ | 1.24 ✗ | grises fotográficos de escena, no marca → fuera |
| `#111827` wan | 17.74 ✓ | 16.86 ✓ | 1.16 ✗ | lectura del modelo sobre `#000014` → fuera |

**Por qué `#FF5F44` único**: (1) los cinco fallan igual como texto sobre claro (2.66–3.24 < 4.5) y pasan
igual como superficie con ciruela encima (4.71–5.46 ≥ 4.5) → la elección no mueve accesibilidad; (2) Δ
≤8/255 por canal, imperceptible; (3) es el valor del activo físico ya repartido (PNG); relinear a la
guía exigiría la fuente vectorial que no existe; (4) los valores de lámina son deriva doble (modelo →
PNG → lámina; mi sharp da `#FF6050` a ±4 del real: medir sobre ella introduce error, no verdad nueva).
**No relinear tokens a la lámina.** Hallazgo: el botón "Enviar" de la lámina usa **blanco sobre coral =
2.98 ✗** (falla hasta el 3.0 de texto grande); el par del contrato (ciruela 5.08 ✓) gana — no copiar.

## 3. Conflicto de las caras (emoji vs decisión SVG + 1–5)

La lámina muestra 5 caras **emoji en color** (rojo→verde) en el mock de encuesta. La decisión del
proyecto — **caras de línea SVG + número 1–5, emoji prohibido** — **se mantiene**: contrato §6, §5
("ningún estado solo por color"), `mockups/INDEX.md` ítems 2 y 5 (no estilizable, render variable por
SO, color único canal; deuteria ≈5–8 % de hombres). El mock es presentación, no especificación.

**Cómo implementarlo sin cambiar la decisión**:
1. Activo normativo único: componente SVG local "escala de caras" — trazo `#2E1E3F`, línea, **número 1–5
   + etiqueta verbal** debajo; seleccionado = borde 2px coral + fondo `--action-selected` + check
   visible (contrato §5, fila opción encuesta).
2. El render "pantalla de encuesta" de la landing se re-regenera con esa escala (prompt wan: "line-icon
   faces with numbers 1-5, coral button, dark button text") — cierra también el pendiente del mockup 04.
3. Cartel de mesa impreso: **el mismo SVG** exportado a PDF (consistencia entre superficies,
   `chk:b0283e47…`). Si el operador quiere emoji solo en material físico impreso es defendible (el print
   no varía por SO ni lo lee un SR), con condición: número 1–5 impreso bajo cada cara. En web, no.

## 4. Qué se adopta para la landing

Sección **"Así se ve en tu local"** (posición 5: tras Canales, antes de la captura del panel) — queda
especificada en `UX-LANDING §2` fila 5 + wireframe §3.4b: 3 tarjetas `container-xl · col-lg-4×3` (12
columnas BS, gutters 24px — `context7:/twbs/bootstrap` grid.mdx: "12 template columns per row… column
classes indicate the number of template columns to span"); fondo **blanco** (crema→blanco→crema,
regla "dos fondos iguales nunca adyacentes"); foto 4/3 `object-fit:cover` (mdn: C32/F36/S10); rótulo
MAYÚS + **caption 2 líneas** (nombre Montserrat 600 + uso 14px `--text-2`); separadores 1px
`var(--border)` (no `#E5E7EB`/`#F0F0F0` de la lámina); sin CTA por tarjeta (informativos, como Canales).

## 5. Qué NO se copia de la lámina (y por qué)

- **Emoji de color** en cualquier UI web (contrato §6 → §3 arriba).
- **Blanco sobre coral** en botones (2.98 ✗ — el contrato ya usa ciruela 5.08 ✓).
- **Sus colores como tokens** (`#FF6B55`, `#111827`, `#101010`): activo derivado + grises de escena.
- **Personas reales/manos** en las fotos: lo sintético envejece mal y abre riesgo de licencia e
  identificación; producto sobre mostrador/mesa/vitrina **sin personas** (`criterio propio`).
- **10px como tamaño base en pantalla**: los rótulos de la lámina son de sheet impreso; en web rige el
  overline del contrato (13/12px, .14em — mdn `letter-spacing`, universal). Se hereda la función
  (MAYÚS+tracking+gris), no el valor.
- **Especimen "Aa" gigante**: patrón de print; en el landing la tipografía se muestra en uso (H2 Bebas),
  no con fichas de fuente (`criterio propio`: relleno).
- **Retícula fija 1536×1024 / bandas 30-30-40 en px**: migran los patrones de presentación, no los
  píxeles de una lámina estática.

## 6. Fuentes

- `context7:/twbs/bootstrap` (grid.mdx · containers.mdx; query "grid system rows columns col-lg-4
  gutters breakpoints"). · `mdn: css.properties.object-fit` (C32/F36/S10) · `letter-spacing` (universal).
- RAG: `chk:b0283e475d10c07e592926b84d96` · `chk:04ae3ca4a7105803f1829da42de3` ·
  `chk:fe8ce4c63e6b3398ab0ee280a43a` (book-ux-skills-business). Query "logo lockup variations" → 0 hits
  (rarest-term `lockup`, sources=0) → lo afirmado de §1 sobre lockups es lectura de lámina + `criterio
  propio`.
- Docs del proyecto: `DESIGN-CONTRACT.md` §1–§6 · `ASSET-PIPELINE.md` §1–§3 · `UX-LANDING.md` §2/§4/§6 ·
  `mockups/INDEX.md` ítems 2/5 · `ANALISIS-wan-designspec.md`.
- Contrastes: calculados esta sesión con la fórmula WCAG; los del contrato (14.53 · 15.29 · 3.01 · 2.86 ·
  5.08 · 1.36) coinciden — verificados, no copiados.
