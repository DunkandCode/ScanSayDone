# PLANO — Encuesta de cliente en `/e/[code]` (Variantes A y B)

> ## ⚠️ BORRADOR — pendiente aprobación; no implementado; solo local
>
> **Estado:** propuesta. Nada de esto está implementado. Ningún archivo de código,
> config, test o asset fue modificado para producir este plano.
> **Alcance:** prototipo **solo frontend, solo local** en `/e/[code]`: sin API, sin
> persistencia, sin sesión, sin QR escaneable, sin simulación de envío.
> **Qué es este archivo:** el plano de construcción que exige `GUIA-CONTRIBUCION-FRONTEND.md:344`
> ("primero plano en `docs/frontend/planos/` con contrato de copy/estados/datos") para la vista
> nueva de encuesta. Convierte la `PROPUESTA-ENCUESTA-CAFETERIA-2026-11-11.md` (revisada PASS,
> aún sin firmar) en especificación construible; no duplica su prosa: la cita por sección.
> **Superficie:** SOLO el lado cliente de `/e/[code]`. La vista de gestión en el panel
> (propuesta §4.4, §6.6) queda fuera de este plano.
> Fecha de archivo: 2026-11-12 · convención `<AREA>-<AAAA-MM-DD>.md` (`CANON.md:92`).

Etiquetas de lectura en todo el documento:

- **[REPO]** = hecho verificable hoy, con `archivo:línea`.
- **[PROP]** = propuesta de diseño, sin efecto normativo hasta firma del operador.

---

## 1. Alcance, superficies y gates

### 1.1 Alcance

Prototipo local de la encuesta que responde el cliente al escanear el QR del negocio.
Hoy la ruta existe solo como marcador: renderiza `<h1>Encuesta</h1>` y nada más
[REPO: `scansaydone-front/src/app/(survey)/e/[code]/page.tsx:1-3`]. Este plano especifica
la pantalla completa (dos variantes de contenido, §3) con los tokens, tipografía, foco,
teclado y estados honestos del sistema vigente.

Fuera de alcance: envío real, resolución `code → empresa`, QR, panel de gestión,
nuevos tokens/colores/fuentes/dependencias/iconos, commits.

### 1.2 Gates que condicionan (no se resuelven aquí)

| Gate | Estado | Qué bloquea | Fuente |
|---|---|---|---|
| **#0 versión del cuestionario** | **sin firmar** — conviven 3 modelos (tabla §1.3) | decidir P1–P5 antes de construir la Variante B; «se decide primero, se construye una vez» | [REPO] `docs/reuniones/pauta_reunion_2026-11-11_2100.md:44-62` |
| **#14 contrato de endpoints** | **sin firmar** | dependencia de #0; resolución `code → empresa_id`, esquemas request/response, errores, idempotencia | [REPO] `pauta…:72` (fila #14), `:87-103` |
| **Integración API/UI** | **prohibida hasta firma de #14** — «Nada de integración API/UI hasta que el contrato de #14 esté decidido y firmado» | cualquier fetch o wiring real | [REPO] `pauta…:220` |
| **Orden de construcción** | Encuesta va **después** de Panel, antes de Integración backend | saltarse el orden | [REPO] `docs/frontend/CANON.md:27` |
| **Etapa E (encuesta)** | bloqueada por D-1 y D-6 (ambas sin firma del operador) | la etapa E completa en producto | [REPO] `docs/frontend/decisiones/DECISIONES-2026-11-05.md:30` (D-1 «Bloquea: etapa E únicamente»), `:117-125` (D-6 «Bloquea: etapa E») |
| **Vista nueva** | exige plano + contrato de copy/estados/datos antes de construir; **ningún link público debe apuntar a `/e/[code]`** | construir sin plano; enlazar desde el sitio público | [REPO] `docs/frontend/GUIA-CONTRIBUCION-FRONTEND.md:344` |

