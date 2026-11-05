# VERIFICACIÓN — Lado derecho cálido del login (05-nov-2026)

> Alcance: el **segundo contenedor** de `/entrar` (el del panel simulado) pasa de ciruela oscuro a **arena cálida**, con deck transparente, para emparejarse con el contenedor del login.
> Referencia del operador: `referencias/login-referencia-derecha-2026-11-05.jpg` (original `watermarked_img_53665882178136313.jpg`), guardada en el repo.
> Medición: píxeles del render (System.Drawing) + contraste WCAG sobre esos píxeles + `wan-image` (`qwen3.7-plus`) en modos `question` y `validation`.

## 1. Qué pedía la referencia y qué se hizo

La imagen muestra el lado derecho sobre **arena**, con el contenedor `VISTA DEL PANEL` **sin relleno** (solo borde), la tarjeta blanca encima y el texto **oscuro**.

| Pieza | Antes (ciruela) | Ahora (arena) |
|---|---|---|
| Fondo | `--brand-plum` + `--glow-hero` + `--glow-corner` + `--grad-plum-deep` | `--grad-warm-2` (arcilla 20/26/32 % sobre crema) |
| Deck `VISTA DEL PANEL` | relleno ciruela claro, borde crema 22 % | **sin relleno visible** (crema 14 %), borde ciruela 22 %, `blur(10px)` |
| Título del deck | crema | **ciruela** |
| Puntos y barras | crema translúcida | ciruela al 45 % y 22 % |
| Tarjeta `VISTA DE ENCUESTA` | blanca con `--shadow-lift` (negro 30/45 %) | blanca con `--shadow-glass` (ciruela, cálida) |
| `EL CLIENTE ESCANEA · …` | crema 75 % | **ciruela** |
| `ejemplo de referencia · sin funciones` | crema 60 % | `--text-2` |
| `Panel en construcción…` | crema 75 % | `--text-2` |
| Marca de la banda móvil | crema | **ciruela** |

**Dos tokens nuevos**, ambos derivados: `--tint-clay` (mostaza 60 % + coral 40 %) y `--grad-warm-2`. Cero hex ajenos a la paleta.

## 2. El "juego de color": cómo contrasta sin romper la familia

El operador pidió contrastar **levemente** con el fondo del login. Se resolvió por **matiz, no por luz**:

| Punto del empalme | Izquierda (ámbar) | Derecha (arcilla) | Contraste entre mitades |
|---|---|---|---|
| Arriba (y 120) | `#FADCA5` | `#FDE2CB` | **1.03** |
| Abajo (y 860) | `#F9CC8A` | `#FDDABD` | **1.07** |

Un contraste de 1.03–1.07 es exactamente un **escalón de tono**: se ve la división, no se siente un corte. El modelo de visión lo clasificó como **LEVE** y puso **9/10** a "misma familia con matiz distinto".

## 3. Iteración: el primer intento salió rosa

| # | Qué se hizo | Qué dijo wan-image | Acción |
|---|---|---|---|
| 1 | lado derecho derivado **solo del coral** (14/22/28 %) | *"tono rosa pálido o salmón"*; el deck *"se ve relleno"* | corregir |
| 2 | base **arcilla** (mostaza 60 % + coral 40 %) y deck al **14 %** de relleno | *"transparente con un borde fino"* · contraste **LEVE** · **9/10** | aceptado |

Medición que justificó el cambio del deck:

| Relleno del deck | Delta contra el fondo | Cómo se lee |
|---|---|---|
| crema 42 % | `[+1,+11,+20]` | panel relleno |
| **crema 14 %** | **`[0,+4,+7]`** | **se lee el fondo a través**; el borde define la caja |

Y el del tono: el rosa venía de derivar solo del coral; con mostaza 60 % la mezcla cae en `#FEE4CE → #FDD8B9`, un arena, no un salmón. El modelo ya no lo llamó rosa.

## 4. Resultado de la validación final

| Modo | Resultado |
|---|---|
| `question` | (1) fondo derecho cálido · (2) contraste **LEVE** · (3) deck **transparente con borde fino** · (4) **9/10** |
| `validation` | **PASS 95 %** — la única salvedad es que **la tarjeta del login** (izquierda) se lee sólida |

Esa salvedad es la limitación ya documentada en `VERIFICACION-LOGIN-VIDRIO-2026-11-05.md` §2: una superficie translúcida sobre un degradado liso no tiene nada que dejar ver. **No** aplica al deck, que sí se lee transparente porque está casi sin relleno.

## 5. Contraste, sobre píxeles del render

| Texto | Superficie | Ratio |
|---|---|---|
| ciruela `#2E1E3F` | fondo derecho profundo `#FDD8B9` | **11.43** |
| texto-2 `#65586E` | fondo derecho profundo `#FDD8B9` | **4.95** |
| ciruela | deck `#FEE3CD` | **12.2** |
| crema (blanco de la tarjeta) | mock | 15.29 |

## 6. Guardas

`next build` → `✓ Compiled successfully` · `check:tokens` OK · `check:placeholders` 0 · `scrollWidth − clientWidth` = 0 a 1440 y 375 · el mock, el badge, la escala y el botón no se tocaron (ya coincidían con la referencia).

## 7. Pendiente

1. **`wireframes/10-login.svg`** sigue describiendo el login con lado derecho ciruela y sin degradados. El desfase ya es de dos lotes (A1 y este). Redibujarlo es el trabajo pendiente más visible.
2. En móvil la banda de 96 px y la sección de abajo son ambas cálidas: la transición es suave, no hay línea. Es coherente con el "juego de color", pero conviene confirmarlo a ojo en un teléfono real.
3. La referencia marca la opción elegida de la escala con un **✓** en vez del número `5`. No se copió: perder el número elegido empeora la lectura de la respuesta.
