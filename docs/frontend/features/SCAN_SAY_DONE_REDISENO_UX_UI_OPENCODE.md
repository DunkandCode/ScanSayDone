# Scan-Say-Done — Guía de rediseño visual de la landing

**Tipo de documento:** especificación UX/UI e instrucciones de implementación para agentes de desarrollo (OpenCode).  
**Referencia:** captura actual de la landing compartida en la conversación.  
**Objetivo:** convertir la página actual, hoy demasiado plana y centrada en texto, en una landing comercial más visual, clara, creíble y adaptable, **manteniendo su estructura, su contenido esencial y su funcionamiento**.

> **Instrucción principal para el agente:** No rehacer el producto ni cambiar su lógica. Mejorar la experiencia visual de la página existente, creando los recursos gráficos necesarios. El visitante debe entender en menos de cinco segundos qué ofrece Scan-Say-Done, dónde se utiliza y qué obtiene el negocio.

---

## 1. Qué es el producto y qué debe comunicar

Scan-Say-Done permite que **restaurantes, cafeterías y pequeños comercios** recojan opiniones de sus clientes mediante un código QR: la persona escanea, responde desde su navegador y el negocio consulta las respuestas en un dashboard de reportes.

La narrativa visual de toda la página debe ser:

**Un cliente visita un negocio → encuentra el QR → responde una encuesta breve → el dueño recibe información útil en su panel.**

Mensajes prioritarios, en este orden:

1. **Para quién es:** negocios que atienden clientes presencialmente.
2. **Cómo funciona:** QR + encuesta en celular + dashboard.
3. **Qué gana:** opiniones claras para mejorar atención y experiencia.
4. **Qué tan fácil es:** el cliente no necesita instalar una aplicación ni abrir una cuenta.

**No presentar** el sistema como una simple herramienta de generación de códigos QR ni como una encuesta genérica descontextualizada.

---

## 2. Diagnóstico del diseño actual

### Lo que se debe conservar

- Identidad cálida de crema/beige, negro y acento coral.
- Titulares de carácter fuerte y condensado.
- Navegación simple con FAQ y botón de encuesta de ejemplo.
- Orden de las secciones existente.
- Encuesta de demostración en el hero.
- Tres beneficios rápidos bajo el hero: **Sin instalar nada / Sin cuenta para tus clientes / El QR no se reimprime**.
- Flujo de tres pasos: **Escanea / Responde / Tú las lees**.
- Cuatro ubicaciones: **En la mesa / En el mostrador / En el cartel / En la tablet**.
- Tres ejemplos de negocios: **Restaurante / Café / Comercio pequeño**.
- Vista previa del dashboard, preguntas frecuentes, CTA final y footer.

### Problemas a corregir

| Problema | Acción requerida |
| --- | --- |
| Contenido muy reducido en un escritorio grande | Aumentar escala, usar un contenedor más ancho y equilibrar espacios. |
| Párrafos y tarjetas con letra pequeña | Elevar tamaño de tipografía y contraste. |
| Hero sin contexto real | Agregar fotografía/render de negocio con QR y UI de encuesta superpuesta. |
| Beneficios casi invisibles | Tarjetas o bloques con iconografía clara y jerarquía. |
| Tres pasos principalmente textuales | Dar protagonismo a ilustraciones que expliquen cada acción. |
| Cuatro canales representados por iconos diminutos | Crear microescenas de uso de QR reconocibles. |
| Fotografías de rubros demasiado parecidas | Usar escenas propias y distinguibles para cada rubro. |
| Dashboard con un gráfico y mucho espacio en blanco | Mostrar métricas, evolución, distribución y respuestas recientes. |
| Fondos uniformes sin profundidad | Introducir degradados sutiles, variación tonal y formas discretas. |
| CTA final oscuro desconectado visualmente | Mantener su función, pero integrarlo a la identidad del resto de la web. |

---

## 3. Dirección de arte y sistema visual

