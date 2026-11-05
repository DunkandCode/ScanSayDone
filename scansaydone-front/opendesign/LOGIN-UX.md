# LOGIN-UX — pantalla de acceso del dueño (diseño, no implementada)

> 30-oct-2026 · designer-alibaba · cero código de producto · plano métrico: `wireframes/10-login.svg`.
> Normas: `DESIGN-CONTRACT.md` §1/§3/§5/§6 · `EFECTOS-Y-MOTION.md` §2.1 · `REVISION-UX.md` §5 · voz: `COPY-INTERNAS.md`.
> Referencia visual: `referencias/login-referencia-v2-2026-10-30.png` (+ `referencias/ANALISIS-LOGIN-wan.md`). La imagen IA es referencia, nunca asset.
> Todo texto marcado `[propuesta]` espera aprobación del operador; ningún copy definitivo.
> **v2 [30-oct]:** el operador retiró el titular `ENTRAR` (repite la marca y el botón), pidió más profundidad en la mitad ciruela y que la derecha explique el producto. Cambian §3 (números), §4 (titular + subtítulo), §6 (etiqueta del h1) y se agregan **§11 (efectos, gradientes, tokens nuevos)** y **§12 (qué comunica la derecha)**. La estructura validada — split 50/50, eje x 720, tarjeta 400, mock 360, franja móvil — **no cambia**. Las marcas `[v2 30-oct]` señalan cada diferencia contra la versión del 30-oct v1.

## 1. Objetivo y público

- Dueño de negocio chico (almacén, peluquería, cafetería) entrando a leer sus opiniones: correo mágico, **sin contraseña y sin app** (así lo describe el sitio). Tarea única: escribir su correo y salir del sitio hacia el correo.
- **Qué NO es:** no es registro (no hay alta de cuenta), no es el panel (el panel no existe), no es la encuesta del cliente (esa no pide identidad). Es una **pieza de diseño** con tratamiento honesto: badge `DISEÑO` en la tarjeta y nota "pantalla de diseño: ningún botón abre correo todavía", mismo criterio que el marco del panel en la landing.

## 2. Estructuras candidatas

| Candidata | descripción | ventajas | riesgos | cuándo gana |
|---|---|---|---|---|
| **A · split 50/50** | mitad crema (formulario) + mitad ciruela (mock del producto), eje al medio | función y promesa separadas por superficie; colapso trivial <992; el split 50/50 es el default comprobado de auth SaaS 2026 [web: eleken, theplusaddons]; valida la referencia v2 aprobada | media pantalla "dedicada a nada" en pantallas chicas | siempre que exista una banda decorativa legítima (el mock con badge DEMO) |
| B · split 60/40 con tarjeta cruzando el eje | tarjeta del formulario solapada sobre la banda ciruela | dramática, una sola composición | cruza función sobre decoración; el precedente del solape del hero (45 px) ya se revirtió por no medir bien (`REVISION-UX §6-P1`); error visual caro de justificar | marca con arte de producto real y ancho sobrado (≥1600) |
| C · tarjeta centrada con rail de marca | formulario centrado en crema, franja ciruela fina lateral | máxima economía, cero ruido | rail angosto no lleva la firma ciruela ni el glow; login genérico "de cualquier SaaS"; desaprovecha el mock DEMO | cuando no hay nada que mostrar del producto |

**Recomendada: A.** La referencia buena es A; separa forma (izquierda, superficie cálida) de promesa (derecha, ciruela + glow, todo `aria-hidden` con badge); y su colapso a móvil está gobernado por el mismo bp md que el resto del sistema. B queda descartada por el precedente del solape; C no justifica existir cuando sí hay un mock honesto que mostrar.

## 3. La elegida, banda a banda (1440×900)

