# REVISION-UX — 30-oct-2026 · producto completo

> Reemplaza a la revisión del 29-oct, que cubría **solo la landing**. Esta cubre todo lo construido: landing (9 rutas), login (`/entrar`), panel (`/panel`) y dashboard (3 secciones).
> Material: capturas de **página completa** en `capturas/2026-10-30/` · planos en `wireframes/` (+ `png/`) · cómo abrirlos en `COMO-VER-LA-ENTREGA.md`.
> Regla de esta revisión: nada de "se ve bien". Cada observación pide **qué** y **por qué**, con la pantalla y el ancho donde ocurre.

---

## 1. Qué se pide

Un pase visual de 45–60 minutos sobre 5 pantallas y su versión móvil. No hace falta leer documentación: las capturas bastan. Lo que necesito de vuelta:

1. **Lo que no se entiende** (jerarquía, copy, qué hace un botón).
2. **Lo que sobra** (elementos que no aportan o compiten).
3. **Lo que falta** para que cada pantalla se sienta terminada.
4. **Qué se ve más débil que el resto** y por qué.

Formato sugerido por observación: `pantalla · ancho (1440/375) · qué · por qué · qué harías`. Si algo no te gusta pero no sabes por qué, igual sirve: márcalo como "no me convence".

---

## 2. Mapa de lo que hay

| Ruta | Qué es | Estado |
|---|---|---|
| `/` | Landing del producto (8 bandas) | construida y verificada |
| `/aboutus` `/services` `/service-detail` `/contactus` `/faqs` `/pricing` `/privacy` `/terms` | 8 rutas internas | construidas; precios ocultos por flag |
| `/entrar` | Acceso del dueño (correo sin contraseña) | construida, **sin backend** |
| `/panel` | Dashboard: sección Resumen | construida, **sin backend** |
| `/panel/respuestas` | Dashboard: bandeja completa | construida, **sin backend** |
| `/panel/qr` | Dashboard: cómo comparte su encuesta | construida, **sin backend** |

**Qué es real y qué no**, porque cambia cómo se juzga:

- El sitio **no está publicado** (todo en `noindex`) y no se enlaza desde ningún menú.
- El login **no envía correos**: al enviar muestra "Revisa tu correo" con una banda `DEMO · no se envía ningún correo`.
- El dashboard **no tiene datos**: por defecto muestra el estado vacío. Para verlo lleno hay un interruptor `Ver con datos de ejemplo` en la barra superior, con badge `DATOS DE EJEMPLO`.
- El QR **no existe**: el marco vacío es intencional.
- No hay precios publicados, ni fotos reales, ni testimonios, ni cifras. Todo eso es deliberado.

Si algo te parece "incompleto", probablemente lo esté por diseño — pero dímelo igual: quizá el vacío comunica mal.

---

## 3. Las 5 pantallas

### 3.1 Landing — `/` (1440 y 375)

**Objetivo:** que un dueño de almacén entienda en 10 segundos qué es esto y qué gana.

**Qué juzgar:**
- ¿La primera banda dice qué es el producto, o solo lo insinúa?
- Los 8 bloques: ¿hay alguno que puedas quitar sin que se pierda nada?
- El CTA principal dice `Crear mi encuesta` y el secundario `Ver ejemplo`. ¿Se entiende qué pasa al pulsar cada uno, sabiendo que el producto todavía no se puede crear?
- La paleta (coral, ciruela, crema, mostaza): ¿el coral aparece demasiado?
- ¿Se siente 2026 o se siente plantilla?

**Riesgo conocido:** el solape de tarjeta entre bandas se descartó por medición; si te parece que falta profundidad, dilo y se busca otra vía que no rompa la retícula.

Capturas: `capturas/2026-10-29/` (19 cortes, build del 29-oct).

### 3.2 Rutas internas — `/aboutus` `/services` `/contactus` `/faqs` `/pricing` `/terms` `/privacy`

**Objetivo:** dar confianza y resolver dudas sin volver a la landing.

**Qué juzgar:**
- ¿Las 7 cabeceras se sienten de la misma familia o cada una parece otro sitio?
- `/contactus` es el caso raro: **no hay formulario**, hay una explicación y un canal por correo que hoy está vacío. ¿Se entiende o parece roto?
- `/pricing` está construida pero **oculta**: no la juzgues como publicada.

Capturas: `capturas/2026-10-29/` (cada ruta).

### 3.3 Login — `/entrar` · **nuevo**

**Objetivo:** que el dueño entre con su correo, sin contraseña y sin app.

**Qué juzgar:**
- El titular dice `LEE LO QUE / TE DICEN`. ¿Se entiende que es la puerta a leer las respuestas de sus clientes? ¿O suena a eslogan?
- La mitad derecha (panel + encuesta) cuenta el recorrido `EL CLIENTE ESCANEA · CONTESTA · TÚ LO LEES`. ¿Se lee, o es decoración que distrae de escribir el correo?
- El botón principal está **deshabilitado** hasta que el correo es válido, y se ve como botón fantasma. ¿Se entiende que hay que escribir primero, o parece que el botón está roto?
- ¿El gradiente del panel derecho suma o ensucia?

Capturas: `full-login-1440.png`, `full-login-375.png` + `entrar-1440-error.png`, `entrar-1440-enviado.png`.

**Decisión abierta:** el aviso `DEMO · no se envía ningún correo` aparece **después** de pulsar. Antes, la pantalla promete el flujo completo. ¿Conviene adelantarlo (honesto pero menos producto) o dejarlo (más producto pero promete de más)?

### 3.4 Dashboard · Resumen — `/panel` · **nuevo**

**Objetivo:** entrar y ver de un golpe cómo está la cosa.