**Personalidad:** cercano, moderno, confiable y práctico. Es software para pequeños negocios, **no una web bancaria, un portal estatal ni una marca infantil**.

### Paleta sugerida

| Token | HEX | Uso |
| --- | --- | --- |
| `--color-bg` | `#FAF6F0` | Fondo marfil principal. |
| `--color-sand` | `#F6E4C9` | Alternancia de secciones y superficies cálidas. |
| `--color-card` | `#FFFFFF` | Tarjetas, encuesta y dashboard. |
| `--color-primary` | `#FF5944` | CTA, pasos, estados interactivos y acentos. |
| `--color-primary-hover` | `#E84B37` | Hover sobre CTA. |
| `--color-ink` | `#242123` | Texto principal. |
| `--color-muted` | `#665F59` | Texto secundario. |
| `--color-border` | `#E7D9CA` | Líneas y bordes suaves. |
| `--color-success` | `#247C56` | Indicadores positivos cuando correspondan. |

No utilizar los nueve colores a la vez en una misma tarjeta. Los protagonistas visuales deben ser **marfil + blanco + carbón + coral**.

### Tipografía

- **Títulos:** Bebas Neue (mantener la personalidad condensada actual), con tamaño y espaciado apropiados para legibilidad.
- **Párrafos, componentes y botones:** Inter o equivalente legible.
- **Hero H1:** `clamp(3rem, 5vw, 5.25rem)` según ancho y longitud real del texto.
- **H2 de sección:** `clamp(2.2rem, 3.4vw, 3.7rem)`.
- **Texto base:** 16–18 px; no depender de textos diminutos para encajar tarjetas.
- **Texto de apoyo:** 14–16 px, contraste suficiente.
- **Anchura de párrafo:** idealmente 45–65 caracteres por línea.

### Contenedores y componentes

- Contenedor principal de escritorio: **1160–1240 px**, con márgenes laterales fluidos.
- Separación vertical por sección: **80–112 px** en escritorio y **48–72 px** en móvil.
- Tarjetas: radio **14–20 px**, borde tenue y sombra muy suave.
- Botones: alto mínimo **44–48 px**, CTA coral predominante.
- Alineación consistente: títulos, subtítulos, grillas y cards usando los mismos límites de contenedor.
- Hovers sutiles: elevación 2–4 px, cambio leve de sombra/borde, sin animaciones excesivas.
- Iconos consistentes (preferencia Lucide para elementos funcionales).

### Fondos

- Alternar **marfil / blanco / arena** para facilitar el recorrido.
- Permitir un degradado marfil→melocotón suave en hero y CTA; las formas decorativas deben tener baja opacidad.
- Para el dashboard, utilizar fondo arena suave para contrastar con el panel blanco.
- **Evitar fotos a pantalla completa como fondo de texto**, patrones de QR invasivos, texturas fuertes o cambios bruscos a paletas distintas.

---

## 4. Especificaciones sección por sección

### 4.1 Header

**Conservar:** marca a la izquierda; FAQ y CTA «Ver una encuesta de ejemplo» a la derecha.

**Mejorar:**

- Logo más visible, con altura equilibrada respecto del menú.
- Padding horizontal y vertical constante.
- Botón secundario con borde tenue y estado hover definido.
- En móvil, navegación compacta, manteniendo acceso a FAQ y demo.
- Si el header es sticky, evitar que tape los anchors del sitio.

**Imágenes:** no hacen falta fotografías; usar el logo oficial, nunca una marca inventada.

### 4.2 Hero — principal prioridad visual

**Conservar mensaje:** «Lo que tus clientes piensan, antes de que se vayan».

**Problema:** actualmente el visitante ve la encuesta, pero no identifica enseguida el entorno donde se utiliza.

**Nueva composición escritorio:**

