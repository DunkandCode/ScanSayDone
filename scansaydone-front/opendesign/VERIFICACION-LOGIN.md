# VERIFICACION-LOGIN — prototipo `/entrar` (30-oct-2026)

> Alcance: **solo frontend**. No hay autenticación, no hay `fetch`, no hay almacenamiento.
> Spec: `LOGIN-UX.md` (§10 alcance v1) · Decisiones: `LOGIN-DECISIONES.md` · Plano: `wireframes/10-login.svg`
> Capturas: `capturas/2026-10-30/` (1440 reposo / error / enviado, 375 reposo)

## 1. Qué se construyó

| Archivo | Rol |
|---|---|
| `src/app/entrar/page.jsx` | Pantalla de acceso, componente cliente, 5 estados |
| `src/app/entrar/layout.js` | `metadata` propia (`Entrar`), hereda `robots: noindex` global |
| `src/app/assets/scss/_login.scss` | Split, tarjeta, formulario, mock, bandas responsive |
| `src/app/assets/scss/style.scss` | `@use "login"` añadido |

Sin navbar ni footer: la pantalla es full-bleed y lleva su propio `← Volver al sitio`.

## 2. Estados implementados

| Estado | Comportamiento | Verificado |
|---|---|---|
| reposo | botón deshabilitado con borde y texto `--text-2`; se habilita con correo válido | sí |
| foco | `outline: 3px solid var(--brand-plum)`, offset 2 (peach sobre ciruela) | sí |
| error | solo tras `blur` o `submit`: borde `--state-err`, icono, texto y `role="alert"` + `aria-describedby` | sí (interacción real, no evento sintético) |
| enviado | reemplaza el formulario, conserva `<h1>`, eco literal del correo, banda `DEMO · no se envía ningún correo`, botón `Usar otro correo`; recibe el foco | sí |
| sin conexión | `navigator.onLine` + eventos `online`/`offline` | implementado |
| cargando | **no existe**: no hay petición que esperar; un spinner sería teatro | — |

## 3. Defectos encontrados al medir (no al leer el código)

Todos se detectaron con el navegador abierto; ninguno se habría visto en una revisión de código.

| # | Defecto | Causa raíz | Corrección | Prueba |
|---|---|---|---|---|
| 1 | El `h1` medía **42 px**, no 64 | `_bootstrap-custom.scss` emite `h1 { font-size: 42px !important }` en su bucle de escalas | `font-size: 64px !important` (44 en móvil) + comentario, mismo precedente que `.hero-title` | `getComputedStyle(h1).fontSize` = `64px` |
| 2 | El split daba **696 / 744**, no 720/720 | ambos lados con `flex: 1` (= `flex-basis: 0`): el reparto inicial lo fijaba el padding, 32 vs 80 px | `flex: 1 1 50%` en los dos; en columna, `flex: 0 0 96px` para la franja | `left 720 / right 720` |
| 3 | Botón deshabilitado con **2,2:1** | coral al 25 % + `--text-2` | superficie blanca + borde `--border-strong` + `--text-2` | `6,62:1`, borde visible |
| 4 | `<button>` dentro de `aria-hidden` | el mock usaba un control real | `<span aria-hidden="true">` | `tagName` = `SPAN`, fuera del orden de tabulación |
| 5 | Al enviar **desaparecía el `h1`** y el foco caía al `body` | el estado enviado usaba `h2` | `h1` en ambos estados + `sentRef.focus()` y retorno al input en `Usar otro correo` | `h1count = 1`, `activeElement = login-sent` |
| 6 | Tarjeta descentrada y **261 px** a 375 | `← Volver al sitio` era hermano flex de la tarjeta y se repartían la fila | `flex-direction: column` + enlace en `position: absolute` | tarjeta `343` en x 16; a 1440 `400` en x 160–560 |
| 7 | Banda blanca de 76 px arriba y frase cortada abajo | `globals.css` pone `main { padding-top: 76px }` para la navbar fija, que aquí no existe | `main:has(> .login-split) { padding-top: 0 }` | `split top 0 / height 900`, frase a 852 visible |
| 8 | Glow del hero cubría casi todo el panel | `--glow-hero` está dimensionado para una banda ancha | se reutiliza el token contenido: `background-size: 62% 62%`, `no-repeat` | revisión visual |
| 9 | Anillo de foco de 3 px alrededor del bloque de confirmación | `:focus-visible` global aplicado a un `tabIndex={-1}` que no es control | `outline: none` en `.login-sent:focus` | `outlineStyle = none` |
| 10 | Salto de altura 676 → 528 entre estados | tarjeta sin altura mínima | `min-height: 656px` (auto bajo 992) + centrado del bloque | `cardH = 656` en ambos |

