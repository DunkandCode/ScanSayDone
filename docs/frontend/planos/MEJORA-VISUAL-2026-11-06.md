---
fecha: 2026-11-06
autor: designer-alibaba
tipo: plano de mejora (decisión antes de código)
ruta canónica: docs/frontend/planos/MEJORA-VISUAL-2026-11-06.md
compañero de numeración: conflictos C-1…C-67 servidos por L1–L6 y NAVBAR-Y-FOOTER; **este plano abre C-68…C-75 y cierra C-67 y B-4 como propuesta del designer**
---

# MEJORA-VISUAL — 2026-11-06

> Contrasta la guía de rediseño y la maqueta entregadas por el operador con el landing servido, y decide qué entra, qué no y con qué reglas. **No toca código. No abre la PNG (el análisis del mockup lo proveyó el orquestador con visión).** Este plano es la revisión previa que el operador pidió antes de implementar.

## 0. Fuentes y etiquetas

| Etiqueta | Significa |
|---|---|
| `[P mockup]` | análisis del mockup extraído por el orquestador con visión, 2026-11-06 (fuente citada en el encargo; la imagen es maqueta de dirección de arte, no captura funcional — `features/SCAN_SAY_DONE_GUIA_DISENO_LANDING.md` l.10) |
| `[P guía]` | `docs/frontend/features/SCAN_SAY_DONE_GUIA_DISENO_LANDING.md` |
| `[canon]` | `docs/frontend/CANON.md` |
| `[servido]` | código en `scansaydone-front/src/components/{marketing,chrome}/`, leído esta sesión |
| `[firma]` | `docs/frontend/ESTADO-2026-11-06.md` §1 |
| `[P]` / `[propuesta]` | cota documentada / decisión nueva de este plano |

**Regla de orden (la del propio CANON):** si algo choca con el canon, este plano **no** lo reescribe a su antojo: registra la decisión nueva **con fecha** y su firma de operador cuando la pieza reabre algo firmado (C-19, C-49). Las firmas intactas mandan hasta que el operador firme lo contrario.

## 1. Qué es esta propuesta

### 1.1 Qué NO cambia (línea dura, orden literal del operador 2026-11-06)

1. **Tipografías.** Bebas Neue solo títulos ≥32 px mayúsculas; Montserrat en todo lo demás; cero tercera familia. Se **rechazan** Plus Jakarta Sans / Manrope / Inter que propone `[P guía §2.3]`: el operador cerró la tipografía y la guía misma dice (§2.3, última bala) que la marca conservable es la existente.
2. **Paleta.** Los 6 tokens + los 10 roles servidos de `globals.css` (5–21). **La paleta de la guía NO se adopta**: `#191715`, `#F05238`, `#F9E7CF`, `#FFF9F3`, `#E7D8CB`, `#FFE0D4`, `#16854C`, `#D88725` son otros hexes que no son los nuestros. **Cero hex nuevo.** Todo lo que en la guía usa esos valores se traduce a tokens servidos o se rechaza.
3. **Cotas medidas que no se reabren:** bandas 3/4/5 en container 1140 con x=150; banda 6 en 1320 desde 1400; banda 8 en 960 con columna 632; pie 4×267; barra 76 px con `main pt 76`; los tres ejes de inicio (C-26 firmado). **Se rechazan** los 1200–1240 px de `[P guía §2.4]` y su grid de 12 con márgenes 32–48.
4. **Reglas duras vigentes:** un solo CTA coral visible por pantalla; el coral nunca es texto sobre claro; elevación por borde y color, no sombra (se rechazan `--shadow-card` y "sombras muy discretas" de `[P guía §2.4/§6.2]`); estados nunca solo por color; separación por borde; anillo firmado 3 px `text-primary` offset −3 (C-48 `[firma]`); toda ilustración o dato de ejemplo se declara; no se enlazan destinos vacíos.
5. **Stack.** `[P guía §6]` propone **Bootstrap 5, Lucide, Recharts/Chart.js, react-icons implícito**: los cuatro se **rechazan** — CANON §2 los prohíbe (Bootstrap, librerías de gráficos; dependencias que dupliquen, AGENTS §2 del ecosistema). El landing no cambia de stack. `[P guía §2.4]` propone radios 16–24: se porta el radio servido 8 px (G-7/C-12 sigue sin reabrir).
6. **Forma de trabajo:** cotas medidas, criterios binarios (§10), honestidad de estados, nada inventado, planos antes de código, gates con salida real.

### 1.2 Qué SÍ cambia (el encargo del operador)

| # | Pieza | Cambio |
|---|---|---|
| 1 | Wordmark | texto plano mayúsculas con tracking amplio (motivo §3) |
| 2 | Iconos | set propio de la casa, SVG inline, formalizado y usado en banda 3 (motivo §4; cierra B-4) |
| 3 | Banda 5 | marcos vacíos → 3 ilustraciones generadas con wan-image, declaradas (motivo §5) |
| 4 | Banda 6 | marco vacío → panel de ejemplo en HTML/CSS con cifras etiquetadas (motivo §6; **tanda 2, requiere firma que reabre C-19**) |
| 5 | C-67 | barra CTA → solo texto (respaldo §A.4 O2 preautorizado) + unificación de anillo (motivo §7) |
| 6 | Efectos | recomendación: **ninguna librería en tanda 1**; dos caminos documentados (motivo §8) |

### 1.3 Corrección de premisa (importante, va en honesto)