- Columna izquierda: eyebrow para restaurantes y comercios, H1, párrafo de valor y CTA coral.
- Columna derecha: composición **fotografía realista de negocio + soporte QR claramente visible + encuesta interactiva superpuesta**.
- La encuesta debe seguir siendo **un componente React funcional**, no texto dibujado dentro de una fotografía.
- QR en la fotografía = ilustración contextual, no sustituye un código QR real de producto.
- Añadir como máximo dos señales visuales pequeñas (p. ej. etiqueta «Sin instalar apps» o «Responde en segundos») si están respaldadas por el funcionamiento real.

**Subtítulo sugerido:**

> Descubre qué opinan de tu negocio con encuestas rápidas mediante QR. Tus clientes responden desde su celular y tú revisas los resultados en un solo lugar.

**Fondo:** marfil con degradado cálido lateral muy suave; sin interferir con la legibilidad.

**Imagen necesaria:** `hero-negocio-qr.webp` (véase inventario en sección 5).

### 4.3 Beneficios rápidos: tres bloques bajo el hero

**Conservar el contenido actual**:

1. Sin instalar nada.
2. Sin cuenta para tus clientes.
3. El QR no se reimprime.

**Mejorar:** tarjetas horizontales o tres bloques amplios con iconos de 28–36 px, título legible y una línea explicativa. Reducir el contraste duro del fondo actual y dar separación clara respecto del hero y de «Así funciona».

**Atención de producto:** la promesa «El QR no se reimprime» debe mantenerse únicamente si el QR enlaza de forma persistente a la encuesta correspondiente; revisar el comportamiento real antes de presentarla como garantía.

**Imágenes:** iconos SVG, no fotografías.

### 4.4 Así funciona

**Conservar tres pasos:** Escanea → Responde → Tú las lees.

**Mejora:** convertirlos en tres tarjetas más altas, con ilustración en la mitad superior y explicación breve abajo. Mantener números 1, 2, 3 en coral; conectar los pasos con flechas discretas en escritorio.

- **Escanea:** mano acercando celular a soporte QR sobre mesa.
- **Responde:** teléfono mostrando la pregunta y escala de satisfacción.
- **Tú las lees:** pantalla con panel de satisfacción y respuestas.

Los dibujos deben contar acciones, no ser tres iconos genéricos. En móvil, apilar tarjetas sin flechas horizontales.

**Fondo:** blanco o marfil muy claro.

### 4.5 Dónde está tu cliente

**Conservar cuatro tarjetas:** mesa, mostrador, cartel, tablet.

**Mejora:** sustituir los pictogramas actuales por **microescenas coherentes y reconocibles**; usar una zona visual aproximadamente del 55% de cada tarjeta y texto en el 45% restante.

| Canal | Qué debe mostrar la imagen | Mensaje breve |
| --- | --- | --- |
| En la mesa | Porta-QR sobre mesa de restaurante. | «El cliente escanea desde su asiento». |
| En el mostrador | Código junto a caja o terminal de pago. | «Pide una opinión al terminar la compra». |
| En el cartel | Afiche de QR junto a área de espera o pared. | «Una encuesta visible donde esperan». |
| En la tablet | Tablet mostrando interfaz de valoración. | «Respuestas desde un dispositivo del local». |

**Fondo:** arena clara; las imágenes deben tener igual iluminación, proporción y perspectiva.

### 4.6 Negocios que atienden en persona

**Conservar:** Restaurante, Café, Comercio pequeño.

**Mejora más importante:** las tres fotos actuales son similares. Mostrar actividades distintas, con el **QR incorporado al escenario real** y sin convertirlo en una publicidad genérica de cafeterías.

- **Restaurante:** mesa servida con plato, carta, vasos y soporte QR.
- **Café:** taza, barra o mesa de café y un QR visible.
- **Comercio pequeño:** mostrador con productos, bolsa, caja y QR.

Añadir debajo de cada rubro una pregunta de ejemplo:

- Restaurante: «¿Cómo estuvo la comida y la atención?».
- Café: «¿Qué te pareció el café y el servicio?».
- Comercio: «¿Cómo fue tu experiencia de compra?».

