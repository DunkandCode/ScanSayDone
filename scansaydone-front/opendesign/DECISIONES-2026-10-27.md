# Decisiones pendientes — acta (2026-10-27)

> Estado: **recomendado, pendiente de tu OK**. Nada aplicado aun: los documentos y planos se editan en una pasada mecanica cuando apruebes.
> Fuentes cruzadas por decision: `explore-alibaba` (rag-search + skills-mcp), `designer-alibaba` (context7 + mdn + matematica de contraste), `code-support` (Go `second-opinion --area frontend`, gpt-6-luna). Donde las tres no coinciden, se dice.

## 1. Cuarta vista: `Respuestas` en lugar de `Alertas`

**Recomendacion: SI** — 3 destinos de primer nivel (`overview`, `opiniones`, `respuestas`). El estado vacio deja de ser vista: es un estado de cada vista.

| Fuente | Hallazgo |
|---|---|
| `explore` (rag `c:06c8dd30`, `c:7c190a8f`, `chk:a997970f`) | 4 destinos ya estan dentro del limite 7±2; el problema no es contar destinos sino **agrupar por objeto**. El objeto es "opinion"; la alerta es un **estado** de ese objeto, no un objeto nuevo. OOUX/IA: dos destinos con el mismo contenido = dos verdades que el dueno debe reconciliar |
| `explore` (skill `premium-web-design` §2/§7) | techo de nav: ≤3 grupos; filtros siempre visibles; vacio = mensaje + CTA |
| `Go` (findings 1-2) | "cuatro destinos no parecen justificados: estado vacio es un estado"; "alertas y respuestas convienen en un mismo flujo" |
| `Go` (mi lectura) | **contraargumento decisivo**: si alerta y respuesta fueran entidades distintas, fusionar borraria del producto las alertas sin respuesta |

**Como se resuelve el contraargumento (esto es la condicion de la decision):** en nuestro modelo la alerta **se deriva** de una respuesta (regla: puntuacion ≤ 2 → alerta). Por tanto `alert.response_id` es **NOT NULL**: no existe alerta huerfana, y la fusion no puede ocultar nada. Si algun dia se agrega una alerta manual (sin respuesta), esta decision se revisa.

**Impacto:** `DASHBOARD-UX.md` §2 (4 vistas → 3 + estados), `DASHBOARD-DECISIONES.md` (cerrar §3), arquitectura §2 (rutas del panel), y el plano `d03-alertas.svg` pasa a ser `d03-respuestas.svg`.

## 2. Las 4 metricas del overview

**Recomendacion** (caben en 1 linea de 264 px; limite ~19 caracteres con Montserrat 600 13 px + tracking .14em):

| # | Rotulo | Car. | Nota bajo el numero | n=0 | n 1-9 | n≥20 |
|---|---|---|---|---|---|---|
| 1 | `OPINIONES` | 9 | "ultimos 7 dias" | `—` + "aun nadie respondio" | absoluto | absoluto + periodo |
| 2 | `CON COMENTARIO` | 14 | "de esas opiniones" | `0` (es dato real) | absoluto | absoluto, **sin % hasta que se apruebe** |
| 3 | `DIAS CON RESPUESTA` | 18 | "al menos 1 por dia" | `—` | absoluto | absoluto |
| 4 | `SIN RESPONDER` | 12 | "avisos de clientes" | `0` + estado en verde (icono + texto) | absoluto, urgente primero | absoluto |

Por que estos y no otros: `explore` (`chk:9b4d88ea`, `chk:1e088fc6`) exige metrica **accionable** y sin vanity; `chk:2fd76f11` pide nombrar por la decision que sostiene. `Designer` midio que 2 lineas **no caben** en la tarjeta de 112 px, de ahi el limite de 19 caracteres. Descartados: "tendencia" (jerga), "satisfaccion %" (falla con n<10), "comentarios recibidos" (Go: duplica "opiniones" con otra ventana temporal), "alertas abiertas" (jerga de sistema; "sin responder" dice la accion).

## 3. Canales: 4, no 3

**Recomendacion: 4 tarjetas** (mostrador, Instagram, WhatsApp, TikTok LIVE) con `col-12 col-lg-6 col-xl-3`; en el panel, filtro de **5 chips** (Todos + los 4).

| Fuente | Hallazgo |
|---|---|
| `explore` (rag `c:e32e5990`, `c:3528348b`) | el dueno ya tiene Instagram y WhatsApp como cosas distintas; agrupar crea un concepto que no existe en su cabeza (mental model) |
| `explore` (rag `chk:2fd76f11`) | su decision es "donde pongo el QR / a quien invito": necesita origen separable |
| `designer` | 4-up da 267 px → ~30 caracteres por linea: suficiente para bullets de ≤16 palabras; `col-lg-3` a 992-1199 px daria 222 px (~25 car.) → **por eso** `col-lg-6` (2x2) y solo 4 en fila desde xl |
| `explore` (criterio) | agrupar es **irreversible** para el usuario (no puede des-agrupar mentalmente); separar es reversible |

Confianza **media**: el corpus no tiene evidencia directa de atribucion por canal (declarado por el agente). Verificacion barata sugerida: card sorting de 5 minutos con 2 duenos durante el piloto.

**Impacto:** `03-canales.svg` (confirmar etiquetas de las 4), `UX-LANDING.md` §2/§3.4, `DASHBOARD-UX.md` §2.2 (5 chips).

## 4. Footer del landing: crema, no ciruela

**Recomendacion: crema `#FFF8F2`.**