El encargo dice que "CANON §6 prohíbe usar imágenes generadas como assets y exige foto real entregada". **No es exacto:** CANON §6 orden 2 dice "**Ilustración propia generada o dibujada, declarada como ilustración**". Lo rechazado (orden 3, tachado) es la *decoración abstracta generada* — los bucles sobre crema del brief hero, sin información. Las tres imágenes de banda 5 muestran el contexto nombrado de cada placa (mesa, barra, mostrador): **son ilustración informativa declarada, caben en el canon vigente sin enmendarlo**. Lo que sí prohibía L5 eran "escenas decorativas generadas" citando ese paso 3; con esta lectura, no hay conflicto de canon, hay aplicación correcta del orden 2. La L5-lista (prohibiciones del plano L5 §2.30) **sí** se actualiza por decisión con fecha: esta (§5), y necesita firma del operador porque cambia el as-built de una banda publicada.

## 2. Contraste mockup vs construido, pieza por pieza

Fuente mockup: `[P mockup]`. Fuente servido: lectura directa del código (§0 `[servido]`).

| # | Pieza del mockup | Estado servido | Veredicto |
|---|---|---|---|
| 1 | Barra: logo izq; der `FAQ` + botón `Ver una encuesta de ejemplo` | igual en estructura (`site-header.tsx` 97–133) | **IGUAL** en posición y destino. DIFIERE en peso: el botón bordado de la barra compite con el bordado de banda 3 (C-67) → se adopta barra→solo texto (§7). El mock pinta botón; se acepta perder ese detalle a cambio de matar la colisión (§7.4). |
| 2 | Logo: wordmark texto plano, sin símbolo, sans geométrica, mayúsculas, tracking amplio, tinta oscura | `ScanSayDone` Montserrat 600 16 px mixto, caja 108×36 | **SE ADOPTA** (§3): misma familia, mayúsculas + tracking. La sans geométrica del mock **es Montserrat**; no se introduce nada. |
| 3 | Hero: titular + subtítulo + CTA coral con flecha; a la der tarjeta demo | igual salvo la flecha (`hero.tsx` 15–37) | **IGUAL**. **SE ADOPTA** la flecha: SVG 16×16 inline `aria-hidden` dentro del botón (§4.6). El resaltado "antes de que se vayan" ya servido como chip `surface-dark`; la guía pide "mancha coral suave" (`#FFE0D4`) → **SE RECHAZA** (hex nuevo). |
| 4 | Tarjeta demo: grilla de números, el 9 resaltado en coral, Enviar coral relleno | escala 0–10, sin preselección, Enviar coral relleno (`survey-card.tsx` 80–120) | **IGUAL** en botón. **SE RECHAZA** preseleccionar el 9: sería un `aria-checked=true` de una respuesta que nadie dio (estados por verdad, no por pinta). Escala 0–10 **se porta** aunque G-0/B-1 siga abierto (`[firma]`-adjacent; C-33 del L4). |
| 5 | Cómo funciona: tres tarjetas **con icono** (móvil+QR / mano+tocar / monitor+gráfico) | círculos numerados coral, cero iconos (`how-it-works.tsx` 79–92) | **SE ADOPTA PARCIAL:** iconos sí (§4), **números no se quitan** — la numeración comunica secuencia y `[P guía §3.3]` misma pide "números grandes 1, 2, 3 en círculos coral". El mock muestra icono sin número; el plano adopta la unión. |
| 6 | Canales: cuatro tarjetas con icono de QR en sus contextos | miniaturas de escena SVG propias, declaradas (`channels.tsx` 99–149) | **IGUAL conceptualmente.** **SE RECHAZA** sustituirlas por pictogramas de 24: las escenas servidas son más informativas y CANON §6 las tiene **aceptadas**. Nada se toca. |
| 7 | Aplicaciones: tres tarjetas **con fotografía** | marcos vacíos declarados (`applications.tsx` 64–92) | **SE ADOPTA** con mutación de honestidad: imágenes generadas **declaradas ilustración** (§5). Proporción: el mock usa foto; la guía pide 16:10 → **SE RECHAZA 16:10, se porta 4/3** (cota servida 364×273). |
| 8 | Panel: captura real con cifras (8.7/10, 486, 8.6, 42%, línea + distribución) | marco vacío declarado, firma C-19 | **SE ADOPTA EL CAMINO, NO LOS NÚMEROS** (§6): componente HTML con datos de ejemplo; **42 % se rechaza** (sin denominador, lo dice la propia guía §3.6); 8.7 no se puede derivar de 486 enteros (486×8,7=4228.2) → dataset autoconsistente con media **exacta**. Entrada gated por firma (reapertura C-19). |
| 9 | FAQ / pie: como hoy | banda 8 servida 5 preguntas; pie 4 celdas | **IGUAL.** La guía §3.7 pide que la respuesta de "¿es real?" detalle qué es demo: hoy dice "No. Es un ejemplo. Cuando falta un dato o una foto reales, la página lo dice con letras." — **sigue siendo verdad** con el cambio, pero propone una línea añadida; eso toca copy firmado C-49 → tanda 2 con firma (§6.6, C-72). |
| 10 | Radios suaves, tarjetas blancas sobre crema, sin sombras fuertes | exacto (radius 8, alternancia crema/blanco, cero sombra) | **IGUAL.** |
| 11 | (guía) cabecera "no fija si consume móvil"; alto 68–80 | fija 76 px | **IGUAL/SERVIDO** — 76 es firma de la barra; se porta. |
| 12 | (guía) banda nueva / reorden | — | **SE RECHAZA**: orden de 8 bloques idéntico al servido; ninguna sección nueva; bandas 2 y 9 siguen sin plano (pendiente propio, fuera de este encargo). |

## 3. Logo — wordmark definitivo

