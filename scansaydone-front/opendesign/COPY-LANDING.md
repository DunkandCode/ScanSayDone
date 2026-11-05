# COPY-LANDING — Scan-Say-Done · texto definitivo
> 2026-10-28 · designer-alibaba · solo copy, cero código · **rev. C1–C4 aplicada (revisión code-support `--area frontend` + lectura propia) · C5 = registro documental de los eyebrows F8.5 (2026-10-28, no aprueba contenido: lo aprobará el operador vía §13): ver §15**. Orden y rol de secciones: `UX-LANDING.md §2`. Gates de promesa: `RIESGOS-USUARIO.md §D` (D1 verificable, D2 cero prueba social inventada). Voz: `DECISIONES-2026-10-27.md §2/§3` (vocabulario opiniones/avisos, prohibido jerga). Marcas `[corchetes]` = el operador debe definir antes de publicar.

## 0. Reglas aplicadas
- Tuteo, español neutro-latino, directo. Cero jerga (CSAT/NPS/score/KPI/engagement/feedback). Cero emoji. Cero cifras inventadas.
- Cero absolutos sin ancla: ningún tiempo medido en copy publicable sin dato de piloto; las condiciones se redactan como hecho de diseño, no como promesa de plan *(revisión C2)*.
- Fit físico verificado: H1 Bebas 88→~18 car./línea desktop (col-md-7 ≈640 px), ~14 en móvil (60 px). Botones Montserrat 600 15 px ≤25 car.

## 1. Hero (banda ciruela)
- **Kicker (13 MAY):** `3 PREGUNTAS. UN QR. LISTO.` *(hecho diferencial, no promesa — revisión C4: el kicker describe lo que gana el dueño, no la mecánica del cliente)*
- **H1 (Bebas, 2 líneas):** `¿QUÉ DICEN` ⟵ `TUS CLIENTES?` *(10 / 13 caracteres — cabe móvil; 2+3=5 palabras; tildas correctas)*
- **Subtítulo (16 palabras):** `Tus clientes responden tres preguntas desde el navegador. Tú lees opiniones y avisos en un panel.` *(beneficio concreto del dueño — revisión C4; sin absolutos sin ancla — revisión C2)*
- **CTA primario:** `CREAR MI ENCUESTA` *(3 palabras)*
- **CTA secundario (ghost):** `VER EJEMPLO` *(2 palabras)*
- **Microcopy bajo botón:** `Sin app y sin registro para tus clientes.` *(cierto y acotado al cliente)*
- **Prueba bajo CTA (dos frases afirmativas, revisión C1):** `Tus clientes responden sin instalar nada ni crear cuenta. Tú entras con tu correo, sin contraseña y sin app.` *(el dueño SÍ tiene cuenta: magic link; dos frases afirmativas y separadas, sin construcción global ni doble negación)*
- **Bajada de marca:** `ESCANEA. OPINA. LISTO.` — solo donde la marca se presenta (footer, piezas, OG); **no** va como kicker del hero *(revisión C4)*
- **Insignia:** ninguna — el nombre vive en el logo del nav. *(opcional, solo si el operador confirma piloto: `PILOTO EN CURSO`)*

## 2. Franja de confianza (sin logos — no inventar)
**Elección por defecto — 4 claims de producto (verificables hoy):** *(titulares y cuerpos = lo implementado en la franja, `src/app/page.js:84–106`; orden de lectura del strip)*

| # | Titular | Body (14 · `--text-2`) |
|---|---|---|
| 1 | `3 PREGUNTAS` | `Rápidas, sin registro ni datos personales.` |
| 2 | `SIN INSTALAR NADA` | `El cliente responde desde el navegador.` |
| 3 | `SIN CUENTA PARA TUS CLIENTES` | `Cero fricción, cero excusas para opinar.` |
| 4 | `EL QR NO SE REIMPRE` | `Un solo código sirve para siempre.` |

