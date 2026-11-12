# PROPUESTA — Encuesta cafetería/restaurante (rubro 2): cliente en `/e/[code]` + gestión de la empresa en el panel

> ## ⚠️ BORRADOR — requiere aprobación del operador; no implementado
>
> **Estado:** pendiente de aprobación. Este documento NO es contrato vigente.
> **Nada de lo Propuesto aquí está implementado.** Ningún archivo de código,
> configuración, test o índice del repo fue modificado para producirlo.
> **Alcance:** maqueta **solo frontend, solo local**: sin llamadas a API, sin
> Supabase, sin persistencia, sin sesión. El envío real existe cuando exista el
> endpoint (CANON §11 pendiente 6; `DECISIONES-2026-11-05.md:180`).
> **Dos superficies, un entregable (aclaración del operador, 2026-11-12):** la
> encuesta que responde el **cliente** en `/e/[code]` y la vista con la que la
> **empresa** la ve y gestiona dentro del panel (`/panel`) se proponen juntas,
> en la misma fase, compartiendo componentes, tokens y CSS del dashboard. Las
> capacidades de gestión son **propuestas no implementadas** (§6.6).
> Fecha de archivo: 2026-11-11 · redactado 2026-11-12 · revisado 2026-11-12
> tras la aclaración · convención de nombre `CANON.md:92`. El nombre de archivo
> no cambia: el documento se extiende, no se reemplaza.

Etiqueta de lectura usada en todo el documento:

- **[REPO]** = hecho verificable hoy, con `archivo:línea`.
- **[PROP]** = propuesta de diseño, sin efecto normativo hasta la firma.

---

## 1. Para quién es esto y qué decide

La tarea del operador: convertir la maqueta combinada (encuesta + panel pegada
en un solo mock) en una propuesta de encuesta de **cafetería/restaurante**
(`rubro_id=2`) con:

1. las **preguntas exactas** del catálogo actual del backend, y
2. el **lenguaje visual del panel/dashboard vigente**,

para una demo local en `/e/[code]`. Este documento prepara esa decisión. No la
toma. Las decisiones quedan en §9 (tabla de respuestas en blanco).

**Aclaración del operador (2026-11-12) que amplía este borrador:** la empresa
debe poder **ver y gestionar** la encuesta que se realiza, y el cliente también
la ve. Ambas superficies pertenecen al **mismo frontend y a la misma fase**,
compartiendo componentes, tokens y CSS del dashboard. Consecuencia en este
documento: mapa de dos superficies y navegación (§4.0, §4.4, §4.5), matriz de
componentes compartidos (§7.1), capacidades de gestión solo-locales con estados
honestos (§6.6) y frontera maqueta/integración (§6.7), más preguntas nuevas
Q7–Q11 (§9). **No se colapsan cliente y administración en una misma pantalla**
— siguen siendo pantallas distintas de un solo producto con un solo sistema de
diseño.

Conflicto de contenido que **se declara, no se resuelve en silencio**: ver §3.

---

## 2. Veredicto sobre la maqueta combinada pegada

La muestra pegada junta en una sola pantalla: encuesta, panel, navegación,
métricas falsas (8.5 / 486 / 377), comentarios y filas de tabla fabricadas, y
mensajes de «en tiempo real» y «guardado con éxito». Análisis del mock hecho
por `frontend-alibaba` en solo-lectura (sin copiar su código).

### Qué se conserva como inspiración estructural [PROP]

| Idea de la muestra | Por qué sirve |
|---|---|
| Tarjeta única centrada con una tarea por pantalla | coincide con la primera ley de Krug: una decisión visible a la vez |
| Indicador de progreso por pasos | reduce la pregunta implícita «¿cuánto falta?» |
| Botones de escala como fichas grandes tocables | compatible con targets ≥44 exigidos por la zona encuesta [REPO: `UX-SPEC-2026-11-05.md:119`] |
| Separar «puntuar» de «comentar» | el comentario abierto (P5) es otra tarea cognitiva |

### Qué se rechaza, con motivo exacto

| Elemento de la muestra | Motivo del rechazo | Fuente |
|---|---|---|
| Métricas 8.5 / 486 / 377 y cualquier KPI en la encuesta | cifra inventada = engaño; prueba social prohibida | [REPO] `CANON.md:67`; `DECISIONES-2026-11-05.md:167-168` (D-9) |
| Comentarios «recientes» y filas de tabla fabricadas | mismo motivo: no se inventan testimonios ni datos | [REPO] `CANON.md:67` |
| Mensaje «guardado con éxito» | ningún estado de éxito sin acción real; aquí no hay envío | [REPO] `CANON.md:82` |
| Texto «en tiempo real» | palabra vetada en texto visible | [REPO] `CANON.md:79-80`; `UX-SPEC-2026-11-05.md:351` |
| Encuesta y panel en la misma maqueta sincronizados | colapsar dos superficies en una pantalla y simular sincronización instantánea. Son **rutas distintas**: `/e/[code]` (cliente) y `/panel` (negocio); en el repo el panel es `panel-data.ts` estático y la encuesta ni existe como flujo. **La aclaración de §1 no revierte este rechazo**: gestión y encuesta coexisten como pantallas separadas de un mismo entregable (§4.0), sin sincronización real entre ambas | [REPO] `scansaydone-front/src/app/(survey)/e/[code]/page.tsx:1-3` (marcador `<h1>Encuesta</h1>`); `scansaydone-front/src/components/panel/panel-data.ts` (demo estático) |
| Una sola pregunta 1–10 + comentario | contradice el catálogo vigente de 5 preguntas | [REPO] `scansaydone-back/scansaydone/catalogo.py:8-10,22-29` |
| Paleta y tipografía ajenas a la marca (deriva de tokens) | el sistema visual cerrado es CANON §4/§5 | [REPO] `CANON.md:33-56`; `src/app/globals.css:3-47` |

Regla de uso: la muestra solo aporta estructura de interacción. **No se copia
su código, sus datos, ni sus textos.**

---

## 3. Conflicto de modelo de contenido (declarado, no resuelto)

Existen tres posiciones en el repo sobre cuántas preguntas tiene la encuesta:

| # | Posición | Dónde | Estado |
|---|---|---|---|
| A | **5 preguntas**: P1 0–10 + P2 global 1–5 + P3/P4 atributos del rubro 1–5 + P5 abierta | [REPO] `catalogo.py:8-10,22-29`; `schemas.py:22-28`; `routers/empresas.py:39-45`; `docs/datos/README.md:12-16` | **Es el catálogo que sirve hoy el backend** |
| B | 5 preguntas agrupadas en 3 pantallas, pero P2–P4 como tres valoraciones «atención, rapidez, producto» | [REPO] `docs/frontend/decisiones/DECISIONES-2026-11-05.md:9-30` (D-1) | **Propuesta pendiente de firma** (`DECISIONES-2026-11-05.md:5`); sus textos difieren del catálogo A |
| C | Una sola nota 0–10 (modelo actual del demo) | [REPO] `docs/frontend/ESTADO-2026-11-06.md:138` (G-0); patrón vivo en `survey-card.tsx:5,80-110` | Convive con el registro abierto G-0 en `UX-SPEC-2026-11-05.md:420` (owner: PM/equipo) |