**Decisión:** wordmark de texto vivo, **Montserrat**, mayúsculas, tracking amplio. Sin símbolo (así lo entregó el mock y así autoriza el operador: "el logo sale de las imágenes"). No se toca B-8 (el vector oficial sigue siendo deuda del operador; esto especifica el texto vivo vigente, precedente `ASSET-PIPELINE` citado por UX-SPEC l.407).

**Familia — por qué Montserrat y no Bebas:** el mock dice "sans-serif geométrica" — Montserrat **es** la geométrica del sistema; Bebas es condensada (no coincide) y la regla dura "Bebas solo títulos ≥32 px" hace inviable un wordmark de barra en Bebas (caja 36 px; 32 px Bebas con tracking no cabe en el lockup y obliga a reabrir CANON §5, bloqueado por el operador). DECISIONES D-3 nota que el logo real usa condensada "similar a Bebas": se registra como deuda de B-8 (si el operador entrega el vector, este texto vivo se sustituye sin re-cotar el resto).

**Especificación cerrada `[P]`:**

| Atributo | Barra (escritorio/tablet) | Móvil (drawer) | Pie |
|---|---|---|---|
| Contenido DOM | `ScanSayDone` (no se cambia: metadata, `©` y aria-label servidos siguen) | igual | igual |
| Render | CSS `uppercase` sobre el texto existente → **`SCANSAYDONE`** visual; el nombre accesible sigue siendo "ScanSayDone" (TTS lee el DOM, no el CSS) | igual | igual |
| Familia | Montserrat (`font-ui`) | Montserrat | Montserrat |
| Peso | 600 (porta lo servido) | 600 | 600 |
| Tamaño | 16 px | 16 px | 16 px |
| Tracking | **0.12 em** | 0.12 em | 0.12 em |
| Interlineado | 1 (`leading-none` servido) | 1 | 1 |
| Color | `text-primary` (14.28:1 sobre crema ✓) | `text-primary` sobre `surface-default` | `text-primary` sobre crema |
| Caja | `h-9` fija; **ancho intrínseco**, reserva 144–152 px (estimación 11 mayúsculas ≈ 139–146 px; **la caja final se fija midiendo en el gate, regla B-10**, no aquí) | `h-9` intrínseco | `h-9` intrínseco |
| Comportamiento | enlace `/`, `aria-label="ScanSayDone — ir al inicio"`, hover **ninguno** (es marca, no acción), foco anillo 3/−3 | en drawer: mismo texto, sin anillo extra (fuera del header) | texto estático, no enlace (servido) |
| Prohibido | subrayado, peso 700+, tracking >0.16 (se vuelve decorativo), estirar la caja (wordmark deformado 4.2:1 vetado por UX-SPEC l.389), cualquier isotipo/símbolo, cualquier hex | | |

**Dónde se aplica:** barra (desktop y drawer) y pie. Tres instancias, una receta.

**Cadena con guiones:** la guía escribe la marca `Scan-Say-Done` (§1, §8). Lo servido y firmado por uso continuo es `ScanSayDone` (metadata, pie `© 2026 ScanSayDone`). No es cambio de este plano: **C-74, owner operador** (afecta copy de todo el sitio + metadata). El wordmark se especifica sobre la cadena servida; si el operador firma la variante con guiones, solo cambia el nodo de texto y `w` se remide.

## 4. Iconos

**Decisión: SÍ se adopta set propio de la casa, y con esto se cierra B-4** (owner UX-SPEC §10: `frontend-alibaba + designer-alibaba`, "decisión de 1 línea"). No se instala ninguna librería de iconos (`react-icons` no está en `package.json`; Lucide se rechazó en §1.1-5). El sitio ya decidió por construcción: burger de 3 trazos `[servido]`, chevron de acordeón `[servido]`, marca de hueco `[servido]`. Este plano **formaliza** el set y lo usa donde el mock lo pide.

**Reglas del set `[P]` (rejilla firmada por este plano):**

| Regla | Valor |
|---|---|
| Rejilla | viewBox **24×24**, contenido dibujado dentro de 20×20 (margen 2) |
| Trazo | **1.5 px**, `fill="none"`, `stroke="currentColor"` con color fijado por clase (`text-primary` o `text-secondary`, nunca coral como único icono en banda clara) |
| Extremos | `stroke-linecap="round"`, `stroke-linejoin="round"` |
| Semántica | `aria-hidden="true"`, `focusable="false"`, `data-decorativo="<nombre>"` — el icono **nunca** es la única fuente de información (el título de la tarjeta la lleva) |
| Prohibido | emoji (P0 slop S3), relleno, doble trazo, texto dentro del icono, QR dibujado con aspecto escaneable |
| Legacy porta | chevron servido en 16×16 y burger en 20×20 se mantienen (ya en producción, re-cotarlos no aporta) |

**Iconos nuevos — solo 3, todos en banda 3** (motivos: el mock los pide; `[P guía §3.3]` también; canales ya tiene sus escenas; banda 5 con foto no lleva iconos — la guía §3.5 pide "icono pequeño por rubro": **se rechaza**, redundante con el nombre, y L5 es la banda que menos densidad admite):

| ID | Motivo | Descripción binaria |
|---|---|---|
| `icon-escanea` | teléfono vertical + soporte con retícula (no-QR: 4 módulos, sin patrón escaneable) | reconocible a 24 px; ≤9 trazos |
| `icon-responde` | pantalla de teléfono con fila de 5 teclas y un cursor/punta sobre una | sin dígitos dibujados (G-0); ≤8 trazos |
| `icon-lees` | monitor con línea quebrada ascendente + eje | sin números (C-19/G-0); ≤7 trazos |

