# Scan-Say-Done — Análisis de la pieza QR (28-oct-2026)

> Cierre de la pieza QR antes de F3. Insumos: visión `wan-image` qwen3.7-plus sobre `mockups/01-hero-desktop.png` y `13-app-tabletent.png`; spec de `ASSET-PIPELINE.md` §4 (ISO/IEC 18004); contrastes de `DESIGN-CONTRACT §1/§4` y del acta F2. Nada se mide de nuevo; lo derivado va etiquetado como derivado o estimación.

## 1. Qué muestran los mockups

| Mockup | Proporción del QR | Quiet zone | Color de módulos | Veredicto |
|---|---|---|---|---|
| `01-hero-desktop.png` | ~60–65 % del ancho de su tarjeta (~50 % del alto); tarjeta QR + teléfono juntos en la columna derecha | amplia | ciruela muy oscuro sobre blanco, módulos nítidos, contraste alto | **referencia válida completa**: proporción ✓ color ✓ (aprobada como referencia de layout en `mockups/INDEX`) |
| `13-app-tabletent.png` | ~50–60 % del ancho del cartel | uniforme (10–15 % del QR) | coral/salmon ~#E8907E sobre crema ~#FDFBF7 | **NO es referencia imprimible**: coral sobre crema = 2,86:1 → no escanea; bordes irregulares (IA, no vectorial) |

**Advertencia explícita:** el mockup 13 solo sirve como **dirección de proporción y composición**. Su color de módulos es exactamente el caso de fallo que §4 de `ASSET-PIPELINE` prohíbe (2,86:1 del coral frente a 14,53:1 del ciruela). A imprenta no se envía nunca un mockup: se envía el SVG vectorial con las reglas de este documento.

## 2. Proporciones normativas

Derivación (todo desde `ASSET-PIPELINE` §4): URL en modo byte = `https://` + host (≤27 car) + `/e/` + nanoid 8–10 → **36–38 B típico, 48 B peor caso**. Tabla documentada: V3-M hasta 42 B, V4-M hasta 62 B → el QR canónico es **V3-M = 29×29 módulos**; 43–48 B → **V4-M = 33×33**. Con quiet zone de 4 módulos el lado total pasa a **37 módulos** (V3) o **41** (V4). Tamaño mínimo de impresión a 0,6 mm/módulo (documentado): V3 ≥18 mm · V4 ≥20 mm; pie de mesa **≥25×25 mm**; mural **≥100 mm**.

| Soporte | Ancho del QR vs contenedor | Quiet zone | Tamaño mínimo | ECC | Color de módulos |
|---|---|---|---|---|---|
| Hero / tarjeta web *(solo si se usara — ver §3)* | 60–65 % (dirección del mockup 01) | ≥4 módulos dentro de la tarjeta | n/a en pantalla: el lector es un móvil a ~15–30 cm; validar con la prueba de 3 dispositivos y captura DPR1 | M | ciruela `#2E1E3F` sobre crema/blanco |
| Cartel de mesa | 50–65 % (mockup 13 mide 50–60 %) | ≥4 (recomendado 6) | ≥25×25 mm (`ASSET-PIPELINE` §4, pie de mesa) | M | ciruela sobre crema/blanco |
| Vinilo de vitrina | 50–65 % | ≥6 (exterior: lectura a través de cristal) | ≥100 mm — se clasifica por la regla **mural** (distancia de lectura 1–3 m igual); no hay medida intermedia documentada → confirmar con la prueba de 3 dispositivos | M | ciruela sobre crema/blanco |
| Pantalla de encuesta (mostrador) | 50–65 % | ≥4 | ≥120 px de lado *(estimación derivada, no medida: 37 módulos × ~3,2 px/módulo a DPR1; si la pantalla es la del propio móvil, el QR no aplica — la encuesta se abre por enlace)* | M | ciruela sobre crema/blanco |
| Pieza impresa A6 (105×148 mm) | 50–65 % de 105 mm → 52–68 mm | ≥4 (recomendado 6) | ≥25 mm por el estándar pie de mesa (uso en mano), que además supera el mínimo V3-M de 18 mm | M | ciruela sobre crema/blanco |

**Por qué la banda 50–65 %:** por debajo del 50 % el módulo cae bajo el límite físico de escaneo a la distancia del soporte; por encima del 65 % el QR se come la jerarquía del cartel. Los dos mockups válidos como dirección (01 y 13) caen dentro de la banda. **ECC H solo si algo tapa el centro** (36–38 B → V5-H, 37×37: recalcular tamaño en cada caso).