Estas preguntas se presentan como **ejemplos**, no como configuración real ya disponible, si esa funcionalidad no está implementada.

**Fondo:** blanco. Las fotografías deben tener la misma relación de aspecto (recomendación **4:3**) y una temperatura de color consistente.

### 4.7 Todo en un mismo lugar — dashboard

**Problema:** el panel actual, con unos pocos números y gráficos, no expresa suficiente valor.

**Diseñar e implementar una vista de demostración realista:**

- Encabezado «Resumen de satisfacción» + rango temporal de muestra.
- KPI: satisfacción general (por ejemplo, 8,7/10).
- KPI: cantidad de respuestas.
- KPI: evolución frente a período anterior, solo si el cálculo existe.
- Gráfico lineal de evolución de satisfacción.
- Distribución de calificaciones 1–10 o grupos claramente etiquetados.
- Lista de 3 respuestas recientes **ficticias etiquetadas como DEMO**.
- Opcional: filtros por ubicación y fechas, **solo si realmente están disponibles**.

**Importante:** construir el dashboard como **HTML/React + librería de gráficos**, no como una única imagen generada. De este modo será nítido en móvil, accesible y fácilmente reemplazable por datos reales. Para la landing puede usarse una captura del componente real como recurso de presentación si se requiere, pero nunca una imagen con números falsos presentada como evidencia de clientes reales.

**Fondo:** arena con elementos geométricos apenas visibles; dashboard sobre gran superficie blanca con sombra suave.

**Bibliotecas posibles:** Recharts o Chart.js (elegir una sola según el stack existente).

### 4.8 FAQ

**Conservar:** todas las preguntas y las respuestas existentes.

**Mejorar:**

- Aumentar ancho y legibilidad del acordeón.
- Cada ítem con padding generoso, borde tenue y chevron coherente.
- Estados abierto/cerrado accesibles por teclado (`aria-expanded`).
- Mantener enlace de contacto al final.
- No añadir imágenes: aquí la claridad del texto es protagonista.

**Fondo:** blanco o marfil claro.

### 4.9 CTA final «¿Listo para empezar?»

**Conservar CTA y enlace de contacto.**

**Mejora:** el bloque negro actual corta abruptamente la estética; preferir una sección **carbón cálido** con borde/radio y acentos coral, o un fondo coral/arena cuidadosamente contrastado. El objetivo es que el CTA final destaque sin verse como otra web.

- Título grande y breve.
- Frase que resuma el beneficio: «Escucha a tus clientes y descubre qué mejorar».
- Botón principal «Escríbenos» con destino real existente.

**Imágenes:** opcional motivo de QR abstracto muy tenue; no es necesaria una foto aquí.

### 4.10 Footer

**Conservar:** marca, eslogan, enlaces de Producto, Contacto y Legal, copyright.

**Mejorar:** espaciado, contraste, distribución por columnas y navegación móvil. No inventar páginas legales que todavía no estén publicadas.

---

## 5. Inventario de imágenes que se deben crear

> **Requisito de ejecución:** las imágenes **deben producirse como parte de la implementación**, no dejar espacios blancos, placeholders genéricos ni imágenes de stock que no enseñen el caso de uso. Conservar un mismo criterio fotográfico o ilustrativo por grupo.