**Tratamiento en esta propuesta:** el operador entregó como entrada el catálogo
exacto de cafetería (posición A) y pidió la encuesta con esos textos. Esta
propuesta usa **A como contenido** para la maqueta local, **sin declararse
decisión de producto global**: B sigue pendiente de firma y G-0 sigue abierto.
Si el operador firma otra cosa, se cambia este documento, no el catálogo del
backend (que además «no se toca» por `CANON.md:16`).

---

## 4. Mapa de pantallas y wireframes [PROP]

### 4.0 Mapa general: dos superficies, un entregable [PROP]

```
SUPERFICIE DE GESTIÓN (empresa)              SUPERFICIE DE CLIENTE
panel → sección «Encuesta» [PROP, nueva]     /e/[code] (hoy: marcador [REPO])
┌────────────────────────────┐               ┌────────────────────────────┐
│ Catálogo P1–P5 solo lectura│ «Ver encuesta │ Paso 1 · 2 · 3 (flujo §4.1)│
│ Controles locales (§6.6)   │  completa» →  │ componentes idénticos a los│
│ Respuestas: vacío / DEMO   │               │ de la gestión (§7.1)       │
│ Vista previa del paso 1    │ ←───────────  │ Terminal honesta (§6.5)    │
└────────────────────────────┘ «Volver a la  └────────────────────────────┘
                                gestión» (solo demo, Q11)
```

- Ambas superficies comparten tarjeta, botones, formularios, tokens,
  tipografía, reglas responsive y reglas de foco (§7.1). Cero tokens nuevos.
- La navegación entre ellas es **local y real** (router del demo), pero **no es
  la resolución de un QR ni de una empresa** (§4.5, §8).
- El cliente nunca ve controles de gestión; la gestión no envía respuestas: si
  la empresa recorre la encuesta desde la vista previa, usa la misma demo local
  del cliente (§4.5), sin envío real.

### 4.1 Cliente — flujo propuesto en 3 pasos

```
/e/[code]  →  Paso 1 (P1, 0–10)  →  Paso 2 (P2+P3+P4, 1–5)  →  Paso 3 (P5 opcional)
                                                              ↓
                                              Pantalla final honesta (demo local)
```

- **Paso 1:** P1 sola. Es la pregunta «pesada» (11 opciones); merece pantalla propia.
- **Paso 2:** P2, P3 y P4 juntas como tres grupos de radios apilados. Tres
  decisiones homogéneas (misma escala 1–5, mismo gesto) → coste de agrupación
  bajo; la Ley de Hick se respeta porque cada grupo es una decisión independiente.
- **Paso 3:** P5 abierta, claramente marcada **opcional**; botón «Saltar» y
  botón «Finalizar» conviven (finalizar funciona sin escribir).

> ⚠️ **La agrupación 1+3+1 en tres pantallas es decisión pendiente de
> aprobación (§9 Q2).** No está firmada en el repo; D-1 propuso «tres pantallas»
> con contenido distinto y sigue sin firma (`DECISIONES-2026-11-05.md:5`).

### 4.2 Alternativa — 5 pasos (una pregunta por pantalla)

| Criterio | 3 pasos | 5 pasos |
|---|---|---|
| Toques de navegación | 4 (2 «Continuar» + «Finalizar» + inicio) | 6 |
| Decisiones por pantalla | 3 en el paso 2 | 1 siempre |
| Scroll en móvil | paso 2 requiere bajar entre grupos | ninguno |
| Sensación de duración | «voy por la mitad» explícito | más pantallas = más abandono potencial |
| Riesgo | paso 2 puede leerse como muro si el espaciado falla | repetición del mismo gesto 5 veces |

Recomendación **[PROP]**: 3 pasos. Es la que ya insinúa D-1 (reducir abandono
sin recortar datos, `DECISIONES-2026-11-05.md:24`), con el contenido corregido
al catálogo. Si el operador prefiere 5, el wireframe por paso es el mismo con
un solo grupo.

**Sin afirmaciones de tiempo.** Nada de «te toma 30 segundos»: el repo prohíbe
cifras de duración sin medición (`UX-SPEC-2026-11-05.md:340,351`). El progreso
se comunica con «Pregunta 1 de 3», no con minutos.

### 4.3 Wireframe 375 × 667 (boceto, no contrato visual)

```
Paso 1                                        Paso 2
┌───────────────────────────┐                 ┌───────────────────────────┐
│ [logo]            [DEMO]  │ barra fina      │ [logo]            [DEMO]  │
│ ● ─ ○ ─ ○        1 de 3   │ progreso        │ ● ─ ● ─ ○        2 de 3   │
│───────────────────────────│                 │───────────────────────────│
│ ¿Qué tan probable es que  │                 │ En general, ¿qué tan      │
│ recomiendes el negocio a  │ P1 · oblig.     │ satisfecho/a quedaste?    │
│ un amigo o familiar?      │                 │ ┌───┬───┬───┬───┬───┐     │
│ ┌───┬───┬───┬───┬───┬───┐ │                 │ │ 1 │ 2 │ 3 │ 4 │ 5 │     │
│ │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ │ 6 fichas        │ └───┴───┴───┴───┴───┘     │
│ ├───┼───┼───┼───┼───┼───┤ │                 │                           │
│ │ 6 │ 7 │ 8 │ 9 │10 │   │ │ fila de 5       │ ¿Cómo calificas el sabor  │
│ └───┴───┴───┴───┴───┴───┘ │                 │ y la calidad de lo que    │  ← mismo bloque
│ (anclas 1/5: sin dato, §9)│                 │ consumiste?  · P3         │
│                           │                 │ ┌───┬───┬───┬───┬───┐     │
│ [      Continuar        ] │                 │ │ 1 │ 2 │ 3 │ 4 │ 5 │     │
│ Volver                    │                 │ └───┴───┴───┴───┴───┘     │
└───────────────────────────┘                 │ … P4 igual (en pantalla)  │
                                              │ [      Continuar        ] │
                                              └───────────────────────────┘
Paso 3                                        Pantalla final (demo)
┌───────────────────────────┐                 ┌───────────────────────────┐
│ [logo]            [DEMO]  │                 │ ● ─ ● ─ ●      3 de 3     │
│───────────────────────────│                 │                           │
│ ¿Qué podríamos hacer para │ P5 · OPCIONAL   │ Gracias por responder.    │
│ que tu próxima visita sea │                 │                           │
│ mejor?                    │                 │ Maqueta local: tus        │
│ ┌───────────────────────┐ │ textarea        │ respuestas se quedaron en │
│ │ 24 caracteres         │ │ + contador      │ esta página. No se        │
│ └───────────────────────┘ │ 24/300 [sin d.] │ enviaron ni se guardaron  │
│ Máximo 300 caracteres     │ helper          │ en ningún lado.           │
│                           │                 │                           │
│ [ Saltar ]  [ Finalizar ] │                 │ [ Empezar de nuevo ]      │
└───────────────────────────┘                 └───────────────────────────┘
```

