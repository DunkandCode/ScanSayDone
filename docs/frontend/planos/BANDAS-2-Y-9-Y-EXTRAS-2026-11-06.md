# BANDAS 2 Y 9 + EXTRAS — cierre del landing y encargos del operador

> **Fecha:** 2026-11-06 · **Autor:** designer-alibaba · **Ruta canónica:** `docs/frontend/planos/BANDAS-2-Y-9-Y-EXTRAS-2026-11-06.md`
> **Compañero de numeración:** conflictos C-1…C-66 servidos por `NAVBAR-Y-FOOTER-2026-11-06.md`; C-68…C-75 servidos por `MEJORA-VISUAL-2026-11-06.md`. **Este plano abre C-76…C-82.**
> **Qué es:** un solo plano que cubre (P1) la banda 2 —franja de confianza— y la banda 9 —CTA final—, ambas inexistentes en el DOM según `ESTADO-2026-11-06.md` §2, y (P2) tres extras del operador: alineación de la barra, imágenes de fondo suaves con wan-image, y el lockup de marca con isotipo.
> **Qué NO es:** no es código. No corrí build, lint, tsc, tests, axe ni Playwright: **cero PASS en este archivo**. No edito el snapshot `ENTREGA-UX-2026-10-30/` ni ningún otro plano. No genero imágenes: los prompts quedan listos para su tarea.

## 0. Fuentes, etiquetas y orden de implementación