| Archivo | Tipo | Formato/relación | Qué debe verse | Prioridad |
| --- | --- | --- | --- | --- |
| `hero-negocio-qr.webp` | Foto/render realista | 5:4 o 4:3; 1600 px de ancho | Mesa o mostrador con QR en contexto, ambiente desenfocado y espacio para UI. | Crítica |
| `paso-escanea.webp` | Ilustración | 4:3; 1000 px | Mano y smartphone escaneando QR. | Alta |
| `paso-responde.webp` | Ilustración | 4:3; 1000 px | Teléfono con encuesta sencilla. | Alta |
| `paso-resultados.webp` | Ilustración | 4:3; 1000 px | Computador con panel y gráficos. | Alta |
| `canal-mesa.webp` | Microescena/render | 4:3; 900 px | Soporte QR sobre mesa. | Alta |
| `canal-mostrador.webp` | Microescena/render | 4:3; 900 px | QR junto a caja y POS. | Alta |
| `canal-cartel.webp` | Microescena/render | 4:3; 900 px | Cartel QR en pared/área de espera. | Alta |
| `canal-tablet.webp` | Microescena/render | 4:3; 900 px | Tablet con encuesta. | Alta |
| `rubro-restaurante.webp` | Foto realista | 4:3; 1200 px | Restaurante reconocible con QR sobre mesa. | Crítica |
| `rubro-cafe.webp` | Foto realista | 4:3; 1200 px | Cafetería reconocible con QR. | Crítica |
| `rubro-comercio.webp` | Foto realista | 4:3; 1200 px | Pequeña tienda con productos/caja y QR. | Crítica |

**Dashboard:** se genera con código y datos DEMO, **no** como imagen AI.  
**Iconos de beneficios:** SVG Lucide, **no** como imagen AI.

### Directrices comunes para generación de imágenes

- Iluminación natural cálida, imagen editorial de negocio local, no fotografía de stock posada.
- Paleta coherente con madera clara, crema, beige, detalles coral.
- El QR debe reconocerse como QR; si se requiere que sea escaneable, **insertar el QR real como overlay SVG/PNG al finalizar la composición**. Un QR generado por IA no es funcional.
- No generar texto, logotipos, nombres de marcas ni números legibles en la foto: agregarlos mediante componentes reales.
- Evitar manos deformadas, pantallas inverosímiles, objetos flotantes y fondos sobrecargados.
- No mostrar personas posando a cámara. Priorizar la interacción natural con el negocio.
- Mantener zonas libres para superposiciones de UI; nunca tapar el elemento QR clave.
- Optimizar WebP/AVIF, usar `sizes` y carga diferida salvo recurso LCP del hero.
- Entregar variantes para móvil cuando el recorte de escritorio oculte el QR.

### Prompts base para las imágenes

**Hero**

> Fotografía editorial realista de un restaurante o cafetería pequeña y acogedora, mesa de madera clara cerca de una ventana, soporte de sobremesa con área blanca para colocar posteriormente un código QR real, un smartphone usado de forma natural por un cliente, profundidad de campo moderada, iluminación cálida suave, acentos coral y crema, composición limpia, espacio negativo a la derecha o arriba para superponer una tarjeta de encuesta de interfaz web, sin texto legible, sin logos, sin marcas de agua, estilo SaaS moderno y cercano, formato horizontal 5:4.

**Trío «Así funciona»**

> Ilustración moderna, minimalista y cálida para landing SaaS, trazos claros y volúmenes suaves, paleta crema, carbón y coral, fondo limpio, consistente con una serie de tres viñetas; escena: [ESCANEAR QR CON SMARTPHONE / RESPONDER ENCUESTA EN MÓVIL / CONSULTAR DASHBOARD EN LAPTOP], sin texto legible, sin logotipos, composición centrada, formato 4:3.

**Mesa / Mostrador / Cartel / Tablet**

> Microescena 3D editorial semirrealista de un pequeño negocio, iluminación de estudio cálida, fondo marfil uniforme, vista tres cuartos, elemento protagonista: [SOPORTE QR SOBRE MESA / QR JUNTO A CAJA / CARTEL QR EN PARED / TABLET CON ENCUESTA], escena simple, pocos objetos, espacio para recorte, misma escala y punto de vista que el resto de la serie, sin texto legible, formato 4:3.

**Restaurante**

> Fotografía editorial realista de restaurante independiente, mesa servida con platos, cubiertos, vasos y pequeño soporte para QR claramente visible sobre la mesa, ambiente de restaurante reconocible al fondo, luz de tarde cálida, composición limpia, sin personas posando, sin texto legible, sin marcas, formato 4:3.

**Café**