**3 opciones honestas evaluadas (para reemplazar el claim de conteo):**
- **A. Prueba de tracción:** `Piloto con 5 negocios en curso` — **solo si el operador lo confirma**. Sin confirmación, se omite. Nunca número fabricado.
- **B. Datos del producto (elegida y publicada):** la tabla de arriba — implementada literal en la franja. Cero dependencia de casos.
- **C. Promesa de inmediatez:** `Tu primera opinión, hoy` + body `En cuanto pegas el QR: no hay nada que configurar.` — **no usada**: con la opción B publicada, no queda claim de conteo que sustituir.

## 3. Cómo funciona (3 pasos)
- **Título (Bebas 64):** `ASÍ FUNCIONA`
- **Eyebrow `.section-kicker` (F8.5, pendiente de aprobación → §13.7):** `SIMPLE Y RÁPIDO`
- **Subtítulo (≤18 palabras):** `Tú lo armas en minutos. El cliente responde en segundos.`
- **Paso 1 — `ESCANEA`:** `Tus clientes escanean el QR del mostrador o tocan el enlace de tus redes.` *(14 palabras)*
- **Paso 2 — `OPINA`:** `Tres preguntas, una por pantalla. Sin registro y sin datos personales.` *(11)*
- **Paso 3 — `LISTO`:** `Tú lees las opiniones y los avisos en tu panel, desde el celular.` *(13)*
- **CTA ghost de sección:** `VER EJEMPLO DE ENCUESTA` *(4 palabras, límite exacto)*

## 4. Canales (4 tarjetas)
- **Eyebrow `.section-kicker` (F8.5, pendiente de aprobación → §13.8):** `SIEMPRE CERCA DE TUS CLIENTES`
- **Título:** `TUS CUATRO CANALES` · **Lead:** `Donde ya está tu cliente: el local, sus redes y el chat.` *(12 palabras)*

| Tarjeta (≤5 palabras) | Descripción (≤22) | Línea "cómo se usa" |
|---|---|---|
| `EN EL MOSTRADOR` | `Coloca el QR en la mesa o el mesón. El cliente escanea, responde y sigue su día.` *(17)* | `QR impreso en la mesa` |
| `INSTAGRAM` | `Tus seguidores opinan desde el enlace de tu bio o de tus historias.` *(12)* | `Enlace en la bio` |
| `WHATSAPP` | `Envías el enlace por WhatsApp después de la venta. Responden simple, sin instalar nada.` *(14)* | `Enlace en el chat` |
| `TIKTOK LIVE` | `Muestras el QR o el enlace en pantalla durante tus lives. Tu público deja su opinión.` *(15)* | `QR o enlace en pantalla` |

Sin CTA por tarjeta (`UX-LANDING §2`: informativas). Ninguna promesa de API de TikTok ni envío automático.

## 5. Aplicaciones en contexto (patrón lámina: rótulo + foto + caption 2 líneas)
- **Rótulo overline:** `APLICACIONES` — desde F8.5 usa la clase compartida `.section-kicker` (texto intacto) · **Título:** `ASI SE VE EN TU LOCAL` *(6 palabras)*

| Caption línea 1 (nombre, 600) | Caption línea 2 (uso, 14 · `--text-2`) |
|---|---|
| `Cartel de mesa` | `En la mesa, junto al plato o la cuenta.` |
| `Pantalla de encuesta` | `Lo que ve tu cliente: del 1 al 5, una pregunta por vez.` |
| `Vinilo de vitrina` | `El QR a la calle, para quien solo pasa.` |