| | izquierda | derecha |
|---|---|---|
| fondo | crema `#FFF8F2` a todo lo ancho de su mitad, full-bleed (no usa container BS) | ciruela `#2E1E3F` + `--grad-plum-deep` (base de profundidad) + glow `--glow-hero` (radial estático coral 28 %, centro 18 % 6 % de la mitad, contenido a 62 %) + `--glow-corner` (radial coral 12 % abajo-derecha) — capas de abajo arriba en §11 `[v2 30-oct]` |
| contenido | tarjeta blanca **400 px** centrada (x 160–560), alto **706** `[v2 30-oct]` (antes 645: el titular ocupa 2 líneas, +61), radio 16, borde 1 px `--border-strong` (3.11 vs blanco ✓), **sin sombra** (tarjeta estática = marco, EFECTOS §2.2), padding interno 40 → content 320 | dos tarjetas apiladas: **deck del panel 328×200** (x 932–1260, y 180–380, borde `--edge-lit`) asomando **detrás** del **mock de encuesta 360×268** (x 900–1260, y 344–612, con `--shadow-lift`; solape 36 px) con su escala 1–5 y selección; línea de recorrido bajo el mock (§12); debajo, frase canónica "Panel en construcción. Te avisamos cuando esté." crema (15.29 ✓) `[v2 30-oct]` |
| extras | enlace "← Volver al sitio" arriba-izq (x 32, objetivo 44) | nota "ejemplo de referencia · sin funciones" crema 75 % (8.78 ✓); todo el bloque derecho `aria-hidden="true"` |
| eje | split en x 720 exacto = centro del gutter 6 de la retícula de referencia (container-xl 1140, col 73) — el split **no** consume columnas BS; son mitades de viewport | idem |

**Por breakpoint:**

| viewport | qué pasa |
|---|---|
| 1440 | split 50/50; tarjeta 400 como arriba (alto 706 `[v2]`); derecha como arriba (deck + mock + línea de recorrido) |
| 1024 (lg) | split 50/50; izquierda tarjeta 400 (sobran 56 px por lado); derecha mock 336 (padding 28, tiles de escala a 44, 252 ≤ 280) + deck proporcional 300×190 + línea de recorrido Bebas 18 `[v2]` |
| 768 (md) | **colapso**: franja ciruela h 96 arriba (glow + wordmark, sin mock ni deck); debajo crema a todo el ancho con tarjeta 420 centrada (174+420+174=768) |
| 375 | franja ciruela h 88 con wordmark; tarjeta 343 (16+343+16), padding 24, H1 Bebas 44 en 2 líneas (bloque 84) `[v2]`, botones full-width h 52; mock y deck **desaparecen** (eran decorativos) |

## 4. Jerarquía del formulario (orden de lectura = orden de DOM = orden de tab)

Ratios medidos con fórmula WCAG sobre las superficies de la pantalla (blanco `#FFFFFF`, crema `#FFF8F2`, ciruela `#2E1E3F`), no "se ve bien" (regla 10 `REVISION-UX`).

| # | elemento | texto [propuesta] | tipografía | color → ratio | táctil |
|---|---|---|---|---|---|
| 1 | marca | isotipo + `SCAN SAY DONE` | Bebas 24 + tracking | ciruela/crema 14.53 ✓ (no interactivo) | — |
| 2 | título (h1) `[v2 30-oct]` | `LEE LO QUE TE DICEN` (2 líneas: `LEE LO QUE` / `TE DICEN`) — **reemplaza `ENTRAR`** | Bebas 64 · lh 0.95 · bloque 122 (móvil 44, bloque 84) | ciruela/blanco 15.29 ✓ | — |
| 3 | subtítulo `[v2 30-oct]` | `Escribe tu correo y te enviamos un enlace. Sin contraseña.` (cae "para entrar": el titular ya dijo para qué; la frase solo explica el mecanismo) | Montserrat 400 16/1.5 · 2 líneas · h 48 | `--text-2`/blanco 6.62 ✓ | — |
| 4 | label | `Tu correo` | Montserrat 500 14 | ciruela/blanco 15.29 ✓ | — |
| 5 | input email | placeholder `nombre@correo.com` · `type=email` `autocomplete=email` `spellcheck=false` | Montserrat 400 16 (16 evita zoom iOS) | texto ciruela 15.29 ✓ · placeholder `--text-3` 2.69 (exención conocida: la guía va en el label; si el gate lo pide, placeholder a `--text-2` 6.62) | alto 48 |
| 6 | **primario (magic link)** | `ENVIARME EL ENLACE` | Montserrat 600 15 | coral superficie, texto ciruela 5.08 ✓ · hover flip crema sobre `--link` 5.65 ✓ (firma §6) | alto 52 |
| 7 | divisor | `o` | Montserrat 500 13 | `--text-2` 6.62 ✓ | — |
| 8 | ~~secundario (passkey)~~ | **ausente en v1** (§10): WebAuthn exige RP ID registrado y origen válido; sin backend el botón lanza `NotAllowedError`. Se reintroduce con el backend | — | — | — |
| 9 | OAuth | **ausente, razonado:** no hay proveedor conectado (sin backend de auth); botón vivo imposible = precedente del formulario muerto de `/contactus` (COPY-INTERNAS); con Google entraría la exigencia de Sign in with Apple y no tenemos los logos oficiales sin recolorear (prohibido §6) | — | — | — |
| 10 | enlace demo | `Ver la demo del panel` → ancla `#panel` de la home (destino real; "ver la demo", no acceso a datos) | Montserrat 400 16 subrayado | `--link`/blanco 5.95 ✓ · hover 7.55 ✓ | alto 44 |
| 11 | nota legal | `Al continuar aceptas los Términos y la Política de privacidad` + línea `pantalla de diseño: ningún botón abre correo todavía` | Montserrat 400 14/1.4 (pie, precedente barra legal 14) | `--text-2` 6.62 ✓ · enlaces underline `--link` 5.95 ✓ | inline |
| — | banda derecha (mock, `aria-hidden`) `[v2 30-oct]` | **front (sin cambio de cotas):** `VISTA DE ENCUESTA` Bebas 20 + badge `DEMO` mostaza sup./texto ciruela 8.45 ✓ · pregunta M500 20 (ciruela/blanco) · escala 1–5: 5 tiles 48 (gap 8, 272 ≤ 320), activo=coral+texto ciruela 5.08 ✓ · botón `Enviar` coral 44 · **nuevo:** `--shadow-lift` bajo la carta. **deck (nuevo):** 328×200 detrás, `VISTA DEL PANEL` Bebas 20 crema + 3 filas estructura (punto crema 60 % + barra `--edge-lit`; **cero cifras**), borde `--edge-lit`. **línea de recorrido (nueva):** `EL CLIENTE ESCANEA · CONTESTA · TÚ LO LEES` Bebas 20 · crema 75 % (8.78 ✓, mismo 75 % de la nota) | como indicado | nota inferior crema 75 % 8.78 ✓ | n/a (decorativo) |