## 4. Medidas finales (build verificado)

| Medida | Valor |
|---|---|
| Split a 1440 | 720 / 720 |
| Tarjeta | 400 × 656 en x 160–560 (343 × 621 a 375) |
| `h1` | 64 px (44 a 375) |
| Botón primario | 52 px de alto |
| Enlaces y objetivos táctiles | 44 px mínimo (`Volver`, `Ver la demo`) |
| Scroll horizontal | 0 a 375 / 768 / 1024 / 1440 |
| Scroll vertical a 1440 | 0 (`scrollHeight = 900`) |

### Contrastes medidos en el DOM

| Elemento | Par | Ratio |
|---|---|---|
| `h1` ENTRAR | `#2E1E3F` sobre blanco | **15,29** |
| Subtítulo | `#65586E` sobre blanco | **6,62** |
| Label `Tu correo` | `#2E1E3F` sobre blanco | **15,29** |
| Placeholder | `#65586E` sobre blanco | **6,62** |
| Botón deshabilitado | `#65586E` sobre blanco | **6,62** |
| Enlace `Ver la demo` / `Volver` | `#B23A2A` sobre crema | **5,95** |
| Nota legal | `#65586E` sobre blanco | **6,62** |
| Error | `#A82E39` sobre blanco | AA |

El placeholder usa `--text-2` en lugar del `--text-3` que proponía la spec: la excepción de 2,69:1 **no se implementó**.

## 5. Guardas

- `npm run build` → compilado, **10 rutas** (antes 9)
- `check:tokens` → `OK: tokens emitidos correctamente`
- `check:placeholders` → `OK: 0 placeholders`
- 10/10 rutas responden 200 (`/`, `/entrar`, `/aboutus`, `/contactus`, `/faqs`, `/pricing`, `/privacy`, `/service-detail`, `/services`, `/terms`)
- Cero `fetch`, cero `localStorage`/cookies, cero `setTimeout`

## 5b. Ronda de revisión estática (misma fecha)

La revisión de código encontró cuatro defectos que **la medición en navegador no puede ver**, porque son fallos de cascada y de validación, no de layout. Todos corregidos y re-verificados.

| # | Defecto | Causa | Prueba del arreglo |
|---|---|---|---|
| 11 | Los tres enlaces de la pantalla no se subrayaban nunca | `_general.scss:38` fuerza `a { text-decoration: none !important }` | `textDecorationLine = underline` en `Volver`, `Ver la demo` y los enlaces legales |
| 12 | La validación nativa del navegador interceptaba el envío, así que el error estilizado solo aparecía con `blur` | `<form>` sin `noValidate` + `type="email"` | con `ana@` y clic en el botón: aparece el error propio y se sigue en el formulario |
| 13 | Un correo pegado con espacios se rechazaba | `validateEmail` validaba el valor crudo | `"  perez@correo.cl  "` → aceptado, eco `perez@correo.cl` |
| 14 | El `h1` del estado enviado se renderizaba a 42 px en vez de 48 | `.login-sent-title` sin `!important`, perdía contra el `h1` global | `getComputedStyle(h1).fontSize = 48px` |

Ajustes menores aplicados en la misma ronda: `aria-live` duplicado en `role="status"` eliminado; `role="alert"` reemplazado por `aria-describedby` + `aria-invalid`; el `aria-hidden` del panel derecho se limitó al mock y al wordmark, para que la frase "Panel en construcción" llegue a lectores de pantalla; `100vh` → `100dvh` con respaldo; cuatro reglas muertas eliminadas.

### Decisión pendiente (no aplicada)

El chip `DEMO · no se envía ningún correo` aparece **después** de pulsar el botón. Antes de pulsar, el formulario afirma "te enviamos un enlace". En móvil el badge `DEMO` del mock está oculto, así que la única señal previa es el enlace `Ver la demo del panel`.

Dos salidas, ambas de una línea:

- **A** · mostrar el chip también en el estado de formulario (honesto, pero debilita la sensación de producto real).
- **B** · dejarlo como está y aceptar que la pantalla promete el flujo completo, porque el sitio entero está en `noindex` y sin enlaces públicos.

Sin decisión del operador, la pantalla transmite B por defecto.

## 5c. v2 — efectos, gradientes y sentido de producto (30-oct, segunda pasada)

Orden del operador: el `ENTRAR` repetía la marca y el botón; la mitad derecha era plana; faltaba decir **qué gana el dueño**. Cambios aplicados:

