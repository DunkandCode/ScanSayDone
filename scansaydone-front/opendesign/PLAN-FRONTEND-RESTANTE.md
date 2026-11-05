# PLAN-FRONTEND-RESTANTE — lo que falta, en lotes autorizables

> 30-oct-2026 · inventario verificado contra el código, no contra la memoria · **solo frontend** (sin backend, sin base de datos, sin autenticación real).
> Este documento **no implementa nada**: define los lotes y qué evidencia cierra cada uno. Se ejecuta solo con autorización explícita del operador.

---

## 1. Inventario: qué existe hoy

**13 rutas construidas y verificadas (13/13 → 200):**

```
/  /aboutus  /contactus  /faqs  /pricing  /privacy  /service-detail  /services  /terms
/entrar
/panel  /panel/respuestas  /panel/qr
```

**13 planos vigentes** (`00-grid-system`, `01-hero`, `02-como-funciona`, `03-canales`, `04-panel-preview`, `05-precios`, `06-faq-cta`, `07-footer`, `08-aplicaciones`, `09-page-hero`, `10-login`, `11-panel`, `12-dashboard`) + 4 históricos (`d01…d04`).

**39 documentos** en `opendesign/`, con actas de verificación del login, panel y dashboard.

---

## 2. Lo que falta (y por qué importa)

| # | Falta | Por qué importa | Tamaño |
|---|---|---|---|
| 1 | **La encuesta pública `/e/[code]`** | Es **el producto**. Hoy se puede entrar al panel y ver respuestas, pero **no existe la pantalla donde el cliente las produce**. Sin esto, todo lo demás es una vitrina | grande |
| 2 | **Detalle de una respuesta** (`/panel/respuestas/[id]`) | En la tabla el dueño ve un `4` suelto; no puede abrir la respuesta a pantalla completa | mediano |
| 3 | **Páginas de error con la marca** (404 y 500) | Hoy Next muestra su pantalla por defecto: un callejón sin salida en gris | chico |
| 4 | Documentos de las pantallas nuevas | Sin spec, el código nuevo queda sin criterio de aceptación | incluido en cada lote |
| 5 | Planos de las pantallas nuevas | Sin plano no hay cotas que verificar | incluido en cada lote |

**Cerrado por decisión, no por olvido:** `Ajustes` (no hay nada que ajustar), precios publicados (sin montos reales), QR real (sin backend), fotos reales (no existen), `sitemap`/`robots` (el sitio entero está en `noindex` hasta publicar).

---

## 3. Lo que NO se puede hacer sin backend (alcance honesto)

Cada cosa que sigue se puede **simular en pantalla** con rótulo `DEMO`, pero no funcionar:

| Función | Qué se puede construir | Qué queda para después |
|---|---|---|
| Responder la encuesta | las 3 pantallas y el envío simulado | guardar la respuesta en una base |
| Ver respuestas en el panel | el estado con el dataset de ejemplo | leer respuestas reales |
| Enlace mágico del login | el estado "revisa tu correo" | enviar el correo y validar el token |
| QR | el marco y los 3 pasos | generar el símbolo con la URL real |
| Sesión | nada | proteger `/panel/*` |

Regla que se mantiene: **nada simula éxito sin decirlo**. El botón que envía la encuesta dirá que no se guardó.

---

## 4. Los lotes

Cada lote = **1 o 2 delegaciones** + mi verificación medida + acta + commit. Al final de cada uno te pido autorización para el siguiente.

### Lote B1 — Diseño de la encuesta pública

| | |
|---|---|
| **Objetivo** | Spec y plano de `/e/[code]`: la pantalla que ve el cliente al escanear el QR |
| **Agente** | `designer-alibaba` (solo documentos y SVG) |
| **Entregables** | `ENCUESTA-UX.md` (flujo de 4 pasos, cotas, estados, a11y, copy) · `wireframes/13-encuesta.svg` + PNG 1440×900 con la vista móvil en el rail · filas en `INDEX.md`, `png/INDEX.md` y `ENTREGA-UX.md` |
| **Criterio de aceptación** | build intacto (no se toca `src/`) · PNG 1440×900 confirmado · **yo abro el PNG y verifico que no haya textos solapados** · copy sin cifras y sin promesas (marcado `[propuesta]`) · contraste de cada texto medido |
| **Riesgo** | el diseño puede querer animaciones o QR decorativo; se rechazan por contrato |
| **Bloqueado por** | **Q2 y Q3 del producto** (ver §6) |

### Lote B2 — Frontend de la encuesta

