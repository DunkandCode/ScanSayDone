# VERIFICACIÓN — Vidrio cálido del login (05-nov-2026)

> Alcance: llevar `/entrar` a la **variante derecha** de la referencia (`referencias/login-referencia-contenedor-2026-11-05.jpeg`): fondo cálido en degradado + tarjeta translúcida.
> Verificación en 3 pasos: **píxeles del render** (System.Drawing sobre la captura), **contrastes WCAG** calculados sobre esos píxeles y **wan-image** (`qwen3.7-plus`) en tres modos.
> Capturas: `capturas/2026-10-30/glass5-login-lleno-1440.png` (final), `glass5-login-375.png`, y las intermedias `glass-*`, `glass2-*`, `glass3-*`, `glass4-*`.

## 1. Tres iteraciones, cada una con su medida

El primer intento **tenía el efecto escrito en CSS pero no se veía**. Se detectó midiendo píxeles, no mirando.

| # | Qué se hizo | Qué dijeron los píxeles | Veredicto |
|---|---|---|---|
| 1 | degradado mostaza 18/38 %, vidrio 78 %, sombra 8/16 % | fondo arriba `#FDF9F4` **más claro** que la tarjeta `#FFF5EC`; separación arriba `(+2,+13,+37)`, abajo `(+4,+23,+66)` | el canto superior se hundía: el fondo ganaba a la tarjeta justo donde empieza |
| 2 | paradas 26/36/46 %, sombra 10/20 %, filo interior de 1 px | filo `#FFFDFA` contra tarjeta `#FFF3E6`; separación `(+4,+18,+51)` → `(+4,+34,+72)` | flota. Pero el modelo de visión siguió diciendo **SOLIDA** |
| 3 | paradas 38/46/54 %, vidrio 72 %, masa coral 20 % con `blur(6px)` bajo la tarjeta | variación **dentro** de la tarjeta `#FEF1DC` → `#FEEFD8` → `#FEEDD6`; fondo al lado `#F6D394` | el vidrio empieza a recoger el fondo. Nota del modelo **7/10** |

## 2. Lo que dijo wan-image (las tres pasadas)

| Modo | Pregunta | Resultado |
|---|---|---|
| `design_spec` | describir el diseño | detecta "warm creamy gradient `#fdf0d5` → `#fcdcb0`" y tarjeta "`#fff9f0` very light cream". **No menciona translucidez** |
| `validation` (config = lo esperado) | ¿cumple lo pedido? | **PASS 98 %**; la única salvedad: *"the translucent quality appears mostly solid"* |
| `question` (3 pasadas) | ¿vidrio? ¿degradado? ¿flota? | degradado **SÍ** · vidrio **NO → NO → NO** · flota **SÍ** · nota **3/10 → 3/10 → 7/10** |

**Conclusión honesta:** el degradado cálido está y se ve. La translucidez **no se percibe como vidrio esmerilado**, y el motivo es físico, no de CSS: *una superficie translúcida sobre un degradado liso no tiene nada que dejar ver*. El desenfoque de fondo (`backdrop-filter`) actúa sobre píxeles que ya son uniformes, así que no produce ningún cambio visible. La referencia tiene el mismo límite: su tarjeta tampoco deja ver nada, solo está **más oscura** que su fondo.

Lo que sí se logró, y es lo que da la sensación: **la tarjeta es más clara que el fondo en toda su altura**, tiene **filo de luz de 1 px**, **sombra cálida** y **varía de tono hacia abajo** porque recoge el fondo. Esos cuatro signos son los que sostienen el efecto.

## 3. Contraste medido sobre píxeles reales (no sobre el CSS)

| Texto | Superficie (hex muestreado) | Ratio | AA |
|---|---|---|---|
| ciruela `#2E1E3F` | tarjeta arriba `#FEF1DC` | **13.83** | AAA |
| texto-2 `#65586E` | tarjeta arriba `#FEF1DC` | **5.93** | AA |
| texto-2 `#65586E` | tarjeta abajo `#FEEFD6` | **5.84** | AA |
| enlace `#B23A2A` | tarjeta abajo `#FEEFD6` | **5.25** | AA |
| enlace `#B23A2A` | **fondo** arriba-izq `#FBEACB` | **5.02** | AA |
| enlace `#B23A2A` | fondo abajo (sin texto encima) | 4.45 | **no aplica: no hay texto ahí** |

El único punto por debajo de 4.5 es la mitad inferior del fondo, donde no hay ningún texto: la tarjeta lo cubre y en móvil el enlace queda arriba. Consta como límite del degradado: **no poner texto suelto en la mitad inferior**.

## 4. El anti-slop de wan-image no es evidencia

Tres imágenes distintas (la referencia, nuestro primer intento y el final) devolvieron **exactamente el mismo resultado**: `60/100` y las mismas tres alertas — `gradient_purple_cyan`, `default_fonts: Inter`, `card_left_border 4px`. Ninguna de las tres es cierta en ninguna de las tres imágenes: no hay púrpura-cian, la tipografía es Bebas + Montserrat, y no existe borde izquierdo de color.

Que dé el mismo veredicto con el mismo detalle para imágenes distintas demuestra que ese check **no se calcula sobre la imagen**. Sirve el inventario de bloques y la paleta; **no** sirve como aprobación de calidad.

## 5. Cambios aplicados

| Archivo | Qué |
|---|---|
| `_tokens.scss` | `--grad-warm` (3 paradas: mostaza 38/46/54 % sobre crema) y `--shadow-glass` (ciruela 10 % y 20 %, cálida) |
| `_login.scss` `.login-left` | `background: var(--grad-warm)` + `::before` con resplandor claro arriba-izq y masa coral 20 % abajo-der, con `blur(6px)` |
| `_login.scss` `.login-card` | vidrio al 72 % de crema, borde `#FFFFFF` al 70 %, `backdrop-filter: blur(14px) saturate(104%)`, `--shadow-glass` + filo `inset 0 1px 0`, `z-index: 1` |
| `_login.scss` (final) | `@supports not (backdrop-filter)` → fondo al 90 % en vez de 96 % |

Todo derivado de la paleta: **cero hex nuevos**. Los dos tokens usan `color-mix` sobre `--bg`, `--brand-mustard`, `--brand-coral` y `--brand-plum`.

## 6. Guardas

`next build` → `✓ Compiled successfully` · `check:tokens` OK · `check:placeholders` 0 · `scrollWidth − clientWidth` = 0 a 1440 y 375 · estado enviado y de error intactos (no se tocó el JSX).

## 7. Pendiente

1. **`wireframes/10-login.svg` sigue cotizando el login sin degradado ni vidrio.** Ahora el desfase es mayor que antes del lote A1: plano y código describen dos pantallas distintas.
2. Si se quiere el vidrio **inequívoco**, la única vía es poner detrás de la tarjeta algo con **borde que la cruce** (una forma que se vea fuera y, difuminada, dentro). Eso es decoración añadida a la referencia, no la referencia. Queda a decisión del operador.