### 4.a El titular: las 3 candidatas y el veredicto `[v2 30-oct]`

`ENTRAR` salió: repetía la marca de arriba y la acción del botón `ENVIARME EL ENLACE`. El titular ahora dice **qué gana el dueño**, no qué hace el formulario. Reglas aplicadas: Bebas Neue · ≤2 líneas · 56–64 px · ciruela sobre blanco · prohibido inventar cifras, tiempos o promesas medibles (regla dura `REVISION-UX §5-3`) · sin la palabra "encuesta" (el sitio ya la repite).

| Candidata | Veredicto | Por qué |
|---|---|---|
| `ACÁ ESTÁN / TUS RESPUESTAS` | ❌ descartada | afirma que ya existe una respuesta (en el primer uso puede no existir — frontera de dato falso); "respuestas" es ambiguo (contestación de la encuesta vs. la palabra del cliente); el gana es **leer**, no localizar; la línea 2 (14 glifos) aprieta los 320 de content |
| `LEE LO QUE / TE DICEN` | ✅ **elegida** `[propuesta]` | el beneficio puesto como verbo; presente habitual — no afirma ningún evento inventado; no usa "encuesta"; **condensa copy canónico ya publicado** (`/aboutus`: "Tú lees lo que dicen en un panel", `COPY-INTERNAS`): no afirma nada nuevo, solo recoge lo que la marca ya dice; cierra el nombre del producto (scan → say → **leer**); 10/8 glifos caben en 320 px a Bebas 64 (~218 / ~174 px estimados); cero cifras |
| `TUS CLIENTES / TE CONTESTARON` | ❌ descartada | pretérito perfecto = evento cumplido que nadie verificó (choca con la regla de oro); describe un comportamiento, no un beneficio; y la derecha ya muestra el recorrido (§12): la cifra de sentido no puede ser el evento, tiene que ser la lectura |

Subtítulo ajustado: `Escribe tu correo y te enviamos un enlace. Sin contraseña.` — cae **"para entrar"** (el titular ya da el para qué; Krug 3.ª ley: omitir palabras innecesarias) y se queda `Sin contraseña.` porque el titular no lo dice y es el diferenciador del producto. Titular = beneficio; subtítulo = mecanismo: ninguno repite la idea del otro.

Ritmo: bloque h1 61 → **122** (2 líneas · lh 0.95) → alto de tarjeta **645 → 706**; aires 69/69 (tarjeta y 125–831 dentro de la banda 844); móvil 44 px → bloque 84, la tarjeta fluye (`min-height: auto <992`, sin cambio). El `min-height` implementado (656, `VERIFICACION-LOGIN §3 #10`) pasa a **706** cuando el frontend aterrice el v2. Ancho 400, padding 40, content 320, radios: intactos.