| Etiqueta | Significado |
|---|---|
| `[P]` | cota/regla de plano o spec vigente (`PLANOS-2026-11-05`, `UX-SPEC-2026-11-05`, `CANON.md`, `NAVBAR-Y-FOOTER`, `MEJORA-VISUAL` incl. actas §12/§13) |
| `[as-built]` | verificado por lectura estática del código servido en esta sesión (solo lectura: `site-header.tsx`, `nav-drawer.tsx`, `globals.css`, `page.tsx`, `hero.tsx`, componentes de banda, `brand-src/MANIFEST.md`, `brand-src/logo-symbol.svg`) |
| `[M legacy]` | medida del sitio Bootstrap (`REVISION-UX §3` vía `PLANOS §2.2`); referencia histórica, no meta (B-10) |
| `[D]` | derivación aritmética sobre `[P]` / cálculo WCAG de esta sesión (fórmula relativa-luminance; los valores [V] de `UX-SPEC §3.B` se citan, no se recalculan) |
| `[propuesta]` | decisión nueva de este plano sujeta a acta/firma |
| `sin dato` | no documentado; se nombra dónde debió estar (registro `PLANOS §7`, SD-#) |

**Reglas duras que gobiernan todo el archivo** (firmadas/medidas, no se reabren): navegación fija 76 px con `main pt-[76px]` `[P]`; contenedor `mkt-xl` 1140 en x=150 `[P]`; pie 4×267 `[P]`; anillo de foco 3 px `text-primary` offset −3 firmado C-48 `[firma]`; un solo CTA coral visible por pantalla `[P]`; coral nunca como texto sobre claro `[P]`; elevación por borde y color, no por sombra `[P]`; estados nunca solo por color `[P]`; toda ilustración o dato de ejemplo se declara `[P]`; destinos vacíos no se enlazan (D10) `[P]`; paleta = los 6 tokens + los roles servidos de `globals.css:5-21 [as-built]`, **cero hex nuevo**; Bebas solo títulos ≥32 px mayúsculas, Montserrat en todo lo demás, cero tercera familia `[P]`.

**Orden de implementación (literal del operador):**

| Prioridad | Qué | Firmas que necesita |
|---|---|---|
| **P1-a** | Banda 2 (franja de confianza) | acta normal (copy visible nuevo heredado de `COPY-LANDING §2`; nada firmado se reabre) |
| **P1-b** | Banda 9 (CTA final) + su copy | firma C-79 (superficie oscura de banda + cadenas nuevas; `COPY-LANDING §13` ítem 6 sigue pendiente) |
| **P2-a** | Alineación de la barra | firma C-76 (crece wordmark a 24 px; reabre el as-built de `MEJORA §3`, implementado en acta T1) |
| **P2-b** | Lockup con isotipo (barra móvil + pie incluidos) | misma C-76; interpretación C-81 (inline de geometría) |
| **P2-c** | Fondo suave banda 9 (imagen wan-image + declaración) | firma C-80 (prompt final + línea de declaración visible) |

El operador ordenó: primero las bandas, luego los extras. La alineación de la barra y el lockup se implementan **juntos** (la receta de alineación asume el lockup nuevo; hacerlos por separado re-cotaría dos veces la misma fila).

---

## 1. Banda 2 — franja de confianza

### 1.1 Decisión: entra

Entra entre la banda 1 (hero, crema) y la banda 3 (cómo funciona, blanco) — posición canónica `[P] UX-SPEC §2.1` fila 2 / `PLANOS §2.1` fila 2. `ESTADO-2026-11-06` §2 consigna «no existe, y ningún lote del plan la cubre»; el orden servido no prescinde de ella: es un hueco, no una decisión. Se llena con lo que el producto sostiene hoy (abajo); la versión mínima honesta existe, así que la franja entra.

### 1.2 Contenido — 3 claims, cero prueba social

Prohibiciones del encargo acotadas contra el registro `sin dato` de `PLANOS §7` y las prohibiciones duras de `CANON §6` / `UX-SPEC §5.2` (cero logos, cero cifras de resultados, cero testimonios, cero "miles de negocios", cero sellos, cero estrellas). El inventario canónico de la franja `[P] UX-LANDING §2` fila 2 traía 4 claims: `3 PREGUNTAS · SIN INSTALAR NADA · SIN CUENTA PARA TUS CLIENTES · EL QR NO SE REIMPRE`.

| # | Título (claim) | Cuerpo (12–14 px) | Qué lo sostiene |
|---|---|---|---|
| 1 | `SIN INSTALAR NADA` | `El cliente contesta en el navegador de su teléfono. No hay app.` | hecho de diseño del producto (encuesta web pública; `UX-SPEC §1` ruta `/e/…`) |
| 2 | `SIN CUENTA PARA TUS CLIENTES` | `Nada de registros ni correos para responder.` | hecho de diseño (respuesta anónima pública; cero cuentas de cliente en todo el spec) |
| 3 | `EL QR NO SE REIMPRE` | `El mismo QR sirve para siempre: no hay que reimprimirlo.` | cadena canónica literal de `UX-SPEC §5.1` regla 9 — **se reproduce exacta, no se reescribe a mano: va desde la constante compartida que esa regla exige** |

- **El claim 4 (`3 PREGUNTAS`) NO entra.** Motivo: el modelo de encuesta está abierto (`G-0`/`B-1`: 3 preguntas 1–5 vs 5 preguntas 0–10) y el número de preguntas es uno de los 10 datos sin respuesta de C-50 `ESTADO-2026-11-06` §4. Publicar «3 preguntas» sería publicar una cifra de producto no confirmada. Queda registrado como **C-78**: al cerrar G-0/B-1, el cuarto claim entra como una línea (auto-fit lo absorbe sin re-cotar: a 960 con 4 claims el track pasa de 304 a 222 = el `col-lg-3` que `GRID-SPEC §2` prohibe para *bullets*, pero estos claims son de ≤28 car. y 2 líneas de cuerpo — verificar en el gate con captura antes de habilitar; si 222 corta el cuerpo, la franja se queda en 3 claims y el dato va a banda 3).
- Cero conteos, cero promesas, cero «miles de…». Los tres claims son negativos de frote (lo que el cliente **no** tiene que hacer), no beneficios medidos.

### 1.3 Anatomía y cotas

| Cota | Valor | Fuente |
|---|---|---|
| Container | `mkt-lg` 960 | `[P] UX-SPEC §2.1` fila 2 |
| Retícula | CSS Grid **propio** `repeat(auto-fit, minmax(220px,1fr))` `gap-6` (24) — **nunca** mezclada con `grid-cols-12` en el mismo nivel | `[P] PLANOS §2.6`, regla P0 `UX-LANDING §1` |
| Tracks | desktop: 3 × 304 `[D]` (960−2×24)/3 · sm: 2+1 · <62rem y móvil: 1 × 343 (content 375) | `[D]` auto-fit sobre cota `[P]` |
| Gap móvil | 16 (`sp-3`) | `[P] PLANOS §2.2` «gap D 24, gap M 16» |
| Padding vertical | **60 / 60** (desktop/móvil) — «banda ligera» | `[P] PLANOS §2.2` py 60 D; móvil era `sin dato` (**SD-3**) → **resuelto aquí `[propuesta]`**: `--band-y-m` 60 |
| Fondo | `surface-elevated` #F0D8BD | `[propuesta]` — ver §1.4 (no puede ser crema ni blanco) |
| Borde superior e inferior | **sí**: 1 px `border-mid` ambos cantos | `[D]`: elevated↔crema mide 1.11 y elevated↔blanco 1.38 `[D]` = frontera inválida por color → el borde es obligatorio (regla `CANON §4`); `border-mid`/elevated **3.40** `[D]` ≥3 ✓ |
| Interior claim | icono 32 + 12 + título 20/600 + 8 + cuerpo 14/1.45 | `[P] PLANOS §2.2` «icono ≥24 + tít 20/600 + body 14»; icono a 32 y `text-primary` sigue la corrección del acta §13 (banda 3) `[P acta]` |
| Título claim | Montserrat 600 20 px MAYÚSCULAS, `text-primary` | `[P]` el claim era así; Bebas no: 20 < 32 vetado `CANON §5` |
| Cuerpo | Montserrat 400 14, `text-secondary` | `[P] PLANOS §2.2` |
| Iconos | set propio de la casa `MEJORA §4`: viewBox 24×24, trazo 1.5, `stroke="currentColor"`, render 32 px, `aria-hidden="true" focusable="false" data-decorativo` | `[P]` set cerrado T1; 3 iconos nuevos: `icon-sin-app` (teléfono + 1 línea diagonal), `icon-sin-cuenta` (carné + 1 línea diagonal), `icon-sin-reimpresion` (hoja + flecha de retorno, sin módulos QR legibles); ≤9 trazos, prohibido relleno/emoji/texto dentro |
| Alto estimado | desktop ≈ **240** `[D: 60+~120+60]` · móvil ≈ **510** `[D: 60+3×119+2×16+60]` | referencia, no meta; `[M legacy]` era 193/412 (4 claims); re-medir en el gate (B-10) |

### 1.4 Por qué `surface-elevated` y no otro fondo

Regla P0 `[P] UX-LANDING §4` / `DESIGN-CONTRACT §4`: **dos fondos iguales nunca adyacentes**. Vecinos: banda 1 crema (`background-page` `[as-built hero]`) y banda 3 blanco (`surface-default` `[as-built how-it-works:30]`). Consecuencia cerrada: banda 2 no puede ser crema (choca con 1), no puede ser blanco (choca con 3), no puede ser oscura (consumiría una colocación de banda oscura y competiría con la 9; además el anillo firmado sobre oscura es 1.00 → la franja exigiría excepciones que la 9 ya tramita). `surface-elevated` es token servido (cero hex nuevo), textos pasan con holgura: `text-primary`/elevated **12.82** `[V]` y `text-secondary`/elevated **5.33** `[V]`. Uso de elevated como *superficie de banda* excede su rol de hoja («tarjeta secundaria y tag DEMO»): se registra dentro de **C-78** para la acta. Secuencia resultante: crema → elevada → blanco → crema → blanco → crema → blanco(8) → oscura(9) → crema(10): cero repeticiones adyacentes en todo el landing.

### 1.5 Estructura DOM y jerarquía

```tsx
<section className="w-full border-y border-border-mid bg-surface-elevated px-4 py-15">
  {/* py 60 en ambos cortes: banda ligera, sin escalón (md:py-25 NO aplica) */}
  <div className="mx-auto grid w-full max-w-mkt-lg grid-cols-1 gap-4
                  min-[544px]:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] md:gap-6">
    {/* claim ×3 — título y cuerpo son <p>, no heading: */}
    <div className="flex flex-col">
      <svg data-decorativo="icon-sin-app" aria-hidden="true" focusable="false" className="size-8 shrink-0 text-text-primary">…</svg>
      <p className="mt-3 font-ui text-[20px] font-semibold uppercase text-text-primary">SIN INSTALAR NADA</p>
      <p className="mt-2 font-ui text-[14px] leading-[1.45] text-text-secondary">El cliente contesta en el navegador de su teléfono. No hay app.</p>
    </div>
  </div>
</section>
```

- **Cero `h2` en la banda 2** — es franja de apoyo sin título: el inventario canónico `[P] UX-SPEC §2.1` fila 2 no tiene H2 y `PLANOS §2.3` fila 2 no nombra ancla ni heading. Títulos de claim = `<p>` con peso 600 (no heading): el outline queda `h1 → h2(banda 3)` sin saltos → axe `headings-order` limpio `[criterio 2.6]`.
- **Cero ancla** (sin `id`): `[P] PLANOS §2.3` fila 2 «.trust-strip — sin ancla».
- **Cero CTA y cero enlaces**: `[P]` «NINGÚN CTA (rol de apoyo)». El coral del hero sigue siendo el único de la primera pantalla.
- `md:py-15` (60 px) en ambos cortes; no aplicar `md:py-25` (100): la franja es ligera por definición `[P]`.

### 1.6 Qué pasa en móvil

1 columna de 343; claims apilados con gap 16; icono-título-cuerpo en columna izquierda alineada al borde (no centrada: el centro visual de una lista es frote); alto ≈510; sin scroll horizontal (auto-fit con minmax(220) + content 343 → 1 track, 220 ≤ 343 ✓ `[D]`).

---

## 2. Banda 9 — CTA final de cierre

### 2.1 Decisión y colocación

Entra **después de FAQ (banda 8) y antes del pie (banda 10)** — `[P] UX-SPEC §2.1` fila 9 / `PLANOS §2.3` fila 9 (`#cta-final`). Hoy la página termina en FAQ (`page.tsx:10-20 [as-built]`).

Relación con el pie: **fondo distinto** (`surface-dark` #1A181B, token servido `globals.css:13`) y **sin borde superior** para la 9: la frontera blanco↔oscura mide 17.64 por ambas caras `[D]` — es la más fuerte disponible; un borde sería ruido. Abajo, el pie ya sirve su `border-t border-border-mid` `[P] NAVBAR §B.2` y esa línea pasa sobre oscuro **3.77** `[D]` ≥3 ✓: la frontera 9→10 queda resuelta por la diferencia de fondo + el borde del propio pie. El cierre oscuro-crema reproduce la intención canónica («el salto ciruela→crema del cierre es la frontera más fuerte» `[P] UX-LANDING §4`; el sucesor servido de ciruela es `surface-dark` — colocación 2 de 3 del presupuesto de banda oscura, con page-heros como 3.ª; el hero servido usa crema + un chip oscuro tipográfico, no una banda `[as-built hero.tsx:18]` → no se excede el presupuesto).

### 2.2 Contenido: copy exacto

Cadenas nuevas de esta banda **están pendientes de firma** — `COPY-LANDING §13` ítem 6 (CTA final + micro) no ha sido aprobado nunca (`UX-SPEC §5.3`). El plano fija el texto; nada se publica sin acta (**C-79**). Español de Chile con tuteo, medido, sin promesas nuevas:

| Elemento | Cadena exacta | Car. | Qué la respalda |
|---|---|---|---|
| Kicker/eyebrow | `COMIENZA HOY` | 12 | eyebrow F8.5 ya servida en el sitio legacy `[P] UX-SPEC §5.3` ítems 7–11 — reuso, no se inventa |
| H2 (≤2 líneas) | `¿LISTO PARA EMPEZAR?` | 19 | interrogación de cierre; no promete nada; Bebas 64 en 632 px: 19 car. ≈ 540 px de avance `[D]` → **1 línea** desktop, 2 líneas móvil a 343 |
| Apoyo (1 línea) | `Encuestas por QR para tu restaurante, café o comercio.` | 55 | variante medida de la descripción servida de metadata `[as-built layout.tsx]` y del pie (`NAVBAR §B.4`); 18 px en 632: ≈ 495 px `[D]` → **1 línea**; nombra lo que se vende sin prometer resultados |
| CTA (único) | `Escríbenos` | 10 | calca el verbo de la cadena firmada del pie de FAQ («¿Otra duda? Escríbenos», C-49 `[firma]`) y el estándar `ESCRIBINOS` de las internas `[P] UX-SPEC §1` |
| Micro bajo el botón | **ninguno** | — | `Sin tarjeta` queda **excluido**: solo entra si el operador lo confirma `[P] UX-SPEC §2.1` fila 9 y `UX-SPEC §5.2` lo veta sin confirmación |
| Declaración del fondo (§4) | `La imagen de fondo es una ilustración generada. No muestra un local real.` | 74 | regla «toda ilustración se declara» `[P] CANON §6` / encargo; 12 px `on-dark-secondary` |

### 2.3 El CTA: destino

**`/contactus`.** Razón, con los dos destinos reales sobre la mesa:

- `#encuesta-demo` ya recibe **tres puertas** `[as-built]`: barra (CTA texto), hero (coral), banda 3 (bordado). Una cuarta puerta a la demo en el cierre repite una acción que el lector que llegó al fondo ya vio tres veces.
- `/contactus` es el paso de conversión que la banda 9 existe para dar; **no es destino vacío**: publica contenido real y declara el canal pendiente (C-51 `[firma]`; D10 no se viola). La página calca el contrato firmado: «no se inventa correo».
- Verbo del botón = verbo de la puerta firmada en FAQ (consistencia §5.1-5 `UX-SPEC`: la cadena «Escríbenos» coincide con el destino que la propia FAQ-signed anuncia). La tension —la puerta de conversión lleva a una página cuyo canal está pendiente— **es el techo honesto de hoy** y se registra en C-79: cuando el operador fije el correo (B-5/CANON §11-5), la banda 9 no cambia de forma; cambia `/contactus` por dentro.

**Carácter del botón:** relleno `interactive-primary` #FC5A41 + label `text-primary` (5.61 `[V]`; hover `interactive-hover` ink/6.34 `[D]`; pressed `interactive-pressed` ink/4.59 `[D]`) — la receta servida del hero `[as-built hero.tsx:33]`, **el único coral visible en pantalla cuando la banda 9 está en el pliegue**: barra = texto (post C-67), FAQ = enlaces de texto, pie = cero CTA `[P] NAVBAR §B.5`. Presupuesto de 1 coral por pantalla intacto. **Foco:** el anillo firmado 3 px `text-primary` −3 funciona **dentro de la banda oscura sin excepciones** porque el único foco de la banda es el botón coral: anillo ink sobre relleno coral = 5.61 ≥3 `[D]` (el anillo se mide contra el píxel adyacente, el relleno, no contra la banda). La trampa del anillo 1.00 sobre `surface-dark` (`NAVBAR §B.2`) **no se importa aquí**: en la banda no hay ningún otro nodo focable (cero enlaces de texto en la banda). No se reabre C-48.

### 2.4 Cotas, alineación, móvil

| Cota | Valor | Fuente |
|---|---|---|
| Container | `mkt-lg` 960, centrado (escalera estándar `px-4` + `max-w-mkt-lg mx-auto`) | `[P] UX-SPEC §2.1` fila 9 |
| Bloque de texto | **632 px centrado** | `[propuesta]` resuelve **SD-1** (`PLANOS §7`: ancho del bloque `sin dato`): reusa el span documentado 8-col lg = 632 `[P] GRID-SPEC §2`, mismo ancho de línea de lectura que la FAQ → coherencia sin inventar número |
| Alineación | **centrada en eje** (texto centrado, botón centrado, columna centrada) — el canon dice «`container-lg` 960 **centrado**» `[P]` fila 9 | `[P]` |
| py | 100 desktop / 60 móvil | `[P] PLANOS §2.2` fila 9 |
| H2 | Bebas 64 desktop / 44 móvil, lh 0.95, `text-on-dark` | `[P]` fila 9 «H2 64 crema»; escala móvil 44 `[P] UX-SPEC §3.3` h2 |
| Kicker | 13/600 MAYÚS .14em `on-dark-secondary` (9.01 sobre dark `[D]`) | `[P]` rol overline; color servido sobre oscuro (no puede ser `text-secondary`/dark = 2.41 ✗ `[D]`, por eso `on-dark-secondary`) |
| Lead | 18/1.6 `on-dark-secondary` | `[D]` rol lead; sobre dark pasa (9.01 puro; 6.57 sobre el peor píxel con fondo §4) |
| Botón | **h 56** `[P]` fila 9; radio 8 (servido); px 24; desktop ancho intrínseco centrado | `[P]` |
| Ritmo interno | kicker→H2 16 · H2→lead 16 · lead→botón 32 · botón→declaración 24 · declaración 12 | `[D]` sobre ritmo canónico H2→lead 16 `[P]` y CTA→banda 48 cerrado por el py 100; el 32 sustituye 48 porque el bloque es de 632 (registrado en la acta del gate) |
| Ancla | `id="cta-final"` + `scroll-mt-[92px]` (receta C-59 servida `[as-built]`) | `[P] PLANOS §2.3` |
| Alto estimado | desktop ≈ **470** `[D]` · móvil ≈ **460** `[D]` | referencia vs `[M legacy]` 497/466; re-medir B-10 |

**Móvil (375):** bloque = content 343; H2 44 en 2 líneas (`¿LISTO PARA` / `EMPEZAR?`, 20 car. → 2 cortes naturales); lead 2 líneas; **CTA 100 % de ancho, h 56** (≥48 `[P] UX-LANDING §7`); declaración 2 líneas centrada; todo sigue centrado en eje; imagen de fondo **no se sirve** (§4.6). Sin scroll horizontal (343 ≤ 375−32 ✓).

---

## 3. Barra — receta de alineación (medida, no opinada)

### 3.1 Diagnóstico medido `[as-built site-header.tsx]`

| Elemento | Receta servida hoy | Caja |
|---|---|---|
| Fila | `header h-[76px]` → `div flex h-full items-center justify-between` (escalera de container) | — |
| Wordmark | `Link inline-flex h-11` > `span flex h-9 items-center text-[16px] font-semibold uppercase tracking-[0.12em]` | hit 44, visual 36 |
| FAQ | `Link inline-flex h-11 items-center rounded-[8px] px-3 text-[15px] font-medium hover:bg-surface-elevated` | hit 44 |
| CTA | `Link inline-flex h-11 justify-center px-4 text-[15px] font-semibold underline decoration-border-mid underline-offset-4` (+hover decoration) | hit 44 |
| Separación | FAQ↔CTA `gap-6` = 24 | `[P]` 1 gutter |
| Burger (<992) | `size-11` borde 2 | hit 44 ✓ |

**Caja:** ya están alineados. Los tres nodos comparten hit `h-11` (44) centrado en la fila de 76 → bordes del hit en y 16–60, eje común y=38. El lockup y los enlaces **sí comparten eje vertical** (centro de caja = centro de fila).

**Baseline:** con `items-center`, los centros de mayúsculas coinciden; las basales difieren ≤0.7 px entre wordmark (16 px ≈ cap 11.5) y enlaces (15 px ≈ cap 10.8) `[D, Montserrat cap ≈0.72em]`. Umbral perceptivo ~1 px: **no hay desalineación de baseline que corregir; prohibido aplicar nudges/translate** (crearían el defecto que no existe).

**El problema real es el que insinúa el encargo:** tras C-67 el CTA bajó a texto y el grupo derecho quedó visualmente más liviano **y más bajo**: la servida añade `underline underline-offset-4` permanente — 4 px de decoración por debajo de la basal (línea en y ≈47.7–48.7 vs el pie de caja visual del wordmark en 43.7) —, ensanchando la caja tipográfica del cluster hacia abajo. Además **desvía la receta firmada**: `MEJORA §7` fijó la barra como «solo texto: 15/600, **sin borde, hover `surface-elevated`**, foco 3/−3» `[P]`; la barra servida pintó subrayado permanente y hover de decoración en lugar del hover de superficie.

### 3.2 Receta exacta (números nuevos, sin firma)

| Elemento | Receta | Δ vs servido |
|---|---|---|
| Fila | `flex h-full items-center justify-between` + `gap-6` (24) en el `ul` | nada |
| Alineación | `items-center` (centro de mayúsculas compartido, y=38); **no** `items-baseline` (mezclar régimen mayúsculas-del-wordmark con versales-mixtas de los enlaces rompería el lockup) | nada |
| Alturas de hit | **compartidas: 44** los tres (wordmark-link, FAQ, CTA) dentro de 76 (16 arriba/abajo) | nada |
| FAQ | `h-11 inline-flex items-center rounded-[8px] px-4 text-[15px] font-medium text-text-primary hover:bg-surface-elevated` | `px-3→px-4` (simetría de caja hover con el CTA) |
| CTA | `h-11 inline-flex items-center justify-center rounded-[8px] px-4 text-[15px] font-semibold text-text-primary hover:bg-surface-elevated` | **retirar** `underline decoration-border-mid underline-offset-4 hover:decoration-text-primary`; **añadir** `hover:bg-surface-elevated` (aplicar la receta firmada O2 de `MEJORA §7`, no decisión nueva) |
| Lockup | ver §5 (isotipo 36 + wordmark 24): el lado izquierdo gana masa (≈260×36 visual vs ≈137×16 actual) → **compensa la liviandad derecha sin tocar el cluster**: la balanza deja de depender del subrayado | §5 |
| Compensación residual | si tras crecer el lockup el operador aún siente el cluster liviano, la palanca siguiente es subir FAQ a 600 (5→600); **no** se suben tamaños (15 es el rol botón `[P]`) ni se re-borda el CTA (reabriría C-67) | opcional, firma |

**Altura de hit del CTA:** sí, comparte altura de hit (44) — y ahora también comparte tratamiento hover (pastilla elevada 8 px, `transition-colors` 150 ms, ya servido en FAQ `[as-built]`): los dos nodos del cluster derecho dibujan la misma caja de 44 al hover, cosa que el subrayado no permitía.

**Baseline final con lockup nuevo:** wordmark a 24 → cap 17.3 → basal y≈46.7; enlaces y≈43.4; Δ 3.3 px **entre régimenes tipográficos distintos (marca vs navegación)**: aceptado y documentado — el canon de alineación del chrome es centro de hit, no una basal común entre 24 y 15 px; forzar basal común exigiría wordmark ≤16 px, que viola el piso de marca (24 px, `MANIFEST`): el conflicto se resuelve a favor de la marca (§5), y la fila se mantiene centrada.

**Drawer móvil `[as-built nav-drawer.tsx]`:** fila propia 76 con `Menú` 13/600 y cerrar 44×44; ítems h-12 (48) gap-4; CTA bordado a ancho completo — todo conforme, nada se cambia (el bordado vive bien en el drawer: no compite con coral en pantalla).

---

## 4. Fondos suaves con wan-image

### 4.1 Veredicto con la restricción que el encargo exige

**Entra UNA sola imagen de fondo: banda 9 (CTA final).** No reparto fondos por repartir. Motivo general: sobre bandas de texto denso, el patrón «foto a sangre + titulares» es la vía más corta a la catástrofe de contraste; y el sitio ya rechazó la decoración abstracta generada (`CANON §6` orden 3, el `hero` rechazado del 2026-11-05 `[P] MEJORA §0/UX-SPEC`). La banda 9 es la única donde (a) el texto es grande y escaso (1 H2 + 1 lead + 1 botón), (b) la superficie oscura permite un scrim de **un token propio** (`surface-dark`) sin inventar tinta, (c) la escena de negocio (mesas, barra, mostrador) refuerza «qué se vende» justo en el momento de decidir, y (d) no toca ninguna cota firmada.

### 4.2 Descartes, banda por banda

| Banda | Veredicto | Motivo |
|---|---|---|
| 1 hero | **no** | `[P]` prohibido: «Sin imagen raster: LCP es texto Bebas» (`UX-SPEC §2.1` fila 1); referencia hero del 2026-11-05 ya **rechazada** (`CANON §6`) |
| 2 franja | **no** | banda ligera nueva; fondo `surface-elevated` plano; 3 claims + iconos ya llenan la pista; imagen bajo 14-px de cuerpo = peor relación texto/fondo del sitio |
| 3 cómo funciona | **no** | texto sobre blanco con tarjetas blancas: cualquier fondo resta la frontera tarjeta↔banda (blanco/crema ya es 1.24 inválida `[V]` y se sostiene con bordes; sobre imagen sería peor) |
| 4 canales | **no** | 4 tarjetas de 267 con mini-escenas SVG propias aceptadas (`CANON §6` «canales: aceptada»); un fondo rivaliza con sus ilustraciones declaradas |
| 5 aplicaciones | **no** | **ya tiene 3 ilustraciones generadas declaradas** (acta §12); un fondo sería un cuarto competidor visual en la banda más ilustrada |
| 6 panel | **no** | es un panel de datos de ejemplo etiquetados (acta §13); fondo tras cifras compite con la lectura |
| 8 FAQ | **no** | acordeón 14–17 px en columna de 632; el texto más denso del sitio |
| 10 pie | **no** | pie claro firmado con receta servida; además el anillo firmado sobre fondo de imagen claro sería impredecible |

Si el operador quiere dos fondos, la única segunda colocación defendible es **banda 4 con la imagen SOLO bajo las 4 tarjetas** (nunca bajo el H2), con las tarjetas opacas `surface-default` encima — no la prescribo ahora: añadiría 2 condiciones sin firmar para ganancia marginal.

### 4.3 Composición exacta (banda 9)

| Atributo | Valor |
|---|---|
| Proporción | **2:1 panorámica** (banda completa 1440×~470 ≈ 3:1; se recorta con `object-cover`) |
| Qué debe verse | escena de negocios en penumbra cálida: mesas de restaurante desenfocadas a la izquierda, barra de café con taza al centro-izquierda, mostrador de comercio con bolsa kraft a la derecha |
| Zona vacía | **el centro geométrico debe ser sombra cálida sin objetos ni bordes** (es donde cae el texto de 632 centrado) |
| Qué lado ocupa | full-bleed con peso compositivo en los tercios laterales (15–25 % x y 75–85 % x); los cantos quedan para la escena, el centro para el texto |
| Luminancia máxima | ningún píxel más claro que `background-page` #F7E5C8 (lo fija el prompt y lo audita el gate) |
| Lado oscuro | sombras hacia madera tostada; detalle mínimo en el centro |

### 4.4 Receta de atenuación (mecanismo exacto + contraste calculado)

Capas, de abajo a arriba, dentro de `section.relative.overflow-hidden`:

1. Fondo sólido de la sección: `bg-surface-dark` (base bajo la imagen — regla `[P]` EFECTOS: «el `background-color` va siempre debajo de la imagen»).
2. `<Image>` absoluta `inset-0 h-full w-full object-cover object-center`, capa visible solo `md:` y arriba.
3. Capa scrim: `div.absolute.inset-0.bg-surface-dark/88` — **color de token + alfa, sin hex nuevo**; patrón con precedente servido (scrim del drawer `bg-surface-dark/55` `[P] NAVBAR §A.6`). **Un solo uso, inline, no se nombra token.**
4. Contenido en `div.relative` (queda sobre las dos capas).

- **No** se usa `filter: blur` (presupuesto: 0 `filter:` `[P] EFECTOS §3`; el desenfoque se consigue en generación + fuente ya blanda), **no** `mix-blend-mode` (imposible de auditar con fórmula WCAG), **no** gradiente direccional (añade una segunda incógnita de luminancia sin beneficio con α 0.88).
- **Contraste del texto sobre la zona MÁS OSCURA… y más clara del resultado** (el riesgo sobre banda oscura no es la zona oscura sino la **clarera** del fondo visible a través del scrim). Peor caso: píxel del brillo máximo permitido (#F7E5C8) bajo scrim α=0.88 → compuesto **#353130** `[D]`:

| Par | Ratio [D] | Umbral | ✓ |
|---|---|---|---|
| H2 `on-dark` / #353130 | **10.41** | 3.0 grande | ✓ holgado |
| Lead 18 / #353130 | **10.41** | 4.5 | ✓ |
| Declaración 12 `on-dark-secondary` / #353130 | **6.57** | 4.5 | ✓ |
| Kicker `on-dark-secondary` / #353130 | **6.57** | 4.5 (13 px semibold) | ✓ |
| Label del botón `ink` / coral | **5.61** | 4.5 | ✓ (opaco, inmune al fondo) |
| Anillo foco del botón (ink sobre coral) | **5.61** | 3.0 | ✓ |

- Rango operativo del scrim: α ∈ [0.80, 0.90] mantiene todos los pares ≥4.5 sobre el peor píxel crema (α0.80: lead 8.15, declaración 5.14 `[D]`). **Valor firmado en el plano: 0.88.** Regla de seguridad para el gate: medir el píxel más claro de la imagen final; si supera la luminancia de #F7E5C8, subir α de 0.02 en 0.02 hasta re-pasar 4.5 (se anota en acta).
- **La imagen sigue aportando a α=0.88?** Sí, declaradamente: se lee como penumbra cónica de negocio (calidez, siluetas, bokeh), no como foto nítida; el H2 de 64 sobre la textura sostenida es el efecto buscado («ayuda a entender qué se vende» sin competir). **Si el gate la ve borrosa-inlegible tras el scrim → la respuesta válida es bajar la apuesta: banda 9 sólida sin imagen** (el sitio no pierde ninguna función; se registra en acta). Esta salida queda escrita antes de generar.

### 4.5 Prompt literal wan-image (molde `MEJORA §5`; una imagen = una tarea de generación, ≤1 reintento)

Molde idéntico al de banda 5 (`Fotografía editorial realista horizontal proporción …`, prohibiciones iguales). **Banda 9:**

```text
Fotografía editorial realista horizontal proporción 2:1 de la interior en penumbra cálida de un restaurante pequeño de barrio: mesas de madera con mantel suave desenfocadas hacia la izquierda, una barra de café con una taza y su platillo borrosas en el centro-izquierda, y hacia la derecha un mostrador de comercio con una bolsa de papel kraft, todo en desenfoque profundo (bokeh cálido, sin bordes nítidos). Iluminación natural cálida lateral de ventana, paleta crema, madera tostada y blanco hueso sobre sombras oscuras cálidas. El centro geométrico de la imagen es una zona de sombra vacía, sin objetos, sin bordes y sin brillos. Sin personas, sin manos, sin rostros. Sin texto, letras, números, logotipos ni marcas en ninguna superficie. Sin códigos QR ni retículas que parezcan escaneables. Sin colores fríos, sin azul, sin verde, sin gris azulado. Ningún píxel más brillante que un crema cálido suave; sin destellos especulares. Estética de negocio auténtico de barrio, limpia y en penumbra; que no parezca banco de imágenes genérico.
```

Prohibiciones del encargo cubiertas: personas/manos/rostros ✓, texto legible ✓, logotipos de terceros ✓, QR escaneable ✓, colores fríos ✓, banco de imágenes ✓ (todas en el prompt + el control visual anti-QR de `MEJORA §5` se hereda: si el resultado tiene patrones escaneables, se regenera o descarta).

### 4.6 Entrega, peso y carga

| Aspecto | Valor |
|---|---|
| Fuente | 1536×768 (2:1) desde wan-image; si el MCP no sirve 2:1, generar la proporción horizontal más cercana y recortar a 2:1 en post → **no lo verifico: los tamaños reales del MCP quedan sin comprobar (§8)** |
| Derivado | `public/img/fondos/banda-9-escena.webp` — ruta espejo de `public/img/ilustraciones/` `[as-built acta §12]` |
| Dimensiones finales | **1456×728** (2× de 728×364, pliegue ancho del fondo efectivo); `width/height` explícitos en `<Image>` (CLS ≤0.02 `[P]`) |
| Peso | objetivo ≤ **90 KB** (techo de la captura grande, `[P] UX-SPEC §6.2` presupuesto «captura ≤45/55/90 KB»); bytes medidos se anotan en el manifiesto de la entrega como exige `UX-SPEC §6.2` |
| Carga | `<Image … priority={false} loading="lazy" sizes="100vw" alt="" />` + capa contenedora `aria-hidden="true"` — banda bajo el pliegue = diferida; **decorativa**: `alt=""` + `aria-hidden` (`UX-SPEC §6.2` regla «decorativas alt='' + aria-hidden»); la declaración al lector la lleva la línea visible del §2.2, no el alt |
| Móvil | **no se carga raster**: la capa completa es `hidden md:block` (a <768 la banda es sólida `surface-dark`); ahorra el peso donde la escena no se vería |
| Prohibido | `fetchpriority` del hero no se toca; la imagen **no** puede ser LCP (el LCP sigue siendo el H2 texto `[P]`) |

---

## 5. Logo en la barra — lockup cerrado con isotipo

### 5.1 Hechos de la marca (leídos, no re-abiertos)

- `MANIFEST.md` `[P snapshot]`: lockup horizontal mínimo **108×36** digital; wordmark **nunca <24 px**; isotipo **≥16 px** (a 16, variante **sin los 3 puntos**); resguardo **0.5 × altura del isotipo** por lado; lockup vigente = **isotipo SVG inline (`currentColor`) + wordmark como texto vivo en HTML**; lockups SVG derivados (`logo-horizontal/vertical/mono-*.svg`) **derogados**.
- `logo-symbol.svg` `[P snapshot]`: viewBox `0 0 128 128`, `fill="none" stroke="currentColor" stroke-width="16"`, 4 escuadras de escaneo + bocadillo rotado −8° con 3 puntos (relleno `currentColor`). Una tinta.
- `UX-SPEC §4` fila Lockup `[P]`: «isotipo `aria-hidden` dentro del lockup; a 16 px sin los 3 puntos» — coherente con el manifiesto.

### 5.2 Resolución del conflicto wordmark: 16 px servido vs piso 24 px de marca

**El wordmark servido (16 px `[as-built site-header.tsx:103]`) viola el piso de marca del manifiesto (24 px).** No es preferencia: es mínimo duro. Resolución: **subir el wordmark a 24 px** en las tres colocaciones. Números nuevos:

| Atributo | Valor nuevo | Qué cambia |
|---|---|---|
| Tamaño wordmark | **24 px** Montserrat 600 (piso del manifiesto, tomado exacto: sin inflar a 28/32 — el header no crece tipografía sin necesidad) | 16→24 |
| Tracking | 0.12 em **porta** (`MEJORA §3` firmado) | nada |
| Interlineado | `leading-none` porta | nada |
| Caja visual del wordmark | alto 24 (antes 36 de caja con texto 16 dentro: la caja se **reduce** a lo que ocupa el texto; el hit del enlace sigue 44) | span `h-9` → texto 24 con `leading-none` |
| Ancho intrínseco estimado | ≈ **206 px** (`[D]` 11 mayúsculas × (0.66+0.12) em × 24; banda de estimación 195–225) — **la caja final la fija el gate midiendo** (regla B-10; la estimación no es cota) | ~137→~206 |
| Isotipo | **36 × 36 px** en horizontal (es la cota que hace que el lockup cumpla el mínimo 108×36: altura del lockup = 36 → alto del isotipo 36; con dots porque 36 ≥ 16, la variante sin-puntos solo aplica a 16) | nuevo |
| Gap símbolo↔wordmark | **18 px** = 0.5×36 (resguardo mínimo exigido por el manifiesto) | nuevo |
| Caja lockup horizontal | 36 + 18 + ~206 ≈ **260 × 36** [estimado, gate remide] | — |
| Resguardo perimetral del lockup | ≥18 px por los 4 lados: izquierda = 16 de `px-4` del header **+** el aire del container — insuficiente por 2 px → **se corrige**: el enlace del lockup recibe `pl-1` (4 px) extra, total 20 ≥ 18 ✓; derecha: el cluster está a ≥100 px (justify-between) ✓; arriba/abajo: hit 44 centrado en fila 76 → 16 px de aire + borde de barra en y 75: del isotipo (ocupa 38±18 → 20–56) al canto superior 20 ✓ y al borde inferior 19 ✓ | medido sobre las cotas de §3 |
| Alto del hit | 44 (`h-11`) porta — **no crece**: la barra de 76 es firma y no se toca | nada |
| Barra 76 / `main pt-76` | **intactos** (el lockup 36 cabe en el hit 44 que cabe en 76 con 16 de margen por lado) | nada |

**Qué se rompe del layout actual al crecer** (lista honesta):

1. **Criterio 4 de `MEJORA §10`** (caja del wordmark «≥132 y ≤160 px») queda obsoleto: la caja nueva ~206 (banda propuesta de gate: **195–225**). El as-built de `MEJORA §3` (16 px) queda superseded por este plano → **C-76, owner Operador** (reabre una pieza implementada en acta T1 — requiere acta nueva).
2. **Footer** `[as-built NAVBAR §B.4]`: celda de marca 267 px — lockup horizontal ≈260 cabe **con 7 px de aire**; si el ancho real medido supera la celda (métricas Montserrat ≠ estimación), el pie degrada a **variante vertical** del manifiesto (isotipo arriba + wordmark debajo — variante canónica existente) sin tocar las 4×267. El gate decide con medición.
3. **Barra móvil 375**: 16 + 260 + aire + burger 44 + 16 ≈ 336 ≤ 375 ✓ (aire ≥39). **A 320** (viewport del criterio 17): 336 > 320 ✗ → regla: **bajo 375 el header muestra solo el isotipo 36×36** (variante «isotipo solo» del manifiesto, marca válida) y el wordmark se oculta con `sr-only` conservando el DOM text; el `aria-label` del enlace ya nombra la marca. Nada más se ajusta.
4. Barra 992–1199: lockup 260 + cluster ~330 = ~590 ≤ 960 ✓ sin wrap; **no hay riesgo**. La fila nunca permite wrap (`whitespace-nowrap` en el wordmark, servido).

### 5.3 Resolución del segundo conflicto: coral de marca vs coral de UI

El manifiesto adopta `#FF5F44` como token de marca medido del PNG; el canon de UI usa `interactive-primary #FC5A41` (paleta firmada; `UX-SPEC §3.D` N-15b advierte explícitamente: *«#FC5A41 y #FF5F44 son tokens distintos y no intercambiables»*). **El isotipo es una tinta y se pinta con `currentColor` → en el chrome se fija con la clase de rol (`text-text-primary` sobre crema/barra; `text-on-dark` solo si alguna vez vive sobre oscuro) y no necesita ningún coral. La salida queda confirmada: cero coral en el lockup servido.** El conflicto subyacente —qué hex rige los **exports PNG** (favicon/OG, B-8)— sigue vivo y **no lo resuelve este plano**: registrado **C-77, owner Operador** (afecta al rescate de `brand-src`, no a la barra).

**Inline de la geometría:** la receta vigente del manifiesto es «SVG inline del símbolo + texto vivo». Copiar el **archivo** `logo-symbol.svg` al repo está prohibido al frontend por el encargo (`UX-SPEC §6.3`: «no copies ni movas nada de marca ahora» — el rescate es acción del operador). La implementación pega **la geometría** (los paths del símbolo) dentro de un componente `brand-mark.tsx` como JSX inline con `currentColor`, igual que ya se hizo con burger/chevron/iconos `[as-built]`; el archivo fuente queda intocado en el snapshot. Interpretación registrada en **C-81** (una línea de acta del operador la cierra).

### 5.4 Lockups cerrados por colocación

| Colocación | Receta |
|---|---|
| **Barra desktop ≥992** | `a[href="/"] aria-label="ScanSayDone — ir al inicio"` (porta) > `svg` 36×36 `aria-hidden="true" focusable="false"` class `text-text-primary` (inline, `stroke-width 16` de viewBox se escala a 36/128≈4.5 px de trazo efectivo) + `gap-[18px]` + `span` «ScanSayDone» Montserrat 600 **24 px** uppercase .12em `leading-none` `text-text-primary` `whitespace-nowrap`; hit `inline-flex h-11 items-center pl-1`; foco 3/−3 (ink/crema 14.28 ✓). Foco visible sobre la caja de 44; hover ninguno (es marca `[P] MEJORA §3`) |
| **Barra móvil 375–767** | idem; **<375: solo isotipo 36×36** + wordmark `sr-only`; burger 44 a la derecha (orden y objetivos intactos) |
| **Pie** | mismo lockup horizontal **estático** (`div`, no enlace — no se duplica el href `[P] NAVBAR §B.4`); fallback variante vertical si mide >267; color `text-primary` sobre crema 14.28 ✓; resguardo lateral ≥18 respecto de la tagline (basta con `mb-4` = 16… el resguardo es del **isotipo**: 0.5×36=18 → el bloque de marca queda `pb-[18px]` antes del tagline en la variante horizontal; en vertical el resguardo aplica bajo el wordmark y `mt-4` de la tagline → se sube a `mt-[18px]` si el gate lo exige) |
| **Drawer** | el drawer no lleva lockup (encabezado «Menú» + cerrar) `[as-built]` — nada que especificar |
| **aria** | el `aria-label` del enlace porta («ScanSayDone — ir al inicio»): el nombre accesible NO cambia con el CSS uppercase ni con el símbolo; símbolo siempre `aria-hidden`; TTS lee el label, no el span |
| **Prohibido** | estirar la caja (4.2:1 vetado `[P]`), versión con/puntos a <16 (no aplica: mínimo servido es 36), hex nuevo, coral, Bebas en wordmark, `role="img"` en un aria-hidden |

### 5.5 Qué pasa si el ancho crece más allá del espacio disponible a 992

No crece a 992 con estos números (260+330 ≪ 960, §5.2-4). La cadena de contención queda escrita para el futuro (nuevos ítems C-55 Precios, label C-56): (1) el cluster derecho solo admite `gap-6`; (2) si la suma lockup+cluster > container−32, **primero** se retira ítems al drawer y **nunca** se encoge el wordmark bajo 24 ni el isotipo bajo 16 (pisos de marca) ni se wrap-pela la fila; (3) a 375 la regla del isotipo-solo ya cubre el peor caso. Cada salto de esa cadena es decisión de acta, no de código.

---

## 6. Plan por fases y firmas

| Fase | Pieza | Qué necesita antes de código | Qué NO necesita firma |
|---|---|---|---|
| **F1** (P1) | Banda 2 | acta normal: cadenas de §1.2 (heredan `COPY-LANDING §2`), fondo elevated como rol-expandido (C-78) | geometría (auto-fit/gap/60 todo `[P]`); iconos (set cerrado `MEJORA §4`) |
| **F2** (P1) | Banda 9 | **C-79**: superficie oscura de banda + copy `¿LISTO PARA EMPEZAR?` + lead + decisión `/contactus` como destino final (`COPY-LANDING §13` ítem 6 sigue pendiente; micro «Sin tarjeta» queda fuera hasta confirmación explícita) | botón coral (receta servida del hero), anillo (funciona: único focable es el botón), cotas 960/100/60/64/56 `[P]`, SD-1→632 y SD-3→60 resueltos `[propuesta]` de este plano |
| **F3** (P2) | Lockup + alineación barra | **C-76** (wordmark 16→24 + isotipo: reabre `MEJORA §3`/criterio 4 implementado) y **C-81** (inline de geometría vs «no copies el archivo») | la corrección del CTA de barra a la receta O2 firmada (§3.2: quitar subrayado + hover elevated) es *aplicar* `MEJORA §7`, no decisión nueva — se implementa con gates normales |
| **F4** (P2) | Fondo banda 9 | **C-80**: prompt §4.5 aprobado, generación (wan-image, 1 imagen = 1 tarea, ≤1 reintento), línea de declaración visible; decisión de acta: scrim 0.88 fijo + regla de re-cálculo si el píxel más claro supera #F7E5C8; salida válida documentada: banda sólida sin imagen si la escena no se lee | mecanismo de capas (token+alpha precedentado); `<Image>` lazy/aria-hidden (reglas servidas) |

Dependencias: F2 y F4 tocan la misma banda → F4 se integra después de F2 verificada. F3 no bloquea a F1/F2. `#encuesta-demo` sigue con 3 puertas (no cambia); `/contactus` pasa de 1 puerta (pie, texto) a 2 (pie + botón coral de cierre).

---

## 7. Criterios binarios y verificables por pieza

**Banda 2**
1. El DOM de la home tiene la franja exactamente entre `hero` y `#como-funciona` (orden de hijos de `page.tsx`); fondo computed `rgb(240,216,189)`; bordes superior e inferior 1 px `rgb(138,111,85)`.
2. Contiene exactamente **3 claims** con las cadenas de §1.2 (as-test carácter a carácter); grep `3 PREGUNTAS` = 0; grep de la cadena QR = la literal del manifiesto de reglas (regla 9) sin variaciones.
3. **Cero headings, cero enlaces, cero buttons** en la sección (grep `h2|a |button` sobre el componente = 0); el outline del documento sigue sin saltos (axe `headings-order` = 0).
4. Contraste: axe 0 violaciones con la banda montada; pares de referencia: título 12.82, cuerpo 5.33 (calculados §1.4).
5. Container 960; tracks: 3×304 a ≥62rem, 2+1 en sm, 1 a 375; gap 24/16; py 60 en ambos cortes (computed).
6. Sin scroll horizontal a 320/375/576.

**Banda 9**
7. Sección con `id="cta-final"` + `scroll-mt-[92px]`, después de `#faq` y antes del `footer`; fondo computed `rgb(26,24,27)`; **cero borde** superior propio.
8. Exactamente **un** nodo focable en la banda (el botón); su label `Escríbenos`; `href="/contactus"`; relleno `rgb(252,90,65)`, label `rgb(26,24,27)`; alto computed 56 desktop; ancho 343 (100 %) móvil con h ≥48.
9. Conteo de coral en viewport plegado sobre la banda: **1**. Conteo de coral en viewport plegado sobre el hero: sigue **1** (no regresión).
10. Copy exacto §2.2 (as-test); grep `Sin tarjeta` = 0; grep `COMIENZA HOY` = 1; H2 es el único `h2` de la banda, Bebas, computed 64/44.
11. Kicker/lead/declaración en `rgb(201,182,166)` (on-dark-secondary) sobre la zona de texto; H2 y lead en `rgb(247,229,200)`; axe 0 violaciones con fondo de imagen montado (si F4 entra).
12. Foco del botón: computed outline 3 px `rgb(26,24,27)` offset −3 (ink sobre coral 5.61).

**Barra (alineación + lockup)**
13. Los tres nodos del cluster/fila comparten computed `height: 44` y centro y = 38±1 a 1440 (aserción de rectángulos).
14. CTA del header: grep de `underline|decoration` en `site-header.tsx` = **0**; tiene `hover:bg-surface-elevated`; FAQ e ídem; `gap-6` intacto.
15. Lockup: isotipo render 36×36 `aria-hidden="true" focusable="false"` + wordmark computed 24 px 600 uppercase tracking 2.88 px; ancho de caja dentro de la banda de gate (195–225; fuera → acta, no código); gap símbolo↔texto 18.
16. `aria-label` del enlace sin cambios; el DOM conserva el texto «ScanSayDone».
17. A 320: header muestra solo isotipo + burger sin scroll horizontal; a 375 lockup completo; a 992 fila sin wrap.
18. Barra sigue 76/`main pt-76` idénticos (criterio doble de NAVBAR A2; no regresión).

**Fondo banda 9 (F4)**
19. Capas en orden: `bg-surface-dark` sección → `<Image>` `inset-0 object-cover` `alt=""` contenedor `aria-hidden` `pointer-events-none` `hidden md:block` → scrim `bg-surface-dark/88` (computed `rgba(26,24,27,0.88)`); nada de `filter:`/`mix-blend-mode`/gradiente (grep = 0).
20. Webp ≤90 KB con bytes anotados; `width/height` explícitos = intrínsecos reales; `priority={false}`; cero cambio de LCP (sigue texto).
21. píxel más claro de la imagen medida ≤ luminancia de #F7E5C8 (audit de gate; si no, subir α y re-calcular tabla §4.4 en acta).
22. Revisión visual: sin personas/manos/rostros/texto legible/logos/QR escaneable; si el patrón parece escaneable → FAIL y se regenera descarta (criterio heredado `MEJORA §5/§10.7`).
23. La línea de declaración del §2.2 visible en DOM (as-test) si F4 entra; **banda sin F4 no la muestra** (grep acoplado a la existencia del raster).

**No-regresión global**
24. `git diff` del lote toca: `page.tsx`, 2 componentes nuevos de banda (`trust-strip.tsx`, `final-cta.tsx`), `site-header.tsx` (+`nav-drawer.tsx` si el lockup lo exige), `brand-mark.tsx` (nuevo), `site-footer.tsx` (lockup), tests nuevos; **cero** cambios en `globals.css` (cero tokens nuevos), `hero.tsx`, snapshot, `package.json` (cero dependencias nuevas), `page.tsx` de bandas 3–6/8.
25. Gates CANON §9 por fase con salida pegada: build · lint · tsc · tests · axe 1440×900 y 375×812 · capturas antes/después. **Ningún criterio se afirma cumplido aquí: son la lista de lo que el gate prueba.**

---

## 8. Conflictos abiertos con owner + lo que NO verifiqué

### Conflictos nuevos (C-76…C-82)

| # | Conflicto | Owner | Cierre |
|---|---|---|---|
| **C-76** | **Wordmark 24 px vs as-built 16 px.** El piso de marca del manifiesto (24) manda sobre la receta servida; reabre `MEJORA §3` y su criterio 10.4 (caja 132–160 → 195–225). Cambios derivados: caja del header fila intacta pero ancho ~+69 px; footer con fallback vertical; <375 isotipo-solo | Operador + frontend (implementa, gate remide) | acta nueva |
| **C-77** | **Coral de marca vs coral de UI:** `MANIFEST` adopta `#FF5F44`; canon UI `#FC5A41` (N-15b: no intercambiables). El chrome queda resuelto (isotipo una tinta → cero coral). El conflicto real vive en los **exports** (favicon/OG, B-8) | Operador | solo cuando habilite el rescate de `brand-src` |
| **C-78** | **Banda 2:** (a) claim 4 `3 PREGUNTAS` bloqueado por G-0/B-1/C-50 (número de preguntas sin firmar); (b) `surface-elevated` usado como superficie de banda (rol servido «tarjeta secundaria/DEMO» expandido, cero hex nuevo) | PM (a) / Operador (b) | G-0 cierra (a); acta (b) |
| **C-79** | **Banda 9:** superficie oscura de banda + 3 cadenas nuevas (`COPY-LANDING §13` ítem 6 nunca aprobado) + destino final `/contactus` cuyo canal está declarado pendiente (C-51): la puerta de conversión del cierre depende de B-5 para tener correo | Operador | acta única de banda |
| **C-80** | **Fondo banda 9:** prompt, scrim 0.88, línea de declaración visible, regla de re-cálculo; incluye la salida «sin imagen» si la escena no se lee atenuada | Operador (autorización de generar ya dada; falta copy+acta) | acta F4 |
| **C-81** | **Inline de la geometría** del símbolo en un componente vs literal «no copies nada de marca al repo»: lectura del designer — el archivo no se copia (snapshot intocado), la geometría se pega inline como hace la receta vigente del propio manifiesto | Operador | una línea en el acta |
| **C-82** | **SD-1/SD-3 resueltos como `[propuesta]`:** ancho 632 del bloque de la banda 9 y py-móvil 60 de la banda 2. Si el operador fija otros números, el plano se enmienda con fecha | Operador | acta de F1/F2 |

Heredados que este plano **no** reabre pero de los que depende: C-74 (cadena `Scan-Say-Done` con guiones: el lockup §5 se especifica sobre `ScanSayDone`; con guiones, wordmark 24 mide ≈+56 px → footer a variante vertical y móvil a isotipo-solo; gate remide), C-55/C-56 (ítems y destino fase 2 del CTA de barra), B-5 (datos de contacto), B-8 (vector oficial), C-72 (FAQ y la mención de ilustraciones: si entra la imagen de fondo, el acta puede decidir extender esa línea — no se autohabilita).

### Lo que NO verifiqué (límites de este plano)

1. **No corrí nada:** sin build/lint/tsc/tests/axe/Playwright. Cero PASS. Los ratios `[D]` de esta sesión están calculados con la fórmula WCAG sobre los hex servidos de `globals.css`; los `[V]` se citan de `UX-SPEC §3.B` sin recalcular.
2. **No medí anchos de render:** las cajas del wordmark (206/260/…) son estimaciones de métricas tipográficas; el gate las fija midiendo (B-10).
3. **No abrí wan-image ni verifiqué sus proporciones de salida** (2:1 es pedido, no comprobado); tampoco verifiqué compatibilidad de navegadores de ninguna propiedad nueva (no se añade ninguna: todo es patrón ya servido — alpha token, absolute, object-cover).
4. **No generé la imagen** ni audité su píxel más claro (criterio 21 delega al gate).
5. **No medí las alturas nuevas** (240/510, 470/460): aritmética propia sobre cotas `[P]`, no medición.
6. **No re-abrí firmas** (anillo, copy FAQ, ejes, barra 76): las uso como premisas.
7. El snapshot: leí `MANIFEST.md` y `logo-symbol.svg` **sin copiar ni editar nada**; no abrí PNGs ni mockups.

---

**Cierre de formato:** el landing queda completo de plano: 10 bandas con 2 y 9 especificadas; la barra con su lockup cerrado con números; el fondo con una sola colocación honesta y su contraste calculado capa por capa. F1/F2 cierran el pendiente (P1 del operador); F3/F4 son los adicionales (P2). Ninguna cifra inventada cruza el documento: donde no hay dato, hay `sin dato` con dueño.

---

## 9. Acta de la fase 1 (bandas 2 y 9) — 2026-11-06 (orquestador)

**Implementado.** La banda 2 entra como franja de apoyo entre el hero y «así funciona», con los tres claims que el producto sostiene hoy, iconos propios de la casa, `surface-elevated` entre borde y borde, y sin `h2`, ancla, CTA ni enlaces. La banda 9 entra después de la FAQ con superficie oscura, kicker, H2 en Bebas, lead y un único botón coral hacia `/contactus`. El orden de montaje quedó `Hero → TrustStrip → HowItWorks → Channels → Applications → PanelPreview → Faqs → CtaFinal`.

**Verificación medida:** **99 tests** (87 previos + 12 nuevos), `build` 14/14, `lint` 0 errores, `tsc` 0, **axe 0 violaciones**. Alturas reales a 1440/375: banda 2 **275/501** (estimado 240/510) y banda 9 **429/359** (estimado 470/460). Botón de 56 px exacto en ambos cortes, ancho íntegro del bloque en móvil, cero scroll horizontal a 375, cero `border-dashed`.

**Desvío medido:** la H2 de la banda 9 ocupa **1 línea** en móvil, no 2 como preveía el §2.4. Bebas es condensada y los 21 caracteres entran en 343 px a 44 px. No se bajó el tamaño (lo prohíbe el propio §2.2): se acepta la línea única.

**Declaración de fondo omitida a propósito:** la banda 9 va sólida porque la imagen todavía no existe. Publicar «La imagen de fondo es una ilustración generada» sobre una banda vacía sería declarar algo falso; la línea entra junto con la imagen en la fase 2.

### Hallazgo nuevo — C-83: dos «Escríbenos» en el mismo pliegue

La FAQ cierra con la cadena firmada `¿Otra duda? Escríbenos` y la banda 9, inmediatamente debajo, remata con un botón que dice `Escríbenos`. A 1440 quedan a 120 px; a 375, a 150 px. Comparten destino (`/contactus`), así que no es un conflicto de acción sino de **etiqueta repetida en la misma vista**, y debilita el cierre: el remate parece una segunda instancia del enlace de la FAQ en vez de la conclusión del landing.

Opciones, en orden de preferencia del orquestador:

1. **Dejar la banda 9 como está y acortar la línea de la FAQ** (toca una cadena firmada: C-49 → requiere firma).
2. **Cambiar el verbo del botón de la banda 9** (la cadena de esta banda ya está pendiente de firma en C-79, así que no reabre nada): p. ej. `Hablemos` o `Cuéntanos tu caso`. Coste: pierde la consistencia de verbo con la FAQ que el §2.3 usaba como argumento.
3. Aceptar la repetición y registrarla como intencional (el mismo verbo, el mismo destino, dos intensidades).

**Owner:** operador. No se cambió ninguna cadena firmada.

---

## 10. Correcciones del operador 2026-11-06 (banda 6, claim del QR, presentación de la franja)

> **Qué es:** cierre de tres correcciones pedidas por el operador tras revisar el landing implementado (F1). **Este §10 abre C-84…C-86.** No edito código; no corrí build/tests; cero PASS. Medición base `[M]` 1440×900 dada por el orquestador + as-built leído en esta sesión (`panel-preview.tsx`, `trust-strip.tsx`, `how-it-works.tsx`, `channels.tsx`, `applications.tsx`, `faqs.tsx`, `globals.css:24-36`).
> **Causa raíz medida de la banda 6:** es la única banda con escalón `2xl:max-w-mkt-2xl` (`panel-preview.tsx:85`). Breakpoints propios del sitio: `lg=992`, `xl=1200`, `2xl=1400` (`globals.css:27-29 [as-built]`). A 1440 entra 2xl → contenedor 1320 en x=60, mientras bandas 3/4/5 paran en xl → 1140 en x=150 (`how-it-works.tsx:32`, `channels.tsx:114`, `applications.tsx:40 [as-built]`). La figura queda además centrada por `lg:col-span-8 lg:col-start-3` (`:106`): en contenedor de 1320, tracks de 88 → x=284, w=872 `[D]` — exacto con lo medido.

### 10.1 Banda 6 — salida elegida: **(b) eje compartido 150, figura 872 a la izquierda**

| Elemento | Receta | Efecto a 1440 |
|---|---|---|
| Contenedor (`:85`) | retirar el escalón `2xl:max-w-mkt-2xl`; la escalera pasa a ser la misma de bandas 3/4/5: `max-w-mkt-sm md:720 lg:960 xl:1140` | contenedor **1140 en x=150**; eyebrow, `h2`, lead y bullets arrancan en **150** — un solo eje con cómo funciona/canales/aplicaciones |
| Wrapper de la figura (`:105`) | se conserva `mt-12 grid grid-cols-12 gap-6` (único hijo) | nada |
| Figura (`:106`) | quitar `md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3`; queda `col-span-12` + **`max-w-[872px]`** (izquierda, sin `mx-auto`) | figura **en x=150, ancho 872 exacto**, alto 545 por `md:aspect-[16/10]` porta; **268 px libres a la derecha** (margen interior del contenedor) |

- **872 no es número nuevo:** es la geometría autorada del panel — `LINE_W=872`, `BAR_VIEW_W=872` (`panel-preview.tsx:44,55 [as-built]`). El arbitrary `max-w-[872px]` es el primer piso en CSS de un valor ya firmado en el componente.
- **Requisitos duros, intactos:** borde del marco 1 px sólido `border-border-mid` y badge `DEMO` (`absolute left-4 top-4`) no se tocan; `md:aspect-[16/10]` y `figcaption` porta; 11 barras (11 `<rect>` generados de `demoData`) y los 3 KPIs (8,5 · 486 · 377) no se mueven; **cero coral** dentro del panel (ninguna clase de color cambia; `grep FC5A41|FD6E57|E84A33` en `panel-preview.tsx` = 0 hoy `[as-built]`).
- **Alto de banda a 1440:** ≈ **1041 sin cambio** `[D]` — la corrección es horizontal; figura sigue midiendo 545. Riesgo único: que el `h2` «TODO EN UN MISMO LUGAR» cambie de líneas en 1140 vs 1320 (Bebas 64: estimación ~530–560 px de avance → 1 línea en ambos). El gate remide y fija el número (B-10).
- **A 992** (=`lg` propio): contenedor 960 en x=16, figura `min(872, 960)=872` en **x=16 con el titular** — eje compartido también aquí; ancho 872 > los 632 que producía el centrado viejo → **mejora** la escala de las barras. A 768–991: contenedor 720, figura 720 (vs 596 viejo: también mejora; etiquetas svg pasan de ~9,6 a ~11,6 px `[D]`, escala del viewBox — el gate registra a 800 y 992). **Scroll horizontal: ninguno** (figura ≤ contenedor siempre).
- **A 375:** sin cambio material: contenido 343; figura `col-span-12` → 343; `aspect-auto` bajo md porta; barras ocultas (`hidden md:block`); titular y figura comparten x=16 igual que antes.

**Por qué caen las otras:**
- **(a)** contenedor 1140 con figura centrada: la figura volvería a x=284 (150+134). El síntoma textual del operador —«el dashboard al medio»— **sobrevive**: titular y figura seguirían sin borde común.
- **(c)** figura 1140: obliga a reescribir la geometría firmada del panel (11 barras y 3 KPIs con +268 px). Con `aspect-[16/10]` el alto pasa 545→712 (+167): barras y etiquetas SVG se inflan ~1,31× (números de barra de 14 a ~18 px, por encima del lead de 17–18 de la propia banda) y la línea `preserveAspectRatio="none"` se estira. Rediseño del as-built de acta §13 sin ganancia de lectura.
- **(d)** (titular centrado / contenedor 960 con figura centrada): centrar el titular rompe el alineamiento izquierdo de todo el landing; la variante 960 deja el mismo desface (44 px) en miniatura.

**Nota de coherencia (reemplazo parcial):** el operador había aceptado tres ejes de titular (150/60/240) cuando las bandas 2 y 9 no existían. Esta corrección **reemplaza parcialmente esa aceptación**: el eje **60 desaparece** (la banda 6 se mueve al eje 150). **Quedan en pie** el eje 150 (bandas 3/4/5, ahora también la 6) y el eje 240 de la franja de confianza (contenedor `mkt-lg` 960 firmado en §1.3) — la queja del operador no los nombra y la escalera centrada 150→240→404 (FAQ/banda 9) sigue siendo coherente. No se reabre ningún otro eje: **C-85, owner Operador, acta normal.**

### 10.2 Claim del QR — cadena corregida (reemplazo del canon, con autorización)

La regla 9 de `UX-SPEC §5.1:346` **exige una cadena literal** (`no se varía ni se reescribe a mano`) y hoy vive como constante `CANONICA_QR` en `faqs.tsx:9`. El operador autorizó el cambio («eso corregirlo», 2026-11-06, consignado en el encargo). Se sustituye el canon **por acta, con fecha**, no por edición silenciosa:

| | Cadena vieja (deja de usarse) | Cadena nueva |
|---|---|---|
| Título claim 3 | `EL QR NO SE REIMPRE` (literal servido, subjuntivo defectuoso) | **`TU QR NO CAMBIA`** (3 palabras, ≤4 ✓, indicativo, tuteo coherente con «TUS CLIENTES» del claim 2) |
| Cuerpo / canon | `El mismo QR sirve para siempre: no hay que reimprimirlo.` | **`Si imprimes otro cartel, el código es el mismo.`** (47 car. ≤60 ✓, una línea, indicativo, cero promesa de durabilidad física: afirma invariancia del código, no del objeto) |

- **Qué se sustituye exactamente:** la literal de `UX-SPEC §5.1` regla 9 (línea 346) y su reflejo en `COPY-INTERNAS §1` → enmienda fechada 2026-11-06 por el operador/PM (**C-84, owner Operador**). La FAQ `¿Tengo que reimprimir el QR cada vez?` (`faqs.tsx:25`) pasa a responder con la cadena nueva: la respuesta funciona en ambos contextos (banda 2 y FAQ) porque describe el hecho de diseño, no una promesa.
- **Defecto gramatical cerrado:** indicativo en las dos cadenas («no cambia», «imprimes… es»); cero subjuntivo «reimpri*a*».
- **Hallazgo de mecanismo `[as-built]`:** `trust-strip.tsx:22` **duplica la literal a mano** en vez de importar la constante — la regla 9 («desde una constante compartida») está violada en el as-built aunque el string coincidiera. Con el cambio: la constante compartida se sube a un módulo único (p. ej. `src/lib/copy-canonical.ts`, export de `CANONICA_QR`) que importan `faqs.tsx` y `trust-strip.tsx`; la literal nueva aparece **una sola vez** en `src`. Tests acoplados a actualizar en el mismo lote: `trust-strip.test.tsx:15,33` y `faqs.test.tsx:18`.
- Icono `icon-sin-reimpresion` (hoja + flecha de retorno) **porta**: el giro semántico es reutilización, no duración; no se reabre el set cerrado T1.

### 10.3 Franja de claims — presentación: filetes verticales editoriales (separación por borde)

**Una mejora, un mecanismo ya firmado** («elevación/separación por borde y color, no por sombra»): dos **filetes verticales de 1 px** entre las tres columnas, de icono a cuerpo, sin tocar tipografía, fondo ni track.

| Parámetro | Número |
|---|---|
| Filetes | 2, ancho 1 px, `bg-border-mid` #8A6F55 (token servido, cero hex nuevo), `aria-hidden="true"`, `pointer-events-none`, **absolute** dentro del wrapper de la retícula (`relative`) |
| Posición a 1440 | centro del gap 1: **x=556**; centro del gap 2: **x=884** (tracks 304 en 240/568/896; gaps 544–568 y 872–896 `[D]` sobre contenedor 960 medido) |
| Fórmula responsive | `left-[calc((100%-48px)/3+12px)]` y `left-[calc(2*((100%-48px)/3)+36px)]` — exacta sobre cualquier contenedor con `gap-6` y 3 tracks |
| Altura | `inset-y-0` = altura del contenido (icono top → body bottom): ≈ **155 px** a 1440 (banda medida 275 − py 120 `[D]`) |
| Aire | 12 px de clara a cada lado del filete (semigap) |
| Corte | `hidden md:block`: filete **solo con 3 tracks** (≥768, md con contenedor ≥736); a 544–767 (2+1 tracks) y móvil (1 track): **cero filetes**, la separación la hace el gap 16/24 como hoy |
| Contraste | filete↔elevated **3.40** `[D §1.3]` ≥3 ✓ (elemento no textual); superficies y pares de texto **intactos**: elevated #F0D8BD no cambia; title 12.82, body 5.33 `[V]` |
| Altos resultantes | **275 ±2 a 1440** y **501 ±5 a 375** `[M acta §9]` — los filetes son absolute: **cero cambio de layout**; el gate re-mide |

**Coral: NO.** Un acento coral en los iconos competiría con el coral del hero (regla «un solo coral por pantalla»: al scrollear, banda 2 puede compartir pliegue con el hero) y rompería el presupuesto firmado. Los iconos quedan `text-text-primary` como hoy. **Tamaños: NO.** Subir el icono 32→40 cambiaría el trazo efectivo del set cerrado (1,5×40/24 = 2,5 px) y reabriría acta §13 sin pedirlo. **Dos filas: NO.** Duplicaría el alto de una banda cuyo rol es «ligera» `[P §1.3]`. **Cifra/palabra destacada: NO** en esta vía — cifras vetadas (`UX-SPEC §5.2`); destacar palabra exigiría una segunda tinta o coral. **C-86, owner Operador, acta normal.**

### 10.4 Qué se reabre / qué no

- **Se reabre:** geometría interna de banda 6 (clases `:85/:106`), las 2 cadenas del claim 3 + sus tests, el mecanismo de la constante compartida (hoist), y se **reemplaza parcialmente** la aceptación previa de ejes (60 fuera; 150/240 y la escalera 150→240→404 quedan).
- **No se reabre:** ningún copy firmado (C-49 FAQ, C-67 barra, C-48 anillo), panel interno de la banda 6 (barras/KPIs/badge/caption/aspect), py/gap/tracks y fondo elevated de la banda 2, banda 9 (C-83 sigue pendiente, ajeno a esto), C-76…C-83.

### 10.5 Criterios binarios del gate (añadidos a §7)

1. A 1440: x del eyebrow/h2 de `#panel` = **150 ±1** y x izquierdo de la figura = **150 ±1**, ancho figura **872 ±1**, alto figura **545 ±2**; cero elemento de la banda con borde izquierdo en x=60.
2. Figura: computed border 1 px sólido `rgb(138,111,85)`; badge `DEMO` visible en left-4/top-4 (captura); DOM conserva 11 `<rect>`, los 3 KPIs y el `figcaption` exacto; `grep FC5A41|FD6E57|E84A33` en `panel-preview.tsx` = 0.
3. A 992: titular y figura comparten x (16 ±1), ancho figura 872; a 375: figura 343, alto auto, cero scroll horizontal en 375/320; alto de banda a 1440 re-medido y anotado (tolerancia ±30 vs 1041).
4. Claim QR: as-test exactos `TU QR NO CAMBIA` y `Si imprimes otro cartel, el código es el mismo.` en banda 2 y en la respuesta de la FAQ; grep de `sirve para siempre` y `EL QR NO SE REIMPRE` en `src/` = **0**; la literal nueva aparece **1 vez** en `src` (constante compartida importada por ambos componentes).
5. Franja: exactamente **2** filetes a ≥768 (computed 1 px `rgb(138,111,85)`, `aria-hidden`) y **0** a 375; cero `h2`/enlaces/botones nuevos (no regresión de §7.3); altura banda 275 ±2 a 1440 / 501 ±5 a 375; cero coral (los 3 iconos siguen `rgb(26,24,27)`).
6. Docs: enmienda fechada de `UX-SPEC §5.1` regla 9 y de `COPY-INTERNAS §1` en acta antes de publicar la cadena nueva (**C-84**).

### 10.6 Lo que NO verifiqué

- Nada ejecutado: sin build/lint/tests/axe/Playwright; **cero PASS**. Los x/anchos citados son aritmética sobre la medición `[M]` del encargo + clases leídas, no re-medición mía.
- Líneas del `h2` y alto final de banda a 1140 (estimados 1 línea/±0); escala de etiquetas SVG a 720/872 estimada por viewBox.
- El `figcaption`/badge los verifiqué por lectura estática, no por captura.
- El axis del hero (`hero.tsx:6` tiene su propia escalera con `px-4 sm:px-6 lg:px-8`) **no lo audité** — fuera del encargo; si el operador pide un pase global de ejes, es otra tarea.
- Si los 268 px libres a la derecha convencen visualmente es criterio del operador con captura; el descarte de (c) queda por si prefiere panel ancho (reabriría geometría firmada del panel).
- La corrección de la FAQ por duplicación de constante toca `faqs.tsx` (banda 8, no prohibida pero fuera del «un solo archivo»: la especifico aquí para que frontend la ejecute; yo no la edito).

---

## 11. Acta de ejecución de las correcciones — 2026-11-06 (orquestador)

**Aplicado:** la banda 6 pierde el escalón `2xl` y pasa al contenedor de 1140 con su `figure` de 872 alineada a la izquierda (**x=150**, antes 60); el claim del QR se sustituye por `TU QR NO CAMBIA` / `Si imprimes otro cartel, el código es el mismo.` y la cadena se sube a `src/lib/copy-landing.ts`, que ahora importan la franja y la FAQ (antes estaba duplicada a mano); la franja de confianza se suma al eje 150 con tracks de 364 y dos filetes de 1 px entre columnas.

**Medido:** **103 tests**, `build` 14/14, `lint` 0 errores, `tsc` 0, **axe 0 violaciones**. Franja en **x=150** con tracks de 364 y los tres títulos en **una línea** (antes el segundo partía en dos); filetes en 526 y 914 a 1440 y **0** a 375; figura del panel en **150/872/545**; banda 6 en 1041; franja en 245 a 1440 y 481 a 375.

**Un objetivo no se cumplió y no era alcanzable:** la proporción trazo/bloque del panel quedó en **19 %** contra el ≥55 % pedido. Con escala 0–10 y datos entre 7,4 y 9,2 el trazo ocupa 18 % por aritmética, no por CSS. Se resolvió por otra vía: **el vacío ahora es un eje** con referencias en 0, 5 y 10 y sus etiquetas, así que el espacio que antes estaba en blanco dice dónde cae la línea. La franja blanca grande desapareció; lo que queda es información.

**Desvío menor:** el alto de la franja en móvil bajó de 501 a 481 porque el cuerpo del claim nuevo es más corto (47 caracteres frente a 60) y envuelve menos. Es consecuencia de la corrección de copy, no un defecto.

**Nota sobre la alineación:** la franja estaba en 960 centrado por canon; se movió a 1140 para compartir eje con el resto. Esto **reemplaza parcialmente** la aceptación previa de los tres ejes de titular: hoy la página tiene 150 (bandas 2, 3, 4, 5, 6), 404 (bloque de la FAQ, centrado a propósito) y el bloque de 632 del cierre. El eje 60 desapareció.

**Sin tocar y pendiente:** C-83 (dos «Escríbenos» en el mismo pliegue) sigue abierto; la franja no lleva CTA, así que no lo empeora.
