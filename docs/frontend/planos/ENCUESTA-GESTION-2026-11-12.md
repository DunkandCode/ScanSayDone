# ENCUESTA-GESTION — sección «Encuesta» de gestión en el panel: spec construible (plano, no código)

> ## ⚠️ BORRADOR — pendiente aprobación; no implementado; solo local
>
> **Estado:** BORRADOR. Ninguna línea firmada. Nada de lo [PROP] existe en código.
> **Alcance del documento:** especificación construible del anexo de gestión de
> `PROPUESTA-ENCUESTA-CAFETERIA-2026-11-11.md` §6.6 (capacidades de la empresa sobre
> la encuesta), dentro del shell existente de `/panel`. **No duplica su prosa: lo
> convierte.** Sin persistencia, sin API, sin QR escaneable (`CANON.md:68`), sin
> métricas reales, sin afirmaciones de tiempo real.
> **No abre F-O1…F-O9 de `PANEL-2026-11-06.md`** — los hereda y los exige como
> premisa si no están firmados: esta sección vive sobre el shell propuesto ahí.
> **Convención de nombre:** `CANON.md:92` [REPO].
> **Honestidad:** no ejecuté build, lint, axe ni Playwright. Cero PASS en este
> archivo. Los `[D]` son aritmética de sesión sin herramienta. Los contrastes citados
> son `[D]` heredados de `PANEL-2026-11-06.md:191` y `§13` y deben re-medirse con axe
> en el gate de implementación.

Clave de lectura:

| Marca | Significado |
|---|---|
| `[REPO]` | hecho verificable hoy con `archivo:línea` |
| `[PROP]` | propuesta de este plano; sin efecto hasta firma del Operador |
| `[D]` | cálculo aritmético/WCAG de esta sesión, sin herramienta |
| `sin dato` | no documentado y no derivable — no se inventa |
| `sin_evidencia` | la capacidad no aparece en `pauta_reunion_2026-11-11_2100.md`: no tiene respaldo en acta |

Fuentes atajadas: **PANEL** = `docs/frontend/planos/PANEL-2026-11-06.md` · **PROPUESTA** =
`docs/frontend/planos/PROPUESTA-ENCUESTA-CAFETERIA-2026-11-11.md` · **CANON** =
`docs/frontend/CANON.md` · **GUIA** = `docs/frontend/GUIA-CONTRIBUCION-FRONTEND.md` ·
**ESTADO** = `docs/frontend/ESTADO-2026-11-06.md` · **PAUTA** =
`docs/reuniones/pauta_reunion_2026-11-11_2100.md` · **catalogo/schemas/empresas** =
`scansaydone-back/scansaydone/…`.

**Skills cargadas (gate de diseño):** design-system-mastery, awesome-claude-design-mastery,
frontend-design, session-anchor-system, caveman-core.

---

## 1. Alcance, ubicación, gates y decisiones abiertas

### 1.1 Qué se especifica

Seis capacidades de gestión de la encuesta **dentro del shell del panel**, cada una con su
frontera honesta (la tabla completa de capacidades está en PROPUESTA §6.6 — aquí se fija
cómo se ve, no se reescribe su justificación):

| # | Capacidad | Frontera honesta (resumen; detalle en §6) | Origen | Evidencia en acta |
|---|---|---|---|---|
| C1 | Ver la encuesta (catálogo P1–P5, solo lectura) | texto literal del catálogo fijo en el frente; cero fetch | PROPUESTA:436 | `sin_evidencia` |
| C2 | Abrir vista previa del cliente | navegación local real a `/e/[code]` con código demo; **no** resuelve QR ni empresa | PROPUESTA:436, 258-263 | `sin_evidencia` |
| C3 | Activar/pausar | A) deshabilitado con ayuda · B) `role="switch"` solo visual con aviso permanente | PROPUESTA:437 → **Q8** | `sin_evidencia` |
| C4 | Editar preguntas | A) solo lectura + acción deshabilitada · B) editor en memoria con aviso previo | PROPUESTA:438 → **Q9** | `sin_evidencia` |
| C5 | Identidad / código del negocio | placeholder demo declarado; cero identidad inventada | PROPUESTA:439 → **Q4/Q6** | `sin_evidencia` |
| C6 | Respuestas | vacío por defecto (—) · opcional dataset **ya existente** con declaración (§9) | PROPUESTA:440 → **Q10** | `sin_evidencia` |