## 5. Los 6 estados (sin inventar datos)

| estado | cómo se ve |
|---|---|
| **reposo** | lo de §4; primario activo solo con input no vacío (deshabilitado = contrato §5: coral al 25 % + texto `--text-2` 5.00 ✓, `cursor:not-allowed`, sin opacity) |
| **foco** | input: borde `--focus-ring` + ring Bootstrap (46,30,63); botones/enlaces: `outline: 3px solid` ciruela `offset 2` sobre blanco; **peach** `#FFE7D9` (12.87 vs ciruela) sobre cualquier elemento que caiga en banda ciruela (hoy ninguno focusable — se fija por si la banda derecha recibe un enlace) |
| **enviado** | el formulario se reemplaza en el mismo lugar (mismo ancho, sin salto de layout): check `FiCheck` + h2 `Revisa tu correo` [propuesta] Bebas 48 + eco literal del correo escrito + `¿No llega? Reenviar` (habilitado tras el cooldown real del backend) + `usar otro correo`. Región `role="status"` `aria-live="polite"`. **Ningún tiempo prometido** ("en 1 minuto" es cifra sin medir); expiración del enlace: copy lastra "el enlace vence pronto, úsalo en este dispositivo" `[propuesta]` (práctica 2026: ventana corta reutilizable [web: getfluxly]) |
| **error** | de campo (correo inválido, solo tras blur/submit): borde `--error` + icono + `Escribe un correo válido, por ejemplo nombre@correo.com` [propuesta] M400 14 `--error`/blanco 6.74 ✓, `role="alert"`. De servidor: alerta Bootstrap error-surface, texto `--error-fg` 7.72 ✓ sobre surface, mensaje genérico "No pudimos enviar el correo. Intentá de nuevo o escríbenos." [propuesta] — sin detalles técnicos, sin culpa del usuario |
| **cargando** | botón primario: spinner `currentColor` + `aria-busy="true"` + `min-width` fijo (contrato §5), texto congelado, submit duplicado imposible; input `readonly` |
| **sin conexión** | banner dentro de la tarjeta (icono `FiAlertTriangle` + texto "Sin conexión a internet" [propuesta], error-surface) + primario deshabilitado **con motivo** en el propio texto del banner; al volver `online`, el banner se retira con `aria-live="polite"`. Usa el estado real del navegador, no texto inventado |

`prefers-reduced-motion`: flip de hover 150 ms y spinner se rigen por el bloque global 0.01 ms del contrato §5 (el spinner pasa a icono estático `FiRefreshCw` sin girar — el texto "Enviando…" [propuesta] es el indicador primario, nunca solo movimiento).

## 6. Accesibilidad

- **Orden de tabulación = orden visual:** volver → email → primario → demo → Términos → Privacidad. Sin traps; `Esc` del foco no aplica (no hay modales). *(v2.1: sin passkey, ver §10.)*
- **Estructura:** un `h1` (`LEE LO QUE TE DICEN` `[v2 30-oct]`; el estado enviado conserva el mismo `h1` con el título `Revisa tu correo`, como hoy); `<main>` + `<form>` con `aria-labelledby` al h1; el bloque derecho lleva `aria-hidden` **solo en el mock y el wordmark** (`[v2.1]`: la frase de honestidad y la línea de recorrido son contenido, no adorno); región de estado `role="status"` **sin `aria-live` duplicado** más foco programático al contenedor; en el campo, el error se anuncia por `aria-describedby` + `aria-invalid` (sin `role="alert"` sobre un nodo recién insertado).
- **Lector de pantalla (orden narrado):** "Lee lo que te dicen, formulario. `[v2 30-oct]` Tu correo, cuadro de edición, obligatorio. Botón Enviar… " → al enviar: "Revisa tu correo… el enlace fue enviado a X" (polite, sin robar el foco); error: alerta assertive con foco devuelto al input.
- **Teclado:** todo alcanzable, foco visible 3 px siempre (nunca `outline:none`), objetivos ≥44 px (contrato §5 F3): botones 52/48, enlaces con relleno a 44 de alto.
- **Contraste (resumen medido):** ciruela/blanco 15.29 · `--text-2`/blanco 6.62 · `--link`/blanco 5.95 · ciruela/coral 5.08 · crema/`--link` (hover btn) 5.65 · error/blanco 6.74 · `--error-fg`/surface 7.72 · ok-fg/surface 6.44 · crema/ciruela 15.29 · crema 75 %/ciruela 8.78 · mostaza/ciruela 8.45 · borde/blanco 3.11 (UI ≥3 ✓) · peach/ciruela 12.87 (foco). Placeholder 2.69: único valor bajo AA, exento por llevar la guía en el label (§4 fila 5).
- **Ningún estado solo por color:** error = icono + texto · seleccionado mock = check + borde · foco = contorno · badge = texto `DEMO`.

