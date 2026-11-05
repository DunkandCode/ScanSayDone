# ANÁLISIS — Referencia `UX LOGIN.jpeg` (05-nov-2026)

> Fuente: `C:\Users\k_spi\Downloads\UX LOGIN.jpeg` · 1024×661 px · 69 KB.
> Herramienta: `wan-image` → `wan_analyze_design` (modelo `qwen3.7-plus`, `design_spec`, anti-slop activo). Salida cruda: `E:\DevData\wan-image-outputs\ux-login-2026-11-05.md`.
> Cotas: **leídas por mí sobre el JPEG**, no por el modelo. Ver §6 sobre por qué la distinción importa.
> Escala asumida: la hoja mide 1024 y cada mitad 512 = 50/50 exacto. Si el diseño original es 1440, el factor es **0.711** (1024/1440); las equivalencias de este documento salen de ahí y llevan **±3 px** de error.

---

## 1. Qué es la imagen

**No es una pantalla: es una hoja comparativa de dos variantes del mismo contenedor.**

- Ambas mitades llevan **el mismo contenido, en el mismo orden**, dentro de una tarjeta de una sola columna.
- Lo único que cambia es **la superficie de la tarjeta y su fondo**:

| | Mitad izquierda | Mitad derecha |
|---|---|---|
| Fondo de la mitad | crema plano `#FEF5EC` | degradado melocotón → arena (`#ECD3B2` como base) |
| Superficie de la tarjeta | blanca sólida `#FFFFFF` | translúcida `#F5EADC` ~80 % + desenfoque |
| Borde | 1 px `#D1D5DB` | sin borde duro |
| Radio | 12 | 16 |
| Sombra | ninguna | `0 10px 30px rgba(0,0,0,.05)` |

Es decir: la imagen **pregunta qué contenedor usar**, no qué contenido poner. El contenido es el que ya tenemos.

---

## 2. Estructura: 9 bloques, una columna, orden fijo

Medidas sobre el JPEG; entre paréntesis, equivalencia a 1440.

| # | Bloque | Contenido | Medida estimada | Nota |
|---|---|---|---|---|
| — | **Tarjeta** | — | 297 × 556 en x 110–407 / y 69–625 (**418 × 782**) | padding interno ≈ 27 (**38**) |
| 1 | Marca | cuadrado coral 18×18 radio 3 + `SCAN SAY DONE` | h 18 (**25**) · texto 13/700 · tracking `.06em` | la marca y el logo, no un enlace |
| 2 | Titular | `LEE LO QUE` / `TE DICEN` | **dos líneas forzadas**, h 85 (**120**) · ≈46–48 px · interlínea ≈0.92 | salto después de `QUE` |
| 3 | Subtítulo | `Escribe tu correo y te enviamos un enlace. Sin contraseña.` | 2 líneas, 14/400 lh 1.45 | mismo texto que ya usamos |
| 4 | Etiqueta del campo | `Montserrat 600` | 13/600 · 7 px sobre el input | **defecto de la referencia** (ver §5) |
| 5 | Campo | `nombre@correo.com` | 37 (**52**) de alto · radio 6 · borde 1 px | altura idéntica al botón |
| 6 | Botón primario | `ENVIARME EL ENLACE` | 44 (**62**) de alto · ancho completo · radio 8 · **texto ciruela sobre coral** | mismo criterio que el nuestro |
| 7 | Divisor | regla 1 px, **sin etiqueta** | y ≈454 · margen ≈38 arriba y abajo | no hay un "o": no existe segundo método |
| 8 | Acción secundaria | `Ver la demo del panel` | negrita + **subrayado coral de 3 px** separado del texto | ya existe en `/entrar` |
| 9 | Legal | `Al continuar aceptas los Términos y la Política de privacidad` | 2 líneas, 12/400, ambos enlaces con subrayado coral | ya existe en `/entrar` |

**Ritmo vertical medido (px sobre el JPEG):** marca→titular 25 · titular→sub 15 · sub→etiqueta 21 · etiqueta→campo 7 · campo→botón 10 · botón→divisor 38 · divisor→demo 36 · demo→legal 40.

