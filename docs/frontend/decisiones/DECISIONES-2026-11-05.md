# Decisiones recomendadas — 2026-11-05

> Cada decisión trae recomendación, razón y evidencia. Las que dependen de datos externos
> quedan marcadas como tales: no se inventan.
> Estado: **propuesta**. Nada se implementa hasta que el operador firme.

---

## D-1. Cuestionario: cinco preguntas en tres pantallas

**Recomendación**: adoptar las cinco preguntas del acuerdo del equipo (2026-11-04) y agruparlas en
tres pantallas.

| Pantalla | Contenido | Obligatorio |
|---|---|---|
| 1 | Satisfacción general 0–10 | Sí |
| 2 | Tres valoraciones 1–5: atención, rapidez, producto | Sí |
| 3 | Comentario libre | No |

**Razón**:
- El modelo de datos del equipo (`fact_encuestas`, P1–P5) y el cálculo de NPS del backend
  (`main.py:82-116`) ya suponen escala 0–10 más atributos y comentario.
- El pipeline de análisis de texto clasifica el comentario: sin P5 se pierde esa capacidad.
- Tres pantallas en vez de cinco reduce el abandono sin recortar datos.

**Riesgo declarado**: el documento de diseño anterior especifica tres preguntas. Queda superado:
se corrige el documento, no el código. Si el equipo prefiere tres, se ajusta antes de construir la
pantalla de encuesta, no después.

**Owner**: PM / equipo. **Bloquea**: etapa E únicamente.

---

## D-2. Roles de color faltantes, derivados y medidos

Los seis tokens aprobados cubren superficie y texto. Faltan diez roles. Estos son los valores
propuestos, todos con contraste calculado con la fórmula WCAG:

| Rol | Valor | Sobre fondo | Sobre blanco | Sobre elevada |
|---|---|---|---|---|
| `interactive-hover` | `#FD6E57` | 2.25 | 2.78 | 2.02 |
| `interactive-pressed` | `#E84A33` | 3.11 | 3.85 | 2.80 |
| `border-strong` | `#1A181B` | 14.28 | 17.64 | 12.82 |
| `border-mid` | `#8A6F55` | 3.79 | 4.68 | 3.40 |
| `border-subtle` (solo decorativo) | `#D9C0A0` | 1.42 | 1.75 | 1.27 |
| `surface-dark` | `#1A181B` | — | — | — |
| `on-dark` | `#F7E5C8` | — | — | 14.28 contra oscura |
| `on-dark-secondary` | `#C9B6A6` | — | — | 9.01 contra oscura |
| `success-text` | `#12603A` | 6.16 | 7.61 | 5.53 |
| `warning-text` | `#6F4700` | 6.59 | 8.15 | 5.92 |
| `error-text` | `#A82E39` | 5.46 | 6.74 | 4.90 |
| `disabled-fill` | `#E6D6C2` | — | — | texto `#5A5555` = 5.15 |

**Reglas que salen de los números**:
- Etiqueta del botón siempre `#1A181B`. Base 5.61 · hover 6.34 · presionado 4.59. Nunca cambia de
  color al presionar.
- Anillo de foco: `#1A181B` sobre superficies claras (12.82 mínimo), `#F7E5C8` sobre superficie
  oscura (14.28). Grosor 3 px con separación de 2 px.
- `border-subtle` no sirve para delimitar controles: solo decoración. Para límites funcionales,
  `border-mid` o `border-strong`.
- Estado nunca solo por color: siempre icono o texto acompañando.

**Owner**: Operador firma. **Coste de cambiar**: bajo, son valores aislados.

---

## D-3. Tipografías: Bebas Neue para títulos, Montserrat para interfaz

**Recomendación**: confirmar ambas, cargadas con `next/font`, subset latino.

**Razón**:
- El logotipo real usa una condensada similar a Bebas en el wordmark; Montserrat aparece en la
  lámina de marca.
- Ambas están en Google Fonts, sin licencia que pagar.
- Bebas tiene una sola altura de uso: solo mayúsculas, solo títulos de 32 px o más.

**Riesgo**: Bebas es pésima para textos largos y para cifras pequeñas. Regla dura: nunca en cuerpo,
nunca en botones, nunca en tablas.