## 7. Responsive (colapso en orden)

1. **<992:** la mitad derecha desaparece como panel y pasa a **franja ciruela superior** (h 96 → h 88 en móvil): mantiene color, capas y wordmark; se van el deck, el mock, la línea de recorrido y la nota (`[v2]`: decorativos y ya `aria-hidden`).
2. **<992:** tarjeta del formulario a columna centrada (420 → 343 a 375); padding 40→24; H1 64→44.
3. **<576:** botones full-width; label de 14 se mantiene. *(v2.1: sin passkey que apilar.)*
4. En móvil la ilustración **se reduce a franja** (no desaparece del todo): la firma ciruela+glow sigue presente, el mock sí desaparece. Sin scroll horizontal (375: 16+343+16=375 exacto).

## 8. Qué NO lleva y por qué (anti-slop)

| no lleva | por qué |
|---|---|
| "10.000 negocios confían en nosotros", contadores, logos de clientes | regla de oro `REVISION-UX §1`: no se inventan datos; gate D2 de `RIESGOS-USUARIO.md` |
| testimonios en el login | mismo motivo + fuera de tarea: el login no convence, deja entrar |
| "¿Olvidaste tu contraseña?" | no hay contraseña (producto: magic link); copiar el patrón del template sería mentir sobre el sistema |
| formulario de registro separado | no existe alta de cuenta; el correo mágico sirve al primer acceso y al siguiente por igual |
| wall de OAuth (Google/FB/Apple) | §4 fila 9: proveedor no conectado + regla Apple + logos oficiales vetados para recolorear |
| QR de acceso | decisión cerrada del QR solo para el cliente en el mostrador (`ANALISIS-QR §3`); un QR que no escanea rompe la promesa central |
| "recordarme" / "sesión activa en otros dispositivos" | no hay sesión que gobernar sin backend; honestidad |
| pill totalmente redondo en CTA (como la referencia) | el radio del sistema manda (BS default + `--radius-card`); la mezcla aleatoria de radios es slop tell (`ANALISIS-LOGIN-wan §7`); la píldora es moda, la firma es el flip ciruela↔crema |
| glow animado, orbe con parallax, backdrop-filter | EFECTOS §1: blobs sin token y animación de fondo prohibidos; el glow es el token estático y 1 por página |
| tercera familia, emojis como iconos, mostaza >5 % | contrato §6; mostaza solo badge `DEMO` (≈1 % del viewport) |

## 9. Decisiones abiertas antes de implementar (revisión del 30-oct)

Estas tres decisiones **no las puede tomar el diseño**; hasta cerrarlas, la pantalla queda como pieza de diseño y no se construye.

| # | Decisión | Por qué bloquea | Qué cambia según la respuesta |
|---|---|---|---|
| 1 | ~~**Rol de la pantalla**~~ | **CERRADA 30-oct por el operador:** es el **login del panel del local** (el dueño del negocio), se construye **primero el frontend**. No es lista de espera. | el copy se mantiene en clave de acceso (`ENTRAR`, `ENVIARME EL ENLACE`); queda prohibido simular un envío real: ver §10 |
| 2 | **Contrato de estados de los dos flujos** (correo y passkey, por separado): carga, enviado, éxito, error, vacío, y la expiración del enlace | el §5 los describe a nivel visual, pero sin texto literal del error ni tiempo de vencimiento no hay criterio verificable de "enviado" | si no se cierra, el estado "enviado" solo puede ser un dibujo, y simular éxito es exactamente lo que este proyecto prohíbe |
| 3 | **Passkey: ¿se queda o se retira del diseño?** | WebAuthn **no funciona sin un RP ID registrado y un origen válido**: el botón no "no hace nada", lanza `NotAllowedError`. Es un fallo técnico, no un placeholder | se queda → se rotula `[futuro]` y se documenta la dependencia de backend; se retira → el secundario desaparece y la tarjeta gana aire |
| 4 | **Excepción declarada al design system** (si aplica) | la pantalla usa Bootstrap + `react-icons` + `next/font`, igual que el resto del sitio; si en el futuro el design system migra, esta pantalla debe seguir la migración, no quedar isla | registrar la excepción en `DESIGN-CONTRACT` o migrarla junto con el resto |