**Anatomía de la tarjeta de banda 3 (difínición mínima sobre lo servido):** fila `[círculo número] [título]` intacta + **icono 24×24 alineado a la derecha de esa misma fila** (`justify-between`); cuerpo debajo. El conector `border-mid` y las cotas 1140/x150/364 no se tocan.

**¿Se pierde información al quitar los números? No se quitan.** Registro del argumento: la numeración 1-2-3 comunica **secuencia** (Escanea→Responde→ lees); un icono por sí solo comunica tema, no orden. Reemplazar números por iconos sería una pérdida real de legibilidad de flujo (Ley de Jakob/seqüencialidad; y la propia guía §3.3 pide círculos numerados en coral — el mock que los omite es un render, no una decisión). La unión (número + icono) satisface a ambas fuentes con 6 clases de JSX nuevas. El círculo coral con número es además un momento firma; eliminarlo empobrecería la banda.

## 5. Imágenes (banda 5)

**Decisión: opción (i) — generar con wan-image y usarlas como ilustración declarada en la propia banda.** Coste pagado: riesgo de lectura "foto real de un cliente" → se neutraliza con badge visible + línea de declaración en la banda + alt honesto + FAQ. Las otras dos opciones se evaluaron y se descartan: **(ii) solo referencia de dirección de arte** mantiene tres marcos vacíos en una sección que el mock y la guía señalan como el hueco a cerrar — el cambio visual pedido sería nulo; **(iii) no generar nada** ignora la autorización literal del operador (punto 4 del encargo).

**Cuántas: 3.** Una por placa (Restaurante, Café, Comercio pequeño). Ni 7 ilustraciones (la guía §4.1 cuenta A01–A07: las de "así funciona" quedan en SVG vectorial propio del §4, y las de canales ya existen y están aceptadas), ni foto nueva por rubro en tandas futuras (se podrá, cuando el operador entregue foto real: orden 1 de CANON manda sobre orden 2 y la placa correspondiente se sustituye).

**Qué muestra cada una (brief, con las restricciones del encargo):**

| # | Encuadre | Debe mostrar | Prohibido |
|---|---|---|---|
| I1 | mesa de restaurante, visión ~30°, horizontal | mesa de madera con vajilla discreta y **exhibidor triangular con retícula NO legible**; fondo desenfocado cálido | personas, manos, rostros; texto/logos; QR escaneable; colores fríos |
| I2 | café, taza en primer tercio | taza + platillo, soporte pequeño con retícula NO legible, luz de ventana cálida | idem |
| I3 | mostrador de comercio | bolsa kraft, producto simple, tarjeta exhibidora sobre atril con retícula NO legible | idem |

**Prompt literal wan-image** (mismo molde, `DESCRIPCION` variable; se envían con tamaño 1024×768 — 4:3):

- Molde: `Fotografía editorial realista horizontal proporción 4:3 de [DESCRIPCION]. Iluminación natural cálida lateral, paleta crema, madera y blanco hueso. Sin personas, sin manos, sin rostros. Sin texto, letras, números, logotipos ni marcas en ninguna superficie. El patrón del soporte es una retícula abstracta claramente no escaneable, deliberadamente ilegible. Estética de negocio auténtico de barrio, limpia y cálida; que no parezca banco de imágenes genérico.`
- I1 `[DESCRIPCION]`: `una mesa ordenada en un restaurante pequeño acogedor, exhibidor triangular blanco con la retícula sobre la mesa, vajilla discreta y una flor pequeña, fondo gastronómico desenfocado`
- I2: `una taza de café sobre su platillo en mesa de madera clara junto a un pequeño soporte con la retícula, mostrador de cafetería de barrio suave al fondo, luz de ventana`
- I3: `el mostrador de un comercio de barrio con una bolsa de papel kraft, dos productos sencillos y una tarjeta exhibidora sobre atril con la retícula, estanterías cálidas desenfocadas`

**Entrega y tamaño:** fuente 1024×768; derivado webp **728×546** (2× de 364×273) y **1456×1092** para pantallas densas/ancho completo; `<Image width height>` explícitos (CLS), `loading="lazy"` (banda bajo el pliegue), `object-cover` dentro del marco `[P]`. El marco es el servido: **4/3, 364×273 en xl, capado 364 centrado en 1-up** — no se re-cota nada.

**Cómo se declara al lector (3 capas, todas visibles sin interactuar):**

1. El borde discontinuo **se vuelve sólido** `1 px border-mid` (el `border-dashed` es *señal de falta*; con contenido ya no es honesto — criterio §10.9) y el badge `DEMO` cambia a **`ILUSTRACIÓN`** (misma anatomía: `surface-elevated`, `text-primary`, 11 px, `tracking-[0.1em]`). "DEMO" mentiría: no es una demo de producto, es una imagen fabricada.
2. **Línea de declaración al pie de la banda**, calcada del patrón servido de canales (`channels.tsx` 147–149): `"Estas tres imágenes son ilustraciones generadas por IA. No muestran locales reales. El patrón que parece un código es decorativo y no se puede escanear."` (12 px `text-secondary`).
3. **Alt honestos:** `"Mesa de restaurante con soporte de encuesta (ilustración generada)"`, `"Taza de café junto a un soporte ilustrado (imagen generada)"`, `"Mostrador de comercio con tarjeta de encuesta (imagen generada)"`.