## 3. Veredicto sobre el hero: **opción A**

El QR no es decoración: es una **promesa de acción**. Quien escanea obtiene la URL en vivo o un 404 — y un 404 en el hero contradice la promesa central del producto (escanea → opina → listo) en la zona de mayor exposición y menor confianza.

- **A (recomendada): el hero se queda solo con el teléfono** (como está implementado y verificado en F2: tarjeta de encuesta 1–5, 0 raster). El QR aparece en la sección **"Así se ve en tu local" (F5)** cuando exista un código real y vivo, con las medidas de §2. Cuesta cero: F5 ya es la sección que muestra la señalética en contexto; el mockup 05 (mostrador con QR) ya apunta ahí.
- **B: el hero incorpora la tarjeta QR solo después de que exista la ruta demo** `/e/<código>`, con las medidas de §2. Es aceptable condicionalmente, pero deja F3 rehén de un bloqueador externo (la ruta) y duplica el rol del QR que F5 ya cubre.

**Razón de la elección:** no se publica nunca un QR que no resuelve; la ruta demo no existe hoy; el hero cerrado en F2 no se reabre. A desbloquea F3 sin deuda falsa; B vuelve a entrar solo como evolución natural de A cuando el código exista.

## 4. Reglas de la pieza QR (verificables)

1. Módulos **siempre ciruela `#2E1E3F`** (14,53:1 sobre crema; 15,29:1 sobre blanco) o negro (21:1 sobre blanco), sobre crema/blanco con reflectancia ≥70 %.
2. **Nunca coral `#FF5F44` como módulo**: 2,86:1 sobre crema — no escanea (el mockup 13 es la prueba visual del fallo).
3. Quiet zone **≥4 módulos** (recomendado 6); nada toca el área de descanso.
4. **ECC M mínimo**; H solo si algo tapa el centro, y entonces recalcular versión y tamaño (36–38 B → V5-H).
5. **Sin logo ni texto dentro del símbolo**: el isotipo va JUNTO, nunca encima.
6. Sin degradados, sin tramas, sin inversión de colores, sin módulos redondeados en versión ≥3 o <50 mm.
7. Fuente **vectorial** (SVG → PDF/≥300 ppp); nunca redibujar de un PNG de mockup ni recibir mapa de bits.
8. Respetar el tamaño mínimo por soporte de la tabla §2.
9. **Prueba de escaneo en 3 dispositivos antes de imprimir** (20 cm, luz de vitrina y sombra — protocolo ya escrito en `ASSET-PIPELINE` §4).
10. El QR que se muestre en la web apunta a una **URL real y viva** (`/e/<nanoid 8–10>`); si la ruta no existe, no existe el QR. Cambiar dominio o longitud de código obliga a recalcular versión/ECC/tamaño: el presupuesto no es reutilizable.

## 5. Qué cambia en F3: nada — afirmación CONFIRMADA

F3 es la sección "Cómo funciona" (3 pasos blancos, badges 1-2-3 Bebas, sin emoji, apilado móvil DOM 1→3) más la deuda D1 (strip de confianza) — véase `PLAN-EJECUCION-LANDING` F3 y `VERIFICACION-F2` §6. **Ningún ítem de F3 toca el QR.** El hero no cambia: sigue sin QR (opción A), y la entrada del QR real queda fijada para F5 con las medidas de §2. Este documento no modifica `src/` ni `package.json`.

## Fuentes

- `ASSET-PIPELINE.md` §4 — spec QR (bytes→versión, ECC, quiet zone, tamaños 0,6 mm/módulo, prohibiciones). Base de toda derivación.
- `wan-image` qwen3.7-plus: mediciones de visión sobre `01-hero-desktop.png` y `13-app-tabletent.png` (28-oct, dadas por el brief).
- `mockups/INDEX.md` líneas 10 y 14 (tarjeta QR en hero; mostrador con QR en canales) y veredicto "referencia de layout" de 01.
- `VERIFICACION-F2.md` §1 (contraste crema/ciruela 14,53; hero CUMPLE sin QR) · `DESIGN-CONTRACT.md` §1 (coral solo decorativo ≥24 px).
- Contraste ciruela/blanco **15,29:1 calculado aquí** (fórmula WCAG, L(ciruela)≈0,0187); 14,53 y 2,86 ya documentados.