> **Revisión independiente (Go, `gpt-6-luna`, 30-oct):** veredicto *"no listo para implementación"* por las decisiones 1–3 y por falta de criterios verificables de a11y/rendimiento en el documento de diseño. Los contrastes sí están medidos en §6; lo que falta es el contrato de estados y el rol de la pantalla.

## 10. Alcance v1 — solo frontend (panel del local)

Decidido por el operador el 30-oct: se construye **primero el frontend** del acceso al panel del local. Sin backend de autenticación todavía. Eso obliga a un comportamiento explícito para que la pantalla no mienta:

| Aspecto | Regla v1 |
|---|---|
| **Ruta** | `[propuesta]` `/entrar` (pública, fuera de `/panel/*` para que el grupo protegido no la capture). Alternativa si el panel vivirá en `/panel`: `/panel/entrar` |
| **Enlace desde el sitio** | **no todavía**: no se agrega "Entrar" al navbar hasta que exista el panel. Se accede por URL; así el sitio de marketing no promete una puerta que no lleva a nada |
| **Botón primario** | valida el correo en cliente y **cambia al estado "Revisa tu correo"** con una banda visible `DEMO · no se envía ningún correo` dentro de la tarjeta. Sin `fetch`, sin temporizadores, sin mensajes de "listo" |
| **Estado enviado** | muestra el correo tal como se escribió (eco literal), un botón `Usar otro correo` que vuelve al formulario, y **ningún** "reenviar en 30 s" (no hay backend que lo cumpla) |
| **Passkey** | **ausente en v1.** WebAuthn sin RP registrado lanza `NotAllowedError`; un botón deshabilitado sin explicación es ruido. Se rotula como `[futuro]` en la spec y se reintroduce cuando exista backend |
| **OAuth** | ausente, igual que en §4 fila 9 |
| **Errores** | solo validación de campo (formato de correo) y el estado "sin conexión" del navegador. **No** se inventan errores de servidor porque no hay servidor |
| **Almacenamiento** | ninguno: no se guarda el correo en `localStorage` ni en cookies. La pantalla no recuerda nada |
| **Entregable de "implementado"** | la pantalla navegable, con los 6 estados demostrables por teclado, `check:tokens` y `check:placeholders` en verde, captura a 1440 y 375, y el estado enviado rotulado DEMO |

Con esto, la decisión 2 (§9) se reduce a: **textos literales del error de validación y de la banda DEMO** — que están escritos arriba y en §5 — y la decisión 3 queda resuelta por esta tabla (passkey fuera de v1).

## 11. Efectos, gradientes y tokens nuevos `[v2 30-oct]`

> Orden del operador (30-oct): la mitad ciruela tenía un solo glow y la derecha era plana → profundidad por capas, no baño de color. Todo efecto nuevo nace de `--brand-plum / --brand-coral / --brand-cream / black` con `color-mix` (el black como partner de mezcla ya es precedente del contrato: `--*-fg`). **Se superan los "cero tokens" de `LOGIN-DECISIONES.md §3`** — el v2 declara **4 tokens nuevos**, el máximo permitido; ningún token existente se toca.

### 11.a Los 4 tokens