**Control de calidad anti-QR (regla operativa):** si al revisar la imagen generada el patrón parece un QR escaneable de verdad, **se regenera o se descarta** — CANON §6 "prohibido QR que parezca escaneable si no lo es", y la declaración no salva un pixel engañoso. Presupuesto wan-image: el MCP limita ~4 imágenes/tarea; **una imagen por tarea de generación**, con máximo 1 reintento → sesiones separadas por imagen.

**Qué necesita firma:** el texto de la declaración (cadena visible nueva → operador) y el cambio de estado de la banda (el vacío de L5 era as-built). No reabre copia firmada (C-49 es banda 8). → C-70, tanda 1 (el operador **ya autorizó generar**; la firma pendiente es el copy de la línea + la sustitución del marco).

## 6. Panel (banda 6)

**Decisión: opción (ii) — componente HTML/CSS real con datos de ejemplo etiquetados + badge DEMO.** No (i) vacío declarado: es el estado actual firmado (C-19) y el mock lo quiere lleno. No (iii) imagen generada: `[P guía §4.4]` lo prohíbe explícitamente ("no generar cifras mediante IA visual"), los números saldrían borrosos/incoherentes, y un componente real es responsive (guía §3.6 vista móvil). Ventaja adicional de (ii): cero dependencias (Recharts vetado §1.1-5) — línea y barras se dibujan con SVG inline y divs.

**Condiciones de entrada:** tanda 2. Requiere **firma del operador que reabra C-19** (`[firma]`: "la banda 6 se publica con marco vacío declarado") y confirme las cifras (§11). Este plano no se autohabilita.

**Cifras exactas que se muestran** — un único dataset autoconsistente, escala 0–10 (coherente con el hero servido; **no** con la tablet de canales que muestra 5 tiles, conflicto C-33 heredado, owner PM):

| Distribución por nota | n | Pondera |
|---|---|---|
| 0:1 · 1:1 · 2:2 · 3:2 · 4:4 · 5:6 · 6:20 · 7:73 · 8:100 · 9:127 · 10:150 | **Σ=486** | Σ=4131 |

KPIs visibles (todos derivados, redondeo declarado cuando existe):

1. **"8,5"** — promedio de notas (4131/486 = 8,5 exacto, sin redondeo). Con etiqueta "de 486 respuestas · últimos 30 días". Se **rechaza el "8,7" del mock**: no es derivable de ningún conteo entero con 486 (486×8,7=4228,2).
2. **"486 respuestas"** — igual que el mock, ahora con soporte aritmético.
3. **"377 respuestas de 8 a 10"** (100+127+150; exacto, no porcentaje). Sustituye al **"42 %" del mock, que se rechaza** por dos motivos: no tiene denominador (la guía §3.6 misma lo exige) y "tasa de respuesta" es métrica que el producto no puede afirmar (G-22: métricas vetadas).
4. Se **rechaza el "8,6 promedio semanal" del mock**: sería una segunda media sobre los mismos datos que el lector no puede verificar y no aporta; el gráfico de evolución ya comunica la tendencia.

**Qué se dibuja:** barra de título "Resumen de satisfacción" + filtro deshabilitado etiquetado (no enlazado, regla destinos) + 3 KPIs + **línea SVG de evolución diaria** (30 puntos entre 7,4 y 9,2, ejes 0–10, cero cifras en los puntos) + **barras de distribución** con los conteos de la tabla (altura ∝ n; escala = 150). Cero cifras fuera del dataset. Sin lista de "últimas respuestas" con comentarios: inventar opiniones sería prueba social inventada (CANON §6 prohibición explícita) — `[P guía §3.6]` pide la lista; **se rechaza** ese renglón.

**Declaración (2 capas):** badge `DEMO` (ya requerido por CANON §6 "toda captura del panel lleva banda DEMO" — aquí es un prototipo HTML con datos ficticios, el badge queda grande y se queda) + figcaption visible: `"Panel de ejemplo con datos inventados. No pertenece a ningún negocio real."` (sustituye a "Todavía no hay panel que mostrar.").

**Layout:** marco 16/10 servido del L3 (872×545 familia, C-17 gated a medición en el gate); contenido interno en grid; **sin sidebar** hasta que el operador firme el panel con barra lateral (pendiente 4 de CANON §11 + D-4 sin firma): el mock muestra sidebar, `[P guía §3.6]` también — **se pospone**, no se rechaza (C-71). Móvil: versión compacta KPI+línea, no escritorio encogido (`[P guía §3.6]` — adoptado, encaja con el criterio de no-illegibilidad).

**Checklist coral de los 3 bullets:** la guía §3.6 pide "pequeños checks coral en lugar de bullets". **Se porta lo servido** (disc `text-secondary`): checks serían 3 elementos coral adicionales compitiendo con el presupuesto coral por pantalla. Rechazado con motivo.

## 7. C-67 — resolución del CTA repetido

**Diagnóstico servido:** etiqueta `Ver una encuesta de ejemplo` 3× en primera pantalla: barra (bordada 2 px, 15 px, anillo **3/−3**) + hero (coral relleno, anillo **2/+2**) + encabezado banda 3 (bordada 2 px, 16 px, anillo **2/+2**). El par barra/banda-3 son **el mismo peso visual** (bordado) y colisionan desde que banda 3 asoma bajo la barra fija; además conviven dos anillos.

**Receta final `[P]`:**