> Fotografía editorial realista de cafetería independiente, taza de café recién servido sobre una barra de madera, máquina de espresso o barista desenfocados al fondo, pequeño soporte para QR visible junto al café, luz cálida natural, estética acogedora contemporánea, sin texto legible, sin marcas, formato 4:3.

**Comercio pequeño**

> Fotografía editorial realista de tienda pequeña de barrio, mostrador con productos ordenados, bolsa de compra, terminal de cobro y soporte para QR visible al lado de la caja, estanterías de comercio al fondo, luz cálida, composición ordenada, sin texto legible, sin marcas, formato 4:3.

**Nota:** los prompts son instrucciones de producción para el agente; **no sustituyen la entrega efectiva de los archivos**.

---

## 6. Detalles de conversión: imágenes y UI deben trabajar juntas

- **Hero:** fotografía contextual detrás o al lado, tarjeta real de encuesta encima; no rasterizar la encuesta dentro de la foto.
- **Rubro:** imagen → título → ejemplo de pregunta → breve beneficio.
- **Funcionamiento:** ilustración → verbo/acción → explicación de una o dos líneas.
- **Dashboard:** KPIs y gráficos legibles, no una composición decorativa.
- **CTA:** texto claro y botón verdadero, no texto dibujado.

En todas las secciones, las imágenes deben responder una pregunta concreta del visitante: «¿Dónde está el QR?», «¿Qué hace mi cliente?», «¿Qué veo yo?» o «¿Sirve para mi tipo de local?».

---

## 7. Responsive y accesibilidad

### Escritorio (≥ 1024 px)

- Hero en dos columnas equilibradas (aprox. 50/50 o 55/45).
- Tres tarjetas de «Así funciona» en una fila.
- Cuatro tarjetas de ubicaciones en una fila.
- Tres fotos de rubros en una fila.
- Dashboard ancho, gráficos legibles y sin grandes áreas vacías.

### Tablet (768–1023 px)

- Hero compacto, con fotografía y encuesta bien dimensionadas.
- Cuatro canales en grilla 2 × 2.
- Tres pasos adaptados sin texto comprimido.
- Dashboard con KPIs reorganizados.

### Móvil (≤ 767 px)

- H1, subtítulo, CTA y **luego** escena/encuesta: jerarquía clara.
- Tarjetas en una columna o grilla de dos solo cuando sea realmente legible.
- Botones de ancho cómodo y área táctil ≥44 px.
- Evitar que el elemento QR se pierda al recortar las imágenes.
- Dashboard con KPIs en 2 columnas o una, gráficos con etiquetas legibles, sin scroll horizontal de toda la página.
- FAQ desplegable con pulsación cómoda.

### Accesibilidad y rendimiento

- Contraste mínimo WCAG AA en textos e interacciones.
- Alt significativo para imágenes que comunican un uso; `alt=""` en decoraciones.
- Estados `focus-visible` claros para enlaces, botones, encuesta y acordeones.
- Respetar `prefers-reduced-motion`.
- Usar `next/image` si el proyecto ya está en Next.js; fijar dimensiones para prevenir CLS.
- Priorizar LCP del hero, lazy loading para imágenes posteriores.
- No sacrificar legibilidad por reproducir exactamente el tamaño pequeño de la captura actual.

---

## 8. Orientación de implementación con Next.js y Bootstrap

**Adaptar al stack existente; no migrar de librería sin motivo.**

- Next.js + React.
- Bootstrap para grillas/utilidades si ya está integrado.
- CSS Modules o estilos del sistema existente para detalles visuales; evitar overrides globales indiscriminados.
- Lucide React para iconos.
- Recharts **o** Chart.js para el panel, según dependencias ya instaladas.
- `next/image` para fotografías y renders.

**Componentes recomendados, solo si ayuda a organizar la base actual:**