`Volver` en pasos 2–3 conserva las respuestas ya dadas (estado local). Nunca se
pierde trabajo del usuario por retroceder (cortesía de Krug / gestión de
buena voluntad).

### 4.4 Empresa — vista «Encuesta» del panel [PROP]

Sección nueva del panel: **quinto término de navegación**. NO se reutiliza
«Códigos QR» — hoy está deshabilitado y es otra función (gestión de códigos)
[`REPO: PANEL-2026-11-06.md:150`]. Ruta propuesta (inexistente hoy; no se
inventa un href vigente): p. ej. `/panel/encuesta`, a definir en
implementación (Q7).

Wireframe 992+ (shell del panel — sidebar ≥993 / fila de 44 px ≤992 — no se
dibuja; boceto, no contrato visual):

```
┌──────────────────────────────────────────────┐
│ Encuesta de tu negocio          [DATOS DE    │
│                                 EJEMPLO]     │
│ Negocio de ejemplo — demo, sin identidad real│
│──────────────────────────────────────────────│
│ Así la ve tu cliente (vista previa, paso 1)  │
│ ┌──────────────────────────────────────────┐ │
│ │ P1 «¿Qué tan probable es que recomiendes │ │
│ │ el negocio…?» + fichas 0–10 en reposo    │ │
│ │ — el MISMO componente de escala de       │ │
│ │ /e/[code], aquí en solo lectura          │ │
│ └──────────────────────────────────────────┘ │
│ [  Ver encuesta completa  ] → demo /e/[code] │
│                                              │
│ Tus preguntas (catálogo rubro 2, §5)         │
│  P1 recomendación 0–10 · obligatoria         │
│  P2 satisfacción general 1–5 · obligatoria   │
│  P3 sabor y calidad 1–5 · obligatoria        │
│  P4 tiempo del pedido 1–5 · obligatoria      │
│  P5 comentario abierto · opcional (300)      │
│ [Editar — no disponible en la demo]  (Q9)    │
│                                              │
│ Estado de la encuesta (Q8)                   │
│ ( ) Activa   ( ) Pausada — solo visual o     │
│     deshabilitado; nunca «guardado» (§6.6)   │
│                                              │
│ Respuestas                                   │
│ Aún no hay respuestas. Cuando alguien        │
│ responda tu QR, aparecerán aquí. (vacío,Q10) │
└──────────────────────────────────────────────┘
```

En 375 px la misma columna se apila bajo la fila de navegación de 44 px del
panel, con las reglas de §6.1 (misma tipografía mínima ≥16 px del contenido).

### 4.5 Navegación entre superficies (local y real — no es resolución de QR)

- «Ver encuesta completa» navega a `/e/[code]` con el código de demostración
  etiquetado (§8). Es navegación de verdad dentro del demo (router local),
  **pero no resuelve un QR ni una empresa**: no existe mapeo `code → empresa`
  (§8) y la maqueta no muestra ningún QR (§6.6).
- Vuelta: opción recomendada — enlace discreto «Volver a la gestión» visible
  **solo dentro de la demo**, junto a la banda DEMO de `/e/[code]` (Q11). El
  cliente real no debe ver nada de la gestión; el enlace existe solo para que
  operador/empresa recorran el circuito completo. Alternativa: sin affordance
  extra, vuelta con el botón «Volver» del navegador.

---

## 5. Las cinco preguntas — texto exacto del catálogo [REPO]

Fuente autoritativa del contenido: `scansaydone-back/scansaydone/catalogo.py`
(líneas citadas) y `scansaydone-back/scansaydone/schemas.py:22-28`. **No se
reescriben, no se añaden, no se fusionan.** Los nombres internos de campo
(`p1_nps`, `p2_csat`…) son del backend y **jamás aparecen en texto visible**
(veto de jerga `CANON.md:79-81`).

| # | Pregunta exacta (texto del repo) | Escala | Obligatoria | Campo backend | Línea fuente |
|---|---|---|---|---|---|
| P1 | «¿Qué tan probable es que recomiendes el negocio a un amigo o familiar?» | 0–10 (11 valores) | Sí | `p1_nps` `ge=0, le=10` | `catalogo.py:9` · `schemas.py:22` |
| P2 | «En general, ¿qué tan satisfecho/a quedaste?» | 1–5 | Sí | `p2_csat` `ge=1, le=5` | `catalogo.py:10` · `schemas.py:23` |
| P3 | «¿Cómo calificas el sabor y la calidad de lo que consumiste?» | 1–5 | Sí | `p3_atributo` `ge=1, le=5` | `catalogo.py:27` (rubro 2) · `schemas.py:24` |
| P4 | «¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?» | 1–5 | Sí | `p4_atributo` `ge=1, le=5` | `catalogo.py:28` (rubro 2) · `schemas.py:25` |
| P5 | «¿Qué podríamos hacer para que tu próxima visita sea mejor?» | texto abierto, **máx. 300 caracteres** | **No** | `p5_comentario` `max_length=300`, vacío→NULL | `catalogo.py:29` (rubro 2) · `schemas.py:7,26-28,37` |

Etiquetas internas del rubro 2 (no se muestran como anclas de escala):
`p3_label` «Calidad del producto», `p4_label` «Tiempo de servicio»
[`REPO: catalogo.py:25-26`]. El backend las expone como `etiqueta` de
atributo [`REPO: routers/empresas.py:42-43`], no como textos de polo.

### 5.1 Fichas 0–10 en 375 px: dosel 6 + 5 (nunca 11 columnas diminutas)

Matemática del layout **[PROP]**, anclada al patrón vivo del repo:

- Tarjeta con `p-4` (16 px por lado) sobre 375 px → ancho interior **343 px**.
- Rejilla de **6 columnas** con separación 8 px (`gap-2`):
  `(343 − 5×8) / 6 = 50.5 px` por ficha ≥ 44 → cumple sin encoger.