| Instancia | Receta | Motivo |
|---|---|---|
| **Barra** | → **solo texto**: `text-primary` 15/600, sin borde, hover `surface-elevated`, foco 3/−3, destino `#encuesta-demo` intacto | respaldo **O2 preautorizado** por NAVBAR-Y-FOOTER §A.4 y citado en C-67 ("CTA de barra solo texto"); elimina la colisión barra/banda-3 sin tocar el número de accesos ni los destinos |
| **Hero** | coral relleno **único de la pantalla**, + flecha (§4.6), foco migrado **2/+2 → 3/−3** | regla "un solo CTA coral visible"; C-48 ya firmó el anillo sistema — migrar esto es aplicar la firma, no decidir |
| **Banda 3** | bordada **única instancia de bordado con este label**, foco migrado **2/+2 → 3/−3** | `[P guía §3.3]` "conservar botón secundario" + §2.5 "CTA secundario: fondo claro, borde oscuro, texto oscuro" = exactamente la receta servida |

**Resultado:** un label, tres pesos, cero colisiones: `coral (1) > bordado (1) > texto (2: barra + pie-no)`. La tríada sigue existiendo porque el destino es la joya del sitio (la demo); `[P guía §7]` lo confirma ("lleva siempre a la misma experiencia demo, aunque aparezca en dos zonas"). Coste del O2: affordance "no parece accionable" (riesgo registrado en §A.4) — compensado porque a la der de la barra hay solo dos elementos (FAQ, CTA) y el contexto de cabecera resuelve la ambigüedad; el gate visual lo verifica con captura.

**Efecto colateral bienvenido:** desaparece la divergencia de anillos heredada en piezas de marketing (H-1-adjacent); after esto, **cero `outline-offset-2` en marketing/chrome** (criterio §10.3).

## 8. Efectos — librerías

**Recomendación: NINGUNA en tanda 1 y tanda 2.** Respuesta válida según el encargo, y es la recomendación del plano. Argumento:

1. El presupuesto vigente es **"0 JS de efectos nuevos"** y el sitio es mayormente server components; los clientes actuales (`site-header`, `survey-card`, `faqs`, `site-footer`) ya cubren toda la interactividad real (drawer, radiogroup, acordeón, año).
2. El mock es estático; la guía §7 pide microinteracciones que **ya servidas** cubren: hover de tarjetas no hay (no se promete), selección con feedback (hay), FAQ con transición breve (`motion-safe:transition-transform` servido en el chevron con `motion-reduce:transition-none` — **el reduced-motion ya está cumplido por receta CSS**, `faqs.tsx` 51).
3. Todo lo que un bundle de animación aportaría aquí (revelados al scroll) no está pedido por firma ni por el mock, y cambiaría la respuesta de JS entregada sin ganancia medible.

**Si el operador quiere aun así revelados al hacer scroll**, dos caminos, máximo uno:

| Camino | Para qué | Peso | `"use client"` | Componentes a cliente | Reduced-motion |
|---|---|---|---|---|---|
| **A (preferido) — CSS scroll-driven animations** (`animation-timeline: view()`) | aparición escalonada de tarjetas de banda 3/4/5 al entrar en viewport | **0 KB** (regla CSS en globals) | no | **0** | `@media (prefers-reduced-motion: no-preference)` — sin soporte el contenido aparece directamente (degradación pasiva) |
| **B (alternativa JS) — `motion` (motion.dev)** | ídem + control fino con stagger | ~35–50 KB gz (estimación sin verificar — **no lo verifico aquí**; sería obligación medirlo con bundle analyzer antes de firmar) | sí | +3–6 contenedores de banda (bandas 3,4,5,6) → el 50 % del landing pasa a cliente | `MotionConfig reducedMotion="user"` |

**Qué se gana** (A): profundidad de entrada sin coste. **Qué se pierde:** nada en peso; riesgo de soporte parcial (la ruta A queda como `[propuesta]` hasta verificar compatibilidad en el gate con la matriz actual — no la verifico en este plano, §11). **Ambos caminos requieren decisión explícita del operador antes de implementarse** (C-73); ninguno entra en tanda 1.

## 9. Plan por fases

| Tanda | Qué entra | Firma necesaria antes de código |
|---|---|---|
| **T1 — sin firmas nuevas** (autorizaciones ya dadas) | §7 C-67 completo (O2 preautorizado + migración anillo = aplicar C-48); §3 wordmark (texto vivo, dentro de familias firmadas); §4 set de iconos + 3 iconos banda 3 (cierra B-4 — owner del cierre es designer+frontend, no operador); §1.2-6 flecha del hero CTA; §6 dataset `demoData` escrito como módulo con los conteos de §6 (solo datos, no publicado) | ninguna; gates normales |
| **T2 — con firma del operador, una acta** | §5 banda 5: generación wan-image (3+2 sesiones), sustitución de marcos, badge `ILUSTRACIÓN`, línea de declaración (copy); §6 banda 6: panel HTML con cifras (reabre **C-19**); §6.6 actualización de 1 frase FAQ Q5 (reabre **C-49**) | **firma de T2** |
| **T3 — dependencias ajenas** | sidebar del preview (firma pendiente 4 CANON §11 / D-4); escala 1–5 vs 0–10 en hero+panel+tablet (PM cierra **G-0/B-1** → re-cota §4 `icon-responde`, §6 todo); cadena `Scan-Say-Done` vs `ScanSayDone` (B-8/C-74); efectos (C-73); bandas 2 y 9 (fuera de encargo) | PM / operador |

**En T1 no se toca ninguna cadena firmada** (C-49) **ni ninguna cota** de las listadas en §1.1-3.

## 10. Criterios binarios y verificables