## 6. Panel del dueño (captura 16/10 + callouts)
- **Eyebrow `.section-kicker` (F8.5, pendiente de aprobación → §13.9):** `TUS OPINIONES, EN UN PANEL`
- **Título:** `TODO EN UNA PANTALLA` · **Subtítulo:** `Entras, lees las opiniones, ves los avisos. Nada que configurar de más.` *(12)*
- **Bullets (≤12 palabras):**
  - `Opiniones con fecha y canal: mostrador, Instagram, WhatsApp o live.` *(10)*
  - `Los avisos urgentes van primero, no al final de la lista.` *(11)*
  - `Lo abres en el celular entre un cliente y otro.` *(10)*
- **CTA ghost:** `VER MI PANEL` + badge `DEMO` *(en vez de "VER DEMO": mismo límite de 4 palabras del wireframe)*

## 7. Precios — `NO PUBLICAR hasta tener precios reales` *(revisión C3 · borrador interno)*

> **NO PUBLICAR hasta tener precios reales.** En el primer lanzamiento esta sección **no se publica**: se oculta con el flag existente `SITE.features.showPricing` (el proyecto ya usa `features.*` en `src/app/data/site.js`; con el flag en `false`, la sección entera queda fuera de la página). El copy de los 3 planes de abajo es **borrador interno** (marcado `borrador`): no es texto de lanzamiento, no se maquetará visible hasta que el operador fije montos.
- **Título:** `PLANES` · **Kicker:** `Sin permanencia` *(⚠ [confirmar: política de contrato] — borrador; desde F8.5 usa la clase compartida `.section-kicker`, texto intacto)* · **Recomendado visual:** Profesional (DOM: recomendado→Básico→Negocio, `UX-LANDING §3.6`)

**Tabla — `borrador` (NO publicar, C3):**

| Plan | Para quién (1 línea) | Precio | 4 features (≤8 palabras) | CTA |
|---|---|---|---|---|
| `BÁSICO` | `Para partir: un mostrador, una encuesta.` | `[precio] / mes [moneda]` | `Encuesta de tres preguntas` · `Un QR y un enlace [confirmar]` · `Panel con opiniones y avisos` · `Cliente responde sin registro` | `EMPEZAR` (ghost) |
| `PROFESIONAL` ★badge `RECOMENDADO` | `Para el local que ya vende por Instagram y WhatsApp.` | `[precio] / mes [moneda]` | `Todo lo del plan Básico` · `Canales separados: mostrador y redes` · `El mismo QR, sin reimprimir` · `Avisos de respuestas urgentes` | `EMPEZAR` (primario) |
| `NEGOCIO` | `Para más de un local o más de una marca.` | `[precio] / mes [moneda]` | `Todo lo del Profesional` · `Varias encuestas, un solo panel [confirmar]` · `Acceso por local [confirmar]` · `Trato directo con nosotros [confirmar]` | `HABLAR` (ghost) |

Regla: ninguna feature fuera del MVP. Los `[confirmar]` marcan reparto de planes que el operador no ha fijado — el frontend no publica la tabla con corchetes. **Y la sección completa queda detrás de `SITE.features.showPricing = true` (C3): mientras no existan precios reales, no se renderiza ni se enlaza.**

## 8. FAQ (6 · respuestas ≤35 palabras)
- **Eyebrow `.section-kicker` (F8.5, pendiente de aprobación → §13.10):** `DUDAS COMUNES`

1. **¿Cuánto demora mi cliente en responder?** `Tres preguntas cortas, una por pantalla. Sin registro ni instalación: se responden en el momento, ahí mismo.` *(17)*
   *[Nota interna — NO publicable:* `[verificar tras piloto: mediana <30 s]`. *La cifra de "20 segundos" sigue sin medir: se retiró del copy y solo vuelve si la mediana real del piloto la respalda (gate §F).*]