| Criterio | Ciruela | Crema |
|---|---|---|
| Ritmo de bandas | CTA final ya es ciruela → dos bandas oscuras adyacentes: **viola la regla propia** de UX-LANDING §4 y funde CTA+footer en un bloque de ~400 px | el salto ciruela→crema (14.53) es la frontera de cierre mas fuerte disponible |
| Token de enlace | sobre ciruela no queda ningun token legal: coral 2.86 ✗ (y vetado), coral-oscuro 2.57 ✗, mostaza 8.45 pero prohibido como texto | `--link #B23A2A` = **5.65** ✓; texto 14.53 ✓; secundario `#65586E` = 6.29 ✓ |
| Trabajo extra | exige override de secundario (`#65586E` crudo = 2.31 ✗) y un token de enlace nuevo | ninguno |

**Impacto:** `07-footer.svg` (banda a crema), `DESIGN-CONTRACT.md` §4 (quitar "footer" de la lista de bandas ciruela), `UX-LANDING.md` §6 y `ASSET-PIPELINE.md` §1 (el supuesto pasa a decision).

## 5. Vector del logo: brief cerrado + plan B

**Entregables (4 SVG):** `logo-horizontal-dark/light`, `logo-vertical-dark/light`, `logo-symbol` (isotipo, `currentColor`), `logo-mono` (una tinta, solo sobre claro).

| Regla | Valor |
|---|---|
| `viewBox` | `0 0 2172 724` para el horizontal (proporcion 3:1, la del PNG medido). **Sin `width`/`height` fijos** en el archivo: el consumo pone 108x36 |
| Wordmark | **texto vectorizado (outlined)**, no texto vivo: un SVG servido como `<img>` **no carga fuentes** — Bebas Neue solo vive en la pagina y en OG/mail caeria a fuente del sistema |
| Prohibido en el archivo | `<image>`, `<foreignObject>`, base64, `@import` de fuentes |
| Tamanos minimos | horizontal 108x36 px digital / 20 mm impreso · wordmark nunca <24 px · isotipo ≥16 px (a 16 se usa la version **sin los 3 puntos**) |
| Clear space | **0.5 x la altura del isotipo** por los 4 lados (criterio propio, no hay fuente que lo fije) |
| Prohibido en uso | deformar (el template hoy lo estira a 4.2:1), recolorear fuera de tokens, tinta `#000014` sobre ciruela (1.36 ✗), logo sobre coral salvo ciruela encima, usar el isotipo como boton |
| Plan B (si no aparece el AI/FIG) | calcado del isotipo 3-4 h + wordmark outlined 1-2 h + revision 1 h = **4-7 h** (estimacion) |

**Verificacion de aceptacion:** abre en navegador/Inkscape/iOS · `grep -cE "<image|foreignObject|base64"` = 0 · proporcion 3.00 · rasterizar a 16/36/240/960 sin perdida · ≤10 KB · `currentColor` responde al cambiar `color`.

## 6. Coral canonico: cerrar en `#FF5F44`

Sin cambios: es el valor del activo fisico ya repartido. Los 5 corales del ecosistema (guia `#FF6B5B`, logo `#FF5F44`, lamina `#FF6B55`, medido `#FF6050`, favicon `#FF5040`) **fallan igual** como texto sobre claro y **pasan igual** como superficie: la eleccion no mueve accesibilidad. Ventana de veto: **hasta el 29-oct**.

## 7. Texto literal del cliente: sin enmascaramiento automatico en el MVP

`Go` levanto el punto correcto: enmascarar PII con heuristicas en espanol falla (apellidos compuestos, telefonos locales) y produce **texto mutilado**; y si el literal completo esta a un click, el enmascaramiento es teatro.

**Decision propuesta, mas honesta y mas barata:**

| Regla | Detalle |
|---|---|
| Lista | extracto de **≤90 caracteres**, sin enmascarar |
| Detalle | literal completo (el dueno necesita leer el reclamo real para resolverlo) |
| Encuesta | no pide datos personales (ya es regla) y avisa "no escribas datos personales" bajo el campo |
| Retencion | el comentario se conserva con la respuesta; politica de borrado a definir antes del piloto |
| Prohibido | inventar un `mask()` inline sin tests: o hay un pipeline con casos en espanol, o **no** se enmascara |

Si el operador prefiere enmascarar, entonces el MVP **no muestra literal** (solo el detalle de la alerta con la cita recortada) — pero no las dos cosas a medias.

## 8. Riesgos aceptados

1. **Alerta enterrada**: al no existir destino propio, el aviso critico depende de la tarjeta del overview. Mitigacion obligatoria: contador en la tarjeta + enlace directo `respuestas?filtro=sin-responder`.
2. **Numero por canal con n=1-2**: el dueno puede concluir "TikTok no funciona" con una sola opinion. Mitigacion: prohibido cualquier ratio por canal con n<10; la tarjeta invita a leer el texto, no a comparar.
3. **Coste de cambiar despues del piloto**: la fusion toca navegacion, permisos y modelo de datos. Decidirlo ahora cuesta una tarde; despues, una semana.

## 9. Si apruebas

Pasada mecanica de **7 documentos + 3 planos**, sin tocar codigo: `DASHBOARD-UX.md`, `DASHBOARD-DECISIONES.md`, `UX-LANDING.md`, `GRID-SPEC.md`, `DESIGN-CONTRACT.md`, `ASSET-PIPELINE.md`, `docs/ARQUITECTURA-SCAN-SAY-DONE.md` (§2 rutas del panel) y los planos `03-canales`, `07-footer`, `d03` (renombrar a respuestas). Estimado: 1 tanda de trabajo.