Consecuencia: este plano es **especificable ahora, construible solo como prototipo local**
(Variante A en lo inmediato; Variante B tras firma de #0). La integración queda fuera hasta #14.

### 1.3 Conflicto de modelo de contenido — ambas variantes, declaradas

El repo tiene tres posiciones sobre cuántas preguntas tiene la encuesta
[REPO: `pauta…:48-52`; `PROPUESTA…:87-103`]:

| Posición | Modelo | Estado | Fuente |
|---|---|---|---|
| **A (este plano, variante interina)** | **una sola nota 0–10** + comentario opcional | **firmada (G-0, vigente)**: «el modelo de encuesta es una nota 0–10, no tres preguntas 1–5» | [REPO] `docs/frontend/ESTADO-2026-11-06.md:138` |
| B (catálogo backend) | 5 preguntas: P1 0–10, P2 1–5, P3/P4 atributos 1–5, P5 abierta | sirve hoy el backend, pero **#0 sin firma** no la valida como decisión de producto | [REPO] `scansaydone-back/scansaydone/catalogo.py:8-10,22-29`; `schemas.py:22-28` |
| C (D-1) | 5 preguntas en 3 pantallas, P2–P4 = «atención, rapidez, producto» | **sin firmar** (`DECISIONES…:5`); sus textos difieren del catálogo B | [REPO] `DECISIONES-2026-11-05.md:9-30` |

Este plano muestra las DOS variantes construibles y las deja explícitas:

- **Variante A (interina, construible hoy como prototipo local):** una pantalla, una nota
  0–10 (modelo firmado G-0) + comentario opcional ≤300. Es la única alineada con una
  decisión **firmada**; por eso es la interina.
- **Variante B (5 preguntas del catálogo, cafetería rubro 2):** flujo de 3 pasos
  (P1 / P2+P3+P4 / P5) con alternativa de 5 pasos. **Bloqueada hasta la firma de #0.**
  El texto exacto P1–P5 es el del catálogo (§8), no el de D-1.

> Regla del plano: si el operador firma otra composición, se edita la §8 de este archivo,
> no el catálogo del backend (intocable, `CANON.md:16`).

### 1.4 Reglas de honestidad que gobiernan toda la pantalla

- Ningún estado de éxito sin acción real; si el envío no existe, se dice **antes** de los
  campos [REPO: `CANON.md:82`].
- Sin jerga visible (KPI, CSAT, NPS, score, dashboard, «tiempo real», «en construcción»,
  «próximamente») [REPO: `CANON.md:79-80`].
- Etiquetado por capas del precedente del panel: chip DEMO + línea bajo el título + pie
  declarativo [REPO: `docs/frontend/planos/PANEL-2026-11-06.md:124-128`].
- Vacío con guion largo (—), nunca 0 mintiendo [REPO: `PANEL-2026-11-06.md:162`].

---

## 2. Ruta y navegación

Hechos [REPO]:

- La ruta `/e/[code]` existe como marcador sin flujo ni estado:
  `src/app/(survey)/e/[code]/page.tsx:1-3` — `<h1>Encuesta</h1>`.
- El backend sirve la encuesta por **id numérico**:
  `GET /api/v1/empresas/{empresa_id}/encuesta` con `empresa_id: int ≥ 1`
  (`scansaydone-back/scansaydone/routers/empresas.py:20-25`). **No existe mapeo
  `code → empresa`** en backend ni frontend (la página `[code]` no consume nada).
- D-6 (sin firmar) recomienda código opaco no secuencial porque un id numérico público
  permite enumerar encuestas ajenas [REPO: `DECISIONES-2026-11-05.md:117-125`].

Reglas del plano [PROP, heredadas de `PROPUESTA…:510-546`]:

1. **`code` = placeholder de demo declarado.** Cualquier valor de `code` renderiza la misma
   maqueta (rubro 2, cafetería). La página muestra en pequeño, `text-secondary`:
   «Código de demostración: `{code}` — no corresponde a ninguna empresa real.»
   Nada de `DEMO1` disfrazado de token: se etiqueta.
2. **Prohibido** usar un `empresa_id` numérico como token público del QR (contradice D-6
   y simularía una resolución que no existe).
3. **Prohibido todo link público hacia `/e/[code]`** desde header, footer o landing
   [REPO: `GUIA…:344`; el test del footer ya lo vigila, `GUIA…:343`]. El acceso en la demo
   es tecleando la URL local. La vista de gestión (fuera de este plano) podría enlazarla
   como navegación interna de la demo — decisión de ese plano, no de aquí.
4. **Sin página de «empresa no encontrada»**: no hay lookup, así que no hay 404 falso.
   El caso código desconocido/vencido se trata en §6.5 (decisión pendiente, opciones
   presentadas, nada inventado).
5. Título del documento: «Encuesta» — sin nombre de empresa (no se inventa identidad).
6. `h1` único de la página: «Encuesta» (hoy ya existe en el marcador; se conserva como
   encabezado de la vista, las preguntas van en `h2`, `GUIA…:287`: un `h1` por página).

---

## 3. Anatomía por paso

Zona encuesta (ambas variantes): fondo **blanco puro**, tarjeta blanca con borde,
**sin sombra**, Montserrat nunca < 16 px, targets ≥ 44 sin excepción
[REPO: `docs/frontend/UX-SPEC-2026-11-05.md:119`]. La tarjeta demo del landing usa la
única sombra autorizada del sistema (`--elev-float`, `GUIA…:249-251`); **esa autorización
NO aplica aquí**: presupuesto de sombra en la zona encuesta = **0**
[REPO: `UX-SPEC…:119` «sin sombra»].

### 3.0 Armazón común (ambas variantes)

```
┌──────────────────────────────────────────┐ 375 px de viewport
│ [DEMO]              Código de demostración│ barra superior h=44 (no interactiva)
│                     {code} — no corresponde│ · badge sobre surface-elevated
│                     a ninguna empresa real │ · label text-secondary 16 px
│──────────────────────────────────────────│ ← borde 1 px border-mid
│ H1 «Encuesta»  (Montserrat 600, 16 px)    │
│ ● ─ ○ ─ ○        «Pregunta n de N»        │ progreso (solo Variante B)
│──────────────────────────────────────────│
│  TARJETA-PASO (ver §4)                    │
│  · encabezado del paso h2                 │
│  · bloque(s) de escala / textarea         │
│  · ayuda + botones                        │
│──────────────────────────────────────────│
│ Maqueta local: tus respuestas se quedan   │ pie declarativo (capa 3,
│ en esta página. No se enviaron ni se      │ patrón PANEL:124-128) —
│ guardaron en ningún lado.                 │ permanente, antes de los campos
└──────────────────────────────────────────┘   (CANON.md:82)
```

- El pie declarativo es fijo (no aparece solo al final): el canon exige avisar la
  ausencia de envío **antes** de los campos [REPO: `CANON.md:82`]. El mensaje terminal
  (§6.4) lo repite al cerrar.
- Cabecera con logo como imagen (patrón F-O8): **pendiente** — decisión Q6 de la
  propuesta `PROPUESTA…:558`. Mientras tanto: badge + label de código, sin logo.

### 3.1 Variante A (interina, 1 pantalla) [PROP]

Alineada al modelo **firmado** G-0 (una nota 0–10, `ESTADO…:138`) + comentario opcional.
Construible hoy como prototipo local; sin envío.

```
375 px ── tarjeta a sangre horizontal (ver §4.1), contenido 343 px
┌───────────────────────────────────────────┐
│ ¿Qué tan probable es que recomiendes el   │ h2 · Montserrat 600 · 18 px
│ negocio a un amigo o familiar?            │ (sm: 20) · mb-6 (24)
│                                           │
│ ┌────┬────┬────┬────┬────┬────┐           │ rejilla 0–10: 6 columnas
│ │  0 │  1 │  2 │  3 │  4 │  5 │  fila 1   │ gap 8 → ficha (343−40)/6
│ ├────┼────┼────┼────┼────┼────┤           │ = 50.5 px (cuadrada, ≥44)
│ │  6 │  7 │  8 │  9 │ 10 │ ·  │  fila 2   │ 6.ª celda VACÍA — jamás
│ └────┴────┴────┴────┴────┴────┘           │ 11 columnas en una fila
│ (anclas 0/10: sin dato — §8.2)            │ ayuda 16 px text-secondary
│                                           │
│ ¿Algo que quieras agregar? (opcional)     │ h3 · Montserrat 600 · 16 px
│ ┌─────────────────────────────────────┐   │ textarea 4 filas · borde 1 px
│ │                                     │   │ border-mid · contenido 343
│ │                                     │   │ maxLength 300
│ └─────────────────────────────────────┘   │
│ Máximo 300 caracteres          24/300     │ helper + contador 16 px
│                                           │
│ [           Finalizar                 ]   │ botón primario 343×48
│                                           │ deshabilitado sin nota 0–10
└───────────────────────────────────────────┘
        ↓ «Finalizar» (nota elegida)
┌───────────────────────────────────────────┐
│ Gracias por responder.                    │ Bebas ≥32 (opcional) o
│                                           │ Montserrat 600 — §8.3
│ Maqueta local: tus respuestas se quedan   │ texto 16 px text-secondary
│ en esta página. No se enviaron ni se      │
│ guardaron en ningún lado.                 │ mensaje terminal honesto
│                                           │ (CANON.md:82)
│ [        Empezar de nuevo             ]   │ botón texto 44 mínimo:
│                                           │ resetea SOLO estado React
└───────────────────────────────────────────┘
```

Notas A:

- Sin preselección ni preiluminación del 9 (el demo del landing la tiene,
  `survey-card.tsx:102` [REPO]; en la encuesta real sesga la respuesta — corrección
  heredada de `PROPUESTA…:333-338`).
- La pregunta de A es **P1 del catálogo** (`catalogo.py:9` [REPO]), no «¿Cómo fue tu
  experiencia hoy?» (esa es del demo del landing, `survey-card.tsx:77`).
- El comentario de A reutiliza el límite del backend: 300 caracteres, opcional
  (`schemas.py:26-28,37` [REPO]).

### 3.2 Variante B (5 preguntas, 3 pasos) [PROP — bloqueada hasta firma #0]

Flujo de `PROPUESTA…:130-147`. Contenido = catálogo rubro 2 exacto (§8.1).

```
/e/[code]
  → Paso 1 (P1 · 0–10) → Paso 2 (P2+P3+P4 · 1–5) → Paso 3 (P5 · opcional)
                                                            ↓
                                              pantalla terminal honesta (§3.1)
```

**Paso 1 — P1 sola (0–10):** idéntica a la pantalla de la Variante A **sin** el bloque
de comentario, con barra de progreso «Pregunta 1 de 3» y botón «Continuar»
(deshabilitado sin selección). Rejilla 6+5 de §3.1 (50.5 px a 375).

```
Paso 2 — P2 · P3 · P4 (tres grupos 1–5 apilados)          375 px
┌───────────────────────────────────────────┐
│ ● ─ ● ─ ○        «Pregunta 2 de 3»        │
│──────────────────────────────────────────│
│ En general, ¿qué tan satisfecho/a         │ h2 P2 · 18 px (sm: 20) · mb-4
│ quedaste?                                 │
│ ┌────┬────┬────┬────┬────┐                │ fila única 5 fichas:
│ │ 1  │ 2  │ 3  │ 4  │ 5  │                │ (343−4×8)/5 = 62.2 px
│ └────┴────┴────┴────┴────┘                │ gap 8 · cuadradas
│ (anclas 1/5: sin dato — §8.2)             │
│                                           │ mb-6 (24) entre grupos:
│ ¿Cómo calificas el sabor y la calidad     │ pregunta+sus fichas viajan
│ de lo que consumiste?                     │ JUNTAS (nada huérfano)
│ ┌────┬────┬────┬────┬────┐                │
│ │ 1  │ 2  │ 3  │ 4  │ 5  │                │ idem P3
│ └────┴────┴────┴────┴────┘                │
│                                           │
│ ¿Qué tan conforme quedaste con el tiempo  │
│ que tardó en llegar tu pedido?            │
│ ┌────┬────┬────┬────┬────┐                │
│ │ 1  │ 2  │ 3  │ 4  │ 5  │                │ idem P4
│ └────┴────┴────┴────┴────┘                │
│ Faltan 3 de 3 respuestas.                 │ ayuda si «Continuar»
│                                           │ deshabilitado (§6.3)
│ [           Continuar                 ]   │ 343×48 · deshabilitado
│ Volver                                    │ botón texto · conserva
└───────────────────────────────────────────┘ lo ya respondido
```

```
Paso 3 — P5 (opcional)                                375 px
┌───────────────────────────────────────────┐
│ ● ─ ● ─ ●        «Pregunta 3 de 3»        │
│──────────────────────────────────────────│
│ ¿Qué podríamos hacer para que tu próxima  │ h2 · 18 px (sm: 20)
│ visita sea mejor?                         │
│ ┌─────────────────────────────────────┐   │ textarea 4 filas
│ │ 24 caracteres                       │   │ maxLength 300
│ └─────────────────────────────────────┘   │
│ Máximo 300 caracteres          24/300     │ helper + contador
│                                           │
│ [           Finalizar                 ]   │ SIEMPRE activo (P5
│ [            Saltar                   ]   │ opcional) — dos puertas
│ Volver                                    │ honestas al mismo final
└───────────────────────────────────────────┘
```

Terminal de B: igual a la de §3.1.

- «Volver» conserva las respuestas ya dadas (estado local; jamás se pierde trabajo al
  retroceder). Sin `localStorage` ni cookies: persistir insinuaría «se guardó».
- Sin auto-avance al seleccionar: el usuario confirma con el botón (evita taps
  accidentales en táctil; el auto-avance quedó `sin dato` en `UX-SPEC…:119` y este
  plano lo fija en manual [PROP]).

**Alternativa 5 pasos (una pregunta por pantalla):** misma anatomía por paso con un solo
bloque; progreso «Pregunta n de 5». Trade-offs completos en `PROPUESTA…:149-166`
(4 toques vs 6, scroll en paso 2 vs repetición del gesto). Este plano recomienda 3 pasos
[PROP] pero **el agrupamiento es decisión pendiente** (Q2 de la propuesta, `:554`).

---

## 4. Rejillas y espaciado — matemática explícita

### 4.1 Reglas de caja

- Breakpoints del sistema: `xs:375 · sm:576 · md:768 · lg:992 · xl:1200 · 2xl:1400`
  [REPO: `scansaydone-front/src/app/globals.css:24-29`].
- **xs (375):** la tarjeta-paso va **a sangre horizontal** (ancho 375, borde superior e
  inferior 1 px `border-mid`, sin borde lateral) con `p-4` = 16 px por lado →
  **contenido = 375 − 2×16 = 343 px** [PROP; el 343 y sus derivados son los números del
  contrato compartido F3]. Así la rejilla mide exactamente 343 y las fichas dan 50.5 / 62.2.
- **≥ sm (576):** tarjeta discreta centrada, ancho máx. **540** = `--container-mkt-sm`
  [REPO: `globals.css:32`], borde 1 px completo, `p-6` (24) hasta 991, `p-8` (32) desde 992
  — la escala de padding viva del sistema: `p-4 sm:p-6 lg:p-8`
  [REPO: `survey-card.tsx:61`]. Contenido = 540 − 2×1 − 2×padding.
- **Columnas de fichas: `minmax(0, 1fr)`** con `gap: 8` (Tailwind `gap-2`). Ficha
  cuadrada (`aspect-ratio: 1/1`), **mínimo 44 px** en todos los casos
  [REPO: `UX-SPEC…:119` targets ≥44 sin excepción].
- Fórmulas normativas (el implementer no adivina nada):
  - ficha 0–10 (rejilla 6 columnas): `(W − 5×8) / 6`, con W = ancho de contenido.
  - ficha 1–5 (fila única 5 columnas): `(W − 4×8) / 5`.
  - **Prohibido 11 fichas en una fila**: a 343 darían (343−80)/11 ≈ 23.9 px < 44
    (veto de `UX-SPEC…:119`; morfología 6+5 ya viva en `survey-card.tsx:84` [REPO]).
- La rejilla 0–10 son **dos filas 6+5**: fila 1 = 0–5, fila 2 = 6–10 con la 6.ª celda
  vacía (sin ficha fantasma interactiva; celda decorativa vacía o el grid simplemente
  termina — nunca un botón deshabilitado con número).

### 4.2 Tabla por breakpoint (cotas derivadas de §4.1)

| Concepto | **375** | **768** | **992** | **1440** |
|---|---|---|---|---|
| Tarjeta (exterior) | 375 a sangre | 540 centrada (margen 114 c/lado) | 540 (margen 226) | 540 (margen 450) |
| Borde de tarjeta | 1 px solo `border-y` | 1 px completo `border-mid` | 1 px | 1 px |
| Padding tarjeta | 16 (`p-4`) | 24 (`p-6`) | 32 (`p-8`) | 32 (`p-8`) |
| **Ancho de contenido W** | **343** | **490** | **474** | **474** |
| Rejilla 0–10 (6+5), gap 8 | ficha **50.5** ×2 filas (alto 109) | ficha **75** (alto 158) | ficha **72.3** (alto 152.6) | ficha **72.3** |
| Rejilla 1–5 (fila única), gap 8 | ficha **62.2** | ficha **91.6** | ficha **88.4** | ficha **88.4** |
| Textarea P5 | 343 × 4 filas (~96 alto) | 490 × 4 | 474 × 4 | 474 × 4 |
| Botón primario | 343 × 48 (py-3 12 + línea 24) | 490 × 48 | 474 × 48 | 474 × 48 |
| Botones paso 3 (B) | apilados, gap 12 | fila: Finalizar + Saltar | fila | fila |
| Targets interactivos | ≥44 | ≥44 | ≥44 | ≥44 |
| Columnas | 1 (una tarea, un camino; nunca 2) | 1 | 1 | 1 |

Cálculos mostrados (para auditoría): 375−32=343 · 540−2−48=490 · 540−2−64=474 ·
(343−40)/6=50.5 · (343−32)/5=62.2 · (490−40)/6=75 · (490−32)/5=91.6 ·
(474−40)/6=72.33 · (474−32)/5=88.4 · alto rejilla 0–10 = 2×ficha+8.

### 4.3 Ritmo vertical (escala Tailwind existente, cero valores nuevos)

| Relación | Valor | Fuente del patrón |
|---|---|---|
| barra superior → H1 | 16 (`mb-4`) | `survey-card.tsx:63` |
| H1/progreso → contenido del paso | 24 (`mb-6`) | `survey-card.tsx:75,84` |
| pregunta → rejilla (h2→grupo) | 16 (`mb-4`) | idem |
| grupo 1–5 → siguiente grupo (paso 2) | 24 (`mb-6`) | [PROP] |
| rejilla → botones | 24 (`mb-6`) | `survey-card.tsx:84` |
| ayuda/contador → botón | 12 (`mt-3`) | `survey-card.tsx:127` |
| botones apilados (paso 3 xs) | 12 (`gap-3`) | [PROP] |
| radios de borde | tarjeta `rounded-lg`, fichas/botones `rounded-md`/`rounded-lg` | `survey-card.tsx:61,101,117` [REPO] |

Transiciones: solo color, 150 ms, con puerta `motion-safe:` — idénticas al botón vivo
(`survey-card.tsx:117` [REPO]). Nada de animación de entrada por paso; el progreso no
usa barra animada (no hay carga real que medir).

---

## 5. Contratos de componentes

Nivel contrato para la implementación futura (nada existe hoy). Nombres, props,
estados y teclado. Todos usan solo los tokens de §9.

### 5.1 `RatingTileGroup` — bloque de escala (0–10 y 1–5)

| Aspecto | Contrato |
|---|---|
| Props | `{ id: string; values: number[]; value: number \| null; onChange(v: number): void; questionId: string; labels?: undefined }` — `labels` **no existe**: anclas `sin dato` (§8.2). `values` = `[0..10]` o `[1..5]`. |
| Rol | `role="radiogroup"` con `aria-labelledby={questionId}`; cada ficha `<button type="button" role="radio" aria-checked>` [REPO patrón `survey-card.tsx:81-91`]. |
| Layout | `grid` `minmax(0,1fr)` × (6 \| 5) columnas, `gap-2`; ficha cuadrada ≥44; morfología 6+5 para 11 valores (§4.1). |
| Estados | **reposo**: fondo `surface-default`, borde 2 px `border-mid`, número `text-primary` · **hover**: fondo `surface-elevated` · **seleccionada**: fondo `interactive-primary`, borde `interactive-primary`, número `text-primary` (#1A181B sobre coral = 5.61:1, `DECISIONES…:55` [REPO]) · **foco**: outline 3 px `text-primary` offset −3 (§7) · **preselección**: PROHIBIDA (§3.1) · **deshabilitado**: no existe en el flujo de respuesta (solo reutilización futura en solo-lectura del panel). |
| Teclado | Roving tabindex: `tabIndex 0` en la seleccionada o en la primera; ←/→/↑/↓ mueven y seleccionan (con wrap), `Home`/`End` extremos, Espacio/Enter confirman — patrón vivo `survey-card.tsx:12-52` [REPO]. |
| Tipografía | Número Montserrat 600 ≥16 px (zona encuesta: nunca <16, `UX-SPEC…:119`). |

### 5.2 `CommentTextarea` — comentario con contador

| Aspecto | Contrato |
|---|---|
| Props | `{ id: string; value: string; onChange(v: string): void; maxLength: 300; optional: true; questionId: string }`. El 300 es el límite del backend (`schemas.py:7,26-28` [REPO]); vacío → se ignora (equivalente del `None`/NULL de `schemas.py:37`). |
| Layout | Ancho = contenido (343/490/474), 4 filas, borde 1 px `border-mid`, `rounded-md`, padding 12, Montserrat 16. |
| Contador | «`{n}`/300» a la derecha del helper, 16 px `text-secondary`; NO se anuncia tecla a tecla (ruido de región viva) — el helper estático sí va en `aria-describedby`. |
| Estados | reposo · foco (outline §7) · lleno (n=300: el propio `maxLength` impide seguir; sin color de error) · SIN estado de error de envío (no hay envío). |
| Etiqueta | «¿Algo que quieras agregar? (opcional)» en A [PROP]; en B es P5 del catálogo (§8.1). `aria-labelledby` al id de la pregunta. |

### 5.3 `StepProgress` — progreso (solo Variante B)

| Aspecto | Contrato |
|---|---|
| Props | `{ current: 1..N; total: 3 \| 5 }`. |
| Render | Puntos ●/○ (8 px, `text-primary`/`border-mid`) + texto «Pregunta {n} de {total}» — **el texto manda** (estados nunca solo por color, `CANON.md:49`); 16 px Montserrat 500 `text-secondary`. |
| Región viva | `role="status" aria-live="polite"` anunciando «Pregunta {n} de {total}» al cambiar de paso (mecanismo del `role="status"` vivo, `survey-card.tsx:124-131` [REPO]). |
| Prohibido | barra porcentual animada · cifras de tiempo («te toma 30 segundos») — vetadas (`UX-SPEC…:340,351`). |

### 5.4 `StepHeading` — encabezado del paso

| Aspecto | Contrato |
|---|---|
| Props | `{ id: string; level: 2 \| 3; children: string }`. |
| Uso | Texto de pregunta P1–P5 verbatim (§8.1); Montserrat 600 `text-lg` (18) xs → `sm:text-xl` (20) [REPO: `survey-card.tsx:75`]; `mb-6`. |
| Foco | `tabIndex={-1}` + `focus()` programático al montar el paso (§7). Bebas **prohibida** aquí (es cuerpo de pregunta, no título display). |

### 5.5 Botones

| Componente | Props | Apariencia (solo tokens existentes) | Estados |
|---|---|---|---|
| `PrimaryButton` («Continuar»/«Finalizar») | `{ children; disabled; onClick }` | fondo `surface-dark` #1A181B, texto `on-dark` #F7E5C8 (14.28:1, `DECISIONES…:47` [REPO]), borde 2 px `text-primary`, `rounded-lg`, alto 48, ancho completo del contenido; patrón `survey-card.tsx:117` [REPO] | habilitado · **deshabilitado**: `disabled-fill` + texto `text-secondary` + `cursor-not-allowed` (patrón vivo idem) · foco outline 3 px offset −3 en `text-primary` |
| `SecondaryButton` («Saltar») | `{ children; onClick }` | fondo `surface-default`, borde 2 px `border-mid`, texto `text-primary`, alto 48 — mismo alto que el primario cuando comparten fila | reposo · hover (`surface-elevated`) · foco |
| `TextButton` («Volver»/«Empezar de nuevo») | `{ children; onClick }` | sin fondo ni borde, texto `text-primary` Montserrat 600 16 px, subrayado al hover; **área clicable ≥44×44** (padding, no letra) | reposo · hover · foco |

Etiqueta de botón siempre oscura (#1A181B o sobre-dark en oscura) — nunca blanca sobre
coral (3.14, `CANON.md:45` [REPO]). Coral nunca como texto (`CANON.md:46`).

### 5.6 `InlineNotice` — ayuda / aviso inline

| Aspecto | Contrato |
|---|---|
| Props | `{ tone: 'help' \| 'notice'; children: string }` — texto SIEMPRE (nunca solo color, `CANON.md:49`); sin iconos nuevos (§9). |
| `help` | «Falta 1 respuesta.» / «Faltan 2 de 3 respuestas.» · 16 px `text-secondary` · junto al botón deshabilitado. |
| `notice` | Avisos honestos de demo · 16 px `text-primary` sobre `surface-elev` con borde 1 px `border-mid` (patrón de capa del chip, `PANEL…:126`). |
| Rol | `help` → `aria-describedby` del control; `notice` → `role="status"`. |

### 5.7 `DemoBadge` + `CodeLabel` (rotulado de la demo)

- `DemoBadge`: «DEMO» — fondo `surface-elevated`, texto `text-primary`, Montserrat 600
  **16 px** en la zona encuesta (regla ≥16, `UX-SPEC…:119`). *Excepción a 12 px como el
  badge del landing (`survey-card.tsx:64` text-xs): pendiente de decisión del operador
  (Q6, `PROPUESTA…:558`) — este plano fija 16 por defecto.*
- `CodeLabel`: «Código de demostración: `{code}` — no corresponde a ninguna empresa
  real.» · 16 px `text-secondary` · esquina superior derecha de la barra (§3.0).

---

## 6. Estados

Cuatro estados por vista (loading/empty/error/terminal) — aquí, con honestidad de
prototipo sin red:

### 6.1 Loading

**No existe.** Sin red ni API no hay carga; un spinner falso sería una mentira de estado.
La vista renderiza sincrónica. (Declarado, no omitido: cuando exista #14 se definirá el
esqueleto con los dueños del contrato.)

### 6.2 Empty

- **Datos:** no aplica — no hay capa de datos en la vista de cliente.
- **Paso recién abierto:** fichas en reposo, textarea vacía, contador «0/300». Así se ve
  y así queda; el vacío de selección NO es error (§6.3).
- Si algún día se listan respuestas (nunca en la superficie de cliente), el vacío usa
  guion largo —, no 0 (`PANEL…:162` [REPO]).

### 6.3 Error / validación de paso

- **No hay error de envío** (no hay envío). La única validación es la de paso:
  - A: «Finalizar» deshabilitado hasta elegir nota 0–10; ayuda «Falta 1 respuesta.»
    en `text-secondary` mientras tanto.
  - B pasos 1–2: «Continuar» deshabilitado hasta completar lo obligatorio del paso
    (patrón de botón deshabilitado vivo, `survey-card.tsx:116` [REPO]); ayuda
    «Faltan {x} de {y} respuestas.».
  - B paso 3: «Finalizar» SIEMPRE activo (P5 opcional; `schemas.py:26-28` admite vacío);
    «Saltar» = finalizar sin comentario — dos puertas honestas al mismo estado terminal.
- Textarea: `maxLength 300` impide pasarse **antes** del límite; sin mensaje de error.
- Errores de red/422/429: fuera de alcance hasta #14 (`pauta…:96-99`).

### 6.4 Terminal (en vez de «success»)

**Prohibido «guardado con éxito»** (sin acción real no hay éxito, `CANON.md:82`). El
estado terminal se llama y redacta honesto — texto exacto en §8.3. «Empezar de nuevo»
resetea SOLO el estado React local de la página: sin `localStorage`, sin cookies, sin
navegación. Sin resumen «tu selección: 8, 4, 5…»: la pantalla del cliente no produce ni
muestra métricas.

### 6.5 Código desconocido / vencido — decisión pendiente, opciones sin inventar

Hecho: **no existe resolución `code → empresa`** (`empresas.py:20-25` usa id numérico;
la página `[code]` no consulta nada [REPO]) — por eso hoy no hay forma honesta de
«detectar» un código inválido. `pauta…:91-92` deja el comportamiento (desconocido /
vencido / reutilizado) como pregunta abierta del contrato #14. Opciones a decidir:

| Opción | Qué sería | Frontera honesta |
|---|---|---|
| **A (la de este plano por defecto)** | cualquier `code` renderiza la demo con `CodeLabel` visible | cero detección simulada; el label declara que no corresponde a empresa real |
| B | pantalla neutral «Este enlace no corresponde a una encuesta vigente.» | hoy sería teatro: exige un lookup que no existe; solo construible tras #14 |
| C | no construir nada del caso hasta #14 | deja A como comportamiento implícito |

**No se elige por decreto:** A queda como comportamiento del prototipo por ser el único
sin simulación; B/C son decisión del operador junto a #14 (§10 preguntas abiertas).

---

## 7. Accesibilidad

| Tema | Regla | Fuente |
|---|---|---|
| Semántica de escala | `role="radiogroup"` + `aria-labelledby` a la pregunta; fichas `role="radio" aria-checked`; UN grupo por pregunta (los tres grupos de B-paso-2 son radiogroups independientes, cada cual con su `aria-labelledby`) | [REPO] patrón `survey-card.tsx:12-52,81-91`; WAI-ARIA radiogroup |
| Roving tabindex | tab entra una vez por grupo (ficha seleccionada o primera); ←/→/↑/↓ con wrap, `Home`/`End` a extremos, Espacio/Enter confirman; `preventDefault` en flechas para no scrollear | [REPO] `survey-card.tsx:12-52` |
| Foco al cambiar de paso | `StepHeading` con `tabIndex={-1}` + `focus()` al montar; el foco NUNCA queda en el botón «Continuar» de un paso que ya no existe | [PROP] extensión del patrón vivo |
| Anuncio de progreso | `role="status" aria-live="polite"` con «Pregunta {n} de {total}» | [REPO] mecanismo `survey-card.tsx:124-131` |
| Anillo de foco | outline **3 px**, `outline-offset: −3px` (hacia dentro, decisión firmada C-48), color `text-primary` #1A181B en superficies claras (12.82:1 mínimo sobre crema elevada) | [REPO] `ESTADO…:132`; `globals.css:52-53`; `GUIA…:242-247`; `DECISIONES…:57-58`. «Ningún elemento interactivo puede perder el anillo» (`GUIA…:247`) |
| Contraste | texto #1A181B sobre #FFFFFF = 17.64:1 · #5A5555 sobre #FFFFFF = 7.33:1 (aritmética WCAG; el plano de panel anota «≈7,3») · etiqueta #1A181B sobre coral #FC5A41 = 5.61:1 (medido) · botón #F7E5C8 sobre #1A181B = 14.28:1 | [REPO] `PANEL-2026-11-06.md:191`; re-medir con axe en el gate de implementación |
| Targets | ≥44×44 en TODA interacción: fichas (50.5+), botones (48), TextButton con padding que garantice el área | [REPO] `UX-SPEC…:119` «sin excepción» |
| Tipografía mínima | Montserrat nunca <16 px en la zona encuesta (incluye ayuda, contador, badge, label de código) | [REPO] `UX-SPEC…:119` |
| Encabezados | un `h1` («Encuesta») por página; preguntas `h2`; sub-etiquetas `h3`; sin saltos | [REPO] `GUIA…:287` |
| Movimiento reducido | única animación = transición de color 150 ms con `motion-safe:`; sin reveals, sin animación de puntos, sin auto-scroll | [REPO] patrón `survey-card.tsx:117`; `GUIA…:255` |
| Formulario | textarea con `aria-describedby` al helper; sin `aria-required` en P5 (es opcional); el bloque 0–10/1–5 obligatorio se comunica con el botón deshabilitado + ayuda, no con `aria-invalid` (no hay intento de envío) | [PROP] |

---

## 8. Copy exacto

### 8.1 Preguntas — texto VERBATIM del catálogo (no se reescribe, no se fusiona)

Fuente autoritativa: `scansaydone-back/scansaydone/catalogo.py` (rubro 2, cafetería/restaurante)
+ límites de `schemas.py` [REPO]. Los nombres internos (`p1_nps`…) jamás aparecen en
pantalla (veto de jerga, `CANON.md:79-81`).

| # | Texto exacto | Escala | Obligatoria | Línea fuente |
|---|---|---|---|---|
| P1 | «¿Qué tan probable es que recomiendes el negocio a un amigo o familiar?» | 0–10 (11 valores) | Sí | `catalogo.py:9` · `schemas.py:22` |
| P2 | «En general, ¿qué tan satisfecho/a quedaste?» | 1–5 | Sí | `catalogo.py:10` · `schemas.py:23` |
| P3 | «¿Cómo calificas el sabor y la calidad de lo que consumiste?» | 1–5 | Sí | `catalogo.py:27` · `schemas.py:24` |
| P4 | «¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?» | 1–5 | Sí | `catalogo.py:28` · `schemas.py:25` |
| P5 | «¿Qué podríamos hacer para que tu próxima visita sea mejor?» | texto ≤300 | No | `catalogo.py:29` · `schemas.py:26-28,37` |

- **Variante A usa P1** (+ comentario opcional propio de A, §8.2). **Variante B usa P1–P5.**
- Etiquetas internas P3/P4 («Calidad del producto», «Tiempo de servicio», `catalogo.py:25-26`)
  las expone el backend como `etiqueta` (`empresas.py:42-43`); este plano **no** las
  muestra (no son anclas) [PROP, `PROPUESTA…:288-291`].

### 8.2 Microcopy (verbatim [PROP], castellano de Chile, tuteo — `CANON.md:79`)

| Pieza | Texto |
|---|---|
| Título del documento / h1 | «Encuesta» |
| Badge | «DEMO» |
| Label de código | «Código de demostración: `{code}` — no corresponde a ninguna empresa real.» |
| Progreso (B) | «Pregunta {n} de {total}» |
| Ayuda paso incompleto | «Falta 1 respuesta.» / «Faltan {x} de {y} respuestas.» |
| Anclas de escala | **`sin dato`** — ni `catalogo.py` ni `schemas.py` ni `empresas.py` definen textos de polo (verificado en las tres fuentes); solo números hasta decisión del operador (Q3, `PROPUESTA…:555`) |
| Label comentario (A) | «¿Algo que quieras agregar? (opcional)» |
| Helper textarea | «Máximo 300 caracteres» + contador «{n}/300» |
| Botones (A) | «Finalizar» · «Empezar de nuevo» |
| Botones (B) | «Continuar» · «Volver» · «Finalizar» · «Saltar» · «Empezar de nuevo» |
| Pie declarativo fijo (capa 3) | «Maqueta local: tus respuestas se quedan en esta página. No se enviaron ni se guardaron en ningún lado.» |
| Título terminal | «Gracias por responder.» (Bebas ≥32 permitida aquí, o Montserrat 600) |

### 8.3 Mensaje terminal completo (estado tras «Finalizar»/«Saltar»)

> **Gracias por responder.**
> Maqueta local: tus respuestas se quedaron en esta página. No se enviaron ni se
> guardaron en ningún lado.
> `[ Empezar de nuevo ]`

(Pendiente de firma — Q5 de `PROPUESTA…:557`.)

### 8.4 Palabras vetadas — verificación de todo el copy de este plano

Contrastado contra `CANON.md:79-80` + `UX-SPEC…:351` (lista negra) + `UX-SPEC…:340`
(sin cifras de tiempo sin medición):

| Vetado | ¿Aparece? | Vetado | ¿Aparece? |
|---|---|---|---|
| NPS / CSAT / score / KPI | ✅ ausente | «estrellas» como escala / glifo U+2605 | ✅ ausente (fichas numéricas) |
| dashboard / insights / feedback / engagement | ✅ ausente | «20 segundos» / «<30 s» / minutos | ✅ ausente (progreso por pregunta) |
| «tiempo real» | ✅ ausente | testimonios / cifras / logos / premios | ✅ ausente |
| «en construcción» / «próximamente» | ✅ ausente | «guardado con éxito» / éxito sin acción | ✅ ausente (terminal honesto) |
| jerga de campo (`p1_nps`…) en pantalla | ✅ ausente | QR decorativo | ✅ ausente (cero QR en la vista) |

---

## 9. Tokens — uso y veto de novedades

**Regla dura: CERO tokens nuevos, CERO colores nuevos, CERO fuentes nuevas, CERO
dependencias nuevas, CERO iconos nuevos.** Presupuesto de sombra en la zona encuesta
= **0** (`UX-SPEC…:119`; la única sombra del sistema, `--elev-float` de `globals.css:51`,
está autorizada solo en 2 nodos del landing — `GUIA…:249-251` — y ninguno es `/e/[code]`).

| Token (globals.css) | Hex | Dónde se usa aquí | Línea [REPO] |
|---|---|---|---|
| `surface-default` | #FFFFFF | fondo de la zona encuesta (blanco puro) + tarjeta-paso + fondo de ficha en reposo + SecondaryButton | `globals.css:8` |
| `surface-elevated` | #F0D8BD | fondo del badge DEMO · hover de ficha · fondo de `InlineNotice.notice` | `globals.css:9` |
| `background-page` | #F7E5C8 | **NO se usa en esta vista** (la zona encuesta es blanca, `UX-SPEC…:119`); sigue vigente para el resto del app | `globals.css:10` |
| `text-primary` | #1A181B | preguntas, números de ficha, bordes funcionales, etiqueta de botón, outline de foco, texto de TextButton | `globals.css:11` |
| `text-secondary` | #5A5555 | ayuda, contador, CodeLabel, texto de progreso, botón deshabilitado | `globals.css:12` |
| `interactive-primary` | #FC5A41 | ficha seleccionada (fondo + borde; número SIEMPRE #1A181B) | `globals.css:5` |
| `surface-dark` | #1A181B | fondo del PrimaryButton | `globals.css:13` |
| `on-dark` | #F7E5C8 | etiqueta del PrimaryButton | `globals.css:14` |
| `border-mid` | #8A6F55 | borde de tarjeta (1 px), borde de ficha en reposo (2 px), borde de textarea, puntos ○ del progreso | `globals.css:16` |
| `disabled-fill` | #E6D6C2 | fondo del botón deshabilitado (con texto `text-secondary`) | `globals.css:21` |
| Fuentes | — | Montserrat (`--font-ui`) para TODO lo visible ≥16 px · Bebas (`--font-display`) SOLO en el título terminal si se usa display (≥32 px, nunca cuerpo/botones) | `globals.css:45-46`; `CANON.md:53-56` |
| Foco | — | outline 3 px `text-primary`, offset −3 px (C-48) | `globals.css:52-53`; `ESTADO…:132` |

No usados aquí y por eso no inventados: `interactive-hover/pressed` (los roles derivados
de D-2 siguen sin firma; el hover de ficha se resuelve con `surface-elevated` ya listado),
`success/warning/error-text`, `on-dark-secondary`, `border-subtle`, `border-strong`,
`--elev-float` (vetado en esta zona). Si la implementación cree necesitar alguno, es
cambio de plano, no de código.

---

## 10. Checklist de aceptación (para la implementación futura) y preguntas abiertas

### 10.1 Checklist de gates (patrón `CANON.md:96-105` — sin salida de comandos no hay PASS)

- [ ] `npm run build` — salida pegada, exit 0.
- [ ] `npm run lint` — 0 errores (avisos preexistentes declarados).
- [ ] `npx tsc --noEmit` — 0 errores.
- [ ] `npm test` — suite nueva de la vista pasa (radiogroup, roving tabindex, contador,
      gating de botones, terminal honesto, «Empezar de nuevo» resetea).
- [ ] axe / Playwright en la vista tocada: **0 violaciones critical/serious** en
      1440×900 y 375×812 (config viva `playwright.config.ts:30-39`; usar override de
      puerto por el desalineaje conocido, `GUIA…:354`).
- [ ] Capturas de viewport en 375 / 768 / 992 / 1440 — sin overflow horizontal; fichas
      50.5/62.2 px en 375 verificables en la captura.
- [ ] Teclado completo: Tab entra a la primera ficha · flechas/Home/End/Espacio · foco
      al encabezado al cambiar de paso · «Volver» conserva respuestas · sin trampas.
- [ ] Estados 4/4 declarados y visibles: loading=n/a declarado · empty (paso en reposo) ·
      error (gating con ayuda textual) · terminal honesto. Nada de spinner ni «guardado».
- [ ] `grep` de sombras: **0 nodos con `box-shadow` distinto de none** en la vista
      (presupuesto 0 de la zona encuesta).
- [ ] `grep` del veto de vocabulario (§8.4): 0 apariciones en copy visible.
- [ ] **Ningún link público hacia `/e/[code]`** — los tests del chrome siguen en verde
      (`site-footer.test.tsx` ya lo vigila, `GUIA…:343`).
- [ ] Cero tokens/colores/fuentes/deps/iconos nuevos (diff contra §9).
- [ ] Variante construida = la firmada (A y/o B según decisión §10.2-1); si se firma tras
      construir A, la B reemplaza el contenido SIN tocar tokens/estilos (mismo armazón).

### 10.2 Preguntas abiertas (decisiones del operador)

| # | Decisión pendiente | Opciones | Mientras tanto |
|---|---|---|---|
| 1 | **Firma de #0 / variante vigente** (`pauta…:57-59`) | A (interina local) · B catálogo 5 preguntas · otra composición | este plano espec A construible como prototipo local; B bloqueada |
| 2 | **Agrupamiento B: 3 pasos vs 5 pasos** (Q2, `PROPUESTA…:554`) | 3 pasos (recomendado [PROP]) · 5 pasos · otra | wireframes de ambos en §3 |
| 3 | **Código desconocido/vencido** (§6.5; `pauta…:91-92` lo deja en #14) | A render con label · B pantalla neutral (post-#14) · C diferir | A por defecto |
| 4 | Anclas de polo 1/5 y 0/10 (Q3) | solo números · anclas con textos que fije el operador | solo números (`sin dato`) |
| 5 | Badge DEMO 16 px vs excepción 12 px (Q6) | 16 (regla zona) · excepción 12 | 16 |
| 6 | Cabecera con logo (F-O8) en la encuesta (Q6) | logo + badge · sin cabecera | sin logo |
| 7 | Copy terminal definitivo (Q5) | tal cual §8.3 · editar | §8.3 |

---

## 11. Referencias

| Hecho | Fuente |
|---|---|
| `/e/[code]` es marcador sin flujo | `scansaydone-front/src/app/(survey)/e/[code]/page.tsx:1-3` |
| Preguntas exactas rubro 2 | `scansaydone-back/scansaydone/catalogo.py:9-10, 23-29` |
| Escalas y límites (0–10, 1–5 ×3, ≤300, vacío→NULL) | `scansaydone-back/scansaydone/schemas.py:7, 22-28, 37` |
| Backend sirve encuesta por id numérico; sin mapeo code→empresa | `scansaydone-back/scansaydone/routers/empresas.py:20-46` |
| Gates #0 y #14 sin firmar; integración prohibida hasta firma | `docs/reuniones/pauta_reunion_2026-11-11_2100.md:44-62, 72, 87-103, 220` |
| G-0 firmado: modelo una nota 0–10 | `docs/frontend/ESTADO-2026-11-06.md:138` |
| D-1 sin firma (5 preguntas, 3 pantallas); bloquea etapa E | `docs/frontend/decisiones/DECISIONES-2026-11-05.md:5, 9-30` |
| D-6 sin firma (código opaco); bloquea etapa E | `DECISIONES-2026-11-05.md:117-125` |
| Orden F0→…→Encuesta→Integración | `docs/frontend/CANON.md:27` |
| Sin jerga visible; éxito solo con acción real | `CANON.md:79-82` |
| Vista nueva exige plano; sin links públicos a `/e/[code]` | `docs/frontend/GUIA-CONTRIBUCION-FRONTEND.md:343-344` |
| Foco 3 px hacia dentro (C-48) | `ESTADO-2026-11-06.md:132`; `GUIA…:242-247`; `globals.css:52-53` |
| Zona encuesta: blanco, borde sin sombra, ≥16 px, ≥44 targets | `docs/frontend/UX-SPEC-2026-11-05.md:119` |
| Vocabulario vetado (estrellas, «tiempo real», tiempos sin medir) | `UX-SPEC-2026-11-05.md:340, 351` |
| Capas de rotulado DEMO del precedente panel | `docs/frontend/planos/PANEL-2026-11-06.md:124-128` |
| Vacío con «—», no 0 | `PANEL-2026-11-06.md:162` |
| Tokens, breakpoints, contenedores, fuentes (Tailwind 4) | `scansaydone-front/src/app/globals.css:3-47` |
| Patrón vivo radiogroup/roving/fichas 6+5/botón deshabilitado/aria-live | `scansaydone-front/src/components/marketing/survey-card.tsx:12-52, 61-131` |
| Única sombra del sistema: 2 nodos del landing (no esta vista) | `GUIA…:249-251` |
| Propuesta base (wireframes Q1–Q11, revisada PASS, sin firmar) | `docs/frontend/planos/PROPUESTA-ENCUESTA-CAFETERIA-2026-11-11.md` |

---

*Fin — borrador pendiente de aprobación. Ninguna línea de código, configuración, test o
asset del repo fue modificada para producir este archivo. Registrado en
`docs/frontend/INDEX.md` como **BORRADOR**; no es contrato hasta la firma del operador.*