2. **¿Necesito que mis clientes se registren?** `No. Abren el QR o el enlace y responden. Sin cuenta, sin app, sin datos personales.` *(16)*
3. **¿Sirve si vendo por Instagram o TikTok?** `Sí. Cada encuesta tiene un enlace que va en tu bio, en tus historias, en un chat de WhatsApp o en pantalla durante un live.` *(23)*
4. **¿Qué pasa si pierdo el QR?** `El código no cambia: lo imprimes de nuevo desde el panel o vuelves a compartir el mismo enlace, sin crear otra encuesta.` *(22)*
5. **¿Quién ve las opiniones?** `Solo tú, con tu cuenta. El cliente deja su opinión y no ve las de otros. Nunca pedimos datos personales.` *(19)*
6. **¿Puedo probarlo antes de pagar?** `Hoy puedes armar tu encuesta y ver cómo llega tu primera opinión. [CONFIRMAR: si habrá prueba gratis o plan de entrada, y con qué duración.]` *(26 con el corchete; el corchete no se publica — y el "pagar" de esta pregunta queda igualmente oculto mientras `SITE.features.showPricing` sea `false`, C3)*

Pie de acordeón: `¿Otra duda? Escríbenos` → `/contactus`

## 9. CTA final (banda ciruela)
- **Eyebrow `.section-kicker--on-dark` (F8.5, pendiente de aprobación → §13.11):** `COMIENZA HOY`
- **Título (Bebas 64):** `CREA TU PRIMERA ENCUESTA` *(4 palabras; corte 3+1, cabe móvil: 15/8 car.)*
- **Subtítulo (1 línea):** `Del QR a la primera opinión, sin equipo técnico.` *(9)*
- **Botón:** `CREAR MI PRIMERA ENCUESTA` *(4 palabras, h56)*
- **Micro:** `Sin tarjeta` ⚠ **solo si el operador lo confirma; si no, se elimina la línea**
- **Descalificación honesta (1 línea):** `Si no recibes clientes en el local ni vendes por redes, hoy esto todavía no te sirve.` *(16)*

## 10. Footer (banda crema, decisión acta §4)
- **Descriptor bajo logo:** `Mejores experiencias para cada negocio.` *(marca — se queda en footer/brand)*
- **Bajada de marca:** `ESCANEA. OPINA. LISTO.` *(solo aquí y en piezas/OG — donde la marca se presenta; ya no es kicker del hero, C4)*

| Columna | Enlaces |
|---|---|
| `Producto` | Cómo funciona `#como-funciona` · Canales `#canales` · *(Precios `/pricing` oculto mientras `SITE.features.showPricing = false` — C3)* |
| `Recursos` | Preguntas frecuentes `/faqs` · Ver ejemplo `#panel [confirmar URL demo]` |
| `Legal` | Términos `/terms` · Privacidad `/privacy` |
| `Contacto` | Escríbenos `/contactus` · `[correo]` |

- **Barra legal (14px):** `© [año] [razón social]. Todos los derechos reservados.`

## 11. Tabla de mensajes clave (lo que debe quedar en la cabeza)
| # | Mensaje |
|---|---|
| 1 | Tus clientes responden tres preguntas; tú lo lees en el panel. |
| 2 | Tus clientes responden sin instalar nada ni crear cuenta. Tú entras con tu correo, sin contraseña y sin app. |
| 3 | Funciona donde tu cliente ya está: mostrador, Instagram, WhatsApp, TikTok live. |
| 4 | El mismo QR sirve para siempre: no hay que reimprimirlo. |
| 5 | Herramienta simple para negocios chicos, en piloto — no magia, no jerga. |