**`sin_evidencia` explicado:** marcado así por el briefing F3 del orquestador y
corroborado en la pauta leída (§7 métricas #17, §10 orden, §12 reglas): la gestión de
la encuesta no es tema del acta. Son
ampliación pedida por el Operador el 2026-11-12 (declarada en PROPUESTA:39-48), no
acuerdos de acta. El plano es **diseño solo-frontend**; no viola PAUTA:220 porque no
integra API/UI (ver 1.3).

**QR fuera, duro:** no se dibuja ningún QR en esta sección. `CANON.md:68`: prohibido QR que
parezca escaneable si no lo es; y la maqueta no resuelve códigos (PROPUESTA:441, fila 6).

### 1.2 Dónde vive (decisión mayor, ver §2)

Dentro del shell `/panel` [REPO: `GUIA:146-152`]. **Añadir el quinto ítem «Encuesta» o la
ruta `/panel/encuesta` es `[PROP]` y hoy no existe** — toca un área ya construida
(`layout.tsx` del panel, GUIA:154-166). La PROPUESTA ya lo declaró: «añadir su ítem de
navegación toca el área 'Panel' ya construida… cambio mínimo y visible para revisión, no
integración» [REPO: PROPUESTA:601-604]. Con `GUIA:165` («no les pongas `href` inventado») y
PANEL:144 («cero enlaces a rutas no verificadas»): **en este plano ninguna opción fija un
href vigente para la sección.**

### 1.3 Gates que mandan sobre este plano (no se saltan)

| Gate | Qué dice | Efecto aquí |
|---|---|---|
| PAUTA:143-144 | «**Alcance por negocio**: el panel es por empresa (tenant); cómo se selecciona y qué ve cada negocio. **Auth del panel incluida**» — abierto | No existe «la encuesta de TU negocio» verificable: todo contenido de gestión es maqueta declarada. Prohibido redactar copy que presuponga sesión/empresa real (§8) |
| PAUTA:220 | «**Nada de integración API/UI** hasta que el contrato de #14 esté decidido y firmado» | Este plano no define ni presupone fetch. La fuente autoritativa de textos sigue siendo `catalogo.py` copiada al frente con comentario (regla PROPUESTA:605-608) |
| CANON:127 pendiente 4 | «Panel con barra lateral — Operador» | El shell que hospeda la sección (sidebar 240) sigue esperando F-O1 (PANEL:210); la sección no firma el shell, lo hereda |
| CANON:126 pendiente 3 | «Cinco preguntas de la encuesta — PM» | C1 usa el catálogo A [REPO catalogo.py] como contenido de maqueta, sin declararse decisión global (régimen PROPUESTA:97-102) |

### 1.4 Decisiones abiertas

Q7 (ubicación/nombre), Q8 (switch), Q9 (editor), Q10 (respuestas), Q11 (vuelta) — **definidas
y enumeradas en PROPUESTA §9:559-563; no se reescriben aquí.** Este plano añade las
decisiones propias de la spec: G1 (forma de navegación, §2), G2 (presupuesto coral de la
sección, §2.4/§9), G3 (tabla del catálogo en móvil, §4.4), G4 (badge y líneas de
declaración de página, §8). Todas en la tabla de §10.2.

---

## 2. Navegación

### 2.1 Opción A — quinto término de navegación + ruta propia [PROP]

`Resumen · Reseñas* · Códigos QR* · Encuesta* · Ajustes*` (orden alfabético NO manda; se
inserta «Encuesta» antes de «Ajustes» [PROP]; `*` = el estado según firma).

- La ruta de aterrizaje sería `/panel/encuesta` [PROP, nombre a confirmar en implementación
  — Q7]. **Hoy no existe.** Mientras no exista el código que la monta, el ítem **no puede**
  llevar `href`: usaría la receta de deshabilitado §5.9 con ayuda «La sección de encuesta
  está en diseño: no hay ruta todavía.» — visible, inerte, honesto (régimen PANEL:130-136).
- Consecuencias: toca `src/app/(panel)/layout.tsx` (array de nav construido, GUIA:158-166)
  → cambio en área ya revisada; abre pantalla nueva con su propio H1, su propio presupuesto
  de honestidad (chip+línea+pie propios) y su propia pasada de axe; separa gestión de las
  métricas-demo de Resumen → **menos riesgo de confusión «esto son mis datos»**.
- Coste: +1 ítem a una sidebar que ya gasta 240 px con 3 ítems inertes (conflicto C5 de
  PANEL:237 ya admitido allí para crecimiento futuro; «Encuesta» es el primer candidato a
  salir de inerte si el Operador firma Q7+Q8A+Q9A — ojo: con Q8/Q9 en opción A el ítem
  entra **activo** solo si la ruta existe; si Q8/Q9 salen en B, sigue siendo maqueta con
  avisos, no función).

### 2.2 Opción B — subsección dentro de la página Resumen existente [PROP]

Bloque «Encuesta de tu negocio» como sección más de `/panel` (bajo B7 pie o entre B1 y B2
[PROP] — ubicación exacta es decisión G1).

- Cero ruta nueva, cero cambio en `layout.tsx`: mínimo tacto de área construida.
- Consecuencias negativas (se declaran): mezcla **gestión maqueta** con **métricas
  inventadas de negocio ficticio** en la misma pantalla; las tres capas de declaración de
  PANEL:124-128 están redactadas para el panel-métricas y habría que extenderlas (riesgo de
  dilución del mensaje «no pertenece a ningún negocio real»); el H1 «Panel de ejemplo»
  [REPO: GUIA:171] queda por encima de una sección que habla de «tu encuesta», legible como
  promesa. **Recomendación [PROP]: Opción A** cuando el Operador firme Q7; mientras tanto
  (sin firma), la maqueta puede construirse como Opción B **detrás de un toggle demo
  existente-like** o no construirse — eso lo decide la firma, no este plano.

### 2.3 Receta del ítem deshabilitado (patrón vivo, no invento)

[REPO: `GUIA:165`] — ítems construidos hoy: `role="link"` + `aria-disabled="true"` +
`title` explicativo (`layout.tsx:37-39, 65-67`); PANEL:149-151 exige además ayuda inline
visible (el `title` de tooltip no basta en táctil). Receta completa para «Encuesta» en
estado inerte:

```
<span role="link" aria-disabled="true" tabindex="0"
      title="no disponible en el panel de ejemplo">Encuesta</span>
```
+ línea de ayuda bajo el ítem en sidebar (o `title` en la fila de nav ≤992, donde el
espacio no admite segunda línea: el texto visible de ayuda vive en el header de la sección
si el Operador abre la pantalla). Foco permitido (focusable ≠ operativo, PANEL:192);
`cursor: not-allowed`; texto `#5A5555`; cero `href`; cero `onClick`.

El ítem activo (si Q7 se firma y la ruta se construye) usa el estado activo firmado del
shell: `<span aria-current="page">` [REPO: PANEL:148; GUIA:170 «todos los ítems navegables
del nav son active o disabled»]; **nunca** enlace que se apunta a sí mismo.

### 2.4 Presupuesto coral de la sección [PROP]

[REPO: ESTADO:87] un `#FC5A41` visible por pantalla; en `/panel` lo gasta la línea B3
[REPO: GUIA:172]. En `/panel/encuesta` (pantalla distinta, presupuesto propio) la propuesta
es **cero coral**: el único interruptor semántico de la sección (activar/pausar) no puede
pintarse con el color de acción principal — coral-activo codificaría «encuesta viva» por
color, y el canon exige estado por texto (CANON:49); PANEL:55 ya rechazó coral para
etiquetas de demo por el mismo motivo. Todo botón primario de la sección va en `surface-dark`
(§9). Firma: **G2**.

---

## 3. Anatomía — wireframes ASCII (boceto, no contrato visual)

Reglas del shell citadas de [REPO: PANEL:31-33, 166-178; GUIA:158-161; ESTADO:73]:
sidebar 240 fija desde `min-[993px]` (cutoff real, no `lg:`); ≤992 topbar 56 sticky + fila
nav 44 sticky con scroll horizontal; contenido max 1056 / 944 / 343 con padding 32 / 24 / 16.
`C3` = tarjeta «Así la ve tu cliente»; `C1` = catálogo; `C2` = estado; `C5` = identidad;
`C6` = respuestas. `▸` en los bocetos marca solo «página actual» — su forma final es la
pastilla + filete activo del shell [REPO: PANEL:340 fila 10], nunca un glifo nuevo; `*` =
ítem deshabilitado con la receta §2.3.

### 3.1 — 1440 × 900 (sidebar 240 + columna 1056 centrada)

```
┌──────────┬────────────────────────────────────────────────────────────────────────┐
│ ScanSay  │  Encuesta de tu negocio                     [DATOS DE EJEMPLO]  ← chip │
│ Done     │  (H1 Bebas 40)                                                        │
│ (lockup  │  Ves la sección de encuesta del panel de ejemplo. No hay encuesta      │
│  168×40) │  real, enlace ni respuestas detrás.  (15 px #5A5555)                  │
│          │ ──────────────────────────────────────────────────────────────────────  │
│ Resumen  │ ┌ C3 · Tarjeta · p24 ──────────────────────────────────────────────┐  │
│ ▸Encuesta│ │ Así la ve tu cliente (h2 + filete 3×16 #8A6F55)                  │  │
│  Reseñas*│ │  P1 «¿Qué tan probable es que recomiendes…»  fichas 0–10 reposo  │  │
│  Códigos │ │  (solo lectura · sin preselección · aria-hidden + texto espejo)  │  │
│   QR*    │ │  [ Ver encuesta completa ]  → demo /e/[code]                     │  │
│  Ajustes*│ └───────────────────────────────────────────────────────────────────┘  │
│          │ ┌ C1 · Catálogo ───────────────────────────────────────────────────┐   │
│ Sesión de│ │ Tus preguntas (h2)                          [Editar — disabled]  │   │
│ demo. No │ │ tabla P# · pregunta · escala · oblig. · etiqueta (5 filas, 44 h) │   │
│ hay      │ │ ayuda: «Editar no está disponible en la demo.»                   │   │
│ cuenta   │ └───────────────────────────────────────────────────────────────────┘   │
│ real     │ ┌ C2 · Estado ────────────┐  ┌ C5 · Identidad ────────────────────┐    │
│ detrás.  │ │ Estado de la encuesta   │  │ Negocio de ejemplo — demo,         │    │
│ Volver al│ │ ( ) —  (switch A: desab.)│ │ sin identidad real                 │    │
│ inicio†  │ │ ayuda honesta bajo      │  │ Código de demostración: {code}     │    │
│          │ └─────────────────────────┘  │ — no corresponde a empresa real    │    │
│          │                              └────────────────────────────────────┘    │
│          │ ┌ C6 · Respuestas ─────────────────────────────────────────────────┐   │
│          │ │ Respuestas (h2)                                                  │   │
│          │ │        —                                                         │   │
│          │ │ Sin datos todavía.                                               │   │
│          │ │ Aún no hay respuestas. Cuando alguien responda tu QR,            │   │
│          │ │ aparecerán aquí.                                                 │   │
│          │ └───────────────────────────────────────────────────────────────────┘  │
│          │ Panel de ejemplo con datos inventados. No pertenece a ningún           │
│          │ negocio real.  (pie B7 literal · borde sup. 1 px #D9C0A0)              │
└──────────┴────────────────────────────────────────────────────────────────────────┘
```
`†` «Volver al inicio» solo si `/` existe (PANEL:31, 153 — regla intacta). Alturas: C2 y C5
par 1:1 de 516 px c/u (gap 24); C3/C1/C6 ancho pleno 1056; gaps entre tarjetas 24 (§4).

### 3.2 — 992 (≤992: sidebar cae → topbar 56 + fila nav 44; contenido 944, padding 24)

```
┌────────────────────────────────────────────────────────────┐
│ [lockup 119×28]                                   [DEMO]   │ ← topbar 56, sticky
│ Resumen ▸Encuesta* Reseñas* Códigos QR* Ajustes*          │ ← fila 44 · scroll-x ·
├────────────────────────────────────────────────────────────┤    orden idéntico (PANEL:32)
│ Encuesta de tu negocio           [DATOS DE EJEMPLO]        │    la fila nav 44 sigue
│ Ves la sección de encuesta del panel de ejemplo. No        │    con aria-disabled +
│ hay encuesta real, enlace ni respuestas detrás.            │    title en ≤992
│────────────────────────────────────────────────────────────│
│ ┌ C3 (944) ─────────────────────────────────────────────┐ │
│ │ Así la ve tu cliente …  [ Ver encuesta completa ]     │ │
│ └───────────────────────────────────────────────────────┘ │
│ ┌ C1 (944) ─────────────────────────────────────────────┐ │
│ │ Tus preguntas   [Editar] — tabla entra sin scroll      │ │  944 − 2·24 = 896 ≥ 640 (min tabla)
│ └───────────────────────────────────────────────────────┘ │
│ ┌ C2 (944) ─┐ ┌ C5 (944) ─┐    ← apiladas 1 col (precedente
│ └───────────┘ └───────────┘       B4/B5 apiladas en 992, PANEL:175)
│ ┌ C6 (944) ─────────────────────────────────────────────┐ │
│ │ Respuestas   —  Sin datos todavía. …                  │ │
│ └───────────────────────────────────────────────────────┘ │
│ Pie de declaración (literal B7)                             │
└────────────────────────────────────────────────────────────┘
```

### 3.3 — 768 (mismo shell colapsado; contenido 720, padding 24)

```
┌──────────────────────────────────────────┐
│ [lockup]                        [DEMO]   │
│ Resumen ▸Encuesta* Reseñas* Cód… Ajustes*│ ← la fila 44 scrollea en x;
├──────────────────────────────────────────┤   nada tras hamburguesa (PANEL:33)
│ Encuesta de tu negocio  [DATOS DE EJEMPLO]│  H1 Bebas 40 (≥993-768: 40 [D ver §4.5])
│ Ves la sección… (2 líneas en 720)         │
│ ┌ C3 (720) ─────────────────────────────┐ │
│ │ Así la ve tu cliente                  │ │
│ │ fichas 0–10 en una fila: (720−48−7·8… │ │  ver matemática §4.3
│ │ [ Ver encuesta completa ]             │ │
│ └───────────────────────────────────────┘ │
│ ┌ C1 (720) ─────────────────────────────┐ │
│ │ tabla 640 ≤ 672 interior: entra,       │ │
│ │ sin scroll                             │ │
│ └───────────────────────────────────────┘ │
│ C2 → C5 → C6 apiladas · gap 24 · pie B7   │
└──────────────────────────────────────────┘
```

### 3.4 — 375 (contenido 343, padding 16)

```
┌──────────────────────┐
│ [lockup]     [DEMO]  │ topbar 56
│ ▸Encuesta* Reseñas* …│ fila nav 44, scroll-x (hits 44×44)
├──────────────────────┤
│ Encuesta de tu        │ H1 Bebas 32 (≥32 legal,
│ negocio [DATOS DE     │ precedente PANEL:172)
│ EJEMPLO]  ← badge     │
│ baja al inicio de     │
│ contenido en ≤992     │
│ (régimen PANEL:32)    │
│ Ves la sección…       │
│ ┌ C3 p24 (295 int.) ─┐│
│ │ Así la ve tu        ││
│ │ cliente             ││
│ │ 0–10: 6+5 fichas    │││ (295−5·6)/6 = 44,17 [D]
│ │ 1–5: fila de 5      │││ (295−4·8)/5 = 52,6 [D]
│ │ [Ver encuesta       ]││  botón pleno ancho, h 44
│ └─────────────────────┘│
│ ┌ C1 ─────────────────┐│
│ │ Tus preguntas         ││
│ │ ┌scroll-x─min 640────┐││  tabla region role,
│ │ │ P# Pregunta Esc…    │││  §4.4; caption visible
│ │ └────────────────────┘││
│ │ [Editar] + ayuda      ││
│ └───────────────────────┘│
│ ┌ C2 ─┐ ┌ C5 ─┐  apiladas │
│ ┌ C6 ────────────┐         │
│ │ Respuestas      │         │
│ │  —  Sin datos   │         │
│ │  todavía. …     │         │
│ └─────────────────┘         │
│ Pie B7 (3 líneas en 343)    │
└─────────────────────────────┘
```

En ≤992 el chip `DEMO` de la topbar es el del shell [REPO: GUIA:159 marca+chip]; el badge
`[DATOS DE EJEMPLO]` de la sección baja a la primera fila del contenido, igual que el
interruptor D5 nunca vive en la barra (regla PANEL:289). Cero hamburguesa (PANEL:33).

---

## 4. Retícula y espaciados (matemática explícita)

### 4.1 Tabla base por breakpoint (xs375 · sm576 · md768 · lg992 · xl1200 · 2xl1400 [REPO: globals.css:24-29])

| Medida | 1440 | 992 | 768 | 375 | Fuente / [D] |
|---|---|---|---|---|---|
| Chrome | sidebar 240 fija | topbar 56 + fila nav 44 (sticky) | ídem | ídem | PANEL:31-33 · GUIA:158-160 |
| Ancho disponible | 1440−240−64 = **1136** | 992−48 = **944** | 768−48 = **720** | 375−32 = **343** | [D]; PANEL:35,171 |
| Columna contenido | **1056** (max, centrada, márgenes auto 40) | 944 | 720 | 343 | GUIA:161 `max-w-[1056px]` |
| Padding externo | 32 | 24 | 24 | 16 | PANEL:35 |
| Gap entre tarjetas | 24 | 24 | 24 | 16 | PANEL:37 (24 ≥993/992 · 16 en 375) — **sin desviación nueva** |
| Padding tarjeta | 24 (`p-6`) | 24 | 24 | 24 | [PROP] fijo (escala Tailwind; proporción en 375: 24/343 = 7 %) |
| Ancho interior tarjeta | 1008 | 896 | 672 | 295 | [D] = columna − 2·24 |
| Fila C2+C5 (par 1:1) | (1056−24)/2 = **516** | apiladas | apiladas | apiladas | [PROP]; precedente PANEL:175 usa gap 24 en pares |
| Altura de H1 | Bebas 40 | Bebas 40 | Bebas 40 | Bebas 32 | PANEL:172 (375: 32, legal ≥32) |
| H2 bloque | Montserrat 700 18 + filete 3×16 `#8A6F55`, gap 10 | ídem | ídem | Montserrat 700 16 | PANEL §13.5 (fila 5) |
| Fila de tabla | 44 | 44 | 44 | 44 | precedente B5: «fila de datos: 44 px» PANEL:338 |
| Ítem nav / botón / switch hit | ≥44 | ≥44 | ≥44 | ≥44 | PANEL:32,178 · CANON targets |

### 4.2 Comportamiento de columnas por tramo

| Bloque | ≥993 | 992 / 768 | 375 |
|---|---|---|---|
| Header (H1+badge+línea) | pleno; badge alineado a la derecha de la fila del H1 (régimen chip PANEL:126) | pleno; badge primera fila del contenido | pleno; badge bajo H1 |
| C3 preview | pleno 1056; fichas de escala como **glifo informativo**, no control (§5.3) | pleno | dentro de p24: 6+5 con gap 6 → celda 44,17 [D] |
| C1 tabla | pleno; columna «Pregunta» elástica: 1008 − 388 (fijas 44+96+88+160) = **620** [D] | 944: 896 − 388 = **508** [D] · 720: 672 − 388 = **284** [D] → 672 ≥ min 640: sin scroll en 768; ancho fijo final lo fija frontend con axe/viewport (G3) | 295 < 640 → siempre scroll-x, min 640 |
| C2+C5 | par 1:1 gap 24 (516 c/u) | apiladas, gap 24 | apiladas, gap 16 (escala 375 PANEL:37) |
| C6 | pleno | pleno | pleno |

### 4.3 Escala 0–10 en C3 (glifo, no interacción)

- ≥993 interior 1008: 11 fichas en una fila, gap 8: (1008 − 10·8)/11 = **84,4** ✓ una sola fila.
- 768 interior 672: (672−80)/11 = **53,8** ✓ fila única.
- 375 interior 295: dosel 6+5 con gap 6 (`gap-1.5`, escala Tailwind, sin valores nuevos):
  (295 − 5·6)/6 = **44,17** [D]. Morfología 6+5 tomada del patrón vivo citado en
  PROPUESTA:293-305 (allí 50,5 sobre 343 en `/e/[code]`; aquí 44,17 sobre 295 por el p24 —
  [D] de esta sesión, cero valor inventado fuera de escala).
- Fichas 1–5 (P2–P4) 375: (295 − 4·8)/5 = **52,6** [D] ✓.
- Al ser glifo `aria-hidden`, la regla ≥44 (objetivos táctiles) no es su disparador: se
  cumple igualmente sin esfuerzo; el número ≥44 real de esta sección lo gastan nav (44),
  botones (44) y switch (44).

### 4.4 Tabla del catálogo — estructura

`<table>` real [REPO precedente PANEL:185]: `<caption>` visible · `<th scope="col">` en las
5 columnas · `<th scope="row">` por pregunta (P1…P5) · numéricos `tabular-nums`. En ≤768
(no quepa el min 640): wrapper `<div role="region" aria-labelledby="cap-c1"
tabindex="0" class="overflow-x-auto">` — patrón de scroll accesible, precedente vivo del
mismo mecanismo en la fila nav (`overflow-x-auto`, GUIA:159). Alternativa apilada `dl`
**descartada [PROP]**: duplica estructuras de datos entre tramos y rompe la semántica de
tabla que la auditoría F-R1 audita (PANEL:230). Firma G3 confirma min 640 + ancho fijo de
columnas: P# 44 · Escala 96 · Obligatoria 88 · Etiqueta 160 · Pregunta elástico (mín 252).

### 4.5 Alturas y orden vertical (1440, resumen [D])

Header h1-block ≈ 40+2·24 ≈ 88 · C3 ≈ título 28 + 24 + 2 filas fichas 2·44+8 + botón 44 +
p24·2 ≈ 320 · C1 ≈ 28 + 24 + th 44 + 5·44 + ayuda 20 + p24·2 + botón Editar 44 (en el
encabezado) ≈ 420 · C2 ≈ 180 · C5 ≈ 160 · C6 ≈ 240 · pie ≈ 60 · gaps 24×6. Todo cabe en
scroll natural; **no se diseña para pantallas sin scroll** (la sección es lista de tarjetas).

---

## 5. Contratos de componentes

Convención: cada contrato = anatomía · tokens/propiedades · comportamiento · accesibilidad
· **deber no** (lo prohibido). Todos viven dentro del shell [REPO: GUIA:154-166].

### 5.1 Header de sección

- Anatomía: `h1` (Bebas 40/32, `#1A181B`) + badge `DATOS DE EJEMPLO` (§5.8) + línea de
  declaración (§8.2) + filete divisorio 1 px `#D9C0A0`.
- Si Opción B (§2.2): el `h1` de `/panel` sigue siendo «Panel de ejemplo» [REPO GUIA:171] y
  «Encuesta de tu negocio» baja a `h2` con filete; el orden de encabezados no se rompe.
- Deber no: en el H1/H2 de esta sección **nunca** nombre de negocio real ni «tu encuesta
  está…» en indicativo de estado (§6).

### 5.2 Tarjeta genérica de la sección (contenedor de C1-C6)

Receta de tarjeta viva del panel — **copiada, no nueva** [REPO: PANEL:334 fila 4 de la
tabla §13; ESTADO:75 «tarjetas con degradado interno y filete marrón arriba»]: superficie
blanca con degradado interno (`color-mix` de `#F0D8BD` al 24 % hacia `#FFFFFF`) o
`#FFFFFF` plena [PROP: plena por densidad de lectura; degradado si el Operador pide
paridad exacta con B2] + borde 1 px `#D9C0A0` + filete superior 3 px `#8A6F55` +
`p-6` 24 + radio del sistema
(`sin dato` en el repo documentado PANEL:126 — no se inventa). Cero `box-shadow` [REPO
ESTADO:75: «Cero `box-shadow` en todo el panel»; presupuesto de sombra de la sección = 0].

### 5.3 C3 — «Así la ve tu cliente» (preview + botón)

- Bloque: `h2` + réplica **informativa** del paso 1: pregunta P1 literal + fila de fichas
  0–10 en reposo + etiqueta «Así se ve el paso 1» (13 px `#5A5555`); le sigue mini-fila 1–5
  marcada «P2 · 1–5» solo si entra en el alto [PROP: en 375 solo P1, el resto vive en `/e/[code]`].
- Fichas = `div` con `aria-hidden="true"`; el contenido accesible es la pregunta en texto +
  línea espejo: «Escala 0 a 10, once opciones, sin selección previa» (sr-only o visible 13 px).
- Botón primario **«Ver encuesta completa»**: patrón vivo del panel/encuesta [REPO
  PROPUESTA:482 → `survey-card.tsx:117`; `globals.css:13-14`]: fondo `surface-dark`
  `#1A181B`, texto `on-dark` `#F7E5C8`, `rounded-none` (precedente CTA GUIA:116), h 44,
  transición 150 ms solo color [REPO PROPUESTA:483], foco 3 px tinta offset −3. Al pulsar:
  `router.push` local al demo `/e/[code]` con el código de demostración (§5.6). Navegación
  real, **no** resolución de QR [REPO: PROPUESTA:260-262; la ruta existe como marcador:
  `scansaydone-front/src/app/(survey)/e/[code]/page.tsx:1-3`].
- Deber no: no se preilumina ningún valor (la corrección PROPUESTA:333-338 aplica al glifo);
  no se muestra la pantalla final de la demo dentro del panel; no se dibuja paso 2/3.

### 5.4 C1 — tabla del catálogo (read-only) + acción Editar

Columnas [PROP, fijadas por encargo]: **# | Pregunta | Escala | Obligatoria | Etiqueta**.
Filas = catálogo exacto [REPO], copiado byte a byte (fuente comentada en código al
implementar, regla PROPUESTA:605-608):

| # | Pregunta (literal [REPO]) | Escala | Obligatoria | Etiqueta |
|---|---|---|---|---|
| P1 | «¿Qué tan probable es que recomiendes el negocio a un amigo o familiar?» | 0–10 · 11 valores | Sí | — |
| P2 | «En general, ¿qué tan satisfecho/a quedaste?» | 1–5 | Sí | — |
| P3 | «¿Cómo calificas el sabor y la calidad de lo que consumiste?» | 1–5 | Sí | «Calidad del producto» |
| P4 | «¿Qué tan conforme quedaste con el tiempo que tardó en llegar tu pedido?» | 1–5 | Sí | «Tiempo de servicio» |
| P5 | «¿Qué podríamos hacer para que tu próxima visita sea mejor?» | Texto · máx. 300 | No · opcional | — |

Fuentes [REPO]: `catalogo.py:9,10,27,28,29` (textos; P1/P2 comunes, P3-P5 rubro 2) ·
`catalogo.py:25-26` (etiquetas p3/p4) · `schemas.py:22-28` (bounds `ge=0 le=10`,
`ge=1 le=5`, `max_length=300` nullable) · `schemas.py:7` (300) · `schemas.py:37`
(vacío→NULL, base de «No · opcional») · `empresas.py:42-43` (la API expone `etiqueta` en
P3/P4 → columna existe en el contrato de datos; en P1/P2/P5 el backend no define etiqueta
→ `—`, **no se inventa**).

- Cabecera de tabla: th bg `color-mix(in srgb, #F0D8BD 40%, #FFFFFF)` + tinta 13 700
  versalitas `ls .06em`; zebra `color-mix(in srgb, #F7E5C8 35%, #FFFFFF)`; separadores 1 px
  `#D9C0A0` — todo copiado del patrón B5 [REPO: PANEL:338]. Cero hex nuevo: mixes entre
  tokens existentes [REPO: ESTADO:89].
- `Editar` (Q9): opción A = botón deshabilitado §5.9 en el `h2`-row derecha + ayuda bajo la
  tabla. Opción B = botón activo (mismo patrón primario oscuro) que abre el editor §6.4.
- Deber no: los nombres internos `p1_nps`, `p2_csat`… **jamás visibles** [REPO:
  PROPUESTA:276-278; jerga CANON:79-81]; la columna «Etiqueta» se rotula en el caption como
  dato interno: «Etiqueta del atributo en el sistema (el cliente no la ve)».

### 5.5 C2 — tarjeta «Estado de la encuesta» con switch (Q8)

- **Opción A (recomendada en PROPUESTA:437):** valor «—» + botón/switch inerte con receta
  §5.9 + ayuda bajo: «Activar o pausar la encuesta no está disponible en la demo.» y línea
  de estado: «El estado real no se puede verificar aquí.»
- **Opción B:** `<button role="switch" aria-checked={on}>` reutilizando la receta [REPO
  viva: `GUIA:170` — «`ToggleSwitch` real (`role="switch"`, `aria-checked`)» construido en
  `panel/page.tsx:22-53`; geometría pista 44×24, perilla por posición, hit 44 — PANEL:289].
  Estado leído **solo por texto**: junto a la pista, palabra «Activa» o «Pausada» (Montserrat
  600 14 `#1A181B`); pista on/off jamás única señal [REPO: CANON:49]. Debajo, aviso
  permanente (no dismissible, no aparece solo al pulsar): texto literal [REPO-PROP:
  PROPUESTA:437] «Cambio solo visual de la demo: no se guarda y no afecta el enlace que ve
  el cliente.» Al conmutar, `role="status"` (sr-only) anuncia «Estado visual: Activa.» —
  nunca «Guardado».
- Deber no: prohibido derivar el estado del switch hacia `/e/[code]` (el enlace no cambia —
  no puede cambiar, no hay persistencia); prohibido icono de check/toast; cero coral (§2.4).

### 5.6 C5 — identidad / código de demostración (Q4/Q6)

- Bloque: `h2` «Identidad y enlace de demostración» [PROP]; cuerpo 2 líneas literales
  heredadas [REPO-PROP: PROPUESTA:226,439 y §8:528-530]: «Negocio de ejemplo — demo, sin
  identidad real» · «Código de demostración: {code} — no corresponde a ninguna empresa
  real». `{code}` se imprime **tal cual la URL de la demo**; el plano no fija el valor
  (Q4); cero nombre, cero ciudad, cero logo de negocio inventado [REPO: CANON:67-69].
- Tipografía: cuerpo Montserrat 14/15; código en `font-mono`? **No** — sin token mono en
  `@theme` [REPO: globals.css:5-46 no declara mono propio]; va en Montserrat 500 `#1A181B`
  con comillas tipográficas; nada nuevo.
- Deber no: no se muestra URL «compartible» con botón copiar que simule funcionalidad de
  producción (copiar un placeholder es una afección falsa — régimen PANEL:130 con C3:235);
  si el Operador exige copiar, entra como control deshabilitado con ayuda.

### 5.7 C6 — respuestas (Q10)

- **Defecto (A):** `h2` «Respuestas» + bloque vacío centrado: em dash tipográfico «—» (Bebas
  40, `#5A5555` — precedentes [REPO]: PANEL:162 «Medidas en «—»»; «Sin datos todavía»), línea
  «Sin datos todavía.» (Montserrat 600 16) y helper «Aún no hay respuestas. Cuando alguien
  responda tu QR, aparecerán aquí.» (literal vivo PANEL:162, reutilizado por
  PROPUESTA:440). Cero gráficos con ceros [REPO: PANEL:162].
- **Opción B (dataset):** **no se crea dataset nuevo** [REPO: GUIA:110 «no crees otro
  dataset»; GUIA:202 «No introduces un segundo panel-data»]. Si Q10=B, la sección renderiza
  las 5 filas existentes `lastResponses` de `panel-data.ts` [REPO: GUIA:194
  (`:69-111`)] con su contrato D4 intacto (≤72 car, ≥2 críticas, 1 sin texto — GUIA:203),
  dentro del bloque con: badge `DATOS DE EJEMPLO` (§5.8) **sobre la propia tarjeta** + fila
  de disclaimer (§5.8) + encabezado de tabla espejo Nota/Texto/Canal. Nada de métricas: sin
  media, sin conteos agregados sobre `lastResponses` — cualquier cifra derivada violaría
  CANON:67 sobre un subconjunto [D: 5 filas ≠ distribución].
- Deber no: en ambos estados, **nunca** atribuir el contenido a «tu negocio»: el dataset
  declara «No pertenece a ningún negocio real» [REPO: PANEL:128] — el copy de la sección lo
  repite (§8.4); prohibido «recientes» como reclamo de tiempo [REPO: CANON:79-80 «tiempo
  real» vetado; PROPUESTA:77 rechaza «en tiempo real» del mock].

### 5.8 Badge `DATOS DE EJEMPLO` + fila disclaimer

- Badge: receta del chip DEMO del panel [REPO: PANEL:126 — Montserrat 700 12 mayúsculas,
  texto `#1A181B`, fondo `#F0D8BD`, borde 1 px `#8A6F55`, radio del sistema] con texto
  **DATOS DE EJEMPLO** (en el panel la banda se dice así, no «DEMO a secas» [REPO-PROP:
  PROPUESTA:420-422 citando `UX-SPEC-2026-11-05.md:351`]; el chip de shell `DEMO` del
  topbar/H1 [REPO: GUIA:171] **no se toca** — capas distintas). Badge ≠ interacción:
  `aria-hidden="false"`, sin focus.
- Fila disclaimer (solo estados con dataset, §5.7-B): banda bajo el `h2`, fondo
  `#F0D8BD`, borde 1 px `#8A6F55` (receta banner PANEL:163), texto 14 `#1A181B`:
  «Estas filas son los datos de ejemplo del panel de demostración. No son respuestas de tu
  encuesta ni de ningún negocio real.» [PROP — firma G4; construida con los literales de
  PANEL:128 + GUIA:200].
- Las tres capas de PANEL:124-128 (badge + línea + pie) se conservan en esta pantalla
  adaptadas: badge `DATOS DE EJEMPLO` (capa 1), línea bajo el H1 (§8.2, capa 2), pie
  literal B7 (capa 3, intacto).

### 5.9 Patrón de acción deshabilitada (el mismo en toda la sección)

[REPO: PANEL:130-136] `<button aria-disabled="true">` · foco permitido · acción nula ·
`cursor: not-allowed` · texto `#5A5555` · borde 1 px `#D9C0A0` · fondo `#FFFFFF` (o
`#F0D8BD` si está sobre tarjeta elevada — nunca texto sobre `#D9C0A0`: PANEL:130) · **ayuda
inline visible obligatoria** bajo el control, en 13/14 px `#5A5555`, nombrando la
capacidad y la causa demo. El `title` duplica la ayuda (táctil/rate-limited no pasa por
hover). Prohibido: «próximamente», «en construcción» [REPO: CANON:79-80], y prohibido que
un deshabilitado se aclare/confunda con hover activo.

---

## 6. Estados y frontera honesta por capacidad

### 6.1 Estados de la sección (régimen local: sin red, sin API)

| Estado | ¿Existe en la maqueta? | Qué se ve / regla |
|---|---|---|
| **Loading** | **No — prohibido simularlo** | Sin fetch no hay spinner honesto [REPO: PROPUESTA:404 «un spinner falso sería mentira de estado»]. La receta del panel real (skeletons `#F0D8BD`+borde, pulso 800 ms, `prefers-reduced-motion`, `role="status"` «Cargando…», PANEL:161) queda **documentada para la etapa de integración**, no se construye hoy. |
| **Empty** | Sí, es el defecto de C6 y del valor en C2-A | «—» + «Sin datos todavía.» + helper QR (§5.7). Em dash = confiesa ausencia, «0» mentiría [REPO: PANEL:162]. |
| **Error** | **No puede ocurrir** (sin fetch) y está prohibido fingirlo | Si integración futura: receta tarjeta única + «Reintentar» con slot coral [REPO: PANEL:164], solo cuando exista red real (PAUTA:220). |
| **Success / «guardado»** | **Nunca, en ninguna opción** | [REPO: CANON:82 «Ningún estado de éxito sin acción real»; ESTADO:77 «Ningún botón aparenta guardar»; PANEL/PROPUESTA:76 rechaza «guardado con éxito» del mock]. Lo máximo admisible: cambio visual local con la palabra «visual», §5.5-B. |

### 6.2 Cota por capacidad — qué PUEDE mostrar la UI vs QUÉ NO PUEDE

| # | Puede (UI local honesta) | No puede (bloqueante) |
|---|---|---|
| C1 | Tabla literal del catálogo §5.4 + badge/caption de demo | Editar sin Q9-B; citar campo interno (`p1_nps`); afirmar «esta es la encuesta **de tu negocio**» (no hay empresa — PAUTA:143-144 `sin_evidencia` de selección de tenant) |
| C2 | Glifo P1+escala en reposo; botón real → `/e/[code]` demo | Mostrar paso 2/3/terminal; simular respuesta; presentar el preview como «así lo ven 200 clientes»; cualquier QR |
| C3-A | Switch inerte + ayuda; valor «—» | Estado coloreado único; «activada» |
| C3-B | Toggle local + palabra Activa/Pausada + aviso permanente + `role="status"` | Persistir; reflejar el cambio en `/e/[code]`; toast/check; coral (§2.4) |
| C4-A | «Editar» deshabilitado + ayuda | Cuadro de texto habilitado |
| C4-B | Editor en memoria con **aviso antes de los campos** [REPO regla CANON:82: «Si el envío no existe, se dice antes de los campos»]: «Los cambios solo viven en esta visita del navegador. Al recargar vuelve el catálogo de la demo. No se guarda nada.»; botón «Restaurar textos» (in-memory) | Salvar a ningún almacenamiento; mostrar «guardado»; editar y que `/e/[code]` siga el cambio (la demo del cliente tiene su propia copia local — Q9-B exige declarar que son dos memorias distintas **o** compartir un único estado React local [PROP: compartir estado si ambas vistas viven en la misma sesión de navegación; el plano lo deja a implementación con firma]); tocar `catalogo.py` [REPO: CANON:16 «No se toca»] |
| C5 | Las dos líneas literales de placeholder + `{code}` crudo | Nombre/logo/ciudad/token inventado; id numérico como si fuera código público [REPO: PROPUESTA:533-535 — contradice D-6] |
| C6-A | Bloque vacío §5.7 | Cualquier número |
| C6-B | 5 filas `lastResponses` + badge + disclaimer | Segundo dataset [REPO: GUIA:110,202]; agregados; atribución a «tu encuesta»; foto/avatar; «respondida hace X» dinámico — la antigüedad es fija por dataset [REPO: PANEL:319 «nunca `Date.now()`»] |

### 6.3 Transparencia de duplicación con PROPUESTA

§6.6 de PROPUESTA (428-442) define las capacidades; **este plano no repite su motivación**:
fija anatomía, px, copias, semántica ARIA y gates. En caso de contradicción de números,
manda este plano para la superficie de gestión (es su conversión construible); en caso de
contradicción de *hechos del repo*, manda el repo (ambos citan las mismas líneas).

---

## 7. Accesibilidad

- **Landmarks:** hereda el shell [REPO: PANEL:184; GUIA:161]: `aside`+`nav
  aria-label="Panel"` (sidebar), `nav aria-label="Panel"` en tramo móvil, `main
  id="panel-main"`. La sección no define nuevos landmarks.
- **Encabezados:** `h1` «Encuesta de tu negocio» (o `h2` si Opción B, §5.1) → `h2` por
  tarjeta (C3→C1→C2→C5→C6 en DOM = orden visual = orden de foco [REPO: PANEL:184]) → `h3`
  solo dentro de C1 si el editor (Q9-B) sube bloques. Cero saltos de nivel.
- **Semántica del switch (Q8-B):** `<button role="switch" aria-checked>`; label visible
  asociado (no `aria-label` huérfano); teclado: Espacio/Enter conmutan [REPO: PANEL:289];
  foco 3 px offset −3. Deshabilitado (A): `aria-disabled="true"`, foco permitido,
  `aria-describedby` apunta la ayuda visible. El estado va **siempre** en texto adyacente
  [REPO: CANON:49].
- **Semántica de tabla:** `table` + `caption` id → `aria-labelledby` del wrapper de scroll
  (§4.4); `th scope="col"` ×5, `th scope="row"` (P1…P5) con texto sr-only «Pregunta 1 de 5»
  [PROP]; `tabular-nums` en escala/oblig. Glifo de fichas: `aria-hidden="true"` + línea
  espejo en texto (§5.3) — la alternativa textual de cada gráfico, regla PANEL:186.
- **Orden de foco:** badge (no focusable) → «Ver encuesta completa» → ayuda/tabla → botón
  Editar → switch → restaurar (si B) → campos (si B) → nada en C6 → fin. Los deshabilitados
  focusables quedan en su posición visual (lector los descubre, PANEL:192).
- **aria-live:** una sola región `role="status"` (sr-only) para conmutaciones (switch B y
  «restaurar textos»); **no** se anuncia el helper permanente en cada toggle; nada de live
  para hover. Los cambios de contenido por Q9-B se anuncian con `role="status"`: «Texto de
  P3 modificado solo en esta visita.» — sin verbo guardar.
- **Contraste [D heredidos, re-medir axe]:** tinta/blanco 17,5 · tinta/página 14,2 ·
  apoyo/blanco 7,3 · apoyo/elevada 5,3 · mid/blanco 4,7 [REPO cifras: PANEL:191]. Nuevas
  parejas de esta sección: apoyo/`color-mix` zebra ≈6,8 y tinta/head40 ≈15,6 [D,
  transplantadas de PANEL:338]; mid sobre elevada 3,40 solo borde decorativo (el dato va en
  texto) [D, PANEL:339]. Coral: 0 ocurrencias previstas (§2.4) — si G2 se firma distinto,
  solo objeto gráfico ≥3:1, jamás texto [REPO: PANEL:191].
- **Targets:** nav 44 · botones h44 (ancho ≥44 o texto pleno) · switch hit 44 · filas de
  tabla 44 [REPO: PANEL:178; GUIA:159]. Táctil 375: nada bajo 44 interactivo.
- **Idioma y números:** `lang="es"` [REPO: PANEL:194]; decimales con coma; rangos con guion
  corto «0–10» igual que `catalogo.py`/PROPUESTA §5.
- **Reduced motion:** 150 ms solo color/background; sin translate [REPO: PANEL:340 fila 10];
  cero animación nueva en la sección.

---

## 8. Copia exacta (literales) + check de términos vetados

### 8.1 Etiquetas de bloque

| Elemento | Literal [PROP salvo marca] |
|---|---|
| Ítem nav (A) / H1 | «Encuesta» / «Encuesta de tu negocio» (último [REPO-PROP: PROPUESTA:224]) |
| h2 preview | «Así la ve tu cliente» [REPO-PROP: PROPUESTA:228] |
| h2 catálogo | «Tus preguntas» + caption: «Preguntas de la encuesta de ejemplo — catálogo del sistema, solo lectura» |
| h2 estado | «Estado de la encuesta» [REPO-PROP: PROPUESTA:245] |
| h2 identidad | «Identidad y enlace de demostración» |
| h2 respuestas | «Respuestas» [REPO-PROP: PROPUESTA:249] |
| Botón preview | «Ver encuesta completa» [REPO-PROP: PROPUESTA:235] |
| Botón edición | «Editar» / «Restaurar textos de la demo» |
| Badge | «DATOS DE EJEMPLO» [REPO-PROP: UX-SPEC:351 vía PROPUESTA:420-422] |

Tuteo con dueños: «tu cliente», «tus preguntas», «tu QR» [REPO: CANON:79].

### 8.2 Líneas de declaración y ayuda (una sola versión por string, sinónimos prohibidos)

- Línea bajo H1 (capa 2): «Ves la sección de encuesta del panel de ejemplo. No hay
  encuesta real, enlace ni respuestas detrás.» [PROP — G4]
- Ayuda C2-A: «Activar o pausar la encuesta no está disponible en la demo.»
- Estado C2-A: «—» + «El estado real no se puede verificar aquí.»
- Ayuda C4-A (literal [REPO-PROP: PROPUESTA:438]): «Editar no está disponible en la demo.»
- Aviso C4-B (ante campos, CANON:82): «Los cambios solo viven en esta visita del navegador.
  Al recargar vuelve el catálogo de la demo. No se guarda nada.»
- Aviso switch C3-B (literal [REPO-PROP: PROPUESTA:437]): «Cambio solo visual de la demo:
  no se guarda y no afecta el enlace que ve el cliente.»
- Placeholder identidad: «Negocio de ejemplo — demo, sin identidad real» ·
  «Código de demostración: {code} — no corresponde a ninguna empresa real» [REPO-PROP:
  PROPUESTA:226, 528-530]
- Vacío C6: «Sin datos todavía.» · helper literal [REPO: PANEL:162]: «Aún no hay respuestas.
  Cuando alguien responda tu QR, aparecerán aquí.»
- Disclaimer dataset C6-B: «Estas filas son los datos de ejemplo del panel de demostración.
  No son respuestas de tu encuesta ni de ningún negocio real.» [PROP — G4]
- Pie capa 3 (literal **intacto** [REPO: PANEL:128]): «Panel de ejemplo con datos
  inventados. No pertenece a ningún negocio real.»
- Pie sidebar (intacto [REPO: GUIA:166]): «Sesión de demostración. No hay cuenta real
  detrás.»

### 8.3 Escala/obligación en tabla

Celdas escala: «0–10 · 11 valores» · «1–5» · «Texto · máx. 300». Obligatoria: «Sí» /
«No · opcional». Etiqueta: «Calidad del producto» · «Tiempo de servicio» · «—».
[REPO: catalogo.py:25-26; schemas.py:22-28,7,37 — ningún string inventado].

### 8.4 Check de términos vetados (lista binaria para F5)

Prohibido en **texto visible** de la sección (fuente [REPO]: CANON:79-80 + PANEL:138):
«próximamente» · «en construcción» · «dashboard» · «KPI» · «score» · «CSAT» · «NPS» ·
«insights» · «tiempo real» / «en tiempo real» · «guardado» / «guardado con éxito» ·
«respondida hace …» con fecha dinámica · cualquier `p1_nps`-style interno · «tu encuesta
está activa» en indicativo · cero «DEMO a secas» como banda de la sección (va «DATOS DE
EJEMPLO»; el chip de shell queda donde ya vive). La sección se audita con grep sobre las
copias de §8: **0 ocurrencias = pasa**; cualquier ocurrencia = P0.

---

## 9. Tokens y mapa de reutilización

**Cero tokens nuevos, cero colores nuevos, cero fuentes nuevas, cero dependencias, cero
iconos nuevos** [REPO: PROPUESTA:464-468; PANEL:225-226; iconos: set cerrado y D7
rechazado, PANEL:255,304-307 — la sección no pide geometría nueva: cero iconos]. Tokens por
nombre [REPO: globals.css:5-21,24-29]: `--color-background-page #F7E5C8` ·
`--color-surface-default #FFFFFF` · `--color-surface-elevated #F0D8BD` ·
`--color-interactive-primary #FC5A41` (uso en esta sección: **0**, §2.4) ·
`--color-text-primary #1A181B` · `--color-text-secondary #5A5555` ·
`--color-surface-dark #1A181B` + `--color-on-dark #F7E5C8` (botón primario) ·
`--color-border-mid #8A6F55` · `--color-border-subtle #D9C0A0` ·
foco 3 px offset −3 tinta [REPO: ESTADO:86; C-48 ESTADO:132] ·
`--font-ui` Montserrat · `--font-display` Bebas ≥32 [REPO: globals.css:45-46; CANON:55].

| Pieza de esta spec | Se reutiliza de (no se re-escribe) | Qué hace falta nuevo |
|---|---|---|
| Shell completo (sidebar/topbar/fila nav/footer) | `layout.tsx` construido [REPO: GUIA:154-166] | solo entrada del nav si Q7=A → toca el array: **cambio en área construida, §1.2** |
| Tarjeta + filete + borde | receta PANEL:334 fila 4 / ESTADO:75 | nada (elección plena-vs-degradado = [PROP] §5.2) |
| Chip/badge demo | PANEL:126 (texto: «DATOS DE EJEMPLO» vía UX-SPEC:351) | una fila de texto, cero estilo |
| Zebra + th + fila 44 de tabla | PANEL:338 (B5) | nada |
| Banner de disclaimer | PANEL:163 (banner sin conexión: misma piel) | nada |
| Switch | `ToggleSwitch` construido [REPO: GUIA:170; PANEL:289 receta] | nada (mismo componente, otro estado semántico) |
| Botón primario oscuro | `survey-card.tsx:117` vía PROPUESTA:482 · `rounded-none` CTA GUIA:116 | nada |
| Glifo 0–10 / 1–5 | morfología 6+5 PROPUESTA §5.1 (`survey-card.tsx:84,101` vía su cita) | variante read-only `aria-hidden` (§5.3) |
| Vaca de acciones deshabilitadas | PANEL:130-136 | nada |
| Vacío «—» / «Sin datos todavía» | PANEL:162 | nada |
| Datos C6-B | `panel-data.ts lastResponses (:69-111)` [REPO: GUIA:194] | **ningún dataset nuevo** (GUIA:110,202) |
| Textos C1 | `catalogo.py:9,10,27-29` + `catalogo.py:25-26` copiado con comentario de fuente | nada del backend se mueve [REPO: CANON:16] |

Presupuestos cerrados de la sección: sombras **0** · corales visibles **0** [PROP-G2] ·
datasets de demo **1** (el existente) · dependencias nuevas **0** · tokens nuevos **0** ·
iconos nuevos **0** · rutas verificadas enlazadas **1** (`/e/[code]` existe como marcador
[REPO]; ninguna otra ruta se enlaza; `/` en «Volver al inicio» condicionado a su existencia
permanece [REPO: PANEL:153]).

---

## 10. Checklist de aceptación + decisiones abiertas

### 10.1 Criterios binarios (audita reviewer F; cero PASS en este plano)

1. La sección no renderiza fetch alguno; grep de `fetch(`/`axios`/`supabase` en su código
   nuevo: 0.
2. Cero `href` a rutas no verificadas: el ítem «Encuesta» inerte usa `role="link"
   aria-disabled` (sin href); el activo solo existe si `/panel/encuesta` está construido.
3. Textos de P1–P5 en la tabla = idénticos byte a byte a `catalogo.py:9,10,27-29`; las
   etiquetas = `catalogo.py:25-26`; el 300 = `schemas.py:7`; ninguna etiqueta en P1/P2/P5.
4. Campos internos (`p1_nps`…) no aparecen en ningún string visible.
5. `box-shadow` en la sección: 0 · tokens nuevos: 0 · hex nuevos fuera de `color-mix` de
   tokens: 0 · dependencias nuevas: 0 · iconos nuevos: 0.
6. Coral visible en la sección: 0 (si G2=A) — auditoría por captura axe+viewport.
7. Bebas: solo H1 (40/32); 0 ocurrencias fuera de titulares ≥32 [REPO criterio PANEL:224].
8. Interactivos: todos ≥44×44 de hit (nav, botones, switch); glifo `aria-hidden` no cuenta.
9. Switch B: `role="switch" aria-checked` + palabra «Activa/Pausada» visible (no color
   único) + aviso permanente con el literal de PROPUESTA:437 + `role="status"` que **nunca**
   dice «guardado».
10. Editor B: aviso visible **antes** de los campos (CANON:82); «Restaurar» funciona en
    memoria; recarga devuelve catálogo; `/e/[code]` no muta estado persistido (no existe).
11. C6: defecto = «—» + «Sin datos todavía.» + helper PANEL:162 literal; si Q10=B: filas
    salen de `panel-data.ts`, cero dataset nuevo, disclaimer presente, cero agregados.
12. Estados: no hay spinner de carga simulado ni tarjeta de error simulada; success: 0.
13. Tres capas de declaración presentes en la pantalla (badge, línea, pie literal) + pie
    sidebar intacto.
14. Cero QR dibujado o simulado en cualquier tramo.
15. Terms grep (§8.4): 0 ocurrencias visibles.
16. Tabla con `caption` + `th scope` (col y row); wrapper scroll-x con `role="region"` +
    `tabindex="0"` + `aria-labelledby`; orden de foco = orden visual.
17. axe critical/serious = 0 en `/panel` y en la sección; Lighthouse a11y ≥95; captura de
    viewport 1440/992/768/375 [REPO gates: CANON:96-105; PANEL:204] — sin salida pegada no
    hay PASS.
18. Matemática §4 respetada en el render (1056 máx · 944 · 720 · 343; p24; gap 24/16;
    min tabla 640; fichas 6+5 gap 6 en 375).

### 10.2 Decisiones abiertas (tabla para respuesta del Operador)

| # | Pregunta | Opciones | Respuesta |
|---|---|---|---|
| **Q7–Q11** | **se responden en PROPUESTA §9** (ubicación/nombre de la sección, switch, editor, respuestas, vuelta) — este plano no duplica las preguntas; fija las consecuencias de cada respuesta | ver PROPUESTA:559-563 | |
| **G1** | Si Q7=A: la sección es ruta nueva (Opción A §2.1). Si Q7 se resuelve «otra ubicación»: Opción B §2.2 con H2 bajo el H1 de Resumen. ¿Confirmar lectura? | A · B | |
| **G2** | Presupuesto coral de la sección: 0 (recomendado, §2.4) | A 0 · B permitir 1 (reasigna argumento PANEL:55) | |
| **G3** | Tabla del catálogo en móvil: scroll-x con min 640 (recomendado, §4.4) vs apilado `dl` | A · B | |
| **G4** | Literales nuevos de §8.2 (línea bajo H1 adaptada, disclaimer dataset, avisos editor) — son copias [PROP] construidas sobre literales vivos | A firma · B edita | |
| **G5** | Q8/Q9 en opción B implica dos memorias locales distintas (§6.2-C4): ¿compartir un único estado React entre sección y demo de la sesión de navegación, o mantenerlas declaradas como independientes? | A compartir (mismo árbol de sesión) · B independientes · C no construir B | |
| **F-O1 heredado** | El shell (sidebar 240) sigue pendiente de firma (CANON:127-128 pend.4; PANEL:210). Esta sección **no** la sustituye | — | |
| **Gate activo** | C4/C3 en cualquier opción llevan marca `sin_evidencia` (ausentes de acta; PAUTA §7/§12) — el Operador confirma alcance tras #14/#17 | — | |

**Qué necesita firma antes de cualquier implementación:** Q7 (abre o no la superficie),
G1-G5, y la lectura del Operador de que **esta sección es maqueta**: no toca `catalogo.py`,
no consume `empresas.py`, no define el contrato que PAUTA:220 protege, no resuelve tenant
ni auth (PAUTA:143-144). Nada de lo aquí propuesto afirma que el envío, la activación o el
enlace existan.

---

## 11. Referencias

| Hecho | Fuente |
|---|---|
| P1–P5 literales rubro 2 | `scansaydone-back/scansaydone/catalogo.py:9,10,27-29`; etiquetas `:25-26` |
| Bounds 0–10 / 1–5 / 300 / vacío→NULL | `schemas.py:22-28,7,37` |
| API expone `etiqueta` P3/P4 (forma del futuro contrato, no usado hoy) | `routers/empresas.py:39-45` |
| Shell: 240/56/44/1056 · cutoff `min-[993px]` · ítems `role="link" aria-disabled` sin href · footer demo · ToggleSwitch vivo · chip DEMO · cero sombra verificada · coral único B3 | `GUIA:158-166,170-171`; `PANEL:31-33,35,126,144-151,160-163,171`; `ESTADO:73-75,87` |
| Foco 3px −3 tinta · targets 44 · estados/empty «—» | `PANEL:130-136,161-164,184-194,289`; `ESTADO:86`; `C-48 ESTADO:132` |
| Breakpoints y tokens | `scansaydone-front/src/app/globals.css:3-29,44-46` |
| Tres capas DEMO + pie literal | `PANEL:124-128` |
| Prohibiciones: cifras/testimonios/QR/success/jerga | `CANON:67-69,79-82`; `ESTADO:77` |
| Cero segundo dataset · `lastResponses` existente con contrato D4 | `GUIA:110,194,200-203` |
| Capacidades §6.6 · Q7-Q11 · frontera maqueta/_backend | `PROPUESTA:428-459,559-563` |
| Gates de reunión: tenant/auth abierto · sin integración API/UI pre-#14 | `PAUTA:143-144,220` |
| Marcador `/e/[code]` actual | `src/app/(survey)/e/[code]/page.tsx:1-3` (vía `PROPUESTA:514`) |

*Fin — BORRADOR. Ningún archivo de código, configuración o test fue modificado para
producir este documento. Registrado en `docs/frontend/INDEX.md` como **BORRADOR**;
no es contrato hasta la firma del operador.
Cero PASS declarados: este plano no ejecutó herramientas de build/lint/axe/Playwright.*
