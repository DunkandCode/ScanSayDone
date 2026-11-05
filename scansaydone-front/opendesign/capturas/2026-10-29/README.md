# Capturas 2026-10-29 — índice

> Vista del sitio servido en `http://localhost:3140` (**build regenerado tras las correcciones de `796c10f`**: FAQ en banda blanca, táctiles de 44 px, footer sin CTA primario y títulos de columna en overline). Desktop: viewport 1440, captura por selector. Móvil: viewport 375. Son **registro visual**: la fuente de medidas manda en los planos SVG (`wireframes/GRID-SPEC.md`), no aquí.

| archivo | qué muestra | viewport | para qué sirve |
|---|---|---|---|
| `land-01-hero.png` | banda ciruela del hero (720 px): kicker, H1 con `CLIENTES?` coral, CTA, teléfono | 1440 × 720 | revisión UX; regresión del glow y del acento coral |
| `land-02-franja.png` | franja de confianza, 4 claims (193 px) | 1440 × 193 | control de copy y del auto-fit; comparación futura |
| `land-03-como-funciona.png` | pasos ESCANEA/OPINA/LISTO con conector (569 px) | 1440 × 569 | regresión del conector y badges coral |
| `land-04-canales.png` | 4 tarjetas de canal a `col-xl-3` (748 px) | 1440 × 748 | regresión de `--border-strong` (3.03 ✓) |
| `land-05-aplicaciones.png` | 3 marcos placeholder 4/3 + badge DEMO (682 px) | 1440 × 682 | **antes/después cuando entren las fotos reales** |
| `land-06-panel.png` | marco de captura 856×535 + 2 callouts (736 px) | 1440 × 736 | regresión del fallback del panel (§6-P1-6 REVISION-UX) |
| `land-07-faq.png` | acordeón 5 ítems + pie (762 px) | 1440 × 762 | control del fondo crema adyacente a Panel (§6-P0-2) |
| `land-08-cta-final.png` | banda ciruela de cierre, botón 56 px (499 px) | 1440 × 499 | regresión del flip ciruela↔crema y del descargo |
| `land-09-footer.png` | footer crema: columnas, enlaces, CTA discutido (434 px) | 1440 × 434 | auditoría del CTA del footer (§6-P0-4) y títulos 36 px |
| `movil-375-hero.png` | hero completo apilado (939 px) | 375 × 939 | above-the-fold funcional; sin scroll horizontal |
| `movil-375-faq.png` | acordeón en móvil (768 px) | 375 × 768 | targets y tipografía 16 px en móvil |
| `ruta-aboutus.png` | `/aboutus` captura de página (1610 px) | 1440 × 1610 | estado del copy de producto post-F9 |
| `ruta-services.png` | `/services` sobre el pliegue | 1440 × 900 | page-hero + primeras tarjetas |
| `ruta-service-detail.png` | `/service-detail` sobre el pliegue | 1440 × 900 | patrón `page-hero` con breadcrumb |
| `ruta-contactus.png` | `/contactus` captura de página (1719 px) | 1440 × 1719 | evidencia del aviso "canal no habilitado" |
| `ruta-terms.png` | `/terms` sobre el pliegue | 1440 × 900 | aviso legal único (arriba) |
| `ruta-privacy.png` | `/privacy` sobre el pliegue | 1440 × 900 | control del P0 legal corregido en F9 |
| `ruta-faqs.png` | `/faqs` sobre el pliegue | 1440 × 900 | coherencia con el FAQ de la home (mismo módulo) |
| `ruta-pricing.png` | `/pricing` sobre el pliegue | 1440 × 900 | **base para rediseñar `/pricing` con precios reales** |

Las 7 `ruta-*` de 900 px son **solo el pliegue** (el cuerpo bajo el hero no está en imagen); `aboutus` y `contactus` salieron a página completa — al regenerar, elegir un criterio uniforme y anotarlo aquí.

## Cómo regenerar

```powershell
cd E:\Trabajos\scan
git status --short              # el árbol debe estar limpio (o anotar los desvíos)
npm run build
npx next start -p 3120          # en otra ventana
# Playwright: browser_resize 1440x900 -> browser_navigate http://localhost:3120/
# -> browser_take_screenshot por selector:
#   .hero-band, .trust-strip, #como-funciona, #canales, #aplicaciones, #panel, #faq, #cta-final, footer
# movil: browser_resize 375x812 -> .hero-band y #faq
# internas: una captura de viewport 1440 por cada una de las 8 rutas
```

## Advertencia

**Una captura vieja no vale si cambió el build.** Estas capturas pertenecen al build de las 09:46 del 29-oct; a las 09:48 se editó el copy de `/aboutus` y `/service-detail` (futuro "Armarás…") sin reconstruir — esas dos capturas muestran la forma vieja. Antes de comparar nada: `npm run build` nuevo, carpeta de fecha nueva, y en cada set anotar commit + hora. Nunca sobreescribir una fecha pasada; se crea la siguiente.