## 12. Lo que NO se dice (y por qué)
1. **Cifras de clientes, logos ni testimonios** — no existen todavía; probarlos en el piloto y recién entonces subirlos (D2).
2. **CSAT, NPS, score, KPI, engagement, "feedback"** — el dueño no habla ese idioma (B7); usamos opiniones, comentarios, avisos.
3. **IA sobre comentarios, app nativa, WhatsApp automático, integración API de TikTok** — fuera del MVP; prometerlas = romper D1.
4. **"Más de X negocios confían en nosotros"** — conteo fabricado; solo dato real confirmado por el operador.
5. **Precios, "gratis para siempre" ni promesas de ventas** — montos sin fijar y resultado no verificable en el piloto (D1). La sección §7 va completa detrás de `SITE.features.showPricing` y marcada `NO PUBLICAR` (C3).
6. **"El QR no caduca" como frase suelta** — es cierto por diseño, pero se redacta con su condición: `El mismo QR sirve para siempre: no hay que reimprimirlo.` Nada sobre planes ni expiración (C2).
7. **Cifras cronometradas en copy publicable** — ningún tiempo medido sin dato de piloto; el diferencial real y verificable hoy son `3 PREGUNTAS` (C2). La única referencia al número retirado vive en la nota interna de FAQ 1, marcada `[verificar tras piloto: mediana <30 s]`.

## 13. Los textos que el operador debe aprobar antes de publicar *(6 fundacionales + 5 eyebrows F8.5)*
| # | Texto | Por qué compromete |
|---|---|---|
| 1 | H1 `¿QUÉ DICEN / TUS CLIENTES?` + kicker `3 PREGUNTAS. UN QR. LISTO.` | definen la promesa del hero (kicker: hecho diferencial, C4); F8.5 pinta `CLIENTES?` en `--brand-coral` sobre ciruela — **la cadena no cambia**, solo su color (excepción registrada en `DESIGN-CONTRACT §1/§6`) |
| 2 | CTA `CREAR MI ENCUESTA` / `VER EJEMPLO` | acción principal y ruta a demo |
| 3 | Franja §2, opción A `Piloto con 5 negocios en curso` | afirma tracción — solo si es verdad; hoy NO publicada |
| 4 | Tabla de precios `[precio]` + features `[confirmar]` | negocio, no diseño — sección `NO PUBLICAR` detrás de `SITE.features.showPricing` (C3) |
| 5 | Nota interna de FAQ 1 `[verificar tras piloto: mediana <30 s]` | promesa cronometrada sin medir (gate §F); el número no entra en copy publicable (C2) |
| 6 | CTA final + micro `Sin tarjeta` | riesgo reverso: afirmar pago inexistente |

**Eyebrows F8.5 — cadenas implementadas en `2b3c8ca`/`b93943b` antes de nacer en este documento (excepción al proceso B1 de `UPGRADE-VISUAL-F8.5 §6`; registrada en la pasada C5, 2026-10-28).** El gate de aprobación sigue abierto: si el operador rechaza una, **se cambia o borra en `src/app/page.js`**, no se legitima callando la lista.

| # | Texto (sección) | Por qué compromete |
|---|---|---|
| 7 | `SIMPLE Y RÁPIDO` (§3 Cómo funciona) | revive el adjetivo de velocidad que C2a retiró del copy; cualitativo, sin cifra — requiere visto bueno explícito |
| 8 | `SIEMPRE CERCA DE TUS CLIENTES` (§4 Canales) | reformula el lead aprobado "Donde ya está tu cliente…" (§4); sin promesa verificable nueva |
| 9 | `TUS OPINIONES, EN UN PANEL` (§6 Panel) | ⚠ **cadena actualizada (2026-10-28)**: la promesa original "en tiempo real" no estaba verificada (gate D1). Reemplazada por una formulación verificable que describe el panel como receptor de opiniones. |
| 10 | `DUDAS COMUNES` (§8 FAQ) | rótulo de sección; sin promesa |
| 11 | `COMIENZA HOY` (§9 CTA final · variante `--on-dark`) | invitación temporal sin marca cronometrada; coherente con el CTA §9 |

*(No son copy nuevo: `APLICACIONES` (§5) y `Sin permanencia` (§7, borrador C3) ya figuraban aquí — F8.5 solo les cambió la clase a `.section-kicker`, el texto quedó intacto. El kicker del hero (§1) **no** se unificó: conserva `.hero-kicker` mostaza sobre ciruela.)*