| Qué | Antes | Ahora |
|---|---|---|
| Titular | `ENTRAR` (repetía marca y botón) | `LEE LO QUE / TE DICEN`, dos líneas, Bebas 64 (44 en móvil), bloque 122 |
| Subtítulo | "…un enlace para entrar. Sin contraseña." | "…un enlace. Sin contraseña." (el titular ya dijo para qué) |
| Fondo de la mitad ciruela | 1 glow | 3 capas: `--grad-plum-deep` + `--glow-hero` (62 %) + `--glow-corner` (esquina opuesta) |
| Contenido derecho | 1 tarjeta de encuesta | **deck `VISTA DEL PANEL` 328×200 con solape 36** + mock 360 al frente con `--shadow-lift` + línea `EL CLIENTE ESCANEA · CONTESTA · TÚ LO LEES` + nota `ejemplo de referencia · sin funciones` |
| Movimiento | ninguno | 1 entrada, `opacity` + `translateY(12px)`, 500 ms, stagger 60 ms; nada de bucles |
| Tokens | — | 4 nuevos: `--grad-plum-deep`, `--glow-corner`, `--edge-lit`, `--shadow-lift` (ninguno existente modificado) |

El mensaje que transmite la derecha pasó de "un momento" (el cliente contestando) a **el recorrido completo**: escanea → contesta → el dueño lee. Con estructura y sin cifras: cero datos inventados.

### Defectos de esta ronda (encontrados midiendo, no leyendo)

| # | Defecto | Causa | Prueba del arreglo |
|---|---|---|---|
| 15 | La línea de recorrido se salía al costado y se superponía al mock | `.login-right` era flex en fila; con 4 hijos nuevos se comprimieron a 159 px | `flex-direction: column`; `run` pasa a 312 px centrado en x 1080 |
| 16 | La frase de honestidad saltaba 150 px al empezar y al terminar la animación | el keyframe `login-rise` termina en `transform: none`, anulando el `translateX(-50%)` que la centraba | centrado por `left/right: 0` + `margin auto` + `width: max-content`; frase y línea comparten centro exacto (1080) |
| 17 | El plano dibujaba un botón `Entrar con passkey` que no existe | el SVG v2 reintrodujo la fila que §10 había sacado | plano v2.1 sin passkey, ritmo recotizado a 706, `LOGIN-UX §4` sincronizado |

### Medidas v2 (navegador, build verificado)

| Medida | Valor |
|---|---|
| Split | 720 / 720 |
| Tarjeta | 400 en x 160–560; 706 de mínimo, 737 con contenido |
| Deck | 328 × 200 en x 932–1260, solape 36 sobre el mock |
| Mock | 360 × 286 en x 900–1260, con sombra de 2 niveles |
| Línea de recorrido | 312 px centrada en x 1080 |
| `h1` | 64 px, 2 líneas, bloque 122 (44 en móvil) |
| Franja móvil | 96 px; deck, mock, línea y nota ocultos |
| Scroll horizontal | 0 a 375 y 1440 |

## 6. Lo que queda fuera a propósito

- **Passkey**: WebAuthn sin RP registrado lanza `NotAllowedError`. Vuelve cuando exista backend.
- **OAuth**: no hay proveedor conectado; un botón que no hace nada es el formulario muerto que se quitó de `/contactus`.
- **Enlace desde el navbar**: no se añade "Entrar" hasta que el panel exista.
- **Panel de destino**: `Ver la demo del panel` apunta a `/#panel`, el marco de la landing. No hay panel real.

## 7. Notas de criterio (cosméticas, no defectos)

1. El CTA deshabilitado queda en estilo fantasma. Es honesto (no se puede enviar) pero el peso visual del botón primario desaparece en reposo. Alternativa si el operador la prefiere: dejar el botón siempre activo y que el error aparezca al pulsar.
2. El glow contenido sigue siendo intenso en la esquina superior izquierda. Si molesta, `background-size: 45% 45%`.
3. El check de éxito usa `--state-ok` (verde). Es un tono fuera de la paleta de marca; está tokenizado, pero conviene decidir si el éxito debe ser ciruela con check crema.

## 8. Para conectar el backend (parámetros que la pantalla espera)

| Necesidad | Dónde |
|---|---|
| Endpoint de envío del enlace mágico | sustituir el `setIsSubmitted(true)` de `handleSubmit` |
| Texto y tiempo de expiración del enlace | estado enviado (§10 `LOGIN-UX.md`) |
| Mensajes de error del servidor | hoy solo existe validación de cliente |
| Passkey | requiere RP ID + origen válido registrados |