- Segunda fila: **5 fichas** (6–10) en las mismas columnas; la 6.ª celda queda
  vacía, centrada visualmente. Es exactamente la morfología que ya usa la
  tarjeta demo: `grid-cols-5 xs:grid-cols-6` con fichas `min-h-11 min-w-11`
  (44 px) [`REPO: survey-card.tsx:84,101`].
- Prohibido: 11 columnas en una fila → fichas de ~26 px, bajo el mínimo de la
  zona encuesta (`UX-SPEC-2026-11-05.md:119`: targets ≥44 «sin excepción»).

### 5.2 Fichas 1–5: radiogroup accesible, **sin estrellas**

- **Bloque de 5 fichas numéricas** con `role="radiogroup"` +
  `role="radio" aria-checked`, tabindex móvil y flechas (patrón vivo del repo:
  `survey-card.tsx:12-52,80-110`), con la corrección de §5.4.
- **(1·12 − 32) / 5 = 62.2 px** por ficha a 375 px: holgadamente ≥44.
- **Estrellas: prohibidas salvo aprobación explícita aparte [PROP→Q3].** Ya
  están vetadas en el repo: «estrellas como escala» figura en la lista de
  jerga/patrones prohibidos en texto visible (`UX-SPEC-2026-11-05.md:351`) y
  el glifo estrella U+2605 está marcado *CORREGIR* en los planos (`:411`) y
  prohibido como asset (`:389`). Las estrellas además convierten cada grupo en
  5 objetivos pequeños y arrastrables en táctil; la ficha numérica no.

### 5.3 Anclas de los polos 1 y 5: **`sin dato`**

Ni `catalogo.py`, ni `schemas.py`, ni `empresas.py` definen textos de polo
(verificado en las tres fuentes: no existen) **[REPO]**. Por tanto:

- La propuesta **no inventa** anclas del tipo «nada satisfecho / muy
  satisfecho». Quedan **`sin dato`** hasta que el operador las apruebe o las
  rechace (§9 Q3).
- Sin anclas firmadas, la pantalla muestra solo los números; la pregunta ya
  lleva el anclaje semántico («¿Qué tan conforme…?»).
- Para 0–10 aplica lo mismo: las anclas clásicas de recomendación **no están**
  en el repo; se dejan `sin dato` por la misma regla.

### 5.4 Desviación deliberada del demo actual [PROP]

La tarjeta del landing preilumina el valor 9 como apoyo visual
[`REPO: survey-card.tsx:102`, cuando `selected === null`]. En la encuesta real
de 5 preguntas eso **sesga la respuesta** (valor por defecto visual = pregunta
inductiva). Propuesta: sin preselección; todas las fichas arrancan en reposo.

---

## 6. Layout responsivo, foco, teclado, validación, progreso, semántica y estados

### 6.1 Anchos [REPO → PROP]

Breakpoints del sistema: `xs:375 · sm:576 · md:768 · lg:992 · xl:1200 ·
2xl:1400` [`REPO: globals.css:23-29`]. La encuesta usa la misma rejilla pero
**no** usa los contenedores de marketing (esa rejilla es para secciones de
landing): el flujo de encuesta vive en una columna única acotada.

| Ancho | Comportamiento **[PROP]** |
|---|---|
| **375** | 1 columna. Tarjeta llena el ancho − márgenes 16 px. Paso 1: 6+5. Paso 2: tres grupos apilados, scroll vertical corto, cada pregunta + sus 5 fichas viajan juntas (evitar huérfanas). Paso 3: textarea 4 líneas + botones apilados (Finalizar arriba, Saltar abajo, Volver como enlace-texto). |
| **768** | Tarjeta centrada, ancho máx. ≈ `--container-mkt-sm` (540 px, `globals.css:32`) sin cambiar tokens. Botones de acción en fila. |
| **992** | Igual que 768; aumentan paddings de la tarjeta (`p-6`). |
| **1440** | Columna única centrada, `p-8` en la tarjeta. **La encuesta no se abre a dos columnas ni se llena de espacios libres decorativos**: una tarea, un camino (Krug 1ª ley). |