**Qué juzgar:**
- Con la barra lateral de 264 px y 3 secciones, ¿se navega claro o sobra?
- Las 3 tarjetas con barras 1–5: ¿se entiende la distribución sin leyenda? El número final (`8 RESPUESTAS`) ¿ayuda o sobra?
- El estado vacío ocupa media pantalla. ¿Se siente acompañamiento o se siente hueco?
- La tabla de "últimas respuestas" muestra solo 5 filas y un enlace `Ver todas las respuestas`. ¿Suficiente?

Capturas: `full-panel-resumen-1440.png` (con datos), `full-panel-resumen-vacio-1440.png` (por defecto), `full-panel-resumen-375.png`.

### 3.5 Dashboard · Respuestas — `/panel/respuestas`

**Objetivo:** revisar caso por caso.

**Qué juzgar:**
- Los 5 filtros de canal y las dos fechas: ¿se entiende que hoy no filtran nada? (Están deshabilitados sin datos; con datos quedan inertes.)
- La tabla tiene 5 columnas: fecha, canal y las 3 preguntas. ¿El orden es el correcto para el dueño?
- En móvil la tabla se convierte en tarjetas apiladas. ¿Se sigue leyendo?

Capturas: `full-panel-respuestas-1440.png`, `full-panel-respuestas-375.png`.

### 3.6 Dashboard · Mi QR — `/panel/qr`

**Objetivo:** entender cómo llega la encuesta al cliente.

**Qué juzgar:**
- El marco vacío con borde discontinuo: ¿se entiende que "aquí irá el QR" o parece un error de carga?
- Los 3 pasos (escanea, contesta, lees): ¿se leen en 5 segundos?
- El campo con `https://tu-dominio/e/XXXXXXXX · ejemplo`: ¿se entiende que es un ejemplo y no su enlace real?

Capturas: `full-panel-qr-1440.png`, `full-panel-qr-375.png`.

---

## 4. Lo que ya se corrigió (para no volver a pedirlo)

Estas observaciones ya están aplicadas; si vuelven a aparecer, es una regresión y quiero saberlo.

| Pantalla | Correcciones aplicadas |
|---|---|
| Landing | FAQ en banda blanca · objetivos táctiles ≥44 px · CTA del footer eliminado · títulos de footer en overline · jerarquía `h1→h2→h3` · foco visible |
| Landing | un solo uso de coral como texto (una palabra del H1 sobre ciruela, 5.08:1) |
| Login | `h1` a 64 px reales · split 50/50 exacto (720/720) · botón deshabilitado legible (6.62:1) · enlaces subrayados · validación propia en vez de la nativa · correo con espacios aceptado · `h1` conservado al enviar · foco gestionado |
| Dashboard | marca del sidebar en una línea · switch de demo a la derecha · línea de honestidad del QR dentro de la tarjeta · marco del QR 264×264 · chips con desplazamiento interno en móvil · filtros deshabilitados que se ven deshabilitados |

---

## 5. Lo que yo veo más débil (para que lo confirmes o lo contradigas)

Ordenado por lo que más me incomoda, no por esfuerzo:

| # | Dónde | Qué me molesta | Prioridad |
|---|---|---|---|
| 1 | `/entrar` | El botón principal deshabilitado en estilo fantasma: en reposo la pantalla no tiene ningún elemento coral que ancle la mirada. El login se ve apagado al abrir | P0 |
| 2 | `/panel` | El aviso `DATOS DE EJEMPLO` queda huérfano debajo de las tarjetas, sin nada que lo ancore. Se lee como etiqueta suelta | P1 |
| 3 | `/panel/respuestas` | Las 3 columnas de preguntas tienen anchos desiguales (352/207/279) porque el ancho lo dicta el texto. Se ve descuidado | P1 |
| 4 | `/entrar` | El glow del panel derecho sigue siendo intenso; en la esquina superior izquierda el ciruela se ensucia hacia marrón | P1 |
| 5 | `/panel/qr` | El icono del marco vacío (`FiGrid`) es genérico; no dice "QR" | P2 |
| 6 | `/panel` | El check de éxito y el icono de error usan verde y rojo puros, fuera de la paleta de marca (están tokenizados, pero son tonos nuevos) | P2 |
| 7 | Global | El título de sección de cada ruta interna y el de las secciones del panel usan escalas distintas (Bebas 44 vs Bebas 44 pero con distinta densidad). ¿Se nota el salto al pasar de marketing a producto? | P2 |

---

## 6. Decisiones que necesitan tu lectura

| # | Decisión | Opciones |
|---|---|---|
| 1 | Verbo del CTA principal de la landing | `Crear mi encuesta` vs `Escríbenos` vs el actual |
| 2 | El nav de la landing baja a ghost al hacer scroll | sí / no |
| 3 | Aviso DEMO antes o después de enviar en el login | antes / después |
| 4 | Las 3 preguntas del producto: Q1 está aprobada (`¿Cómo fue tu atención?`), **Q2 y Q3 siguen abiertas** (`¿Volverías?`, `¿Qué mejorarías?`) | aprobar o proponer otras |
| 5 | Color del estado de éxito (hoy verde tokenizado) | verde / ciruela |

Las tres primeras son de una línea y se cambian rápido. La 4 es de producto: si cambian, se toca un archivo y se recaptura.

---

## 7. Cómo dejar el feedback

- Por observación, no por pantalla completa: una línea por cosa.
- Si es algo visual concreto, indica el ancho (1440 o 375).
- Si propones un cambio, una frase basta; no hace falta diseñarlo.
- Lo que no quieras priorizar, dilo igual: "esto no me importa" también es información.

Y si de todo esto hay que rescatar una sola cosa para arreglar antes de seguir: dime cuál.
