# Verificación F7 — Precios (28-oct-2026)

> Segunda opinión Go (`second-opinion --area frontend`) + auditoría de congruencia documental.

## Veredicto

**IMPLEMENTADA Y GATEADA — no publicada** (por diseño). La sección existe en código y no se renderiza ni se enlaza mientras falten los montos.

## Qué se construyó

| Elemento | Estado |
|---|---|
| Sección `#precios` en `page.js` | presente, **fuera del DOM** con el flag en `false` |
| Gate | `hasPricing()` = `showPricing` **y** 3 planes **y** precio no vacío en cada uno (`site.js:39`) |
| Datos | `SITE.plans: []` — **cero precios inventados** |
| Layout | 3 tarjetas `col-lg-4`, DOM recomendado→básico→negocio con reordenado visual; borde 2 px coral + badge en el recomendado; precio Bebas 48 |
| Menú | Precios sigue oculto en navbar y footer (mismo flag) |
| HTML verificado | `PLANES` → 0 · `RECOMENDADO` → 0 |

## Qué dijo la segunda opinión Go

| Hallazgo | Peso | Cómo quedó |
|---|---|---|
| Implementar gated deja **código que no se ejecuta** y coste de mantenerlo | **high** | aceptado: se implementó por calendario, con **gate doble** para que no pueda publicarse por accidente |
| El gate simple (flag) **no garantiza** que los precios sean reales | high | resuelto: `hasPricing()` exige 3 planes con precio no vacío; activar el flag sin datos **no** publica nada ni rompe el render |
| Falta definir estados (loading/empty/error) | medium | no aplica: la sección es estática; su "estado" es existir o no |
| Tokens: 48 px como valor literal | medium | pendiente de token `--fs-price` cuando se publique |
| Faltan pruebas del estado activo | medium | se probó el gate en ambos sentidos (flag on con datos de prueba → renderiza; revertido → no) |

**Recomendación del modelo**: esperar a tener precios. **Decisión tomada**: se deja implementada y bloqueada, porque el coste de hacerla ahora es menor que el de retomarla y el gate impide publicar incompleto.

## Requisito antes de activar

1. Los **3 montos reales** y la **moneda**.
2. Confirmar el reparto de features marcado `[confirmar]` en `COPY-LANDING` §7 (un QR por plan, varias encuestas, acceso por local, trato directo).
3. Confirmar la política de contrato (`Sin permanencia`).
4. Cambiar `site.js`: `plans` con los 3 objetos y `features.showPricing: true`.
5. Verificar: build, 3 tarjetas visibles, precios en el HTML, enlaces del menú apareciendo, contraste y teclado.

## Deuda declarada

- `--fs-price` no existe como token.
- La ruta `/pricing` sigue con copy de agencia: debe recibir el copy del producto en F8.