Fondo de página `background-page` (#F7E5C8) con tarjeta `surface-default`
(#FFFFFF) y borde — coherente con la zona encuesta blanca del contrato
(`UX-SPEC-2026-11-05.md:119`: fondo blanco, tarjeta con borde, **sin sombra
nueva**).

### 6.2 Foco y teclado [REPO]

- Anillo del sistema: `3px` con `outline-offset: -3px` en `text-primary` sobre
  claro — patrón vivo `globals.css:52-69` y `survey-card.tsx:61,101,117`.
- Foco **hacia dentro** (decisión firmada C-48: `ESTADO-2026-11-06.md:132`).
- Cada grupo 1–5 / bloque 0–10: radiogroup con tabindex móvil — flechas
  ←/→/↑/↓ mueven la selección, `Home`/`End` saltan a los extremos
  [`REPO: patrón en survey-card.tsx:12-47`]. Espacio/Enter seleccionan.
- Foco va al encabezado del paso tras cada «Continuar»/«Volver» (heading con
  `tabIndex={-1}` + `focus()`), y un `role="status" aria-live="polite"`
  anuncia «Pregunta 2 de 3» — mismo mecanismo de región viva que usa hoy la
  nota demo [`REPO: survey-card.tsx:124-131`].
- Pestaña de navegación del navegador: título del documento «Encuesta» sin
  nombre de empresa en el demo (no se inventa identidad).

### 6.3 Validación [PROP]

- Pasos 1 y 2: botón **Continuar deshabilitado** hasta responder todo lo
  obligatorio del paso — el demo ya usa botón deshabilitado hasta haber
  selección (`survey-card.tsx:116`). Mientras esté deshabilitado, un
  texto de ayuda en `text-secondary` (nunca solo color) dice cuántas faltan:
  «Faltan 2 de 3 respuestas».
- Paso 3: **Finalizar siempre activo** (P5 es opcional; `schemas.py:26-28`
  admite `None`; el validator convierte vacío→NULL `:37`). «Saltar» =
  finalizar sin comentario; son dos puertas honestas al mismo estado final.
- Textarea: `maxLength` 300 + contador visual `n/300`; helper estático
  «Máximo 300 caracteres» vía `aria-describedby` (el contador no se anuncia
  tecla a tecla: ruido de región viva). El límite es el del backend
  [`REPO: schemas.py:7`]; se muestra el dato, no se inventa otro.

### 6.4 Progreso [PROP]

- Indicador «● ─ ○ ─ ○» + texto «Pregunta {n} de 3» — el texto manda, los
  puntos son refuerzo (estados nunca solo por color, `CANON.md:49`). Con 5
  pasos, mismo patrón con 5 puntos.
- Sin barra porcentual animada: no hay carga real que medir.

### 6.5 Estados y honestidad de la demo [REPO → PROP]

| Estado | Qué pasa en la maqueta |
|---|---|
| **loading** | no existe: sin red, sin API → ningún spinner (un spinner falso sería mentira de estado) |
| **empty** | paso recién abierto = sin selecciones; así se ve (fichas en reposo) |
| **error** | no hay envío → no hay error de envío. Única «validación» es la de paso (§6.3). Si P5 pasa 300 el control `maxLength` lo impide antes del límite |
| **success** | **prohibido el «guardado con éxito»** (`CANON.md:82`). El estado terminal se llama y se redacta honesto: ver texto [PROP] abajo |

Texto terminal propuesto (pendiente de aprobación §9 Q5):

> **Gracias por responder.**
> Maqueta local: tus respuestas se quedaron en esta página. No se enviaron ni
> se guardaron en ningún lado.
> `[ Empezar de nuevo ]`

- Botón reset → limpia solo el estado React local. **Sin `localStorage` ni
  cookies**: persistir daría a entender que «se guardó».
- Banda `[DEMO]` visible en la barra superior de cada paso (reusa el badge
  vivo `survey-card.tsx:63-66` sobre `surface-elevated` con `text-primary`).
  Nota: en el **panel** la banda se dice «DATOS DE EJEMPLO»
  (`UX-SPEC-2026-11-05.md:351`); aquí no hay KPIs ni comentarios falsos que
  etiquetar, la etiqueta DEMO cubre la página completa.
- La maqueta **no muestra** ningún resumen tipo «tu selección: 8, 4, 5, 3»,
  ninguna lista de comentarios, ningún número agregado: la pantalla del cliente
  no produce ni muestra métricas. La gestión vive en su propia superficie
  (§4.4) y **nada se sincroniza** entre ambas en la maqueta (§2).

### 6.6 Superficie de gestión: capacidades solo-locales y estados honestos [PROP]

Todo lo de esta tabla es **propuesta no implementada** y ocurre **solo en el
estado React local de la vista de gestión** (§4.4). Nada persiste, nada afecta
al enlace que ve el cliente, nada toca la API.

| # | Capacidad de la empresa | Estado propuesto en la maqueta | Frontera honesta (qué NO hace) | Decisión |
|---|---|---|---|---|
| 1 | **Ver la encuesta exacta** (P1–P5) y su vista previa | lista literal del catálogo §5 en solo lectura + vista previa que renderiza **el mismo componente** de escala que `/e/[code]`; «Ver encuesta completa» navega a la demo (§4.5) | no consulta `/api/v1/empresas/…`: textos fijos en el frente, copiados del catálogo, con comentario de fuente | cubierta por Q1 (contenido) |
| 2 | **Activar / pausar** la encuesta | opción A (recomendada): control **deshabilitado** con ayuda inline — patrón ya usado en el panel de ejemplo [`REPO: PANEL-2026-11-06.md:130-136`]; opción B: switch **solo visual** que cambia el texto de estado en la propia vista | en B, aviso permanente junto al control: «Cambio solo visual de la demo: no se guarda y no afecta el enlace que ve el cliente.» **Nunca** simula activación real | **Q8** |
| 3 | **Editar preguntas** | opción A (recomendada): catálogo **solo lectura** + acción «Editar» deshabilitada con ayuda «Editar no está disponible en la demo.»; opción B (solo si el operador la pide): editor **local-only** que modifica el texto en memoria durante la sesión de página | ninguna variante persiste ni toca `catalogo.py` (intocable, `CANON.md:16`); al recargar vuelven los textos del catálogo; el editor local no debe poder leerse como edición real del negocio | **Q9** |
| 4 | **Identidad / código** | «Negocio de ejemplo — demo, sin identidad real» + código de demostración etiquetado (§8, Q4) | cero nombres, logos, ciudades o marcas inventadas; el `code` de la demo no corresponde a ninguna empresa | Q4 + Q6 |
| 5 | **Ver respuestas** | por defecto **estado vacío**: «Aún no hay respuestas. Cuando alguien responda tu QR, aparecerán aquí.» (mismo copy honesto del vacío del panel [`REPO: PANEL-2026-11-06.md:162`]) | sin cifras, sin comentarios «recientes», sin tablas fabricadas (§2). Opción B: dataset de muestra **solo** con etiquetado DEMO fuerte y **sin atribución** a ningún negocio real | **Q10** |
| 6 | **Código QR** | **se recomienda omitir por completo**: no se muestra ningún QR | mostrar un QR escaneable solo si de verdad funciona y está declarado demo; un QR decorativo que no resuelve nada es la mentira de §8 en formato imagen | omisión [PROP]; el operador puede exigirlo bajo esas dos condiciones |

Estados de la vista de gestión: **loading** no existe (sin red); **empty** =
respuestas vacías (fila 5); **error** no existe (sin envío); **success**
prohibido como «guardado» (`CANON.md:82`) — si el switch local (fila 2-B)
cambia el texto, se dice «cambio visual de la demo», nunca «guardado».

### 6.7 Frontera: qué es maqueta frontend y qué exige backend futuro [PROP]

| Pieza | En la maqueta (frontend local) | Requiere backend (fuera de alcance hoy) |
|---|---|---|
| Textos P1–P5 | fijos en el frente, idénticos a §5, fuente comentada `catalogo.py` | servidos por `GET /api/v1/empresas/{empresa_id}/encuesta` [`REPO: routers/empresas.py:20-46`] |
| Acceso del cliente | `/e/[code]` con código de demo etiquetado; cualquier valor renderiza la maqueta | mapeo `code → empresa` (no existe) + QR real generado por el negocio |
| Vista previa gestión→cliente | navegación local real (§4.5) | resolución real de código (integración, `CANON.md:120-129` pend. 6) |
| Activar/pausar | nada (A) o solo visual con aviso (B) | persistencia + efecto sobre el enlace real |
| Editar preguntas | nada (A) o editor en memoria (B) | CRUD de catálogo + validación de esquema |
| Respuestas y métricas | vacío o dataset DEMO sin atribución | endpoint de respuestas (pendiente) + métricas calculadas de verdad |
| «Tiempo real» | **nunca** (palabra vetada, §2) | ni siquiera entonces: sincronizar exige medirlo y demostrarlo |

---

## 7. Tokens y reutilización de señales del dashboard [REPO→PROP]

**Regla dura: cero tokens nuevos, cero dependencias nuevas, cero sombras
nuevas.** El presupuesto de sombra está cerrado a una sola sombra del sistema
(`globals.css:49-58`, única `--elev-float`, decisión C-87 registrada en
`ESTADO-2026-11-06.md:149`) y la paleta es la aprobada (CANON §4; G-29 cerrada
`UX-SPEC-2026-11-05.md:450`).

Qué se toma del lenguaje visual del panel/dashboard (todas son señales vivas
del repo, no invención):

| Señal | Uso en la encuesta | Fuente [REPO] |
|---|---|---|
| Tarjeta blanca `surface-default` + borde `border-mid` de 2 px | contenedor de cada paso (`p-4 sm:p-6 lg:p-8` igual que la tarjeta demo) | `survey-card.tsx:61`; `CANON.md:47-48` (separar con borde, no con sombra) |
| Badge `DEMO` sobre `surface-elevated` | esquina superior, coherencia con la demo del landing | `survey-card.tsx:63-66` |
| Tipografía: **Montserrat** para todo el cuerpo, preguntas, fichas y botones; **Bebas solo en titulares grandes** | la pregunta del paso va en Montserrat semibold (como `survey-card.tsx:73-78`); Bebas solo si el terminal usa un display ≥32 px — y nunca en fichas, botones ni textos largos | `CANON.md:53-56`; `globals.css:44-46`; `DECISIONES-2026-11-05.md:75-78` (D-3) |
| Tamaños: pregunta `text-lg` en móvil → `sm:text-xl`; fichas ≥16 px; ayuda `14 px` solo fuera de la zona encuesta | en `/e/[code]` **ninguna letra bajo 16 px** — norma específica de la zona encuesta | `UX-SPEC-2026-11-05.md:119` («Montserrat nunca < 16 px» en zona encuesta). *Nota: el badge «DEMO» del patrón vivo usa `text-xs` (12 px) en el landing; en la maqueta de encuesta se fija el texto del badge en ≥16 px o se declara excepción al operador (Q6)* |
| Jerarquía 1 tarea = 1 tarjeta = 1 pregunta principal | paso 2 apila 3 bloques de pregunta con separación clara (espaciado de escala Tailwind, sin nuevos valores) | `globals.css` (Tailwind 4 escala estándar); `survey-card.tsx:73-84` |
| Foco oscuro invertido (anillo interno 3 px) | idéntico al sistema | `globals.css:52-53,65-69`; `survey-card.tsx:61,101,117` |
| Fichas seleccionadas: `interactive-primary` con texto `text-primary` | base del contraste medido 5.61 sobre coral (etiqueta siempre oscura) | `CANON.md:45`; `DECISIONES-2026-11-05.md:55` |
| Botón primario: superficie oscura `surface-dark` + texto `on-dark` | «Continuar» / «Finalizar» (mismo botón de la demo: `survey-card.tsx:117`) | `globals.css:13-14`; `survey-card.tsx:117` |
| Transiciones 150 ms en color, con `motion-safe` | mismos enlaces de clase que la demo | `survey-card.tsx:117` |

**Lo que NO se copia del dashboard:** tarjetas KPI, barras/gráficos, listas de
respuestas recientes, tabla de filas, «evolución», cifras Bebas de resumen
(F-O9 aplica al panel, no a la encuesta). La encuesta no es un dashboard: el
cliente no ve métricas, solo responde. La vista de gestión tampoco inventa
métricas: sus «respuestas» son vacío o dataset DEMO (§6.6).

### 7.1 Matriz de componentes compartidos entre las dos superficies [PROP]

Mismo CSS, mismos tokens, cero duplicados de estilo. La diferencia entre
superficies es de **contenido y controles**, no de lenguaje visual.

| Pieza compartida | En `/e/[code]` (cliente) | En la gestión del panel (§4.4) |
|---|---|---|
| Tarjeta `surface-default` + borde 2 px | contenedor de cada paso | contenedores de vista previa, catálogo, estado y respuestas |
| Bloque de escala accesible (radiogroup, roving tabindex) | P1–P4 respondibles | P1–P5 en **solo lectura** (misma morfología, sin interacción) |
| Textarea + contador `n/300` + helper | paso 3 (P5) | no aplica (no se escribe en gestión) |
| Botón primario `surface-dark` + texto `on-dark` | «Continuar»/«Finalizar» | «Ver encuesta completa» |
| Badge de demo | `[DEMO]` (zona encuesta) | `[DATOS DE EJEMPLO]` — copy del panel, `UX-SPEC-2026-11-05.md:351` |
| Anillo de foco 3 px interno | fichas y botones | ítems del catálogo y controles de §6.6 |
| Tipografía Montserrat/Bebas | pregunta en Montserrat ≥16 px; Bebas solo display | título de sección Bebas ≥32 px; cuerpo y preguntas en Montserrat |
| Reglas responsive §6.1 | columna única 375→1440 | rejilla del panel (sidebar ≥993, fila nav 44 px ≤992) [`REPO: PANEL-2026-11-06.md:166-171`] |
| Estados honestos §6.5/§6.6 | terminal sin «guardado» | vacío sin cifras; nunca «guardado» |

---

## 8. Semántica de `/e/[code]` en la maqueta [REPO→PROP]

Hechos del repo:

- La ruta existe **como marcador**: `src/app/(survey)/e/[code]/page.tsx:1-3`
  renderiza `<h1>Encuesta</h1>` y nada más. No hay flujo, no hay estado, no hay
  fetch.
- El backend sirve la encuesta por **id numérico**:
  `GET /api/v1/empresas/{empresa_id}/encuesta` con `empresa_id: int ≥ 1`
  [`REPO: routers/empresas.py:20-25,30-38`]. **No existe mapeo
  `code → empresa`** en ningún lugar del backend ni del frontend (verificado:
  la ruta usa id entero; la página `[code]` no lo consume).
- D-6 (sin firmar) recomienda `/e/[code]` con **código opaco no secuencial**
  porque un id numérico público permite enumerar encuestas ajenas
  [`REPO: DECISIONES-2026-11-05.md:117-125`].

Consecuencias para la maqueta **[PROP]**:

1. El segmento `[code]` en la demo es un **placeholder visible de demo**: se
   recomienda que la propia página muestre, en pequeño y en `text-secondary`,
   «Código de demostración: `{code}` — no corresponde a ninguna empresa real».
   Cualquier valor de `code` renderiza la misma maqueta rubro 2 (cafetería),
   declarada como tal. Nada de `DEMO1` disfrazado de token: se etiqueta.
2. **Prohibido** usar un `empresa_id` numérico como si fuera el token público
   del QR: no es un código opaco (contradice D-6) y simularía una resolución
   real de empresa que no existe.
3. La URL del QR real **se resolverá en la etapa de integración backend**
   (bloqueada por «Endpoint de respuestas» y por el generador de códigos,
   dueños: backend — `CANON.md:120-129` pend. 6; `DECISIONES-2026-11-05.md:124`).
   Nada de la maqueta lo define ni lo presupone más allá de que la ruta existe.
4. Sin página de «empresa no encontrada» en la demo: no hay lookup, así que no
   hay 404 falso. Cuando exista el mapeo, el error de código inválido será
   decisión de esa etapa.
5. La vista previa desde la gestión (§4.5) aterriza en esta misma ruta con el
   código de demostración: navegación local real, **no** resolución de QR ni de
   empresa. Por eso la maqueta **no muestra ningún QR** (§6.6, fila 6).

---

## 9. Preguntas de aprobación (respuesta del operador)

| # | Pregunta | Opciones | Respuesta operador |
|---|---|---|---|
| **Q1** | ¿Se aprueba el **contenido**: las 5 preguntas literales del catálogo rubro 2 (P1 0–10, P2/P3/P4 1–5, P5 abierta opcional ≤300), tal como §5, **a pesar** de que D-1 (sin firmar) describe otro contenido para P2–P4 y G-0 sigue abierto? | A) Sí, catálogo como contenido de la maqueta · B) No, espero la firma global de D-1/G-0 | |
| **Q2** | ¿Se aprueba el **agrupamiento en 3 pasos** (P1 / P2+P3+P4 / P5)? Alternativa: 5 pasos, una pregunta por pantalla. | A) 3 pasos · B) 5 pasos · C) otra: ____ | |
| **Q3** | **Anclas de polo 1/5 y 0/10** y **estrellas**: el repo no define anclas (`sin dato`) y ya veta estrellas (`UX-SPEC :351,389,411`). ¿Confirmar sin anclas (solo números)? ¿Excepción de anclas con textos que tú fijes? ¿Alguna vez estrellas? | A) Solo números, sin anclas · B) Sí, anclas con textos: ____ · C) discutir estrellas aparte | |
| **Q4** | **Código de la demo en `/e/[code]`**: ¿placeholder etiquetado «demostración, no es empresa real» con cualquier valor renderizando la misma maqueta rubro 2? (Prohibido id numérico como token público.) | A) Sí · B) otro esquema: ____ | |
| **Q5** | **Mensaje final** de la maqueta (texto de §6.5): «Gracias por responder. Maqueta local: tus respuestas se quedaron en esta página. No se enviaron ni se guardaron en ningún lado. [Empezar de nuevo]» | A) Sí, tal cual · B) editar copia: ____ | |
| **Q6** | **Cabecera móvil de la encuesta**: barra fina con logo como imagen (patrón F-O8) + badge DEMO, sin navegación. ¿El texto del badge respeta ≥16 px o se acepta la excepción tipográfica del badge existente (12 px)? | A) logo + DEMO, badge ≥16 px · B) logo + DEMO, excepcion badge a 12 px · C) sin cabecera | |
| **Q7** | **Sección de gestión en el panel**: ¿quinto término de navegación llamado «Encuesta» (NO reutilizar «Códigos QR», hoy deshabilitado y es otra función, `PANEL-2026-11-06.md:150`)? Ruta nueva propuesta (p. ej. `/panel/encuesta`), hoy inexistente. | A) «Encuesta», quinto ítem · B) otro nombre: ____ · C) otra ubicación: ____ | |
| **Q8** | **Activar/pausar en la gestión**: A) control deshabilitado con ayuda honesta (recomendado; patrón del panel de ejemplo) · B) switch solo visual local con aviso permanente «no se guarda ni afecta el enlace del cliente». | A · B | |
| **Q9** | **Editar preguntas en la gestión**: A) catálogo solo lectura + «Editar» deshabilitado (recomendado) · B) editor local-only en memoria, sin persistencia, con aviso. | A · B | |
| **Q10** | **Respuestas en la gestión**: A) solo estado vacío (recomendado) · B) dataset de muestra con etiquetado DEMO fuerte y sin atribución a negocio real. | A · B | |
| **Q11** | **Vuelta de la encuesta a la gestión** tras «Ver encuesta completa»: A) enlace «Volver a la gestión» solo dentro de la demo (junto a la banda DEMO) · B) sin enlace, solo botón «Volver» del navegador. | A · B | |