Lo que se lee de ahí: **el formulario va agrupado** (7–10 px entre etiqueta, campo y botón) y **lo secundario va separado** (36–40 px, con una regla en medio). Esa agrupación es lo que hace que el bloque se entienda de un golpe.

---

## 3. Contraste real de la referencia

Calculado con la fórmula WCAG sobre los hex de la imagen:

| Combinación | Ratio | Veredicto |
|---|---|---|
| `#1a1025` sobre `#ff6b52` (texto del botón) | **6.53** | pasa AA con holgura |
| `#1a1025` sobre `#fef5ec` (titular) | **17.02** | pasa AAA |
| `#4a4055` sobre `#ffffff` (cuerpo) | **9.74** | pasa AAA |
| `#4a4055` sobre `#f5eadc` (cuerpo en el vidrio) | **8.20** | pasa AAA |
| `#d1d5db` sobre `#ffffff` (**borde del input**) | **1.47** | **falla** el 3:1 de 1.4.11 |
| compuesto del vidrio sobre el degradado | `#F3E5D4` → texto 14.82 | pasa AAA |

Dos conclusiones que sí importan:

1. **El texto del botón va oscuro sobre coral, no blanco.** La referencia acierta y hay número detrás: 6.53:1. Nuestro build ya lo hace igual (ciruela sobre coral = **5.08:1**), así que aquí no hay nada que cambiar.
2. **El borde del input de la referencia es demasiado débil** (1.47:1). El nuestro usa `--border-strong` = **3.03:1**, que sí cumple. Copiar el borde de la imagen sería un retroceso.

---

## 4. Comparación con `/entrar` (lo implementado hoy)

| Aspecto | Referencia | `/entrar` hoy | Qué hacer |
|---|---|---|---|
| Composición | tarjeta centrada en su mitad, **sin nada al lado** | split 50/50 con **deck + mock del panel** a la derecha | decisión de producto (§7) |
| Contenido de la tarjeta | los 9 bloques | los mismos 9 bloques | **coincide** |
| Titular | 2 líneas forzadas, ≈46–48 px, grotesca pesada | `LEE LO QUE / TE DICEN` en Bebas 64 | solo cambia la familia; el corte de línea ya coincide |
| Subtítulo | idéntico | idéntico | **coincide** |
| Etiqueta del campo | `Montserrat 600` (residuo) | `Tu correo` | la referencia está mal |
| Campo | 52 alto, radio 6, borde 1 px débil | 52 alto, borde `--border-strong` 3.03:1 | conservar el nuestro |
| Botón | 62 alto, radio 8, ciruela sobre coral | **52 alto**, radio 8, ciruela sobre coral (5.08:1) | ver §7.2 |
| Divisor | regla 1 px **sin etiqueta** | `.login-divider` **con etiqueta centrada** | **adoptar la regla simple** |
| Acción secundaria | `Ver la demo del panel` subrayado coral 3 px | mismo enlace, subrayado | **coincide** |
| Legal | 2 líneas con subrayados coral | mismos dos enlaces | **coincide** |
| Radio de la tarjeta | 12 (plana) / 16 (vidrio) | 16 | opcional bajar a 12 |
| Fondo | crema plano / degradado cálido | crema + 3 capas propias | ver §7.3 |

**Hallazgo principal:** la referencia y nuestro login **coinciden en 7 de 12 filas**, incluidas las tres decisiones que más se suelen equivocar (texto oscuro sobre coral, enlaces subrayados, acción secundaria separada). No es una propuesta distinta: es **la misma estructura con otro contenedor**.

---

## 5. Qué copiar y qué no

**Copiar:**

1. **La regla simple en lugar del divisor con etiqueta.** No existe un segundo método de acceso, así que el "o" centrado promete una alternativa que no hay. Una línea de 1 px separa igual sin mentir.
2. **El agrupamiento del formulario** (7–10 px entre etiqueta, campo y botón frente a 36–40 px hacia lo secundario). Si hoy los márgenes son más parejos, ajustarlos es gratis y se nota.
3. **El radio 12** si se busca una tarjeta menos "burbuja". Cuestión de gusto, no de corrección.

**No copiar:**