```text
LandingPage
├── Header
├── HeroSection
│   ├── HeroPhoto
│   └── InteractiveSurveyDemo
├── ValuePropositions
├── HowItWorks
│   └── StepCard × 3
├── QRPlacementSection
│   └── QRPlacementCard × 4
├── BusinessUseCases
│   └── BusinessCard × 3
├── DashboardPreview
│   ├── KPIGrid
│   ├── SatisfactionTrend
│   ├── RatingDistribution
│   └── RecentResponses
├── FAQAccordion
├── FinalCTA
└── Footer
```

### Límites del alcance

- **No** cambiar endpoints, APIs, rutas, autenticación o persistencia sin necesidad.
- **No** eliminar la encuesta demostrativa existente.
- **No** presentar funciones no implementadas como si estuvieran listas.
- **No** inventar testimonios, clientes, resultados de encuestas ni métricas reales.
- Respetar textos legales y enlaces existentes.
- Mantener la navegación y funcionalidades comprobables antes y después.

---

## 9. Orden de trabajo para el agente

1. **Auditar la landing actual:** identificar componentes, rutas, estilos, assets, interacciones y dependencias.
2. **Crear tokens visuales** (colores, tipografía, contenedores, radios, sombras) sin romper estilos globales.
3. **Crear los 11 recursos gráficos del inventario** o dejar registro explícito de cuáles faltaron y por qué; no sustituir con placeholders indefinidos.
4. **Rediseñar el hero:** contexto real, título legible, CTA claro y demo funcional.
5. **Ajustar beneficios y «Así funciona»** con iconos y tres ilustraciones.
6. **Construir tarjetas de canales y rubros** con imágenes específicas y mensajes concretos.
7. **Rediseñar el dashboard demo** con componentes React y un dataset local claramente etiquetado como ficticio.
8. **Mejorar FAQ, CTA final y footer**, respetando enlaces y contenidos existentes.
9. **Validar responsive** en 375, 768, 1024 y 1440 px, además de teclado y contraste.
10. **Hacer una revisión visual final:** capturas comparativas y corrección de desbordes, espacios, recortes, contraste y coherencia visual.

---

## 10. Criterios de aceptación

Marcar como listo **solo si**:

- [ ] La estructura y el orden de secciones originales permanecen reconocibles.
- [ ] En el hero se entiende que la encuesta se usa por QR en un negocio real.
- [ ] La tarjeta de encuesta sigue funcionando y no es parte de una fotografía.
- [ ] Los tres beneficios son legibles sin hacer zoom.
- [ ] «Así funciona» se entiende visualmente con poca lectura.
- [ ] Las cuatro ubicaciones son distinguibles por su imagen.
- [ ] Restaurante, café y comercio muestran escenas realmente diferentes.
- [ ] Las 11 imágenes se han creado, optimizado y enlazado (o documentado faltantes reales).
- [ ] El dashboard refleja claramente el valor de reportes y distingue datos DEMO.
- [ ] Todas las interacciones y enlaces que ya funcionaban siguen funcionando.
- [ ] No existen placeholders, fotografías irrelevantes o textos inventados dentro de imágenes.
- [ ] La página es legible en móvil y escritorio y no tiene scroll horizontal accidental.
- [ ] Se respetan los colores de marca y la consistencia fotográfica/ilustrativa.
- [ ] Las imágenes tienen tamaños definidos, alt adecuado y carga optimizada.
- [ ] Se verificaron al menos las vistas de 375, 768, 1024 y 1440 px.

---

## 11. Instrucción final para OpenCode

> **Trabaja sobre la landing existente de Scan-Say-Done. Mantén la arquitectura, el flujo, el orden de secciones y las funcionalidades. Corrige la falta de impacto comercial mediante mejor jerarquía tipográfica, aprovechamiento del ancho, imágenes contextuales específicas por rubro, escenas de QR en uso y un dashboard de demostración convincente construido con componentes. Produce e integra las imágenes descritas; no dejes tarjetas vacías ni uses iconos genéricos donde se solicita una escena. Prioriza una estética cálida, moderna y profesional, con una implementación responsive, accesible y optimizada. Muestra capturas del resultado en escritorio y móvil.**