---

## 10. Integración conceptual de componentes (sin código)

**Nivel concepto** — el diseño se describe en piezas; la arquitectura y el
código corresponden a la etapa de implementación, **después** de la aprobación
de §9. No hay fragmentos de código en este documento porque no hay nada
implementado.

Piezas nombradas como conceptos **[PROP]**:

1. **Caparazón del flujo** — estado local del paso actual (1/2/3) y de las
   respuestas; un solo árbol de React en `/e/[code]`, sin rutas hijas, sin
   estado fuera de la sesión de página.
2. **Bloque de escala** — el mismo concepto para P1 (11 fichas) y P2–P4 (5
   fichas): grupo accesible de radios con roving tabindex, parametrizado por
   escala y texto de pregunta. *Lectura honesta: el patrón ya vive hoy en la
   tarjeta demo del landing (`survey-card.tsx`), con la corrección de §5.4
   (sin preiluminación 9) y la regla de ≥16 px de la zona encuesta.*
3. **Campo abierto P5** — textarea + contador + helper de máximo.
4. **Muro de paso 2** — tres bloques de escala apilados bajo una sola
   pregunta-encabezado por bloque.
5. **Terminal honesta** — pantalla final + reset de estado local (§6.5).
6. **Sección «Encuesta» del panel** — la pantalla de gestión de §4.4: catálogo
   en solo lectura, controles locales, respuestas vacías. Quinto término de
   navegación (Q7); hereda el shell del panel (sidebar/fila nav) tal como está.