## 14. Fuentes
Docs: `UX-LANDING.md §2/§3/§5` · `DECISIONES-2026-10-27.md §2/§3/§4` · `RIESGOS-USUARIO.md §A2/§B7/§D/§F` · `referencias/ANALISIS-REFERENCIAS.md §1/§4`. Skills: session-anchor-system, caveman-core, design-system-mastery, awesome-claude-design-mastery, frontend-design, landing-page-design. Criterio propio declarado: descalificación honesta del §9 y columna "cómo se usa" de §4.

## 15. Cambios aplicados tras revisión *(C1–C4 · 2026-10-28)*
Revisión: `code-support` (Go `second-opinion --area frontend`) + lectura propia. Decisiones tomadas por el operador; aplicadas sin reapertura.

| # | Cambio | Antes → Después | Razón |
|---|---|---|---|
| C1 | Registro: dos frases afirmativas | `Nada que instalar ni registrarse, para las dos partes.` (construcción global, eliminada) → `Tus clientes responden sin instalar nada ni crear cuenta. Tú entras con tu correo, sin contraseña y sin app.` (hero + §11.2) | El dueño SÍ necesita cuenta (magic link): la promesa global era falsa. Frases afirmativas y separadas; construcción global y doble negación eliminadas. |
| C2a | Cifra cronometrada fuera del copy publicable | Hero, franja §2.3 (titular con el tiempo medido), FAQ 1, §11.1 → diferencial real `3 PREGUNTAS`; la cifra retirada queda solo en la nota interna bajo FAQ 1, marcada `[verificar tras piloto: mediana <30 s]` | No hay medición de piloto (gate §F, riesgo D1). Un absoluto sin ancla no se publica. |
| C2b | QR: hecho con condición | `NO CADUCA` / `El mismo QR sirve hoy y en un año` · `Tu código no cambia ni caduca` · `QR que no caduca` (Profesional) · §11.4 → `El mismo QR sirve para siempre: no hay que reimprimirlo.`; FAQ 4 responde solo a la pérdida (reimprimir desde el panel) | Cierto por diseño, pero redactado como condición; prohibido afirmar sobre planes o expiración. |
| C3 | Precios: NO PUBLICAR | §7 de sección publicable a `borrador interno` con aviso `NO PUBLICAR hasta tener precios reales`, control por flag existente `SITE.features.showPricing` (`src/app/data/site.js`); enlace `/pricing` del footer oculto con flag `false`; FAQ 6 ligada al mismo flag | Un placeholder `[precio]` en la sección de precios bloquea conversión y rompe D1. |
| C4 | Kicker: de mecanismo a hecho diferencial | Kicker hero `ESCANEA. OPINA. LISTO.` → `3 PREGUNTAS. UN QR. LISTO.`; `ESCANEA. OPINA. LISTO.` pasa a bajada de marca (footer, piezas, OG); descriptor `Mejores experiencias para cada negocio` se queda en footer/brand; subtítulo del hero reescrito al beneficio concreto del dueño (16 palabras) | El kicker describía lo que hace el cliente final, no lo que gana el dueño. |
| C5 | Registro documental de los eyebrows F8.5 *(2026-10-28, esta pasada — no aprueba contenido)* | — → línea `Eyebrow` en §3, §4, §6, §8, §9; nota de clase compartida en §5/§7; §13 añade ítems 7–11 con la advertencia D1 sobre `TU NEGOCIO EN TIEMPO REAL`; §1 ítem 1 anota el cambio de color (no de cadena) de `CLIENTES?` | Las cadenas se implementaron en `2b3c8ca`/`b93943b` antes de nacer en este doc; la enmienda regulariza el papeleo sin cerrar el gate de aprobación |
| — | H1 con tilde | `¿QUÉ DICEN` / `TUS CLIENTES?` — verificado: tildas ya correctas (mayúsculas Bebas con tilde), sin cambio | Check solicitado; confirmado por grep. |
