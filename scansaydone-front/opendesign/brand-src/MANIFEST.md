# Manifiesto de activos de marca

> Origen: `C:\Users\k_spi\Downloads\logosPng` · copiados el 27-oct-2026 con verificación SHA-256 (4/4 **IDÉNTICO**).
> Esta carpeta es la **fuente intocable**: no se edita, no se rasteriza, no se consume directo desde la landing.

## Inventario

| Archivo | Dimensiones | Peso | SHA-256 (16) | Estado | Para que sirve |
|---|---|---|---|---|---|
| `logoScanCoral.png` | 2172 × 724 (3:1) | 326 KB | `49828707B93209D3` | **VÁLIDO** | lockup horizontal: base para derivar las 4 variantes SVG |
| `faviconScan.png` | 1254 × 1254 (1:1) | 228 KB | `1B6DA22BFA2910E1` | **VÁLIDO** | isotipo: base de `icon.png` (512), `apple-icon` (180) y `favicon.ico` (32/16) |
| `referencias.png` | 1536 × 1024 | 1581 KB | `6BE128CA305117CE` | **VÁLIDO** | lámina de identidad: 4 variantes, retícula de construcción del icono, tipografías, una tinta, 3 aplicaciones |
| `logoDunk.png` | 1774 × 887 | 292 KB | `8D10F973DEB31C3D` | **DESCARTADO** por el operador | no se usa en ninguna pieza. Se conserva solo como registro |

Todos con canal alfa (RGBA) salvo la lámina (RGB). Fondo transparente en logo e isotipo, verificado con muestreo de esquinas.

## Colores medidos en los activos (no confundir con la guía)

| Activo | Coral | Oscuro |
|---|---|---|
| `logoScanCoral.png` | `#FF5F44` | `#000014` (tinta del wordmark) |
| `faviconScan.png` | `#FF5040` | — |
| `referencias.png` | `#FF6050` | `#101010` / `#101020` (grises de escena fotográfica) |

**Token adoptado: `#FF5F44`** (acta §6). El favicon se re-exporta desde el canónico; no se usa `#FF5040` como token.

## Que se deriva de aqui (y que NO)

| Se deriva | Destino |
|---|---|
| `logo-horizontal-dark.svg` · `logo-horizontal-light.svg` | `public/images/brand/` |
| `logo-vertical-dark.svg` · `logo-vertical-light.svg` | idem |
| `logo-symbol.svg` (`currentColor`) · `logo-mono.svg` (una tinta) | idem |
| `icon.png` 512 · `apple-icon.png` 180 · `favicon.ico` 32/16 | `src/app/` (convención de archivos de Next) |
| `og-image.png` 1200×630 | `public/images/brand/` |

**No se deriva**: ninguna variante con el logo sobre coral (2.86 ✗), ni con tinta `#000014` sobre ciruela (1.36 ✗), ni el logo deformado a la proporción del template (hoy 93×22 = 4.2:1 en lugar de 3:1).

## Reglas de uso (resumen; detalle en `../ASSET-PIPELINE.md`)

- Tamaño mínimo: horizontal 108 × 36 px digital / 20 mm impreso · wordmark nunca <24 px · isotipo ≥16 px (a 16 se usa la versión **sin los 3 puntos**).
- Área de resguardo: **0.5 × la altura del isotipo** por los 4 lados.
- Lockup = **isotipo SVG + wordmark como texto vivo** en HTML (`currentColor` solo tiene sentido inline; dentro de un `<img>` SVG no vale porque no carga fuentes — por eso el SVG es solo el isotipo). Decisión vigente 27-oct en `../ASSET-PIPELINE.md` §«Decisión vigente»: derogados outlined y `logo-horizontal/vertical/mono-*.svg`; referencia de composición: `lockup-preview.html`.

## Verificación de integridad

```powershell
Get-FileHash opendesign\brand-src\*.png -Algorithm SHA256
# debe coincidir con la columna SHA-256 de arriba
```