**Owner**: Operador confirma; diseño ya la propuso.

---

## D-4. Panel con barra lateral y tres secciones

**Recomendación**: barra lateral fija de 264 px en escritorio, cajón en pantallas angostas, tres
destinos: Resumen, Respuestas y Mi QR.

**Razón**:
- Tres destinos con jerarquía real no caben en una pantalla única sin mezclar.
- El documento de panel v2 y el plano `12-dashboard` ya están cotados con esa retícula.
- Crecer después a más secciones no obliga a rehacer el armazón.

**Riesgo**: la pantalla única del plano `11-panel` queda descartada. Se deja como histórico.

**Owner**: Operador. **Bloquea**: etapa P.

---

## D-5. QR: aceptar PNG del backend, con condiciones

**Recomendación**: usar el PNG que ya genera el backend, con cuatro condiciones.

| Condición | Motivo |
|---|---|
| Módulos en `#1A181B` sobre blanco | Coral da 2.86 contra blanco: no escanea |
| Margen de silencio de 4 módulos mínimo | Norma de lectura de QR |
| Corrección de errores M o superior | Resiste impresión mediocre |
| Tamaño generado suficiente para 300 dpi | Evita ampliar y perder nitidez |

**Razón**: el backend ya funciona; el vector es una mejora, no un requisito para empezar.

**Deuda**: pedir salida SVG al equipo de backend. Ticket, no bloqueo.

---

## D-6. Ruta de la encuesta: código opaco

**Recomendación**: `/e/[code]`, con código corto no secuencial.

**Razón**: un identificador numérico secuencial permite enumerar encuestas ajenas. Un código opaco
lo impide sin necesidad de autenticación.

**Owner**: Backend define el generador. **Bloquea**: etapa E.

---

## D-7. Un solo camino de escritura: FastAPI

**Recomendación**: que las respuestas entren por la API, no desde el navegador directo a la base.

**Razón**:
- Validación, límite de envíos, descarte de duplicados y anonimización viven en un solo lugar.
- Escribir directo desde el cliente con clave pública abre dos superficies de abuso y salta el
  control de spam que el propio equipo documentó.

**Owner**: Arquitectura + backend. **Es recomendación técnica, no decisión mía.**

---

## D-8. Stack técnico del landing: aprobar lo propuesto

| Tema | Decisión propuesta |
|---|---|
| Animación | CSS puro; sin librería |
| 3D | Profundidad con gradientes y bordes; sin WebGL |
| Iconos | Lucide |
| Imágenes | `next/image`, prioritarias solo las del hero |
| Formularios | Estado nativo de React |
| Gráficos | Barras con CSS, sin librería |
| Tests | Vitest + Playwright + axe |

**Razón**: el presupuesto de rendimiento manda. Cada librería añadida se paga en el primer
segundo de carga, y el público entra desde el teléfono, en un restaurante, con datos móviles.

**Owner**: Operador aprueba; arquitectura ya lo justificó.

---

## D-9. Honestidad de estado

- Toda captura de panel en el sitio público lleva banda `DEMO`.
- El panel propio muestra `DATOS DE EJEMPLO` mientras no haya backend conectado.
- Las páginas legales se construyen, pero quedan `noindex` y fuera del pie hasta tener los datos
  reales.

**Razón**: un estado de éxito o una cifra inventada es un engaño, y además destruye la confianza
que el producto intenta medir.

---

## D-10. Datos que no puedo inventar

| Dato | Owner | Efecto si falta |
|---|---|---|
| Correo de contacto | Operador | Los CTA de contacto no tienen destino |
| Razón social, RUT, domicilio | Operador | Términos y privacidad incompletos |
| Jurisdicción y retención | Operador | No se puede publicar la política |
| Precios y planes | PM | Sección de precios queda oculta |
| Nombre del endpoint de respuestas | Backend | La encuesta no puede enviar |

---

## Orden de arranque propuesto

1. **F0.1** rutas por zona, sin contenido.
2. **F0.2** tokens completos en `@theme`, con los roles de D-2.
3. **F0.3** fuentes de D-3.
4. **F0.4** lint, tipos y tests en CI.
5. **F0.5** configuración y tipos de API.

Después: Landing por secciones, con gate en cada una.