| token | valor | dónde se usa | por qué |
|---|---|---|---|
| `--grad-plum-deep` | `linear-gradient(165deg, color-mix(in srgb, var(--brand-plum) 82%, black) 0%, var(--brand-plum) 55%, color-mix(in srgb, var(--brand-coral) 7%, var(--brand-plum)) 100%)` | `.login-right`, `background-image` **capa base**, bajo los glows; el `background-color` ciruela sigue debajo (regla EFECTOS §2.1: la imagen nunca reemplaza el color) | da cuerpo y dirección a la banda sin blobs: el fondo se oscurece arriba-izq (bajo el glow, no contra él) y se calienta abajo-der (recibe el `--glow-corner`); coral 7 % es casi imperceptible solo — es atmósfera, no degradado de marca |
| `--glow-corner` | `radial-gradient(55% 55% at 86% 94%, color-mix(in srgb, var(--brand-coral) 12%, transparent) 0%, transparent 70%)` | `.login-right`, segunda capa de `background-image` (encima de `--grad-plum-deep`, conviviendo con `--glow-hero` contenido 62 %) | contrapeso diagonal del glow de arriba-izq: hoy todo el peso decorativo está en una esquina; el par crea profundidad sin tercer elemento; 12 % vs el 28 % del hero: es relleno, no protagonista |
| `--edge-lit` | `color-mix(in srgb, var(--brand-cream) 22%, transparent)` | borde 1 px del deck del panel; barras-esqueleto del deck; línea vertical conectora entre deck y mock | bisel de 1 px: el filo claro de las tarjetas sobre ciruela es lo que separa "pila de cartas" de "dos rectángulos"; sustituye a la sombra donde la sombra no se ve (superficie oscura) |
| `--shadow-lift` | `0 2px 6px color-mix(in srgb, black 30%, transparent), 0 18px 44px color-mix(in srgb, black 45%, transparent)` | mock delantero (360×268); **no** en el deck ni en la tarjeta izquierda | sombra de 2 niveles pegada al borde (1 fina de contacto + 1 amplia de altura — regla `rag: chk:c30bd1ee` de EFECTOS §2.2); **excepción registrada**: EFECTOS §2.2 reserva sombra a tarjetas clicables de landing; el mock es dibujo decorativo `aria-hidden`, no componente; presupuesto: 2 elementos con sombra en la pantalla (mock + nada más en la crema) ≤ 3 ✓ |

**Gobernanza:** `--glow-hero` sigue en su única colocación login (3.ª del sitio, pendiente de acta como ya anotaba el plano); `--glow-corner` es **un token nuevo, estático y acotado a `/entrar`** (1 colocación, como el patrón de la familia) — ambas quedan anotadas para el adendum de `EFECTOS-Y-MOTION §2.1` cuando el orquestador toque ese archivo. Contraste sobre la pila de fondos (peor caso = capa más clara): crema 75 % y Bebas de la línea de recorrido sobre ciruela + mezcla coral 12 % → por encima del piso de los 8.78 actuales; **se re-mide en la captura del gate** si el reviewer lo exige, misma disciplina de EFECTOS §2.1.

### 11.b Composición de la mitad derecha — de abajo a arriba

| # | capa | qué es | cota |
|---|---|---|---|
| 1 | `--brand-plum` | `background-color` base, full-bleed de la mitad (720×844) | sin cambio |
| 2 | `--grad-plum-deep` | wash direccional 165° (oscuro arriba-izq → plum medio 55 % → tibio abajo-der) | full-bleed sobre la capa 1 |
| 3 | `--glow-hero` | radial coral 28 %, centro 18 % 6 % de la mitad, **contenido a 62 %** (como implementado, `VERIFICACION-LOGIN §3 #8`) | centro ≈ (850, 107); radio dibujado 252 |
| 4 | `--glow-corner` | radial coral 12 %, centro 86 % 94 % | centro ≈ (1339, 849); radios 396×464; **debajo** de las tarjetas (no las ilumina: las enmarca) |
| 5 | deck del panel | carta 328×200 (x 932–1260, y 180–380), relleno `color-mix(in srgb, var(--brand-cream) 9%, var(--brand-plum))`, borde 1 px `--edge-lit`, radio 16; contenido = título Bebas 20 + 3 filas estructura | asoma 36 px sobre el mock (solape y 344–380); el mock la cubre desde ahí |
| 6 | mock delantero | la carta verificada 360×268 (x 900–1260, y 344–612) — cotas, pad 32 y contenido **sin cambio** — ahora con `--shadow-lift` | flota sobre el deck: sombra amplia 44 px de caída, justa bajo la carta |
| 7 | línea de recorrido | `EL CLIENTE ESCANEA · CONTESTA · TÚ LO LEES` Bebas 20 crema 75 % centrada (x 1080, baseline ≈ 652) | entre el borde inferior del mock (612) y la nota (686); gap 40 |
| 8 | nota + frase | "ejemplo de referencia · sin funciones" (crema 75 %, y ≈ 686) y frase canónica "Panel en construcción…" (crema, y 760/778) | sin cambio de estilo; la frase sigue siendo la última línea de honestidad |