1. **La etiqueta `Montserrat 600`.** Es la anotación de la fuente que quedó en el sitio de la etiqueta. En producción va `Tu correo`.
2. **El borde de input `#D1D5DB`** (1.47:1). Falla 1.4.11; el nuestro cumple con 3.03:1.
3. **El vidrio como superficie del formulario.** El contraste depende de lo que haya detrás: si el degradado cambia, cambia el ratio. Y `backdrop-filter` es de lo más caro de pintar en móvil. Como **decoración del lateral** es aceptable; como superficie donde se escribe, no.
4. **La tipografía del titular si es Montserrat.** La marca usa Bebas Neue en todos los titulares; cambiarla solo aquí rompería la familia.

---

## 6. Fiabilidad de la herramienta (lo que el MCP acertó y lo que no)

**Acertó:** que son dos variantes, el inventario de bloques, el orden, la paleta y el detalle del texto oscuro sobre coral.

**Falló:**

| Afirmación del modelo | Realidad |
|---|---|
| "Border-radius 6px" del botón | se ve **8**; y dudó en voz alta sobre el color del texto ("wait, looking closely…") antes de corregirse |
| "`Montserrat 600` actúa como etiqueta" | es un **residuo de especificación**, no copy |
| "glassmorphism" en general | solo la mitad **derecha** es vidrio; la izquierda es una tarjeta plana |
| "aprox 360–400 px de ancho de tarjeta" | mide **297 en el JPEG** (418 a 1440): el rango que dio no corresponde a ninguna escala |

**Y el anti-slop automático — 60/100, tres alertas — tiene tres falsos positivos:**

| Alerta | Por qué es falsa |
|---|---|
| `gradient_purple_cyan` | el degradado va de melocotón a arena; no hay púrpura ni cian en la imagen |
| `default_fonts: Inter` | la propia imagen rotula `Montserrat` |
| `card_left_border` 3–4 px | no existe ningún borde izquierdo de color |

**Conclusión de uso:** el MCP sirve para **inventariar bloques y extraer paleta**; **no** para medir ni para emitir un veredicto de calidad. Las cotas de §2 son mías y llevan ±3 px. El anti-slop de esta herramienta, tal como está, no es evidencia: es una pista que hay que verificar a ojo.

---

## 7. Propuesta (necesita tu decisión)

### 7.1 Tres caminos

| Opción | Qué implica | Costo | Riesgo |
|---|---|---|---|
| **A · Cosmética** | conservar el split con el mock; aplicar solo el divisor sin etiqueta + el agrupamiento del formulario | 1 delegación corta | ninguno: no toca estructura |
| **B · Una columna** | retirar el mock y el deck; tarjeta centrada sobre fondo cálido, como la referencia | 1 delegación + replano `10-login` v3 + recapturas | se pierde la única explicación visual de qué es el producto dentro del login |
| **C · Vidrio** | superficie translúcida con desenfoque | 1 delegación + medición de contraste en 3 fondos | ratio variable y costo de pintado |

### 7.2 Recomendación

**A, con dos ajustes concretos:**

1. **Divisor sin etiqueta** (regla de 1 px) — corrige una promesa falsa por 2 líneas de SCSS.
2. **Agrupar el formulario** (7–10 px) y **separar lo secundario** (36–40 px) — hoy es lo que más se nota al comparar las dos imágenes puestas al lado.

Y **no** tocar el botón (ya coincide en color y contraste) ni el borde del input (el nuestro cumple y el de la referencia no).

**Sobre B:** es defendible, y si te gusta más, se hace. Pero conviene saber qué se pierde: el mock de la derecha es lo que cuenta `EL CLIENTE ESCANEA · CONTESTA · TÚ LO LEES` sin gastar una línea de texto. Quitarlo deja un login correcto y más seco, con menos explicación en la primera pantalla que ve el dueño.

**Sobre C:** no la recomiendo para el formulario. Si el vidrio gusta, el sitio donde suma es el **deck del panel**, no la tarjeta donde se escribe el correo.

### 7.3 Lo que cuesta autorizar

Un lote `A1` de una sola delegación: divisor, ritmo vertical, radio opcional, `check:tokens`, medición de contraste antes/después, captura 1440 y 375, acta breve. Si se elige B, el lote incluye replanar `10-login.svg` a v3 y rehacer las capturas del login.
