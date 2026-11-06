# Activos de marca — ubicación y reglas

> Origen: `C:\Users\k_spi\Downloads\logosPng` · copiados al proyecto el **2026-11-06** por orden del operador.
> Integridad verificada **4/4**: los cuatro archivos coinciden byte a byte con los SHA-256 registrados en
> `scansaydone-front/ENTREGA-UX-2026-10-30/brand-src/MANIFEST.md` (verificación del 27-oct-2026).

## 1. Estructura

```
assets/marca/
├── fuente/                 ← originales intactos. NO se sirven, NO se editan.
│   ├── logoScanCoral.png   2172 × 724   (3:1)   lockup horizontal con wordmark
│   ├── faviconScan.png     1254 × 1254  (1:1)   isotipo, base de favicon e iconos
│   ├── referencias.png     1536 × 1024          lámina de identidad (4 variantes + retícula)
│   ├── logoDunk.png        1774 × 887           marca de la empresa que desarrolló el sistema
│   └── logo-symbol.svg     vector 128           isotipo una tinta, geometría autorizada
└── MANIFEST-ASSETS.md      ← este archivo

scansaydone-front/public/img/marca/
└── logo-dunk.png           ← única marca que se sirve hoy, para el pie
```

**Por qué solo `logo-dunk.png` está en `public/`:** el manifiesto de marca deroga los lockups en SVG y fija que
el lockup vigente es **isotipo SVG inline + wordmark como texto vivo en HTML**. Por eso `logoScanCoral.png`
—que es un lockup rasterizado— **no** se sirve: es la referencia para derivar, no la pieza final. Servirlo
directo es exactamente el error que produjo el logo deformado a 4.2:1 (en lugar de 3:1).

`referencias.png` **nunca** va a `public/`: es una lámina de trabajo de 1,6 MB, no un activo de página.

## 2. Integridad

| Archivo | Bytes | Dimensiones | SHA-256 (16) |
|---|---:|---|---|
| `logoScanCoral.png` | 333.479 | 2172 × 724 | `49828707B93209D3` |
| `faviconScan.png` | 233.510 | 1254 × 1254 | `1B6DA22BFA2910E1` |
| `referencias.png` | 1.618.880 | 1536 × 1024 | `6BE128CA305117CE` |
| `logoDunk.png` | 298.801 | 1774 × 887 | `8D10F973DEB31C3D` |
| `logo-symbol.svg` | 1.207 | vector | `FDCD347A69D3ADC5` |

Verificación reproducible:

```powershell
Get-ChildItem "assets\marca\fuente" -File | ForEach-Object {
  "{0}  {1}" -f $_.Name, (Get-FileHash $_.FullName -Algorithm SHA256).Hash.Substring(0,16)
}
```

## 3. Colores medidos en los activos (no confundir con la UI)

| Activo | Coral | Oscuro |
|---|---|---|
| `logoScanCoral.png` | `#FF5F44` | `#000014` (tinta del wordmark) |
| `faviconScan.png` | `#FF5040` | — |
| `referencias.png` | `#FF6050` | `#101010` / `#101020` |

El coral de la **interfaz** es `interactive-primary` `#FC5A41`, distinto del coral de marca. El isotipo es
**una tinta** (`currentColor`), así que se pinta con `text-primary` y el conflicto desaparece: la web nunca
necesita el coral de marca.

## 4. Reglas de uso (heredadas del manifiesto de marca, siguen vigentes)

- Lockup digital mínimo **108 × 36**; wordmark **nunca < 24 px**; isotipo **≥ 16 px** (a 16, variante sin los tres puntos).
- Resguardo: **0,5 × la altura del isotipo** por los cuatro lados.
- Lockup = **isotipo SVG inline + wordmark texto vivo**. Prohibido rasterizar el wordmark.
- Prohibido: logo sobre coral (2,86 ✗), tinta `#000014` sobre ciruela (1,36 ✗), deformar la proporción.
- **Pendiente medido:** el wordmark servido hoy mide **16 px** y el piso de marca es **24 px**. Se corrige en el lote final del logo, junto con la incorporación del isotipo.

## 5. Cambio de decisión registrado (C-93)

El manifiesto original marcaba `logoDunk.png` como **«DESCARTADO por el operador — no se usa en ninguna pieza»**.
El **2026-11-06** el operador indicó que la marca de la empresa desarrolladora va **en el pie**. Esta instrucción
posterior reemplaza aquel descarte: queda registrada como **C-93** y el archivo pasa a `public/img/marca/`
como activo servible.

Consecuencia pendiente: 298 KB de PNG es mucho para una marca de pie. Al implementarla se deriva una versión
optimizada (ancho ≤ 240 px, WebP) y se conserva el original aquí, en `fuente/`.

## 6. Derivaciones aún no hechas

| Destino | Fuente | Cuándo |
|---|---|---|
| `src/app/icon.png` (512) · `apple-icon.png` (180) · `favicon.ico` (32/16) | `faviconScan.png` | lote del logo |
| `og-image.png` 1200 × 630 | lockup + tipografía | lote del logo |
| isotipo inline en barra y pie | `logo-symbol.svg` | lote del logo |
| marca de la empresa en el pie | `logoDunk.png` → WebP ≤ 240 px | lote del logo |

Ninguna de estas derivaciones se hizo todavía: el operador dejó el logo para el final.