**Animación de entrada (única de la pantalla, como el patrón del hero EFECTOS §4):** 4 elementos en grupo — deck → mock → línea de recorrido → frase — `opacity 0→1 + translateY(12px)→0`, 500 ms `--ease-out`, stagger 60 ms entre hermanos. Solo `transform`/`opacity`; 0 JS; 0 `will-change`; sin animación infinita. `prefers-reduced-motion: reduce` → el bloque global 0.01 ms del contrato deja la pantalla **idéntica en reposo**: el color y las capas son el mensaje, el movimiento solo lo presenta (criterio "el contenido se ve sin animación"). En la crema no entra nada de esto: la tarjeta del formulario sigue plana (marco sin sombra) — la riqueza vive en la promesa (ciruela), la calma en la función (crema).

### 11.c Lo que NO se hace

- **Nada de glassmorphism** (`backdrop-filter` sigue en 0 — EFECTOS §1/§2.3).
- **Nada de neón / resplandores de texto / gradientes multicolor en malla** ni degradados púrpura-cian: el wash de la banda es monocromo ciruela con sesgo coral 7 %; los glows translúcidos no se ven como neón porque no tienen borde ni saturación alta.
- **Nada de tercera familia tipográfica, cero emojis como iconos** (contrato §6).
- **Nada de mostaza nueva**: la línea de recorrido no suma mostaza; el presupuesto ≤5 % queda en el badge `DEMO` (56×22 ≈ 0,1 % del viewport) + nada más — **bajando**, no subiendo.
- **Coral nunca como texto sobre fondo claro**: todo texto nuevo va sobre ciruela (crema) o sobre blanco (ciruela); el coral extra es solo glow translúcido y la selección de escala que ya existía.
- **Nada que dependa de imágenes**: sin fotos, sin SVG de producto, sin noise/grain — toda la profundidad es gradiente + sombra + 1 px de borde.
- **Sin parallax, sin mouse-tracking, sin shimmer, sin animación que se repita**: una sola entrada, al cargar, 1 vez.
- **La tarjeta izquierda no recibe sombra ni gradiente** (excepción §2.2 solo aplica al mock decorativo).

## 12. Qué comunica la mitad derecha `[v2 30-oct]`

Antes era una carta de encuesta sola: mostraba **un momento** (el cliente contestando) y nada más. Ahora muestra **el recorrido completo en 3 pasos**, que es lo que el dueño necesita creer antes de escribir su correo:

```
EL CLIENTE ESCANEA · CONTESTA · TÚ LO LEES
```

| Paso | qué lo dibuja | por qué así |
|---|---|---|
| **escanea** | el mock delantero con la escala 1–5 y una selección (tile 5 activo, coral) — el acto de responder es visible | es la escena que el dueño ya conoce del mostrador; el sitio la describe igual (`/service-detail` "DEL MOSTRADOR AL PANEL") |
| **contesta** | el botón `Enviar` del mock + badge `DEMO` | la respuesta viaja: la carta no es el final, es el origen |
| **tú lees** | el **deck** detrás del mock: `VISTA DEL PANEL` con 3 filas de estructura (punto + barra, `--edge-lit`) y **cero cifras** | es el destino del correo que se va a escribir — el titular (`LEE LO QUE TE DICEN`) señala físicamente a esta carta: beneficio (titular) y prueba (derecha) se apuntan |

**Por qué con estructura y no con cifras:** el proyecto no tiene piloto medido — cualquier `4,9/5`, `1.200 respuestas` o avatar con nombre sería **dato inventado** (regla de oro `REVISION-UX §1/§5-3`, gate D2). Lo que comunica valor aquí es la **forma** del recorrido (origen → viaje → lectura), no su resultado. El único número que aparece en el bloque es `1–5`, que es la definición del producto (la escala existe en el diseño), no una métrica. Si mañana llegan datos reales del piloto, entran por `DASHBOARD-UX` (n<10: solo absolutos), nunca disfrazados en el login.

**Por qué la línea de texto y no tres pasos ilustrados:** Krug — el login no convence, deja entrar (`§8` de este doc); la derecha tiene que explicarse en un vistazo sin leer: dos cartas apiladas + una línea de 7 palabras. Tres tarjetas con numeración competirían con la jerarquía (Hick) y exigirían más superficie de la que hay: la mitad derecha sigue siendo **un mock con badge DEMO, `aria-hidden`, con la nota "ejemplo de referencia · sin funciones"** — misma honestidad de antes, ahora con recorrido. La frase canónica ("Panel en construcción. Te avisamos cuando esté.") cierra la promesa sin romperla.