| | |
|---|---|
| **Objetivo** | Que la encuesta se pueda contestar de verdad en el navegador (sin guardar nada) |
| **Agentes** | `frontend-alibaba` para la implementación; `code-support` para una segunda opinión al cerrar |
| **Entregables** | `/e/[code]` con 4 pantallas: portada · las 3 preguntas (una por pantalla, progreso `1 de 3`) · gracias con aviso `DEMO · tu respuesta no se guardó` · `_encuesta.scss` · `VERIFICACION-ENCUESTA.md` · capturas 1440 y 375 |
| **Criterio de aceptación** | build OK · **14/14 rutas 200** · `check:tokens` y `check:placeholders` en verde · escala 1–5 como `radio` reales navegables con teclado · foco visible · sin `fetch` ni almacenamiento · 0 cifras inventadas · medición de contraste y de objetivos táctiles pegada en el acta |
| **Riesgo** | que el flujo de 3 pasos se sienta lento en escritorio; se resuelve con diseño, no con código |
| **Depende de** | B1 (las cotas y el copy) |

### Lote B3 — Detalle de una respuesta en el panel

| | |
|---|---|
| **Objetivo** | Abrir una fila de la tabla y ver la respuesta completa |
| **Agentes** | `designer-alibaba` (plano `14-detalle.svg`, corto) + `frontend-alibaba` (ruta) |
| **Entregables** | `/panel/respuestas/[id]` con los 3 valores, canal, fecha, navegación anterior/siguiente y volver · `VERIFICACION-DETALLE.md` · capturas |
| **Criterio de aceptación** | 15/15 rutas 200 · un `id` inexistente cae en la página de error del lote B4 · el foco entra al título al navegar · medición de contrastes |
| **Riesgo** | que la navegación entre respuestas genere URLs sin datos; se resuelve con el dataset de ejemplo |
| **Depende de** | B2 (comparte el modelo de datos) |

### Lote B4 — Páginas de error con la marca

| | |
|---|---|
| **Objetivo** | Que un enlace roto no termine en la pantalla gris de Next |
| **Agente** | `frontend-alibaba` (chico, sin plano nuevo: reusa `page-hero`) |
| **Entregables** | `not-found.js` global + `error.js` · copy honesto · enlace de vuelta a `/` y a `/panel` |
| **Criterio de aceptación** | una URL inventada devuelve 404 **con la página propia** (comprobado con `Invoke-WebRequest`) · contraste y foco medidos |
| **Riesgo** | bajo |

### Lote B5 — Cierre documental y entrega

| | |
|---|---|
| **Objetivo** | Que la entrega refleje todo lo construido, con capturas y manual al día |
| **Agente** | yo (documentación), sin delegación de código |
| **Entregables** | `REVISION-UX-2026-10-30.md` ampliada con las pantallas nuevas · `ENTREGA-UX.md` e `INDEX.md` al día · `INDICE-ENTREGA.txt` regenerado y verificado ruta por ruta · capturas de página completa de todo · **zip nuevo** con fecha |
| **Criterio de aceptación** | todas las rutas del índice existen (script de verificación) · zip listado y abierto · 0 enlaces muertos |
| **Depende de** | B2, B3 y B4 |

---

## 5. Orden y dependencias

```
B1 (diseño encuesta) ──► B2 (frontend encuesta) ──► B3 (detalle) ──► B4 (errores) ──► B5 (cierre y entrega)
```

`B1` es el único que bloquea todo el resto: sin spec ni cotas, el frontend se inventa.

**Estimación:** 6 delegaciones + 5 verificaciones mías. Los lotes B3 y B4 son chicos; si preferís, se pueden unir en uno solo.

---

## 6. Decisiones que necesito ANTES de B1

| # | Decisión | Por qué bloquea | Mi recomendación |
|---|---|---|---|
| 1 | **Q2 y Q3 del producto** | la encuesta muestra las 3 preguntas: si no están aprobadas, el plano nace en `[confirmar]` otra vez | `¿Volverías?` y `¿Qué mejorarías?` (las que ya usa el panel) |
| 2 | **Q3 abierta o cerrada** | `¿Qué mejorarías?` suena a texto libre, pero el panel la trata como escala 1–5 | dejarla **1–5** para el MVP; el texto libre trae moderación y datos personales |
| 3 | **Una pregunta por pantalla o las 3 juntas** | cambia el flujo entero y el número de planos | **una por pantalla** con progreso `1 de 3`: en móvil, con una mano, es lo único que fluye |
| 4 | **Entrada para probar la encuesta** | sin QR real no hay forma de llegar | enlace `Abrir la encuesta de ejemplo` desde `/panel/qr`, apuntando a `/e/demo` |

Con esas cuatro cerradas, B1 arranca sin ambigüedad. Las 1 y 2 son de producto; 3 y 4 son de criterio y puedo decidirlas si me das el visto bueno.

---

## 7. Cómo autorizar

Una frase basta. Opciones:

- `autorizado B1` → hago solo el diseño de la encuesta y vuelvo con el plano y el acta.
- `autorizado B1 y B2` → diseño y frontend de la encuesta antes de volver a pedir permiso.
- `autorizado todo` → corro B1→B5 en secuencia y te reporto al final de cada lote igual, para que puedas frenar.
- `B1 pero con cambios: …` → ajusto el alcance antes de empezar.

En cualquiera de los casos, al terminar cada lote pego: medidas reales, rutas verificadas, capturas y el hash del commit.