| # | Criterio (PASS solo con salida/captura) |
|---|---|
| 1 | grep de `#[0-9A-Fa-f]{6}` en `src/components/marketing/**` y `chrome/**` = **0 ocurrencias fuera de tokens**; y `package.json` sigue sin `react-icons`/`lucide`/`bootstrap`/`chart`/`framer`/`motion` |
| 2 | barra: el botón `Ver una encuesta de ejemplo` **no tiene clase `border-`** en su `<Link>`; hero y banda 3 sí mantienen la suya exactamente una (contar `bg-interactive-primary` en viewport 1440×900 plegado en T: **1 CTA coral**) |
| 3 | `grep -r "outline-offset" marketing/ chrome/` → **solo `-3px`** (0 ocurrencias de `outline-offset-2`) |
| 4 | wordmark: los tres nodos (header, drawer, footer) muestran `SCANSAYDONE` a 1440; el DOM/aria conserva `ScanSayDone` (as-test); caja ≥132 px y ≤160 px (medida en gate; fuera → tracking 0.10 como corrección, registrado en acta) |
| 5 | banda 3: cada tarjeta tiene (a) círculo con dígito 1–3 visible y (b) un `<svg data-decorativo="icon-*">` 24×24 trazo 1.5 `fill=none`; ningún icono con `aria` semántico |
| 6 | (T2) cada imagen de banda 5: `<img>`/`next/image` con `width/height` declarados = intrínsecos reales; badge `ILUSTRACIÓN` visible sin scroll adicional dentro de la banda; línea de declaración presente en DOM (as-test) |
| 7 | (T2) revisión visual de las 3 imágenes: ninguna contiene rostro/manos identificables, texto legible ni patrón QR escaneable (criterio: si alguien puede explicar cómo escanearlo → FAIL) |
| 8 | (T2) panel: los números renderizados del KPI 1 = `round(Σ(n·nota)/Σn, 1)` del dataset con 0 margen; `Σn = 486`; el KPI 3 = `n(8)+n(9)+n(10)` con 0 margen; en la banda **no existe** la cadena "42" ni "8,7"; las barras de distribución tienen alturas proporcionales a la tabla de §6 (margen ±1 px) |
| 9 | (T2) `grep -r "border-dashed" marketing/` → **0 ocurrencias**; ningún marco con imagen conserva la declaración "Todavía no hay foto que mostrar." en DOM |
| 10 | (T2) FAQ Q5: si se firma la línea añadida, la respuesta nombrada en el as-test coincide carácter a carácter con la acta firmada; si no se firma, la respuesta queda **exactamente** como la servida (ningún cambio de copy en banda 8 sin firma) |
| 11 | gates CANON §9 por tanda: `build` · `lint` · `tsc --noEmit` · `npm test` · axe en la vista tocada (1440×900 + 375×812) · capturas antes/después. Sin salida pegada no hay PASS |
| 12 | contraste: axe 0 violations WCAG2AA; texto secundario sobre crema/blanco sigue ≥4.5; badge `ILUSTRACIÓN` `text-primary`/`surface-elevated` ≥4.5 |

## 11. Conflictos abiertos con owner y no-verificado

**Cierres propuestos por este plano (owner del cierre según UX-SPEC §10):** C-67 → resuelto §7 (ratifica operador en acta de T1). B-4 → cerrado §4 con set propio (designer+frontend; frontend implementa, sin nueva decisión pendiente).

**Conflictos nuevos:**

| # | Conflicto | Owner |
|---|---|---|
| **C-68** | Sello de la política de imágenes: la generación está autorizada por el operador (encargo 2026-11-06), pero la línea de declaración y el badge `ILUSTRACIÓN` son copy visible nuevo que sustituye un as-built (banda 5 vacía) → firma de acta antes de T2 | Operador |
| **C-69** | Escala del panel/demo: el dataset §6 afirma 0–10 igual que el hero; la tablet de canales afirma 5 tiles (C-33 heredado) y **G-0/B-1 sigue abierto** — si PM cierra 1–5, §4 `icon-responde`, §6 dataset y hero se re-cotan juntos | PM / equipo |
| **C-70** | Reapertura de **C-19** (banda 6 publicada en vacío) para el panel con cifras; el plano recomienda (ii) pero la firma del 06-11 sigue vigente hasta que el operador firme lo contrario | Operador |
| **C-71** | Sidebar del preview: guía y mock la piden; CANON §11-4/D-4 sin firma → pospuesta, no rechazada | Operador |
| **C-72** | Reapertura parcial de **C-49**: una línea añadida a la respuesta Q5 de la FAQ para nombrar explícitamente "ilustraciones generadas" (opcional pero recomendado una vez T2) | Operador |
| **C-73** | Efectos: recomendación = ninguna; caminos A/B documentados; decisión explícita requerida antes de que cualquier revelado entre | Operador |
| **C-74** | Cadena de marca `ScanSayDone` (servido/metadata) vs `Scan-Say-Done` (guía §1/§8); afecta wordmark, pie, metadata y as-tests | Operador (lazo con B-8) |

**Lo que NO verifiqué en este plano (honestidad de alcance):**

1. **No abrí la PNG**; su contenido se usó vía el análisis del orquestador (`[P mockup]`).
2. **No medí anchos de render del wordmark** — la caja es estimación de métricas tipográficas; el valor final lo fija el gate (regla B-10).
3. **No verifiqué el tamaño real de `motion` en bundle** (rango ~35–50 KB gz es estimación; se mide solo si C-73 se resuelve en B).
4. **No verifiqué compatibilidad browser de `animation-timeline: view()`** en el stack objetivo (camino A condicionado a la matriz del gate).
5. **No generé ninguna imagen** (wan-image): el encargo me limita a escribir un archivo; los prompts quedan listos para la tarea de generación, con límites de presupuesto del MCP anotados (§5).
6. No corrí build/tests/axe (fuera de encargo); ningún criterio §10 se afirma como cumplido — son la lista de lo que el gate debe probar.
7. Las cotas servidas citadas (`364×273`, `872×545`) vienen de los planos y del estado `[servido]`, **no** remedidas en esta sesión.