7. **Controles locales de gestión** — según Q8/Q9: deshabilitados con ayuda
   honesta, o switch/editor solo-visuales con sus avisos (§6.6). Nada persiste.
8. **Puente de vista previa** — «Ver encuesta completa» y la vuelta (§4.5,
   Q11): navegación local real entre superficies, sin QR.

Frontera de la maqueta: la página `[code]` pasa del marcador actual
(`<h1>Encuesta</h1>`) a este flujo **solo-frontend**, sin fetch a
`/api/v1/empresas/…` (etapa de integración = última en el orden de CANON
§3: `F0 → Landing → Login → Panel → Internas → Encuesta → Integración`; aquí
construimos «Encuesta» como demo local, no la integración). **Por la
aclaración de §1, el entregable incluye también la sección «Encuesta» del
panel (piezas 6–8) en la misma fase**; se declara que añadir su ítem de
navegación toca el área «Panel» ya construida como demo estático — cambio
mínimo y visible para revisión, no integración. Los textos de la
maqueta se fijan locales en el frente, **idénticos** al catálogo de §5, y se
marca con un comentario de código (en su momento) que la fuente autoritativa es
`catalogo.py` — para que la integración real luego los sirva desde la API sin
duplicar deriva.

Orden de ejecución propuesto tras aprobación (solo referencia, no
compromiso de fechas): [PROP] a) estructura de pasos y estado local;
b) bloques de escala accesibles; c) P5 + contador; d) terminal honesta +
reset; e) pasada responsive 375/768/992/1440 con los gates del CANON §9
(build, lint, tsc, test, axe/Playwright en la vista tocada, captura de
viewport); f) sección «Encuesta» del panel con las capacidades de §6.6 según
Q7–Q10; g) puente de vista previa y vuelta (Q11) + su pasada accesible.
Cada una con su revisión. **Nada empieza sin tu firma en §9.**

