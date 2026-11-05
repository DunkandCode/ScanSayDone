# Verificación F5 — Aplicaciones en contexto (28-oct-2026)

> Revisado con `reviewer-alibaba`, `designer-alibaba` y `code-support` (Go, sin truncar) + capturas Playwright.
> Normas: `COPY-LANDING.md` §5, plano `wireframes/08-aplicaciones.svg`, `IMAGENES-REQUERIDAS.md`, `ASSET-PIPELINE.md` (reglas de QR y de fotos), `RIESGOS-USUARIO.md`.

## Veredicto

| Momento | Resultado |
|---|---|
| Primera versión (`abfd30b` + `5e3ffbd`, con 3 fotos generadas) | **NO CUMPLE** — los tres revisores coincidieron |
| Versión corregida (`3a0c23e`, marcos de referencia) | **CUMPLE CON RESERVAS** — la sección es honesta y la deuda queda declarada |

## Por qué falló la primera versión

| # | Hallazgo | Severidad | Origen |
|---|---|---|---|
| 1 | **Fotos generadas con personas en `public/`**: la regla P0 del proyecto dice que una imagen generada no va a producción; además la sección es de "casos de uso", así que un visitante asume que son clientes reales (riesgo de publicidad engañosa, no sólo de likeness) | **crítica** | los tres |
| 2 | **QR en coral en las fotos**: no escanea (coral sobre claro = 2.86:1); además `object-fit: cover` puede recortarlo | **crítica** | los tres |
| 3 | **Presupuesto de imágenes excedido**: la sección descargaba 71 / 235 / 456 KB en 1x / 2x / 3x contra un techo de 180 KB | alta | reviewer |
| 4 | `sizes` incoherente con el grid (y `-728.webp` sin uso) | media | reviewer + designer |
| 5 | Grid con `col-md-6 col-xl-4` en vez de `col-lg-4` (2 columnas entre 768 y 1199) | media | designer |
| 6 | Marco a 356×267 en lugar de 364×273 | media | designer |

## Correcciones aplicadas (`3a0c23e`)

| Punto | Antes | Ahora |
|---|---|---|
| Material | 3 webp generadas con personas y QR coral en `public/images/apps/` | **retiradas a `opendesign/referencias/apps/`**; `public/images/apps/` ya no existe |
| Marco | `<Image>` con foto | **marco de referencia**: 4/3, fondo `var(--brand-peach)`, isotipo 48 px ciruela y leyenda visible **"IMAGEN DE REFERENCIA"** |
| Etiqueta | sólo un comentario en código | **badge visible `DEMO`** (mostaza con texto ciruela) sobre cada marco |
| Grid | `col-12 col-md-6 col-xl-4` | **`col-12 col-lg-4`** → 1 / 3 columnas; a 1140 cada tarjeta mide **364 px** |
| Métrica | 356×267 | **364 × 273** (4/3 exacto) |
| Radio | `var(--radius-card, .75rem)` | `var(--radius-card)` sin fallback |
| `sizes` | heredado del layout viejo | alineado al grid definitivo |

Verificado: build exit 0 · 9 rutas 200 · 0 errores de consola · `check:tokens` y `check:placeholders` OK · HTML sin `/images/apps/` · leyenda y badge presentes · 1 columna en móvil (captura).

## Lo que sigue abierto

| # | Tema | Dueño |
|---|---|---|
| 1 | **Fotos reales del local piloto** con QR **ciruela, escaneable y vivo** (o retirar la sección del lanzamiento) | operador |
| 2 | Clarificar el presupuesto de imágenes: **¿180 KB por sección o por imagen?** y si las tarjetas quedan sobre el pliegue (ahí `loading=lazy` es anti-patrón de LCP) | diseño |
| 3 | Convención de ruta y manifiesto de imágenes (`landing/aplicaciones/` + `MANIFEST.md` con bytes medidos) | diseño |
| 4 | Conflicto menor en la doc: el plano pedía rótulo en coral; se implementó en `--text-2` porque coral como texto falla AA. Corregir el plano | diseño |
| 5 | `#aplicaciones` no está en el menú: decidir si entra en la navegación o queda sólo como sección de scroll | operador |

## Estado

| Check | Resultado |
|---|---|
| Build / rutas / consola | exit 0 · 9/9 → 200 · 0 errores |
| `check:tokens` · `check:placeholders` | OK · OK |
| Servidor de revisión | `http://localhost:3064` |
| Commits | `abfd30b` (sección) → `5e3ffbd` (assets, revertido de `public/`) → `3a0c23e` (remediación) |