---

**Cierre de formato:** plano completo. Cada decisión tiene fuente (mockup/guía/canon/firma/servido), cada cambio una receta medible y cada pieza dudosa un conflicto con owner. T1 se puede implementar sin negociar nada; T2 se negocia en una sola acta con el operador; T3 pertenece a terceros.

---

## 12. Acta de la tanda 1 — 2026-11-06 (orquestador)

**Implementado y medido:** wordmark en Montserrat 600 16 px con `uppercase` y `tracking-[0.12em]`, ancho intrínseco, en barra y pie; tres ilustraciones generadas con wan-image e integradas en la banda 5 con badge `ILUSTRACIÓN`, borde sólido y línea de declaración al pie; CTA de la barra degradado a texto (C-67) dejando el único coral en el hero y el únicobordado en la banda 3; anillos de foco de hero, banda 3 y tarjeta demo migrados a la receta firmada 3 px/−3; tres iconos 24×24 en la banda 3 sin quitar la numeración.

**Verificación:** 85 tests, `build` 14/14, `lint` 0 errores, `tsc` 0, **axe 0 violaciones** en 1440 y 375. Las tres imágenes miden 1024×768 exactas (4:3), sin personas ni manos, sin texto legible, y sus retículas **no tienen los tres cuadrados de esquina** de un QR: el control anti-QR del §5 se cumple.

**Coste declarado:** se generaron seis imágenes para quedarse con tres. Las tres primeras respuestas del MCP se perdieron por un error del orquestador al serializar la respuesta (devuelve una URL temporal de 24 h, no un archivo). Las tres buenas se descargaron a `public/img/ilustraciones/` en la misma sesión.

**Lo que la tanda 1 no cubrió y queda a la vista:**

- **Los iconos de la banda 3 quedan pequeños.** A 24 px y en `text-secondary`, alineados a la derecha del título, se leen como marcas menores: no aportan lo que el mockup insinuaba. Propuesta: subirlos a 32 px y pasarlos a `text-primary`, o colocarlos sobre el título como en el mockup. Requiere decisión de diseño (el plano fijó 24).
- **La tarjeta demo del hero sigue sin estado seleccionado** y su botón `Enviar` sigue en beige. El mockup muestra un número resaltado en coral y el envío en coral. Cambiarlo toca el lote cerrado de L1 **y** el modelo de encuesta (G-0/B-1 siguen abiertos): no se tocó.
- **El CTA del hero no lleva flecha**, que el mockup sí dibuja.
- **La banda 6 (panel) sigue vacía.** La opción (ii) del §6 —componente real con datos de ejemplo etiquetados— está en la tanda 2 y **reabre C-19**, que el operador firmó hoy como «publicar con el marco vacío». No se implementa sin nueva firma.

---

## 13. Acta de la tanda 1.5 (correcciones) y de la tanda 2 (panel) — 2026-11-06

**Correcciones aplicadas a la tanda 1:** iconos de la banda 3 a 32 px y `text-primary`; flecha de avance en el CTA coral del hero (SVG propio 16×16, `data-decorativo="icon-flecha"`); estado seleccionado estático en el número 9 de la tarjeta demo, que ahora solo se muestra seleccionado **mientras el usuario no elige otra cosa** (antes quedaban dos resaltados al pulsar cualquier número).

**Tanda 2 — banda 6 implementada con autorización del operador**, que reabrió C-19 el mismo día para publicar el panel con contenido de ejemplo en lugar del marco vacío.

- El marco pasa a **borde sólido** y contiene un panel real en HTML/CSS: fila de título con filtro deshabilitado, tres KPIs (**8,5** · **486** · **377**), línea de evolución de 30 puntos y once barras de distribución. Cero dependencias: todo en SVG inline y divs.
- Dataset autoconsistente: `0:1 · 1:1 · 2:2 · 3:2 · 4:4 · 5:6 · 6:20 · 7:73 · 8:100 · 9:127 · 10:150` → Σn = 486, Σ(n·nota) = 4131, media **8,5 exacta**, y 377 respuestas en 8–10. **Se rechazan** el 8,7 y el 42 % del mockup: el primero no es derivable de conteos enteros con 486 y el segundo no tiene denominador y afirma una tasa que el producto no puede sostener.
- **Declaración en dos capas:** badge `DEMO` y `figcaption` visible: *«Panel de ejemplo con datos inventados. No pertenece a ningún negocio real.»*
- **No entra:** la barra lateral del mockup (pospuesta, C-71), la lista de últimas respuestas con comentarios (sería prueba social inventada) y los checks coral de la guía (competirían con el presupuesto de un coral por pantalla).

**Desviación menor registrada:** en móvil las barras de distribución se ocultan y queda la versión compacta KPI + línea, como pedía el §6. El `figcaption` se mantiene visible en ambos.

**Verificación de las dos tandas juntas:** **87 tests**, `build` 14/14, `lint` 0 errores, `tsc` 0, **axe 0 violaciones** en 1440×900 y 375×812. Cero `border-dashed` en las bandas 5 y 6; cero cadenas `42` y `8,7` en el DOM del panel; cero coral dentro del panel.

**Estado de la decisión C-19:** cambió por firma del operador. La banda 6 ya no es un marco vacío declarado: es un panel de ejemplo con datos etiquetados. Si en el futuro se publica un panel real, se sustituye el dataset y se retira el badge, sin re-cotar geometría.