---

## 11. Referencias

### Hechos del repo (verificados leyendo los archivos)

| Hecho | Fuente |
|---|---|
| Preguntas exactas rubro 2 y etiqueta P3/P4 | `scansaydone-back/scansaydone/catalogo.py:8-10, 22-29` |
| Escalas y límites de datos (0–10, 1–5, 300 chars, vacío→NULL) | `scansaydone-back/scansaydone/schemas.py:7, 22-28, 37` |
| Backend sirve encuesta por `empresa_id` numérico | `scansaydone-back/scansaydone/routers/empresas.py:20-46` |
| Modelo de datos documentado P1 NPS 0–10 / P2 CSAT 1–5 / P3-P4 atributos / P5 abierta | `docs/datos/README.md:12-16` |
| D-1 = 5 preguntas en 3 pantallas **propuesta sin firmar**, contenido P2–P4 distinto al catálogo | `docs/frontend/decisiones/DECISIONES-2026-11-05.md:5, 9-30` |
| Roles de color derivados (hover/pressed/bordes/estados) propuestos sin firma | `DECISIONES-2026-11-05.md:34-63`; presentes ya en `src/app/globals.css:5-21` |
| Código opaco recomendado, id numérico = riesgo de enumeración | `DECISIONES-2026-11-05.md:117-125` (D-6) |
| G-0: modelo actual del demo = una nota 0–10 | `docs/frontend/ESTADO-2026-11-06.md:138` |
| Foco hacia dentro (C-48) | `docs/frontend/ESTADO-2026-11-06.md:132` |
| C-87 aplicada bajo autorización (profundidad/revelado) | `docs/frontend/ESTADO-2026-11-06.md:149` |
| `/e/[code]` es marcador sin flujo | `scansaydone-front/src/app/(survey)/e/[code]/page.tsx:1-3` |
| Patrón accesible vivo 0–10: radiogroup, roving tabindex, flechas, Home/End, aria-live, nota honesta demo, fichas 44 px, 6+5 en 375 | `scansaydone-front/src/components/marketing/survey-card.tsx:12-52, 61-131` (preilum. 9 en `:102`) |
| Panel = demo estático `panel-data.ts`, sin estadísticas vivas | `scansaydone-front/src/components/panel/panel-data.ts` |
| `/panel` = única ruta real verificada del panel; navegación de 4 términos con «Reseñas», «Códigos QR» y «Ajustes» deshabilitados («Códigos QR» es gestión de códigos, otra función) | `docs/frontend/planos/PANEL-2026-11-06.md:142-153` (régimen `sin dato` de rutas en `:144`; «Códigos QR» deshabilitado en `:150`) |
| Patrón vivo de controles deshabilitados con ayuda honesta en el panel de ejemplo | `PANEL-2026-11-06.md:130-138` |
| Copy del estado vacío del panel, reutilizable para «Respuestas» | `PANEL-2026-11-06.md:162` |
| Layout del panel: sidebar ≥993 / fila nav 44 px ≤992; contenido 1056/944/343 | `PANEL-2026-11-06.md:166-171` |
| Paleta aprobada, reglas de borde-vs-sombra, etiqueta de botón siempre `#1A181B`, Bebas solo display, tuteo, veto jerga (KPI/CSAT/NPS/tiempo real), éxito solo con acción real, orden de construcción front-only | `docs/frontend/CANON.md:19-31, 33-56, 77-83` |
| Prueba social / cifras / QR falsos prohibidos | `CANON.md:62-71` |
| Pendientes que bloquean (endpoint, roles firmados, cinco preguntas) | `CANON.md:120-129` |
| Zona encuesta: fondo blanco, tarjeta con borde sin sombra, Montserrat ≥16 px, targets ≥44 sin excepción; pasos/progreso/cierre = `sin dato` | `docs/frontend/UX-SPEC-2026-11-05.md:118-119` |
| Prohibido: estrellas como escala, «20 segundos», «DEMO a secas» en badge del panel (allí «DATOS DE EJEMPLO») | `UX-SPEC-2026-11-05.md:340, 351` |
| Estrella U+2605 prohibida como asset / planos CORREGIR | `UX-SPEC-2026-11-05.md:389, 411` |
| G-0 registrado como decisión abierta (owner PM/equipo) | `UX-SPEC-2026-11-05.md:420` |
| Tokens Tailwind 4 del sistema (colores, breakpoints, contenedores, fuentes, única sombra, anillo de foco) | `src/app/globals.css:3-69` |

### Propuestas de este documento (sin estatus hasta §9)

- Agrupamiento en 3 pasos y su comparación con 5 (§4).
- Mapa de dos superficies + wireframe de gestión + navegación entre ambas
  (§4.0, §4.4, §4.5) — añadido tras la aclaración del operador 2026-11-12.
- Layout 6+5 fichas 0–10 con la matemática de 375 px (§5.1 — la morfología ya
  existe en el demo, su adopción en `/e/[code]` es propuesta).
- Fichas numéricas sin estrellas y sin anclas `sin dato` (§5.2–5.3).
- Retiro de la preiluminación del 9 (§5.4).
- Reglas de teclado/validación/progreso/estados honestos (§6).
- Capacidades de gestión solo-locales con estados honestos y omisión de QR
  (§6.6); frontera maqueta-frontend vs integración-backend (§6.7).
- Reutilización de señales del panel sin sus KPIs (§7) y matriz de componentes
  compartidos entre las dos superficies (§7.1).
- Placeholder etiquetado en `[code]` (§8).
- Conceptos de componentes (incluida la gestión, piezas 6–8) y orden tras
  aprobación (§10).
- Preguntas nuevas Q7–Q11 sobre la superficie de gestión (§9).

### Sin fuente / explícitamente no inventado

- Anclas verbales de 1/5 y 0/10 → `sin dato`.
- Nombre de empresa, mesa, ciudad, logo del local demo → no se inventa
  identidad: la maqueta es «negocio de ejemplo» o sin nombre; el operador
  decide (§9 Q6).
- Fechas de entrega → no hay compromiso de fechas en este documento.
- Duración de la encuesta → sin cifras de tiempo (§4.2).

---

*Fin — borrador pendiente de aprobación. Ninguna línea de código, configuración
o test del repo fue modificada para producir este archivo; no se actualizó el
índice (`docs/frontend/INDEX.md`) porque el documento aún no es contrato.*
